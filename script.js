// Better Visuals Access Manager - JavaScript

// Storage key
const STORAGE_KEY = 'bettervisuals_users';

// Load users from localStorage
function loadUsers() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// Save users to localStorage
function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

// Encode IP to Base64
function encodeBase64(str) {
    return btoa(str);
}

// Decode Base64 to IP
function decodeBase64(str) {
    try {
        return atob(str);
    } catch {
        return str;
    }
}

// Render users table
function renderTable() {
    const users = loadUsers();
    const tbody = document.getElementById('usersTableBody');
    const emptyMessage = document.getElementById('emptyMessage');
    const table = document.getElementById('usersTable');
    
    tbody.innerHTML = '';
    
    if (users.length === 0) {
        emptyMessage.style.display = 'block';
        table.style.display = 'none';
        return;
    }
    
    emptyMessage.style.display = 'none';
    table.style.display = 'table';
    
    users.forEach((user, index) => {
        const tr = document.createElement('tr');
        
        // Features badges
        const featuresBadges = user.features.map(f => 
            `<span class="feature-badge">${f}</span>`
        ).join('');
        
        tr.innerHTML = `
            <td><strong>${escapeHtml(user.user_id)}</strong></td>
            <td class="ip-cell" title="${escapeHtml(user.ip_base64)}">${escapeHtml(user.ip_base64.substring(0, 20))}...</td>
            <td><div class="features-cell">${featuresBadges}</div></td>
            <td class="actions-cell">
                <button class="btn btn-secondary btn-small" onclick="editUser(${index})">??</button>
                <button class="btn btn-danger btn-small" onclick="deleteUser(${index})">???</button>
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

// Add user form handler
document.getElementById('addUserForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userId = document.getElementById('userId').value.trim();
    const userIp = document.getElementById('userIp').value.trim();
    
    // Get selected features
    const features = [];
    if (document.getElementById('featFov').checked) features.push('fov');
    if (document.getElementById('featFreecam').checked) features.push('freecam');
    if (document.getElementById('featUnlimited').checked) features.push('unlimited');
    if (document.getElementById('featZoom').checked) features.push('zoom');
    
    if (!userId || !userIp) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    const users = loadUsers();
    
    // Check if user already exists
    if (users.some(u => u.user_id.toLowerCase() === userId.toLowerCase())) {
        alert('Cet utilisateur existe déjà');
        return;
    }
    
    // Add new user
    users.push({
        user_id: userId,
        ip_base64: encodeBase64(userIp),
        features: features
    });
    
    saveUsers(users);
    renderTable();
    
    // Reset form
    this.reset();
    document.getElementById('featFov').checked = true;
    document.getElementById('featFreecam').checked = true;
    document.getElementById('featZoom').checked = true;
    
    showNotification('Utilisateur ajouté !');
});

// Edit user
function editUser(index) {
    const users = loadUsers();
    const user = users[index];
    
    document.getElementById('editIndex').value = index;
    document.getElementById('editUserId').value = user.user_id;
    document.getElementById('editUserIp').value = decodeBase64(user.ip_base64);
    
    document.getElementById('editFeatFov').checked = user.features.includes('fov');
    document.getElementById('editFeatFreecam').checked = user.features.includes('freecam');
    document.getElementById('editFeatUnlimited').checked = user.features.includes('unlimited');
    document.getElementById('editFeatZoom').checked = user.features.includes('zoom');
    
    document.getElementById('editModal').classList.add('active');
}

// Edit form handler
document.getElementById('editUserForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const index = parseInt(document.getElementById('editIndex').value);
    const userId = document.getElementById('editUserId').value.trim();
    const userIp = document.getElementById('editUserIp').value.trim();
    
    const features = [];
    if (document.getElementById('editFeatFov').checked) features.push('fov');
    if (document.getElementById('editFeatFreecam').checked) features.push('freecam');
    if (document.getElementById('editFeatUnlimited').checked) features.push('unlimited');
    if (document.getElementById('editFeatZoom').checked) features.push('zoom');
    
    const users = loadUsers();
    
    users[index] = {
        user_id: userId,
        ip_base64: encodeBase64(userIp),
        features: features
    };
    
    saveUsers(users);
    renderTable();
    closeModal();
    
    showNotification('Utilisateur modifié !');
});

// Close modal
function closeModal() {
    document.getElementById('editModal').classList.remove('active');
}

// Delete user
function deleteUser(index) {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    
    const users = loadUsers();
    users.splice(index, 1);
    saveUsers(users);
    renderTable();
    
    showNotification('Utilisateur supprimé !');
}

// Clear all users
function clearAll() {
    if (!confirm('Supprimer TOUS les utilisateurs ?')) return;
    
    saveUsers([]);
    renderTable();
    
    showNotification('Tous les utilisateurs supprimés !');
}

// Export to JSON
function exportJSON() {
    const users = loadUsers();
    
    const exportData = {
        version: "1.0",
        plugin: "Better Visuals",
        updated: new Date().toISOString(),
        users: users
    };
    
    const json = JSON.stringify(exportData, null, 2);
    downloadFile(json, 'access.json', 'application/json');
    
    showNotification('JSON exporté !');
}

// Export to CSV
function exportCSV() {
    const users = loadUsers();
    
    let csv = 'user_id,ip_base64,features\n';
    
    users.forEach(user => {
        csv += `"${user.user_id}","${user.ip_base64}","${user.features.join(';')}"\n`;
    });
    
    downloadFile(csv, 'access.csv', 'text/csv');
    
    showNotification('CSV exporté !');
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
        showNotification('URL copiée !');
    });
}

// Show notification
function showNotification(message) {
    // Create notification element
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
});
