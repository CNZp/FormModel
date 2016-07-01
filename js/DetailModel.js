/*****************************************************************
 * 重构表单detailModel
 * 最后更新时间：2016-02-26
 * 最后更新人：zhan
 *****************************************************************/

//model标记，作为动态model的下标迭代器
var modelIndex = 0;

//MR:模型控件渲染器，剥离出来，方便维护
var MR = function(){
    return this.init();
}
MR.prototype = {
    init:function(){
        return this;
    },
    /*****************************************************************
     *  方法：禁用效果实现（spanshow等）
     *****************************************************************/
    disabledHandle:function(t,disabled){
        //spanshow的去除
        var tagName = $(t).prop("tagName");
        if($(t).hasClass("spanparent")){
            $(t).removeClass("spanparent");
            $(t).show();
            if($(t).next().hasClass("spanshow")){
                $(t).next().remove();
            }
            if($(t).next().hasClass("clearLayer")){
                if($(t).next().next().hasClass("spanshow")){
                    $(t).next().next().remove();
                }
            }
        }
        //spanShow的实现
        if ($(t).hasClass("disabled") && !$(t).is(":hidden")) {
            if(tagName == "INPUT" && $(t).prop("type") == "text"){
                $(t).addClass("spanparent");
                $(t).hide();
                $(t).after("<span class='spanshow'>"+$(t).val()+"</span>");
            }else if(tagName == "SELECT"){
                $(t).addClass("spanparent");
                $(t).hide();
                var text = "";
                if($(t).val() != null && $(t).val() != ""){
                    text = $(t).find("option:selected").text();
                }
                $(t).after("<span class='spanshow'>"+text+"</span>");
            }else if(tagName == "DIV" && value2.type == "dict"){
                $(t).addClass("spanparent");
                $(t).hide();
                var text = "";
                $(t).find('input[type=checkbox]:checked').each(function () {
                    text = text + $(this).parent().text() + "，";
                });
                $(t).find('input[type=radio]:checked').each(function () {
                    text = text + $(this).parent().text() + "，";
                });
                if (text != "") {
                    text = text.substr(0, text.length - 1);
                }
                $(t).after("<span class='spanshow'>"+text+"</span>");
            }
        }
    },
    /*****************************************************************
     *  方法：请求字典
     *****************************************************************/
    getZdDict: function(zdName,pcode) {
        if(this.dictJson != null){
            var json = this.dictJson;
            for(var key in json){
                if(json[key].length > 0){
                    if($.inArray(zdName,json[key]) != -1){
                        return JsMergeCache(key,json[key],zdName,pcode);
                    }
                }
            }
            return JsCache(zdName,pcode);
        }else{
            return JsCache(zdName,pcode);
        }
    },
    /*****************************************************************
     *  方法：清除字段渲染效果
     *****************************************************************/
    clearPropertyRender: function(t,model){
        $(t).unbind();
    },
    /*****************************************************************
     *  方法：清空字段内容
     *****************************************************************/
    emptyProperty: function(t,property,model,emptyDomTag){
        var tagName = $(t).prop("tagName");
        var type = $(t).prop("type");
        if(property != "sfyx_st") {
            model.set(property, "");
            if (emptyDomTag) {
                if(tagName == "DIV"){
                    $(t).children("input").prop("checked",false);
                }else if(tagName == "INPUT" && (type == "radio" || type == "checkbox")){
                    $(t).prop("checked",false);
                }else{
                    $(t).val("");
                }
            }
        }
    },
    /*****************************************************************
     *  方法：从更新表单中更新字段
     *****************************************************************/
    updateModelByElement:function(t,model){
        var tagName = $(t).prop("tagName");
        var pro = $(t).attr("data-property");
        var type = $(t).prop("type");
        var value;
        if (tagName == "INPUT" && type == "radio") {
            var checkStr = "";
            $("*[data-model=" + model.get("ModelName") + "][data-property="+pro+"]").each(function(i2,t2){
                if($(t2).prop("checked")){
                    checkStr += $(t2).val() + ","
                }
            });
            if(checkStr.length > 0){
                model.set(pro,checkStr.substring(0,checkStr.length - 1));
            }
        }else if (tagName == "INPUT" && type == "checkbox") {
            var checkStr = "";
            $("*[data-model=" + model.get("ModelName") + "][data-property="+pro+"]").each(function(i2,t2){
                if($(t2).prop("checked")){
                    checkStr += $(t2).attr("checkvalue") + ","
                }
            });
            if(checkStr.length > 0){
                model.set(pro,checkStr.substring(0,checkStr.length - 1));
            }
        }else {
            if (tagName == "DIV") {
                var valList = ""
                $(t).find('input[type=checkbox]:checked').each(function () {
                    valList = valList + $(this).val() + ",";
                });
                $(t).find('input[type=radio]:checked').each(function () {
                    valList = valList + $(this).val() + ",";
                });
                if (valList != "") {
                    valList = valList.substr(0, valList.length - 1);
                }
                value = valList;
            }else if (tagName == "SELECT") {
                value = $(t).val();
            } else if (tagName == "LABEL" || tagName == "SPAN") {
                value = $(t).text();
            }else {
                if (typeof($(t).val()) != "undefined") {
                    if($(t).val() == null || $(t).val() === ""){
                        value = "";
                    }else{
                        value = $(t).val().replace(/\n/g, "<br>");
                    }
                }
            }
            model.set(pro, value);
        }
    },
    /*****************************************************************
     *  方法：验证字段
     *****************************************************************/
    variableProperty:function(t,model){
        var result = true;
        var tagName = $(t).prop("tagName");
        var type = $(t).prop("type");
        if(!$(t).parent().eq(0).hasClass("hideElement") && !$(t).hasClass("hideElement") && !$(t).hasClass("disabled")) {
            var key2 = $(t).attr("data-property");
            var value2 = model.initJson[model.className][$(t).attr("data-property")];
            if(value2 == null){
                console.log(model.get("ModelName")+"属性"+key2+"未定义");
            }
            if(value2.rules == null){
                value2.rules = {checkValue:[], checkSave:[]};
            }else if(value2.rules.checkSave == null){
                value2.rules.checkSave = [];
            }else if(value2.rules.checkValue == null){
                value2.rules.checkValue = [];
            }
            if(value2.type == "file"){
                if(value2.fileConfig.type == "list"){
                    if($.inArray("notNull",value2.rules.checkSave) != -1) {
                        $(t).next().find(".addFileItem").each(function (i, t2) {
                            var minNum = parseInt($(t2).attr("minNum"));
                            if(minNum > 0){
                                var num = 0;
                                $(t).next().find(".attachmentheader").each(function (i3, t3) {
                                    num += parseInt($(t3).children("h1").eq(0).children("em").html());
                                })
                                if (num < minNum) {
                                    result = false;
                                    $(t).next().find(".title").addClass("TextBoxErr");
                                }
                            }
                        })
                        $(t).next().find(".attachmentheader").each(function (i, t2) {
                            var minNum = parseInt($(t2).attr("minNum"));
                            if(minNum > 0){
                                var num = $(t2).children("h1").eq(0).children("em").html();
                                if (parseInt(num) < minNum) {
                                    result = false;
                                    $(t2).addClass("TextBoxErr");
                                }
                            }
                        })
                    }
                }else if(value2.fileConfig.type == "table"){
                    if($.inArray("notNull",value2.rules.checkSave) != -1) {
                        var minNum = parseInt($(t).next().attr("minNum"));
                        if(minNum > 0) {
                            if ($(t).next().children("tr").length < minNum) {
                                result = false;
                                $(t).next().children("caption").children(".title").addClass("TextBoxErr");
                            }
                        }
                    }
                }else if(value2.fileConfig.type == "div"){
                    if($.inArray("notNull",value2.rules.checkSave) != -1) {
                        var minNum = parseInt($(t).next().find("dl").attr("minNum"));
                        if(minNum > 0){
                            if($(t).next().find("dd").length < minNum){
                                result = false;
                                $(t).next().find("dt").addClass("TextBoxErr");
                            }
                        }
                    }
                }else if(value2.fileConfig.type == "single"){
                    if($.inArray("notNull",value2.rules.checkSave) != -1) {
                        if($(t).next().find("dd").length < 1){
                            result = false;
                            $(t).next().find("dt").addClass("TextBoxErr");
                        }
                    }
                }else if(value2.fileConfig.type == "image"){
                    if($.inArray("notNull",value2.rules.checkSave) != -1) {
                        if($(t).val == null || $(t).val() == ""){
                            result = false;
                            $(t).next().addClass("TextBoxErr");
                        }
                    }
                }else if(value2.fileConfig.type == "cysbImage"){
                    if($.inArray("notNull",value2.rules.checkSave) != -1) {
                        if($(t).val == null || $(t).val() == ""){
                            result = false;
                            $(t).next().addClass("TextBoxErr");
                        }
                    }
                }
            } else if (tagName == "INPUT" && (type == "radio" || type == "checkbox")) {    //手动radio验证
                if ($.inArray("notNull", value2.rules.checkSave) != -1) {
                    var checkTag = false;
                    $("*[data-model=" + model.get("ModelName") + "][data-property=" + key2 + "]").each(function (i, t2) {
                        if ($(t2).prop("checked")) {
                            checkTag = true;
                        }
                    });
                    if (!checkTag) {
                        result = false;
                        $(t).parent().addClass("TextBoxErr");
                    }
                }
            } else if (typeof(value2.rules) != "undefined") {
                if (typeof(value2.rules.checkSave) != "undefined" && type != "hidden") {
                    if (value2.rules.checkSave.length > 0 || value2.rules.checkValue.length > 0) {
                        //获取指定的document
                        if ($(t).val() != undefined) {
                            var objselect = "$(\"*[data-model='" + model.get("ModelName") + "'][data-property='" + key2 + "']\")" + ".get(0)";
                            for (var i = 0; i < value2.rules.checkSave.length; i++) {
                                var checkResult = eval(value2.rules.checkSave[i] + "(" + objselect + ")");
                                if (!checkResult) {
                                    result = false;
                                }
                            }
                            for (var i = 0; i < value2.rules.checkValue.length; i++) {
                                var checkResult = eval(value2.rules.checkValue[i] + "(" + objselect + ")");
                                if (!checkResult) {
                                    result = false;
                                }
                            }
                        }
                    }
                }
            }
        }
        return result;
    },
    /*****************************************************************
     *  方法：验证字段是否变更
     *****************************************************************/
    variableChange:function(t,model){
        var result = false;
        if(!$(t).parent().eq(0).hasClass("hideElement")) {
            var tagName = $(t).prop("tagName");
            var pro = $(t).attr("data-property");
            var type = $(t).prop("type");
            var json2 = model.initJson[model.className][pro];
            var value;
            if (tagName == "DIV") {
                var valList = ""
                $(t).find('input[type=checkbox]:checked').each(function () {
                    valList = valList + $(this).val() + ",";
                });
                $(t).find('input[type=radio]:checked').each(function () {
                    valList = valList + $(this).val() + ",";
                });
                if (valList != "") {
                    valList = valList.substr(0, valList.length - 1);
                }
                value = valList;
            } else if (tagName == "LABEL" || type == "SPAN") {
                value = $(t).text();
            } else if (tagName == "INPUT" && type == "radio") {
                var checkStr = "";
                $("*[data-model=" + model.get("ModelName") + "][data-property="+pro+"]").each(function(i2,t2){
                    if($(t2).prop("checked")){
                        checkStr += $(t2).val() + ","
                    }
                });
                if(checkStr.length > 0){
                    value = checkStr.substring(0,checkStr.length - 1);
                }
            }else if (tagName == "INPUT" && type == "checkbox") {
                var checkStr = "";
                $("*[data-model=" + model.get("ModelName") + "][data-property="+pro+"]").each(function(i2,t2){
                    if($(t2).prop("checked")){
                        checkStr += $(t2).attr("checkvalue") + ","
                    }
                });
                if(checkStr.length > 0){
                    value = checkStr.substring(0,checkStr.length - 1);
                }
            } else {
                if(json2.type == "date"){
                    //alert($(t).val().toString());
                    //var date =  new Date(Date.parse($(t).val().toString().replace(/-/g, "/")));
                    value = $(t).val().toString();
                }else if (typeof($(t).val()) != "undefined" && $(t).val() != null) {
                    value = $(t).val().replace(/\n/g, "<br>");
                }
            }
            if(value == null){
                value = "";
            }
            if(model.get(pro) != value){
                result = true;
            }
        }
        return result;
    },
    /*****************************************************************
     *  方法：渲染select控件
     *****************************************************************/
    fillSelect: function (obj, json, value, isTrigger, showQxz) {
        //if (isTrigger != "noTrigger")
        //    $(obj).trigger("propertychange");
        $(obj).empty();
        if (value != undefined && value != null) {
            if(showQxz == null || showQxz) {
                $(obj).append("<option value=''>请选择</option>");
            }
            for (var i = 0; i < json.length; i++) {
                if (value == json[i].code) {
                    $(obj).append("<option value='" + json[i].code + "' selected>"
                        + json[i].value + "</option>");
                } else {
                    $(obj).append("<option value='" + json[i].code + "'>"
                        + json[i].value + "</option>");
                }
            }
        } else {
            if(showQxz == null || showQxz) {
                $(obj).append("<option value=''>请选择</option>");
            }
            for (var i = 0; i < json.length; i++) {
                $(obj).append("<option value='" + json[i].code + "'>"
                    + json[i].value + "</option>");
            }
        }
        if(value != undefined && value != null){
            $(obj).val(value);
        }
    },
    /*****************************************************************
     *  方法：渲染字典项
     *****************************************************************/
    fillDict: function (obj, key, value2, model, zdx, key2) {
        var type = obj.prop("tagName");
        if (type == "SELECT") {
            var pcode = null;
            if (typeof(value2.dictConfig.pcode) != "undefined" && value2.dictConfig.pcode != null) {
                pcode = value2.dictConfig.pcode;
            }
            if (zdx != null) {
                if (typeof(value2.dictConfig.dependence) != "undefined") {
                    $("*[data-model=" + key + "][data-property="
                        + value2.dictConfig.dependence + "]").unbind("change");
                    $("*[data-model=" + key + "][data-property="
                        + value2.dictConfig.dependence + "]").bind("change",
                        function () {
//                        alert("触发了change");
                            var pValue = $(this).val();
                            var dataStrIn = "[";
                            for (var i = 0; i < zdx.length; i++) {
                                if (typeof(zdx[i].pcode) != "undefined" && zdx[i].pcode != null) {
                                    if (zdx[i].pcode == pValue) {
                                        if (typeof(zdx[i].code) != "undefined" && zdx[i].code != null) {
                                            dataStrIn += "{code:\"" + zdx[i].code + "\",value:\"" + zdx[i].value + "\",pcode:\"" + zdx[i].pcode + "\"},";
                                        }
                                    }
                                }
                            }
                            if (dataStrIn != "[") {
                                dataStrIn = dataStrIn.substr(0, dataStrIn.length - 1);
                                dataStrIn += "]";
                                model.MR.fillSelect(obj.get(0), eval(dataStrIn), value2.defaultValue, null, value2.dictConfig.showQxz);
                            } else {
                                model.MR.fillSelect(obj.get(0), [], value2.defaultValue, null, value2.dictConfig.showQxz);
                            }
                            $(obj).trigger("change");
                            var value3= model.initJson[model.className][value2.dictConfig.dependence];
                            if(value3.changeFunc != "undefined" &&value3.changeFunc != undefined){
                                eval(value3.changeFunc+"(model)");
                            }
                        })
                    ;
                    //若dependence项有初值，触发依赖项的change事件，完成级联渲染
                    var depobj = $("*[data-model=" + key + "][data-property="+ value2.dictConfig.dependence + "]");
                    if($(depobj).val() != null && $(depobj).val() != ""){
                        $(depobj).trigger("change");
                    }
                }else {
                    var dataStr = "[";
                    if (pcode == null) {
                        for (var i = 0; i < zdx.length; i++) {
                            if (typeof(zdx[i].code) != "undefined" && zdx[i].code != null) {
                                dataStr += "{code:\"" + zdx[i].code + "\",value:\"" + zdx[i].value + "\"},"
                            }
                        }
                    } else {
                        for (var i = 0; i < zdx.length; i++) {
                            if (typeof(zdx[i].pcode) != "undefined" && value2.dictConfig.pcode != null) {
                                if(typeof(pcode) == "object"){
                                    if(pcode.length > 0){
                                        for(var m = 0; m < pcode.length; m++){
                                            if(zdx[i].pcode == pcode[m]){
                                                if (typeof(zdx[i].code) != "undefined" && zdx[i].code != null) {
                                                    dataStr += "{code:\"" + zdx[i].code + "\",value:\"" + zdx[i].value + "\",pcode:\"" + zdx[i].pcode + "\"},";
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }else if (zdx[i].pcode == pcode) {
                                    if (typeof(zdx[i].code) != "undefined" && zdx[i].code != null) {
                                        dataStr += "{code:\"" + zdx[i].code + "\",value:\"" + zdx[i].value + "\",pcode:\"" + zdx[i].pcode + "\"},";
                                    }
                                }
                            }
                        }
                    }
                    if(dataStr.length > 1){
                        dataStr = dataStr.substr(0, dataStr.length - 1);
                    }
                    dataStr += "]";
                    dataStr = eval(dataStr);
                    model.MR.fillSelect(obj.get(0), dataStr, value2.defaultValue, null, value2.dictConfig.showQxz);
                }
            }
        } else if (type == "DIV") {
            if (typeof(value2.dictConfig) != "undefined") {
                var pcode = null;
                if (typeof(value2.dictConfig.pcode) != "undefined" && value2.dictConfig.pcode != null) {
                    pcode = value2.dictConfig.pcode;
                }
                if (zdx != null) {
                    if (typeof(value2.dictConfig.checkType) != "undefined") {
                        var checkType = value2.dictConfig.checkType;
                        if (checkType == "checkbox") {
                            //如果是checkbox
                            var check = "";
                            if (pcode == null) {
                                for (var i = 0; i < zdx.length; i++) {
                                    if (typeof(zdx[i].code) != "undefined" && zdx[i].code != null) {
                                        check = check + "<label><input type='checkbox' class='checkbox' value='" +
                                            zdx[i].code + "'/>" + zdx[i].value + "</label>";
                                    }
                                }
                            } else {
                                for (var i = 0; i < zdx.length; i++) {
                                    if (typeof(zdx[i].pcode) != "undefined" && value2.dictConfig.pcode != null) {
                                        if(typeof(pcode) == "object"){
                                            if(pcode.length > 0){
                                                for(var m = 0; m < pcode.length; m++){
                                                    if(zdx[i].pcode == pcode[m]){
                                                        if (typeof(zdx[i].code) != "undefined" && zdx[i].code != null) {
                                                            check = check + "<label><input type='checkbox' class='checkbox' value='" +
                                                                zdx[i].code + "'/>" + zdx[i].value + "</label>";
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                        }else if (zdx[i].pcode == pcode) {
                                            if (typeof(zdx[i].code) != "undefined" && zdx[i].code != null) {
                                                check = check + "<label><input type='checkbox' class='checkbox' value='" +
                                                    zdx[i].code + "'/>" + zdx[i].value + "</label>";
                                            }
                                        }
                                    }
                                }
                            }
                            if (check != "") {
                                obj.html(check);
                            }
                        } else if (checkType == "radio") {
                            //如果是radio
                            var radio = "";
                            if (pcode == null) {
                                for (var i = 0; i < zdx.length; i++) {
                                    if (typeof(zdx[i].code) != "undefined" && zdx[i].code != null) {
                                        radio = radio + "<label><input type='radio' class='radio' name='" + key2 + "' value='" +
                                            zdx[i].code + "'/>" + zdx[i].value + "</label>";
                                    }
                                }
                            } else {
                                for (var i = 0; i < zdx.length; i++) {
                                    if (typeof(zdx[i].pcode) != "undefined" && value2.dictConfig.pcode != null) {
                                        if(typeof(pcode) == "object"){
                                            if(pcode.length > 0){
                                                for(var m = 0; m < pcode.length; m++){
                                                    if(zdx[i].pcode == pcode[m]){
                                                        if (typeof(zdx[i].code) != "undefined" && zdx[i].code != null) {
                                                            radio = radio + "<label><input type='radio' class='radio' name='" + key2 + "' value='" +
                                                                zdx[i].code + "'/>" + zdx[i].value + "</label>";
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                        }else if (zdx[i].pcode == pcode) {
                                            if (typeof(zdx[i].code) != "undefined" && zdx[i].code != null) {
                                                radio = radio + "<label><input type='radio' class='radio' name='" + key2 + "' value='" +
                                                    zdx[i].code + "'/>" + zdx[i].value + "</label>";
                                            }
                                        }
                                    }
                                }
                            }
                            if (radio != "") {
                                obj.html(radio);
                            }
                        }
                    }
                }
            }
        }
    },
    /*****************************************************************
     *  方法：核心方法，渲染字段
     *****************************************************************/
    renderProperty:function(t,model){
        var initJson = model.initJson;
        var tagName = $(t).prop("tagName");
        var modelname = $(t).attr("data-model");
        var pro = $(t).attr("data-property");
        var keyValue = model.get(pro);
        var value2 = initJson[model.className][pro];
        if(value2 == undefined){
            console.log(model.get("ModelName")+"的"+pro+"属性配置不存在");
        }

        //清除挂载事件和readonly属性
        $(t).unbind();
        $(t).prop("readonly",false);

        //规则绑定
        if (typeof(value2.rules) != "undefined") {
            if (typeof(value2.rules.checkValue) != "undefined") {
                //如果变量存在valueRules验证规则，则在DOM上添加相应事件
                if (value2.rules.checkValue.length > 0) {
                    var objselect = "$(\"*[data-model='" + modelname + "'][data-property='" + pro + "']\")" + ".get(0)";
                    //对DOM添加事件
                    //4-19 zhan修改keyup为blur，部分验证需要输入完成再验证
                    $(t).bind("blur", function () {
                        $(t).removeClass("TextBoxErr");
                        $(t).parent().find(".invalidtip").remove();
                        for (var i = 0; i < value2.rules.checkValue.length; i++) {
                            if (value2.rules.checkValue[i] == "checkNumlength") {
                                var iLength = value2.numLength[0];
                                var fLength = value2.numLength[1];
                                if (!eval(value2.rules.checkValue[i] + "(" + objselect + "," + iLength + "," + fLength + ")")) {
                                    $(t).val("");
                                }
                            } else {
                                if (!eval(value2.rules.checkValue[i] + "(" + objselect + ")")) {
                                    $(t).val("");
                                }
                            }

                        }
                    });
                }
            }
            if (typeof(value2.rules.checkKeyup) != "undefined") {
                //如果变量存在valueRules验证规则，则在DOM上添加相应事件
                if (value2.rules.checkKeyup.length > 0) {
                    var objselect = "$(\"*[data-model='" + modelname + "'][data-property='" + pro + "']\")" + ".get(0)";
                    //对DOM添加事件
                    //4-19 zhan修改keyup为blur，部分验证需要输入完成再验证
                    $(t).bind("keyup", function () {
                        $(t).removeClass("TextBoxErr");
                        $(t).parent().find(".invalidtip").remove();
                        for (var i = 0; i < value2.rules.checkKeyup.length; i++) {
                            if (!eval(value2.rules.checkKeyup[i] + "(" + objselect + ")")) {
                                $(t).val("");
                            }
                        }
                    });
                }
            }
        }
        //禁止的控制
        if (typeof(value2.disabled) != "undefined") {
            if (value2.disabled) {
                $(t).attr("disabled", "disabled");
                $(t).addClass("disabled");
            }
        }
        //可见、不可见的控制
        if (typeof(value2.display) != "undefined") {
            if (value2.display == "none") {
                $(t).addClass("hideElement");
            }else{
                $(t).removeClass("hideElement");
            }
        }
        //最大长度的控制
        if (typeof(value2.maxLength) != "undefined") {
            $(t).attr("maxLength", value2.maxLength);
            if(keyValue){
                keyValue = keyValue.toString().substring(0,value2.maxLength);
                model.set(pro, keyValue);
            }
        }
        //对于时间类型的操作
        if (value2.type == "date") {
            if (typeof(value2.dateConfig) != "undefined") {
                //渲染时间控件
                $(t).attr("id", pro);
                var dataRex = "%y-%M-%d";
                var json = "";
                if (typeof(value2.dateConfig.dateFmt) != "undefined") {
                    json = json + "dateFmt: '" + value2.dateConfig.dateFmt + "'";
                    //根据日期格式赋值当前时间
                    if (typeof(value2.dateConfig.defaultDate) != "undefined") {
                        if (value2.dateConfig.defaultDate) {
                            $(t).val(getNow(value2.dateConfig.dateFmt.length));
                            model.set(pro, $(t).val());
                        }
                    }
                    //获取日期格式长度的表达式
                    dataRex = getDateRex(value2.dateConfig.dateFmt.length);
                } else {
                    json = json + "dateFmt: 'yyyy-MM-dd'";
                    //根据日期格式赋值当前时间
                    if (typeof(value2.dateConfig.defaultDate) != "undefined") {
                        if (value2.dateConfig.defaultDate) {
                            $(t).val(getNow(0));
                        }
                    }
                }
                //最大时间控制
                if (typeof(value2.dateConfig.maxDate) != "undefined") {
                    if (isDateTime(value2.dateConfig.maxDate)) {
                        json = json + " ,maxDate: '" + value2.dateConfig.maxDate + "'";
                    } else if (value2.dateConfig.maxDate == "sysdate") {
                        json = json + " ,maxDate: '" + dataRex + "'";
                    } else {
                        json = json + " ,maxDate: \'#F{$dp.$D(\\'" + value2.dateConfig.maxDate + "\\')}'";
                    }
                }
                //最小时间控制
                if (typeof(value2.dateConfig.minDate) != "undefined") {
                    if (isDateTime(value2.dateConfig.minDate)) {
                        json = json + " ,minDate: '" + value2.dateConfig.minDate + "'";
                    } else if (value2.dateConfig.minDate == "sysdate") {
                        json = json + " ,minDate: '" + dataRex + "'";
                    } else {
                        json = json + " ,minDate: \'#F{$dp.$D(\\'" + value2.dateConfig.minDate + "\\')}'";
                    }
                }
                if (typeof(value2.dateConfig.startDate) != "undefined") {
                    json = json + " ,startDate: '" + value2.dateConfig.startDate + "'";
                }
                json = "{" + json + "}";
                $(t).focus(function () {
                    WdatePicker(eval('(' + json + ')'));
                });
            }
        }
        //若控件为图片直接赋值给SRC属性
        if (value2.type == "img") {
            if (typeof(value2.imgConfig) != "undefined") {
                if (typeof(value2.imgConfig.imgSrc) != "undefined") {
                    $(t).attr("src", value2.imgConfig.imgSrc);
                }else if (typeof(value2.imgConfig.imgGetFunc) != "undefined"){
                    eval(value2.imgConfig.imgGetFunc + "(model)");
                }
            }
        }

        //弹出控件渲染
        if (value2.type == "layer" ) {
            if (typeof(value2.layerConfig) != "undefined") {
                if(typeof(value2.layerConfig.canDelete) != "undefined" && value2.layerConfig.canDelete) {
                    var hasClTag = false;
                    if ($(t).next().hasClass("clearlayer")) {
                        hasClTag = true;
                    }
                    if ($(t).next().hasClass("spanshow")) {
                        if ($(t).next().next().hasClass("clearlayer")) {
                            hasClTag = true;
                        }
                    }
                    if (!hasClTag) {
                        var $aclose = $("<a class='clearlayer'><img src='/medias/image/324.gif' align='absmiddle' style='margin-top:-4px;'></a>");
                        $(t).after($aclose);
                        $aclose.click(function () {
                            $(t).val("");
                            $(t).trigger("change");
                        });
                        var cwidth = $(t).width();
                        $(t).parent().hover(
                            function () {
                                if (!$(t).hasClass("disabled") && !($(t).is(":hidden") || $(t).hasClass("hideElement"))) {
                                    if(typeof(value2.layerConfig.canDelete) != "undefined" && value2.layerConfig.canDelete) {
                                        $(t).css("width", cwidth - 20);
                                        $aclose.show();
                                    }
                                }

                            },
                            function () {
                                if (!$(t).hasClass("disabled") && !($(t).is(":hidden") || $(t).hasClass("hideElement"))) {
                                    if(typeof(value2.layerConfig.canDelete) != "undefined" && value2.layerConfig.canDelete) {
                                        $(t).css("width", cwidth);
                                        $aclose.hide();
                                    }
                                }
                            }
                        )
                    }
                }
                $(t).prop("readonly", true);
                $(t).unbind("click");
                $(t).click(function () {
                    var urldata = "";
                    if (typeof(value2.layerConfig.checkFunc) != "undefined") {
                        var result = eval(value2.layerConfig.checkFunc + "(model)");
                        if (result == false) {
                            return;
                        } else if (result == true){

                        }else{
                            urldata = result;
                        }
                    }
                    openLayer(value2.layerConfig.title, value2.layerConfig.style, value2.layerConfig.url+"modelName="+modelname+"&func="+value2.layerConfig.callbackFunc+urldata);
                });
            }
        }

        //附件控件渲染
        if (value2.type == "file") {
            debugger;
            if (typeof(value2.fileConfig) != "undefined") {
                if($(t).next().hasClass("viewTag")){
                    $(t).next().unbind();
                    $(t).next().children().unbind();
                    $(t).next().empty();
                }
                if(value2.fileConfig.type != "image" && value2.fileConfig.type != "cysbImage"){
                    if(keyValue == null || $.trim(keyValue) == ""){
                        keyValue = forms.uuid();
                        model.set(pro,keyValue);
                    }
                }
                $(t).val(keyValue);
                var zdx = null;
                var zdName = null;
                var pcode = null;
                if (typeof(value2.fileConfig.zdName) != "undefined") {//zdName定义的条件下调用统一请求
                    pcode = value2.fileConfig.pcode;
                    zdx = JSON.stringify(model.MR.getZdDict(value2.fileConfig.zdName, value2.fileConfig.pcode));
                    zdName = value2.fileConfig.zdName;
                }
                var fjState = "xz";
                if($(t).hasClass("disabled")){
                    fjState = "ck";
                }
                var view;
                if(value2.fileConfig.type == "list"){
                    view = new AttachmentListView({
                        uuid:keyValue,
                        state:fjState,
                        listName:value2.fileConfig.listName,
                        collection:new AttachmentCollection(),
                        el:$(t).next(),
                        element:$(t),
                        dictStr:zdx,
                        zdName:zdName,
                        pcode:pcode,
                        fileType:value2.fileConfig.fileType,
                        minNum:value2.fileConfig.minNum,
                        defaultType:value2.fileConfig.defaultType
                    });
                }else if(value2.fileConfig.type == "div"){
                    view = new AttachmentDivView({
                        uuid:keyValue,
                        state:fjState,
                        uploadName:value2.fileConfig.uploadName,
                        collection:new AttachmentCollection(),
                        el:$(t).next(),
                        element:$(t),
                        fileType:value2.fileConfig.fileType,
                        minNum:value2.fileConfig.minNum,
                        defaultType:value2.fileConfig.defaultType,
                        showTag:value2.fileConfig.showTag
                    });
                }else if(value2.fileConfig.type == "table"){
                    view = new AttachmentTableView({
                        uuid:keyValue,
                        state:fjState,
                        listName:value2.fileConfig.listName,
                        collection:new AttachmentCollection(),
                        el:$(t).next(),
                        element:$(t),
                        fileType:value2.fileConfig.fileType,
                        minNum:value2.fileConfig.minNum,
                        defaultType:value2.fileConfig.defaultType
                    });
                }else if(value2.fileConfig.type == "single"){
                    view = new AttachmentSingleView({
                        uuid:keyValue,
                        state:fjState,
                        uploadName:value2.fileConfig.uploadName,
                        collection:new AttachmentCollection(),
                        el:$(t).next(),
                        element:$(t),
                        fileType:value2.fileConfig.fileType,
                        defaultType:value2.fileConfig.defaultType
                    });
                }else if(value2.fileConfig.type == "image"){
                    view = new ImageUploadView({
                        zpid:keyValue,
                        state:fjState,
                        collection:new AttachmentCollection(),
                        el:$(t).next(),
                        element:$(t),
                        ModelName:modelname,
                        property:pro,
                        fileType:value2.fileConfig.fileType
                    });
                }else if(value2.fileConfig.type == "cysbImage"){
                    view = new CysbUploadView({
                        zpid:keyValue,
                        state:fjState,
                        collection:new AttachmentCollection(),
                        el:$(t).next(),
                        element:$(t),
                        ModelName:modelname,
                        property:pro,
                        fileType:value2.fileConfig.fileType
                    });
                }
                $(view.el).addClass("viewTag");

                //挂载失焦去验证事件
                $(t).next().bind("click",function(){
                    $(t).removeClass("TextBoxErr");
                    //$(t).parent().find(".invalidtip").remove();
                })
            }
        }

        //挂载后置事件
        if(value2.changeFunc != "undefined" &&value2.changeFunc != undefined){
            $(t).bind("change",function(){
                eval(value2.changeFunc+"(model)");
            })
        }

        //值渲染
        if (tagName == "INPUT") {
            if (value2.type == "date") {    //若为日期控件，需将毫秒数转为日期格式
                if(keyValue != null && $.trim(keyValue.toString()) != ""){
                    if(!isDateTime(keyValue)){
                        var datestr = new Date(keyValue).Format(value2.dateConfig.dateFmt);
                        $(t).val(datestr);
                        model.set(pro,datestr);
                    }else{
                        $(t).val(keyValue);
                    }
                }else{
                    if(typeof(value2.dateConfig.defaultDate) == "undefined" || !value2.dateConfig.defaultDate){
                        $(t).val("");
                    }
                }
            }else{
                var type = $(t).prop("type");
                switch (type) {
                    case "text":
                        if (keyValue != null)
                            $(t).val(keyValue);
                        break;
                    case "hidden":
                        if (keyValue != null)
                            $(t).val(keyValue);
                        break;
                    case "checkbox":
                        var checkval = keyValue.toString().split(",");

                        for (var i = 0; i < checkval.length; i++) {
                            if(checkval[i] == $(t).attr("checkvalue")){
                                $(t).prop("checked",true);
                            }

                        }
                        break;
                    case "radio":
                        if (keyValue != null)
                            $(t).prop("checked", keyValue == $(t).val());
                        $(t).click(function () {
                            $("*[data-model=" + model.get("ModelName") + "][data-property=" + pro + "]").parent().removeClass("TextBoxErr");
                        });
                        break;
                }
            }
        } else if (tagName == "SELECT") {
            //若为字典项，先获取字典项
            if (value2.type == "dict") {
                var zdx = null;
                if (typeof(value2.dictConfig) != "undefined") {
                    if (typeof(value2.dictConfig.reqInterface) != "undefined") {//自定义获取字典项json接口
                        zdx = eval(value2.dictConfig.reqInterface+"(model)");
                        model.MR.fillDict($(t), model.get("ModelName"), value2, model, zdx, pro);
                        $(t).val(keyValue);
                    }else if (typeof(value2.dictConfig.zdName) != "undefined" ) {//zdName定义的条件下调用统一请求
                        var zdx = model.MR.getZdDict(value2.dictConfig.zdName, value2.dictConfig.pcode);
                        if (zdx != null) {
                            model.MR.fillDict($(t), model.get("ModelName"), value2, model, zdx, pro);
                            $(t).val(keyValue);
                        }
                    }
                    if($(t).hasClass("select2-hidden-accessible")){
                        if($(t).next().hasClass("select2")){
                            $(t).next().remove();
                        }
                    }
                    if(value2.dictConfig.ifSearch){
                        if(!$(t).hasClass("disabled") && !$(t).is(":hidden")){
                            $(t).select2();
                        }
                    }
                }
            }
        } else if (tagName == "LABEL" || tagName == "SPAN") {
            if (keyValue != null)
                $(t).text(keyValue);
        } else if (tagName == "TEXTAREA") {
            if (keyValue != null)
                keyValue = keyValue.replace(/<br>/g, "\n");
            $(t).val(keyValue);
        } else if (tagName == "DIV") {
            //若为字典项，先获取字典项
            if (value2.type == "dict") {
                var zdx = null;
                if (typeof(value2.dictConfig) != "undefined") {
                    if (typeof(value2.dictConfig.reqInterface) != "undefined") {//自定义获取字典项json接口
                        zdx = eval(value2.dictConfig.reqInterface+"(model)");
                        model.MR.fillDict($(t), model.get("ModelName"), value2, model, zdx, pro);
                        if (keyValue != null) {
                            var checkval = keyValue.toString().split(",");
                            for (var i = 0; i < checkval.length; i++) {
                                $(t).find('input[type=checkbox][value=' + checkval[i] + ']').each(function () {
                                    $(this).attr("checked", "checked");
                                });
                                $(t).find('input[type=radio][value=' + checkval[i] + ']').each(function () {
                                    $(this).attr("checked", "checked");
                                });
                            }
                        }
                    }else if (typeof(value2.dictConfig.zdName) != "undefined" ) {//zdName定义的条件下调用统一请求
                        var zdx = model.MR.getZdDict(value2.dictConfig.zdName, value2.dictConfig.pcode);
                        if (zdx != null) {
                            model.MR.fillDict($(t), model.get("ModelName"), value2, model, zdx, pro);
                            if (keyValue != null) {
                                var checkval = keyValue.toString().split(",");
                                for (var i = 0; i < checkval.length; i++) {
                                    $(t).find('input[type=checkbox][value=' + checkval[i] + ']').each(function () {
                                        $(this).attr("checked", "checked");
                                    });
                                    $(t).find('input[type=radio][value=' + checkval[i] + ']').each(function () {
                                        $(this).attr("checked", "checked");
                                    });
                                }
                            }
                        }
                    }
                    if($(t).hasClass("disabled")){
                        $(t).find('input[type=checkbox]').each(function () {
                            $(this).prop("disabled", true);
                            $(this).addClass("disabled");
                        });
                        $(t).find('input[type=radio]').each(function () {
                            $(this).prop("disabled", true);
                            $(this).addClass("disabled");
                        });
                    }
                }
            }
        }

        //对控件默认值赋值
        if( $(t).val() == null || $(t).val() == ""){
            if (typeof(value2.defaultValue) != "undefined") {
                model.set(pro,value2.defaultValue);
                $(t).val(value2.defaultValue);
            }
        }

        //挂载失焦去验证事件
        $(t).bind("focus",function(){
            $(t).removeErrorTip();
            $(t).removeErrorTip2();
        })

        $(t).bind("focus",function(){
            $(t).addClass("prompt");
        })

        $(t).bind("blur",function(){
            $(t).removeClass("prompt");
        })
        model.MR.disabledHandle(t);
        //}
    }
}



//创建detailModel类
var DetailModel = Backbone.RelationalModel.extend({
    className:"",   //需赋值：model类名，是model类型的唯一标识
    initJson:"",    //需赋值：配置json
    stateJson:"",      //需赋值：状态json
    dictJson:null,
    state:"",           //状态，“ck”查看、其他
    checked:false,    //model关联元素是否被选中，作为状态位控制
    idAttribute:"ModelName",
    edit:null,
    lookflg:null,
    MR:new MR(),
    /*****************************************************************
     *  方法：内部方法，backbone.model自带的初始化构造器
     *****************************************************************/
    initialize: function () {
        this.initRelations();
        this.initPropertys();
        if(this.get("ModelName")== null || this.get("ModelName") == "") {
            this.setModelName();
        }
        var edit = GetQueryString("edit");
        if(edit != null){
            this.edit = edit;
        }
        var lookflg = GetQueryString("lookflg");
        if(lookflg != null){
            this.lookflg = lookflg;
        }
        this.beforeRender();
    },
    /*****************************************************************
     *  方法：需实现接口，设置model名称
     *****************************************************************/
    setModelName: function () {
        this.set("ModelName",this.className);
    },
    /*****************************************************************
     *  方法：需实现接口，渲染前置，一般用来控制区域显示
     *****************************************************************/
    beforeRender: function() {

    },
    /*****************************************************************
     *  方法：内部方法，依据配置初始化属性参数
     *****************************************************************/
    initPropertys: function () {
        var model = this;
        model.idAttribute = "ModelName";
        var json = this.initJson;
        //传入参数为基础配置json
        $.each(json, function (key, value) {
            if(key == model.className){
                $.each(value, function (key2, value2) {
                    if(key2.toLowerCase() != key2 || key2.toUpperCase() != key2){
                        if(model.get(key2.toUpperCase()) != undefined){
                            if(key2.toUpperCase() != key2){
                                model.set(key2, model.get(key2.toUpperCase()));
                                model.unset(key2.toUpperCase());
                            }
                        }else if(model.get(key2.toLowerCase()) != undefined){
                            if(key2.toLowerCase() != key2){
                                model.set(key2, model.get(key2.toLowerCase()));
                                model.unset(key2.toLowerCase());
                            }
                        }else if(model.get(key2) == undefined) {
                            model.set(key2, '');
                        }
                    }else if(model.get(key2) == undefined) {
                        model.set(key2, '');
                    }

                    //对model属性默认值赋值
                    if(model.get(key2).toString() == ""){
                        if (typeof(value2.defaultValue) != "undefined") {
                            model.set(key2, value2.defaultValue);
                        }
                    }
                });
            }
        });
    },
    /*****************************************************************
     *  方法：内部方法，依据配置初始化关系数据
     *****************************************************************/
    initRelations: function () {
        var model = this;
        var relations = model.relations;
        if (relations.length > 0) {
            for (var n = 0; n < relations.length; n++) {
                var tempkey = relations[n].key.toString();
                if (relations[n].type == Backbone.HasMany) {
                    if(model.get(tempkey) == null){
                        model.set(tempkey, new relations[n].collectionType());
                    }
                    if(relations[n].hasFirstData && (model.get(tempkey).models == null || model.get(tempkey).models.length == 0)){
                        model.get(tempkey).add(new relations[n].relatedModel());
                    }
                } else if (relations[n].type == Backbone.HasOne) {
                    if(model.get(tempkey) == null){
                        model.set(tempkey, new relations[n].relatedModel());
                    }
                }
            }
        }
    },
    /*****************************************************************
     *  方法：内部接口，递归获取模型的json
     *  属性：relationTag 是否关联model的标志
     *        model 递归用变量，无需赋值
     *****************************************************************/
    getModelJson: function (getSelfTag, model) {
        //若为新增数据，且数据无效，则不上报
        if(isNotNullStr(model.get("sfyx_st")) && model.get("sfyx_st") == "UNVALID"){
            if($.trim(model.get("id")) == ""){
                return "";
            }
        }
        var jsonstr = "{";
        var initJson = model.initJson;
        var json2 = initJson[model.className];
        $.each(json2, function(property, json){
            if(json.ifForm == undefined || json.ifForm) {
                var value = model.get(property);
                value = replaceStrChar(value,"\"","\\\"");
                jsonstr += '"' + property + '":"' + value + '",';
            }
        });
        //若处理关联项，则递归本函数
        if(!getSelfTag) {
            var relations = model.relations;
            //alert(relations[0].type == Backbone.HasMany);
            if (relations.length > 0) {
                for (var n = 0; n < relations.length; n++) {
                    var tempkey = relations[n].key.toString();
                    if (relations[n].type == Backbone.HasMany) {
                        if (model.get(tempkey).length > 0) {
                            var itemsstr = "";
                            for (var i = 0; i < model.get(tempkey).length; i++) {
                                itemsstr += this.getModelJson(getSelfTag,model.get(tempkey).at(i));
                            }
                            if (itemsstr.length > 1) {
                                itemsstr = itemsstr.substr(0, itemsstr.length - 1);
                                jsonstr += "\"" + tempkey + "\":[" + itemsstr + "],";
                            } else {
                                jsonstr += "\"" + tempkey + "\":[],";
                            }
                        }
                    } else if (relations[n].type == Backbone.HasOne) {
                        if(model.get(tempkey) != null){
                            jsonstr += "\"" + tempkey + "\":" + this.getModelJson(getSelfTag,model.get(tempkey));
                        }
                    }
                }
            }
        }
        if(jsonstr.length > 1){
            jsonstr = jsonstr.substr(0, jsonstr.length - 1);
        }
        jsonstr += "},";
        return jsonstr;
    },
    /*************************************************
     *  方法：外部接口，获取model转换后json
     *  属性：getSelfTag 是否值返回自己的非关联的json
     ************************************************/
    getJson: function (getSelfTag) {
        if(!getSelfTag){
            getSelfTag = false;
        }
        var model = this;
        //先更新model数据
        model.updateModel();
        var jsonstr = "";
        jsonstr += model.getModelJson(getSelfTag,model);
        if(jsonstr.length > 1){
            jsonstr = jsonstr.substr(0, jsonstr.length - 1);
        }
        jsonstr = model.editGetJson(jsonstr);
        return jsonstr;
    },
    /*************************************************
     *  方法：可实现接口：编辑getJson返回json值
     *  属性：json 传入的model生成的json值
     *  返回值：个性处理后的json值
     ************************************************/
    editGetJson: function(json){
        return json;
    },
    /*****************************************************************
     *  方法：内部接口，用于渲染字段状态
     *  属性：classJson 传入stateJson属于model类的部分；
     *        model 递归用变量，无需赋值
     *  返回值：状态与历史状态不同的字段集合（用于rerender时局部重渲染）
     *****************************************************************/
    renderState: function(classJson, model){
        var changedPros = [];
        var initJson = model.initJson;
        if(classJson){
            if (typeof(classJson.disable) != "undefined") {  //禁止模式状态配置
                $("*[data-model=" + model.get("ModelName") + "][data-property]").each(function (i, t) {

                    var pro = $(t).attr("data-property");
                    if(initJson[model.className][pro] == undefined){
                        console.log(model.get("ModelName")+"的"+pro+"属性配置不存在");
                    }
                    if ($.inArray(pro, classJson.disable) == -1) {
                        if (initJson[model.className][pro].disabled == true) {
                            if(!$(t).hasClass("disabled")){
                                changedPros.push(pro);
                            }
                            $(t).attr("disabled", "disabled");
                            $(t).addClass("disabled");
                        } else {
                            if($(t).hasClass("disabled")){
                                changedPros.push(pro);
                                $(t).removeClass("disabled");
                            }
                            $(t).attr("disabled", false);
                        }
                    } else {
                        if(!$(t).hasClass("disabled")){
                            changedPros.push(pro);
                        }
                        $(t).attr("disabled", "disabled");
                        $(t).addClass("disabled");
                    }
                });
            } else if (typeof(classJson.enable) != "undefined") {   //工作模式状态配置
                $("*[data-model=" + model.get("ModelName") + "][data-property]").each(function (i, t) {
                    var pro = $(t).attr("data-property");
                    if(initJson[model.className][pro] == undefined){
                        console.log(model.get("ModelName")+"的"+pro+"属性配置不存在");
                    }
                    if ($.inArray(pro, classJson.enable) == -1) {
                        if(!$(t).hasClass("disabled")){
                            changedPros.push(pro);
                        }
                        $(t).attr("disabled", "disabled");
                        $(t).addClass("disabled");
                    }else{
                        if (initJson[model.className][pro].disabled == true) {
                            if(!$(t).hasClass("disabled")){
                                changedPros.push(pro);
                            }
                            $(t).attr("disabled", "disabled");
                            $(t).addClass("disabled");
                        }else{
                            if($(t).hasClass("disabled")){
                                changedPros.push(pro);
                                $(t).removeClass("disabled");
                            }
                            $(t).attr("disabled", false);
                        }
                    }
                })
            }
        }
        return changedPros;
    },
    /*****************************************************************
     *  方法：对外接口，进行初次渲染
     *  属性：stateJson 状态参数，若传入，则覆盖model本身的stateJson；
     *        renderSelfTag 仅渲染自身标志，默认为false
     *        model 递归用变量，无需赋值
     *****************************************************************/
    render:function(stateJson,renderSelfTag,model){
        //参数初始值处理
        if(typeof(stateJson) == "boolean"){
            renderSelfTag = stateJson;
            stateJson = this.stateJson;
        }else if(!stateJson){
            stateJson = this.stateJson;
        }else{//若为传入stateJson，则用传入stateJson覆盖原有stateJson。
            this.stateJson = stateJson;
        }
        if(!renderSelfTag){
            renderSelfTag = false;
        }
        if(!model){
            model = this;
        }
        var initJson = this.initJson;
        var classJson = stateJson[this.className];
        if(!classJson){//若未配置class的状态，则默认全部enable
            classJson = {disable:[]};
        }
        model.renderState(classJson,model);

        $("*[data-model=" + model.get("ModelName") + "][data-property]").each(function (i, t) {
            model.MR.renderProperty(t,model);
        });

        //若处理关联项，则递归本函数
        if(!renderSelfTag) {
            var relations = model.relations;
            //alert(relations[0].type == Backbone.HasMany);
            if (relations.length > 0) {
                for (var n = 0; n < relations.length; n++) {
                    var tempkey = relations[n].key.toString();
                    if (relations[n].type == Backbone.HasMany) {
                        if (model.get(tempkey).length > 0) {
                            for (var i = 0; i < model.get(tempkey).length; i++) {
                                this.render(stateJson,renderSelfTag,model.get(tempkey).at(i));
                            }
                        }
                    } else if (relations[n].type == Backbone.HasOne) {
                        if(model.get(tempkey) != null){
                            this.render(stateJson,renderSelfTag,model.get(tempkey));
                        }
                    }
                }
            }
        }
    },
    /*********************************************************************************************
     *  方法：对外接口，重新渲染。
     *  属性：reRenderJson 重渲染参数，若传入，则有效部分覆盖model本身的stateJson或initJson字段；
     *        renderSelfTag 仅渲染自身标志，默认为false
     *        model 递归用变量，无需赋值
     ********************************************************************************************/
    reRender:function(reRenderJson,renderSelfTag,model){
        //参数初始值处理
        if(typeof(reRenderJson) == "boolean"){
            renderSelfTag = reRenderJson;
            reRenderJson = null;
        }
        if(!renderSelfTag){
            renderSelfTag = false;
        }
        if(!reRenderJson){
            this.render(renderSelfTag,model);
            return;
        }
        if(!model){
            model = this;
        }
        var classJson = reRenderJson[model.className];
        var changePros = {};
        if(classJson){
            for(key in classJson){
                if(key == "enable"){
                    delete model.stateJson[model.className].disable;
                    model.stateJson[model.className].enable = classJson.enable;
                }else if(key == "disable"){
                    delete model.stateJson[model.className].enable;
                    model.stateJson[model.className].disable = classJson.disable;
                }else{
                    changePros[key] = classJson[key];
                    model.initJson[model.className][key] = classJson[key];
                }
            }
            model.updateModel(true,model);
            //渲染状态，并把状态变更的字段按需插入变更字段集合中去
            var stateChangePros = model.renderState(classJson,model);
            for(var i = 0; i < stateChangePros.length; i++){
                if(!changePros[key]){
                    changePros[key] = {};
                }
            }
            //遍历变更字段集合，渲染各个字段
            for(key in changePros){
                $("*[data-model=" + model.get("ModelName") + "][data-property="+key+"]").each(function (i, t) {
                    model.MR.renderProperty(t,model);
                });
            }
        }
        //若处理关联项，则递归本函数
        if(!renderSelfTag) {
            var relations = model.relations;
            //alert(relations[0].type == Backbone.HasMany);
            if (relations.length > 0) {
                for (var n = 0; n < relations.length; n++) {
                    var tempkey = relations[n].key.toString();
                    if (relations[n].type == Backbone.HasMany) {
                        if (model.get(tempkey).length > 0) {
                            for (var i = 0; i < model.get(tempkey).length; i++) {
                                this.reRender(reRenderJson,renderSelfTag,model.get(tempkey).at(i));
                            }
                        }
                    } else if (relations[n].type == Backbone.HasOne) {
                        if(model.get(tempkey) != null){
                            this.reRender(reRenderJson,renderSelfTag,model.get(tempkey));
                        }
                    }
                }
            }
        }
    },
    /************************************************************************************************************
     *  方法：对外接口，清空模型字段内容。
     *  属性：propertyArray 可为字符串（清空一个字段内容），字符串数组（清空多个字段内容），空（清空所有字段内容）
     *        emptyDomTag 是否同时清空页面dom元素的标志,默认为true
     ************************************************************************************************************/
    empty: function(propertyArray,emptyDomTag){
        var model = this;
        var className = this.className;
        var json = this.initJson;
        var emptyAll = true;
        if(propertyArray){
            emptyAll = false;
        }
        if(typeof(propertyArray) == "string"){
            var temp = [];
            temp.push(propertyArray);
            propertyArray = temp;
            emptyAll = false;
        }
        if(!emptyDomTag){
            emptyDomTag = true;
        }
        $.each(json[className],function(property){
            if(emptyAll || $.inArray(property,propertyArray) > -1){
                $("*[data-model=" + model.get("ModelName") + "][data-property="+property+"]").each(function (i, t) {
                    model.MR.emptyProperty(t,property,model,emptyDomTag);
                });
            }
        });
    },
    /******************************************************
     *  方法：对外接口，清楚模型渲染内容。
     *  属性：clearSelfTag 是否仅清除自身的标志,默认为false
     ******************************************************/
    clearRender: function(clearSelfTag){
        if(!clearSelfTag){
            clearSelfTag = false;
        }
        var model = this;

        $("*[data-model=" + model.get("ModelName") + "][data-property]").each(function (i, t) {
            model.MR.clearPropertyRender(t,model);
        });

        //若处理关联项，则递归本函数
        if(!clearSelfTag) {
            var relations = model.relations;
            //alert(relations[0].type == Backbone.HasMany);
            if (relations.length > 0) {
                for (var n = 0; n < relations.length; n++) {
                    var tempkey = relations[n].key.toString();
                    if (relations[n].type == Backbone.HasMany) {
                        if (model.get(tempkey).length > 0) {
                            for (var i = 0; i < model.get(tempkey).length; i++) {
                                this.clearRender(clearSelfTag,model.get(tempkey).at(i));
                            }
                        }
                    } else if (relations[n].type == Backbone.HasOne) {
                        if(model.get(tempkey) != null){
                            this.clearRender(clearSelfTag,model.get(tempkey));
                        }
                    }
                }
            }
        }
    },
    /************************************************************************
     *  方法：对外接口，更新表单内容至模型数据中。
     *  属性：updateSelfTag 是否仅模型自身二不处理关系模型的标志,默认为false
     ***********************************************************************/
    updateModel: function(updateSelfTag,model){
        if(!updateSelfTag){
            updateSelfTag = false;
        }
        if(!model){
            model = this;
        }
        $("*[data-model=" + model.get("ModelName") + "][data-property]").each(function (i, t) {
            model.MR.updateModelByElement(t,model);
        });
        //若处理关联项，则递归本函数
        if(updateSelfTag) {
            var relations = model.relations;
            //alert(relations[0].type == Backbone.HasMany);
            if (relations.length > 0) {
                for (var n = 0; n < relations.length; n++) {
                    var tempkey = relations[n].key.toString();
                    if (relations[n].type == Backbone.HasMany) {
                        if (model.get(tempkey).length > 0) {
                            for (var i = 0; i < model.get(tempkey).length; i++) {
                                this.updateModel(updateSelfTag,model.get(tempkey).at(i));
                            }
                        }
                    } else if (relations[n].type == Backbone.HasOne) {
                        if(model.get(tempkey) != null){
                            this.updateModel(updateSelfTag,model.get(tempkey));
                        }
                    }
                }
            }
        }
    },
    /**********************************************
     *  方法：对外接口，更新json数据至模型数据中
     *  属性：obj 传入的json数据
     **********************************************/
    updateFromObject: function (obj) {
        var model = this;
        var json = this.initJson;
        for ( var p in obj ) {
            $.each(json, function (key, value) {
                if (key == model.className) {
                    $.each(value, function (key2, value2) {
                        if (key2.toLowerCase() == p.toLowerCase()) {
                            if (obj[p] != null && obj[p].toString() != "") {
                                model.set(key2, obj[p]);
                            }
                        }
                    });
                }
            });
        }
    },
    /************************************************************
     *  方法：对外接口，验证model
     *  属性：variableJson 传入的需验证的类字段json
     *        checkSelfTag 是否值验证费关联的model自身，默认false
     *        model 递归参数，无需传入
     *  返回值：是否通过验证，true为通过验证，false为未通过验证
     ************************************************************/
    ruleValidate: function(variableJson,checkSelfTag,model) {
        var result = true;
        //参数初始值处理
        if(typeof(variableJson) == "boolean"){
            checkSelfTag = variableJson;
            variableJson = null;
        }
        if(!checkSelfTag){
            checkSelfTag = false;
        }
        if(!model){
            model = this;
        }

        $("*[data-model=" + model.get("ModelName") + "][data-property]").each(function (i, t) {
            if(!$(t).parent().eq(0).hasClass("hideElement") && !$(t).hasClass("disabled")) {
                $(t).removeErrorTip();
                $(t).removeErrorTip2();
            }
        });

        var variableAllTag = variableJson?false:true;
        if(variableAllTag){
            $("*[data-model=" + model.get("ModelName") + "][data-property]").each(function (i, t) {
                var tresult = model.MR.variableProperty(t,model)
                result = (result ? tresult : false);
            });
        }else{
            var propertys = variableJson[model.className];
            if(propertys){
                for(var i = 0; i < propertys.length; i++){
                    $("*[data-model=" + model.get("ModelName") + "][data-property="+propertys[i]+"]").each(function (i, t) {
                        var tresult = model.MR.variableProperty(t,model)
                        result = (result ? tresult : false);
                    })
                }
            }
        }

        //若处理关联项，则递归本函数
        if(checkSelfTag) {
            var relations = model.relations;
            //alert(relations[0].type == Backbone.HasMany);
            if (relations.length > 0) {
                for (var n = 0; n < relations.length; n++) {
                    var tempkey = relations[n].key.toString();
                    if (relations[n].type == Backbone.HasMany) {
                        if (model.get(tempkey).length > 0) {
                            var itemsstr = "";
                            for (var i = 0; i < model.get(tempkey).length; i++) {
                                var tresult = model.modelVariable(checkSelfTag,model.get(tempkey).at(i));
                                result = (result ? tresult : false);
                            }
                        }
                    } else if (relations[n].type == Backbone.HasOne) {
                        var tresult = true;
                        if(model.get(tempkey) != null){
                            var tresult = model.modelVariable(checkSelfTag,model.get(tempkey));
                            result = (result ? tresult : false);
                        }
                    }
                }
            }
        }
        if(!result){
            scrollToError();
        }
        return result;
    },
    /************************************************************
     *  方法：对外接口，验证model值是否改变
     *  属性：variableJson 传入的需验证的类字段json
     *        checkSelfTag 是否值验证非关联的model自身，默认false
     *        model 递归参数，无需传入
     *  返回值：是否改变，true为已改变，false为未改变
     ************************************************************/
    changeValidate:function(variableJson,checkSelfTag,model) {
        var result = false;
        //参数初始值处理
        if(typeof(variableJson) == "boolean"){
            checkSelfTag = variableJson;
            variableJson = null;
        }
        if(!checkSelfTag){
            checkSelfTag = false;
        }
        if(!model){
            model = this;
        }
        var variableAllTag = variableJson?false:true;
        if(variableAllTag){
            $("*[data-model=" + model.get("ModelName") + "][data-property]").each(function (i, t) {
                var tresult = model.MR.variableChange(t,model);
                result = ( !result ? tresult : true);
            });
        }else{
            var propertys = variableJson[model.className];
            if(propertys){
                for(var i = 0; i < propertys.length; i++){
                    $("*[data-model=" + model.get("ModelName") + "][data-property="+propertys[i]+"]").each(function (i, t) {
                        var tresult = model.MR.variableChange(t,model);
                        result = ( !result ? tresult : true);
                    })
                }
            }
        }

        //若处理关联项，则递归本函数
        if(checkSelfTag) {
            var relations = model.relations;
            //alert(relations[0].type == Backbone.HasMany);
            if (relations.length > 0) {
                for (var n = 0; n < relations.length; n++) {
                    var tempkey = relations[n].key.toString();
                    if (relations[n].type == Backbone.HasMany) {
                        if (model.get(tempkey).length > 0) {
                            var itemsstr = "";
                            for (var i = 0; i < model.get(tempkey).length; i++) {
                                var tresult = model.changeVariable(variableJson,checkSelfTag,model.get(tempkey).at(i));
                                result = ( !result ? tresult : true);
                            }
                        }
                    } else if (relations[n].type == Backbone.HasOne) {
                        var tresult = true;
                        if(model.get(tempkey) != null){
                            var tresult = model.changeVariable(variableJson,checkSelfTag,model.get(tempkey));
                            result = ( !result ? tresult : true);
                        }
                    }
                }
            }
        }
        return result;
    },
    /*********************************
     *  方法：对外接口，勾选/反选model
     *  属性：state 是否被勾选
     *********************************/
    checkModel: function(state){
        this.checked = state;
    },
});



