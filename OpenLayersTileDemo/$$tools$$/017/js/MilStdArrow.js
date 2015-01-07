var vecLayerMAS = null;      //矢量要素图层
var drawControlsMAS = null;
var modifyConMAS = null;
var selectControlMAS = null;
var selectFeatureNewMAS = null;
var srcElementMAS = null;
var isMASCheck = false;


function DrawMAS() {
    if (!isMASCheck) {
        if ($("#MASdialog").attr("id") == undefined)
            BuildMASAlert();
        else {
            $.parser.parse($("#MASdialog")); //局部重新渲染
            $("#MASdialog").dialog("open");
        }
        initMASCtrl();
        isMASCheck = true;
    }
    else {
       
        $("#MASdialog").dialog("close");
    }
}
function BuildMASAlert() {
    var sb = '<div id="MASdialog" class="easyui-dialog" title="军标绘制" style="left:900px;top:100px;width:270px; height: 460px;padding: 0px" resizable="false">'
           + ' <div class="itembox"><div style="width:110px;margin:7px 0px 5px 2px;float:left"><font size="3" weight="bold" family="微软雅黑">填充颜色：</font></div><div><input id="fillColMAS"  onclick=\'OnDocumentClickMAS("fillColMAS")\' type="text" size="6" alt="popColorDlg" style="background-color:#FF9966;"  value="#FF9966" readonly="readonly" /></div>'
                          +'  </div>'
                          + ' <div class="itembox"><div style="margin:7px 0px 5px 2px;width:110px;float:left"> <font size="3" weight="bold" family="微软雅黑">透明度(0-1)：</font></div><div><input id="fillOpcMAS" type="text" value="1" size="6"/></div></div>'
                           + '<div ><div class="itembox"><font size="3" weight="bold" family="微软雅黑"> 绘制图标:</font></div>'
            + '<div class="itembox"><table  style= "border:1px dashed gray;" ><tr >'
        		+ '<td style="border: 1px gray dashed;" ><img  src="$$tools$$/' + toolIDMAS + '/img/l10.png"' + '  width="32" height="32" title="简单箭头"   style="cursor: pointer;" onclick=\'toggleControlMAS("simpleArrow")\' onmouseover="this.style.backgroundColor=\'#999A99\';"  onmouseout="this.style.backgroundColor=\'\';"/></td>'
        		+ '<td style="border: 1px gray dashed;"><img  src="$$tools$$/' + toolIDMAS + '/img/l11.png"' + ' width="32" height="32" title="双箭头" style="cursor: pointer;" onclick=\'toggleControlMAS("doubleArrow");\' onmouseover="this.style.backgroundColor=\'#999A99\';"  onmouseout="this.style.backgroundColor=\'\';"/></td>'
        		+ '<td style="border: 1px gray dashed;"><img   src="$$tools$$/' + toolIDMAS + '/img/l1.png"' + ' width="32" height="32" title="直箭头" style="cursor: pointer;" onclick=\'toggleControlMAS("straightArrow")\' onmouseover="this.style.backgroundColor=\'#999A99\';"  onmouseout="this.style.backgroundColor=\'\';"/></td>'
                + '<td style="border: 1px gray dashed;"><img  src="$$tools$$/' + toolIDMAS + '/img/sanjiao1.png"' + ' width="32" height="32" title="三角旗" style="cursor: pointer;" onclick=\'toggleControlMAS("TriangleFlag")\' onmouseover="this.style.backgroundColor=\'#999A99\';"  onmouseout="this.style.backgroundColor=\'\';"/></td>'
         + '<td style="border: 1px gray dashed;"><img   src="$$tools$$/' + toolIDMAS + '/img/rectflg1.png"' + '  width="32" height="32" title="矩形旗"   style="cursor: pointer;" onclick=\'toggleControlMAS("RectFlag")\' onmouseover="this.style.backgroundColor=\'#999A99\';"  onmouseout="this.style.backgroundColor=\'\';"/></td>'
        + '</tr>'
        + '<tr style="border:gray 1px dashed;">'
        		+ '<td style="border: 1px gray dashed;"><img  src="$$tools$$/' + toolIDMAS + '/img/m5.png"' + ' width="32" height="32" title="波浪旗" style="cursor: pointer;"  onclick=\'toggleControlMAS("CurveFlag")\' onmouseover="this.style.backgroundColor=\'#999A99\';"  onmouseout="this.style.backgroundColor=\'\';"/></td>'
        		+ '<td style="border: 1px gray dashed;"><img   src="$$tools$$/' + toolIDMAS + '/img/crossarr1.png"' + ' width="32" height="32" title="十字箭头指北针" style="cursor: pointer;"  onclick=\'toggleControlMAS("ArrowCross")\' onmouseover="this.style.backgroundColor=\'#999A99\';"  onmouseout="this.style.backgroundColor=\'\';"/></td>'
                + '<td style="border: 1px gray dashed;"><img  src="$$tools$$/' + toolIDMAS + '/img/circleArr1.png"' + ' width="32" height="32" title="圆形尖角指北针" style="cursor: pointer;"  onclick=\'toggleControlMAS("CircleClosedangle")\' onmouseover="this.style.backgroundColor=\'#999A99\';"  onmouseout="this.style.backgroundColor=\'\';"/></td>'
                + '<td style="border: 1px gray dashed;"><img  src="$$tools$$/' + toolIDMAS + '/img/尖角之北1.png"' + ' width="39" height="32" title="尖角指北针" style="cursor: pointer;" onclick=\'toggleControlMAS("Closedangle")\' onmouseover="this.style.backgroundColor=\'#999A99\';" onmouseout="this.style.backgroundColor=\'\';" /></td>'
                 + '<td style="border: 1px gray dashed;"><img   src="$$tools$$/' + toolIDMAS + '/img/double尖角1.png"' + '  width="32" height="32" title="双向尖角指北针"   style="cursor: pointer;" onclick=\'toggleControlMAS("DoubleClosedangle")\' onmouseover="this.style.backgroundColor=\'#999A99\';"  onmouseout="this.style.backgroundColor=\'\';"/></td>'
        + '</tr>'
          + '<tr style="border:gray 1px dashed;">'
        		+ '<td style="border: 1px gray dashed;"><img  src="$$tools$$/' + toolIDMAS + '/img/4jiao1.png"' + ' width="32" height="32" title="四角指北针" style="cursor: pointer;"  onclick=\'toggleControlMAS("Fourstar")\' onmouseover="this.style.backgroundColor=\'#999A99\';"  onmouseout="this.style.backgroundColor=\'\';"/></td>'
        		+ '<td style="border: 1px gray dashed;"><img   src="$$tools$$/' + toolIDMAS + '/img/lingx1.png"' + ' width="32" height="32" title="菱形指北针" style="cursor: pointer;"  onclick=\'toggleControlMAS("Rhombus")\' onmouseover="this.style.backgroundColor=\'#999A99\';"  onmouseout="this.style.backgroundColor=\'\';"/></td>'
                + '<td style="border: 1px gray dashed;"><img  src="$$tools$$/' + toolIDMAS + '/img/同向1.png"' + ' width="32" height="32" title="同向尖角指北针" style="cursor: pointer;"  onclick=\'toggleControlMAS("SameDirectionClosedangle")\' onmouseover="this.style.backgroundColor=\'#999A99\';"  onmouseout="this.style.backgroundColor=\'\';"/></td>'
                + '<td style="border: 1px gray dashed;"><img  src="$$tools$$/' + toolIDMAS + '/img/三角之北1.png"' + ' width="39" height="32" title="三角指北针" style="cursor: pointer;" onclick=\'toggleControlMAS("Triangle")\' onmouseover="this.style.backgroundColor=\'#999A99\';" onmouseout="this.style.backgroundColor=\'\';" /></td>'
                 + '<td style="border: 1px gray dashed;"><img   src="$$tools$$/' + toolIDMAS + '/img/风向1.png"' + '  width="32" height="32" title="风向标指北针"   style="cursor: pointer;" onclick=\'toggleControlMAS("Vane")\' onmouseover="this.style.backgroundColor=\'#999A99\';"  onmouseout="this.style.backgroundColor=\'\';"/></td>'
        + '</tr>'
       + '</table></div>'
       +'<table>'
       + '<tr><td> <button id="Button2MAS" class="functionButton" onclick=\'Button2MAS_onclick()\' >改变大小</button>'
                    + '<button id="Button5MAS" class="functionButton" onclick=\'Button5MAS_onclick()\'>拖动图标</button>'
                    + '<button id="Button7MAS" class="functionButton" onclick=\'Button7MAS_onclick()\' >删除图标</button></td></tr>'
                    + '<tr><td> '
                     + '<button id="Submit1MAS"  class="functionButton" onclick=\'Submit1MAS_onclick()\'>修改风格</button>'
                      + '<button id="Button3MAS" class="functionButton" onclick=\'Button3MAS_onclick()\'>注销绘制</button>'
                      + '<button id="claMAS" class="functionButton" onclick=\'ClearGraphicsMAS()\' >清除图形</button></td></tr>'
  + '<tr><td>'
  +'<textarea id="tipsJSYA" rows="3" cols="6" style="width:100%">操作提示：设置需要绘制的标绘的颜色和透明度，再选择绘制图标里的类型，在地图上点击绘制，双击结束！</textarea>'
  +'</td></tr>'
   + '</table></div>'
   +'   </div>';
    $("#main").append(sb);
    $("#MASdialog").dialog({ closed: false, onClose: function () { closeMAS(); } });
}

