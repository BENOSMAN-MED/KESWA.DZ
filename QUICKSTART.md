# 🚀 KASWA - Guide Démarrage Rapide

## ⚡ Démarrer le Projet en 2 Minutes

### 1. Frontend (React/Vite)
```bash
cd "Marketplace KASWA"
npm install
npm run dev
```
**URL**: http://localhost:5173

### 2. Backend (Laravel)
```bash
cd backend
composer install
php artisan migrate
php artisan serve
```
**URL**: http://localhost:8000

---

## 🎬 QUICKSTART - Tester les Features

### 📊 Vue d'Ensemble Globale
1. Allez à: **http://localhost:5173/demo**
2. Consultez les 3 systèmes principaux
3. Cliquez sur les cartes pour tester chaque feature

### 💳 Tester les PAIEMENTS (3 Méthodes)
1. Route: **http://localhost:5173/payment-test**
2. Vous verrez 3 cartes:
   - 📱 Barid Mobile
   - 🏦 CCP / e-CCP
   - 💳 Carte CIB/VISA
3. Cliquez sur une carte pour ouvrir la modale
4. Suivez les 3 étapes (Formulaire → Confirmation → Succès)

**Données test**:
```
Barid Mobile:
- Téléphone: 0661 234 567
- PIN: 1234

CCP/e-CCP:
- Compte: 001 000 123456 50
- Titulaire: Votre Nom
- Code: 4567

Carte CIB/VISA:
- Numéro: 4532 1234 5678 9010
- Exp: 12/25
- CVV: 789
```

### 💬 Tester la MESSAGERIE
1. Route: **http://localhost:5173/messages**
2. Vous verrez:
   - Liste de conversations (sidebar gauche)
   - Interface chat (main area)
   - Unread badges rouge
3. Cliquez sur une conversation pour l'ouvrir
4. Écrivez un message et envoyez

### ⭐ Tester les ÉVALUATIONS
1. Route: **http://localhost:5173/evaluation-test**
2. Vous verrez liste de réservations:
   - **À évaluer** (badge bleu) - Cliquez "Évaluer"
   - **Évaluées** (étoiles visibles)
3. Étapes dans la modale:
   - Sélectionnez une note (1-5 étoiles) ⭐
   - Ajoutez un commentaire optionnel (max 200)
   - Confirmez l'envoi
   - Succès screen avec auto-close

---

## 🔐 Tester l'Authentification

### Créer un compte
1. Allez à: http://localhost:5173/inscription
2. Remplissez le formulaire
3. Cliquez "S'inscrire"

### Se connecter
1. Allez à: http://localhost:5173/connexion
2. Utilisez vos identifiants
3. Cliquez "Se connecter"

### Changer de rôle (Dev only)
```javascript
// Dans console (F12):
localStorage.setItem('user', JSON.stringify({
  id: 1,
  name: "Test User",
  role: "owner" // ou "renter" ou "admin"
}));
// Rechargez la page
```

---

## 📱 Tester Responsive

### Chrome DevTools
1. Appuyez sur **F12**
2. Cliquez **Ctrl+Shift+M** (Toggle mobile)
3. Essayez différentes résolutions:
   - Mobile: 375x667
   - Tablet: 768x1024
   - Desktop: 1920x1080

### Modales
- Elles doivent s'adapter fullscreen < 640px
- Padding/spacing doivent rester cohérents
- Boutons clickables (min 44px)

---

## 🎨 Couleurs & Thème

### Palette KASWA
```css
/* Copier-coller dans console */
--kaswa-primary: #1B4D3E;    /* Vert foncé */
--kaswa-accent: #C9924A;     /* Or */
--kaswa-bg: #FAF6EF;         /* Beige clair */
--kaswa-success: #10B981;    /* Vert */
--kaswa-error: #EF4444;      /* Rouge */
```

### Utilisation dans Tailwind
```jsx
// Exemple
<div className="bg-[#1B4D3E] text-white"> 
  {/* Fond vert KASWA */}
</div>
```

---

## 🧪 Checklist Démonstration

### Avant de montrer au prof:
- [ ] Frontend compilé sans erreurs
- [ ] Backend migrations appliquées
- [ ] Both servers running (5173 + 8000)
- [ ] Page `/demo` s'affiche bien
- [ ] Paiement: 3 modales visibles et fonctionnelles
- [ ] Messagerie: interface chat responsive
- [ ] Évaluation: modale 3 étapes testée
- [ ] Navbar: lien "📊 Démo" visible
- [ ] Responsive: mobilview testé
- [ ] Pas de console errors (F12)

---

## 🐛 Debugging

### Voir les erreurs
1. Appuyez **F12** (DevTools)
2. Onglet **Console** pour JS errors
3. Onglet **Network** pour API calls
4. Onglet **Application** > LocalStorage pour tokens

### API Debug
```javascript
// Dans console:
axios.defaults.baseURL // Voir l'URL
axios.defaults.headers.common['Authorization'] // Voir token
```

### Reset Local Storage (Logout forcé)
```javascript
localStorage.clear()
sessionStorage.clear()
location.reload()
```

---

