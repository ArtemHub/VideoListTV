var VideoListTV = function (config) {
    config = config || {};
    VideoListTV.superclass.constructor.call(this, config);
};
Ext.extend(VideoListTV, Ext.Component, {
    window: {}, panel: {}, combo: {}, config: {}, view: {}, utils: {}, store: {}, form: {}
});
Ext.reg('videolist', VideoListTV);

VideoListTV = new VideoListTV();