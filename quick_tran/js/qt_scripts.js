(function(){
    $(document).ready(function(){
        $(document.body).append('<div id="louis_pop"></div>');
        chrome.runtime.sendMessage({name:"setFlag", str:"louis_allowed", val:"true"}, function(response) {});
        $(document).mousedown(QS.mousedown).mouseup(QS.mouseup);
    });
    var QS = {};
    QS.allowed = true;
    QS.startObj = null;
    QS.isOpen = false;

    QS.isAllowed = function() {
        chrome.runtime.sendMessage({name:"getFlag", str:"louis_allowed"}, function(response) {
            QS.allowed = response.flag;
        });
        if (QS.allowed == 'false') {
            QS.allowed = false;
        } else {
            QS.allowed = true;
        }
    }
    QS.mousedown = function(event) {
        event = (event) ? event : ((window.event) ? window.event : "");
        if (event) {
            QS.startObj = (event.target) ? event.target : event.srcElement;
        }
    }
    QS.mouseup = function(event) {
        QS.isAllowed();
        if (!QS.isOpen && QS.allowed) {
            var obj;
            var strlen;
            event = (event) ? event : ((window.event) ? window.event : "");
            if (event) {
                obj = (event.target) ? event.target : event.srcElement;
                strlen = window.getSelection ? window.getSelection().toString() : document.selection.createRange().text;
            }
            var str = "";
            if (obj.tagName != "A" && obj.tagName != "INPUT" && obj == QS.startObj && QS.allowed) {
                if (strlen.length > 0) {
                    str = strlen;
                }
            }
            QS.translate(str, event);
        } else {
            QS.closePop();
        }
    }
    QS.mousePos = function(event) {
        var pos = {};
        pos.x = event.pageX;
        pos.y = event.pageY;
        return pos;
    }
    QS.popWin = function(data, event) {
        var pos = QS.mousePos(event);
        $("#louis_pop").css('display', 'block');
        $("#louis_pop").css('top', pos.y+10);
        $("#louis_pop").css('left', pos.x);
        $("#louis_pop").html(data);
        QS.isOpen = true;
    }
    QS.translate = function(str, event) {
        if (str.length > 0) {
            $.ajax({
                type : 'GET',
                url : 'http://openapi.baidu.com/public/2.0/bmt/translate?client_id=HWCOM4TSL7oA9uaviOqVuTVe&q='
                + str + '&from=auto&to=auto',
                dataType : 'json',
                success : function(data) {
                    var str = '';
                    if (data.error_code == 4) {
                        str += '慢慢看百度不然查太快！这么多词不会啊？';
                    } else {
                        $(data.trans_result).each(function(i,d){
                            str += d.src + ":" + d.dst;
                            str += '<div class="additional"><a target="_blank" href="http://www.iciba.com/'+ d.src
                                +'">百度不好？词霸解释点这</a></div>';
                        });
                        QS.popWin(str, event);
                    }
                },
                error : function() {
                    var str = '出现了未知错误！';
                    QS.popWin(str, event);
                }
            });
        }
    }
    QS.closePop = function() {
        $("#louis_pop").css('display', 'none');
        QS.isOpen = false;
    }
})();