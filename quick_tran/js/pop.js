(function(){
    var b = chrome.extension.getBackgroundPage();
    window.onload = function() {
        var f = b.getFlag('louis_allowed');
        if (f == 'false') {
            document.getElementById('isOf').checked = true;
        } else {
            document.getElementById('isOt').checked = true;
        }
    }

    var S = {
        init : function() {
            document.getElementById('isOt').addEventListener('click', function(){
                b.setFlag('louis_allowed', this.value);
            }, true);
            document.getElementById('isOf').addEventListener('click', function(){
                b.setFlag('louis_allowed', this.value);
            }, true);
        }
    };
    S.init();
})();