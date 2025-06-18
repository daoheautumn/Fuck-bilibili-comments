let hideCommentsEnabled = true;

chrome.storage.local.get(['hideComments'], (result) => {
    hideCommentsEnabled = result.hideComments !== false;
    updateCommentVisibility();
});

function hideComments() {
    if (!hideCommentsEnabled) return;
    
    document.body.classList.add('bilibili-hide-comments');
}

function showComments() {
    document.body.classList.remove('bilibili-hide-comments');
}

function updateCommentVisibility() {
    if (hideCommentsEnabled) {
        hideComments();
    } else {
        showComments();
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateCommentVisibility') {
        hideCommentsEnabled = request.hide;
        updateCommentVisibility();
        sendResponse({ success: true });
    }
});

document.addEventListener('DOMContentLoaded', updateCommentVisibility);

const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length && hideCommentsEnabled) {
            hideComments();
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

setInterval(() => {
    if (hideCommentsEnabled) {
        hideComments();
    }
}, 1000);