/*****************************************************************
 * 表单通用方法（权限数据通用方法、数据操作工具函数）
 * 最后更新时间：2016-02-24
 * 最后更新人：zhan
 *****************************************************************/

/**********************************************
 * 布局js控制
 **********************************************/
//初始化表单样式
function resizeForm(){
    $(".Boxform").height($(window).height() - $(".WindowMenu").outerHeight());
    $(window).resize(function() {
        $(".Boxform").height($(window).height() - $(".WindowMenu").outerHeight());
    })
}
//初始化列表样式
function resizeTable(){
    window.setTimeout(function(){
        $(".BoxGenerallist").height($(window).height() - $(".OperationBG").outerHeight() - $(".conditions").outerHeight() - 8);
    },1);
    $(window).resize(function () {
        $(".BoxGenerallist").height($(window).height() - $(".OperationBG").outerHeight() - $(".conditions").outerHeight() - 8);
    })
}
//载入中提示开启
function openLoading(){
    var height = Math.floor($(window).height()/2-10);
    $(window.document.body).prepend("<div id='loadingGif' style='line-height:40px;height:100%;width:100%;text-align:center;position:absolute;padding-top: "+height+"px; background: #F9F9F9;opacity:0.8; -moz-opacity:0.8;filter: alpha(opacity=80)'>" +
        "<img align='absmiddle' src='/medias/image/exp_loading.gif'/>" +
        "<span>数据加载中...</span>" +
        "</div>");
}
//载入中提示关闭
function closeLoading(){
    $("#loadingGif").remove();
}

//页面滚动到第一个错误位置
function scrollToError(){
    var container = $(".Boxform").eq(0),
        scrollTo = $(".TextBoxErr").eq(0);
    container.scrollTop(
        scrollTo.offset().top - container.offset().top + container.scrollTop()
    );
}

//给场景图绑定滚动事件
function bindScroll(){
    $(".prev").bind("click",function(){
        scrollToEnd("prev");
    });
    $(".next").bind("click",function(){
        scrollToEnd("next");
    });
}

//滚动到底
function scrollToEnd(type){
    var scrollTo = $(".Boxcentont").scrollLeft();
    if(type=="next"){
        scrollTo = scrollTo + 200;
    }else{
        scrollTo = scrollTo - 200;
    }
    $(".Boxcentont").animate({scrollLeft:scrollTo},"slow");
}

/**********************************************
 * layer弹出层封装方法
 **********************************************/
function openLayer(title,areaType,content,view){
    var area;
    if(areaType == "small"){
        area = ['450px','350px'];
    }else if(areaType == "medium"){
        area = ['700px','500px'];
    }else if(areaType == "big"){
        area = ['900px','600px'];
    }else if(areaType == "tree"){
        area = ['400px', '600px'];
    }else{
        area = areaType;
    }
    top.layer.open({
        //zIndex:1,
        type:2,
        title:title,
        area:area,
        maxmin: true,
        content:content,
        success:function(layero,index){
            var iframeWin = top.window[layero.find('iframe')[0]['name']];
            top.pushTopWin(iframeWin);
            if(view != null){
                top.pushTopView(view);
            }
            if(window.parent.window.isWorkSpace){
                top.setLcPageWin(window);
            }
            if(window.successCallback){
                window.successCallback();
            }
        },
        end:function(){
            top.popTopWin();
        },
        cancel:function(){
            var cwin = top.getTopWin(0);
            if(cwin != null){
                if(cwin.cancelCheck){
                    return cwin.cancelCheck();
                }
            }
            return true;
        }
    })
}

/**********************************************
 * 表单元素方法
 **********************************************/
/**
 * 获取表单jq元素
 */
$.getEle = function (modelName,property) {
    return $("*[data-model=" + modelName + "][data-property=" + property + "]");
}

/**
 * 隐藏表单元素与其标志td
 */
jQuery.fn.hideEleAndTag = function () {
    $(this).parent().addClass("hideElement");
    $(this).parent().prev().addClass("hideElement");
    return $(this);
}

/**
 * 隐藏表单元素
 */
jQuery.fn.hideEle = function () {
    $(this).addClass("hideElement");
    return $(this);
}

/**
 * 隐藏表单元素与其标志td
 */
jQuery.fn.showDisabledEle = function () {
    if($(this).next().hasClass("spanshow")){
        $(this).next().remove();
    }
    $(this).show();
    return $(this);
}

/**
 * 滚动到指定元素
 */
jQuery.fn.mScroll = function () {
    $("html,body").stop(true);
    $("html,body").animate({scrollTop: $(this).offset().top}, 1000);
}

/**
 * 隐藏表单元素与其标志td
 */
jQuery.fn.changeTag = function (value) {
    $(this).parent().prev().html(value);
    return $(this);
}

