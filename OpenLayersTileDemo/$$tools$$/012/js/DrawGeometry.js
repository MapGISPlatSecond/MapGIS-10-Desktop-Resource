
var isDGTXHZCheck = false;
var vecLayerDGTXHZ = null;      //矢量要素图层
var drawControlsDGTXHZ = null; //矢量图形绘制控件数组
function DrawDG() {
    if (!isDGTXHZCheck) {
        if ($("#DGTXHZdialog").attr("id") == undefined)
            BuildDGAlert();
        else {
            $.parser.parse($("#DGTXHZdialog")); //局部重新渲染
            $("#DGTXHZdialog").dialog("open");
        }
        initDGCtrl();
        isDGTXHZCheck = true;
    }
    else {
        $("#DGTXHZdialog").dialog("close");
    }
}
function BuildDGAlert() {
    var sb = '<div id="DGTXHZdialog" class="easyui-dialog" title="绘制图形选择" style="left:850px;top:200px;width:250px; height: 130px;padding: 5px;" resizable="false">'
           + '<table  style= "border:1px dashed gray;" ><tr >'
        		+ '<td style="border: 1px gray dashed;" ><img  src="$$tools$$/' + toolIdDG + '/img/pnt.png"' + '  width="32" height="32" title="绘制点"   style="cursor: pointer;" onclick=\'drawControlDrawGeo("0","point")\' onmouseover="this.style.backgroundColor=\'#999A99\';"  onmouseout="this.style.backgroundColor=\'\';"/></td>'
        		+ '<td style="border: 1px gray dashed;"><img  src="$$tools$$/' + toolIdDG + '/img/a2.png"' + ' width="32" height="32" title="绘制圆" style="cursor: pointer;" onclick=\'drawControlDrawGeo("1","RegularPolygon")\' onmouseover="this.style.backgroundColor=\'#999A99\';"  onmouseout="this.style.backgroundColor=\'\';"/></td>'
        		+ '<td style="border: 1px gray dashed;"><img   src="$$tools$$/' + toolIdDG + '/img/l4.png"' + ' width="32" height="32" title="绘制线" style="cursor: pointer;" onclick=\'drawControlDrawGeo("2","line")\' onmouseover="this.style.backgroundColor=\'#999A99\';"  onmouseout="this.style.backgroundColor=\'\';"/></td>'
                + '<td style="border: 1px gray dashed;"><img  src="$$tools$$/' + toolIdDG + '/img/a1.png"' + ' width="32" height="32" title="绘制矩形" style="cursor: pointer;" onclick=\'drawControlDrawGeo("4","RegularPolygon")\' onmouseover="this.style.backgroundColor=\'#999A99\';"  onmouseout="this.style.backgroundColor=\'\';"/></td>'
                + '<td style="border: 1px gray dashed;"><img   src="$$tools$$/' + toolIdDG + '/img/san.png"' + '  width="32" height="32" title="绘制三角形"   style="cursor: pointer;" onclick=\'drawControlDrawGeo("3","RegularPolygon")\' onmouseover="this.style.backgroundColor=\'#999A99\';"  onmouseout="this.style.backgroundColor=\'\';"/></td>'
        + '</tr>'
        + '<tr style="border:gray 1px dashed;">'
        		+ '<td style="border: 1px gray dashed;"><img  src="$$tools$$/' + toolIdDG + '/img/wu.png"' + ' width="32" height="32" title="绘制五边形" style="cursor: pointer;"  onclick=\'drawControlDrawGeo("5","RegularPolygon")\' onmouseover="this.style.backgroundColor=\'#999A99\';"  onmouseout="this.style.backgroundColor=\'\';"/></td>'
        		+ '<td style="border: 1px gray dashed;"><img   src="$$tools$$/' + toolIdDG + '/img/liu.png"' + ' width="32" height="32" title="绘制六边形" style="cursor: pointer;"  onclick=\'drawControlDrawGeo("6","RegularPolygon")\' onmouseover="this.style.backgroundColor=\'#999A99\';"  onmouseout="this.style.backgroundColor=\'\';"/></td>'
                + '<td style="border: 1px gray dashed;"><img  src="$$tools$$/' + toolIdDG + '/img/a3.png"' + ' width="32" height="32" title="绘制多边形" style="cursor: pointer;"  onclick=\'drawControlDrawGeo("7","polygon")\' onmouseover="this.style.backgroundColor=\'#999A99\';"  onmouseout="this.style.backgroundColor=\'\';"/></td>'
                + '<td style="border: 1px gray dashed;"><img  src="$$tools$$/' + toolIdDG + '/img/ra.png"' + ' width="39" height="32" title="清除图形" style="cursor: pointer;" onclick=\'ClearGraphics()\' onmouseover="this.style.backgroundColor=\'#999A99\';" onmouseout="this.style.backgroundColor=\'\';" /></td>'
        + '</tr>'
       + '</table>'+
   '   </div>';
    $("#main").append(sb);
    $("#DGTXHZdialog").dialog({ closed: false, onClose: function () { closeDG(); } });
}
//清楚标绘
function ClearGraphics() {
    if (vecLayerDGTXHZ != undefined && vecLayerDGTXHZ != null)
        vecLayerDGTXHZ.removeAllFeatures();
    DeactiveDraw();
}
function initDGCtrl() {
    if (vecLayerDGTXHZ == null) {
        vecLayerDGTXHZ = new OpenLayers.Layer.Vector("VecLayerLayer", { style: { strokeWidth: 2, fillOpacity: 0.6, fillColor: "red", strokeOpacity:0.7, strokeColor: "yellow", strokeDashstyle: "dotted", pointRadius: 5} });
        map.addLayer(vecLayerDGTXHZ);
        drawControlsDGTXHZ = {
            point: new OpenLayers.Control.DrawFeature(vecLayerDGTXHZ, OpenLayers.Handler.Point, { featureAdded: pointCallbackDrawGeo }),
            line: new OpenLayers.Control.DrawFeature(vecLayerDGTXHZ, OpenLayers.Handler.Path),
            polygon: new OpenLayers.Control.DrawFeature(vecLayerDGTXHZ, OpenLayers.Handler.Polygon),
            RegularPolygon: new OpenLayers.Control.DrawFeature(vecLayerDGTXHZ, OpenLayers.Handler.RegularPolygon)
        };
        for (var key in drawControlsDGTXHZ) {
            map.addControl(drawControlsDGTXHZ[key]);
        }
    }
}


