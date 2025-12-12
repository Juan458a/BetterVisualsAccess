# Better Visuals - License Manager

Site GitHub Pages pour gerer les licences du plugin Better Visuals.

## URLs

- **Site Web** : https://juan458a.github.io/BetterVisualsAccess/
- **Donnees JSON** : https://juan458a.github.io/BetterVisualsAccess/data/access.json

## Structure

```
docs/
 index.html      # Page principale
 style.css       # Styles
 script.js       # Logique JavaScript
 data/
     access.json # Cles de licence
```

## Systeme de Cle API

Chaque utilisateur recoit une cle unique au format :
```
BV-XXXX-XXXX-XXXX
```

L'utilisateur entre cette cle dans le menu Better Visuals du jeu.

## Deploiement

1. Push ce depot sur GitHub
2. Aller dans Settings > Pages
3. Source : "Deploy from a branch"
4. Branch : `main` / `/ (root)`
5. Save

## Utilisation

### Creer une cle :
1. Ouvrir le site web
2. Entrer le nom d'utilisateur et la date d'expiration
3. Cocher "Unlimited FreeCam" si necessaire
4. Cliquer "Generer la cle"
5. Donner la cle a l'utilisateur

### Deployer les cles :
1. Cliquer "Exporter JSON"
2. Remplacer `docs/data/access.json` avec le fichier exporte
3. Commit et push

## Format JSON

```json
{
  "version": "1.0",
  "plugin": "Better Visuals",
  "updated": "2024-01-01T00:00:00.000Z",
  "keys": {
    "BV-XXXX-XXXX-XXXX": {
      "user": "nom_utilisateur",
      "features": ["fov", "freecam", "zoom", "unlimited"],
      "expires": "2025-12-31"
    }
  }
}
```

## Fonctionnalites

| Feature | Description | Inclus |
|---------|-------------|--------|
| `fov` | Slider FOV | Toujours |
| `freecam` | FreeCam (10m) | Toujours |
| `zoom` | Zoom molette | Toujours |
| `unlimited` | FreeCam illimitee | Premium |

## Credits

K0ZAH, flo, sNeyZz

