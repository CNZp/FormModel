/*****************************************************************
 * 附件列表基础面板
 * 最后更新时间：2016-02-26
 * 最后更新人：zhan
 *****************************************************************/

//创建附件model
var AttachmentModel = Backbone.Model.extend({
    defaults: {
        id: "",
        name: "",
        slt:"",
        scr:"张三",
        scsj:"2016-02-18"
    },
    idAttribute:"id",
    del: function(){
        alert("delete");
    }
});

//创建附件model集合collection
var AttachmentCollection = Backbone.Collection.extend({
    model: AttachmentModel
});

//创建附件列表面板view
var AttachmentListView = Backbone.View.extend({
    tagName: 'div', //标签名，列表主体暂固定为table
    className: '',   //主体样式
    state:"",      //状态，“ck”查看、其他
    uuid: "",       //附件列表关联的uuid
    listName:"",        //附件列表头部名称
    element: null,
    dictStr:"[{value:\"附件文件\",code:\"0\"}]",
    fileType:"",
    minNum:null,
    zdName:null,
    pcode:null,
    defaultType:null,
    //初始方法
    initialize: function (options) {
        if(options.uuid != null && options.uuid != ""){
            this.uuid = options.uuid;
        }
        if(options.listName != null){
            this.listName = options.listName;
        }else{
            this.listName = "附件资料";
        }
        if(options.state != null){
            this.state = options.state;
        }
        if(options.dictStr != null && options.dictStr != ""){
            this.dictStr = options.dictStr;
        }
        if(options.zdName != null && options.zdName != ""){
            this.zdName = options.zdName;
        }
        if(options.pcode != null){
            this.pcode = options.pcode;
        }
        if(options.fileType != null && options.fileType != ""){
            this.fileType = options.fileType;
        }
        if(options.minNum != null){
            this.minNum = options.minNum;
        }
        if(options.defaultType != null){
            this.defaultType = options.defaultType;
        }
        this.render();
    },
    //获取实际新实体model方法
    getNewModel: function(){
        return new AttachmentModel();
    },
    //获取实际个体数据view方法
    getNewFileView: function(item,mode,index,state){
        var view = this;
        return new AttachmentView({
            model:item,
            renderCallback:mode,
            index:index,
            state:state,
            parentView:view
        });
    },
    //获取控制区域html
    getControlHtml: function() {
        var view = this;
        var controlstr = "<div class='title' style='border-bottom: 0px solid #d9d9d9;'>" +
            "<h1>"+this.listName+":</h1>";
        if(view.state == "ck"){
            controlstr += "</div>";
        }else{
            controlstr += "<ul class='Actionbutton' style='float: right;margin: 0 5px 0 0;'>"+
                "<li>";
            if(view.minNum != null && typeof(view.minNum) == "number"){
                controlstr += "<b style='float:left;color:#717171;font-weight:normal;'>(最少上传"+view.minNum+"份)&nbsp;&nbsp;&nbsp;&nbsp;</b>" +
                    "<a class='addFileItem' minnum='"+view.minNum+"'>上传资料</a></li>" +
                "</ul>" +
                "</div>";
            }else{
                controlstr += "<a class='addFileItem' minnum='0'>上传资料</a></li>" +
                    "</ul>" +
                    "</div>";
            }
        }
        return controlstr;
    },
    //事件
    events: {
        'click button.addFileItem': 'addNewItem',
        'click a.addFileItem': 'addNewItem'
    },
    //依据uuid请求数据方法
    makeAttListData: function() {
        var view = this;
        view.collection.remove(view.collection.models);
        if(view.uuid != null && view.uuid != ""){
            $.ajax({
                url:"/attachment/getAttachmentList?fj_id=" + this.uuid + "&fjType=list&random=" + Math.random(),
                async: false,
                success: function (ar) {
                    if(ar.success){
                        view.collection.reset(ar.data);
                    }
                }
            });
        }
        //var attList = [{id:1, zd_no:1,name:"附件1"},{id:2,zd_no:1,name:"附件2"},{id:3, zd_no:2,name:"附件3"}];
        //this.collection.add(attList);
    },
    //主渲染方法
    render: function(){
        //alert("render");
        var view = this;
        view.index = 0;
        view.makeAttListData();
        $(view.el).empty();
        $(view.el).append(view.getControlHtml());
        $(view.el).append("<div class=\"clear\"></div>");
        var dicts = eval("("+view.dictStr+")");
        var boxdiv = $("<div></div>");
        boxdiv.addClass("attachmentbox");
        var olist = Array();
        _.map(view.collection.models, function(model, key){
            if(model.get("fjlb_no") === null || model.get("fjlb_no") === ""){
                olist.push(model);
            }
        })
        if(olist.length > 0) {
            var headhtml = "<div class=\"attachmentheader\" minNum='0'>" +
                "<h1>未分类资料(<em>" + olist.length + "</em>)" + "</h1><p style='float:right'>";
            headhtml += "<a href=\"#none\" class=\"attCtrl\" title=\"展开\"><img alt=\"\" src=\"/medias/image/Arrow1.png\"/></a></p>" +
                "</div>";
            var headdiv = $(headhtml);

            var filediv = $("<div class=\"attachmentcontent\" zdno=\"0\" style=\"display:none\">" +
                "<ul class=\"Downloadthumbnail\">" +
                "</ul>" +
                "</div>" +
                "<div class=\"clear\"></div>");
            $(filediv).children(".Downloadthumbnail").append(
                _.map(olist, function (model, key) {
                    view.index++;
                    return view.getNewFileView(model, 'renderEditMode', view.index, view.state).render().el;
                })
            );
            $(boxdiv).append(headdiv);
            $(boxdiv).append(filediv);
        }

        $.each(dicts, function (index, value) {
            var list = Array();
            _.map(view.collection.models, function (model, key) {
                if (model.get("fjlb_no") == value.code) {
                    list.push(model);
                }
            })
            var minNum = 0;
            if (view.minNum != null) {
                if (view.minNum["zd" + value.code] != null && view.minNum["zd" + value.code] > 0) {
                    minNum = view.minNum["zd" + value.code];
                }
            }
            var headhtml = "<div class=\"attachmentheader\" minNum='" + minNum + "'>" +
                "<h1>" + value.value + "(<em>" + list.length + "</em>)" + "</h1><p style='float:right'>";
            if (view.state == "xz" && minNum > 0) {
                headhtml += "<b style='color:#717171;font-weight:normal;'>最少上传" + minNum + "份&nbsp;&nbsp;&nbsp;&nbsp;</b>";
            }
            headhtml += "<a href=\"#none\" class=\"attCtrl\" title=\"展开\"><img alt=\"\" src=\"/medias/image/Arrow1.png\"/></a></p>" +
                "</div>";
            var headdiv = $(headhtml);

            var filediv = $("<div class=\"attachmentcontent\" zdno=\"" + value.code + "\" style=\"display:none\">" +
                "<ul class=\"Downloadthumbnail\">" +
                "</ul>" +
                "</div>" +
                "<div class=\"clear\"></div>");
            $(filediv).children(".Downloadthumbnail").append(
                _.map(list, function (model, key) {
                    view.index++;
                    return view.getNewFileView(model, 'renderEditMode', view.index, view.state).render().el;
                })
            );
            $(boxdiv).append(headdiv);
            $(boxdiv).append(filediv);
        });
        $(view.el).append(boxdiv);
        $(view.el).find(".attachmentheader").click(function() {
            var $t = $(this);
            $(view.el).find(".attachmentheader").each(function(i,t){
                if($t[0] === $(this)[0]){
                    $(this).next().toggle("slow");
                }else{
                    $(this).next().hide("slow");
                }
            });
        });
        $(view.el).find(".attachmentheader").eq(0).next().show();
        $(view.el).find(".Downloadthumbnail").find("li").hover(function() {
            $(this).children(".tcc").show();
            $(this).children(".tcc2").show();
        },function() {
            $(this).children(".tcc").hide();
            $(this).children(".tcc2").hide();
        });
    },
    //增加新的个体数据时，数据处理与页面渲染触发方法
    addNewItem: function(){
        var view = this;
        var url = "";
        if(view.zdName != null){
            url = "/attachment/addFileUpload?fj_id=" + view.uuid + "&zdName="+encode(view.zdName);
            if(view.pcode != null){
                url += "&pcode=" + view.pcode;
            }
        }else{
            url = "/attachment/addFileUpload?fj_id=" + view.uuid;
        }

        if(view.defaultType != null){
            url += "&defaultType=" + view.defaultType;
        }
        if(view.fileType != null && view.fileType != ""){
            url += "&fileType=" + view.fileType;
        }
        url += "&random=" + Math.random();
        top.layer.open({
            type: 2,//代表iframe
            area: ["450px", "300px"],  //代表宽高
            title: "上传资料",
            content: url,   //url地址
            end:function(){
                view.render();
            }
            //cancel:function(){
            //    var cwin = top.getTopWin(0);
            //    if(cwin != null){
            //        if(cwin.cancelCheck){
            //            return cwin.cancelCheck();
            //        }
            //    }
            //    return true;
            //}
        });
        //alert("新增，测试阶段");
        //view.render();
    }
});

