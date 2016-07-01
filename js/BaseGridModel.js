//基础表单模型
var BaseGridModel = Backbone.Model.extend({
    initialize:function () {
    },
    defaults:{
        ModelName:"", //模型名称
        columns:"", //表头
        url:"", //表体
        postData:[],//参数
        tempPageSize:5, //数据缓冲区大小
        pagination:true, //是否分页
        ordinal:false, //是否有序号
        checkbox:false, //是否checkbox
        mulchose:true, //是否多选
        limit:10, //分页页码
        stretch:false,     //是否有详情
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
            o.url = model.get("url").replace(/\#/g,"%23")
                .replace(re,'random'+'='+Math.random());
            o.postData = model.get("postData");
            o.dischose = model.get("dischose");
            o.disObject = model.get("disObject");
            o.localData = model.get("localData");
            if(model.get("newThead") != null && model.get("newThead") != ""){
                o.newThead = model.get("newThead");
            }
            c.datagrid(o);
        });
    },
    reloadGrid: function () {
        var model = this;
        $("*[data-model=" + model.get("ModelName") + "]").each(function (i, t) {
            var c = $(t);
            var re=eval('/('+ 'random'+'=)([^&]*)/gi');
            //替换random，防止缓存。
            c.datagrid('options').url = model.get("url").replace(/\#/g,"%23")
                                                          .replace(re,'random'+'='+Math.random());
            c.datagrid('options').postData = model.get("postData");
            c.datagrid('options').dischose = model.get("dischose");
            c.datagrid('options').disObject = model.get("disObject");
            c.datagrid('options').localData = model.get("localData");
            c.datagrid('options').startPage = 1;
            c.datagrid('freshTempPool');
            c.datagrid('reload');
        });
    },
    getOptions:function () {
        var model = this;
        $("*[data-model=" + model.get("ModelName") + "]").each(function (i, t) {
            var c = $(t);
            return c.datagrid("options");
        });
    },
    getSelect: function () {
        var model = this;
        var selected;
        $("*[data-model=" + model.get("ModelName") + "]").each(function (i, t) {
            var c = $(t);
            selected = c.datagrid('getSelected');
        });
        return selected;
    },
    getAllData: function () {
        var model = this;
        var selected;
        $("*[data-model=" + model.get("ModelName") + "]").each(function (i, t) {
            var c = $(t);
            selected = c.datagrid('getAllData');
        });
        return selected;
    },
    setSelect:function(arr){
        var model = this;
        var selected;
        $("*[data-model=" + model.get("ModelName") + "]").each(function (i, t) {
            var c = $(t);
            selected = c.datagrid('setSelected',arr);
        });
    },
    //是否获取到了数据
    hasGetedData:function(){
        var model = this;
        var isSuccess;
        $("*[data-model=" + model.get("ModelName") + "]").each(function (i, t) {
            var c = $(t);
            isSuccess = c.datagrid('hasGetedData');
        });
        return isSuccess;
    }
});
