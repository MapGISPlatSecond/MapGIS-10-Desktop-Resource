
var isFFCheck = false;

var vecLayerFF = null, vLayerFF = null;      //矢量要素图层
var selFeatureCtrlFlash = null; //矢量要素选择控件
var selectFlashFea;
var numFlashFea = 0;
var kFlashFea = 0;
var timerFlashFea;
var style_greenFF;
function DrawFF() {
    if (!isFFCheck) {

        if ($("#FFdialog").attr("id") == undefined)
            BuildFFAlert();
        else {
            $.parser.parse($("#FFdialog")); //局部重新渲染
            $("#FFdialog").dialog("open");
        }
        initFFCtrl();
        isFFCheck = true;
    }
    else {
      //  clearFlashFea();
       // isFFCheck = false;
        $("#FFdialog").dialog("close");
    }
   
}
function BuildFFAlert() {
    var sb = '<div id="FFdialog" class="easyui-dialog" title="框选要素闪烁" style="left:900px;top:320px;width:210px; height: 200px;padding: 5px" resizable="true">'
        		+ '<div id="toolspanelFF" style= "border:1px dashed gray;">'
                  + '  <input class="functionButton" type="button" id="disp" value="生成要素"   onclick=\'randFeatures()\'/>'
                   + '<input class="functionButton" type="button" id="Button1" value="框选要素"  onclick=\'boxSelect()\'/>'
                   + ' <input class="functionButton" type="button" id="Button3" value="开始闪烁"  onclick=\'startFlashFhFea()\'/>'
                   + ' <input class="functionButton" type="button" id="Button2" value="停止闪烁"  onclick=\'stopFlashFhFea()\'/>'
                   + ' <input class="functionButton" type="button" id="Button4" value="停止拉框"  onclick=\'stopBoxFlashFea()\'/>'
                   + ' <input class="functionButton" type="button" id="Button5" value="清除"  onclick=\'clearFlashFea()\'/>'
                +'</div>' +
   '   </div>';
    $("#main").append(sb);
    $("#FFdialog").dialog({ closed: false, onClose: function () { closeFFea(); } });
    document.getElementById('disp').disabled = false;
    document.getElementById('Button1').disabled = true;
    document.getElementById('Button4').disabled = true;
    document.getElementById('Button3').disabled = true;
    document.getElementById('Button2').disabled = true;
}

function initFFCtrl()
{
    vecLayerFF = new OpenLayers.Layer.Vector("矢量图层KXYS");
    selectFlashFea = new OpenLayers.Layer.Vector("SelectionKXYS");
    map.addLayers([ vecLayerFF, selectFlashFea]);
    map.setCenter(new OpenLayers.LonLat(-4.5142085028902,10.743816236882),3);
    numFlashFea = 20;
    kFlashFea = 0;
    style_green = {
        fillColor: "#ff0000",
        fillOpacity: 1,
        hoverFillColor: "white",
        hoverFillOpacity: 0.8,
        strokeColor: "#ff0000",
        strokeOpacity: 1,
        strokeLinecap: "round",
        strokeWidth: 2,
        strokeDashstyle: "solid",
        hoverStrokeColor: "red",
        hoverStrokeOpacity: 1,
        hoverStrokeWidth: 0.2,
        pointRadius: 6,
        hoverPointRadius: 1,
        hoverPointUnit: "%",
        pointerEvents: "visiblePainted",
        cursor: "inherit"
    };

    //图层要素选择控件
    selFeatureCtrlFlash = new OpenLayers.Control.SelectFeature(vecLayerFF, {
        highlightOnly: false,
        box: true
    });

    //图层要素选择事件
    vecLayerFF.events.on({
        'featureselected': function (e) {
            if (e.feature.geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
                var pnt = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(e.feature.geometry.x, e.feature.geometry.y), null, style_green);
                selectFlashFea.addFeatures([pnt]);
            }
        },
        'featureunselected': function (e) {
            selectFlashFea.removeAllFeatures();
        }
    });

    map.addControl(selFeatureCtrlFlash);

}

