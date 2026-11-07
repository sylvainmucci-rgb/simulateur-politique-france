# Sovereign — Élysée : Pouvoir & Chaos
Nom provisoire. L'écran Régime, pour la France, porte les ruptures (article 16, article 89, Frexit, nationalisations) avec un coût.
Ouvrir index.html via un serveur (ex. `python3 -m http.server`). Sans paramètre, l'écran d'accueil demande le pays. `?pays=fr` ouvre la France, `?pays=us` les États-Unis, et de même `ru`, `br`, `il`, `ir`, `cn`, `de`, `gb`, `in`. Le temps se règle dans la barre fixe du bas. Ajouter un pays : créer data/xx.js sur le même schéma, l'inclure dans index.html et dans sw.js.
Déployer : tout hébergeur statique (Render Static Site, GitHub Pages, Netlify Drop) — publier le dossier tel quel, sans build.
