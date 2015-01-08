/**
 * 说明：封装地图加载操作
 *      1.封装地图加载操作（配置文件）
 *      2.封装地图基本操作（放大、缩小、平移、刷新、复位）
 *      3.封装定位基本操作
 */
    var TelCom = {};

    TelCom.Map = OpenLayers.Class({
        _map:null,

        _mapConfig:null,
        _markLayer:null,
        _vertorLaye:null,

        initialize:function(){},

        iniMap:function(mapConfig,divId){
            this._mapConfig = mapConfig;

            //初始化地图加载
            var maxExtent = new OpenLayers.Bounds(mapConfig.baiduMapBounds.xmin, mapConfig.baiduMapBounds.ymin, mapConfig.baiduMapBounds.xmax, mapConfig.baiduMapBounds.ymax);
            //初始化图层
            var layersArr = [];
            //屏幕中心点
         /*   var center = this.changeBaidu2LonLat(mapConfig.baiduCenter.x,mapConfig.baiduCenter.y);
            var centerPos = new OpenLayers.LonLat(center.x,center.y);*/

            var centerPos = new OpenLayers.LonLat(mapConfig.baiduCenter.x,mapConfig.baiduCenter.y);
            //坐标原点
            var tileOrigin = new OpenLayers.LonLat(0,0);
            //
            this._map = new OpenLayers.Map(divId, {
                 maxExtent: maxExtent,
                 maxResolution:0.29435995234,//2.354879618
                projection:"EPSG:4326",
                // displayProjection:"EPSG:4326",
                 controls: [
                     new OpenLayers.Control.Navigation(), new OpenLayers.Control.PanZoomBar(),
                     new OpenLayers.Control.LayerSwitcher()
                    // new TelCom.Control.NavToolbar()
                 ]
             });
            // 百度地图图层
            var baidu_layer = new OpenLayers.Layer.Baidu (
                'baidu',
                ["http://online0.map.bdimg.com/tile/","http://online1.map.bdimg.com/tile/","http://online2.map.bdimg.com/tile/","http://online3.map.bdimg.com/tile/","http://online4.map.bdimg.com/tile/"],
                {
                    isBaseLayer: true,
                   // projection:"EPSG:900913",
                    //displayProjection:"EPSG:4326",
                  //  resolutions:[ 32768,16384, 8192, 4096, 2048, 1024, 512, 256,128,64, 32, 16, 8, 4,2, 1, 0.5 ],
                    tileOrigin :tileOrigin,
                     maxExtent :maxExtent
                }
            );
            layersArr.push(baidu_layer);

            this._vertorLayer = new OpenLayers.Layer.Vector("网格图层",{isBaseLayer:false,displayInLayerSwitcher:false})
            layersArr.push(this._vertorLayer);

            // marker 地图图层
            var markers_layer = new OpenLayers.Layer.Markers("markers",{displayInLayerSwitcher:false});
            this._markLayer = markers_layer;
            layersArr.push(markers_layer);

            this._map.addLayers(layersArr);
            this._map.setCenter(centerPos,mapConfig.baiduResetLev); //设置地图的初始化显示中心和显示级别   map.getProjectionObject()

        },
        map_MouseMove:function(e){
            if(this._selectMarker != null ){
                this._selectMarker.moveTo(this._selectMarker.map.getLayerPxFromViewPortPx(e.xy));
            }
             //alert("map");
        },
        getDistance:function (tx,ty,sx,sy) {
            var x1 = eval(tx);
            var y1 = eval(ty);
            var x2 = eval(sx);
            var y2 = eval(sy);
            var xdiff = x2 - x1;
            var ydiff = y2 - y1;
            var distance = Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
            if(distance > 1000) {
                return ((distance / 1000).toFixed(2) + "公里");
            }
            return distance.toFixed(2) + "米";
        },
        changeBaidu2LonLat:function(x,y){
            var projection =new BMap.MercatorProjection();
            var point = projection.lngLatToPoint(new BMap.Point(x,y));
            return point;
        },
        mercator2lonLat:function(mercator){ //大地坐标转经纬坐标
            var lonLat = {};
            var x = mercator.x/20037508.34*180;
            var y = mercator.y/20037508.34*180;
            y= 180/Math.PI*(2*Math.atan(Math.exp(y*Math.PI/180))-Math.PI/2);

            lonLat.x = x;
            lonLat.y = y;
            return lonLat;
        }

    }
);


TelCom.Feature = {}


