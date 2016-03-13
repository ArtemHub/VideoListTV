VideoListTV.store.Gallery = function(config) {
    config = config || {};

    Ext.applyIf(config,{
        remoteSort: false,
        idIndex: 0,
        fields: ['code','title','desc','thumb'],
    });
    VideoListTV.store.Gallery.superclass.constructor.call(this,config);
};
Ext.extend(VideoListTV.store.Gallery, Ext.data.ArrayStore, {
    getData: function() {
        var result = [];
        this.getRange().forEach(function(el, index) {
            var data = {};
            for(var k in el.data) {
                data[k] = el.data[k];
            };
            result.push(data);
        });
        return result;
    },
    loadData: function(data, append) {
        if(typeof(data) == 'string' && data.length) {
            var json = data; data = [];
            Ext.decode(json).forEach(function(el, index, arr) {
                data[index] = Object.keys(el).map(function(k) { return el[k] });
            });
        }
        VideoListTV.store.Gallery.superclass.loadData.call(this, data, append);
    }
});

VideoListTV.view.Gallery = function(config) {
    config = config || {};

    Ext.applyIf(config,{
        store: new VideoListTV.store.Gallery(),
        cls: 'videolist-view',
        tpl: new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="video-container" id="{code}"><div class="wrapper">',
            '<div class="video-thumb"><img src="{thumb}" title=""></div>',
            '<div class="video-info"><div class="video-info-title">{title}</div><div class="video-info-desc">{desc}</div></div>',
            '<i class="icon icon-pencil action-edit"></i><i class="icon icon-times action-remove"></i>',
            '</div></div>',
            '</tpl>'
        ),
        dd: 'videolist-gallery',
        autoHeight: true,
        multiSelect: false,
        itemSelector: 'div.video-container',
        emptyText: '<i class="empty-text">- галерея пуста -</i>',
        singleSelect: true
    });
    VideoListTV.view.Gallery.superclass.constructor.call(this,config);
    this.addEvents('actionEdit', 'actionRemove','aftersort');
    this.on('afterrender', this.onAfterRender, this);
    this.on('beforeclick', this.onBeforeClick, this);
};
Ext.extend(VideoListTV.view.Gallery, Ext.DataView, {
    onAfterRender: function() {
        this._initDragZone(this);
        this._initDropZone(this);
    },
    onBeforeClick: function(view, index, node, e) {
        if(e.getTarget('.action-remove')) {
            this.fireEvent('actionRemove', index)
        }
        else {
            this.fireEvent('actionEdit', node)
        }
    },
    _initDragZone: function(view) {
        this.dragzone = new Ext.dd.DragZone(view.getEl(), {
            ddGroup: view.dd,
            ignoreSelf: true,

            getDragData: function(e) {
                var sourceEl = e.getTarget(view.itemSelector, 10);

                if (sourceEl) {
                    d = sourceEl.cloneNode(true);
                    d.id = Ext.id();
                    return {
                        ddel: d,
                        sourceEl: sourceEl,
                        repairXY: Ext.fly(sourceEl).getXY(),
                        sourceStore: view.store,
                        draggedRecord: view.getRecord(sourceEl)
                    }
                }
            },

            getRepairXY: function() {
                return this.dragData.repairXY;
            },

            onStartDrag: function(x, y) {
                var obj = Ext.get(this.dragData.sourceEl);
                obj.addClass('drag');
            },
            afterInvalidDrop: function(e, id) {
                var obj = Ext.get(this.dragData.sourceEl);
                obj.removeClass('drag');
            },
            afterDragDrop: function(target, e, id) {
                var obj = Ext.get(this.dragData.sourceEl);
                obj.removeClass('drag');
            }
        });
    },
    _initDropZone: function(view) {
        this.dropzone = new Ext.dd.DropZone(view.getEl(), {
            ddGroup: view.dd,

            getTargetFromEvent: function(e) {
                return e.getTarget('.video-container');
            },

            onNodeEnter : function(target, dd, e, data){
                Ext.fly(target).addClass('video-container-over');
            },

            onNodeOut : function(target, dd, e, data){
                Ext.fly(target).removeClass('video-container-over');
            },

            onNodeDrop : function(target, dd, e, data){
                var record = view.getRecord(target);
                var store = view.getStore();
                var source = data.draggedRecord;

                var sourceIndex = store.indexOf(source);
                var targetIndex = store.indexOf(record);

                store.removeAt(sourceIndex);
                store.insert(targetIndex,source);

                view.fireEvent('aftersort');

                return true;
            }
        });
    },
    insert: function(data, id) {
        var s = this.store;
            record = new s.recordType(data, id);

        s.insert(s.getTotalCount(), record);
    },
    getData: function() {
        return this.store.getData();
    },
    setData: function(data) {
        this.store.loadData(data);
    }
});
Ext.reg('videolist-view-gallery', VideoListTV.view.Gallery);