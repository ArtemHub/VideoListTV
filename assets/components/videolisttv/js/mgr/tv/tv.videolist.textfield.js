VideoListTV.panel.TextField = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        timeFieldTpl: new Ext.XTemplate('<div class="videolist-textfield-description">' +
            '<p>Чтобы добавить видео, скопируйте URL видео (YouTube) и вставьте в текстовое поле под данным описанием. Затем нажмите кнопку <b>"+"</b>.</p>' +
            '<p>Для редактирования названия и описания ролика просто кликните по записи.</p>' +
            '<p>Порядок видео можно менять методом Drag&Drop.</p>' +
            '</div>' +
            '<div class="videolist-textfield-wrapper"><div class="textfield-ct"></div><div class="button-ct"></div></div>')
    });

    VideoListTV.panel.TextField.superclass.constructor.call(this,config);
    this.addEvents('buttonclick');
};
Ext.extend(VideoListTV.panel.TextField, Ext.Component, {
    onRender : function(ct, position) {
        VideoListTV.panel.TextField.superclass.onRender.call(this, ct, position);
        this.el.update(this.timeFieldTpl.apply(this));

        this['textfieldCt'] = Ext.query('.textfield-ct', this.el.dom)[0];
        this['textfield'] = Ext.create({
            xtype: 'textfield',
            renderTo : this['textfieldCt'],
        });

        this['buttonCt'] = Ext.query('.button-ct', this.el.dom)[0];
        this['button'] = Ext.create({
            xtype: 'button',
            text: '<i class="icon icon-plus"></i>',
            renderTo : this['buttonCt'],
            handler: function() {
                this.fireEvent('buttonclick', this.textfield.getValue());
            },scope: this
        });
    },
    setValue: function(val) {
        this.textfield.setValue(val);
    }
    ,parseUrl: function () {
        var url = this.textfield.getValue(),
            reg = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/,
            yt = url.match(reg);

        return (yt && yt[1]) ? yt[1] : '';
    },
    markInvalid: function(str) {
        this.textfield.markInvalid(str);
    },
    clearInvalid: function() {
        this.textfield.clearInvalid();
    }
});