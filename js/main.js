/***
 * 系统全局使用公共变量和接口方法
 */

/*****************************************************************
 权限数据通用方法
 *****************************************************************/
/**
 * 设置cookie的方法
 * @param c_name
 * @param value
 * @param expiredays
 */
function setCookie(c_name, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + escape(value) +
        ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}
/**
 * 获取cookie的方法
 * @param c_name
 * @returns {*}
 */
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}
/**
 *读取字典项
 */
//function loadDict(zdName,value2,key,obj){
//    var zdList = $.cookie(zdName);
//    if(isNotNull(zdList)){
//        return eval(zdList);
//    }else{
//        $.post("/main/getDictByType",{dictType:zdName},function(data){
//            if(data!=null){
//                $.cookie(zdName, JSON.stringify(data));//setCookie(zdName, JSON.stringify(data));
//                var zdx  =eval(data);
//            }else{
//                return [];
//            }
//        });
//    }
//}
/**
 * 初始化权限数据
 *全局的权限数据变量
 *authority;（cookie中的代码）
 */
function loadAuthority() {
    $.post("getAuth", {}, function (data) {
        setCookie("authority", JSON.stringify(data));
    });
}
/**
 * 获取权限数据：需要用权限的模块在引用main.js后调用该无参方法，
 * @returns {*}返回JSON格式的权限数据。
 */
function getAuthority() {
    var authority = getCookie("authority");
    if (authority != null && authority != '')
        return JSON.parse(authority);
    else
        return null;
}


/*****************************************************************
 前端规则的具体实现
 *****************************************************************/
jQuery.fn.makeTip = function (obj,msg) {
    //$(this).simpletooltip({
    //    position: 'bottom',
    //    border_color: 'red',
    //    color: 'red',
    //    background_color: 'white',
    //    border_width: 1,
    //    title: msg
    //});
    $(this).parent().append("<span class='invalidtip' style='line-height:20px;color:red;width:100%;padding-lerf:5px;'>"+msg+"</span>");
}

/**
 * 非空验证
 *
 * @param num
 * @return
 * @author
 */
function notNull(o) {
    var obj = $(o);
    var type = obj.prop("tagName");

    if (type == "DIV") {
        //div对象需要取下级的checkbox或radio
        if (obj.find('input[type=checkbox]:checked').length > 0
            || obj.find('input[type=radio]:checked').length > 0) {
            $(o).removeClass("n-invalid");
            //$(o).attr("title", "");
            return true;
        } else {
            $(o).addClass("n-invalid");
            $(o).makeTip( $(o),"不可为空");
            return false;
        }
    } else {
        //其他控件
        if (o == null || $(o).val() == "") {
            $(o).addClass("n-invalid");
            $(o).makeTip( $(o),"不可为空");
            return false;
        } else {
            $(o).removeClass("n-invalid");
            //$(o).attr("title", "");
            return true;
        }
    }
}
/**
 * 判断整数num是否等于0
 *
 * @param num
 * @return
 * @author jiqinlin
 */
function isIntEqZero(o) {
    if (o == null || $(o).val() == "")
        return false;
    var num = $(o).val();
    if (num == 0) {
        $(o).removeClass("TextBoxErr");
        $(o).attr("title", "");
        return true;
    } else {
        $(o).addClass("TextBoxErr");
        $(o).attr("title", "数字不可为0");
        //alert("整数不等于0");
        $(o).val('');
        $(o).focus();
        return false;
    }
}
/**
 * 判断整数num是否大于0
 *
 * @param num
 * @return
 * @author jiqinlin
 */
function isIntGtZero(o) {
    if (o == null || $(o).val() == "")
        return false;
    var num = $(o).val();
    if (num > 0) {
        $(o).removeClass("TextBoxErr");
        $(o).attr("title", "");
        return true;
    } else {
        $(o).addClass("TextBoxErr");
        $(o).attr("title", "数字需大于0");
        //alert("整数需大于0");
        $(o).val('');
        $(o).focus();
        return false;
    }
}
/**
 * 判断整数num是否大于或等于0
 *
 * @param num
 * @return
 * @author jiqinlin
 */