## 📊 Fichiers Clés pour Soutenance

### À montrer au jury:
```
📁 Marketplace KASWA/
├── src/app/
│   ├── components/
│   │   ├── PaiementModal.tsx        ⭐ Paiements
│   │   ├── EvaluationModal.tsx      ⭐ Évaluations
│   │   └── ...
│   ├── pages/
│   │   ├── PaymentTestPage.tsx      ⭐ Test paiements
│   │   ├── EvaluationTestPage.tsx   ⭐ Test évaluations
│   │   ├── MessagesPage.tsx         ⭐ Messagerie
│   │   ├── DemoPage.tsx             ⭐ Overview global
│   │   └── ...
│   └── routes.tsx                   (Toutes les routes)
│
├── EVALUATION_SYSTEM_IMPLEMENTATION.md  📝 Doc évaluations
├── PROJECT_STATUS_THESIS.md             📝 Vue globale
└── QUICKSTART.md                        📝 Ce fichier

📁 backend/
├── app/Models/
│   ├── Evaluation.php
│   ├── Paiement.php
│   └── Message.php
├── database/migrations/
│   └── (Migrations pour les 3 tables)
└── ...
```

---

## 💡 Tips & Tricks

### Personnaliser la démo
```jsx
// Dans EvaluationTestPage.tsx, ligne ~10
const [reservations] = useState([
  {
    // Modifiez ces données test
    id: 1,
    tenueTitre: "Votre tenue personnalisée",
    proprietaireNom: "Votre nom",
    // ...
  }
])
```

### Changer couleurs
```jsx
// Dans composants, remplacez:
bg-[#1B4D3E]   // Vert par votre couleur
bg-[#C9924A]   // Or par votre couleur
bg-[#FAF6EF]   // Beige par votre couleur
```

### Ajouter plus de données test
```jsx
// Dans PaymentTestPage.tsx
const testAmount = 2000; // DA
const testCaution = 500; // DA
// Modifiez ces valeurs pour tester
```

---

## 🚨 Problèmes Courants

### ❌ "Module not found: @vitejs/plugin-react"
```bash
npm install
npm run dev
```

### ❌ "Cannot GET /api/..."
```
Assurez-vous que le backend tourne:
cd backend && php artisan serve
```

### ❌ CORS errors
```
Le .env backend doit avoir:
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### ❌ Blanc screen après build
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### ❌ Messages "Loading..." infini
Vérifier Network tab (F12) pour voir les erreurs API

---

## 📈 Performance Tips

### Pour démo smoothe:
- [ ] Fermer autres apps lourdes
- [ ] Utiliser Chrome ou Edge (mieux que Firefox)
- [ ] Network: "No throttling" en Dev mode
- [ ] Cache: Disabled en Dev mode (F12 settings)

### Build optimisé pour prod:
```bash
npm run build
# Dist folder prêt pour hosting
```

---

## 🔗 Liens Utiles

| Page | URL |
|------|-----|
| 🏠 Home | http://localhost:5173/ |
| 📊 Démo globale | http://localhost:5173/demo |
| 💳 Test Paiements | http://localhost:5173/payment-test |
| 💬 Messagerie | http://localhost:5173/messages |
| ⭐ Test Évaluations | http://localhost:5173/evaluation-test |
| 📱 Catalogue | http://localhost:5173/catalogue |
| 🔐 Login | http://localhost:5173/connexion |
| ✍️ Register | http://localhost:5173/inscription |

---

## ✅ Avant de Livrer

### Frontend
```bash
cd "Marketplace KASWA"
npm run build  # Pas d'erreurs?
npm run preview  # Testé?
```

### Backend
```bash
cd backend
php artisan migrate:fresh --seed  # BDD reset
php artisan serve  # Running?
```

### Documentation
- [x] README.md dans chaque dossier
- [x] Comments dans code complexe
- [x] File: PROJECT_STATUS_THESIS.md
- [x] File: EVALUATION_SYSTEM_IMPLEMENTATION.md

---

## 🎓 Pour la Soutenance

### Scénario de démo (15 mins)

**5 mins**: Vue globale
1. Montrez `/demo`
2. Expliquez les 3 systèmes
3. Montrez le diagramme flux utilisateur

**5 mins**: Paiements
1. Allez à `/payment-test`
2. Testez les 3 méthodes (Barid → CCP → Carte)
3. Montrez les validations

**3 mins**: Messagerie + Évaluations  
1. Ouvrez `/messages` → Montrez chat
2. Allez à `/evaluation-test` → Testez une évaluation
3. Montrez les 3 étapes (Note → Comment → Succès)

**2 mins**: Code & Architecture
1. Montrez la structure de fichiers
2. Ouvrez EvaluationModal.tsx
3. Montrez les types TypeScript

---

## 📞 Support

Si vous avez des questions:
1. Vérifiez console (F12) pour erreurs
2. Consultez `PROJECT_STATUS_THESIS.md`
3. Consultez `EVALUATION_SYSTEM_IMPLEMENTATION.md`
4. Testez sur `/demo` ou pages de test

---

**🎉 Bon courage pour la soutenance!**

Version: 1.0  
Last updated: 2025
