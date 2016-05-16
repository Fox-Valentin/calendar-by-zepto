// 全局变量
var jmui = {} ///此处放置通用函数
$.doc = $(document);
$.root_ = $('body');
$.device = null;
var _userAgent =navigator.userAgent;
var isweixin = (/MicroMessenger/i.test(_userAgent.toLowerCase()));
var isiphone = (/iphone|ipad|ipod/i.test(_userAgent.toLowerCase()));
var isandroid = (/android/i.test(_userAgent.toLowerCase()));
var isjuntuapp = (/juntuApp/i.test(_userAgent.toLowerCase()));
var juntuVersion = _userAgent.toLowerCase().split('/')[_userAgent.toLowerCase().split('/').length-1];
$(function() {
    $.doc.delegate('[data-href-url]', 'tap', function(event) {
        event.preventDefault();
        var _url = $(this).data('href-url')
        location.href = _url
    });
   
    if($.fn.stickUp){
     $('.jm-fix-tab-nav').stickUp();
     $('.jm-fix-top').stickUp({
        marginTitem:'body',
        stickyMarginB:10
      });
    }
});
// js 加减
jmui.add = function(arg1, arg2) {
    var r1, r2, m;
    try {
        r1 = arg1.toString().split(".")[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split(".")[1].length
    } catch (e) {
        r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    return (arg1 * m + arg2 * m) / m
}
jmui.sub = function(arg1, arg2) {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split(".")[1].length
    } catch (e) {
        r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2));
    //动态控制精度长度  
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

jmui.accMul = function(arg1, arg2) {
        var m = 0,
            s1 = arg1.toString(),
            s2 = arg2.toString();
        try {
            m += s1.split(".")[1].length
        } catch (e) {}
        try {
            m += s2.split(".")[1].length
        } catch (e) {}
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
    }
    // 订单总数计算
jmui.total = function() {
    var _this = this;
    var _total = 0;
    for (var i = 0; i < arguments.length; i++) {
        _total = _this.add(_total, arguments[i]) <= 0 ? 0 : _this.add(_total, arguments[i]);
    };
    return _total
}
jmui.orderLoadInfo = function(url, wapper) {
    var orderLoadInfoLoading = $.loading({
        content: '加载中...',
    })
    $.get(url, function(data, textStatus) {
        orderLoadInfoLoading.loading("hide");
        $(wapper).append(data)
    }, 'html');
}
jmui.wxpay = function(_timestamp, _nonceStr, _package, _paySign,_orderId) {
    wx.ready(function() {
        wx.chooseWXPay({
            timestamp: _timestamp,
            nonceStr: _nonceStr,
            package: _package,
            signType: 'MD5',
            paySign: _paySign,
            success: function(res) {
                var payDia = $.dialog({
                    title: '支付提示',
                    content: '<p class="text-center">支付成功</p>',
                    button: ["确定"]
                });
                payDia.on("dialog:hide", function(e) {
                     location.href="/index.php?m=mobile&c=pay&a=ajax_wx_pay_notify&pay_result=succ&orderid="+_orderId
                });
               
            }
        });
    })
}
jmui.weiXinPayTips =function (argument) {
    var tipsHtml ="<div class='jm-pay-tips'><img style='width:60%' src='http://static.juntu.com/weixin/images/weixin_buy_guide.png'></div>"
    $('body').append(tipsHtml);
     $.root_.on('tap', '.jm-pay-tips', function() {
        $(this).remove();
     })
}
jmui.orderSubmitdialog = function(_title, text) {
    var dia = $.dialog({
        title: _title,
        content: '<p>' + text + '</p>',
        button: ["关闭"]
    });

    dia.on("dialog:hide", function(e) {
        console.log("dialog hide")
    });
}

jmui.orderTotal = function() {
    var _singlePrice = jmui.numDefault($('#price').val());
    var _minusAmount = -(jmui.numDefault($('#minus_amount').val()));
    var _couponAmount = -(jmui.numDefault($('#coupon_amount').val()));
    var _num = jmui.numDefault($('#order-buy-num').val());
    var _buyTotal = jmui.accMul(_singlePrice, _num)
    var _minusTotalAmount = jmui.accMul(_minusAmount, _num)
    var _payTotal = jmui.total(_buyTotal, _minusTotalAmount , _couponAmount)
    $('.jm-order-totle-left span').html('￥' + _payTotal)

}
jmui.numDefault = function(val) {
    return typeof(val) == 'undefined' ? 0 : val
}
jmui.closePupBody = function(node) {
    $.root_.removeClass('ovh')
    node.closest('.jm-pup-body').addClass('fadeOutRightBig')
    setTimeout(function() {
        $('.jm-pup-body').remove()
    }, 1000)
};

jmui.changeGetCodeType = function(value) {
        if ($('#GetCodeType').length == 0) {
            return false
        }
        var getCodeTypeBtn = $('#GetCodeType').find('button')
        if (value > 1) {
            getCodeTypeBtn.eq(0).removeClass('hidden')
        } else {
            getCodeTypeBtn.eq(0).addClass('hidden')
            $('#GetCodeType').find('input').val('N')
            getCodeTypeBtn.eq(1).addClass('jm-btn-primary').siblings().removeClass('jm-btn-primary')
        }
        getCodeTypeBtn.tap(function() {
            var _getCodeType = $(this).data('type-code')
            $(this).addClass('jm-btn-primary').siblings().removeClass('jm-btn-primary')
            $('#GetCodeType').find('input').val(_getCodeType)
        })

    }
    // 移动验证
jmui.validateForm = {}

jmui.validateForm._validateType = {
    r: /.+/,
    m: /^1[3|4|5|8|7]{1,1}\d{9,9}$/,
    'idcard': function(gets) {
        var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子;
        var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值，10代表X;

        if (gets.length == 15) {
            return isValidityBrithBy15IdCard(gets);
        } else if (gets.length == 18) {
            var a_idCard = gets.split(""); // 得到身份证数组   
            if (isValidityBrithBy18IdCard(gets) && isTrueValidateCodeBy18IdCard(a_idCard)) {
                return true;
            }
            return false;
        }
        return false;

        function isTrueValidateCodeBy18IdCard(a_idCard) {
            var sum = 0; // 声明加权求和变量   
            if (a_idCard[17].toLowerCase() == 'x') {
                a_idCard[17] = 10; // 将最后位为x的验证码替换为10方便后续操作   
            }
            for (var i = 0; i < 17; i++) {
                sum += Wi[i] * a_idCard[i]; // 加权求和   
            }
            valCodePosition = sum % 11; // 得到验证码所位置   
            if (a_idCard[17] == ValideCode[valCodePosition]) {
                return true;
            }
            return false;
        }

        function isValidityBrithBy18IdCard(idCard18) {
            var year = idCard18.substring(6, 10);
            var month = idCard18.substring(10, 12);
            var day = idCard18.substring(12, 14);
            var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
            // 这里用getFullYear()获取年份，避免千年虫问题   
            if (temp_date.getFullYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
                return false;
            }
            return true;
        }

        function isValidityBrithBy15IdCard(idCard15) {
            var year = idCard15.substring(6, 8);
            var month = idCard15.substring(8, 10);
            var day = idCard15.substring(10, 12);
            var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
            // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法   
            if (temp_date.getYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
                return false;
            }
            return true;
        }

    },
    'unique': function(val, _elements) {
        var result = true;
        var _thatName = _elements.attr('name')
        var _uniqueInput = _elements.closest('form').find('[data-only]')
        _uniqueInput.each(function(index, el) {
            var _thisVal = $(el).val()
            var _thisName = $(el).attr('name')
            if (_thisVal == val && _thatName != _thisName) {
                result = false
            }
        });
        return result
    }
};

jmui.validateForm.check = function(obj) {
    jmui.validateForm.validate(obj)
    obj.closest('form')
    var errLenght = obj.find('.jm-err').length;
    if (errLenght > 0) {
        return false
    }
    return true

};
jmui.validateForm.reg = function(obj) {
    var _val = obj.val()
    var _dataType = obj.attr('datatype');
    var _only = obj.data('only');
    if (typeof(jmui.validateForm._validateType[_dataType]) != "undefined") {
        switch (_dataType) {
            case "idcard":
                if (!jmui.validateForm._validateType.idcard(_val)) {
                    obj.parent().addClass('jm-err')
                    return false
                } else {
                    obj.parent().removeClass('jm-err')

                }
                break;
            default:
                if (!jmui.validateForm._validateType[_dataType].test(_val)) {
                    obj.parent().addClass('jm-err')
                    return false
                } else {
                    obj.parent().removeClass('jm-err')
                }
                break;
        }
    }
    if (_only == true) {
        if (!jmui.validateForm._validateType.unique(_val, obj)) {
            obj.parent().addClass('jm-err')
        } else {
            obj.parent().removeClass('jm-err')
        }

    }
}
jmui.validateForm.validate = function(obj) {
    if (obj.is('form')) {
        var _input = obj.find('[type="text"],[type="number"]')
        var _inputLenght = _input.length
        for (var i = 0; i < _input.length; i++) {
            var _elements = $(_input[i])
            jmui.validateForm.reg(_elements)
        };
    } else {
        jmui.validateForm.reg(obj)
    }


};
//20160216 beign
jmui.topFix =  function (){
         var _this = $('[data="jm-top-fix"]');
           var _top =$(window).scrollTop() 
                if(_top>=140){
                    _this.addClass('active')
                }else{
                  _this.removeClass('active')

                }
    }

// jmui.validateForm = function(validateTarget) {
//     debugger
//     var _validateType = {
//     r: /.+/,
//     m: /^1[3|4|5|8|7]{1,1}\d{9,9}$/,
//     'idcard': function(gets) {
//         var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子;
//         var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值，10代表X;

//         if (gets.length == 15) {
//             return isValidityBrithBy15IdCard(gets);
//         } else if (gets.length == 18) {
//             var a_idCard = gets.split(""); // 得到身份证数组   
//             if (isValidityBrithBy18IdCard(gets) && isTrueValidateCodeBy18IdCard(a_idCard)) {
//                 return true;
//             }
//             return false;
//         }
//         return false;

//         function isTrueValidateCodeBy18IdCard(a_idCard) {
//             var sum = 0; // 声明加权求和变量   
//             if (a_idCard[17].toLowerCase() == 'x') {
//                 a_idCard[17] = 10; // 将最后位为x的验证码替换为10方便后续操作   
//             }
//             for (var i = 0; i < 17; i++) {
//                 sum += Wi[i] * a_idCard[i]; // 加权求和   
//             }
//             valCodePosition = sum % 11; // 得到验证码所位置   
//             if (a_idCard[17] == ValideCode[valCodePosition]) {
//                 return true;
//             }
//             return false;
//         }

//         function isValidityBrithBy18IdCard(idCard18) {
//             var year = idCard18.substring(6, 10);
//             var month = idCard18.substring(10, 12);
//             var day = idCard18.substring(12, 14);
//             var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
//             // 这里用getFullYear()获取年份，避免千年虫问题   
//             if (temp_date.getFullYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
//                 return false;
//             }
//             return true;
//         }

//         function isValidityBrithBy15IdCard(idCard15) {
//             var year = idCard15.substring(6, 8);
//             var month = idCard15.substring(8, 10);
//             var day = idCard15.substring(10, 12);
//             var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
//             // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法   
//             if (temp_date.getYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
//                 return false;
//             }
//             return true;
//         }

//     },
//     'unique': function(val, _elements) {
//         var result = true;
//         var _thatName = _elements.attr('name')
//         var _uniqueInput = _elements.closest('form').find('[data-only]')
//         _uniqueInput.each(function(index, el) {
//             var _thisVal = $(el).val()
//             var _thisName = $(el).attr('name')
//             if (_thisVal == val && _thatName != _thisName) {
//                 result = false
//             }
//         });
//         return result
//     }

// };
//         var check = function() {
//             var errLenght = $('.jm-err').length;
//             if (errLenght > 0) {
//                 return false
//             }
//             return true
//         };
//         var validate = function() {
//             debugger
//     if (validateTarget.is('form')) {
//         var _input = validateTarget.find('[type="text"],[type="number"]')
//         var _inputLenght = _input.length
//         for (var i = 0; i < _input.length; i++) {
//             var _elements = $(_input[i])
//             var _val = _elements.val()
//             var _dataType = _elements.attr('datatype');
//             var _only = _elements.data('only');
//             if (typeof(_validateType[_dataType]) != "undefined") {
//                 switch (_dataType) {
//                     case "idcard":
//                         if (!_validateType.idcard(_val)) {
//                             _elements.parent().addClass('jm-err')
//                             return false
//                         } else {
//                             _elements.parent().removeClass('jm-err')

//                         }
//                         break;
//                     default:
//                         if (!_validateType[_dataType].test(_val)) {
//                             _elements.parent().addClass('jm-err')
//                             return false
//                         } else {
//                             _elements.parent().removeClass('jm-err')
//                         }
//                         break;
//                 }

//             }
//         };

//     } else {
//         var _elements = validateTarget;
//         var _val = _elements.val()
//         var _dataType = _elements.attr('datatype');
//         var _only = _elements.data('only');
//         if (typeof(_validateType[_dataType]) != "undefined") {
//             switch (_dataType) {
//                 case "idcard":
//                     if (!_validateType.idcard(_val)) {
//                         _elements.parent().addClass('jm-err')
//                         return false
//                     } else {
//                         _elements.parent().removeClass('jm-err')
//                     }
//                     break;
//                 default:
//                     if (!_validateType[_dataType].test(_val)) {
//                         _elements.parent().addClass('jm-err')
//                         return false
//                     } else {
//                         _elements.parent().removeClass('jm-err')

//                     }
//                     break;
//             }
//         }

//     }
//     if (_only == true) {
//         if (!_validateType.unique(_val, _elements)) {
//             _elements.parent().addClass('jm-err')
//         } else {
//             _elements.parent().removeClass('jm-err')
//         }

//     }
// }

// }
