    (function($) {
        // defaults 为默认设置项，其中包括插入的dom对象
        // jm_datepicker_wrap，以及年月和显示月的数量
        var defaults = {
            jm_datepicker_wrap: $('.jm-datepicker'),
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            month_num: 1,
            ajax_url: '',
            start_date: null,
            end_date: null,
            day_count: null,
            callback: function(argument) {

            }
        };

        
        $(document).ready(function() {
            // 判断起始结束时间是否为空
            // 为空则使用今天和明天
            if($('.date-start').val() == '' && $('.date-end').val() == '' ){
                var now = new Date();
                var date_start = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
                var date_end = addDays(1,now);
                // date_end = dateFormate(date_end);
                var week_end = getWeekDay(date_end.getDay());
                date_end = date_end.getFullYear() + '-' + (date_end.getMonth() + 1) + '-' + (date_end.getDate());
                var week_start = getWeekDay(now.getDay());
            }else{
                // 不为空则使用默认值
                var start_date = new Date(dateFormate($('.date-start').val()));
                var start_end = new Date(dateFormate($('.date-end').val()));
                var date_start = start_date.getFullYear() + '-' + (start_date.getMonth() + 1) + '-' + start_date.getDate();
                var date_end = start_end.getFullYear() + '-' + (start_end.getMonth() + 1) + '-' + (start_end.getDate());
                var week_start = getWeekDay(start_date.getDay());
                var week_end = getWeekDay(start_end.getDay());
            }

            var date_start_default_str = "<div class='date-start-text' style='letter-spacing: -1px;'><div class='date-start-getDate'>" + date_start + "</div><div class='date-start-getDay'>" + week_start + "</div></div>";
            var date_end_default_str = "<div class='date-end-text' style='letter-spacing: -1px;'><div class='date-end-getDate'>" + date_end + "</div><div class='date-end-getDay'>" + week_end + "</div></div>";

                $('.date-start').val(date_start);
                $('.date-end').val(date_end);
                $('.jm-date-start').append(date_start_default_str);
                $('.jm-date-end').append(date_end_default_str);
        });

       
        // jm_calendar为jq的静态方法 调用方式为$.jm_calendar(options)
        // options 是设置项，可以不填或者按defaults覆盖填写
        $.fn.jm_calendar = function(options) {
            // 获取启用日历的对象
            $target = $(this);
            // 创建对象，为后面填入每月中各个日期和对应的价格
            var month_price = {};
            // 将整个头部结构拼接为字符串，因为只生成一次，所以写在头部
            var str = '<div class="calendar-body jm-pup-body animated" id="calendarPrice"><header class="jm-header"><a href="javascript:void(0)" class="jm-header-left_icon close-pup-body"><i class="jm-iconfont"></i></a><span>请选择使用日期</span><a href="#" class="jm-header-right_icon"></a></header><section><h2 class="jm-order-title"></h2><div class="jm-datepicker"></div></section></div>';
            // 将默认设置和传入设置比较，若传入则使用传入的，如无传入则使用默认
            var options = $.extend(defaults, options);            
            // 生成头部的dom
            options.jm_datepicker_wrap.append(str);
            // 若起始结束项不为null，则取其值，否则取空字符串
            var start_date = options.start_date != null ? options.start_date.val() : '';
            start_date = dateFormate(start_date);
            var end_date = options.end_date != null ? options.end_date.val() : '';
            end_date = dateFormate(end_date);
            // 请求日=》价格
            if (options.ajax_url != '') {
                $.getJSON(options.ajax_url, function(json, textStatus) {
                    for (var i = 0, len = json.length; i < len; i++) {
                        // 如果该月份不存在则创建之
                        if (!month_price[month_exist]) {
                            var month_exist = new Date(json[i].date).getMonth();
                            month_price[month_exist] = {};
                        }
                        // 创建获取的日
                        var date = String(new Date(json[i].date).getDate());
                        // 建立hash表对应月份-日-日价格
                        month_price[month_exist][date] = json[i].price;
                    }
                });
                 callCalendar();
            }else{
                 callCalendar();
            }
            function callCalendar(){
                    // 执行创建日历方法并返回日历拼接字符串
                    str = operat(options);
                    // 生成日历dom
                    $('.jm-datepicker').append(str);
                    var tds = $('.jm-datepicker td.active');
                    // 如果start_date存在，循环日期项，大于结束日期，小于开始日期项全部置黄色
                    if (start_date) {
                        for (var i = 0, len = tds.size(); i < len; i++) {
                            // 如果结束input的data-end属性，值不为空字符串
                            // 则日期项与开始日期相等值添加绿色类
                            if (new Date(tds.eq(i).data('date')) >= new Date(start_date) && new Date(tds.eq(i).data('date')) <= new Date(end_date)) {
                                    tds.eq(i).addClass('selected1');
                                }
                        }
                    }
                    // 如果end_date存在，循环日期项，大于结束日期，小于开始日期项全部置黄色
                    if ($target.hasClass('date-start')) {
                        if (end_date) {
                            for (var i = 0, len = tds.size(); i < len; i++) {
                                // 如果结束input的data-end属性，值不为空字符串
                                // 则日期项与结束日期相等值添加绿色类
                                if (options.start_date.val() != '') {
                                    if (tds.eq(i).data('date') == start_date) {
                                        tds.eq(i).removeClass('selected').removeClass('selected1').addClass('selected-1');
                                    }
                                }
                                // 如果end_date存在，循环日期项，大于结束日期，小于开始日期项全部置黄色
                                
                            }
                        }
                    }
                    
                    //  若事件源为结束input
                    if ($target.hasClass('date-end')) {
                            for (var i = 0, len = tds.size(); i < len; i++) {
                                // 则日期项与开始日期相等值添加绿色类
                                if (options.end_date.val() != '') {
                                    if (tds.eq(i).data('date') == end_date) {
                                        tds.eq(i).removeClass('selected1').removeClass('selected-1').addClass('selected');
                                    }
                                }
                                 if (start_date) {
                                     // 如果start_date存在，循环日期项，小于开始日期项全部置灰
                                    if (new Date(tds.eq(i).data('date')) < new Date(start_date)) {
                                        tds.eq(i).removeClass('active').addClass('day pass');
                                    }
                                }
                            
                        }
                    }
            }

            // 创建已选择日，赋值为点击选择的日
            var selected_date;
            // 日历出现的动画效果
            $('.calendar-body').removeClass('hide').addClass('fadeInRightBig');
            // 日期点击事件
            $(document).one('tap','.jm-datepicker td.active', function(event) {
                event.preventDefault();
                // 获取点击日的完整年月日
                selected_date = dateFormate($(this).data('date'));
                // 获取所有的可选择td
                var tds = $('.jm-datepicker td.active');
                // 全部去除渲染颜色状态类 后面重新渲染
                tds.removeClass('selected1');
                // 点击的td选中状态
                if ($target.hasClass('date-start')) {
                    // 判断事件源是否是起始日期项
                    // 业务逻辑，当起始日期选中，结束日期默认加一天
                    // 只选择结束日期，则不进行下列流程
                    // 将选择的日历日期赋值给事件绑定的input
                    $target.val(dateReformate(selected_date));
                    $target.attr('data-start', dateReformate(selected_date));

                    tds.removeClass('selected');
                    $(this).addClass('selected');
                    // 给起始日期的dom添加日期和周日期
                    $('.date-start-getDate').html(dateReformate(selected_date));
                    $('.date-start-getDay').html(getWeekDay(new Date(selected_date).getDay()));
                    // 如果事件源是结束时间，取选到值
                    start_date = selected_date;
                    // 判断是否存在结束日期项
                    // 判断所选择的开始日期大于结束日期
                    if (options.end_date != null && new Date(dateFormate(options.start_date.val())) >= new Date(dateFormate(options.end_date.val()))) {
                        // 增加一天
                        var before_date = addDays(1,dateFormate(options.start_date.val()));
                        before_date = before_date.getFullYear() + '-' + (before_date.getMonth()+1) + '-' + (before_date.getDate());
                        // 结束选项默认为起始日期+1
                        options.end_date.val(before_date);
                        options.end_date.attr('data-end', dateReformate(before_date));
                        // 给结束日期的dom添加日期和周日期
                        $('.date-end-getDate').html(dateReformate(before_date));
                        $('.date-end-getDay').html(getWeekDay(new Date(dateFormate(before_date)).getDay()));
                    }


                    // 如果事件源为起始，循环日期项，小于今天日期项全部置灰
                    for (var i = 0, len = tds.size(); i < len; i++) {
                        if (new Date(tds.eq(i).data('date')) < new Date()) {
                            tds.eq(i).removeClass('active').addClass('day pass');
                        }
                    }
                } else if($target.hasClass('date-end')) {
                    tds.removeClass('selected-1');
                    $(this).addClass('selected-1'); 
                    // 判断是否存在开始日期项
                    // 判断所选择的结束日期等于开始日期
                       
                    if (options.start_date != null && dateFormate(options.start_date.val()) == selected_date) {
                    // 等于则结束
                       quit();
                       return false;
                    }
                    // 如果事件源是起始时间，取选到值
                    end_date = selected_date;
                    // 给结束日期的dom添加日期和周日期
                    $('.date-end-getDate').html(dateReformate(selected_date));
                    $('.date-end-getDay').html(getWeekDay(new Date(selected_date).getDay()));
                    // 将选择的日历日期赋值给事件绑定的input
                    $target.val(dateReformate(selected_date));
                    // 如果事件源是结束时间，则给此dom属性赋值选中日期
                    $target.attr('data-end', dateReformate(selected_date));
                }



                // 如果end_date存在
                // 事件源为结束 那么起始td项会渲染为选中状态
                if (end_date && $target.hasClass('date-end')) {
                    // 循环所有的日期选项
                    for (var i = 0, len = tds.size(); i < len; i++) {
                        // 将起始结束时间之前的选项添加类
                        if (new Date(tds.eq(i).data('date')) >= new Date(start_date) && new Date(tds.eq(i).data('date')) < new Date(end_date)) {
                            tds.eq(i).addClass('selected1');
                        }
                    }
                }
                // 如果end_date存在
                // 事件源为起始 那么起始td项不会渲染为选中状态
                if (start_date && $target.hasClass('date-start')) {
                    // 循环所有的日期选项
                    for (var i = 0, len = tds.size(); i < len; i++) {
                        // 将起始结束时间之前的选项添加类
                        if (new Date(tds.eq(i).data('date')) >= new Date(start_date) && new Date(tds.eq(i).data('date')) < new Date(end_date)) {
                            tds.eq(i).addClass('selected1');
                        }
                    }
                }


                // 退出
                quit();
                // 这里显示总的住宿天数
                if (options.day_count != null) {
                    // 住宿天数按起始结束日期间的天数计算
                    // 当天数等于零，代表无选择或起始日期晚于结束日期，则为1
                    var count = new Date(end_date) - new Date(start_date);
                    var single = 86400000;
                    count = count/single;
                    if(count <= 0){
                        count = 1;
                    }
                    // var count = $('.selected1').size() > 0 ? $('.selected1').size() : 1;
                    options.day_count.html(count);
                }
               options.callback();
            });
            // 日历关闭事件
            $(document).on('tap', '.close-pup-body', function(event) {
                event.preventDefault();
                quit();
            });
            function dateFormate(dateStr){
                // 正则 验证月份-9-
                var mReg =  /\-[0-9]{1}\-/;
                // 补全月份，横杠替换为斜杠
                if(mReg.test(dateStr)){
                    dateStr = dateStr.replace(/\-/,"\-0");
                }
                return dateStr.replace(/\-/g,"\/");
            }
            function dateReformate(dateStr){
                // 正则 验证斜杠
                var mReg =  /\/*/;
                // 斜杠替换为横杠
                if(mReg.test(dateStr)){
                    dateStr = dateStr.replace(/\//g,"\-");
                }
                return dateStr;
            }
            function quit() {
                // 日历推出动画
                $('.calendar-body').removeClass('fadeInRightBig').addClass('fadeOutRightBig');
                // 移出日历dom
                setTimeout(function() { $('.calendar-body').remove(); }, 100);
            }

            function operat(options) {
                var num = 1;
                var str = '';
                // 循环月份数month_num，有几个月份数循环几个月份日历
                while (options.month_num >= num) {

                    // 创建日期，返回一个对象，对象的属性包含日期相关信息 
                    var create_date = createDate(options.year, options.month, num);
                    // 创建并渲染日历html，需要日期相关信息 
                    // 若是存在月份价格，则传入价格信息和月份，若无，则传入空
                    if (month_price[options.month_num - 1]) {
                        str += createCalendar(create_date, month_price[options.month_num - 1], options.month_num);
                    } else {
                        str += createCalendar(create_date, null, 0);
                    }
                    num++;
                }
                return str;
            }


            function createDate(year, month, month_num) {
                var obj = {};
                // 依据年月创建当前年月和第一日的日期对象
                date = new Date(year, month - 1);
                // 依据传入的月份数，得出日数
                if (month_num <= 1) {
                    // 若是月份数为1，只循环当前月份，获取本日
                    obj.day = new Date().getDate();
                } else {
                    // 若是月份数大于1，循环当前月份后的月份，获取第一日
                    obj.day = date.getDate();
                }
                // 根据传入的年月和月份数创建时间对象
                obj.first_day = new Date(year, month - 1 + month_num - 1, 1)
                obj.year = obj.first_day.getFullYear();
                obj.month = obj.first_day.getMonth() + 1;
                // 获得星期数
                obj.first_day_of_week = obj.first_day.getDay();
                // 获得当月天数
                obj.fullMonthDay = getFullMonthDay(obj.year, obj.month);
                // 获得循环行数 当月天数+第一天星期数 / 一周7天
                obj.tr_nums = Math.ceil((obj.fullMonthDay + obj.first_day_of_week) / 7);
                return obj;
            }

            // 
            function createCalendar(create_date, month_price, month_num) {

                // 日历头部
                var str = '<table cellpadding="0" border="0" width="100%" class="dateTable" cellspacing="0" data-MonthYear=' + create_date.year + '-' + create_date.month + '><input type="hidden" name="c_year" value=' + create_date.year + '><input type="hidden" name="c_month" value=' + create_date.month + '><caption><span class="calendar_header">' + create_date.year + '年 ' + create_date.month + '月</span></caption><tr><th class="header">周日</th><th class="header">周一</th><th class="header">周二</th><th class="header">周三</th><th class="header">周四</th><th class="header">周五</th><th class="header">周六</th></tr>';
                // 第一层循环，按行数
                for (var i = 0; i < create_date.tr_nums; i++) {
                    str += '<tr>';
                    // 第二层循环，按每行七天
                    for (var j = 0; j < 7; j++) {
                        // 计算此处的循环数
                        var idx = 7 * i + j;
                        // 此处的循环数减去当月第一天的星期数
                        // 用于判断此处的天数是否存在
                        var date = idx - create_date.first_day_of_week + 1;
                        var class_name = '';
                        // 用于判断此处的天数是否存在或超过本月最大天数
                        // 不存在或者超过本月最大天数则为空格符
                        if (date <= 0 || date > create_date.fullMonthDay) {
                            date = '&nbsp';
                        } else {
                            date = idx - create_date.first_day_of_week + 1;
                        }
                        // 用于判断此处的天数是否过期，选择不同的类名
                        date < create_date.day ? class_name = 'pass' : class_name = 'day active feature';
                        // 再次判断 如果循环数大于等于本月第一日星期数+本月天数 则该格子类为置灰
                        if (idx >= create_date.fullMonthDay + create_date.first_day_of_week || idx < create_date.first_day_of_week) class_name = 'pass';
                        // 拼接每日html字符串
                        // 判断价格是否存在而拼接不同字符串
                        if (month_price != null && month_price[date] && month_num == create_date.month) {
                            str += '<td class="' + class_name + '" data-date="' + create_date.year + '-' + create_date.month + '-' + date + '" price="" num=""><p>' + date + '</p><span class="dateprice">￥' + month_price[date] + '<span>起</span></span></td>'
                        } else {
                            str += '<td class="' + class_name + '" data-date="' + create_date.year + '-' + create_date.month + '-' + date + '" price="" num=""><p>' + date + '</p></td>'
                        }
                    }
                    str += '</tr>'
                }
                str += '</tbody></table>'
                    // 渲染每月日历
                return str;
            }
            // 根据年月返回月天数
            function getFullMonthDay(year, month) {
                var month_hash1 = {
                    1: 31,
                    2: 28,
                    3: 31,
                    4: 30,
                    5: 31,
                    6: 30,
                    7: 31,
                    8: 31,
                    9: 30,
                    10: 31,
                    11: 30,
                    12: 31
                }
                var month_hash2 = {
                    1: 31,
                    2: 29,
                    3: 31,
                    4: 30,
                    5: 31,
                    6: 30,
                    7: 31,
                    8: 31,
                    9: 30,
                    10: 31,
                    11: 30,
                    12: 31
                }
                if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
                    return month_hash2[month];
                } else {

                    return month_hash1[month];
                }
            }


        }

        function getWeekDay(num) {
            var week_day = {
                0: "周日",
                1: "周一",
                2: "周二",
                3: "周三",
                4: "周四",
                5: "周五",
                6: "周六"
            }

            return week_day[num];
        }
        // 增加一天
        function addDays(num,time){
                var single = 86400000;
                time = new Date(time);
                time = time.getTime() + num * single;
                return new Date(time);
        }
    })($);