//TelCom.Feature.Vector = OpenLayers.Class({
//
//    initialize:function(){},
//
//    addFeature:function(itemsAtt,vertorLayer){
//        var dots = itemsAtt.dots;
//        var length=dots.length;
//        var points=[];
//        for(var i=0;i<length;i++)
//        {
//            points.push(new OpenLayers.Geometry.Point(dots[i].x,dots[i].y));
//        }
//        //创建边界
//        var ring = new OpenLayers.Geometry.LinearRing(points);
//        var poly = new OpenLayers.Geometry.Polygon([ring]);
//        //创建要素
//        // var themeT = themeType ? themeType : ResSearch.EnumTheme.THEME_YWNL;
//        //var style = this.getFeatureStyle(itemsAtt,themeT);
//        var fea = new OpenLayers.Feature.Vector(poly);
//        //创建图标  前端传进来的是排名 从1开始的
//        /* if(itemsAtt.hasIcon){
//         this.showMark(this.getFeatureMark(fea));
//         }*/
//        vertorLayer.addFeatures([fea]);
//        return  fea;
//    },
//    getFeatureStyle:function(itemAtt,themeType){
//        var strokeWidth = 2;
//        if(itemAtt.index && itemAtt.index>0){
//            strokeWidth = 0;
//        }
//        var style = {strokeColor:'#000',strokeWidth:strokeWidth,fillOpacity:0.7};
//        if(themeType == ResSearch.EnumTheme.THEME_NL){    //网格速率
//            //计算速率 以及填充色
//            var jrsl = parseInt(itemAtt.nlsl) || 0;
//            if(jrsl == 1){
//                style.fillColor = "#00EE00";//绿色
//            }else if(jrsl == 2){
//                style.fillColor = "#FFFF00";//黄色
//            }else {
//                style.fillColor = "#FF0000";//红色
//            }
//        }else if(themeType == ResSearch.EnumTheme.THEME_CJB){
//            var czb = parseFloat(itemAtt.zjbl);
//            (czb == 0 ? style.fillColor = "#00EE00":"");
//            (czb > 0 && czb<=0.5 ? style.fillColor = "#0000FF":"");
//            (czb > 0.5 && czb <= 1.0 ? style.fillColor = "#FF00FF":"");
//            (czb > 1.0 && czb <= 2.0 ? style.fillColor = "#FFFF00":"");
//            (czb > 2.0 ? style.fillColor = "#FF0000":"");
//        }else if(themeType == ResSearch.EnumTheme.THEME_YWNL){    //网格业务速率
//            //计算速率 以及填充色
//            var jrsl = parseInt(itemAtt.jrsl) || 0;
//            if(jrsl == 1){
//                style.fillColor = "#00EE00";//绿色
//            }else if(jrsl == 2){
//                style.fillColor = "#FFFF00";//黄色
//            }else {
//                style.fillColor = "#FF0000";//红色
//            }
//        }
//
//        return style;
//    },
//    createMarker:function(){
//        //首先获取注记点位置
//        this.attributes.x = (this.geometry.getBounds().left + this.geometry.getBounds().right)/2;
//        this.attributes.y = (this.geometry.getBounds().bottom + this.geometry.getBounds().top)/2;
//        var mark, atts = this.attributes;
//
//        var point = new OpenLayers.LonLat(atts.x,atts.y);
//
//        if(typeof atts.index != "undefined" && parseInt(atts.index) > 0){
//            var redUrl = "images/markIcon/red" + atts.index  + ".png";
//            var icon = new OpenLayers.Icon(redUrl,new OpenLayers.Size(24, 31));
//            mark = new OpenLayers.Marker(point, icon.clone());
//        }else{
//            var redUrl = "images/red.png";
//            var redicon = new OpenLayers.Icon(redUrl,new OpenLayers.Size(24, 31));
//            mark = new OpenLayers.Marker(point, redicon.clone());
//        }
//        return mark;
//    },
//    destroyMarker: function() {
//        // pass
//    },
//    createPopup: function() {
//        this.attributes.x = (this.geometry.getBounds().left + this.geometry.getBounds().right)/2;
//        this.attributes.y = (this.geometry.getBounds().bottom + this.geometry.getBounds().top)/2;
//        var popup, atts = this.attributes;
//        var zcb =parseFloat(atts.zjbl * 100).toFixed(2)+ "%";
//        var html = "<div><span style='font-size: 14px;font-weight: bold;'>"+atts.mc+"</span></div>";
//        html += "<div>拆："+atts.cjnum+",装："+atts.zjnum+",净拆："+(parseInt(atts.cjnum)-parseInt(atts.zjnum))+",拆装比："+zcb+"</div>";
//        html += "<div><span style='font-size: 12px;'>固话:"+atts.ghzs+"("+(parseFloat(atts.rate_ghzs)*100).toFixed(2)+"%"+")</span>"
//        html += "<span style='font-size: 12px;'>宽带:"+atts.kdzs+"("+(parseFloat(atts.rate_kdzs)*100).toFixed(2)+"%"+")</span>"
//        html += "<span style='font-size: 12px;'>ITV:"+atts.itvzs+"("+(parseFloat(atts.rate_itvzs)*100).toFixed(2)+"%"+")</span></div>"
//        var popup = new OpenLayers.Popup.FramedCloud("chicken",
//            new OpenLayers.LonLat(atts.x,atts.y),
//            new OpenLayers.Size(200, 80),
//            html,
//            null, true
//        );
//        popup.autoSize=false;
//        return popup;
//    },
//    destroyPopup: function() {
//        // pass
//    }
//})