function isIntGteZero(o) {
    if (o == null || $(o).val() == "")
        return false;
    var num = $(o).val();
    if (num >= 0) {
        $(o).removeClass("TextBoxErr");
        $(o).attr("title", "");
        return true;
    } else {
        $(o).addClass("TextBoxErr");
        $(o).attr("title", "整数需不小于0");
        //alert("整数需不小于0");
        $(o).val('');
        $(o).focus();
        return false;
    }
}
/**deprecated
 * 判断浮点数num是否等于0
 *
 * @param num 浮点数
 * @return
 * @author jiqinlin
 */
//function isFloatEqZero(num) {
//    return num == 0;
//}
/**deprecated
 * 判断浮点数num是否大于0
 *
 * @param num 浮点数
 * @return
 * @author jiqinlin
 */
//function isFloatGtZero(num) {
//    return num > 0;
//}
/**deprecated
 * 判断浮点数num是否大于或等于0
 *
 * @param num 浮点数
 * @return
 * @author jiqinlin
 */
//function isFloatGteZero(num) {
//    return num >= 0;
//}
/**
 * 匹配Email地址
 */
function isEmail(o) {
    if (o == null || $(o).val() == "")
        return false;
    var str = $(o).val();
    //if (str == null || str == "") return false;
    var result = str.match(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
    if (result == null) {
        $(o).addClass("TextBoxErr");
        $(o).attr("title", "请输出正确格式的Email地址");
        //alert("请输出正确格式的Email地址");
        $(o).val('');
        $(o).focus();
        return false;
    } else {
        $(o).removeClass("TextBoxErr");
        $(o).attr("title", "");
        return true;
    }

}
/**
 * 判断数值类型，包括整数和浮点数
 */
function isNumber(o) {
    if (o == null || $(o).val() == "")
        return false;
    var str = $(o).val();
    var result1 = str.match(/^[-\+]?\d+$/);
    var result2 = str.match(/^[-\+]?\d+(\.\d+)?$/);
    if (result1 == null && result2 == null) {
        $(o).addClass("TextBoxErr");
        $(o).attr("title", "请输出数字");
        //alert("只能为整数和浮点数");
        $(o).val('');
        $(o).focus();
        return false;
    } else {
        $(o).removeClass("TextBoxErr");
        $(o).attr("title", "");
        return true;
    }
}
/**
 * 只能输入数字[0-9]
 */
function isDigits(o) {
    if (o == null || $(o).val() == "")
        return false;
    var str = $(o).val();
    var result = str.match(/^\d+$/);
    if (result == null) {
        $(o).addClass("TextBoxErr");
        $(o).attr("title", "请输入数字0-9");
        //alert("只能输入数字0-9");
        $(o).val('');
        $(o).focus();
        return false;
    } else {
        $(o).removeClass("TextBoxErr");
        $(o).attr("title", "");
        return true;
    }
}
/**
 * 匹配phone
 */
function isPhone(o) {
    if (o == null || $(o).val() == "")
        return false;
    var str = $(o).val();
    //if (str == null || str == "") return false;
    var result = str.match(/^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/);
    if (result == null) {
        $(o).addClass("TextBoxErr");
        $(o).attr("title", "请输出正确的固定电话号码");
        //alert("请输出正确的固定电话号码");
        $(o).val('');
        $(o).focus();
        return false;
    } else {
        $(o).removeClass("TextBoxErr");
        $(o).attr("title", "");
        return true;
    }
}
/**
 * 匹配mobile
 */
function isMobile(o) {
    if (o == null || $(o).val() == "")
        return false;
    var str = $(o).val();
    //if (str == null || str == "") return false;
    var result = str.match(/^((\(\d{2,3}\))|(\d{3}\-))?((13\d{9})|(15\d{9})|(18\d{9}))$/);
    if (result == null) {
        $(o).addClass("TextBoxErr");
        $(o).attr("title", "请输出正确的移动电话号码");
        //alert("请输出正确的移动电话号码");
        $(o).val('');
        $(o).focus();
        return false;
    } else {
        $(o).removeClass("TextBoxErr");
        $(o).attr("title", "");
        return true;
    }
}
/**
 * 联系电话(手机/电话皆可)验证
 */
function isTel(o) {
    if (o == null || $(o).val() == "")
        return false;
    var str = $(o).val();
    //if (str == null || str == "") return false;
    var result1 = str.match(/^((\(\d{2,3}\))|(\d{3}\-))?((13\d{9})|(15\d{9})|(18\d{9}))$/);
    var result2 = str.match(/^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/);
    if (result1 == null && result2 == null) {
        $(o).addClass("TextBoxErr");
        $(o).attr("title", "请输出正确的电话号码");
        //alert("请输出正确的电话号码");
        $(o).val('');
        $(o).focus();
        return false;
    } else {
        $(o).removeClass("TextBoxErr");
        $(o).attr("title", "");
        return true;
    }
}
/**
 * 匹配qq
 */
function isQq(o) {
    if (o == null || $(o).val() == "")
        return false;
    var str = $(o).val();
    //if (str == null || str == "") return false;
    var result = str.match(/^[1-9]\d{4,12}$/);
    if (result == null) {
        $(o).addClass("TextBoxErr");
        $(o).attr("title", "请输出正确的QQ号");
        //alert("请输出正确的QQ号");
        $(o).val('');
        $(o).focus();
        return false;
    } else {
        $(o).removeClass("TextBoxErr");
        $(o).attr("title", "");
        return true;
    }

}
/**
 * 匹配english
 */
function isEnglish(str) {
    if (o == null || $(o).val() == "")
        return false;
    var str = $(o).val();
    //if (str == null || str == "") return false;
    var result = str.match(/^[A-Za-z]+$/);
    if (result == null) {
        $(o).addClass("TextBoxErr");
        $(o).attr("title", "请输入英文字母");
        //alert("请输入英文");
        $(o).val('');
        $(o).focus();
        return false;
    } else {
        $(o).removeClass("TextBoxErr");
        $(o).attr("title", "");
        return true;
    }
}
/**
 * 匹配integer
 */
function isInteger(o) {
    if (o == null || $(o).val() == "")
        return false;
    var str = $(o).val();
    //if (str == null || str == "") return false;
    var result = str.match(/^[-\+]?\d+$/);
    if (result == null) {
        $(o).addClass("TextBoxErr");
        $(o).attr("title", "请输入整数");
        //alert("请输出整数");
        $(o).val('');
        $(o).focus();
        return false;
    } else {
        $(o).removeClass("TextBoxErr");
        $(o).attr("title", "");
        return true;
    }
}
/**
 * 匹配double或float
 */
function isDouble(o) {
    if (o == null || $(o).val() == "")
        return false;
    var str = $(o).val();
    //if (str == null || str == "") return false;
    var result = str.match(/^[-\+]?\d+(\.\d+)?$/);
    if (result == null) {
        $(o).addClass("TextBoxErr");
        $(o).attr("title", "请输入小数");
        //alert("请输出浮点数");
        $(o).val('');
        $(o).focus();
        return false;
    } else {
        $(o).removeClass("TextBoxErr");
        $(o).attr("title", "");
        return true;
    }
}
/**
 * 匹配邮政编码
 */
function isZipCode(o) {
    if (o == null || $(o).val() == "")
        return false;
    var str = $(o).val();
    //if (str == null || str == "") return false;
    var result = str.match(/^[0-9]{6}$/);
    if (result == null) {
        $(o).addClass("TextBoxErr");
        $(o).attr("title", "请输出正确的邮政编码");
        //alert("请输出正确的邮政编码");
        $(o).val('');
        $(o).focus();
        return false;
    } else {
        $(o).removeClass("TextBoxErr");
        $(o).attr("title", "");
        return true;
    }
}
/**
 * 匹配URL
 */
function isUrl(o) {
    if (o == null || $(o).val() == "")
        return false;
    var str = $(o).val();
    //if (str == null || str == "") return false;
    var result = str.match(/^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\’:+!]*([^<>\"])*$/);
    if (result == null) {
        $(o).addClass("TextBoxErr");
        $(o).attr("title", "请输出正确的URL地址");
        //alert("请输出正确的URL地址");
        $(o).val('');
        $(o).focus();
        return false;
    } else {
        $(o).removeClass("TextBoxErr");
        $(o).attr("title", "");
        return true;
    }
}
/**deprecated
 * 匹配密码，以字母开头，长度在6-12之间，只能包含字符、数字和下划线。
 */
//function isPwd(str) {
//    if (str == null || str == "") return false;
//    var result = str.match(/^[a-zA-Z]\\w{6,12}$/);
//    if (result == null)return false;
//    return true;
//}
/**
 * 判断是否为合法字符(a-zA-Z0-9-_)
 */
function isRightfulString(o) {
    if (o == null || $(o).val() == "")
        return false;
    var str = $(o).val();
    //if (str == null || str == "") return false;
    var result = str.match(/^[A-Za-z0-9_-]+$/);
    if (result == null) {
        $(o).addClass("TextBoxErr");
        $(o).attr("title", "请输出合法的字符（英文或者数字）");
        //alert("请输出合法的字符（英文或者数字）");
        $(o).val('');
        $(o).focus();
        return false;
    } else {
        $(o).removeClass("TextBoxErr");
        $(o).attr("title", "");
        return true;
    }
}
/**
 * 匹配身份证号码
 */
function isIdCardNo(o) {
    if (o == null || $(o).val() == "")
        return false;
    var num = $(o).val();
    var len = num.length, re;
    if (len == 15)
        re = new RegExp(/^(\d{6})()?(\d{2})(\d{2})(\d{2})(\d{2})(\w)$/);
    else if (len == 18)re = new RegExp(/^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/);
    else {
        alert("输入的数字位数不对。");
        return false;
    }
    var a = num.match(re);
    if (a != null) {
        if (len == 15) {
            var D = new Date("19" + a[3] + "/" + a[4] + "/" + a[5]);
            var B = D.getYear() == a[3] && (D.getMonth() + 1) == a[4] && D.getDate() == a[5];
        } else {
            var D = new Date(a[3] + "/" + a[4] + "/" + a[5]);
            var B = D.getFullYear() == a[3] && (D.getMonth() + 1) == a[4] && D.getDate() == a[5];
        }
        if (!B) {
            alert("输入的身份证号 " + a[0] + " 里出生日期不对。");
            return false;
        }
    }
    if (!re.test(num)) {
        alert("身份证最后一位只能是数字和字母。");
        return false;
    } else {
        $(o).removeClass("TextBoxErr");
        $(o).attr("title", "");
        return true;
    }
}
/**
 * 匹配汉字
 */
function isChinese(o) {
    if (o == null || $(o).val() == "")
        return false;
    var str = $(o).val();
    var result = str.match(/^[\u4e00-\u9fa5]+$/);
    if (result == null) {
        $(o).addClass("TextBoxErr");
        $(o).attr("title", "请输入中文汉字");
        //alert("请输出中文");
        $(o).val('');
        $(o).focus();
        return false;
    } else {
        $(o).removeClass("TextBoxErr");
        $(o).attr("title", "");
        return true;
    }
}
/**
 * 匹配中文(包括汉字和字符)
 */
function isChineseChar(o) {
    if (o == null || $(o).val() == "")
        return false;
    var str = $(o).val();
    //if (str == null || str == "") return false;
    var result = str.match(/^[\u0391-\uFFE5]+$/);
    if (result == null) {
        $(o).addClass("TextBoxErr");
        $(o).attr("title", "请输入中文（汉字和字符）");
        //alert("请输出中文（汉字和字符）");
        $(o).val('');
        $(o).focus();
        return false;
    } else {
        $(o).removeClass("TextBoxErr");
        $(o).attr("title", "");
        return true;
    }
}
/**
 * 字符验证，只能包含中文、英文、数字、下划线等字符。
 */
function stringCheck(o) {
    if (o == null || $(o).val() == "")
        return false;
    var str = $(o).val();
    //if (str == null || str == "") return false;
    var result = str.match(/^[a-zA-Z0-9\u4e00-\u9fa5-_]+$/);
    if (result == null) {
        $(o).addClass("TextBoxErr");
        $(o).attr("title", "请输入中文、英文、数字、下划线等字符");
        //alert("请输出中文、英文、数字、下划线等字符");
        $(o).val('');
        $(o).focus();
        return false;
    } else {
        $(o).removeClass("TextBoxErr");
        $(o).attr("title", "");
        return true;
    }
}
/**deprecated
 * 过滤中英文特殊字符，除英文"-_"字符外
 */
//function stringFilter(str) {
//    var pattern = new RegExp("[`~!@#$%^&*()+=|{}':;',\\[\\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]");
//    var rs = "";
//    for (var i = 0; i < str.length; i++) {
//        rs = rs + str.substr(i, 1).replace(pattern, '');
//    }
//    return rs;
//}
/**
 * 判断是否包含中英文特殊字符，除英文"-_"字符外
 */
//function isContainsSpecialChar(str) {
//    if (str == null || str == "") return false;
//    var reg = RegExp(/[(\ )(\`)(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\+)(\=)(\|)(\{)(\})(\')(\:)(\;)(\')(',)(\[)(\])(\.)(\<)(\>)(\/)(\?)(\~)(\！)(\@)(\#)(\￥)(\%)(\…)(\&)(\*)(\（)(\）)(\—)(\+)(\|)(\{)(\})(\【)(\】)(\‘)(\；)(\：)(\”)(\“)(\’)(\。)(\，)(\、)(\？)]+/);
//    return reg.test(str);
//}
/**deprecated
 * 验证身份证
 */
//function isCardNo(card) {
//    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
//    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
//    if (reg.test(card) === false) {
//        alert("身份证输入不合法");
//        return false;
//    }
//}
/**
 * 验证是否是时间^\d{4}(\-|\/|\.)\d{1,2}\1\d{1,2}$
 * /^(\d+)(-|\/)(\d{1,2})(-|\/)(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/
 */
function isDateTime(str) {
    var result1 = str.match(/^(\d{4})(-|\/)(\d{1,2})2(\d{1,2})$/);//判断年月日
    var result2 = str.match(/^(\d{4})(-|\/)(\d{1,2})(-|\/)(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/);//判断年月日 时分秒
    var result3 = str.match(/^(\d{1,2}):(\d{1,2}):(\d{1,2})$/);//判断时分秒
    if (result1 == null && result2 == null && result3 == null)
        return false;
    return true;
}

/**
 *获取当前时间
 */
function getNow(length) {
    var now = new Date();
    var year = now.getFullYear();
    var month = fillZero(now.getMonth() + 1);
    var day = fillZero(now.getDate());
    var hours = fillZero(now.getHours());
    var minutes = fillZero(now.getMinutes());
    var seconds = fillZero(now.getSeconds());
    if (length >= 19) {
        return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    } else if (length <= 8 && length > 0) {
        return hours + ":" + minutes + ":" + seconds;
    } else {
        return year + "-" + month + "-" + day;
    }
}

//完善时间格式函数
function fillZero(num) {
    if (num < 10) {
        return "0" + num;
    } else {
        return num;
    }

}

function getDateRex(length) {
    if (length >= 19) {
        return "%y-%M-%d %H:%m:%s";
    } else if (length <= 8 && length > 0) {
        return "%H:%m:%s";
    }
}
//计算两个日期的时间差
function compareDate(startDate, endDate) {
    if (isNotNull(startDate) && isNotNull(endDate)) {
        var startTime = (new Date(startDate)).getTime();//传过来的开始时间转换为毫秒
        var endTime = (new Date(endDate)).getTime();
        var result = (startTime - endTime) / 24 / 60 / 60 / 1000;
        if (result >= 0) {
            return result;
        }
    }
}
//判断对象不是null也不是空字符串
function isNotNull(str) {
    return str != null && str != '';
}

//汉字转码
function encode(val) {
    return encodeURI(encodeURI(val));
}


/**
 * 回车事件
 * @param fn
 */
function regEnter(fn) {
    document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 13) { // enter 键
            if (!$('span.pControl input[type="text"]').is(":focus"))
                fn();
            return false;
        }
    };
}

//替换指定传入参数的值,paramName为参数,replaceWith为新值
function replaceParamVal(paramName, replaceWith) {
    var oUrl = this.location.href.toString();
    var re = eval('/(' + paramName + '=)([^&]*)/gi');
    var nUrl = oUrl.replace(re, paramName + '=' + replaceWith);
    this.location = nUrl;
}
/*****************************************************************
 获取页面传参工具方法"2015-11-16 13:13:13".match(/^(d{4})(-)(d{2})(-)(d{2}) (d{2}):(d{2}):(d{2})$/)
 *****************************************************************/

/**
 * 采用正则表达式获取地址栏参数
 * @param name
 * @returns {*}
 * @constructor
 */
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}

function GetParentQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = document.referrer.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}

