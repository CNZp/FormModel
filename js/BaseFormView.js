/*****************************************************************
 * 基本动态列表与动态表单块面板
 * 最后更新时间：2016-02-26
 * 最后更新人：zhan
 *****************************************************************/

//创建动态表单块面板view
var BaseFormView = Backbone.View.extend({
    tagName: 'div', //标签名，暂固定为div
    className: '',   //个体样式
    index:0,    //序号
    //获取实际新实体model方法
    getNewModel: function(){

    },
    //获取实际个体数据view方法
    getNewElementView: function(item,mode,display,index,parent){

    },
    //获取控制区域html
    getControlHtml: function() {
        var controlstr = "<div style='height:auto;width:auto'><button class='addItem'>新增表单块</button></div>";
        return controlstr;
    },
    //事件
    events: {
        'click button.addFormItem': 'addNewItem',
        'click a.addFormItem': 'addNewItem',
        'click button.addEleLayerItem': 'openAddLayer',
        'click div.addEleLayerItem': 'openAddLayer',
        'click a.addEleLayerItem': 'openAddLayer',
        'click button.deleteFormItems': 'deleteItems',
        'click a.deleteFormItems': 'deleteItems'
    },
    //主渲染方法
    render: function(){
        var view = this;
        $(this.el).empty();
        $(this.el).append(this.getControlHtml());
        if(this.collection != null && this.collection.models != null) {
            $.each(this.collection.models, function (key, model) {
                if (model.get("sfyx_st") != "UNVALID") {
                    view.index++;
                    var viewel = view.getNewElementView(model, 'renderEditMode', true, view.index, view).render().el;
                    $(view.el).append(viewel);
                }
            })
        }
    },
    //渲染model规则接口
    modelRender: function (){
        if(this.collection.models != null) {
            $.each(this.collection.models, function (index, model) {
                model.render();
            })
        }
    },
    //更新表单元素至model
    modelUpdate:function(){
        _.map(this.collection.models, function(model, key) {
            model.updateModel();
        });
    },
    //获取view的collection中的model字段集合，以逗号隔开
    getListPropertys: function(pro){
        var ids = "";
        if(this.collection.models != null) {
            $.each(this.collection.models, function (key, value) {
                if (value.get("sfyx_st") != "UNVALID" && value.get(pro) != "") {
                    ids += value.get(pro) + ",";
                }
            });
        }
        if(ids.length > 0){
            ids = ids.substr(0, ids.length - 1);
        }
        return ids;
    },
    //添加选择内容
    addSelItem: function(model){
        var view = this;
        view.collection.push(model);
        view.index ++;
        $(view.el).append(
            view.getNewElementView(model,'renderEditMode',true,view.index).render().el
        );
        model.render();
    },
    //增加新的个体数据时，数据处理与页面渲染触发方法
    addNewItem: function(){
        var view = this;
        var addItem = this.getNewModel();

        this.collection.push(addItem);
        view.index ++;
        $(this.el).append(
            view.getNewElementView(addItem,'renderEditMode',true,view.index).render().el
        );
        addItem.render();
    },
    //批量删除方法
    deleteItems: function(){
        var view = this;
        var dels = new Array();
        _.map(this.collection.models, function(model, key){
            model.updateSelfModel();
            if(model.checked == true){
                dels.push(model);
            }
        });
        if(dels.length > 0){
            top.layer.confirm("您确定要删除这些信息吗？", function(index){
                $.each(dels, function(index,model){
                    model.set("sfyx_st","UNVALID");
                    model.uncheckModel();
                });
                view.render();
                top.layer.close(index);
            });
        }else{
            top.layer.alert("请勾选要删除的信息")
        }
    }
});

