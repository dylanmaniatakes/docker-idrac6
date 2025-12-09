#!/bin/sh

# Script d'initialisation pour injecter le bouton F11
# Ce script est execute par s6-overlay au demarrage du conteneur

NOVNC_DIR="/opt/novnc"
INDEX_FILE="$NOVNC_DIR/index.html"
JS_FILE="$NOVNC_DIR/f11-injector.js"
SOURCE_JS="/opt/install/f11-injector.js"

echo "[F11-Plugin] Debut de l'installation..."

# 1. Copier le script JS au bon endroit
if [ -f "$SOURCE_JS" ]; then
    cp "$SOURCE_JS" "$JS_FILE"
    chmod 644 "$JS_FILE"
    echo "[F11-Plugin] Script JS copie vers $JS_FILE"
else
    echo "[F11-Plugin] ERREUR: Fichier source $SOURCE_JS introuvable !"
    exit 0
fi

# 2. Modifier index.html
if [ -f "$INDEX_FILE" ]; then
    # Verifier si deja injecte
    if grep -q "f11-injector.js" "$INDEX_FILE"; then
        echo "[F11-Plugin] Deja installe dans index.html."
    else
        # Injection propre avant la fermeture du body
        sed -i 's|</body>|    <script src="f11-injector.js"></script>\n</body>|' "$INDEX_FILE"
        echo "[F11-Plugin] Balise script injectee dans $INDEX_FILE"
    fi
else
    echo "[F11-Plugin] ERREUR: $INDEX_FILE introuvable !"
fi
