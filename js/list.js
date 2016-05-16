$(function() {
   var qzlist = new list();
   qzlist()
    imgAuto(".index-list-wapper")
});
! function($) {
    var list = function(el, option) {
        this.option = option;
        this.element = $(el);
        this._init();
    };
    list.prototype = {
        _init: function() {
            if (!isjuntuapp) {
                $('.jm-header').removeClass('jm-header-juntuApp-hide');
            }
            if ($.fn.stickUp) {
                $('.jm-fix-top').stickUp({
                    marginTitem: 'body',
                    stickyMarginB: 10
                });
            }
        }
    };
}(window.Zepto)

function listFilter() {
    $.doc.delegate('.jm-filter-handle>li', 'tap', function(event) {
        var _this = $(this);
        var _index = _this.index();
        if (_this.hasClass('active')) {
            $('.jm-filter-handle-content >ul').eq(_index).height(0);
            _this.removeClass('active')
            return false
        }
        _this.addClass('active').siblings().removeClass('active')
        $('.jm-filter-handle-content >ul').eq(_index).height('auto').siblings().height(0)
        $('.jm-mark').show()
    });
    $.doc.delegate('.jm-mark', 'tap', function(event) {
        $('.jm-filter-handle>li').removeClass('active')
        $('.jm-filter-handle-content >ul').height(0)
        $('.jm-mark').hide()
    });
    
}

function listInit() {
    if (!isjuntuapp) {
        $('.jm-header').removeClass('jm-header-juntuApp-hide');
    }
    if ($.fn.stickUp) {
        $('.jm-fix-top').stickUp({
            marginTitem: 'body',
            stickyMarginB: 10
        });
    }
    listFilter()
}
