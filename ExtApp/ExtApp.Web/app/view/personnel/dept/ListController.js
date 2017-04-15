﻿
Ext.define('App.view.personnel.dept.ListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.deptlist',

    refresh: function () {
        var tree = this.getView().down('treepanel');
        var store = tree.getStore();
        store.reload();
    },

    onAddClick: function () {
        var view = Ext.create('App.view.personnel.dept.Add');
        view.controller.reset();
        view.show();
    },

    onTreeItemClick: function (view, record, item, index, e, eOpts) {
        var view = this.getView();
        var selected = view.down('treepanel').getSelection();
        view.down('form').getForm().reset();
        view.down('form').getForm().loadRecord(selected[0]);
    },

    onDeleteClick: function () {
        var me = this;
        var selected = this.getView().down('treepanel').getSelection();
        if (selected.length == 0) {
            App.notify('消息', '请选择机构！');
            return;
        }
        if (selected[0].data.ID == 0) {
            App.notify('消息', '无法删除顶级部门！');
            return;
        }
        App.confirm('消息', '要删除该机构？', function () {
            App.post('/api/Dept/Delete?ID=' + selected[0].data.ID, function (data) {
                var obj = JSON.parse(data);
                if (obj.Code == 200) {
                    App.notify('消息', '删除成功！');
                    me.refresh();
                } else {
                    App.alert('错误', obj.Msg);
                }
            })
        });
    },

    onSaveClick: function () {
        var me = this;
        var form = this.getView().down('form');
        var ID = form.form.getValues()["ID"];
        if (ID == '') {
            App.notify('消息', '请选择机构！');
            return;
        }

        if (ID == '0') {
            App.notify('消息', '无法编辑顶级部门！');
            return;
        }

        if (!form.isValid()) {
            App.notify('消息', '请填写完整！');
            return;
        }
        var values = form.getValues();

        App.post('/api/Dept/Edit', values, function (data) {
            var obj = JSON.parse(data);
            if (obj.Code == 200) { // 成功
                me.refresh();
                App.notify('消息', '保存成功！');
            } else { // 失败
                App.alert('消息', obj.Msg);
            }
        });
    }
});