//创建附件列表行view
var AttachmentView = Backbone.View.extend({
    tagName: 'li',  //标签名，表单块个体创建为div,行个体创建为tr
    className: '',   //个体样式
    state:"",       //状态，“ck”查看、其他
    parentView:null,
    index:0,    //序号
    //初始化方法，主要用来设置初始状态
    initialize: function (option) {
        if(option.index != undefined)
            this.index = option.index;
        if(option.state != undefined)
            this.state = option.state;
        if(option.parentView != undefined)
            this.parentView = option.parentView;
    },
    //渲染主方法
    render:function() {
        var view = this;
        var model = view.model;
        var src = "";
        var hasExt = true;
        var ns = model.get("name").split(".");
        if(model.get("extension") == null || "" == model.get("extension")){
            hasExt = false;
            if(ns.length > 0){
                model.set("extension", ns[ns.length - 1]);
            }
        }else if(ns.length > 0){
            var ext = ns[ns.length - 1];
            if(ext == model.get("extension")){
                hasExt = false;
            }
        }

        var ftype = model.get("extension") != null ?  model.get("extension").toString().toLowerCase() : "";
        if(ftype == "docx" || ftype == "doc"){
            src = "/medias/image/word.png";
        }else if(ftype == "xls" || ftype == "xlsx"){
            src = "/medias/image/excel.png";
        }else if(ftype == "ppt" || ftype == "pptx"){
            src = "/medias/image/ppt.png";
        }else if(ftype == "ppt" || ftype == "pptx"){
            src = "/medias/image/ppt.png";
        }else if(ftype == "rar" || ftype == "zip" || ftype == "7z"){
            src = "/medias/image/zip.png";
        }else if(ftype == "jpg" || ftype == "jpeg" || ftype == "gif" || ftype == "png"){
            src = model.get("thAbsolutePath");
        }else{
            src = "/medias/image/pt.png";
        }
        var html =
            "<a href=\"#none\">" +
            "<img alt=\"\" onerror=\"onerror=null;src='/medias/image/pt.png'\" src=\""+src+"\"/>"+model.get("name")+(hasExt?("."+model.get("extension")):"")+
            "</a>";
        if(view.state == "xz") {
            html += "<div class=\"tcc\">";
        }else{
            html += "<div class=\"tcc2\">";
        }
        html += "<ul class=\"tcccz\">"+
            "<li><a href=\"#none\" class=\"downloadFile\"><img alt=\"\" src=\"/medias/image/xz.png\"/>下载</a></li>"+
            "<li><a href=\"#none\" class=\"openFile\"><img alt=\"\" src=\"/medias/image/dk.png\"/>打开</a></li>";
        if(view.state == "xz"){
            html += "<li><a href=\"#none\" class=\"deleteFile\"><img alt=\"\" src=\"/medias/image/sc.png\"/>删除</a></li>";
        }
        html += "</ul>"+
            "</div>";
        $(this.el).append(html);
        return this;

    },
    //事件
    events: {
        'click a.deleteFile': 'deleteFile',
        'click a.openFile': 'openFile',
        'click a.downloadFile': 'downloadFile'
    },
    //删除事件响应方法
    deleteFile: function() {
        var view = this;
        if(confirm("您确定要删除该条信息吗")){
            $.post("/attachment/deleteAttachment", {ids: view.model.get("id")}, function (data) {
                top.layer.alert(data, function (index) {
                    view.parentView.render();
                    top.layer.close(index);
                });
            });
        }
    },
    openFile:function() {
        openLayer("查看附件信息","medium","/attachment/showFile?id="+this.model.get("id"));
    },
    //下载事件响应方法
    downloadFile: function() {
        window.open("/attachment/downloadAttachment?id=" + this.model.get("id"));
    }
});