function ClearGraphicsMAS() {
    $("#tipsJSYA").text("提示：清除图形成功！");
    if (vecLayerMAS != undefined && vecLayerMAS != null)
        vecLayerMAS.removeAllFeatures();
    DeactiveControlsMAS();
}
function closeMAS() {
    ClearGraphicsMAS();
    isMASCheck = false;
}
function initMASCtrl() {
    //设置地图初始显示的中心坐标和级别
    vecLayerMAS = new OpenLayers.Layer.Vector("VecLayer", { displayInLayerSwitcher: false, visibility: true });
    map.addLayer(vecLayerMAS);
    drawControlsMAS = {
        simpleArrow: new OpenLayers.Control.DrawFeature(vecLayerMAS, Milstd.MilStdPathHandle),
        doubleArrow: new OpenLayers.Control.DrawFeature(vecLayerMAS, Milstd.MilStdPathHandle),
        straightArrow: new OpenLayers.Control.DrawFeature(vecLayerMAS, Milstd.MilStdPathHandle),
        TriangleFlag: new OpenLayers.Control.DrawFeature(vecLayerMAS, Milstd.MilStdPathHandle),
        RectFlag: new OpenLayers.Control.DrawFeature(vecLayerMAS, Milstd.MilStdPathHandle),
        CurveFlag: new OpenLayers.Control.DrawFeature(vecLayerMAS, Milstd.MilStdPathHandle),
        ArrowCross: new OpenLayers.Control.DrawFeature(vecLayerMAS, Milstd.MilStdPathHandle),
        CircleClosedangle: new OpenLayers.Control.DrawFeature(vecLayerMAS, Milstd.MilStdPathHandle),
        Closedangle: new OpenLayers.Control.DrawFeature(vecLayerMAS, Milstd.MilStdPathHandle),
        DoubleClosedangle: new OpenLayers.Control.DrawFeature(vecLayerMAS, Milstd.MilStdPathHandle),
        Fourstar: new OpenLayers.Control.DrawFeature(vecLayerMAS, Milstd.MilStdPathHandle),
        Rhombus: new OpenLayers.Control.DrawFeature(vecLayerMAS, Milstd.MilStdPathHandle),
        SameDirectionClosedangle: new OpenLayers.Control.DrawFeature(vecLayerMAS, Milstd.MilStdPathHandle),
        Triangle: new OpenLayers.Control.DrawFeature(vecLayerMAS, Milstd.MilStdPathHandle),
        Vane: new OpenLayers.Control.DrawFeature(vecLayerMAS, Milstd.MilStdPathHandle)
    };

    for (var key in drawControlsMAS) {
        map.addControl(drawControlsMAS[key]);

    }



    modifyConMAS = new Milstd.ModifyControl(vecLayerMAS);
    modifyConMAS.mode = OpenLayers.Control.ModifyFeature.RESHAPE;

    map.addControl(modifyConMAS);

    selectControlMAS = new OpenLayers.Control.SelectFeature(vecLayerMAS, { multiple: false, box: true });

    selectControlMAS.events.register("beforefeaturehighlighted", this, function (e) {
        var styObj = MyClone(OpenLayers.Feature.Vector.style['select']);
        e.feature.style = styObj;
        vecLayerMAS.refresh();
    });
    selectControlMAS.events.register("featurehighlighted", this, function (e) {
        var styObj = MyClone(OpenLayers.Feature.Vector.style['default']);
        if (String(document.getElementById("fillColMAS").value) != null && String(document.getElementById("fillColMAS").value) != "") {
            styObj.fillColor = String(document.getElementById("fillColMAS").value);
            styObj.strokeColor = String(document.getElementById("fillColMAS").value);
        }
        if (Number(document.getElementById("fillOpcMAS").value) > 0 && Number(document.getElementById("fillOpcMAS").value) <= 1) {
            styObj.fillOpacity = Number(document.getElementById("fillOpcMAS").value);
        }

        e.feature.style = styObj;
        vecLayerMAS.refresh();
    });

    map.addControl(selectControlMAS);

    selectFeatureNewMAS = new OpenLayers.Control.SelectFeature(vecLayerMAS, { multiple: false, box: false});
    selectFeatureNewMAS.events.register("featurehighlighted", this, function (e) {
        deleteFeatures();
    });
    map.addControl(selectFeatureNewMAS);
}
function deleteFeatures() {
    var sel = vecLayerMAS.selectedFeatures;
            vecLayerMAS.removeFeatures(vecLayerMAS.selectedFeatures);
        }
        function MyClone(myObj) {
            if (typeof (myObj) != 'object') return myObj;
            if (myObj == null) return myObj;

            var myNewObj = new Object();

            for (var i in myObj)
                myNewObj[i] = MyClone(myObj[i]);

            return myNewObj;
        }


        //根据当前选择的绘制选项，切换绘制矢量图形的控件
        function toggleControlMAS(element) {
            $("#tipsJSYA").text("绘制操作提示：在地图上单击开始绘制，双击结束！");
            DeactiveControlsMAS();

            // var styObj = MyClone(OpenLayers.Feature.Vector.style['default']);
            var styObj = OpenLayers.Feature.Vector.style['default'];
            if (String(document.getElementById("fillColMAS").value) != null && String(document.getElementById("fillColMAS").value) != '') {
                styObj.fillColor = String(document.getElementById("fillColMAS").value);
            }
            if (Number(document.getElementById("fillOpcMAS").value) > 0 && Number(document.getElementById("fillOpcMAS").value) <= 1) {
                styObj.fillOpacity = Number(document.getElementById("fillOpcMAS").value);
            }
            if (String(document.getElementById("fillColMAS").value) != null && String(document.getElementById("fillColMAS").value) != '') {
                styObj.strokeColor = String(document.getElementById("fillColMAS").value);
            }



            for (key in drawControlsMAS) {
                var control = drawControlsMAS[key];

                if (key == "simpleArrow") {
                    control.handler.setOptions({ graphics: "SimpleArrow",
                        headHeightFactor: 0.15,
                        headWidthFactor: 0.4,
                        neckHeightFactor: 0.75,
                        neckWidthFactor: 0.1,
                        tailWidthFactor: 0.1,
                        hasSwallowTail: true,
                        swallowTailFactor: 0.5,
                        curveFitMethod: "curveFitMethod",
                        featureStyle: styObj
                    });
                }
                else if (key == "doubleArrow") {
                    control.handler.setOptions({ graphics: "DoubleArrow",
                        headHeightFactor: 0.15,
                        headWidthFactor: 0.8,
                        neckHeightFactor: 0.7,
                        neckWidthFactor: 0.4,
                        featureStyle: styObj
                    });
                }
                else if (key == "straightArrow") {
                    control.handler.setOptions({ graphics: "SimpleArrow",
                        headHeightFactor: 0.1,
                        headWidthFactor: 1.3,
                        neckHeightFactor: 1.0,
                        neckWidthFactor: 0.7,
                        tailWidthFactor: 0.07,
                        hasSwallowTail: false,
                        swallowTailFactor: 0,
                        curveFitMethod: "curveFitMethod",
                        featureStyle: styObj
                    });
                }
                else if (key == "TriangleFlag") {
                    control.handler.setOptions({ graphics: "TriangleFlag", featureStyle: styObj });
                }
                else if (key == "RectFlag") {
                    control.handler.setOptions({ graphics: "RectFlag", featureStyle: styObj });
                }
                else if (key == "CurveFlag") {
                    control.handler.setOptions({ graphics: "CurveFlag", featureStyle: styObj });
                }
                else if (key == "ArrowCross") {
                    control.handler.setOptions({ graphics: "ArrowCross", featureStyle: styObj });
                }
                else if (key == "CircleClosedangle") {
                    control.handler.setOptions({ graphics: "CircleClosedangle", featureStyle: styObj });
                }
                else if (key == "Closedangle") {
                    control.handler.setOptions({ graphics: "Closedangle", featureStyle: styObj });
                }
                else if (key == "DoubleClosedangle") {
                    control.handler.setOptions({ graphics: "DoubleClosedangle", featureStyle: styObj });
                }
                else if (key == "Fourstar") {
                    control.handler.setOptions({ graphics: "Fourstar", featureStyle: styObj });
                }
                else if (key == "Rhombus") {
                    control.handler.setOptions({ graphics: "Rhombus", featureStyle: styObj });
                }
                else if (key == "SameDirectionClosedangle") {
                    control.handler.setOptions({ graphics: "SameDirectionClosedangle", featureStyle: styObj });
                }
                else if (key == "Triangle") {
                    control.handler.setOptions({ graphics: "Triangle", featureStyle: styObj });
                }
                else if (key == "Vane") {
                    control.handler.setOptions({ graphics: "Vane", featureStyle: styObj });
                }
                else {

                }
                if (element == key) {
                    control.activate();
                }

            }
        }

        //取消矢量图形绘制控件的激活状态
        function DeactiveControlsMAS() {
            for (key in drawControlsMAS) {
                var control = drawControlsMAS[key];
                control.deactivate();
            }
            this.selectControlMAS.deactivate();
            this.selectFeatureNewMAS.deactivate();
            this.modifyConMAS.deactivate();

        }


        //修改要素大小
        function Button2MAS_onclick() {
            $("#tipsJSYA").text("改变大小操作提示：单击选中地图上已绘制出的图形，然后拖动图形上显示出的修改点即可修改图形！");
            DeactiveControlsMAS();
            modifyConMAS.activate();
            modifyConMAS.mode = OpenLayers.Control.ModifyFeature.RESHAPE;

        }

        //取消空间激活
        function Button3MAS_onclick() {
            $("#tipsJSYA").text("提示：成功注销绘制状态！");
            DeactiveControlsMAS();
        }

        //拖动要素
        function Button5MAS_onclick() {
            $("#tipsJSYA").text("拖动要素操作提示：单击选中地图上已绘制出的图形，然后拖动图形上显示出的修改点即可拖动图形！");
            DeactiveControlsMAS();
            modifyConMAS.activate();
            modifyConMAS.mode = OpenLayers.Control.ModifyFeature.DRAG;
        }

        //删除要素
        function Button7MAS_onclick() {
            $("#tipsJSYA").text("删除要素操作提示：在地图上单击已绘制的图形即可删除完成！");
            DeactiveControlsMAS();
            selectFeatureNewMAS.activate();
        }

        //弹出颜色对话框
        function OnDocumentClickMAS() {
            //srcElementMAS = event.srcElementMAS;
            var srcElementMAS = $("#fillColMAS");
            if (srcElementMAS[0].alt == "popColorDlg") {
                showColorPicker(document.getElementById('fillColMAS'), document.getElementById('fillColMAS'), funCall);
            }
        }

        /**
        * Method: funCall
        * 颜色拾取对话框回调函数，实现text的背景色修改
        * Parameters:
        * Returns:
        */
        function funCall() {
            $("#fillColMAS")[0].style.background = $("#fillColMAS")[0].value;
        }

        //修改要素的显示
        function Submit1MAS_onclick() {
            $("#tipsJSYA").text("修改风格操作提示：选择要修改的颜色或透明度，然后在地图上拉框选中要修改的图形，再在空白区域点击一下即可完成修改！");
            DeactiveControlsMAS();
            this.selectControlMAS.activate();
        }
    