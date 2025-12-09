// Script injecté pour ajouter le bouton F11
(function() {
    console.log("iDRAC F11 Plugin: Chargement...");

    // Fonction pour envoyer la touche F11
    function sendF11() {
        console.log("iDRAC F11 Plugin: Envoi de F11 (0xFFC8)...");
        const F11_KEY = 0xFFC8;

        // Tentative 1: Objet UI global (commun dans cette image)
        if (typeof UI !== 'undefined' && typeof UI.rfb !== 'undefined') {
            UI.rfb.sendKey(F11_KEY);
            console.log("iDRAC F11 Plugin: Envoyé via UI.rfb");
            return;
        }

        // Tentative 2: Objet rfb global
        if (typeof rfb !== 'undefined') {
            rfb.sendKey(F11_KEY);
            console.log("iDRAC F11 Plugin: Envoyé via rfb global");
            return;
        }

        // Tentative 3: window.rfb
        if (window.rfb) {
            window.rfb.sendKey(F11_KEY);
            console.log("iDRAC F11 Plugin: Envoyé via window.rfb");
            return;
        }

        alert("Erreur: Impossible de trouver l'objet VNC. La connexion est-elle active ?");
        console.error("iDRAC F11 Plugin: Objet RFB introuvable dans UI, window ou global.");
    }

    // Fonction pour injecter le bouton
    function injectButton() {
        // On cherche un bouton existant pour se placer après
        const targetBtn = document.getElementById('clipboardModalButton') || 
                          document.getElementById('fullscreenToggleButton');

        if (targetBtn && targetBtn.parentNode) {
            console.log("iDRAC F11 Plugin: Barre d'outils trouvée, injection du bouton.");
            
            // Création du bouton avec le même style que les autres
            const btn = document.createElement('button');
            btn.id = "f11BiosButton";
            btn.className = "btn btn-default navbar-btn"; // Classes Bootstrap standard de l'image
            btn.title = "Envoyer F11 (BIOS)";
            btn.style.fontWeight = "bold";
            btn.style.color = "#d9534f"; // Rouge clair pour le distinguer
            btn.innerHTML = '<i class="fa fa-terminal"></i> F11';
            
            // Gestionnaire d'événement
            btn.onclick = function(e) {
                e.preventDefault();
                // Petit effet visuel
                const originalColor = this.style.color;
                this.style.color = "#ffffff";
                setTimeout(() => { this.style.color = originalColor; }, 200);
                
                sendF11();
            };

            // Insertion après le bouton cible
            targetBtn.parentNode.insertBefore(btn, targetBtn.nextSibling);
            return true;
        }
        return false;
    }

    // Boucle d'attente pour s'assurer que l'interface est chargée
    const checkTimer = setInterval(function() {
        if (injectButton()) {
            clearInterval(checkTimer);
        }
    }, 1000);
})();