//创建附件列表面板view
var AttachmentDivView = Backbone.View.extend({
    tagName: 'div', //标签名，列表主体暂固定为table
    className: 'enclosure',   //主体样式
    state:"",      //状态，“ck”查看、其他
    uuid: "",       //附件列表关联的uuid
    listName:"",        //附件列表头部名称
    element: null,
    dictStr:"[{value:\"附件文件\",code:\"0\"}]",
    zdName:null,
    uploadName:"上传附件",        //附件按钮文字
    fileType:"",
    minNum:null,
    defaultType:null,
    showTag:false,
    //初始方法
    initialize: function (options) {
        if(options.uuid != null && options.uuid != ""){
            this.uuid = options.uuid;
        }
        if(options.state != null){
            this.state = options.state;
        }
        if(options.fileType != null && options.fileType != ""){
            this.fileType = options.fileType;
        }
        if(options.uploadName != null && options.uploadName != ""){
            this.uploadName = options.uploadName;
        }
        if(options.minNum != null){
            this.minNum = options.minNum;
        }
        if(options.defaultType != null){
            this.defaultType = options.defaultType;
        }
        if(options.showTag != null){
            this.showTag = options.showTag;
        }
        this.render();
    },
    //获取实际新实体model方法
    getNewModel: function(){
        return new AttachmentModel();
    },
    //获取实际个体数据view方法
    getNewFileView: function(item,mode,index,state){
        var view = this;
        return new AttachmentDdView({
            model:item,
            renderCallback:mode,
            index:index,
            state:state,
            parentView:view
        });
    },
    //获取控制区域html
    getControlHtml: function() {
        var view = this;
        var controlstr = "<div class='title'>" +
            "<h1>"+this.listName+":</h1>";
        if(view.state == "ck"){
            controlstr += "</div>";
        }else{
            controlstr +=  "<ul class='Actionbutton' style='float: right;margin: 0 5px 0 0;'>"+
                "<li><a class='addFileItem'>上传资料</a></li>" +
                "</ul>" +
                "</div>";
        }
        return controlstr;
    },
    //事件
    events: {
        'click button.addFileItem': 'addNewItem',
        'click a.addFileItem': 'addNewItem'
    },
    //依据uuid请求数据方法
    makeAttListData: function() {
        var view = this;
        view.collection.remove(view.collection.models);
        if(view.uuid != null && view.uuid != ""){
            var url = "/attachment/getAttachmentList?fj_id=" + this.uuid + "&random=" + Math.random();
            if(view.defaultType != null){
                url += "&defaultType=" + view.defaultType;
            }
            $.ajax({
                url:url,
                async: false,
                success: function (ar) {
                    if(ar.success){
                        view.collection.reset(ar.data);
                    }
                }
            });
        }
        //var attList = [{id:1, zd_no:1,name:"附件1"},{id:2,zd_no:1,name:"附件2"},{id:3, zd_no:2,name:"附件3"}];
        //this.collection.add(attList);
    },
    //主渲染方法
    render: function(){
        var view = this;
        view.index = 0;
        view.makeAttListData();
        $(view.el).empty();
        $(view.el).removeClass().addClass(view.className);
        var minNum = 0;
        if(view.minNum != null){
            if(view.minNum != null && view.minNum > 0){
                minNum = view.minNum;
            }
        }
        var dl = $("<dl minNum='"+minNum+"'></dl>");
        if(view.state == "xz") {
            var dthtml = "<dt><img src='/medias/image/attachment/enclosure.png'><a class='addFileItem' href='javascript:;' title='"+view.uploadName+"'>"+view.uploadName+"</a>";
            if(minNum > 0){
                dthtml += "&nbsp;&nbsp;<b style='color:#717171;font-weight:normal;'>(最少上传"+minNum+"份)</b>";
            }
            dthtml += "</dt>"
            $(dl).append(dthtml);
        }else if (view.showTag){
            var dthtml = "<dt><img src='/medias/image/attachment/enclosure.png'><span>"+view.uploadName+"</span></dt>";
            $(dl).append(dthtml);
        }
        $.each(view.collection.models,function(index ,value){
            view.index++;
            var dd = view.getNewFileView(value,'renderEditMode',view.index,view.state).render().el;
            $(dl).append(dd);
        });
        $(view.el).append(dl);
    },
    //增加新的个体数据时，数据处理与页面渲染触发方法
    addNewItem: function(){
        var view = this;
        var url = "/attachment/addFileUpload?fj_id=" + view.uuid;
        if(view.defaultType != null){
            url += "&defaultType=" + view.defaultType;
        }
        if(view.fileType != null && view.fileType != ""){
            url += "&fileType=" + view.fileType;
        }
        url += "&random=" + Math.random();
        top.layer.open({
            type: 2,//代表iframe
            area: ["450px", "300px"],  //代表宽高
            title: "上传资料",
            content: url,   //url地址
            end:function(){
                view.render();
            }
        });
    }
});

