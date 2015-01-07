var lineLayer;
var isPLineCheck = false;
function Drawline() {
    if (!isPLineCheck) {
        if ($("#AddPLineDialog").attr("id") == undefined)
            addPLineDialog();
        else {
            $.parser.parse($("#AddPLineDialog")); //局部重新渲染
            $("#AddPLineDialog").dialog("open");
        }
        isPLineCheck = true;
    } else {
        $("#AddPLineDialog").dialog("close");
    }
}


function addPLineDialog() {
    var sb = '<div id="AddPLineDialog" class="easyui-dialog" title="添加线" style="left:910px;top:150px;width: 190px; height: 125px;padding: 5px;overflow:hidden" resizable="true">' +
    '<div >' +
              '<div ><label>' +
              '提示：添加线即根据已有的坐标在地图上添加线图形。' +
              '</label></div><div>' +
                '    <button class="functionButton"   onclick="addPLineByDots()">添加线</button>' +
                 '   <button class="functionButton"     onclick="clearPLineDlgByDots()">清除</button>' +
   ' </div></div>';
    $("#main").append(sb);
    $("#AddPLineDialog").dialog({ closed: false, onClose: function () { clearPLineDlgByDots(); isPLineCheck = false; } });
}

function addPLineByDots() {
    clearPLineDlgByDots();
    /*直接输入坐标值，在客户端绘制点要素*/
    lineLayer = new OpenLayers.Layer.Vector("polyline");
    lineLayer.style = { strokeWidth: 5, strokeOpacity: 0.5, strokeColor: "red", strokeDashstyle: "dotted" };

    //生成线要素的基本方法
    var points = [new OpenLayers.Geometry.Point(-4643279.56313057, -1781541.94577308), new OpenLayers.Geometry.Point(-562821.32669662, -2331705.36124358), new OpenLayers.Geometry.Point(361813.948561022, -877135.210746202)];
    var line = new OpenLayers.Geometry.LineString(points);
    var lfeature = new OpenLayers.Feature.Vector(line); //生成线要素
    lineLayer.addFeatures([lfeature]); //向图层添加线要素

    //调用生成几何图形的快捷函数生成几何线
    var linegeom = OpenLayers.Geometry.fromWKT("LINESTRING(-2090480.96275087 2678474.959214,743728.857574585 755539.592193982,3778946.05603564 1470153.57696278,1266349.37656103 4328720.98819669)");
    var linefeature = new OpenLayers.Feature.Vector(linegeom); //生成线要素
    lineLayer.addFeatures([linefeature]); //向图层添加线要素            

    map.addLayers([lineLayer]);
    map.setCenter(new OpenLayers.LonLat(743728.857574585, 755539.592193982), 3); //设置地图的初始化显示中心和显示级别
}
function clearPLineDlgByDots() {
    if (lineLayer) {
        map.removeLayer(lineLayer);
    }
    lineLayer = null;
}