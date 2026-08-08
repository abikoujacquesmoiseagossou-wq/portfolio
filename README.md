# Portfolio — ABIKOU Jacques Moïse Agossou

Site portfolio personnel (HTML / CSS / JavaScript).

**URL Vercel (cible) :** https://portfolio-jack-4640.vercel.app/  
**Repo :** https://github.com/abikoujacquesmoiseagossou-wq/portfolio

## Action urgente — rendre le site public

Actuellement le déploiement Vercel renvoie vers une page **Login**. Sans la désactiver, personne ne peut voir le portfolio.

### Option A — Vercel (recommandé)

1. Connecte-toi sur [vercel.com](https://vercel.com) (compte `jack-4640`)
2. Ouvre le projet **portfolio**
3. Va dans **Settings → Deployment Protection**
4. Pour **Production**, mets la protection sur **Disabled / Off**
5. Enregistre, attends le redéploiement si besoin
6. Ouvre en navigation privée : https://portfolio-jack-4640.vercel.app/

Lien direct (après login) :  
https://vercel.com/jack-4640/portfolio/settings/deployment-protection

### Option B — GitHub Pages (plan B si Vercel reste bloqué)

1. Sur GitHub → repo **portfolio** → **Settings → Pages**
2. **Source** : Deploy from a branch
3. Branch **main** / folder **/ (root)** → Save
4. Attends 1–2 min, puis ouvre :  
   https://abikoujacquesmoiseagossou-wq.github.io/portfolio/

## Contenu

| Fichier | Rôle |
|---------|------|
| `index.html` | Page principale |
| `cv.html` | CV imprimable |
| `style.css` / `script.js` | Styles et interactions |
| `assets/profile.jpg` | Photo de profil |
| `assets/favicon.svg` | Favicon |
| `robots.txt` / `sitemap.xml` | SEO |
| `vercel.json` | Config Vercel (`cleanUrls`) |

## Formulaire de contact

Le formulaire utilise [FormSubmit](https://formsubmit.co/) → `jacquesabikou58@gmail.com`.

1. Une fois le site **public**, envoie un message test
2. Ouvre l’e-mail FormSubmit de **confirmation** (premier envoi uniquement)
3. Clique sur le lien d’activation — ensuite les messages arriveront normalement

## LinkedIn

Le site pointe vers :  
https://www.linkedin.com/in/jacquesmoiseabikou-abikou/

Vérifie que c’est bien ton profil. Sinon, remplace l’URL dans `index.html` et `cv.html`.

## Développement local

```bash
npx serve .
```

Ou ouvre simplement `index.html` dans le navigateur.

## Licence

Usage personnel — ABIKOU Jacques Moïse Agossou.