//创建附件列表行view
var AttachmentDdView = Backbone.View.extend({
    tagName: 'dd',  //标签名，表单块个体创建为div,行个体创建为tr
    className: '',   //个体样式
    state:"",       //状态，“ck”查看、其他
    parentView:null,
    index:0,    //序号
    //初始化方法，主要用来设置初始状态
    initialize: function (option) {
        if(option.index != undefined)
            this.index = option.index;
        if(option.state != undefined)
            this.state = option.state;
        if(option.parentView != undefined)
            this.parentView = option.parentView;
    },
    //渲染主方法
    render:function() {
        var view = this;
        var model = view.model;
        var hasExt = true;
        if(model.get("extension") == null || "" == model.get("extension")){
            hasExt = false;
        }
        var html =
            "<p>"+model.get("name")+(hasExt?("."+model.get("extension")):"")+"</p>"+
            "<a class=\"downloadFile\" href=\"#none\">下载</a> " +
            "<a class=\"openFile\" href=\"#none\">打开</a> ";

        if(view.state == "xz") {
            html += "<a class=\"deleteFile\" href=\"#none\">删除</a>";
        }
        $(this.el).append(html);
        return this;
    },
    //事件
    events: {
        'click a.deleteFile': 'deleteFile',
        'click a.openFile': 'openFile',
        'click a.downloadFile': 'downloadFile'
    },
    //删除事件响应方法
    deleteFile: function() {
        var view = this;
        if(confirm("您确定要删除该条信息吗")){
            $.post("/attachment/deleteAttachment", {ids: view.model.get("id")}, function (data) {
                top.layer.alert(data, function (index) {
                    view.parentView.render();
                    top.layer.close(index);
                });
            });
        }
    },
    openFile:function() {
        openLayer("查看附件信息","medium","/attachment/showFile?id="+this.model.get("id"));
    },
    //下载事件响应方法
    downloadFile: function() {
        window.open("/attachment/downloadAttachment?id=" + this.model.get("id"));
    }
});

