// Funktion zum Verarbeiten des Chat Elements
function processChatElement() {
    console.log('Processing chat element');
    const chatElement = document.querySelector('botario-chat');

    if (chatElement && chatElement.shadowRoot) {
        const shadowRoot = chatElement.shadowRoot;

        // Direkt prüfen, ob schon vorhanden
        let container = shadowRoot.querySelector('#chat-container');
        let chatBadge = shadowRoot.querySelector('#chat-badge');
        
        if (container) {
            container.style.zIndex = '9999';
            console.log('Direkt gefunden & z-index gesetzt');
        }
        
        if (chatBadge) {
            chatBadge.click();
            console.log('Chat-Badge geklickt');
        }
        
        if (!container || !chatBadge) {
            // Sonst auf spätere Mutationen warten
            const observer = new MutationObserver((mutations, obs) => {
                if (!container) {
                    container = shadowRoot.querySelector('#chat-container');
                    if (container) {
                        container.style.zIndex = '9999';
                        console.log('Später gefunden & z-index gesetzt');
                    }
                }
                
                if (!chatBadge) {
                    chatBadge = shadowRoot.querySelector('#chat-badge');
                    if (chatBadge) {
                        chatBadge.click();
                        console.log('Chat-Badge später gefunden & geklickt');
                    }
                }
                
                // Beobachtung stoppen wenn beide Elemente gefunden wurden
                if (container && chatBadge) {
                    obs.disconnect();
                }
            });

            observer.observe(shadowRoot, { childList: true, subtree: true });
        }
    } else {
        console.log('botario-chat oder sein Shadow Root existiert noch nicht, warte...');
        console.log('Warte auf botario-chat Element...');
        
        // Kombiniere MutationObserver mit Polling als Fallback
        const chatObserver = new MutationObserver((mutations, obs) => {
            console.log('MutationObserver triggered');
            const chatElement = document.querySelector('botario-chat');
            if (chatElement && chatElement.shadowRoot) {
                console.log('botario-chat Element gefunden!');
                obs.disconnect();
                clearInterval(pollInterval);
                setTimeout(processChatElement, 100);
            }
        });
        
        chatObserver.observe(document.getElementById('widget-container') || document.body, { childList: true, subtree: true });
        
        // Zusätzlich Polling als Fallback
        const pollInterval = setInterval(() => {
            console.log('Polling für botario-chat...');
            const chatElement = document.querySelector('botario-chat');
            if (chatElement && chatElement.shadowRoot) {
                console.log('botario-chat Element per Polling gefunden!');
                chatObserver.disconnect();
                clearInterval(pollInterval);
                setTimeout(processChatElement, 100);
            }
        }, 500);
        
        // Nach 10 Sekunden aufgeben
        setTimeout(() => {
            console.log('Timeout: botario-chat Element nicht gefunden');
            chatObserver.disconnect();
            clearInterval(pollInterval);
        }, 10000);
    }
}

// Sofort ausführen
processChatElement();