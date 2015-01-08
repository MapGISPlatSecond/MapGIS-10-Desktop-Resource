
//应用程序类
var app = {
    initApp:function(){
        var _mapClass = new TelCom.Map();
        _mapClass.iniMap(mapConfig,"map-canvas");
        _mapClass._map.events.register("mousemove", null, _mapClass.map_MouseMove);

        var _markerClass = new TelCom.Marker();
        _markerClass.initIcon();


      /*  var _popupClass = new TelCom.Popup();
        var signPopup = _popupClass.createPopup();
        _mapClass._map.addPopup(signPopup);
*/

        var point = {x:13378146.03,y:3509905.82};
        var marker = _markerClass.createMark(0,point,true,[{name:"mousedown",func: _markerClass.mouseDown},{name:"mouseup",func: _markerClass.mouseUp}]);

        _mapClass._markLayer.addMarker(marker);
        /*
         var b;
         var loc = this;
         translateCallback = function (point){
             var a = _mapClass.changeBaidu2LonLat(point.lng,point.lat);
             b  = new OpenLayers.LonLat(a.x, a.y);
             marker = new OpenLayers.Marker( b);
             //alert("转化为百度坐标为："+point.lng + "," + point.lat);

         }
         BMap.Convertor.translate(new BMap.Point(120.302738,30.386434),0,translateCallback);     //真实经纬度转成百度坐标

        var b = _mapClass.changeBaidu2LonLat(120.302482,30.386535);

        var c = _mapClass.mercator2lonLat({x:13393422.16,y:3531930.22});*/

        return {_mapClass:_mapClass,_markerClass:_markerClass}

    }
};
/********* 地图右键菜单操作 ***************/

//显示菜单
function showRightMenu() {
    var evt = window.event || arguments[0];
    $("#rightMenu").menu('show',{left:evt.clientX,top:evt.clientY});
}
//隐藏菜单
function hideRightMenu() {
    $("#rightMenu").menu('hide');
}
//地图右键菜单响应事件
function rightMenuClickHandler(menuItem) {
    if(menuItem.id == "zoomOut") {//放大地图
        spatial.zoomOut();
    }

    if(menuItem.id == "select") {//放大地图
        spatial.activeSel();
    }

    if(menuItem.id == "zoomIn") {//缩小地图
        spatial.zoomIn();
    }

    if(menuItem.id == "move") {//移动
        spatial.move();
    }

    if(menuItem.id == "restore") {//复位
        spatial.reset();
    }

    if(menuItem.id == "refresh") {//刷新
        spatial.refresh();
    }

    if(menuItem.id == "clean") {//清除
        spatial.clearMarks();
        spatial.clearPopups();
        spatial.clearVectors();
    }

}