//创建附件列表面板view
var AttachmentTableView = Backbone.View.extend({
    tagName: 'div', //标签名，列表主体暂固定为table
    className: 'form',   //主体样式
    state:"",      //状态，“ck”查看、其他
    uuid: "",       //附件列表关联的uuid
    listName:"",        //附件列表头部名称
    element: null,
    dictStr:"[{value:\"附件文件\",code:\"0\"}]",
    zdName:null,
    fileType:"",
    minNum:null,
    defaultType:null,
    //初始方法
    initialize: function (options) {
        if(options.uuid != null && options.uuid != ""){
            this.uuid = options.uuid;
        }
        if(options.state != null){
            this.state = options.state;
        }
        if(options.listName != null){
            this.listName = options.listName;
        }else{
            this.listName = "附件资料";
        }
        if(options.fileType != null && options.fileType != ""){
            this.fileType = options.fileType;
        }
        if(options.minNum != null){
            this.minNum = options.minNum;
        }
        if(options.defaultType != null){
            this.defaultType = options.defaultType;
        }
        this.render();
    },
    //获取实际新实体model方法
    getNewModel: function(){
        return new AttachmentModel();
    },
    //获取实际个体数据view方法
    getNewFileView: function(item,mode,index,state){
        var view = this;
        return new AttachmentTrView({
            model:item,
            renderCallback:mode,
            index:index,
            state:state,
            parentView:view
        });
    },
    //获取控制区域html
    getControlHtml: function() {
        var view = this;
        var minNum = 0;
        if(view.minNum != null){
            if(view.minNum!= null && view.minNum > 0){
                minNum = view.minNum;
            }
        }
        $(view.el).attr("minNum",minNum);
        var controlstr = "<div class='title'>" +
            "<h1>"+this.listName+":";
        if(view.state == "ck"){
            controlstr += "</h1></div>";
        }else{
            if(minNum > 0){
                controlstr += "&nbsp;&nbsp;<b style='color:#717171;font-weight:normal;'>(最少上传"+minNum+"份)</b>";
            }
            controlstr += "</h1><ul class='Actionbutton' style='float: right;margin: 0 5px 0 0;'>"+
                "<li><a class='addFileItem'>上传资料</a></li>" +
                "</ul>" +
                "</div>";
        }
        return controlstr;
    },
    //事件
    events: {
        'click button.addFileItem': 'addNewItem',
        'click a.addFileItem': 'addNewItem'
    },
    //依据uuid请求数据方法
    makeAttListData: function() {
        var view = this;
        view.collection.remove(view.collection.models);
        if(view.uuid != null && view.uuid != ""){
            $.ajax({
                url:"/attachment/getAttachmentList?fj_id=" + this.uuid + "&random=" + Math.random(),
                async: false,
                success: function (ar) {
                    if(ar.success){
                        view.collection.reset(ar.data);
                    }
                }
            });
        }
        //var attList = [{id:1, zd_no:1,name:"附件1"},{id:2,zd_no:1,name:"附件2"},{id:3, zd_no:2,name:"附件3"}];
        //this.collection.add(attList);
    },
    //主渲染方法
    render: function(){
        var view = this;
        view.index = 0;
        view.makeAttListData();
        $(view.el).empty();
        $(view.el).removeClass().addClass(view.className);
        var x = $(view.el)[0].createCaption();
        x.innerHTML = this.getControlHtml();
        //渲染table的thead部分
        $(view.el).append("<thead><th width='70%'>附件</th><th>操作</th></thead>");
        if(view.collection.models.length > 0){
            $.each(view.collection.models,function(index ,value){
                view.index++;
                var tr = view.getNewFileView(value,'renderEditMode',view.index,view.state).render().el;
                $(view.el).append(tr);
            });
        }else{
            var tr = $("<tr class='rx-grid-tr errortr'><td colspan='2' align='center' style='text-align:center;'><span style='font-size:12px;color:red;font-weight:bold;line-height: 34px;'>无数据</span></td></tr>");
            $(view.el).append(tr);
        }
    },
    //增加新的个体数据时，数据处理与页面渲染触发方法
    addNewItem: function(){
        var view = this;
        var url = "/attachment/addFileUpload?fj_id=" + view.uuid;
        if(view.defaultType != null){
            url += "&defaultType=" + view.defaultType;
        }
        if(view.fileType != null && view.fileType != ""){
            url += "&fileType=" + view.fileType;
        }
        url += "&random=" + Math.random();
        top.layer.open({
            type: 2,//代表iframe
            area: ["450px", "300px"],  //代表宽高
            title: "上传资料",
            content: url,   //url地址
            end:function(){
                view.render();
            }
        });
    }
});

