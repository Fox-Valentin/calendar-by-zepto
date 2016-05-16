$(function() {
           // 微信支付按钮
    $.root_.on('tap', '#jm-wx-pay', function() {
        var _this = $(this);
        var _orderid = $(this).attr('order-id')
        if (_this.hasClass('disabled')) {
            return false
        }
        _this.addClass('disabled')
        $.getJSON("http://s.juntu.com/index.php?m=mobile&c=order&a=get_prepay_id&id=" + _orderid + '&t=' + Math.random(), function(data) {
            if (data.status == 0) {
                jmui.wxpay(data.timeStamp, data.nonceStr, data.package, data.paySign, _orderid)
                setTimeout(function() {
                    _this.removeClass('disabled')
                }, 5000)
            } else {
                _this.removeClass('disabled')
            }
        });
    })
         // 订单支付获取订单信息
    $('[data-get-order-info-url]').each(function(index, el) {
        var _this = $(this);
        var _url = $(this).data('get-order-info-url')
        jmui.orderLoadInfo(_url, _this)
    });
});