//创建动态列表面板view
var BaseTableView = Backbone.View.extend({
    tagName: 'table', //标签名，列表主体暂固定为table
    className: '',   //主体样式
    tableElement:null,  //列表jq元素
    index:0,    //序号迭代器
    //获取表头部分方法
    getTheadHtml: function(){
        return null;
    },
    //获取实际新实体model方法
    getNewModel: function(){

    },
    //获取实际个体数据view方法
    getNewTrView: function(item,mode,index,parent){

    },
    //获取控制区域html
    getControlHtml: function() {
        var controlstr = "<button class='addTrItem'>新增列表行</button>";
        return controlstr;
    },
    //事件
    events: {
        'click button.addTrItem': 'addNewItem',
        'click a.addTrItem': 'addNewItem',
        'click button.addTrLayerItem': 'openAddLayer',
        'click a.addTrLayerItem': 'openAddLayer',
        'click button.deleteItems': 'deleteItems',
        'click a.deleteItems': 'deleteItems'
    },
    //主渲染方法
    render: function(){
        var view = this;
        this.index = 0;
        $(this.el).empty();
        //渲染控制区域，放入table的caption中
        var x = $(this.el)[0].createCaption();
        x.innerHTML = this.getControlHtml();
        //渲染table的thead部分
        $(this.el).append(view.getTheadHtml());
        //渲染collection
        if(this.collection != null && this.collection.models != null) {
            $.each(this.collection.models, function (key, model) {
                if (model.get("sfyx_st") != "UNVALID") {
                    view.index++;
                    var viewel = view.getNewTrView(model, 'renderEditMode', true, view.index, view).render().el;
                    $(view.el).append(viewel);
                }
            })
        }
        view.modelRender()
    },
    //渲染model规则接口
    modelRender: function (){
        if(this.collection.models != null) {
            $.each(this.collection.models, function (index, model) {
                model.render();
            })
        }
    },
    //获取view的collection中的model字段集合，以逗号隔开
    getListPropertys: function(pro){
        var ids = "";
        if(this.collection.models != null) {
            $.each(this.collection.models, function (key, value) {
                if (value.get("sfyx_st") != "UNVALID" && value.get(pro) != "") {
                    ids += value.get(pro) + ",";
                }
            });
        }
        if(ids.length > 0){
            ids = ids.substr(0, ids.length - 1);
        }
        return ids;
    },
    //添加选择内容
    addSelItem: function(model){
        var view = this;
        view.collection.push(model);
        view.index ++;
        $(view.el).append(
            view.getNewTrView(model,'renderEditMode',true,view.index).render().el
        );
        model.render();
    },
    //添加选择内容
    addSelModel: function(model){
        var view = this;
        view.collection.push(model);
        view.index ++;
    },
    //增加新的个体数据时，数据处理与页面渲染触发方法
    addNewItem: function(){
        var view = this;
        var addItem = this.getNewModel();
        addItem.set("sfyx_st","VALID");
        view.collection.push(addItem);
        view.index ++;
        $(this.el).append(
            view.getNewTrView(addItem,'renderEditMode',true,view.index).render().el
        );
        addItem.render();
    },
    //批量删除方法
    deleteItems: function(){
        var view = this;
        var dels = new Array();
        _.map(this.collection.models, function(model, key){
            model.updateSelfModel();
            if(model.checked == true){
                dels.push(model);
            }
        });
        if(dels.length > 0){
            top.layer.confirm("您确定要删除这些信息吗？", function(index){
                $.each(dels, function(index,model){
                    model.set("sfyx_st","UNVALID");
                    model.uncheckModel();
                });
                view.render();
                top.layer.close(index);
            });
        }else{
            top.layer.alert("请勾选要删除的信息")
        }
    }
});

