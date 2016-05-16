//计算剩余时间的函数
var JUI = {};
JUI.DAY_MS = 1000 * 60 * 60 * 24;
JUI.HOUR_MS = 1000 * 60 * 60;
JUI.MINUTE_MS = 1000 * 60;
JUI.showTime = function(ms) {
    var result = {};

    var day = Math.floor(ms / JUI.DAY_MS);
    ms = ms % JUI.DAY_MS;

    var hours = Math.floor(ms / JUI.HOUR_MS);
    ms = ms % JUI.HOUR_MS;

    var minutes = Math.floor(ms / JUI.MINUTE_MS);
    ms = ms % JUI.MINUTE_MS;

    var seconds = Math.floor(ms / 1000);
    if (day == 0 && hours == 0 && minutes == 0 && seconds == 0) {
        result.timeout = "<i>00</i> 天 <i>00</i> 时 <i>00</i> 分 <i>00</i> 秒 "
    } else {
        result.timeout = '<i>'+(day < 10 ? '0' + day : day) + '</i> 天 <i>' + (hours < 10 ? '0' + hours : hours) + '</i> 时 <i>' + (minutes < 10 ? '0' + minutes : minutes) + '</i> 分 <i>' + (seconds < 10 ? '0' + seconds : seconds) + '</i> 秒 ';
    }
    return result;
}
JUI.TaskCountdown = function(obj) {
    var $timers = $(obj);
    $.each($timers, function(inx, itm) {
        var $itm = $(itm);
        var realTime = $itm.attr('data-until');
        var offsetTime = 0;

        function getTime() {
            offsetTime += 1000;
            var result = (realTime - offsetTime) >= 0 ? realTime - offsetTime : 0;
            if (result == 0) {
                $itm.html("<i>00</i> 天 <i>00</i> 时 <i>00</i> 分 <i>00</i> 秒");
               
            }
            var timerObj = JUI.showTime(result);
            $itm.html(timerObj.timeout);
            return result;
        }

        var timeTask = getTime() && setInterval(function() {
            var flg = getTime();
            if (flg === 0) {
                clearInterval(timeTask);
            }
        }, 1000);

    });
}
$(function() {
    JUI.TaskCountdown($('[data-trigger="countdown"]'))

})
