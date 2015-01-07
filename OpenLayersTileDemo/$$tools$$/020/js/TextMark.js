var addDelWBBZFlag = false;
function TextMarkDisplay() {
    if (!addDelWBBZFlag) {
        if ($("#AddTextMarkDialog").attr("id") == undefined)
            addtextMarkDialog();
        else {
            $.parser.parse($("#AddTextMarkDialog")); //局部重新渲染
            $("#AddTextMarkDialog").dialog("open");
        }
        addDelWBBZFlag = true;
    } else {
        $("#AddTextMarkDialog").dialog("close");
    }

}
function deleteLableLayer() {
    var layerObj = map.getLayersByName("lableLayer");
    if(layerObj[0]){
        map.removeLayer(layerObj[0]);
    }
}
function addtextMarkDialog() {
    var sb = '<div id="AddTextMarkDialog" class="easyui-dialog" title="文本注记" style="left:900px;top:140px;width: 190px; height: 125px;padding: 5px;overflow:hidden" resizable="true">' +
    '<div >' +
              '<div ><label>' +
              '提示：根据坐标点在地图上添加图形和文字。' +
              '</label></div><div>' +
                '    <button class="functionButton"   onclick="addtextMark()">添加注记</button>' +
                 '   <button class="functionButton"     onclick="deleteLableLayer()">清除</button>' +
   ' </div></div>';
    $("#main").append(sb);
    $("#AddTextMarkDialog").dialog({ closed: false, onClose: function () { deleteLableLayer(); addDelWBBZFlag = false; } });
}

function addtextMark() {
    deleteLableLayer();
    map.setCenter(new OpenLayers.LonLat(11836601.4560488, 3420269.06140572), 3);
    var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
    renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
    var marker = new OpenLayers.Layer.Vector("lableLayer", {
        styleMap: new OpenLayers.StyleMap({ 'default': {
            strokeColor: "red", //#00FF00
            strokeOpacity: 1,
            strokeWidth: 2,
            fillColor: "blue", //#FF5500
            fillOpacity: 1,
            pointRadius: 6,
            pointerEvents: "visiblePainted",
            label: "${name}",  // label with \n linebreaks                    
            fontColor: "${favColor}",
            fontSize: "14px",
            fontFamily: "Vrinda", //Times New Roman
            fontWeight: "bold",
            labelOutlineColor: "",
            labelOutlineWidth: 4,
            labelXOffset: "${xOffset}",
            labelYOffset: "${yOffset}"
        }
        }),
        renderers: renderer,
        visibility: true
    });
    var features = [];
    var point = [{ lon: "11583906.2119481", lat: "3589966.11243971" }, { lon: "11836601.4560488", lat: " 3420269.06140572" }, { lon: "12725673.4935827", lat: "3570137.34656087" }, { lon: "12579102.4596399", lat: "3276318.48515313"}];
    var lonlat = [];
    for (var i = 0; i < 4; i++) {
        lonlat[i] = new OpenLayers.LonLat(point[i].lon, point[i].lat).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
    }
    point[0] = new OpenLayers.Geometry.Point(lonlat[0].lon, lonlat[0].lat);
    features[0] = new OpenLayers.Feature.Vector(point[0]);
    features[0].attributes = { name: "成都", favColor: "rgb(255,128,64)", xOffset: 2, yOffset: -20 };
    point[1] = new OpenLayers.Geometry.Point(lonlat[1].lon, lonlat[1].lat);
    features[1] = new OpenLayers.Feature.Vector(point[1]);
    features[1].attributes = { name: "重庆", favColor: "rgb(255,28,64)", xOffset: 2, yOffset: -20 };
    point[2] = new OpenLayers.Geometry.Point(lonlat[2].lon, lonlat[2].lat);
    features[2] = new OpenLayers.Feature.Vector(point[2]);
    features[2].attributes = { name: "武汉", favColor: "rgb(255,0,128)", xOffset: 2, yOffset: -20 };
    point[3] = new OpenLayers.Geometry.Point(lonlat[3].lon, lonlat[3].lat);
    features[3] = new OpenLayers.Feature.Vector(point[3]);
    features[3].attributes = { name: "长沙", favColor: "rgb(0,128,64)", xOffset: 2, yOffset: -20 };

    marker.addFeatures(features);
    map.addLayer(marker);
}