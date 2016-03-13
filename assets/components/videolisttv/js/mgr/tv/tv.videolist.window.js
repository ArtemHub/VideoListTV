VideoListTV.window.RecordUpdate = function(config) {
    config = config || {};

    Ext.applyIf(config,{
        modal: true,
        labelAlign: 'top',
        width: 600,
        height: 400,
        fields: [{
            xtype: 'textfield',
            fieldLabel: 'Название',
            anchor: '100%',
            name: 'title'
        },{
            xtype: 'textarea',
            fieldLabel: 'Описание',
            anchor: '100%',
            height: 180,
            name: 'desc'
        },{
            xtype: 'hidden',
            name: 'code'
        }],
        buttons: [{
            text: config.cancelBtnText || _('cancel'),
            scope: this,
            handler: function() { config.closeAction !== 'close' ? this.hide() : this.close(); }
        },{
            text: config.saveBtnText || _('save'),
            cls: 'primary-button',
            scope: this,
            handler: this.submit
        }]
    });
    VideoListTV.window.RecordUpdate.superclass.constructor.call(this,config);
};
Ext.extend(VideoListTV.window.RecordUpdate, MODx.Window, {
    submit: function() {
        var f = this.fp.getForm(),
            v = f.getValues();

        if (f.isValid() && this.fireEvent('beforeSubmit',v)) {
            this.hide();
        }
    }
});