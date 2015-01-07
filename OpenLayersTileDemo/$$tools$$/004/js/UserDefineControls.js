var IsUDZDYCtrl = false;
var isLayerSwitcherZDY = false;
var isPanZoomBarZDY = false;
var isScaleBarZDY = false;
var isMagnifyZDY = false;
var isOverviewMapZDY = false;
var isLegendBarZDY = false;
var isRightcLickMenuZDY = false;
var controlarrZDY = [];
function initUDControl() {
    removeallControl();
    if (!IsUDZDYCtrl) {
        var obj = $("#trashUD");
        $("#trashUD")[0].style.display = "block";
        IsUDZDYCtrl = true;
    }
    else {
        $("#trashUD")[0].style.display = "none";
        IsUDZDYCtrl = false;
    }
}
 
        function update(element) {
            if (element == null) {
                return;
            }
            switch (element.id) {
                case "LayerSwitcher":
                    isLayerSwitcherZDY = ISInThisControl("Zondy.Control.LayerSwitcher");
                    if (!isLayerSwitcherZDY) {
                        var layerSwitcher = new Zondy.Control.LayerSwitcher(); //自定义图层列表控件
                        map.addControl(layerSwitcher);
                        document.getElementById("LayerSwitcher").value = layerSwitcher.id;
                        controlarrZDY.push(layerSwitcher.id);
                        isLayerSwitcherZDY = true;
                    }
                    else {
                        isLayerSwitcherZDY = false;
                        removeUserContrlByClassName("Zondy.Control.LayerSwitcher");
                    }
                    break;
                case "PanZoomBar":
                    isPanZoomBarZDY = ISInThisControl("Zondy.Control.PanZoomBar");
                    if (!isPanZoomBarZDY) {
                        var ovControl = new Zondy.Control.PanZoomBar(); //自定义导航控件
                        map.addControl(ovControl);
                        document.getElementById("PanZoomBar").value = ovControl.id;
                        controlarrZDY.push(ovControl.id);
                        isPanZoomBarZDY=true;
                    }
                    else {
                    isPanZoomBarZDY=false;
                      removeUserContrlByClassName("Zondy.Control.PanZoomBar");
                    }
                    break;
                case "ScaleBar":
                    isScaleBarZDY = ISInThisControl("Zondy.Control.ScaleBar");
                    if (!isScaleBarZDY) {
                        var scaleControl = new Zondy.Control.ScaleBar(); //自定义比例尺控件
                        map.addControl(scaleControl);
                        document.getElementById("ScaleBar").value = scaleControl.id;
                        controlarrZDY.push(scaleControl.id);
                        isScaleBarZDY=true;
                    }
                    else {
                    isScaleBarZDY=false;
                    removeUserContrlByClassName("Zondy.Control.ScaleBar");
                    }
                    break;
                case "Magnify":
                    isMagnifyZDY = ISInThisControl("Zondy.Control.Magnifier");
                    if (!isMagnifyZDY) {
                        var magnify = new Zondy.Control.Magnifier({ maxExtent: new OpenLayers.Bounds(114.125602, 30.453932, 114.500707, 30.829037), maxResolution: 0.00146525390625 });
                        map.addControl(magnify);
                        document.getElementById("Magnify").value = magnify.id;
                        controlarrZDY.push(magnify.id);
                        isMagnifyZDY=true;
                    }
                    else {
                    isMagnifyZDY=false;
                    removeUserContrlByClassName("Zondy.Control.Magnifier");
                    }
                    break;

                case "OverviewMap":
                    isOverviewMapZDY = ISInThisControl("Zondy.Control.OverviewMap");
                    if (!isOverviewMapZDY) {
                        var overviewMap = new Zondy.Control.OverviewMap();
                        map.addControl(overviewMap);
                        overviewMap.maximizeControl();
                        document.getElementById("OverviewMap").value = overviewMap.id;
                        controlarrZDY.push(overviewMap.id);
                        isOverviewMapZDY = true;
                    }
                    else {
                        isOverviewMapZDY = false;
                        removeUserContrlByClassName("Zondy.Control.OverviewMap");
                    }
                    break;
                case "LegendBar":
                    isLegendBarZDY = ISInThisControl("Zondy.Control.LegendBar");
                    if (!isLegendBarZDY) {
                        var legendBar = new Zondy.Control.LegendBar(); //自定义图例控件
                        var legendMark1 = new Zondy.Control.LegendMark("$$tools$$/" + toolIdUD +"/css/img/slider.png", "线路1");
                        legendBar.addLegendMark(legendMark1); //图例项
                        var legendMark2 = new Zondy.Control.LegendMark("$$tools$$/" + toolIdUD +"/css/img/slider.png", "线路2");
                        legendBar.addLegendMark(legendMark2); //图例项
                        var legendMark3 = new Zondy.Control.LegendMark("$$tools$$/" + toolIdUD +"/css/img/slider.png", "线路3");
                        legendBar.addLegendMark(legendMark3); //图例项
                        map.addControl(legendBar);
                        document.getElementById("LegendBar").value = legendBar.id;
                        controlarrZDY.push(legendBar.id);
                        isLegendBarZDY=true;

                    }
                    else {
                        isLegendBarZDY=false;
                        removeUserContrlByClassName("Zondy.Control.LegendBar");
                    }
                    break;
                case "RightcLickMenu":
                    isRightcLickMenuZDY = ISInThisControl("Zondy.Control.RightClickMenu");
                    if (!isRightcLickMenuZDY) {
                        var rightMenu = new Zondy.Control.RightClickMenu();  //自定义右键菜单控件
                        map.addControl(rightMenu);
                        document.getElementById("RightcLickMenu").value = rightMenu.id;
                        isRightcLickMenuZDY = true;
                        controlarrZDY.push(rightMenu.id);
                        $.messager.alert("右键菜单提示", "右键菜单添加成功，请在地图上单击鼠标右键！", "info");
                    }
                    else {
                        isRightcLickMenuZDY = false;
                        removeUserContrlByClassName("Zondy.Control.RightClickMenu");
                    }
                    break;
            }
        }

      //根据控件的类名删除
        function removeUserContrlByClassName(className) {
            var getControlArr = this.map.getControlsByClass(className);
            if (getControlArr) {
                if (getControlArr.length > 0) {
                    for (var i = 0; i < getControlArr.length; i++) {
                        map.removeControl(getControlArr[i]);
                    }
                }
            }
        }
        function ISInThisControl(className) {
            var isinFlag = false;
            var getControlArr = this.map.getControlsByClass(className);
            if (getControlArr) {
                if (getControlArr.length > 0) {
                    isinFlag = true;
                 }
            }
            return isinFlag;
        }

         function removeallControl() {
             removeUserContrlByClassName("Zondy.Control.LayerSwitcher");
             removeUserContrlByClassName("Zondy.Control.PanZoomBar");
             removeUserContrlByClassName("Zondy.Control.ScaleBar");
             removeUserContrlByClassName("Zondy.Control.Magnifier");
             removeUserContrlByClassName("Zondy.Control.OverviewMap");
             removeUserContrlByClassName("Zondy.Control.LegendBar");
             removeUserContrlByClassName("Zondy.Control.RightClickMenu");
             controlarrZDY = null;
             isLayerSwitcherZDY = false;
             isPanZoomBarZDY = false;
             isScaleBarZDY = false;
             isMagnifyZDY = false;
             isOverviewMapZDY = false;
             isLegendBarZDY = false;
             isRightcLickMenuZDY = false;
             controlarrZDY = [];
         }
        