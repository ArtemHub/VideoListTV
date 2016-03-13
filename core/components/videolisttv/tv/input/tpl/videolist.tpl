<input type="hidden" id="tv{$tv->id}" name="tv{$tv->id}" value="{$tv->value|escape}">
<div id="tv{$tv->id}-div"></div>
<script type="text/javascript">
    var id = '{$tv->id}',
        apikey = '{$apikey}';
    {literal}

    Ext.onReady(function() {
        MODx.load({
            xtype: 'videolist-panel-gallery',
            anchor: '100%',
            renderTo: 'tv' + id + '-div',
            linkedField: Ext.get('tv' + id),
            apikey: apikey
        });
    });
    {/literal}
</script>