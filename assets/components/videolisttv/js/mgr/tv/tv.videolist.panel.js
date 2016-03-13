VideoListTV.panel.Gallery = function(config) {
    config = config || {};

    this.apikey = config.apikey || false;

    this.view = new VideoListTV.view.Gallery();
    this.window = new VideoListTV.window.RecordUpdate();
    this.textfield = new VideoListTV.panel.TextField();

    Ext.applyIf(config,{
        anchor: '100%',
        renderTo: id,
        autoHeight: true,
        items: [this.textfield,this.view]
    });

    VideoListTV.panel.Gallery.superclass.constructor.call(this,config);
    this.addEvents('change');
    this.on('change', this.onChange, this);

    this.loadMask = new Ext.LoadMask(this.getEl(), {msg:"Please wait..."});
    this.view.on('actionEdit', this.actionEdit, this);
    this.view.on('actionRemove', this.actionRemove, this);
    this.view.on('aftersort', this.onChange, this);
    this.window.on('beforeSubmit', this.updateRecord, this);
    this.textfield.on('buttonclick', this.actionAdd, this);
};
Ext.extend(VideoListTV.panel.Gallery, Ext.Panel, {
    afterRender: function() {
        Ext.Panel.superclass.afterRender.call(this);
        this.view.setData(this.linkedField.dom.value);
    },
    onChange: function() {
        var data = this.view.getData();
        this.linkedField.dom.value = (!data.length) ? '' : Ext.encode(data);
    },
    actionAdd: function(url) {
        var code = this.textfield.parseUrl();

        if(code != '') {
            this.view.insert({code: code}, code);

            if(this.apikey) {
                this.updateRecordViaYoutubeAPI(code);
            }
            else {
                this.updateRecord({
                    code: code,
                    title: code,
                    desc: '',
                    thumb: 'http://img.youtube.com/vi/'+code+'/0.jpg'
                });
            }
            this.textfield.setValue('');
            this.textfield.clearInvalid();
        }
        else {
            var tf = this.textfield;
            MODx.msg.alert('Ошибка!','Ссылка на видео указана неверно.',function() {
                tf.markInvalid('Ссылка на видео указана неверно')
            },MODx)
        }
    },
    actionEdit: function(node) {
        var record = this.view.getRecord(node);
        this.window.setValues(record.data);
        this.window.show();
    },
    actionRemove: function(index) {
        this.view.getStore().removeAt(index);
        this.fireEvent('change');
    },
    updateRecord: function(v) {
        var view = this.view,
            record  = view.getRecord(view.getNode(v.code));

        for(var k in v) {
            record.set(k, v[k]);
        };
        view.refresh();
        this.fireEvent('change');
    },
    updateRecordViaYoutubeAPI: function(code) {
        var url = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&fields=items/snippet/title,items/snippet/description,items/snippet/thumbnails/high&id='+ code +'&key=' + this.apikey,
            p = this;

        p.loadMask.show();

        Ext.Ajax.request({
            url: url,
            method: 'GET',
            success: function(response) {
                var data = Ext.decode(response.responseText).items[0].snippet;
                p.updateRecord({
                    code: code,
                    title: data.title,
                    desc: data.description,
                    thumb: data.thumbnails.high.url
                });
                p.loadMask.hide();
            },
            failure: function() {
                console.log('error #007')
            },
        });
    },
});
Ext.reg('videolist-panel-gallery', VideoListTV.panel.Gallery);