//创建附件列表行view
var AttachmentTrView = Backbone.View.extend({
    tagName: 'tr',  //标签名，表单块个体创建为div,行个体创建为tr
    className: '',   //个体样式
    state:"",       //状态，“ck”查看、其他
    parentView:null,
    index:0,    //序号
    //初始化方法，主要用来设置初始状态
    initialize: function (option) {
        if(option.index != undefined)
            this.index = option.index;
        if(option.state != undefined)
            this.state = option.state;
        if(option.parentView != undefined)
            this.parentView = option.parentView;
    },
    //渲染主方法
    render:function() {
        var view = this;
        var model = view.model;
        var hasExt = true;
        var ns = model.get("name").split(".");
        if(model.get("extension") == null || "" == model.get("extension")){
            hasExt = false;
        }else if(ns.length > 0){
            var ext = ns[ns.length - 1];
            if(ext == model.get("extension")){
                hasExt = false;
            }
        }
        var html =
            "<td>"+model.get("name")+(hasExt?("."+model.get("extension")):"")+"</td>"+
            "<td><a class=\"downloadFile\" href=\"#none\">下载</a> " +
            "<a class=\"openFile\" href=\"#none\">打开</a> ";

        if(view.state == "xz") {
            html += "<a class=\"deleteFile\" href=\"#none\">删除</a>";
        }
        html += "</td>";
        $(this.el).append(html);
        return this;
    },
    //事件
    events: {
        'click a.deleteFile': 'deleteFile',
        'click a.openFile': 'openFile',
        'click a.downloadFile': 'downloadFile'
    },
    //删除事件响应方法
    deleteFile: function() {
        var view = this;
        if(confirm("您确定要删除该条信息吗")){
            $.post("/attachment/deleteAttachment", {ids: view.model.get("id")}, function (data) {
                top.layer.alert(data, function (index) {
                    view.parentView.render();
                    top.layer.close(index);
                });
            });
        }
    },
    openFile:function() {
        openLayer("查看附件信息","medium","/attachment/showFile?id="+this.model.get("id"));
    },
    //下载事件响应方法
    downloadFile: function() {
        window.open("/attachment/downloadAttachment?id=" + this.model.get("id"));
    }
});