function GetParQueryString() {
    var query = window.location.search;
    if (query.indexOf("&") > -1) {
        query = query.substr(query.indexOf('&') + 1, query.length);
        if (query != null)return unescape(query);
    }
    return null;
}

/**
 * 截取字符串,后面多的显示省略号
 * @param data
 * @param length
 * @returns {*}
 */
function getSubStr(data, length) {
    if (data != null && "" != data && data.length > length) {
        return data.substring(0, length) + "...";
    } else {
        return data;
    }
}

window.forms = {
    addAttachment: function (grid, uuid, data, isWorkFlow, options) {
        var data = data || {};
        if (typeof grid == 'string') {
            grid = $("#" + grid);
        }
        var gridid = grid.attr("id");
        data.uuid = uuid;
        data.gridid = gridid;
        var options = options || {};
        options = $.extend({}, {width: 500, height: 350}, options);
        if (!isWorkFlow) {
            window.showDialog('attachment', options, forms.getContextPath() + "/form/addFileUpload?" + $.param(data), grid, true);
        } else {
            window.showDialog('attachment', options, forms.getContextPath() + "/form/addWorkFlowAttachment?" + $.param(data), grid, true);
        }
    }, delAttachment: function (grid, isWorkFlow) {
        if (typeof grid == "string") {
            grid = $("#" + grid);
        }
        $.omMessageBox.confirm({
            title: '确认删除', content: '删除的数据将不可恢复，你确定要这样做吗？', onClose: function (v) {
                if (v) {
                    var selectedRecords = grid.omGrid('getSelections', true);
                    var delJson = [];
                    $.each(selectedRecords, function (i, n) {
                        delJson.push(n.ID);
                    });
                    $.ajax({
                        type: "get",
                        url: forms.getContextPath() + "/form/deleteAttachment",
                        data: {ids: delJson.join(","), isWorkFlow: isWorkFlow, c: Math.random()},
                        success: function (val) {
                            alert(val);
                            grid.omGrid('reload');
                        }
                    })
                }
            }
        });
    }, getContextPath: function () {
        var path = location.pathname;
        return path.substring(0, path.indexOf("/", 1));
    }, uuid: function (len, radix) {
        var CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
        var chars = CHARS, uuid = [], i;
        radix = radix || chars.length;
        if (len) {
            for (i = 0; i < len; i++)
                uuid[i] = chars[0 | Math.random() * radix];
        } else {
            var r;
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
            uuid[14] = "4";
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join("");
    }, isIdCardNo: function isIdCardNo(g, m) {
        g = $.trim(g);
        if (g == null || g.length == 0) {
            return true;
        }
        g = g.toUpperCase();
        if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(g))) {
            alert("输入的身份证号长度不对，或者号码不符合规定\n15位号码应全为数字，18位号码末位可以为数字或X");
            return false;
        }
        var h, o;
        h = g.length;
        if (h == 15) {
            o = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
            var n = g.match(o);
            var c = new Date("19" + n[2] + "/" + n[3] + "/" + n[4]);
            var b;
            b = (c.getYear() == Number(n[2])) && ((c.getMonth() + 1) == Number(n[3])) && (c.getDate() == Number(n[4]));
            if (!b) {
                alert("输入的身份证号里出生日期不正确");
                return false;
            } else {
                var k = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var l = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");
                var j = 0, f;
                g = g.substr(0, 6) + "19" + g.substr(6, g.length - 6);
                for (f = 0; f < 17; f++) {
                    j += g.substr(f, 1) * k[f];
                }
                g += l[j % 11];
            }
        } else {
            if (h == 18) {
                o = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
                var n = g.match(o);
                var c = new Date(n[2] + "/" + n[3] + "/" + n[4]);
                var b;
                b = (c.getFullYear() == Number(n[2])) && ((c.getMonth() + 1) == Number(n[3])) && (c.getDate() == Number(n[4]));
                if (!b) {
                    alert("输入的身份证号里出生日期不正确");
                    return false;
                } else {
                    var a;
                    var k = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                    var l = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");
                    var j = 0, f;
                    for (f = 0; f < 17; f++) {
                        j += g.substr(f, 1) * k[f];
                    }
                    a = l[j % 11];
                    if (a != g.substr(17, 1)) {
                        alert("18位身份证的校验码不正确！最后一位应该为：" + a);
                        $("#" + m + "").val($("#" + m + "").val().substr(0, 17) + a);
                        return false;
                    }
                }
            }
        }
        var e = g.substr(6, 4) + "-" + Number(g.substr(10, 2)) + "-" + Number(g.substr(12, 2));
        var d = {
            11: "北京",
            12: "天津",
            13: "河北",
            14: "山西",
            15: "内蒙古",
            21: "辽宁",
            22: "吉林",
            23: "黑龙江",
            31: "上海",
            32: "江苏",
            33: "浙江",
            34: "安徽",
            35: "福建",
            36: "江西",
            37: "山东",
            41: "河南",
            42: "湖北",
            43: "湖南",
            44: "广东",
            45: "广西",
            46: "海南",
            50: "重庆",
            51: "四川",
            52: "贵州",
            53: "云南",
            54: "西藏",
            61: "陕西",
            62: "甘肃",
            63: "青海",
            64: "宁夏",
            65: "新疆",
            71: "台湾",
            81: "香港",
            82: "澳门",
            91: "国外"
        };
        if (d[parseInt(g.substr(0, 2))] == null) {
            alert("错误的地区码：" + g.substr(0, 2));
            return false;
        }
        if (Number(g.substr(6, 2)) < 19) {
            alert("输入身份证号码的出生日期须在1900年之后(" + e + ")");
            return false;
        }
        document.getElementById(m).value = g;
        return true;
    },clearNoNumAndD:function (obj) {
        obj.val(obj.val().replace(/[^\d.]/g, "").replace(/^\./g, "").replace(/\.{2,}/g, ".").replace(".", "$#$").replace(/\./g, "").replace("$#$", "."));
    }, clearNoNum:function (obj) {
        obj.val(obj.val().replace(/[^\d]/g, ''));
    }
};
function openym(type) {
    top.layer.open({
        type: 2,
        title: '单位工程树',
        zIndex: 1,
        area: ["350px", "500px"],  //代表宽高
        content: "/sggl/jdgl/sgglBdTree?treeType=jdgl&exclude=dwgc&checkAble=false&type=" + type + "&random=" + Math.random(),
        success: function () {
            top.setTopWin(window);
        }
    });
}
function openbdym(type) {
    top.layer.open({
        type: 2,
        title: '标段树',
        zIndex: 1,
        area: ["350px", "500px"],  //代表宽高
        content: "/sggl/jdgl/sgglBdTree?treeType=aqbj&exclude=bd&checkAble=false&type=" + type + "&random=" + Math.random(),
        success: function () {
            top.setTopWins1(window);
        }
    });
}