//创建动态子元素view
var BaseElementView = Backbone.View.extend({
    tagName: '',  //标签名，表单块个体创建为div,行个体创建为tr
    className: '',   //个体样式
    index:0,        //下标
    display:true,   //是否显示
    parentView:null,//父view记录
    //初始化方法，主要用来设置初始状态
    initialize: function (option) {
        if(option.renderCallback != undefined)
            this.renderCallback = option.renderCallback;
        if(option.index != undefined)
            this.index = option.index;
        this.display = option.display;
        if(option.parentView != undefined && option.parentView != null)
            this.parentView = option.parentView;
    },
    //查看模式渲染方法
    renderViewMode: function() {
        //$(this.el).html("<td>" + this.model.get('kjmc') + "</td><td>" + "<button class='edit'>Edit</button><button class='delete'>Delete</button>" + "</td>");
    },
    //编辑模式渲染方法
    renderEditMode: function() {
        //$(this.el).html("<td><input class='kjmc' value='" + this.model.get('kjmc') + "'></td><td><button class='save'>Save</button><button class='cancel'>Cancel</button>" + "</td>");
    },
    renderCallback: 'renderEditMode', //渲染回调标志
    //渲染主方法
    render:function() {
        this[this.renderCallback]();
        return this;
    },
    //渲染model规则接口
    modelRender: function (){
        this.model.render();
    },
    //事件
    events: {
        'click': 'clickTr',
        'click a.editEle':'editElement',
        'click a.delete': 'del'
    },
    //点击事件
    clickTr: function () {
        var view = this;
        if (view.$el.hasClass("selectRow")) {
            view.$el.removeClass("selectRow");
            $("input[type='checkbox']",view.$el).prop("checked", false);
            view.model.uncheckModel();
        }
        else {
            view.$el.addClass("selectRow");
            $("input[type='checkbox']",view.$el).prop("checked", true);
            view.model.checkModel();
        }
    },
    ////编辑事件相应方法
    //edit: function() {
    //    this.renderCallback = 'renderEditMode';
    //    this.render();
    //},
    ////保存事件相应方法
    //save: function() {
    //    if(this.model.saveVariable()) {
    //        for (var i = 0; i < this.model.get("Propertys").length; i++) {
    //            var value = $(this.el).find("*[data-model=" + this.model.get("ModelName") + "][data-property=" + this.model.get("Propertys")[i] + "]").val();
    //            if (value != undefined) {
    //                this.model.set(this.model.get("Propertys")[i], value);
    //            }
    //        }
    //        this.renderCallback = this.setRenderModeAfterSave();
    //        this.render();
    //    }
    //},
    //设置保存后的渲染模式接口
    setRenderModeAfterSave: function() {
        return "renderViewMode";
    },
    //取消编辑事件相应方法
    cancel: function() {
        this.renderCallback = 'renderViewMode';
        this.render();
    },
    //删除事件相应方法
    del: function() {
        var that =this;
        top.layer.confirm("您确定要删除该条信息吗？", function(index){
            that.model.set("sfyx_st", "UNVALID");
            that.remove();
            top.layer.close(index);
        });
    },
    //勾选框选中事件相应方法
    checkModel: function() {
        var view = this;
        var checked = view.$el.find('.checkBox').attr("checked");
        if(checked == undefined || checked == false){
            view.model.uncheckModel();
        }else{
            view.model.checkModel();
        }
    },
    editElement: function(){

    }
});




//创建动态check列表view
var BaseCheckListView = Backbone.View.extend({
    tagName: 'div', //标签名，暂固定为div
    className: '',   //个体样式
    index:0,    //序号
    codePro:"",
    valuePro:"",
    //获取实际新实体model方法
    getNewModel: function(){

    },
    //获取实际个体数据view方法
    getNewElementView: function(item){

    },
    //获取控制区域html
    getControlHtml: function() {
        var controlstr = "";
        return controlstr;
    },
    getViewDict: function() {
        return [{value:"测试1",code:"1"},{value:"测试2",code:"2"}];
    },
    //事件
    events: {
        'click button.addFormItem': 'addNewItem',
        'click a.addFormItem': 'addNewItem',
        'click button.addEleLayerItem': 'openAddLayer',
        'click a.addEleLayerItem': 'openAddLayer',
        'click button.deleteFormItems': 'deleteItems',
        'click a.deleteFormItems': 'deleteItems'
    },
    //主渲染方法
    render: function(){
        var view = this;
        $(this.el).empty();
        $(this.el).append(this.getControlHtml());
        var dict = this.getViewDict();
        if(dict != null){
            var dictEles = $("<div></div>");
            $.each(dict,function(index,value){
                var inTag = false;
                if(view.collection.models != null) {
                    $.each(view.collection.models, function (key, model) {
                        if (model.get(view.codePro) == value.code) {
                            inTag = true;
                            model.set(view.valuePro, value.value);
                            $(dictEles).append(view.getNewElementView(model).render().el);
                        }
                    });
                }
                if(!inTag){
                    var newModel = view.getNewModel();
                    newModel.set(view.codePro, value.code);
                    newModel.set(view.valuePro, value.value);
                    newModel.set("sfyx_st", "UNVALID");
                    view.collection.add(newModel);
                    $(dictEles).append(view.getNewElementView(newModel).render().el);
                }
            });
            $(this.el).append(dictEles);
        }
    }
});

