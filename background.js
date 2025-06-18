chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ 'hideComments': true });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggleComments') {
        chrome.storage.local.get(['hideComments'], (result) => {
            const newState = !result.hideComments;
            chrome.storage.local.set({ 'hideComments': newState }, () => {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs[0] && tabs[0].url.includes('bilibili.com')) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            action: 'updateCommentVisibility',
                            hide: newState
                        });
                    }
                });
                sendResponse({ success: true, hideComments: newState });
            });
        });
        return true;
    }
});