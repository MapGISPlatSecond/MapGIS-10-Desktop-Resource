var pointLayer;
var isPointAddCheck = false;
function DrawPnt() {
    if (!isPointAddCheck) {
        if ($("#AddPointDialog").attr("id") == undefined)
            addPointDialog();
        else {
            $.parser.parse($("#AddPointDialog")); //局部重新渲染
            $("#AddPointDialog").dialog("open");
        }
        isPointAddCheck = true;
    } else {
        $("#AddPointDialog").dialog("close");
    }
}

function addPointDialog() {
    var sb = '<div id="AddPointDialog" class="easyui-dialog" title="添加点" style="left:900px;top:140px;width: 190px; height: 125px;padding: 5px;overflow:hidden" resizable="true">' +
    '<div >' +
              '<div ><label>' +
              '提示：添加点即根据已有的坐标在地图上添加点图形。'+
              '</label></div><div>'+
                '    <button class="functionButton"   onclick="addPointByDots()">添加点</button>' +
                 '   <button class="functionButton"     onclick="clearPointDlgByDots()">清除</button>' +
   ' </div></div>';
    $("#main").append(sb);
    $("#AddPointDialog").dialog({ closed: false, onClose: function () { clearPointDlgByDots(); isPointAddCheck = false; } });
}

function addPointByDots() {
    clearPointDlgByDots();
    /*直接输入坐标值，在客户端绘制点要素*/
    pointLayer = new OpenLayers.Layer.Vector("pointMarker");
    pointLayer.style = { strokeWidth: 2, strokeOpacity: 0.8, strokeColor: "red", strokeDashstyle: "dotted", pointRadius: 8, fillColor: "yellow", fillOpacity: 0.8 };
    //生成几何点可以采用方式一：
    var point = new OpenLayers.Geometry.Point(-1492482.67696358,958373.377858659);
    var pfeature = new OpenLayers.Feature.Vector(point);   //生成点要素
    var point2 = new OpenLayers.Geometry.Point(-814081.662561026, 785912.024958);
    var pfeature2 = new OpenLayers.Feature.Vector(point2);   //生成点要素
    pointLayer.addFeatures([pfeature, pfeature2]);  //将点要素添加到图层中
    map.addLayers([pointLayer]);
    map.setCenter(new OpenLayers.LonLat(-1492482.67696358, 958373.377858659), 3);
}
function clearPointDlgByDots() {
    if (pointLayer) {
        map.removeLayer(pointLayer);
    }
    pointLayer = null;
}