//创建动态check列表view
var BaseCheckTableView = Backbone.View.extend({
    tagName: 'table', //标签名，暂固定为div
    className: '',   //个体样式
    index:0,    //序号
    codePro:"",
    valuePro:"",
    //获取实际新实体model方法
    getNewModel: function(){

    },
    //获取实际个体数据view方法
    getNewElementView: function(item){

    },
    getTheadHtml: function(){
        return null;
    },
    //获取控制区域html
    getControlHtml: function() {
        var controlstr = "";
        return controlstr;
    },
    getViewDict: function() {
        return [{value:"测试1",code:"1"},{value:"测试2",code:"2"}];
    },
    //事件
    events: {
        'click button.addFormItem': 'addNewItem',
        'click a.addFormItem': 'addNewItem',
        'click button.addEleLayerItem': 'openAddLayer',
        'click a.addEleLayerItem': 'openAddLayer',
        'click button.deleteFormItems': 'deleteItems',
        'click a.deleteFormItems': 'deleteItems'
    },
    //主渲染方法
    render: function(){
        var view = this;
        this.index = 0;
        $(this.el).empty();
        //渲染控制区域，放入table的caption中
        var x = $(this.el)[0].createCaption();
        x.innerHTML = this.getControlHtml();
        //渲染table的thead部分
        $(this.el).append(view.getTheadHtml());
        var dict = this.getViewDict();
        if(dict != null){
            $.each(dict,function(index,value){
                var inTag = false;
                if(view.collection.models != null) {
                    $.each(view.collection.models, function (key, model) {
                        if (model.get(view.codePro) == value.code) {
                            inTag = true;
                            model.set(view.valuePro, value.value);
                            $(view.el).append(view.getNewElementView(model).render().el);
                        }
                    });
                }
                if(!inTag){
                    var newModel = view.getNewModel();
                    newModel.set(view.codePro, value.code);
                    newModel.set(view.valuePro, value.value);
                    newModel.set("sfyx_st", "UNVALID");
                    view.collection.add(newModel);
                    $(view.el).append(view.getNewElementView(newModel).render().el);
                }
            });
        }
    }
});


//创建动态check元素view
var BaseCheckView = Backbone.View.extend({
    tagName: 'label',  //标签名，表单块个体创建为div,行个体创建为tr
    className: '',   //个体样式
    index:0,        //下标
    //初始化方法，主要用来设置初始状态
    initialize: function (option) {
        if(option.index != undefined)
            this.index = option.index;
    },
    //渲染方法
    render:function() {
        return this;
    },
    //事件
    events: {
        'change .checkbox': 'changeClick',
        'click a.editEle':'editElement',
        'click a.delete': 'del'
    },
    //点击事件
    changeClick: function () {
        var view = this;
        var checked = view.$el.find('.checkbox').attr("checked");
        if(checked == undefined || checked == false){
            view.model.set("sfyx_st","UNVALID");
        }else{
            view.model.set("sfyx_st","VALID");
        }
    }
});