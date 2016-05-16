! function($) {
    var k = 0;
    var _rightBtnTpl = '<span class="jm-calc-add" data-calc="add"></span>';
    var _leftBtnTpl = '<span class="jm-calc-minus" data-calc="minus"></span>';
    var _idCardTpl = function(k) {
            var _tpl;
            return _Tpl = '<ul class="jm-list jm-list-text jm-idcard-type jm-border-tb">' +
                '<li class="jm-border-t jm-form-item">' +
                '<span class="jm-li-title">旅客' + k + '</span>' +
                '<div class="jm-list-action">' +
                '<input type="text" name="info[traveler][' + k + '][name]" datatype="r" placeholder="旅客' + k + '（真实姓名）"><i></i>' +
                '</div>' +
                '</li>' +
                '<li class="jm-border-t jm-form-item">' +
                '<label><span class="jm-li-title">身份证</span>' +
                '<div class="jm-list-action">' +
                '<input type="number"  name="info[traveler][' + k + '][id_card]" datatype="idcard" data-only="true" placeholder="身份证（凭有效证件入园）"> <i></i>' +
                '</div>' +
                '</label>' +
                '</li>' +
                '</ul>'

        }
        // 默认参数
    var defaults = {
        min: 1,
        max: 1,
        idCard: true,
        idCardStep: 1,
        idCardWapper: null,
        callback: function(val) {}
    };
    var spinner = function(el, option) {
        this.option = option;
        this.element = $(el);
        this.idStep = $(el).data('idstep');
        this._init();
    }
    spinner.prototype = {
        _init: function() {
            var self = this;
            this.min = self.element.data('min');
            this.max = self.element.data('max');
            self.element.before(_leftBtnTpl);
            self.element.after(_rightBtnTpl);
            if (this.min < this.max) {
                self.element.next().addClass('active')
            };
            this._changeValue(this.min, this.max);
            this._changeIdCard()
        },
        _changeValue: function(_min, _max) {
            var self = this;
            var _that = this.element;
            var _btn = _that.parent().find('span');
            _btn.tap(function() {
                var _this = $(this);
                if (!_this.hasClass('active')) {
                    return false
                }
                var _calcType = _this.data('calc')
                var _val = _that.val();
                if (_calcType == 'add') {
                    _val = jmui.add(_val, 1);
                    _btn.eq(0).addClass('active')
                } else if (_calcType == 'minus') {
                    _val = jmui.sub(_val, 1);
                    _btn.eq(1).addClass('active');
                }
                _that.val(_val);
               
                self._changeIdCard(_val)
                self.option.callback(_val)
                if (_val == _max) {
                    _btn.eq(1).removeClass('active')
                    return false
                }
                if (_val == _min) {
                    _btn.eq(0).removeClass('active');
                    return false
                }

            })
        },
        _changeIdCard: function(_val) {
            var self = this;
            if (!self.option.idCard ||  self.idStep==0  ) {
                return false
            }
            var _idCard = $(self.option.idCardWapper);
            var _idcardlength = $(self.option.idCardWapper).length;
            var _idCardStep = self.idStep == undefined ? self.option.idCardStep : self.idStep;
            var _idcardAllVal = _val * _idCardStep;
            if (_idcardlength >= _idcardAllVal) {
                $(_idCard).each(function(index, el) {
                    if (index >= _idcardAllVal) {
                        $(this).remove()
                    }
                });
            } else {
                for (var i =  _idcardAllVal - _idcardlength; i >= 1; i--) {
                     k = _idCard.length + i;
                    $(_idCard).last().after(_idCardTpl(k))
                };

            }
        }


    }

    function Plugin(option) {
        return this.each(function() {
            var el = $(this);
             new spinner(this, $.extend({}, defaults,  typeof option == 'object' && option));
            if (typeof option == 'string') data[option]()
        })
    }
    $.fn.spinner = Plugin;
}(window.Zepto)
