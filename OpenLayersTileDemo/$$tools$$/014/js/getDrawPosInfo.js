var vecLayerMP = null;      //矢量要素图层
var featureType = null;
var isMPCheck = false;
var drawControlsMP = null;
var elementObjMP;
function DrawMP() {
    if (!isMPCheck) {
        if ($("#MPdialog").attr("id") == undefined)
            BuildMPAlert();
        else {
            $.parser.parse($("#MPdialog")); //局部重新渲染
            $("#MPdialog").dialog("open");
        }
        initMPCtrl();
        isMPCheck = true;
    }
    else {
        $("#MPdialog").dialog("close");
    }
    $("#getposInfoText").text("");
}
function BuildMPAlert() {
    var sb = '<div id="MPdialog" class="easyui-dialog" title="取图形坐标信息" style="left:900px;top:300px;width: 200px; height: 220px; padding: 5px;"  resizable="true">'
             +'<table style= "border: 1px dashed gray;" ><tr style="border: 1px gray dashed;" >'
        		+ '<td style="border: 1px gray dashed;"><img  src="$$tools$$/' + toolIdMP + '/img/pnt.png" width="32" height="32" title="绘制点"   style="cursor: pointer;" onclick=\'toggleControlMP(0,"point")\' onmouseover="this.style.backgroundColor=\'#999A99\';"  onmouseout="this.style.backgroundColor=\'\';"/></td>'
        		+ '<td style="border: 1px gray dashed;"><img  src="$$tools$$/' + toolIdMP + '/img/a2.png"  width="32" height="32" title="绘制圆" style="cursor: pointer;" onclick=\'toggleControlMP(5,"RegularPolygon")\' onmouseover="this.style.backgroundColor=\'#999A99\';"  onmouseout="this.style.backgroundColor=\'\';"/></td>'
        		+ '<td style="border: 1px gray dashed;"><img   src="$$tools$$/' + toolIdMP + '/img/l4.png"   width="32" height="32" title="绘制线" style="cursor: pointer;" onclick=\'toggleControlMP(1,"line")\' onmouseover="this.style.backgroundColor=\'#999A99\';"  onmouseout="this.style.backgroundColor=\'\';"/></td>'
               + '<td style="border: 1px gray dashed;"><img  src="$$tools$$/' + toolIdMP + '/img/a1.png"  width="32" height="32" title="绘制矩形" style="cursor: pointer;" onclick=\'toggleControlMP(3,"RegularPolygon")\' onmouseover="this.style.backgroundColor=\'#999A99\';"  onmouseout="this.style.backgroundColor=\'\';" /></td>'
        + '</tr>'
        + '<tr style="border:gray 1px dashed;">'
        		+ '<td style="border: 1px gray dashed;"><img  src="$$tools$$/' + toolIdMP + '/img/wu.png"  width="32" height="32" title="规则多边形" style="cursor: pointer;" onclick=\'toggleControlMP(4,"RegularPolygon")\' onmouseover="this.style.backgroundColor=\'#999A99\';"  onmouseout="this.style.backgroundColor=\'\';"/></td>'
                + '<td style="border: 1px gray dashed;"><img  src="$$tools$$/' + toolIdMP + '/img/a3.png"  width="32" height="32" title="绘制多边形" style="cursor: pointer;" onclick=\'toggleControlMP(7,"polygon")\' onmouseover="this.style.backgroundColor=\'#999A99\';"  onmouseout="this.style.backgroundColor=\'\';"/></td>'
                + '<td style="border: 1px gray dashed;"><img  src="$$tools$$/' + toolIdMP + '/img/ra.png"   width="39" height="32" title="清除图形" style="cursor: pointer;" onclick=\'ClearGraphicsMP()\' onmouseover="this.style.backgroundColor=\'#999A99\';"  onmouseout="this.style.backgroundColor=\'\';" /></td>'
        + '</tr>'
         + '<tr style="border:gray 1px dashed;">'
         + '<td colspan="4"><textarea rows="5" id="getposInfoText" cols="18">坐标信息：</textarea></td>'
        + '</tr>'
       + '</table>' +
   '   </div>';
    $("#main").append(sb);
    $("#MPdialog").dialog({ closed: false, onClose: function () { closeMP(); } });
}
function initMPCtrl() {
    //设置地图初始显示的中心坐标和级别
    vecLayerMP = new OpenLayers.Layer.Vector("vecLayerMP");
    map.addLayer(vecLayerMP);
    drawControlsMP = {
        point: new OpenLayers.Control.DrawFeature(vecLayerMP,
                                OpenLayers.Handler.Point, { featureAdded: AppendFeatureMP }),
        line: new OpenLayers.Control.DrawFeature(vecLayerMP,
                                OpenLayers.Handler.Path, { featureAdded: AppendFeatureMP }),
        polygon: new OpenLayers.Control.DrawFeature(vecLayerMP,
                                OpenLayers.Handler.Polygon, { featureAdded: AppendFeatureMP }),
        RegularPolygon: new OpenLayers.Control.DrawFeature(vecLayerMP, OpenLayers.Handler.RegularPolygon, { featureAdded: AppendFeatureMP })
    };
    for (var key in drawControlsMP) {
        map.addControl(drawControlsMP[key]);
    }
    //设置地图初始显示的中心坐标和级别
    map.setCenter(new OpenLayers.LonLat(0, 0), 2);
}
        function AppendFeatureMP(element) {
            if (element != null) {
                switch (elementObjMP) {
                    case 0: //点
                        var geomObj = new Zondy.Object.Point2D();
                        geomObj.setByOL(element.geometry);
                        $("#getposInfoText").text("坐标信息："+"X:" + geomObj.x + " Y:" + geomObj.y);
                        break;
                    case 1: //线
                        var geomObj = new Zondy.Object.PolyLine();
                        geomObj.setByOL(element.geometry);
                        var s = "";
                        if (geomObj.pointArr != null && geomObj.pointArr.length > 0) {
                            var s = geomObj.pointArr.toString();
                            $("#getposInfoText").text("坐标信息：" + s);
                        }
                        break;
                    case 2: //多边形       
                    case 3: //矩形 
                    case 4: //规则五边形
                        var geomObj = new Zondy.Object.Polygon();
                        geomObj.setByOL(element.geometry);
                        var s = "";
                        if (geomObj.pointArr != null && geomObj.pointArr.length > 0) {
                            var s = geomObj.pointArr.toString();
                            $("#getposInfoText").text("坐标信息：" + s);
                        }
                        break;
                    case 5: //圆
                        var geomObj = new Zondy.Object.Circle();
                        geomObj.setByOL(element.geometry);
                        var s = "";
                        $("#getposInfoText").text("坐标信息：" + "圆心：" + geomObj.point.toString() + '\n' + "半径：" + geomObj.radious);
                        break;
                    case 7: //多边形
                        var geomObj = new Zondy.Object.Polygon();
                        geomObj.setByOL(element.geometry);
                        var s = "";
                        if (geomObj.pointArr != null && geomObj.pointArr.length > 0) {
                            var s = geomObj.pointArr.toString();
                            $("#getposInfoText").text("坐标信息：" + s);
                        }
                        break;
                }
            }
        }

        //根据当前选择的绘制选项，切换绘制矢量图形的控件
        function toggleControlMP(element,type) {
            DeactiveDrawMP();
            for (key in drawControlsMP) {
                var control = drawControlsMP[key];
                if (type == key) {
                    control.activate();
                    elementObjMP = element;
                    switch (element) {
                        case 3:
                            control.handler.setOptions({ sides: 4 });
                            break;

                        case 4:
                            control.handler.setOptions({ sides: 5 });
                            break;

                        case 5:
                            control.handler.setOptions({ sides: 40 });
                            break;
                    }
                }
            }
        }

        //取消矢量图形绘制控件的激活状态
        function DeactiveDrawMP() {
            for (key in drawControlsMP) {
                var control = drawControlsMP[key];
                control.deactivate();
            }
        }

        function closeMP() {
            map.removeLayer(vecLayerMP);
            DeactiveDrawMP();
            isMPCheck = false;
            drawControlsMP = null;
            featureType = null;
        }

        function ClearGraphicsMP() {
            if (vecLayerMP != undefined && vecLayerMP != null)
                vecLayerMP.removeAllFeatures();
            DeactiveDrawMP();
            $("#getposInfoText").text("");
        }