//绘制点结束的回调函数，其他几种绘制方式的回调可以参照此种写法
function pointCallbackDrawGeo(e) {
    var pntStr = e.geometry.toString();
}

//根据当前选择的绘制选项，切换绘制矢量图形的控件
function drawControlDrawGeo(typeIndex, featureType) {
    DeactiveDraw();
    for (key in drawControlsDGTXHZ) {
        var control = drawControlsDGTXHZ[key];
        if (featureType == key) {
            control.activate(); //激活图形绘制控件
            switch (typeIndex) {
                case "1":
                    control.handler.setOptions({ sides: 240 }); //绘制类型：圆形
                    break;
                case "3":
                    control.handler.setOptions({ sides: 3 }); //绘制类型：三角形
                    break;
                case "4":
                    control.handler.setOptions({ sides: 4 }); //绘制类型：矩形
                    break;
                case "5":
                    control.handler.setOptions({ sides: 5 }); //绘制类型：五边形
                    break;
                case "6":
                    control.handler.setOptions({ sides: 6 }); //绘制类型：六边形
                    break;
            }

        } else {
            control.deactivate(); //关闭图形绘制控件激活状态
        }
    }
}

//取消矢量图形绘制控件的激活状态
function DeactiveDraw() {
    for (key in drawControlsDGTXHZ) {
        var control = drawControlsDGTXHZ[key];
        control.deactivate(); //关闭图形绘制控件激活状态
    }
}

//关闭窗口所执行的方法
function closeDG() {
    map.removeLayer(vecLayerDGTXHZ);
    isDGTXHZCheck = false;
    vecLayerDGTXHZ = null;
    for (var key in drawControlsDGTXHZ) {
        drawControlsDGTXHZ[key].deactivate();
        map.removeControl(drawControlsDGTXHZ[key]);
    }
    drawControlsDGTXHZ = null;
}