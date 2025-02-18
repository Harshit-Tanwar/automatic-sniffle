console.log("Email Writer Extension Loaded");
function createAIButton() {
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.marginRight = '8px';
    button.style = 'border-radius:50px';
    button.innerHTML = 'AI Reply';
    button.setAttribute('role','button');
    button.setAttribute('data-tooltip', 'AI Reply');
    return button;
}

function getEmailContent() {
    const selectors = [
        '.h7 ',
        '.a3s.aiL', 
        '.gmail_ quote',
        '[role="presentation"]'
    ];
    for (const selector of selectors) {
        const emailContent = document.querySelector(selector);
        if (emailContent) {
            return emailContent.innerText.trim();
        }
        return '';
    }
}

function findComposeToolbar() {
    const selectors = [
        '.btC',
        '.aDh ',
        '[role="toolbar"]',
        '.gU.Up'
    ];
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            return toolbar;
        }
        return null;
    }
}

function injectButton() {
    const existingButton = document.querySelector('.ai-reply-button');
    if (existingButton) existingButton.remove();

    const toolbar = findComposeToolbar();
    if (!toolbar) {
        console.log("Compose Toolbar not found");
        return;
    }
    console.log("Compose Toolbar found");
    const button = createAIButton();
    button.classList.add('ai-reply-button');

    button.addEventListener('click', async () => {
        try {
            button.innerHTML = 'Generating...';
            button.style.cursor = 'progress';
            button.disabled = true;

            const emailContent = getEmailContent();
            const response = await fetch('http://localhost:8080/api/email/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: "professional"
                })
            });
            if (!response.ok) {
                throw new Error('Failed to generate AI reply');
            }
            const generatedReply = await response.text();
            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');

            if (composeBox) {
                composeBox.focus();
                document.execCommand('insertText', false, generatedReply);
            }
            else {
                alert("Compose box not found");
            }
        }
        catch (e) {
            console.error(e);
            alert('Failed to generate AI reply');
        } finally {
            button.innerHTML = 'AI Reply';
            button.style.cursor = 'pointer';
            button.disabled = false;
        }
    });

    toolbar.insertBefore(button, toolbar.firstChild);

}
const observer = new MutationObserver(function (mutations) {
    for (const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElement = addedNodes.some(node => node.nodeType === Node.ELEMENT_NODE &&
            (node.matches('.aDh, .btC, [role="dialog"]') || node.querySelector('.aDh, .btC, [role="dialog"]'))
        );
        if (hasComposeElement) {
            console.log("Compose Element Found");
            setTimeout(injectButton, 500);
            // const composeElement = document.querySelector('.aDh, .btC, [role="dialog"]');
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
}); 