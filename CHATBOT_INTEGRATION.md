# 🤖 Intégration du Chatbot i-Ecosystem

## 📋 Vue d'ensemble

Le chatbot intelligent de l'écosystème i est maintenant intégré dans i-collect-showcase. Il permet aux visiteurs de poser des questions sur i-collect, i-ticket et tous les services de l'écosystème.

## ✨ Fonctionnalités

- **Bouton flottant** en bas à droite avec badge de notification
- **Interface glassmorphism** qui s'intègre parfaitement au design Apple
- **Réponses intelligentes** alimentées par Google Gemini 2.5 Flash
- **Recherche sémantique** dans 62 documents de documentation
- **Suggestions rapides** pour guider les utilisateurs
- **Indicateur de frappe** pour une expérience humaine
- **Mode responsive** pour mobile et desktop

## 🏗️ Architecture

```
i-collect-showcase/
├── css/
│   └── chatbot.css          # Styles du chatbot
├── js/
│   └── chatbot.js            # Logique JavaScript
└── index.html                # Intégration dans la page
```

Backend :
```
i-chatbot/ (serveur séparé)
├── src/
│   ├── server.js             # API Express sur port 3002
│   ├── services/
│   │   ├── aiService.js      # Google Gemini
│   │   ├── docsIndexer.js    # Indexation docs
│   │   └── chatService.js    # Orchestration
│   └── config/               # Configuration
└── data/
    └── docs-index.json       # Index des 62 documents
```

## 🚀 Démarrage

### 1. Démarrer le serveur i-chatbot

```bash
cd ../i-chatbot
node src/server.js > server.log 2>&1 &
```

Le serveur démarre sur `http://localhost:3002`

### 2. Ouvrir i-collect-showcase

```bash
# Option A : Serveur HTTP simple
python3 -m http.server 8080

# Option B : Live Server (VSCode)
# Clic droit sur index.html > Open with Live Server
```

### 3. Tester le chatbot

1. Ouvrez http://localhost:8080 dans votre navigateur
2. Cliquez sur le bouton flottant bleu en bas à droite
3. Le chatbot s'ouvre avec un message de bienvenue
4. Posez une question, par exemple :
   - "Qu'est-ce que i-collect ?"
   - "Comment fonctionne i-ticket ?"
   - "Quels sont les avantages ?"

## 🎨 Personnalisation

### Modifier les couleurs

Dans `css/chatbot.css`, changez les gradients :

```css
background: linear-gradient(135deg, #00d9d9 0%, #0066cc 100%);
```

### Changer les suggestions rapides

Dans `js/chatbot.js`, modifiez :

```javascript
<div class="suggestion-chip" data-message="Votre question">
    Votre texte
</div>
```

### Modifier l'URL de l'API

Dans `js/chatbot.js` :

```javascript
this.apiUrl = 'http://localhost:3002/api/chat';
// En production : 'https://votre-domaine.com/api/chat'
```

## 🌐 Déploiement Production

### 1. Déployer le backend i-chatbot

**Option A : Vercel**
```bash
cd ../i-chatbot
vercel --prod
```

**Option B : Railway**
```bash
cd ../i-chatbot
railway up
```

Notez l'URL de déploiement (ex: `https://i-chatbot.vercel.app`)

### 2. Mettre à jour l'URL dans le frontend

Dans `js/chatbot.js` :

```javascript
this.apiUrl = 'https://i-chatbot.vercel.app/api/chat';
```

### 3. Déployer i-collect-showcase

**Sur Netlify (déjà configuré)**
```bash
git add .
git commit -m "Add chatbot integration"
git push origin main
```

Netlify redéployera automatiquement.

## 🔧 Maintenance

### Réindexer la documentation

Si vous modifiez les fichiers `.md` :

```bash
cd ../i-chatbot
npm run index
```

Puis redémarrez le serveur.

### Consulter les logs

```bash
cd ../i-chatbot
tail -f logs/combined.log   # Tous les logs
tail -f logs/error.log       # Erreurs uniquement
```

### Arrêter le serveur

```bash
lsof -ti:3002 | xargs kill -9
```

## 📊 Statistiques

Consultez les stats du chatbot :

```bash
curl http://localhost:3002/api/stats
```

Réponse :
```json
{
  "totalDocs": 62,
  "categories": {
    "i-ticket": 29,
    "i-collect": 25,
    "i-model": 4,
    "écosystème": 1,
    "i-carte": 1,
    "général": 2
  },
  "initialized": true
}
```

## 🐛 Dépannage

### Le chatbot ne s'affiche pas

1. Vérifiez que les fichiers existent :
   ```bash
   ls css/chatbot.css
   ls js/chatbot.js
   ```

2. Ouvrez la console du navigateur (F12)
3. Vérifiez les erreurs

### Le chatbot ne répond pas

1. Vérifiez que le serveur tourne :
   ```bash
   curl http://localhost:3002/health
   ```

2. Si erreur, redémarrez :
   ```bash
   lsof -ti:3002 | xargs kill -9
   cd ../i-chatbot
   node src/server.js > server.log 2>&1 &
   ```

### Erreur CORS

Si déployé sur des domaines différents, ajoutez dans `i-chatbot/src/server.js` :

```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://i-collect-showcase.netlify.app');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
```

## 🎯 Prochaines Étapes

- [ ] Ajouter le support multilingue (wolof)
- [ ] Intégrer des analytics
- [ ] Ajouter des boutons rapides dynamiques
- [ ] Permettre l'upload de fichiers/images
- [ ] Intégrer avec WhatsApp Business

## 📞 Support

Pour toute question, consultez :
- `../i-chatbot/README.md` - Documentation complète du backend
- `../i-chatbot/docs/META_VERIFICATION_GUIDE.md` - Guide WhatsApp

---

**Développé avec ❤️ pour l'écosystème i 🇸🇳**
