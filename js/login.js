$(function() {
    if ($('.jm-tab').length == 1) {
        new fz.Scroll('.jm-tab', {
            role: 'tab'
        });
    }

});
$(function() {
    $('#mobile').keyup(function(event) {
        if ($(this).val().match(/^1[3|4|5|8|7]{1,1}\d{9,9}$/)) {
            $('.jt-getmsg').addClass('current')

        } else {
            $('.jt-getmsg').removeClass('current')
        }
    });
    $('.jm-login-ctrl').tap(function() {
        var _input = $(this).closest('form').find('input[data-err-msg]')
        if (!loginvalid(_input)) {

            return false
        }
        var _url = $(this).closest('form').attr('action');
        var _data = $(this).closest('form').serialize();
        $.post(_url, _data, function(response) {
            if (response.status == "error") {
                loginTips(response.message)
            } else {
                window.location.href = response.data.next
            }
        }, 'json')
    })
    $('.jt-getmsg').tap(function(event) {
        var _this = $(this);
        if (!_this.hasClass('current')) {
            return false
        }
        var _mobile = $('#mobile').val();
        if($(this).hasClass('jt-getmsg-find')){
             jtGetFindMsg(_mobile, _this);  
        }else{
          jtGetMsg(_mobile, _this);   
        }
       
    });
    $('.jm-reg-ctrl').tap(function() {
        if (!regvalid()) {
            return false
        }
        var _url = $(this).closest('form').attr('action');
        var _data = $(this).closest('form').serialize();
        $.post(_url, _data, function(response) {
            if (response.status == "fail") {
                loginTips(response.data.errors)
            } else {
                window.location.href = response.data.next
            }
        }, 'json')
    })
    $('.jm-find-pwd').tap(function() {
        if (!regvalid()) {
            return false
        }
        var _url = $(this).closest('form').attr('action');
        var _data = $(this).closest('form').serialize();
        $.post(_url, _data, function(response) {
            if (response.status == "error") {
                loginTips(response.msg)
            } else {
                var findDia = $.dialog({
                    title: '修改密码提示！',
                    content: response.msg,
                    button: ["确定"]
                });

                findDia.on("dialog:action", function(e) {
                     window.location.href = '/index.php?m=mobile&c=member&a=login'
                });
            }
        }, 'json')
    })
    if ($.fn.pwstrength) {
        $('#InputPassword1').pwstrength(options);
    }
});
var options = {};
options.ui = {
    container: "#pwd-container",
    showStatus: true,
    showProgressBar: false,
    viewports: {
        verdict: ".pwstrength_viewport",
    }
};

function regvalid() {
    if ($.trim($("#mobile").val()) == "" && $("#mobile").length != 0) {
        loginTips('请输入手机号码')
        return false;
    }
    if (!$.trim($("input[name=mobile]").val().match(/^1[3|4|5|8|7]{1,1}\d{9,9}$/)) && $("input[name=mobile]").length != 0) {
        loginTips('手机号码格式错误')
        return false;
    }
    if ($.trim($("#code").val()) == "" && $("#code").length != 0) {
        loginTips('请输入验证码')
        return false;
    }
    if ($.trim($("#InputPassword1").val()) == "" && $("#InputPassword1").length != 0) {
        loginTips('请输入密码')
        return false;
    }
    if ($.trim($("#InputPassword1").val()).length < 8 && $("#InputPassword1").length != 0) {
        loginTips('密码长度不能小于8位')
        return false;
    }
    if ($.trim($("#InputPassword1").val()).length > 32 && $("#InputPassword1").length != 0) {
        loginTips('密码长度不能大于32位')
        return false;
    }
    if ($("#pwd-container").hasClass('has-error') && $("#pwd-container").length != 0) {
        loginTips('您的密码强度太弱')
        return false;
    }
    if ($.trim($("#InputPassword2").val()) == "" && $("#InputPassword2").length != 0) {
        loginTips('请输入确认密码')
        return false;
    }
    if ($.trim($("#InputPassword1").val()) != $.trim($("#InputPassword2").val())) {
        loginTips('密码和确认密码不匹配')
        return false;
    }
    return true;
}

function loginvalid(node) {
    var result = true;
    node.each(function(index, el) {
        var msg = $(el).data('err-msg')
        if ($(el).val() == '') {
            loginTips(msg)
            result = false
            return false
        }

    });

    return result

}

function loginTips(content) {
    var el = $.tips({
        content: content,
        stayTime: 1000,
        type: "info"
    })
    el.on("tips:hide", function() {})
}

function jtGetFindMsg(mobile, node) {
    $.getJSON('/index.php?m=mobile&c=index&a=auth_code&mobile='+mobile, function(data){
        if (data.status == 0) {
                sixtyCountDown(node)
            } else {
                loginTips(data.msg)
            }
        })
    
}

function jtGetMsg(mobile, node) {
    $.ajaxJSONP({
        url: 'http://www.juntu.com/index.php?m=member&c=index&a=public_message&mobile=' + mobile + '&callback=?',
        success: function(data) {
            if (data.status == 0) {

                sixtyCountDown(node)
            } else {
                loginTips(data.msg)
            }
        }
    })

}

function sixtyCountDown(node) {
    var i = 60;
    var cdTime = setInterval(function() {
        i--;
        $(node).removeClass('current')
        if (i == 0) {
            clearInterval(cdTime)
            $(node).addClass('current').text('获取验证码')
            return false
        }
        $(node).text(i + '秒');

    }, 1000)

}
