document.addEventListener('DOMContentLoaded', function() {
    const statusDiv = document.getElementById('status');
    const statusText = document.getElementById('statusText');
    const toggleBtn = document.getElementById('toggleBtn');

    function updateUI(hideComments) {
        if (hideComments) {
            statusDiv.className = 'status enabled';
            statusText.textContent = '✓ 评论区已隐藏';
            toggleBtn.className = 'toggle-btn show';
            toggleBtn.textContent = '显示评论区';
        } else {
            statusDiv.className = 'status disabled';
            statusText.textContent = '✗ 评论区已显示';
            toggleBtn.className = 'toggle-btn hide';
            toggleBtn.textContent = '隐藏评论区';
        }
    }

    chrome.storage.local.get(['hideComments'], function(result) {
        const hideComments = result.hideComments !== false;
        updateUI(hideComments);
    });

    toggleBtn.addEventListener('click', function() {
        chrome.runtime.sendMessage({
            action: 'toggleComments'
        }, function(response) {
            if (response && response.success) {
                updateUI(response.hideComments);
            }
        });
    });

    chrome.storage.onChanged.addListener(function(changes, namespace) {
        if (namespace === 'local' && changes.hideComments) {
            updateUI(changes.hideComments.newValue);
        }
    });
});