function checkSelected(gridmodel){
    var sel = gridmodel.getSelect();
    if(sel.length > 0) {
        return sel;
    }else{
        top.layer.alert("请先选择数据");
    }
    return null;
}
/**********************************************
 * 数据操作工具函数
 **********************************************/

$.prototype.val = function (base) {
    return function () {
        var s = this, n = s.next(), t = s.prop("tagName"), a = "value", p = s.attr(a), isset = arguments.length > 0, v = isset ? arguments[0] : null;
        //这里调用基类方法，当然基类方法在何时调用或者是否要调用取决于您的业务逻辑，在这里我们是要调用的，因为要保持它原有的功能。
        if (isset&&typeof(base)=="function") {
            base.call(s, v);
            if (s.hasClass("spanparent")){
                if(n != null && n.length > 0 && n.hasClass("spanshow")){
                    if(t == "INPUT" && s.prop("type") == "text"){
                        n.text(base.call(s));
                    }else if(t == "SELECT"){
                        n.text(s.find("option:selected").text());
                    }
                }
            }
            if (s.prop("tagName") == "INPUT"){
                s.prop("title",v);
            }
            return s;
        } else {
            return base.call(s);
        }
    }
    //在这里传入基类方法
}($.prototype.val);

//文本框长度验证
function textareachk(obj, name) {
    var maxl = 0;
    var maxLength = parseInt($(obj).attr("maxLength"));
    if (obj != null && maxLength > 0) {
        if (maxl === 0) maxl = maxLength; //总长
        var s = obj.value.length;
        var v = obj.value;
        var len = s;
        if (len > maxl) {
            obj.value = obj.value.substr(0, maxl);
            if ($("#" + name)[0] != undefined) {
                $("#" + name)[0].innerHTML = "<span style=color:red>已输入：" + maxl + "/" + maxl + " 字符</spqn>";
            }
        }
        else {
            if ($("#" + name)[0] != undefined) {
                $("#" + name)[0].innerHTML = "已输入：" + len + "/" + maxl + " 字符";
            }
        }
    }
}

function replaceStrChar(str,reallyDo,replaceWith) {
    var e=new RegExp(reallyDo,"g");
    var words = str;
    if(str != null){
        words = str.toString().replace(e, replaceWith);
    }
    return words;
}

//匹配checked状态
function matchChecked(collection){
    if(collection != null && collection.models.length > 0){
        $.each(collection.models, function(key,model){
            if(model.checked){
                model.set("sfyx_st", "VALID");
            }else{
                model.set("sfyx_st", "UNVALID");
            }
        })
    }
}
/*************************
 * 非空字符串判断
 * @param str
 * @returns {boolean}
 */
function isNotNullStr(str){
    if(str != null && $.trim(str.toString) != ""){
        return true;
    }
    return false;
}
/*************************
 * 非空元素判断
 * @param str
 * @returns {boolean}
 */
function isNotNullObj(obj){
    if(obj != undefined && obj != null){
        return true;
    }
    return false;
}
/**
 * 实现js缓存的方法
 * @param dictType 字典类型 对应zdlx字段
 * @param jspath 文件名称
 * @param pcode 父项code
 * @returns {*}
 * @constructor
 */
function JsCache(jspath,pcode){
    var dictType = jspath;
    var loadpath="/medias/cache/"+jspath+".js";
    var dictData = [];
    $.ajax({
        async:false,
        type:"GET",
        url:loadpath,
        dataType:"JSON",
        data:{},
        success:function(jsondata,textStatus){
            //判断是否过期 如果过期 则删除过期文件 并使用服务器发回的最新数据
            if(jsondata && jsondata.expires && jsondata.expires!=null){
                var expires = jsondata.expires;
                var dateExp = expires.replace(/\-/gi,"/");
                var timeExp = new Date(dateExp).getTime();
                var timeNow = new Date().getTime();
                if(false){
                    //if(timeExp<timeNow){//过期了
                    $.ajax({
                        async:false,
                        type:"POST",
                        url:"/jscache/jspath",
                        data:{dictType: dictType,jspath:jspath,forceUpdate:true},
                        dataType:"JSON",
                        success:function(response2){
                            dictData = eval(response2.data);
                        }
                    });
                }else{//没过期
                    dictData = jsondata.data;
                }

            }else{//文件有误 更新
                $.ajax({
                    async:false,
                    type:"POST",
                    url:"/jscache/jspath",
                    data:{dictType: dictType,jspath:jspath,forceUpdate:true},
                    dataType:"JSON",
                    success:function(response1){
                        dictData = eval(response1.data);
                    }
                });
            }
        },error:function(XMLHttpRequest, textStatus, errorThrown){
            if(XMLHttpRequest.status=404){//文件不存在，择请求服务器生成文件
                $.ajax({
                    async:false,
                    type:"POST",
                    url:"/jscache/jspath",
                    data:{dictType: dictType,jspath:jspath},
                    dataType:"JSON",
                    success:function(response){
                        dictData = eval(response.data);
                    }
                });
            }
        }
    });
    if(pcode && pcode!=null){
        var newData=[];
        if(typeof(pcode) == "object"){
            if(pcode.length > 0){
                for(var m = 0; m < pcode.length; m++){
                    $.each(dictData, function (i, item) {
                        if(item.pcode == pcode[m]){
                            newData.push(item);
                        }
                    });
                }
            }
        }else{
            $.each(dictData, function (i, item) {
                if(item.pcode == pcode){
                    newData.push(item);
                }
            });
        }

        return newData;
    }else if(pcode === ""){
        var newData=[];
        $.each(dictData, function (i, item) {
            if(item.pcode == null){
                item.pcode = "";
                newData.push(item);
            }
        });
        return newData;
    }else{
        return dictData;
    }
    console.log("请求字典:"+dictType);
    //return [{value:"总包合同",code:1},{value:"监理合同",code:2}];
}
/**
 *
 * @param mergePath 合并请求的路劲
 * @param dictNames 合并请求的参数["htlb",".."] 字典项类型code
 * @param jspath 当前字典项的类型code htlb
 * @param pcode 父项
 * @returns {*}
 * @constructor
 */
