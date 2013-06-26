function setFlag(str, val) {
    sessionStorage.setItem(str, val);
}

function getFlag(str) {
    return sessionStorage.getItem(str);
}

chrome.runtime.onMessage.addListener(function(msg, render, sendResponse) {
    if (msg.name == 'setFlag') {
        setFlag(msg.str, msg.val);
    }
    if (msg.name == 'getFlag') {
        var str = getFlag(msg.str);
        sendResponse({flag:str});
    }
});