/**************************************** ***  TelCom.Marker start *** ***********************************/

TelCom.Marker = OpenLayers.Class({
    _redIcons:new Array(21),//地图上的红色标注点图标
    _blueIcons:new Array(21),//地图上的蓝色标注点图标
    _redMarkers:new Array(),
    _blueMarkers:new Array(),
    _popupClass:null,


    initialize: function () {

    },
    initIcon:function(){
        var iconSize = new OpenLayers.Size(24, 31);
        for(var i = 0; i < 21; i++) {
            var redUrl = "images/markIcon/red" + ((i == 0) ? "" : i) + ".png";
            var blueUrl = "images/markIcon/blue" + ((i == 0) ? "" : i) + ".png";
            this._redIcons[i] = new OpenLayers.Icon(redUrl,iconSize);
            this._blueIcons[i] = new OpenLayers.Icon(blueUrl,iconSize);
        }
    },
    mouseDown:function (e) {
        this.map._selectMarker = this;
    },
    mouseUp:function (e) {
        this.map._selectMarker = null;
    },
    mouseOver:function (e) {
        if(!this.map._selectMarker){

            publicClass._markerClass._popupClass = new TelCom.Popup();
            var data = {html:"<div> marker </div>",x:this.lonlat.lon,y:this.lonlat.lat};
            var signPopup = publicClass._markerClass._popupClass.createPopup(data);
            this.map.addPopup(signPopup);
        }
    },
    mouseOut:function (e) {
        if(publicClass._markerClass._popupClass){
            publicClass._markerClass._popupClass.clearPopups(this.map);
        }
    },
    createMark:function(index,dataItem,colorFlag,eventArr){//colorFlag true 表示红色图标  eventArr 是mark注册的 事件数组
        var loc = this;
        var point = new OpenLayers.LonLat(dataItem.x,dataItem.y);
        var icon = colorFlag ? this._redIcons[index] : this._blueIcons[index];
        var mark = new OpenLayers.Marker(point, icon.clone());
        /* mark.events.register("mouseover", mark, function (evt) {
         loc.clearPopups();
         OpenLayers.Event.stop(evt);

         var redPopup = loc.createPopup(dataItem);
         //mark.popup = redPopup;

         loc.markShowSwitch(index);
         });*/
        if(eventArr instanceof Array  && eventArr.length > 0 ){
            var eventObject ;
            for (index in eventArr){
                eventObject = eventArr[index];
                mark.events.register(eventObject.name, mark,eventObject.func);
            }
        }
        return mark;
    },
    createMarkAnd2Arr:function(index,dataItem,colorFlag,eventArr){//colorFlag true 表示红色图标  eventArr 是mark注册的 事件数组  把创建的marker 放入数组
        var mark = this.createMark(index,dataItem,colorFlag,eventArr);
        colorFlag ? (this._redMarkers[index] = mark) :(this._blueMarkers[index] = mark);
        return mark;
    },
    clearMarks:function(){
        this._markLayer.clearMarkers();
        this._redMarkers.splice(0);//清空红色标注
        this._blueMarkers.splice(0);//清空蓝色标注
    },
    showMark:function(mark){
        this._markLayer.addMarker(mark);
    },
    hideMark:function(mark){
        this._markLayer.removeMarker(mark);
    },
    markShowSwitch:function(curIndex){
        var lastIndex = this._lastSel;
        if(lastIndex > -1) {
            /** 先移除之前点击POI在地图上的切换的红色标注 **/
            this._markLayer.removeMarker(this._blueMarkers[lastIndex]);
            /** 切换之前点击的POI在地图上的的标注为蓝色图标 **/
            this._markLayer.addMarker(this._redMarkers[lastIndex]);

            /** 切换之前点击的左边列表中的POI的背景为蓝色图标 **/
            ResSearch.AddressNav.unSelectItem(lastIndex);
        }
        this._lastSel = curIndex;

        /** 切换当前点击的左边列表中的POI的背景为蓝色图标 **/

        ResSearch.AddressNav.selectItem(curIndex);

        /** 先移除当前点击POI在地图上的蓝色标注 **/
        this._markLayer.removeMarker(this._redMarkers[curIndex]);
        /** 添加当前点击POI在地图上的红色标注 **/
        this._markLayer.addMarker(this._blueMarkers[curIndex]);

        return this._blueMarkers[curIndex];
    }

})