function JsMergeCache(mergePath,dictNames,jspath,pcode){
    var mergePathCache=mergePath+"Cache";
    var loadpath="/medias/cache/"+mergePathCache+".js";
    var dictData = [];
    $.ajax({
        async:false,
        type:"GET",
        url:loadpath,
        dataType:"JSON",
        data:{},
        success:function(jsondata,textStatus){
            //判断是否过期 如果过期 则删除过期文件 并使用服务器发回的最新数据
            if(jsondata && jsondata.expires && jsondata.expires!=null){
                var expires = jsondata.expires;
                var dateExp = expires.replace(/\-/gi,"/");
                var timeExp = new Date(dateExp).getTime();
                var timeNow = new Date().getTime();
                if(false){
                    //if(timeExp<timeNow){//过期了
                    $.ajax({
                        async:false,
                        type:"POST",
                        url:"/jscache/jsMergePath",
                        data:{mergePath:mergePathCache,dictNames: dictNames,forceUpdate:true},
                        dataType:"JSON",
                        success:function(response2){
                            if(typeof response2.data[jspath] !="undefined"){
                                dictData= eval(response2.data[jspath]);
                            }else{
                                dictData =[];
                            }
                        }
                    });
                }else{//没过期
                    //dictData = jsondata.data;
                    if(typeof jsondata.data[jspath] !="undefined"){
                        dictData= eval(jsondata.data[jspath]);
                    }else{
                        dictData =[];
                    }
                }

            }else{//文件有误 更新
                $.ajax({
                    async:false,
                    type:"POST",
                    url:"/jscache/jsMergePath",
                    data:{mergePath:mergePathCache,dictNames: dictNames,forceUpdate:true},
                    dataType:"JSON",
                    success:function(response1){
                        if(typeof response1.data[jspath] !="undefined"){
                            dictData= eval(response1.data[jspath]);
                        }else{
                            dictData =[];
                        }
                    }
                });
            }
        },error:function(XMLHttpRequest, textStatus, errorThrown){
            if(XMLHttpRequest.status=404){//文件不存在，择请求服务器生成文件
                $.ajax({
                    async:false,
                    type:"POST",
                    url:"/jscache/jsMergePath",
                    data:{mergePath:mergePathCache,dictNames: dictNames},
                    dataType:"JSON",
                    success:function(response){
                        if(typeof response.data[jspath] !="undefined"){
                            dictData= eval(response.data[jspath]);
                        }else{
                            dictData =[];
                        }
                    }
                });
            }
        }
    });

    if(pcode && pcode!=null){
        var newData=[];
        if(typeof(pcode) == "object"){
            if(pcode.length > 0){
                for(var m = 0; m < pcode.length; m++){
                    $.each(dictData, function (i, item) {
                        if(item.pcode == pcode[m]){
                            newData.push(item);
                        }
                    });
                }
            }
        }else{
            $.each(dictData, function (i, item) {
                if(item.pcode == pcode){
                    newData.push(item);
                }
            });
        }
        return newData;
    }else if(pcode === ""){
        var newData=[];
        $.each(dictData, function (i, item) {
            if(item.pcode == null){
                item.pcode = "";
                newData.push(item);
            }
        });
        return newData;
    }else{
        return dictData;
    }
    //console.log("请求字典:"+dictType);
    //return [{value:"总包合同",code:1},{value:"监理合同",code:2}];
}