//创建附件列表面板view
var AttachmentSingleView = Backbone.View.extend({
    tagName: 'div', //标签名，列表主体暂固定为table
    className: 'enclosure',   //主体样式
    state:"",      //状态，“ck”查看、其他
    uuid: "",       //附件列表关联的uuid
    uploadName:"上传附件",        //附件按钮文字
    element: null,
    dictStr:"[{value:\"附件文件\",code:\"0\"}]",
    zdName:null,
    fileType:"",
    defaultType:null,
    //初始方法
    initialize: function (options) {
        if(options.uuid != null && options.uuid != ""){
            this.uuid = options.uuid;
        }
        if(options.state != null){
            this.state = options.state;
        }
        if(options.fileType != null && options.fileType != ""){
            this.fileType = options.fileType;
        }
        if(options.uploadName != null){
            this.uploadName = options.uploadName;
        }
        if(options.defaultType != null){
            this.defaultType = options.defaultType;
        }
        this.render();
    },
    //获取实际新实体model方法
    getNewModel: function(){
        return new AttachmentModel();
    },
    //获取实际个体数据view方法
    getNewFileView: function(item,mode,index,state){
        var view = this;
        return new AttachmentSingleDdView({
            model:item,
            renderCallback:mode,
            index:index,
            state:state,
            parentView:view
        });
    },
    //事件
    events: {
        'click button.addFileItem': 'addNewItem',
        'click a.addFileItem': 'addNewItem'
    },
    //依据uuid请求数据方法
    makeAttListData: function() {
        var view = this;
        view.collection.remove(view.collection.models);
        if(view.uuid != null && view.uuid != ""){
            $.ajax({
                url:"/attachment/getAttachmentList?fj_id=" + this.uuid + "&random=" + Math.random(),
                async: false,
                success: function (ar) {
                    if(ar.success){
                        view.collection.reset(ar.data);
                    }
                }
            });
        }
        //var attList = [{id:1, zd_no:1,name:"附件1"},{id:2,zd_no:1,name:"附件2"},{id:3, zd_no:2,name:"附件3"}];
        //this.collection.add(attList);
    },
    //主渲染方法
    render: function(){
        var view = this;
        view.index = 0;
        view.makeAttListData();
        $(view.el).empty();
        $(view.el).removeClass().addClass(view.className);
        var dl = $("<dl></dl>");
        $(dl).css("float","left");
        if(view.state == "xz") {
            $(dl).append("<dt style='float:left;'><img src='/medias/image/attachment/enclosure.png'><a class='addFileItem' href='javascript:;' title='"+view.uploadName+"'>"+view.uploadName+"</a></dt>");
        }
        $.each(view.collection.models,function(index ,value){
            view.index++;
            var dd = view.getNewFileView(value,'renderEditMode',view.index,view.state).render().el;
            $(dl).append(dd);
        });
        $(view.el).append(dl);
    },
    //增加新的个体数据时，数据处理与页面渲染触发方法
    addNewItem: function(){
        var view = this;
        if(view.collection.models != null && view.collection.models.length > 0){
            top.layer.confirm("仅能上传一条附件，点击确定删除已有附件",function(index){

                $.ajax({
                    type: "post",
                    url:"/attachment/deleteAttachment",
                    data:{ids: view.collection.models[0].get("id")},
                    async: false,
                    success: function (ar) {
                        top.layer.alert("删除成功",function(index2){
                            view.render();
                            top.layer.close(index);
                            top.layer.close(index2);
                        })

                    }
                });
                var url = "/attachment/addFileUpload?fj_id=" + view.uuid + "&limit=1";
                if(view.defaultType != null){
                    url += "&defaultType=" + view.defaultType;
                }
                if(view.fileType != null && view.fileType != ""){
                    url += "&fileType=" + view.fileType;
                }
                url += "&random=" + Math.random();
                top.layer.open({
                    type: 2,//代表iframe
                    area: ["450px", "300px"],  //代表宽高
                    title: "上传资料",
                    content: url,   //url地址
                    end:function(){
                        view.render();
                    }
                });
            });
        }else{
            var url = "/attachment/addFileUpload?fj_id=" + view.uuid + "&limit=1";
            if(view.defaultType != null){
                url += "&defaultType=" + view.defaultType;
            }
            if(view.fileType != null && view.fileType != ""){
                url += "&fileType=" + view.fileType;
            }
            url += "&random=" + Math.random();
            top.layer.open({
                type: 2,//代表iframe
                area: ["450px", "300px"],  //代表宽高
                title: "上传资料",
                content: url,   //url地址
                end:function(){
                    view.render();
                }
            });
        }

    }
});

//创建附件列表行view
var AttachmentSingleDdView = Backbone.View.extend({
    tagName: 'dd',  //标签名，表单块个体创建为div,行个体创建为tr
    className: 'rowdd',   //个体样式
    state:"",       //状态，“ck”查看、其他
    parentView:null,
    index:0,    //序号
    //初始化方法，主要用来设置初始状态
    initialize: function (option) {
        if(option.index != undefined)
            this.index = option.index;
        if(option.state != undefined)
            this.state = option.state;
        if(option.parentView != undefined)
            this.parentView = option.parentView;
    },
    //渲染主方法
    render:function() {
        var view = this;
        var model = view.model;
        $(view.el).addClass(view.className);
        var hasExt = true;
        var ns = model.get("name").split(".");
        if(model.get("extension") == null || "" == model.get("extension")){
            hasExt = false;
        }else if(ns.length > 0){
            var ext = ns[ns.length - 1];
            if(ext == model.get("extension")){
                hasExt = false;
            }
        }
        var html =
            model.get("name")+(hasExt?("."+model.get("extension")):"")+
            "  <a class=\"downloadFile\" href=\"#none\">下载</a> " +
            "<a class=\"openFile\" href=\"#none\">打开</a> ";

        if(view.state == "xz") {
            html += "<a class=\"deleteFile\" href=\"#none\">删除</a>";
        }
        $(this.el).append(html);
        return this;
    },
    //事件
    events: {
        'click a.deleteFile': 'deleteFile',
        'click a.openFile': 'openFile',
        'click a.downloadFile': 'downloadFile'
    },
    //删除事件响应方法
    deleteFile: function() {
        var view = this;
        if(confirm("您确定要删除该条信息吗")){
            $.post("/attachment/deleteAttachment", {ids: view.model.get("id")}, function (data) {
                top.layer.alert(data, function (index) {
                    view.parentView.render();
                    top.layer.close(index);
                });
            });
        }
    },
    openFile:function() {
        openLayer("查看附件信息","medium","/attachment/showFile?id="+this.model.get("id"));
    },
    //下载事件响应方法
    downloadFile: function() {
        window.open("/attachment/downloadAttachment?id=" + this.model.get("id"));
    }
});