function toggleLayerFlashFea() {
    if (selectFlashFea != null) {
        if (selectFlashFea.visibility) {
            selectFlashFea.setVisibility(false);
        }
        else {
            selectFlashFea.setVisibility(true);
        }
    }
}
function startFlashFhFea() {
    var getSelectKXYS = selectFlashFea.features;
    if (getSelectKXYS == null || getSelectKXYS.length<=0) {
        $.messager.alert("提示", "当前没有框选任何要素，请重新选择！", "info");
        return;
    }
    document.getElementById('disp').disabled = true;
    document.getElementById('Button1').disabled = true;
    document.getElementById('Button4').disabled = true;
    document.getElementById('Button3').disabled = true;
    document.getElementById('Button2').disabled = false;
    timerFlashFea = setInterval(toggleLayerFlashFea, 500);
}
function stopFlashFhFea() {
    clearInterval(timerFlashFea);
    selectFlashFea.redraw();
    vecLayerFF.redraw();
    selectFlashFea.setVisibility(false);
    document.getElementById('disp').disabled = true;
    document.getElementById('Button3').disabled = false;
    document.getElementById('Button2').disabled = true;
    document.getElementById('Button1').disabled = true;
    document.getElementById('Button4').disabled = false;

    //  selectFlashFea.removeAllFeatures();


}

//随机生成矢量要素
function randomCreateFeatureFhFea(vLayer, numFlashFea) {
    var curMapBound = map.getExtent();
    var w = curMapBound.right - curMapBound.left;
    var h = curMapBound.top - curMapBound.bottom;

    if (vLayer== null) {
        vLayer = new OpenLayers.Layer.Vector("矢量图层");
        map.addLayers([vLayer]);
    }
    else {
        vLayer.removeAllFeatures();
    }
    var curResolution = map.getResolution();
    for (var i = 0; i < numFlashFea; i++) {
        var x = Math.random() * w + curMapBound.left;
        var y = Math.random() * h + curMapBound.bottom;
        var newPoint = new OpenLayers.Geometry.Point(x, y);
        var pntFeature = new OpenLayers.Feature.Vector(newPoint, null, null);
        vLayer.addFeatures([pntFeature]);
    }
}

function randFeatures() {
    randomCreateFeatureFhFea(vecLayerFF, 50);
    document.getElementById('disp').disabled = true;
    document.getElementById('Button1').disabled = false;
    document.getElementById('Button4').disabled = true;
    document.getElementById('Button3').disabled = true;
    document.getElementById('Button2').disabled = true;
}
function boxSelect() {
    selectFlashFea.setVisibility(false);
    selFeatureCtrlFlash.activate();
    document.getElementById('disp').disabled = true;
    document.getElementById('Button1').disabled = true;
    document.getElementById('Button2').disabled = true;
    document.getElementById('Button3').disabled = false;
    document.getElementById('Button4').disabled = true;

}
function stopBoxFlashFea() {
    document.getElementById('disp').disabled = true;
    document.getElementById('Button1').disabled = false;
    document.getElementById('Button2').disabled = true;
    document.getElementById('Button3').disabled = true;
    document.getElementById('Button4').disabled = false;

    selFeatureCtrlFlash.unselectAll();
    selFeatureCtrlFlash.deactivate();
    vecLayerFF.redraw();
    selectFlashFea.removeAllFeatures();
    selectFlashFea.setVisibility(false);

}
         function closeFFea() {
             if (timerFlashFea) {
                 clearInterval(timerFlashFea);
             }
             document.getElementById('disp').disabled = false;
             document.getElementById('Button1').disabled = true;
             document.getElementById('Button2').disabled = true;
             document.getElementById('Button3').disabled = true;
             document.getElementById('Button4').disabled = true;
             if (selFeatureCtrlFlash) {
                 selFeatureCtrlFlash.deactivate();
             }
             map.removeLayer(vecLayerFF);
             map.removeLayer(selectFlashFea);
             map.removeControl(selFeatureCtrlFlash);
             vecLayerFF = null;
             selectFlashFea = null;
             selFeatureCtrlFlash = null;
              numFlashFea = 0;
              kFlashFea = 0;
              timerFlashFea=null;
              style_green=null;
             isFFCheck = false;
         }
         function clearFlashFea() {
             closeFFea();
             isFFCheck = true;
             initFFCtrl();
         }

       