//模块角色权限类声明
var ModuleRole = function () {
    var moduleRole = {
        module: null,
        roles: null,
        //判断参数role是否在角色数组中，在则返回true，不在false
        inRoles:function (role) {
            var inTag = false,
                roles = this.roles;
            if(roles != null && roles.length>0){
                if($.inArray(role,roles) > -1){
                    inTag = true;
                }
            }
            return inTag;
        }
    }
    return moduleRole;
}

/**
 * 请求后台获取session中的模块角色权限
 * @param moduleId 模块id
 * @returns {*}
 * @constructor
 */
function getModuleRole(moduleId){
    var moduleRole = new ModuleRole();
    moduleRole.module = moduleId;
    $.ajax({
        async:false,
        type:"POST",
        url:"/main/getModuleRole",
        data:{moduleId:moduleId},
        success:function(ar){
            if(ar.success){
                var roleStr = ar.data;
                if(roleStr != null && roleStr.toString().length > 0){
                    var roleArr = new Array();
                    var result = roleStr.toString().split(",");
                    for(var i=0;i<result.length;i++){
                        roleArr.push(result[i]);
                    }
                    moduleRole.roles = roleArr;
                }
            }else{
                top.layer.alert("获取用户权限错误");
            }
        }
    });
    return moduleRole;
}

var ModulesRole = function () {
    var modulesRole = {
        modules: null,
        roles: null,
        //判断参数role是否在角色数组中，在则返回true，不在false
        inRoles:function (moduleId, role) {
            var inTag = false,
                roles = this.roles[moduleId.toString()];
            if(roles != null && roles.length>0){
                if($.inArray(role,roles) > -1){
                    inTag = true;
                }
            }
            return inTag;
        },
        inRolesByIndex:function (index, role) {
            var inTag = false;
            if(index < this.modules.length) {
                if(this.modules[index] != null && this.modules[index] != ""){
                    var roles = this.roles[this.modules[index]];
                    if (roles != null && roles.length > 0) {
                        if ($.inArray(role, roles) > -1) {
                            inTag = true;
                        }
                    }
                }
            }
            return inTag;
        }
    }
    return modulesRole;
}

/**
 * 请求后台获取session中的模块角色权限
 * @param moduleId 模块id
 * @returns {*}
 * @constructor
 */
function getModulesRole(moduleIds){
    var modulesRole = new ModulesRole();
    var moduleArr = new Array();
    if(moduleIds != null && moduleIds.toString().length > 0){
        moduleArr = moduleIds.toString().split(",");
    }
    modulesRole.modules = moduleArr;
    $.ajax({
        async:false,
        type:"POST",
        url:"/main/getModulesRole",
        data:{moduleIds:moduleIds},
        success:function(ar){
            if(ar.success){
                if(ar.data != null){
                    modulesRole.roles = ar.data;
                }
            }else{
                top.layer.alert("获取用户权限错误");
            }
        }
    });
    return modulesRole;
}

function getFileSize(byteNum){
    var byteFloat = parseFloat(byteNum);
    if(byteFloat / 1024  <= 1){
        return byteFloat + "B";
    }else{
        byteFloat = (byteFloat / 1024).toFixed(2);
    }
    if(byteFloat / 1024  <= 1){
        return byteFloat + "K";
    }else{
        byteFloat = (byteFloat / 1024).toFixed(2);
    }
    if(byteFloat / 1024  <= 1){
        return byteFloat + "M";
    }else{
        byteFloat = (byteFloat / 1024).toFixed(2);
    }
    return byteFloat + "G";
}
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
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
//汉字解码
function decode(val) {
    return decodeURI(decodeURI(val));
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

function isShow(id,is){
    if(is){
        $("#"+id).show();
    }else{
        $("#"+id).hide();
    }
}

//function openym(type) {
//    top.layer.open({
//        type: 2,
//        title: '单位工程树',
//        zIndex: 1,
//        area: ["350px", "500px"],  //代表宽高
//        content: "/sggl/jdgl/sgglBdTree?treeType=jdgl&exclude=dwgc&checkAble=false&type=" + type + "&random=" + Math.random(),
//        success: function () {
//            top.setTopWin(window);
//        }
//    });
//}
//function openbdym(type) {
//    top.layer.open({
//        type: 2,
//        title: '标段树',
//        zIndex: 1,
//        area: ["350px", "500px"],  //代表宽高
//        content: "/sggl/jdgl/sgglBdTree?treeType=aqbj&exclude=bd&checkAble=false&type=" + type + "&random=" + Math.random(),
//        success: function () {
//            top.setTopWins1(window);
//        }
//    });
//}

/**********************************************
 * 权限数据通用方法
 **********************************************/
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