/**************************************** ***  TelCom.Marker End  *** ***********************************/



/**************************************** ***  TelCom.Popup start *** ***********************************/

TelCom.Popup = OpenLayers.Class({

    initialize:function(){},

    createPopup:function(data) {
        var html = data.html;
        var pos = new OpenLayers.LonLat(data.x,data.y);
        var popup = new OpenLayers.Popup.FramedCloud("chicken",
            pos,
            new OpenLayers.Size(310, 350),
            html,
            null, true
        );
        //this._map.addPopup(popup);
        return popup;
    },
    clearPopups:function(map){
        var len = map.popups.length;
        for (var i = len - 1; i >= 0; i--) {
            map.removePopup(map.popups[i]);
        }
    }
});

/**************************************** ***  TelCom.Popup END *** ***********************************/



/**************************************** ***  TelCom.Popup Start *** ***********************************/
TelCom.Feature = OpenLayers.Class({
    initialize:function(){}
})


//TelCom.Feature.Vector = OpenLayers.Class({
//    createMarker:function(){
//        //首先获取注记点位置
//        this.attributes.x = (this.geometry.getBounds().left + this.geometry.getBounds().right)/2;
//        this.attributes.y = (this.geometry.getBounds().bottom + this.geometry.getBounds().top)/2;
//        var mark, atts = this.attributes;
//
//        var point = new OpenLayers.LonLat(atts.x,atts.y);
//
//        if(typeof atts.index != "undefined" && parseInt(atts.index) > 0){
//            var redUrl = "images/markIcon/red" + atts.index  + ".png";
//            var icon = new OpenLayers.Icon(redUrl,new OpenLayers.Size(24, 31));
//            mark = new OpenLayers.Marker(point, icon.clone());
//        }else{
//            var redUrl = "images/red.png";
//            var redicon = new OpenLayers.Icon(redUrl,new OpenLayers.Size(24, 31));
//            mark = new OpenLayers.Marker(point, redicon.clone());
//        }
//        return mark;
//    },
//    destroyMarker: function() {
//        // pass
//    },
//    createPopup: function() {
//        this.attributes.x = (this.geometry.getBounds().left + this.geometry.getBounds().right)/2;
//        this.attributes.y = (this.geometry.getBounds().bottom + this.geometry.getBounds().top)/2;
//        var popup, atts = this.attributes;
//        var zcb =parseFloat(atts.zjbl * 100).toFixed(2)+ "%";
//        var html = "<div><span style='font-size: 14px;font-weight: bold;'>"+atts.mc+"</span></div>";
//        html += "<div>拆："+atts.cjnum+",装："+atts.zjnum+",净拆："+(parseInt(atts.cjnum)-parseInt(atts.zjnum))+",拆装比："+zcb+"</div>";
//        html += "<div><span style='font-size: 12px;'>固话:"+atts.ghzs+"("+(parseFloat(atts.rate_ghzs)*100).toFixed(2)+"%"+")</span>"
//        html += "<span style='font-size: 12px;'>宽带:"+atts.kdzs+"("+(parseFloat(atts.rate_kdzs)*100).toFixed(2)+"%"+")</span>"
//        html += "<span style='font-size: 12px;'>ITV:"+atts.itvzs+"("+(parseFloat(atts.rate_itvzs)*100).toFixed(2)+"%"+")</span></div>"
//        var popup = new OpenLayers.Popup.FramedCloud("chicken",
//            new OpenLayers.LonLat(atts.x,atts.y),
//            new OpenLayers.Size(200, 80),
//            html,
//            null, true
//        );
//        popup.autoSize=false;
//        return popup;
//    },
//    destroyPopup: function() {
//        // pass
//    }
//})

