# Better Visuals - Access Manager

Site GitHub Pages pour gérer les droits d'accès du plugin Better Visuals.

## ?? URLs

- **Site Web** : https://juan458a.github.io/BetterVisualsAccess/
- **Données JSON** : https://juan458a.github.io/BetterVisualsAccess/data/access.json

## ?? Structure

```
docs/
??? index.html      # Page principale
??? style.css       # Styles
??? script.js       # Logique JavaScript
??? data/
    ??? access.json # Données des utilisateurs
```

## ?? Déploiement

1. Push ce dépôt sur GitHub
2. Aller dans Settings ? Pages
3. Source : "Deploy from a branch"
4. Branch : `main` / `docs`
5. Save

## ?? Utilisation

1. Ouvrir le site web
2. Ajouter des utilisateurs avec leur IP et fonctionnalités
3. Cliquer "Exporter JSON"
4. Remplacer `docs/data/access.json` avec le fichier exporté
5. Commit et push

## ?? Format JSON

```json
{
  "version": "1.0",
  "plugin": "Better Visuals",
  "updated": "2024-01-01T00:00:00.000Z",
  "users": [
    {
      "user_id": "nom_utilisateur",
      "ip_base64": "IP_EN_BASE64",
      "features": ["fov", "freecam", "unlimited", "zoom"]
    }
  ]
}
```

## ?? Fonctionnalités disponibles

| Feature | Description |
|---------|-------------|
| `fov` | Accès au slider FOV |
| `freecam` | Accès à la FreeCam (10m) |
| `unlimited` | FreeCam sans limite de distance |
| `zoom` | Zoom avec la molette |

## ?? Credits

K0ZAH, flo, sNeyZz
