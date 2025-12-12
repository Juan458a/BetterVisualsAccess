// Better Visuals License Manager - JavaScript

// Storage key
const STORAGE_KEY = 'bettervisuals_keys';

// Load keys from localStorage
function loadKeys() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
}

// Save keys to localStorage
function saveKeys(keys) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
}

// Generate random API key
function generateApiKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segments = [];
    
    for (let s = 0; s < 3; s++) {
        let segment = '';
        for (let i = 0; i < 4; i++) {
            segment += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        segments.push(segment);
    }
    
    return 'BV-' + segments.join('-');
}

// Render keys table
function renderTable() {
    const keys = loadKeys();
    const tbody = document.getElementById('keysTableBody');
    const emptyMessage = document.getElementById('emptyMessage');
    const table = document.getElementById('keysTable');
    
    tbody.innerHTML = '';
    
    const keyList = Object.keys(keys);
    
    if (keyList.length === 0) {
        emptyMessage.style.display = 'block';
        table.style.display = 'none';
        return;
    }
    
    emptyMessage.style.display = 'none';
    table.style.display = 'table';
    
    keyList.forEach((apiKey) => {
        const keyData = keys[apiKey];
        const tr = document.createElement('tr');
        
        // Check if expired
        const isExpired = new Date(keyData.expires) < new Date();
        if (isExpired) {
            tr.classList.add('expired');
        }
        
        // Features badges
        const featuresBadges = keyData.features.map(f => {
            const isPremium = f === 'unlimited';
            return `<span class="feature-badge ${isPremium ? 'premium' : ''}">${f}</span>`;
        }).join('');
        
        tr.innerHTML = `
            <td><code class="key-code">${escapeHtml(apiKey)}</code></td>
            <td><strong>${escapeHtml(keyData.user)}</strong></td>
            <td><div class="features-cell">${featuresBadges}</div></td>
            <td class="${isExpired ? 'expired-date' : ''}">${keyData.expires}</td>
            <td class="actions-cell">
                <button class="btn btn-secondary btn-small" onclick="copyKeyToClipboard('${apiKey}')">[Copy]</button>
                <button class="btn btn-secondary btn-small" onclick="editKey('${apiKey}')">[Edit]</button>
                <button class="btn btn-danger btn-small" onclick="deleteKey('${apiKey}')">[Del]</button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Escape HTML to prevent XSS
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Add key form handler
document.getElementById('addKeyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userName = document.getElementById('userName').value.trim();
    const expiresDate = document.getElementById('expiresDate').value;
    const hasUnlimited = document.getElementById('featUnlimited').checked;
    
    if (!userName || !expiresDate) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    const keys = loadKeys();
    
    // Generate unique key
    let newKey = generateApiKey();
    while (keys[newKey]) {
        newKey = generateApiKey();
    }
    
    // Build features array
    const features = ['fov', 'freecam', 'zoom'];
    if (hasUnlimited) {
        features.push('unlimited');
    }
    
    // Add new key
    keys[newKey] = {
        user: userName,
        features: features,
        expires: expiresDate
    };
    
    saveKeys(keys);
    renderTable();
    
    // Show generated key
    document.getElementById('generatedKeyText').textContent = newKey;
    document.getElementById('generatedKeySection').style.display = 'block';
    
    // Reset form
    this.reset();
    
    // Set default expiry date to 1 year from now
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    document.getElementById('expiresDate').value = nextYear.toISOString().split('T')[0];
    
    showNotification('Cle generee !');
});

// Copy generated key
function copyKey() {
    const key = document.getElementById('generatedKeyText').textContent;
    navigator.clipboard.writeText(key).then(() => {
        showNotification('Cle copiee !');
    });
}

// Copy key from table
function copyKeyToClipboard(key) {
    navigator.clipboard.writeText(key).then(() => {
        showNotification('Cle copiee !');
    });
}

// Edit key
function editKey(apiKey) {
    const keys = loadKeys();
    const keyData = keys[apiKey];
    
    document.getElementById('editKey').value = apiKey;
    document.getElementById('editUserName').value = keyData.user;
    document.getElementById('editExpiresDate').value = keyData.expires;
    document.getElementById('editFeatUnlimited').checked = keyData.features.includes('unlimited');
    
    document.getElementById('editModal').classList.add('active');
}

// Edit form handler
document.getElementById('editKeyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const apiKey = document.getElementById('editKey').value;
    const userName = document.getElementById('editUserName').value.trim();
    const expiresDate = document.getElementById('editExpiresDate').value;
    const hasUnlimited = document.getElementById('editFeatUnlimited').checked;
    
    const features = ['fov', 'freecam', 'zoom'];
    if (hasUnlimited) {
        features.push('unlimited');
    }
    
    const keys = loadKeys();
    
    keys[apiKey] = {
        user: userName,
        features: features,
        expires: expiresDate
    };
    
    saveKeys(keys);
    renderTable();
    closeModal();
    
    showNotification('Cle modifiee !');
});

// Close modal
function closeModal() {
    document.getElementById('editModal').classList.remove('active');
}

// Delete key
function deleteKey(apiKey) {
    if (!confirm('Supprimer cette cle ?')) return;
    
    const keys = loadKeys();
    delete keys[apiKey];
    saveKeys(keys);
    renderTable();
    
    showNotification('Cle supprimee !');
}

// Clear all keys
function clearAll() {
    if (!confirm('Supprimer TOUTES les cles ?')) return;
    
    saveKeys({});
    renderTable();
    document.getElementById('generatedKeySection').style.display = 'none';
    
    showNotification('Toutes les cles supprimees !');
}

// Export to JSON
function exportJSON() {
    const keys = loadKeys();
    
    const exportData = {
        version: "1.0",
        plugin: "Better Visuals",
        updated: new Date().toISOString(),
        keys: keys
    };
    
    const json = JSON.stringify(exportData, null, 2);
    downloadFile(json, 'access.json', 'application/json');
    
    showNotification('JSON exporte !');
}

// Download file helper
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
}

// Copy URL to clipboard
function copyUrl() {
    const url = 'https://juan458a.github.io/BetterVisualsAccess/data/access.json';
    navigator.clipboard.writeText(url).then(() => {
        showNotification('URL copiee !');
    });
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #00d4ff, #0099cc);
        color: #000;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Close modal on outside click
document.getElementById('editModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderTable();
    
    // Set default expiry date to 1 year from now
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    document.getElementById('expiresDate').value = nextYear.toISOString().split('T')[0];
});
