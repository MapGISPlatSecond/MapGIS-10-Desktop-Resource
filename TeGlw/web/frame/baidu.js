OpenLayers.Layer.Baidu = OpenLayers.Class(OpenLayers.Layer.TileCache,Zondy.Service.HttpRequest,{
    initialize: function (name, url, options) {
        var tempoptions = OpenLayers.Util.extend({
            'format': 'image/png',
            isBaseLayer: true
        }, options);
        OpenLayers.Layer.TileCache.prototype.initialize.apply(this, [name, url, {},
            tempoptions]);
        this.extension = this.format.split('/')[1].toLowerCase();
        this.extension = (this.extension == 'jpg') ? 'jpeg' : this.extension;
        this.transitionEffect = "resize";
        this.buffer = 0;
    },
    /**
     * 按地图引擎切图规则实现的拼接方式
     */
    getURL: function (bounds) {
        var tilez=this.map.zoom + 3; //  百度地图级别 和 Openlayers 级别相差了3级
        var res = this.map.getResolution();
        var size = this.tileSize;
        var bx = Math.round((bounds.left - this.tileOrigin.lon) / (res * size.w));
        var by = Math.round((bounds.bottom - this.tileOrigin.lat) / (res * size.h));
        var x = bx.toString().replace("-","M");
        var y = by.toString().replace("-","M");
        var urlsNum = Math.abs(parseInt((bx + by)) % this.url.length);
        var strURL = "";
        strURL = this.url[urlsNum] + '?qt=tile&x='+x+'&y='+y+'&z='+tilez+'&styles=pl&udt=20140807';
        return strURL;
    },
    clone: function (obj) {
        if (obj == null) {
            obj = new OpenLayers.Layer.Baidu(this.name, this.url, this.options);
        }
        obj = OpenLayers.Layer.TileCache.prototype.clone.apply(this, [obj]);
        return obj;
    },
    destroy: function () {
        OpenLayers.Layer.Grid.prototype.destroy.apply(this, arguments);
    },

    CLASS_NAME: "OpenLayers.Layer.Baidu"
});