//TelCom.Control.SelectFeature = OpenLayers.Class({
//    _selectFeature:null,
//    _vector_layer:null,
//
//    initialize:function(){},
//    initSelectFeature:function(vector_layer){
//        var selectFeature = new Openlayers.Control.SelectFeature(vector_layer,{
//            multiple:false,
//            toggle:true,
//            multipleKey:'shiftKey'
//        })
//
//        this._selectFeature = selectFeature;
//        this._vector_layer = vector_layer;
//
//        return selectFeature;
//    },
//    activate:function(){
//        if(typeof this._selectFeature == "Object"){
//            this._selectFeature.activate();
//        }
//    },
//    deActive:function(){
//        if(typeof this._selectFeature == "Object"){
//            this._selectFeature.deactivate();
//        }
//    }
//
//})




/**************************************** ***  TelCom Control  Start  *** ***********************************/
TelCom.Control = OpenLayers.Class(TelCom,{
    initialize:function(){}
})

TelCom.Control.RightClickMenu = OpenLayers.Class(TelCom.Control,{
    zoomOut:function () {
        var zoomBox = new OpenLayers.Control.ZoomBox({map: this._map});
        zoomBox.draw();
        zoomBox.activate();
    },
    zoomIn:function(){
        var zoomBox = new OpenLayers.Control.ZoomBox({map: this._map,out:true});
        zoomBox.draw();
        zoomBox.activate();
    },
    move:function(){
        var dragPan = new OpenLayers.Control.DragPan(OpenLayers.Util.extend({map:this._map},null));
        dragPan.draw();
        dragPan.activate();
    },
    reset:function(){
        this._map.zoomToMaxExtent();
    },
    refresh:function(){
        this._map.baseLayer.clearGrid();
        this._map.baseLayer.redraw();
    },
    jumpTo:function(point){
        this._map.setCenter(point,this._mapConfig.numZoomLevels-2);
    }
})

TelCom.Control.NavToolbar  =  OpenLayers.Control.SelfNavToolbar = OpenLayers.Class(OpenLayers.Control.Panel, {

    move:null,
    zoomOut:null,
    zoomInt:null,
    sign:null,

    initialize: function(options) {
        OpenLayers.Control.Panel.prototype.initialize.apply(this, [options]);
        this.addControls([
            this.move = new OpenLayers.Control.Navigation({title:"移动"}),
            this.zoomOut = new OpenLayers.Control.ZoomBox({title:"放大"}),
            this.zoomIn = new TelCom.Control.ZoomIn(),
            new OpenLayers.Control.ZoomToMaxExtent({title:"复位"}),
            new TelCom.Control.Refresh({title:"刷新"}),
            new TelCom.Control.Clear({title:"清除"}),
            this.sign = new TelCom.Control.Sign({title:"标记"})

        ]);
    },
    draw: function() {
        var div = OpenLayers.Control.Panel.prototype.draw.apply(this, arguments);
        if (this.defaultControl === null) {
            this.defaultControl = this.controls[0];
        }
        return div;
    },
    CLASS_NAME: "OpenLayers.Control.SelfNavToolbar"
});


TelCom.Control.Refresh = OpenLayers.Class(OpenLayers.Control.Button, {

    trigger: function(){
        TelCom.Control.RightClickMenu.refresh();
    },

    CLASS_NAME: "TelCom.Control.Refresh"
});

TelCom.Control.Clear = OpenLayers.Class(OpenLayers.Control.Button, {

    trigger: function(){
        spatial.clearMarks();
        spatial.clearPopups();
        spatial.clearVectors();
    },

    CLASS_NAME: "TelCom.Control.Clear"
});

TelCom.Control.ZoomIn = OpenLayers.Class(OpenLayers.Control.ZoomBox, {

    map: this._map,out:true,title:"缩小",

    CLASS_NAME: "TelCom.Control.ZoomIn"
});

TelCom.Control.Sign = OpenLayers.Class(OpenLayers.Control.Button, {

    flag:false,

    trigger: function(e){
        if(publicClass != null){
            var newSign = publicClass._markerClass.createMark(0,{x:0,y:0},true,[{name:"mousedown",func: publicClass._markerClass.mouseDown},
                                                                                      {name:"mouseup",func: publicClass._markerClass.mouseUp},
                                                                                      {name:"mouseover",func: publicClass._markerClass.mouseOver},
                                                                                      {name:"mouseout",func: publicClass._markerClass.mouseOut}])
            publicClass._mapClass._markLayer.clearMarkers();// 清空 标记图层
            publicClass._mapClass._markLayer.addMarker(newSign);
            this.map._selectMarker = newSign;
        }
    },

    CLASS_NAME: "TelCom.Control.Sign"
});



function deActivateTool(){
    move.deactivate();
    zoomOut.deactivate();
    zoomIn.deactivate();
}

function deActivateTool(){
    move.deactivate(),zoomOut.deactivate(),zoomIn.deactivate();
}


/**************************************** ***  TelCom Control  END  *** ***********************************/






