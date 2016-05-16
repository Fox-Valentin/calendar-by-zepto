/*!
 * jQuery Password Strength plugin for Twitter Bootstrap
 *
 * Copyright (c) 2008-2013 Tane Piper
 * Copyright (c) 2013 Alejandro Blanco
 * Dual licensed under the MIT and GPL licenses.
 */

(function(e) {
    var t = {};
    try {
        if (!e && module && module.exports) {
            var e = require("jquery"),
                n = require("jsdom").jsdom;
            e = e(n().parentWindow)
        }
    } catch (r) {}(function(e, t) {
        var n = {};
        t.forbiddenSequences = ["0123456789", "abcdefghijklmnopqrstuvwxyz", "qwertyuiop", "asdfghjkl", "zxcvbnm", "!@#$%^&*()_+"], n.wordNotEmail = function(e, t, n) {
            return t.match(/^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i) ? n : 0
        }, n.wordLength = function(e, t, n) {
            var r = t.length,
                i = Math.pow(r, e.rules.raisePower);
            return r < e.common.minChar && (i += n), i
        }, n.wordSimilarToUsername = function(t, n, r) {
            var i = e(t.common.usernameField).val();
            return i && n.toLowerCase().match(i.toLowerCase()) ? r : 0
        }, n.wordTwoCharacterClasses = function(e, t, n) {
            return t.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) || t.match(/([a-zA-Z])/) && t.match(/([0-9])/) || t.match(/(.[!,@,#,$,%,\^,&,*,?,_,~])/) && t.match(/[a-zA-Z0-9_]/) ? n : 0
        }, n.wordRepetitions = function(e, t, n) {
            return t.match(/(.)\1\1/) ? n : 0
        }, n.wordSequences = function(n, r, i) {
            var s = !1,
                o;
            if (r.length > 2) {
                e.each(t.forbiddenSequences, function(t, n) {
                    var i = [n, n.split("").reverse().join("")];
                    e.each(i, function(e, t) {
                        for (o = 0; o < r.length - 4; o += 1) t.indexOf(r.toLowerCase().substring(o, o + 3)) > -1 && (s = !0)
                    })
                });
                if (s) return i
            }
            return 0
        }, n.wordLowercase = function(e, t, n) {
            return t.match(/[a-z]/) && n
        }, n.wordUppercase = function(e, t, n) {
            return t.match(/[A-Z]/) && n
        }, n.wordOneNumber = function(e, t, n) {
            return t.match(/\d+/) && n
        }, n.wordThreeNumbers = function(e, t, n) {
            return t.match(/(.*[0-9].*[0-9].*[0-9])/) && n
        }, n.wordOneSpecialChar = function(e, t, n) {
            return t.match(/.[!,@,#,$,%,\^,&,*,?,_,~]/) && n
        }, n.wordTwoSpecialChar = function(e, t, n) {
            return t.match(/(.*[!,@,#,$,%,\^,&,*,?,_,~].*[!,@,#,$,%,\^,&,*,?,_,~])/) && n
        }, n.wordUpperLowerCombo = function(e, t, n) {
            return t.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) && n
        }, n.wordLetterNumberCombo = function(e, t, n) {
            return t.match(/([a-zA-Z])/) && t.match(/([0-9])/) && n
        }, n.wordLetterNumberCharCombo = function(e, t, n) {
            return t.match(/([a-zA-Z0-9].*[!,@,#,$,%,\^,&,*,?,_,~])|([!,@,#,$,%,\^,&,*,?,_,~].*[a-zA-Z0-9])/) && n
        }, t.validation = n, t.executeRules = function(n, r) {
            var i = 0;
            return e.each(n.rules.activated, function(s, o) {
                if (o) {
                    var u = n.rules.scores[s],
                        a = t.validation[s],
                        f, l;
                    e.isFunction(a) || (a = n.rules.extra[s]);
                    if (e.isFunction(a)) {
                        f = a(n, r, u), f && (i += f);
                        if (f < 0  && !f) l = n.ui.spanError(n, s), l.length > 0 && n.instances.errors.push(l)
                    }
                }
            }), i
        }
    })(e, t);
    try {
        module && module.exports && (module.exports = t)
    } catch (r) {}
    var i = {};
    i.common = {}, i.common.minChar = 6, i.common.usernameField = "#username", i.common.userInputs = [], i.common.onLoad = undefined, i.common.onKeyUp = undefined, i.common.zxcvbn = !1, i.common.debug = !1, i.rules = {}, i.rules.extra = {}, i.rules.scores = {
        wordNotEmail: -100,
        wordLength: -50,
        wordSimilarToUsername: -100,
        wordSequences: -50,
        wordTwoCharacterClasses: 2,
        wordRepetitions: -25,
        wordLowercase: 1,
        wordUppercase: 3,
        wordOneNumber: 3,
        wordThreeNumbers: 5,
        wordOneSpecialChar: 3,
        wordTwoSpecialChar: 5,
        wordUpperLowerCombo: 2,
        wordLetterNumberCombo: 2,
        wordLetterNumberCharCombo: 2
    }, i.rules.activated = {
        wordNotEmail: !1,
        wordLength: !0,
        wordSimilarToUsername: !0,
        wordSequences: !0,
        wordTwoCharacterClasses: !1,
        wordRepetitions: !1,
        wordLowercase: !0,
        wordUppercase: !0,
        wordOneNumber: !0,
        wordThreeNumbers: !0,
        wordOneSpecialChar: !0,
        wordTwoSpecialChar: !0,
        wordUpperLowerCombo: !0,
        wordLetterNumberCombo: !0,
        wordLetterNumberCharCombo: !0
    }, i.rules.raisePower = 1.4, i.ui = {}, i.ui.bootstrap2 = !1, i.ui.showProgressBar = !0, i.ui.showPopover = !1, i.ui.showStatus = !1, i.ui.spanError = function(e, t) {
        var n = e.ui.errorMessages[t];
        return n ? '<span style="color: #d52929">' + n + "</span>" : ""
    }, i.ui.popoverError = function(t) {
        var n = "<div>Errors:<ul class='error-list' style='margin-bottom: 0;'>";
        return e.each(t, function(e, t) {
            n += "<li>" + t + "</li>"
        }), n += "</ul></div>", n
    }, i.ui.errorMessages = {
        wordLength: "您的密码太短！",
        wordNotEmail: "请不要使用邮箱号作为密码",
        wordSimilarToUsername: "您的密码不能包含您的用户名",
        wordTwoCharacterClasses: "请使用不同的字符类型组合",
        wordRepetitions: "密码包含太多的重复字符",
        wordSequences: "请不要使用连续的字符"
    }, i.ui.verdicts = ["弱", "中", "中", "强", "强"], i.ui.showVerdicts = !0, i.ui.showVerdictsInsideProgressBar = !1, i.ui.showErrors = !1, i.ui.container = undefined, i.ui.viewports = {
        progress: undefined,
        verdict: undefined,
        errors: undefined
    }, i.ui.scores = [14, 26, 38, 50];
    var s = {};
    (function(e, t) {
        var n = ["danger", "warning", "success"],
            r = ["error", "warning", "success"];
        t.getContainer = function(t, n) {
            var r;
            r = e(t.ui.container);
            if (!r || r.length !== 1) r = n.parent();
            return r
        }, t.findElement = function(e, t, n) {
            return t ? e.find(t).find(n) : e.find(n)
        }, t.getUIElements = function(e, n) {
            var r, i;
            return e.instances.viewports ? e.instances.viewports : (r = t.getContainer(e, n), i = {}, i.$progressbar = t.findElement(r, e.ui.viewports.progress, "div.progress"), e.ui.showVerdictsInsideProgressBar && (i.$verdict = i.$progressbar.find("span.password-verdict")), e.ui.showPopover || (e.ui.showVerdictsInsideProgressBar || (i.$verdict = t.findElement(r, e.ui.viewports.verdict, "span.password-verdict")), i.$errors = t.findElement(r, e.ui.viewports.errors, "ul.error-list")), e.instances.viewports = i, i)
        }, t.initProgressBar = function(n, r) {
            var i = t.getContainer(n, r),
                s = "<div class='progress'><div class='";
            n.ui.bootstrap2 || (s += "progress-"), s += "bar'>", n.ui.showVerdictsInsideProgressBar && (s += "<span class='password-verdict'>弱</span>"), s += "</div></div>", n.ui.viewports.progress ? i.find(n.ui.viewports.progress).append(s) : e(s).insertAfter(r)
        }, t.initHelper = function(n, r, i, s) {
            var o = t.getContainer(n, r);
            s ? o.find(s).append(i) : e(i).insertAfter(r)
        }, t.initVerdict = function(e, n) {
            t.initHelper(e, n, "<span class='password-verdict'>弱</span>", e.ui.viewports.verdict)
        }, t.initErrorList = function(e, n) {
            t.initHelper(e, n, "<ul class='error-list'></ul>", e.ui.viewports.errors)
        }, t.initPopover = function(e, t) {
            t.popover("destroy"), t.popover({
                html: !0,
                placement: "bottom",
                trigger: "manual",
                content: " "
            })
        }, t.initUI = function(e, n) {
            e.ui.showPopover ? t.initPopover(e, n) : (e.ui.showErrors && t.initErrorList(e, n), e.ui.showVerdicts && !e.ui.showVerdictsInsideProgressBar && t.initVerdict(e, n)), e.ui.showProgressBar && t.initProgressBar(e, n)
        }, t.possibleProgressBarClasses = ["danger", "warning", "success"], t.updateProgressBar = function(r, i, s, o) {
            var u = t.getUIElements(r, i).$progressbar,
                a = u.find(".progress-bar"),
                f = "progress-";
            r.ui.bootstrap2 && (a = u.find(".bar"), f = ""), e.each(t.possibleProgressBarClasses, function(e, t) {
                a.removeClass(f + "bar-" + t)
            }), a.addClass(f + "bar-" + n[s]), a.css("width", o + "%")
        }, t.updateVerdict = function(e, n, r) {
            var i = t.getUIElements(e, n).$verdict;
            i.text(r)
        }, t.updateErrors = function(n, r) {
            var i = t.getUIElements(n, r).$errors,
                s = "";
            e.each(n.instances.errors, function(e, t) {
                s += "<li>" + t + "</li>"
            }), i.html(s)
        }, t.updatePopover = function(e, t, n) {
            var r = t.data("bs.popover"),
                i = "",
                s = !0;
            e.ui.showVerdicts && !e.ui.showVerdictsInsideProgressBar && n.length > 0 && (i = "<h5><span class='password-verdict'>" + n + "</span></h5>", s = !1), e.ui.showErrors && (e.instances.errors.length > 0 && (s = !1), i += e.ui.popoverError(e.instances.errors));
            if (s) {
                t.popover("hide");
                return
            }
            e.ui.bootstrap2 && (r = t.data("popover")), r.$arrow && r.$arrow.parents("body").length > 0 ? t.find("+ .popover .popover-content").html(i) : (r.options.content = i, t.popover("show"))
        }, t.updateFieldStatus = function(t, n, i) {
            var s = t.ui.bootstrap2 ? ".control-group" : ".jm-login-item",
                o = n.parents(s).first();
            e.each(r, function(e, n) {
                t.ui.bootstrap2 || (n = "has-" + n), o.removeClass(n)
            }), i = r[i], t.ui.bootstrap2 || (i = "has-" + i), o.addClass(i)
        }, t.percentage = function(e, t) {
            var n = Math.floor(100 * e / t);
            return n = n < 0 ? 0 : n, n = n > 100 ? 100 : n, n
        }, t.getVerdictAndCssClass = function(e, t) {
            var n, r, i;
            return t <= 0 ? (n = 0, i = -1, r = e.ui.verdicts[0]) : t < e.ui.scores[0] ? (n = 0, i = 1, r = e.ui.verdicts[0]) : t < e.ui.scores[1] ? (n = 1, i = 1, r = e.ui.verdicts[1]) : t < e.ui.scores[2] ? (n = 1, i = 2, r = e.ui.verdicts[2]) : t < e.ui.scores[3] ? (n = 1, i = 3, r = e.ui.verdicts[3]) : (n = 2, i = 4, r = e.ui.verdicts[4]), [r, n, i]
        }, t.updateUI = function(e, n, r) {
            var i, s, o;
            i = t.getVerdictAndCssClass(e, r), o = i[0], i = i[1], e.ui.showProgressBar && (s = t.percentage(r, e.ui.scores[3]), t.updateProgressBar(e, n, i, s), e.ui.showVerdictsInsideProgressBar && t.updateVerdict(e, n, o)), e.ui.showStatus && t.updateFieldStatus(e, n, i), e.ui.showPopover ? t.updatePopover(e, n, o) : (e.ui.showVerdicts && !e.ui.showVerdictsInsideProgressBar && t.updateVerdict(e, n, o), e.ui.showErrors && t.updateErrors(e, n))
        }
    })(e, s);
    var o = {};
    (function(e, n) {
        var r, o;
        r = function(n) {
            var r = e(n.target),
                i = r.data("pwstrength-bootstrap"),
                o = r.val(),
                u, a, f, l;
            if (i === undefined) return;
            i.instances.errors = [], i.common.zxcvbn ? (u = [], e.each(i.common.userInputs, function(t, n) {
                u.push(e(n).val())
            }), u.push(e(i.common.usernameField).val()), l = zxcvbn(o, u).entropy) : l = t.executeRules(i, o), s.updateUI(i, r, l), a = s.getVerdictAndCssClass(i, l), f = a[2], a = a[0], i.common.debug && console.log(l + " - " + a), e.isFunction(i.common.onKeyUp) && i.common.onKeyUp(n, {
                score: l,
                verdictText: a,
                verdictLevel: f
            })
        }, n.init = function(t) {
            return this.each(function(n, o) {
                var u = e.extend(!0, {}, i),
                    a = e.extend(!0, u, t),
                    f = e(o);
                a.instances = {}, f.data("pwstrength-bootstrap", a), f.on("keyup", r), f.on("change", r), f.on("onpaste", r), s.initUI(a, f), e.trim(f.val()) && f.trigger("keyup"), e.isFunction(a.common.onLoad) && a.common.onLoad()
            }), this
        }, n.destroy = function() {
            this.each(function(t, n) {
                var r = e(n),
                    i = r.data("pwstrength-bootstrap"),
                    o = s.getUIElements(i, r);
                o.$progressbar.remove(), o.$verdict.remove(), o.$errors.remove(), r.removeData("pwstrength-bootstrap")
            })
        }, n.forceUpdate = function() {
            this.each(function(e, t) {
                var n = {
                    target: t
                };
                r(n)
            })
        }, n.addRule = function(t, n, r, i) {
            this.each(function(s, o) {
                var u = e(o).data("pwstrength-bootstrap");
                u.rules.activated[t] = i, u.rules.scores[t] = r, u.rules.extra[t] = n
            })
        }, o = function(t, n, r) {
            this.each(function(i, s) {
                e(s).data("pwstrength-bootstrap").rules[n][t] = r
            })
        }, n.changeScore = function(e, t) {
            o.call(this, e, "scores", t)
        }, n.ruleActive = function(e, t) {
            o.call(this, e, "activated", t)
        }, e.fn.pwstrength = function(t) {
            var r;
            return n[t] ? r = n[t].apply(this, Array.prototype.slice.call(arguments, 1)) : typeof t == "object" || !t ? r = n.init.apply(this, arguments) : e.error("Method " + t + " does not exist on jQuery.pwstrength-bootstrap"), r
        }
    })(e, o)
})($);
