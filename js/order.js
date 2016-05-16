$(function() {
    // 张数加减
    $('.spinnerIdcard').spinner({
            idCardWapper: '.jm-idcard-type',
            idCard: true,
            callback: function(value) {
                jmui.changeGetCodeType(value);
                jmui.orderTotal()
                if (jmui.validateForm($('#order_form'))) {
                    $('#order-btn').removeClass('disabled')
                } else {
                    $('#order-btn').addClass('disabled')
                }

            }
        })
        // 获取日历价格
    $('#get-calendar-url').tap(function() {
            var url = $(this).data('calendar-url')
            var el = $.loading({
                content: '加载中...',
            })
            $.ajax({
                type: "GET",
                url: url,
                dataType: 'html',
                beforeSend: function() {},
                success: function(data) {
                    $.root_.append(data).addClass('ovh')
                    el.loading("hide");

                },
                error: function(xhr, ajaxOptions, thrownError) {},
            });
        })
        // 取票方式提示
    $(".jm-ticket-type").tap(function() {
            $('.jm-dialog').dialog('show')
        })
        // 订单支付获取订单信息
    $('[data-get-order-info-url]').each(function(index, el) {
        var _this = $(this);
        var _url = $(this).data('get-order-info-url')
        jmui.orderLoadInfo(_url, _this)
    });
    // 获取优惠券
    $('#jm-get-coupon').tap(function() {
            var url = $(this).data('coupon-url')
            var couponLoading = $.loading({
                content: '加载中...',
            })
            $.ajax({
                type: "GET",
                url: url,
                dataType: 'html',
                beforeSend: function() {},
                success: function(data) {
                    $.root_.append(data).addClass('ovh')
                    couponLoading.loading("hide");

                },
                error: function(xhr, ajaxOptions, thrownError) {},
            });
        })
        // 关闭日历价格和优惠券弹出页面
    $.root_.on('tap', '.close-pup-body', function() {
            var _this = $(this)
            jmui.closePupBody(_this)
        })
        // 选择日期
    $.root_.on('tap', '.jm-datepicker td.active', function() {
            var _this = $(this)
            var singlePrice = _this.attr('price');
            var chooseDate = _this.attr('rel');
            $('#price').val(singlePrice);
            $('#use_date').val(chooseDate)
            $('#get-calendar-url input').val(chooseDate)
            jmui.closePupBody(_this)
            jmui.orderTotal()
        })
        // 选择优惠券
    $.root_.on('tap', '.jm-coupon-list', function() {
            var _this = $(this)
            var _couponText = _this.find('label').text()
            var _couponId = _this.data('coupon-id');
            var _couponAmount = _this.data('coupon-amount');
            var _couponCode = _this.data('coupon-code');
            if (_this.is('[data-coupon-type="code"]')) {
                $('#write_id').val(_couponId);
                $('#write_code').val(_couponCode);
            } else {
                $('#coupon_id').val(_couponId);
                $('#coupon_code').val(_couponCode);
            }
            $('#coupon_amount').val(_couponAmount)
            $('#jm-get-coupon .jm-list-action span').text(_couponText)
            jmui.closePupBody(_this)
            jmui.orderTotal()
        })
        // 输入优惠码获取优惠券
    $.root_.on('tap', '.get-coupon-code', function() {
        var _this = $(this);
        var _form = _this.closest('form');
        if (_this.hasClass('disabled') || !jmui.validateForm(_form)) {
            return false
        };
        var _url = _form.attr('action')
        var _couponcode = _form.find('.get-coupon-code-input').val()
        if ($('[data-coupon-code="' + _couponcode + '"]').length != 0) {
            jmui.orderSubmitdialog('查询提示', '优惠券已获取')
            return false
        }
        var couponcodeloading = $.loading({
            content: '加载中...',
        })
        $.ajax({
            type: "POST",
            url: _url + '&code=' + _couponcode,
            dataType: 'json',
            success: function(json) {
                couponcodeloading.loading("hide");
                if (json.status == 1) {
                    jmui.orderSubmitdialog('查询提示', '无效优惠码')
                } else {
                    _this.closest('li').eq(1).after('<li class="jm-border-t jm-coupon-list" data-coupon-type="code"  data-coupon-amount="' + json.amount + '" data-coupon-id="' + json.id + '" data-coupon-code="' + _couponcode + '"><label class="jm-checkbox " > <input type="checkbox"> ' + json.amount + '元优惠券</label>(' + _couponcode + ')</li>')
                }
            }
        });
    })
    $.root_.on('input blur', '.get-coupon-code-input', function(e) {
            var _that = $(e.target);
            var _form = $(this).closest('form');
            if (jmui.validateForm(_form)) {
                $('.get-coupon-code').removeClass('disabled').removeAttr('disabled')
            } else {
                $('.get-coupon-code').addClass('disabled').attr('disabled');
            }

        })
        // 表单输入验证
    $.root_.on('input blur', '#order_form [type="text"],#order_form [type="number"]', function(e) {
            var _that = $(e.target);
            var _thatVal = _that.val();
            var _form = $(this).closest('form');
            if (jmui.validateForm(_form)) {
                $('#order-btn').removeClass('disabled')
            } else {
                $('#order-btn').addClass('disabled')
            }

        })
        // 订单提交
    $('#order-btn').tap(function() {
            var _this = $(this);
            var _form = $(this).closest('form');
            if (_this.hasClass('disabled') || !jmui.validateForm(_form)) {
                return false
            };
            _this.addClass('disabled').text('正在提交')
            var url = _form.attr('action');
            var _data = _form.serialize();
            var btnloading = $.loading({
                content: '加载中...',
            })
            $.ajax({
                type: "POST",
                url: url,
                data: _data,
                dataType: 'json',
                success: function(json) {
                    btnloading.loading("hide");
                    if (json.result == 'fail') {
                        _this.removeClass('disabled').text('下一步')
                        jmui.orderSubmitdialog('下单提示', json.message)

                    } else {
                        location.href = json.data.nextUrl
                    }

                }
            });
        })
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
                jmui.wxpay(data.timeStamp, data.nonceStr, data.package, data.paySign)
                setTimeout(function() {
                    _this.removeClass('disabled')
                }, 5000)
            } else {
                _this.removeClass('disabled')
            }
        });
    })
});

