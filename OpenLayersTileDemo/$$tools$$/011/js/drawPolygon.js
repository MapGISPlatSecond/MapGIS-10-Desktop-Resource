var polygonLayer;
var isPolygonCheck = false;
function Drawpolygon() {
    if (!isPolygonCheck) {
        if ($("#AddPolygonDialog").attr("id") == undefined)
            addPolygonDialog();
        else {
            $.parser.parse($("#AddPolygonDialog")); //局部重新渲染
            $("#AddPolygonDialog").dialog("open");
        }
        isPolygonCheck = true;
    } else {
        $("#AddPolygonDialog").dialog("close");
    }
}
function addPolygonDialog() {
    var sb = '<div id="AddPolygonDialog" class="easyui-dialog" title="添加线" style="left:920px;top:160px;width: 210px; height: 135px;padding: 5px;overflow:hidden" resizable="true">' +
    '<div >' +
              '<div ><label>' +
              '提示：添加多边形即根据已有的坐标在地图上添加多边形图形，包含简单多边形和复杂多边形。' +
              '</label></div><div>' +
                '    <button class="functionButton"  style="width:90px;"  onclick="addPolygonByDots()">添加多边形</button>' +
                 '   <button class="functionButton"     onclick="clearPolygonDlgByDots()">清除</button>' +
   ' </div></div>';
    $("#main").append(sb);
    $("#AddPolygonDialog").dialog({ closed: false, onClose: function () { clearPolygonDlgByDots(); isPolygonCheck = false; } });
}

function addPolygonByDots() {
    clearPolygonDlgByDots();
    /*直接输入坐标值，在客户端绘制区要素*/
    polygonLayer = new OpenLayers.Layer.Vector("polygonMarker");
    polygonLayer.style = { strokeWidth: 5, strokeOpacity: 0.5, strokeColor: "orange", strokeDashstyle: "dotted", fillColor: "red", fillOpacity: 0.4 };

    //调用生成几何图形的快捷函数生成区
    var geometry1 = OpenLayers.Geometry.fromWKT("POLYGON(-959812.234348316 -664525.127946775,-1829170.70325765 -1692924.03289481,-1738716.93781867 -2049486.24110199,-1185945.53475086 -2267440.27650589)"); //,-1899000.40098 -1348000.06383
    var polygon1 = new OpenLayers.Feature.Vector(geometry1);  //生成区要素
    polygonLayer.addFeatures([polygon1]); //将区要素添加到图层中

    //创建简单多边形
    var pointA = [new OpenLayers.Geometry.Point(-2.57310, -9.38955), new OpenLayers.Geometry.Point(-552771.403067803, -1661724.50233599), new OpenLayers.Geometry.Point(-306537.142212714, -2012513.01197051), new OpenLayers.Geometry.Point(165831.532239832, -1305522.12106813)];
    var linearing = new OpenLayers.Geometry.LinearRing(pointA);
    var polygon2 = new OpenLayers.Feature.Vector(linearing);
    polygonLayer.addFeatures([polygon2]); //将区要素添加到图层中

    //创建复杂多边形
    var points = [];
    points[0] = [new OpenLayers.Geometry.Point(713577.973493227, -65328.9854384603), new OpenLayers.Geometry.Point(748753.819388993, -892356.491495481), new OpenLayers.Geometry.Point(1783943.82053816, -1249132.95068298), new OpenLayers.Geometry.Point(2110581.92320341,-165850.219077252)];
    points[1] = [new OpenLayers.Geometry.Point(997500.561151287, -233724.147211177), new OpenLayers.Geometry.Point(1143231.13293858, -803636.116943615), new OpenLayers.Geometry.Point(1711078.53464451, -465242.141116767)];
    var LinearRings = [new OpenLayers.Geometry.LinearRing(points[0]), new OpenLayers.Geometry.LinearRing(points[1])];
    var geometry3 = new OpenLayers.Geometry.Polygon(LinearRings)
    var polygon3 = new OpenLayers.Feature.Vector(geometry3);  //生成区要素
    polygonLayer.addFeatures([polygon3]); //将区要素添加到图层中

    map.addLayers([polygonLayer]);
    map.setCenter(new OpenLayers.LonLat(-85428.803624574, -882208.040610392), 3); //设置地图的初始化显示中心和显示级别
   
}
function clearPolygonDlgByDots() {
    if (polygonLayer) {
        map.removeLayer(polygonLayer);
    }
    polygonLayer = null;
}