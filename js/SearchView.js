/*****************************************************************
 * 搜索面板
 * 最后更新时间：2016-02-24
 * 最后更新人：zhan
 *****************************************************************/
var SearchModel = Backbone.Model.extend({
    className:"",   //需赋值：model类名，是model类型的唯一标识
    initJson:"",    //需赋值：配置json
    idAttribute:"id",
    //初始化执行函数
    initialize: function () {
        this.setModelName();
        this.initPropertys();
    },
    //需实现接口：设置model名称
    setModelName: function () {
        this.set("ModelName",this.className);
    },
    //需实现接口：渲染前置，一般用来控制区域显示
    beforeRender: function() {

    },
    //依据配置初始化属性参数
    initPropertys: function () {
        var model = this;
        model.idAttribute = "ModelName";
        var json = this.initJson;
        //传入参数为基础配置json
        $.each(json, function (key, value) {
            if(key == model.className){
                $.each(value, function (key2, value2) {
                    if(model.get(key2) == undefined)
                        model.set(key2, '');
                });
            }
        });
        model.beforeRender();
    },
    //渲染select控件
    fillSelect: function (obj, json, value, isTrigger, showQxz) {
        //if (isTrigger != "noTrigger")
        //    $(obj).trigger("propertychange");
        $(obj).empty();
        if (value != undefined && value != null) {
            if(showQxz == null || showQxz){
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
            if(showQxz == null || showQxz){
                $(obj).append("<option value=''>请选择</option>");
            }
            for (var i = 0; i < json.length; i++) {
                $(obj).append("<option value='" + json[i].code + "'>"
                    + json[i].value + "</option>");
            }
        }
    },
    //渲染字典控件
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
                        + value2.dictConfig.dependence + "]").bind("change",
                        function () {
//                        alert("触发了change");
                            var pValue = $(this).val();
                            var dataStrIn = "[";
                            for (var i = 0; i < zdx.length; i++) {
                                if (typeof(zdx[i].pcode) != "undefined" && zdx[i].pcode != null) {
                                    if (zdx[i].pcode == pValue) {
                                        dataStrIn += "{code:\"" + zdx[i].code + "\",value:\"" + zdx[i].value + "\",pcode:\"" + zdx[i].pcode + "\"},";
                                    }
                                }
                            }
                            if (dataStrIn != "[") {
                                dataStrIn = dataStrIn.substr(0, dataStrIn.length - 1);
                                dataStrIn += "]";
                                model.fillSelect(obj.get(0), eval(dataStrIn), value2.defaultValue, null, value2.dictConfig.showQxz);
                            } else {
                                model.fillSelect(obj.get(0), [], value2.defaultValue, null, value2.dictConfig.showQxz);
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
                            //if (typeof(zdx[i].pcode) == "undefined" || zdx[i].pcode == null) {
                            dataStr += "{code:\"" + zdx[i].code + "\",value:\"" + zdx[i].value + "\"},"
                            //}
                        }
                    } else {
                        for (var i = 0; i < zdx.length; i++) {
                            if (typeof(zdx[i].pcode) != "undefined" && value2.dictConfig.pcode != null) {
                                if (zdx[i].pcode == pcode) {
                                    dataStr += "{code:\"" + zdx[i].code + "\",value:\"" + zdx[i].value + "\",pcode:\"" + zdx[i].pcode + "\"},";
                                }
                            }
                        }
                    }
                    dataStr = dataStr.substr(0, dataStr.length - 1);
                    dataStr += "]";
                    dataStr = eval(dataStr);
                    model.fillSelect(obj.get(0), dataStr, value2.defaultValue, null, value2.dictConfig.showQxz);
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
                                    //if (typeof(zdx[i].pcode) == "undefined") {
                                    check = check + "<label><input type='checkbox' class='checkbox' value='" +
                                        zdx[i].code + "'/>" + zdx[i].value + "</label>";
                                    //}
                                }
                            } else {
                                for (var i = 0; i < zdx.length; i++) {
                                    if (typeof(zdx[i].pcode) != "undefined"  && value2.dictConfig.pcode != null) {
                                        if (zdx[i].pcode == pcode) {
                                            check = check + "<label><input type='checkbox' class='checkbox' value='" +
                                                zdx[i].code + "'/>" + zdx[i].value + "</label>";
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
                                    //if (typeof(zdx[i].pcode) == "undefined") {
                                    radio = radio + "<label><input type='radio' class='radio' name='" + key2 + "' value='" +
                                        zdx[i].code + "'/>" + zdx[i].value + "</label>";
                                    //}
                                }
                            } else {
                                for (var i = 0; i < zdx.length; i++) {
                                    var radio = "";
                                    if (typeof(zdx[i].pcode) != "undefined" && value2.dictConfig.pcode != null) {
                                        if (zdx[i].pcode == pcode) {
                                            radio = radio + "<label><input type='radio' class='radio' name='" + key2 + "' value='" +
                                                zdx[i].code + "'/>" + zdx[i].value + "</label>";
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
    }
});

//动态表单块
var SearchView = Backbone.View.extend({
    tagName: 'div', //标签名，暂固定为div
    className: '',   //个体样式
    gridReload:null,    //列表刷新方法
    cols:6, //列设置
    colHtml:"<col width='80px'/> <col width='200px' /> <col width='80px'/> <col width='200px'/> <col width='80px'/> <col width='200px' />", //列宽设置
    //初始化方法
    initialize: function (options) {
        if(options.cols != null){
            this.cols = options.cols;
        }
        if(options.colHtml != null && options.colHtml != ""){
            this.colHtml = options.colHtml;
        }
        if(options.gridReload != null){
            this.gridReload = options.gridReload;
        }
        if(options.checkSearch != null){
            this.checkSearch = options.checkSearch;
        }
        //this.render();
    },
    checkSearch: function(){
        return true;
    },
    //查询事件
    search:function(){
        if(this.checkSearch()){

            this.gridReload(this.getSearchJson());
        }
    },
    //主渲染方法
    render: function(){
        var view = this;
        $(this.el).empty();
        $(this.el).append(view.tableRender());
        $(this.el).find("#search").click(function(){
            var searchButton =  $(this);
            searchButton.val("检索中").prop("disabled", true).addClass("runDisabled");
            setTimeout(function(){
                view.search();
                searchButton.val("查   询").prop("disabled", false).removeClass("runDisabled");;
            },10);

        });
        view.modelRender();
    },
    //查询面板渲染主方法
    tableRender: function() {
        var view = this;
        var model = view.model;
        var valueJson = model.initJson[model.className];
        var tableHtml = "<table cellpadding='0' cellspacing='0' border='0' class='ConditionsForm'>";
        tableHtml += view.colHtml + "<tr>";
        var index = 0;
        $.each(valueJson,function(key,value2){
            if(index > 0 && index%view.cols == 0){
                tableHtml += "</tr><tr>";
            }
            if (value2.type == "dict") {
                tableHtml += "<th>"+value2.tagName+"</th>" +
                    "<td>" +
                    "<select name='' class='select' data-model='"+model.get("ModelName")+"' data-property='"+key+"'>"+
                        "<option value=''></option>"+
                    "</select>"+
                    "</td>";
            }else if(value2.type == "date") {
                tableHtml += "<th>"+value2.tagName+"</th>" +
                    "<td>" +
                    "<input type='text' class='txt STextdate' value=''  data-model='"+model.get("ModelName")+"' data-property='"+key+"'>"+
                    "</td>";
            }else{
                tableHtml += "<th>"+value2.tagName+"</th>" +
                    "<td>" +
                    "<input type='text' class='txt' value=''  data-model='"+model.get("ModelName")+"' data-property='"+key+"'>"+
                    "</td>";
            }
            if(value2.display != "none"){
                index += 2;
            }
        });
        tableHtml += "<th><input id='search' class='button' type='button' value='查   询'/></th>";
        tableHtml += "</tr></table>";
        return tableHtml;
    },
    //面板中元素规则渲染方法
    modelRender: function () {
        var model = this.model;
        //确保初始化先执行
        var initJson = model.initJson;//获取表单配置数据

        $("*[data-model=" + model.get("ModelName") + "][data-property]").each(function (i, t) {
            var tagName = $(t).prop("tagName");
            var modelname = $(t).attr("data-model");
            var pro = $(t).attr("data-property");
            var keyValue = model.get(pro);
            var value2 = initJson[model.className][pro];
            if(value2 == undefined){
                console.log(model.get("ModelName")+"的"+pro+"属性配置不存在");
            }

            //规则绑定
            if (typeof(value2.rules) != "undefined") {
                if (typeof(value2.rules.checkValue) != "undefined") {
                    //如果变量存在valueRules验证规则，则在DOM上添加相应事件
                    if (value2.rules.checkValue.length > 0) {
                        var objselect = "$(\"*[data-model='" + modelname + "'][data-property='" + pro + "']\")" + ".get(0)";
                        //对DOM添加事件
                        $(t).bind("blur", function () {
                            for (var i = 0; i < value2.rules.checkValue.length; i++) {
                                if (!eval(value2.rules.checkValue[i] + "(" + objselect + ")"))
                                    break;
                            }
                        });
                    }
                }
            }
            //禁止的控制
            if (typeof(value2.disabled) != "undefined") {
                if (value2.disabled) {
                    $(t).attr("disabled", "disabled");
                }
            }
            //可见、不可见的控制
            if (typeof(value2.display) != "undefined") {
                if (value2.display == "none") {
                    $(t).parent().addClass("hideElement");
                    $(t).parent().prev().addClass("hideElement");
                }
            }
            //最大长度的控制
            if (typeof(value2.maxLength) != "undefined") {
                $(t).attr("maxLength", value2.maxLength);
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
            if (value2.type == "layer") {
                if (typeof(value2.layerConfig) != "undefined") {
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
                if (typeof(value2.fileConfig) != "undefined") {
                    $(t).val(keyValue);
                    //var fileView = new AttachmentCollection([],{
                    //    uuid:keyValue,
                    //    el:$(t)
                    //});
                    var view = new AttachmentListView({
                        uuid:keyValue,
                        state:model.state,
                        listName:value2.fileConfig.listName,
                        collection:new AttachmentCollection(),
                        el:$(t).next(),
                        element:$(t)
                    });
                }
            }

            //值渲染
            if (tagName == "INPUT") {
                if (value2.type == "date") {    //若为日期控件，需将毫秒数转为日期格式
                    if(keyValue != null && $.trim(keyValue.toString()) != ""){
                        var datestr = new Date(keyValue).Format(value2.dateConfig.dateFmt);
                        $(t).val(datestr);
                        model.set(pro,datestr);
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
                                $(t).prop("checked", checkval[i] == $(t).attr("checkvalue"));
                            }
                            break;
                        case "radio":
                            if (keyValue != null)
                                $(t).prop("checked", keyValue == $(t).val());
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
                            model.fillDict($(t), model.get("ModelName"), value2, model, zdx, pro);
                            $(t).val(keyValue);
                        }else if (typeof(value2.dictConfig.zdName) != "undefined" ) {//zdName定义的条件下调用统一请求
                            var zdx = JsCache(value2.dictConfig.zdName, value2.dictConfig.pcode);
                            if (zdx != null) {
                                model.fillDict($(t), model.get("ModelName"), value2, model, zdx, pro);
                                $(t).val(keyValue);
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
                            model.fillDict($(t), model.get("ModelName"), value2, model, zdx, pro);
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
                        }else if (typeof(value2.dictConfig.zdName) != "undefined") {//zdName定义的条件下调用统一请求
                            var zdx = JsCache(value2.dictConfig.zdName, value2.dictConfig.pcode);
                            if (zdx != null) {
                                model.fillDict($(t), model.get("ModelName"), value2, model, zdx, pro);
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
                    }
                }
            }

            //对默认值赋值
            if( $(t).val() == null || $(t).val() == ""){
                if (typeof(value2.defaultValue) != "undefined") {
                    $(t).val(value2.defaultValue);
                    model.set(pro, value2.defaultValue);
                }
            }

            //挂载后置事件
            if(value2.changeFunc != undefined){
                $(t).bind("change",function(){
                    eval(value2.changeFunc+"(model)");
                })
            }

            //挂载失焦去验证事件
            $(t).bind("change",function(){
                $(t).removeClass("TextBoxErr");
                $(t).parent().find(".invalidtip").remove();
            })

        });
    },
    //获取查询参数生成的json字符串
    getSearchJson: function () {
        var model = this.model;
        var jsonstr = "[";
        var initJson = model.initJson;
        $("*[data-model=" + model.get("ModelName") + "][data-property]").each(function (i, t) {
            var type = $(t).prop("tagName");
            var pro = $(t).attr("data-property");
            var value;
            if (type == "DIV") {
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
            } else if (type == "LABEL" || type == "SPAN") {
                value = $(t).text();
            } else {
                if (typeof($(t).val()) != "undefined" && $(t).val() != null) {
                    value = $(t).val().replace(/\n/g, "<br>");
                }
            }
            if(value != null && value != "") {
                jsonstr += '{"zdName":"' + pro + '","tableName":"' + initJson[model.get("ModelName")][pro].tableName +
                    '","rule":"' + initJson[model.get("ModelName")][pro].rule +
                    '","value":"' + encode(value) + '"';
                if (typeof(initJson[model.get("ModelName")][pro].special) != undefined) {
                    jsonstr += ',"special":"' + initJson[model.get("ModelName")][pro].special + '"},'
                } else {
                    jsonstr += '},'
                }
            }
        });
        if(jsonstr.length > 1){
            jsonstr = jsonstr.substr(0, jsonstr.length - 1);
        }
        jsonstr += "]";
        jsonstr = this.editGetJson(jsonstr);
        return jsonstr;
    },
    //可实现接口：编辑getJson返回json值
    editGetJson: function(json){
        return json;
    }
});