var ImageUploadView = Backbone.View.extend({
    tagName: 'div', //标签名，列表主体暂固定为table
    className: 'enclosure',   //主体样式
    state:"",      //状态，“ck”查看、其他
    zpid: "",       //附件列表关联的uuid
    listName:"",        //附件列表头部名称
    element: null,
    dictStr:"[{value:\"附件文件\",code:\"0\"}]",
    ModelName:"",
    property:"",
    frameWin:null,
    //初始方法
    initialize: function (options) {
        if(options.zpid != null && options.zpid != ""){
            this.zpid = options.zpid;
        }
        if(options.uuid != null && options.uuid != ""){
            this.uuid = options.uuid;
        }
        if(options.state != null && options.state != ""){
            this.state = options.state;
        }
        if(options.ModelName != null && options.ModelName != ""){
            this.ModelName = options.ModelName;
        }
        if(options.property != null && options.property != ""){
            this.property = options.property;
        }
        this.render();
    },
    //事件
    events: {
        'click button.addZpItem': 'addNewItem',
        'click a.addZpItem': 'addNewItem'
    },
    //依据uuid请求数据方法
    //主渲染方法
    render: function(){
        var view = this;
        view.index = 0;
        $(view.el).empty();
        $(view.el).removeClass().addClass(view.className);
        if(view.zpid != ""){
            $(view.el).append("<a herf='javascript:;' class='addZpItem'><img style='width:100%' onerror='onerror=null;src=\"/medias/image/001.jpg\"'  src='/rygl/getRyzp?id=" + view.zpid + "&random=" + Math.random()+"'/></a>");
        }else{
            $(view.el).append("<a herf='javascript:;' class='addZpItem'><img class='zpimage' style='width:100%' src='/medias/image/001.jpg'/></a>");
        }
    },
    //增加新的个体数据时，数据处理与页面渲染触发方法
    addNewItem: function() {
        var view = this;
        if(view.state == "xz") {
            var url = "/attachment/addImageUpload?limit=1&random=" + Math.random();
            top.layer.open({
                type: 2,//代表iframe
                area: ["450px", "300px"],  //代表宽高
                title: "上传图片",
                content: url,   //url地址
                success: function (layero, index) {
                    //top.setZpid(view.zpid);
                },
                end: function () {
                    var zpid = top.getZpid();
                    if (zpid != null && zpid != "") {
                        view.zpid = zpid;
                        $.getEle(view.ModelName, view.property).val(zpid);
                    }
                    top.setZpid("");
                    view.render();
                }
            });
        }
    }
});

var CysbUploadView = Backbone.View.extend({
    tagName: 'div', //标签名，列表主体暂固定为table
    className: 'enclosure',   //主体样式
    state:"",      //状态，“ck”查看、其他
    zpid: "",       //附件列表关联的uuid
    listName:"",        //附件列表头部名称
    element: null,
    dictStr:"[{value:\"附件文件\",code:\"0\"}]",
    ModelName:"",
    property:"",
    frameWin:null,
    //初始方法
    initialize: function (options) {
        if(options.zpid != null && options.zpid != ""){
            this.zpid = options.zpid;
        }
        if(options.uuid != null && options.uuid != ""){
            this.uuid = options.uuid;
        }
        if(options.state != null && options.state != ""){
            this.state = options.state;
        }
        if(options.ModelName != null && options.ModelName != ""){
            this.ModelName = options.ModelName;
        }
        if(options.property != null && options.property != ""){
            this.property = options.property;
        }
        this.render();
    },
    //事件
    events: {
        'click button.addZpItem': 'addNewItem',
        'click a.addZpItem': 'addNewItem'
    },
    //依据uuid请求数据方法
    //主渲染方法
    render: function(){
        var view = this;
        view.index = 0;
        $(view.el).empty();
        $(view.el).removeClass().addClass(view.className);
        if(view.zpid != ""){
            $(view.el).append("<a herf='javascript:;' class='addZpItem'><img style='width:100%;height:auto;' src='/rygl/getGczp?id=" + view.zpid + "&random=" + Math.random()+"'/></a>");
        }else{
            $(view.el).append("<a herf='javascript:;' class='addZpItem'><img class='zpimage' style='width:100%;height:auto;' src='/medias/image/001.jpg'/></a>");
        }
    },
    //增加新的个体数据时，数据处理与页面渲染触发方法
    addNewItem: function() {
        var view = this;
        if(view.state == "xz") {
            var url = "/attachment/addImageUpload?imagetype=cysb&limit=1&random=" + Math.random();
            top.layer.open({
                type: 2,//代表iframe
                area: ["450px", "300px"],  //代表宽高
                title: "上传图片",
                content: url,   //url地址
                success: function (layero, index) {
                    //top.setZpid(view.zpid);
                },
                end: function () {
                    var zpid = top.getZpid();
                    if (zpid != null && zpid != "") {
                        view.zpid = zpid;
                        $.getEle(view.ModelName, view.property).val(zpid);
                    }
                    top.setZpid("");
                    view.render();
                }
            });
        }
    }
});