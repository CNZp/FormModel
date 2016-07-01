/**
 * Created by Administrator on 2016/1/13.
 */
//基础表单模型
var BaseGridModel2 = Backbone.Model.extend({
    initialize:function () {
    },
    defaults:{
        ModelName:"" ,//模型名称
        gridTitle:"",//表格标题
        columns:"", //表头
        data:null,//表格数据，优先级比dataUrl加载的数据高
        dataUrl:"", //Ajax请求数据的URL(返回数据的格式：{total：50，pageCurrent:1,list[{name:'abc',sex:1}]}.);
        postData:null,//(Key-value pairs, 默认null)，用dataUrl请求数据时，需要发送到服务端的其他参数。
        loadType:"POST",//Ajax请求的方式
        dataType:"json",//数据类型[json,array,xml]
        hiddenFields:null,//array,仅用于 dataType='array'
        local:"remote",//可选：['remote'|'local']，
        fieldSortable:true,//点击页头字段排序
        filterThead:false,//允许表格头部快速筛选
        sortAll:false,//排序范围：true=所有数据排序，false=当前页数据排序
        filterAll:true,//筛选范围，true = 从所有数据中筛选，false = 从当前页数据中筛选。
        filterMult:true,//支持多字段筛选
        linenumberAll:false,//行号范围，true = 为所有数据编号，false = 为当前页数据编号。
        showLinenumber:true,//是否显示行号，参数[true | false | 'lock']，lock参数 = 锁定行号列（适用于多列字段，出现横向滚动条的情况）
        showCheckboxcol:false,//是否显示复选框
        showEditbtnscol:false,//是否显示编辑按钮 如果是字符串 则编辑列的表头以该字符串为内容
        showTfoot:true,//是否显示页脚，
        showToolbar:false,// 是否显示工具条，需要设置参数toolbarItem或toolbatCustom
        toolbarItem:null,//显示工具条按钮，可选参数['all, add, edit, cancel, save, del, import, export, |']，“all” = 显示所有按钮，“|” = 按钮组分隔符。
        toolbarCustom:null,//自定义的html内容或jQuery DOM对象，支持带返回值函数
        columnResize:true,//允许调整列宽
        columnMenu:true,//表头字段列上显示菜单按钮
        columnShowhide:true,//表头字段列菜单上出现"显示/隐藏 列"选项
        columnFilter:true,//表头字段列菜单上出现"过滤"选项
        columnLock:true,//表头字段列菜单上出现“锁定列、解除锁定” 选项
        paging:false,//是否显示分页组件，可设置分页参数。分页参数模板：（{pageSize:30, selectPageSize:'30,60,90', pageCurrent:1, showPagenum:5, total:0} 如果local='remote'，并通过dataUrl参数请求json数据时，返回的数据要提供total、pageCurrent参数，可提供pageSize参数）。
        pagingAlign:'right',//分页组件对齐方式，参数['left' | 'center' | 'right']
        editType:"raw",//(string, 默认'POST')，ajax提交添加或修改数据时的请求方式，可选值('POST', 'GET', 'raw')，当值为POST或GET时，提交数据key='json'，value=json，建议不要使用GET方式； 当值为raw时，post原始json数据(application/json)。
        editUrl:null,//保存编辑、添加数据的url，Ajax请求方式为POST，服务器端接收的参数名称为"json"，数据类型是JSON Array。
        editCallback:null,//function(json)  保存成功后的回调，返回的json内容可以是B-JUI默认的回调json或保存后的json数据，datagrid默认回调：如果返回保存后的json数据，将会更新对应的数据行。
        editMode:"dialog",//编辑、添加数据的方式，参数[false | 'inline' | 'dialog']。false = 不能编辑，inline = 行内编辑，dialog = 弹窗编辑。
        editDialogOp:null,//object 弹窗编辑方式时，设置弹出窗口的参数，即dialog的参数，如{width:500, height:300, mask:false}
        inlineEditMult:true,//允许行内编辑模式下同时添加/编辑多行。
        saveAll:true,// 适用于多行行内编辑时，一次性保存全部数据，发送到服务器端数据格式见参数editUrl。
        addLocation:"first",//添加新行数据于当前页的位置，参数['first' | 'last' | 'prev' | 'next']，参数prev和next参考当前选中行位置。
        delUrl:null,//删除数据的url，服务器端接收的数据见参数delPK
        delType:"GET",//
        delPK:null,//设置删除主键名，如果设置了主键，则只发送该字段的值(删除多条则主键值以逗号分隔)到服务器端，否则发送JSON数据（参数名"json"，数据类型为JSON Array）
        delConfirm:true,//删除前的确认提示，参数[true | false | '自定义提示信息']，参数为false时不弹出提示信息。
        delCallback:null,// function(json) 删除成功后的回调函数，返回的json内容为B-JUI默认的回调json。
        jsonPrefix:null,//发送到服务器端的json数据(name)加前缀，包括(保存、删除、筛选)操作。
        contextMenuH:true,//在表头上右键点击时出现 ”显示/隐藏列“ 的快捷菜单。
        contextMenuB:false,//在数据行右键点击时出现快捷菜单，菜单选项有(刷新、添加、编辑、取消、删除)。
        hScrollbar:false,//允许出现横向滚动条。
        fullGrid:false,//使表格铺满网格容器(如果值为true，则需要设置有列宽，并且总宽度小于datagrid容器宽度时有效)。
        width:null,//datagrid容器宽度，默认为父容器的宽，相当于'100%'。
        height:300,//datagrid容器高度。
        importOption:null,//object 工具栏的导入按钮参数，dialog或navtab方式打开导入页面，参数模板{type:"dialog", options:{url:'', width:400, height:200}}
        exportOption:null,//object 工具栏的导出按钮参数，执行ajax url或以dialog or navtab方式打开导出页面，参数模板{type:"ajax", options:{url:""}}
        beforeEdit:null,//function 带返回值方法，编辑数据前调用，返回true继续编辑，返回false取消编辑。
        beforeDelete:null,//function 带返回值方法，删除数据前调用，返回true继续删除，返回false取消删除。
        afterSave:null,//function($tr,datas) 保存成功后执行方法，参数$trs为保存行(jQuery 对象)，datas为保存行对应数据(JSON Array)。
        afterDelete:null//function 删除成功后执行方法。
    },
    //表单渲染
    render:function () {

        var model = this;
        $("*[data-model=" + model.get("ModelName") + "]").each(function (i, t) {
            var c = $(t);

            var re=eval('/('+ 'random'+'=)([^&]*)/gi');
            //替换random，防止缓存。
            var o = {};
            //model.unset("ModelName");
            var attrs = model.attributes;
            for (var i in attrs) {
                if (model.attributes[i] != undefined) {
                    o[i] = model.attributes[i];
                }
            }
            o.dataUrl = model.get("dataUrl").replace(/\#/g,"%23")
                .replace(re,'random'+'='+Math.random());
            c.datagrid(o);
            //events


    });
    },
    reloadGrid: function () {
        var model = this;
        $("*[data-model=" + model.get("ModelName") + "]").each(function (i, t) {
            var c = $(t);
            var re=eval('/('+ 'random'+'=)([^&]*)/gi');
            //替换random，防止缓存。
            c.datagrid('options').dataUrl = model.get("dataUrl").replace(/\#/g,"%23")
                .replace(re,'random'+'='+Math.random());
            //c.datagrid('options').startPage = 1;
            c.datagrid('refresh');
        });
    },
    /*getOptions:function () {
        var model = this;
        $("*[data-model=" + model.get("ModelName") + "]").each(function (i, t) {
            var c = $(t);
            return c.datagrid("options");
        });
    },*/
    /**设置选中行**/
    selectedRows:function(rows){//单个数据行的索引、逗号分隔的行索引字符串、数据行的jQuery对象
        var model = this;
        $("*[data-model=" + model.get("ModelName") + "]").each(function (i, t) {
            var c = $(t);
            return c.datagrid("selectedRows",rows,true);
        });
    },
    cancelSelectedRows:function(rows){//单个数据行的索引、逗号分隔的行索引字符串、数据行的jQuery对象
        var model = this;
        $("*[data-model=" + model.get("ModelName") + "]").each(function (i, t) {
            var c = $(t);
            return c.datagrid("selectedRows",rows,false);
        });
    },
    /**获取选中行**/
    getSelectedTr: function () {
        var model = this;
        var $tr;

        $("*[data-model=" + model.get("ModelName") + "]").each(function (i, t) {
            var c = $(t);
            $tr = c.data('selectedTrs');

        });
        return $tr;
    },
    /**获取选中行的数据*/
    getSelectedDatas: function () {
        var model = this;
        var datas;

        $("*[data-model=" + model.get("ModelName") + "]").each(function (i, t) {
            var c = $(t);
            datas = c.data('selectedDatas');

        });
        return datas;
    },
    doEditRow:function(row){//数据行的jQuery对象或行索引。
        var model = this;
        $("*[data-model=" + model.get("ModelName") + "]").each(function (i, t) {
            var c = $(t);
            c.datagrid('doEditRow',row);
        });
    },
    delRows:function(rows){//参数可以是：单个数据行的索引、逗号分隔的行索引字符串、数据行的jQuery对象
        var model = this;
        $("*[data-model=" + model.get("ModelName") + "]").each(function (i, t) {
            var c = $(t);
            c.datagrid('delRows',rows);
        });
    },


    saveAll:function(trs){
        var model = this;
        $("*[data-model=" + model.get("ModelName") + "]").each(function (i, t) {
            var c = $(t);
            c.datagrid('saveAll',trs);
        });
    }

});
