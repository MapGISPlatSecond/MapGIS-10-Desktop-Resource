
var isSECheck = false;

var drawControlsSE = null; //矢量图形绘制控件数组
var pointLayerSE;          //矢量点图层
var lineLayerSE;           //矢量线图层
var polygonLayerSE;        //矢量多边形图层
var sInitColor = null;
var srcElementStyleEx= null;
function DrawSE() {
    if (!isSECheck) {
        if ($("#SEdialog").attr("id") == undefined)
            BuildSEAlert();
        else {
            $.parser.parse($("#SEdialog")); //局部重新渲染
            $("#SEdialog").dialog("open");
        }
        initSECtrl();
        isSECheck = true;
    }
    else {
        $("#SEdialog").dialog("close");
    }
}

function BuildSEAlert() {
    var sb = '<div id="SEdialog" class="easyui-dialog" title="图形样式设置" style="left:950px;top:150px;width: 295px; height: 370px;padding: 5px;overflow:hidden;" resizable="true">' +
             '<div id="toolspanelSE">'+
                   ' <div id="dialogboxSE">' +
                        '<div id="itembox" class="itembox">'+
                           ' <label for="themeType">选择要素类型：</label>'+
                            '<select id="VectorType" name="vec" style="width:80px;" >'+
                             '   <option value="polygon">多边形</option>'+
                            '    <option value="line">线</option>'+
                            '    <option value="point">点</option>'+
                          '  </select>'+
                       ' </div>'+
                       ' <div id="Div1" class="itembox">'+
                           ' 转角类型：'+
                           ' <select id="capType" name="cap">'+
                              '  <option value="butt">butt</option>'+
                             '   <option value="round">round</option>'+
                             '   <option value="square">square</option>'+
                            '</select>'+
                       ' </div>'+
                       ' <div id="Div2" class="itembox">'+
                           ' 线型：'+
                           ' <select id="LineType" name="dash">'+
                               ' <option value="dot">dot</option>'+
                               ' <option value="dash">dash</option>'+
                               ' <option value="dashdot">dashdot</option>'+
                               ' <option value="longdash">longdash</option>'+
                              '  <option value="longdashdot">longdashdot</option>'+
                               ' <option value="solid">solid</option>'+
                         '   </select>'+
                        '</div>'+
                        '<div id="Div3" class="itembox">'+
                          '  选择线颜色:<input id="linCol" type="text" size="6" onclick=\'showcolors("stroke","linCol")\' style="background-color:#FF0000" alt="clrDlgLin" value="#FF0000" readonly/>' +
                        '</div>'+
                       ' <div id="Div4" class="itembox">'+
                        '    填充颜色:<input id="fillCol" type="text" size="6" alt="clrDlgFill" onclick=\'showcolors("fill","fillCol")\' style="background-color:#FFCC00" value="#FFCC00" readonly/>' +
                        '</div>'+
                       ' <div id="Div5" class="itembox">'+
                           ' 线宽度(pix):<input id="linWid" type="text" size="6" value="2" />'+
                        '</div>'+
                      '  <div id="Div6" class="itembox">'+
                       '线透明度(0-1):<input id="linOpc" type="text" size="4" value="0.8" />'+
                       ' </div>'+
                       ' <input id="Submit2" class="functionButton" type="submit" value="开始绘制" onclick="return Submit1_onclick()" />'+
                       ' <input id="Reset2" class="functionButton" type="reset" value="结束绘制" onclick="return Reset1_onclick()" />' +
                       ' <input id="clear2" class="functionButton" type="reset" value="清除" onclick="return StyleDraw_clearEx()" />' +
                    '</div>'+
               ' </div>' +
   '   </div>';
    $("#main").append(sb);
    $("#SEdialog").dialog({ closed: false, onClose: function () { closebackStyleEx(); } });
}
function initSECtrl() {
    //添加绘制矢量点、线、多边形的矢量图层
    pointLayerSE = new OpenLayers.Layer.Vector("Point Layer");
    lineLayerSE = new OpenLayers.Layer.Vector("Line Layer");
    polygonLayerSE = new OpenLayers.Layer.Vector("Polygon Layer");

    map.addLayers([pointLayerSE, lineLayerSE, polygonLayerSE]);

    //添加图层切换以及显示鼠标位置控件
    map.addControl(new OpenLayers.Control.LayerSwitcher());
    map.addControl(new OpenLayers.Control.MousePosition());

    //添加交互绘制矢量图形的控件（点、线、多边形）
    drawControlsSE = {
        point: new OpenLayers.Control.DrawFeature(pointLayerSE,
                                OpenLayers.Handler.Point),
        line: new OpenLayers.Control.DrawFeature(lineLayerSE,
                                OpenLayers.Handler.Path),
        polygon: new OpenLayers.Control.DrawFeature(polygonLayerSE,
                                OpenLayers.Handler.Polygon)
    };

    for (var key in drawControlsSE) {
        map.addControl(drawControlsSE[key]);
    }
}

//根据当前选择的绘制选项，切换绘制矢量图形的控件
function toggleControlStyleEx(element) {
    for (key in drawControlsSE) {
        var control = drawControlsSE[key];
        if (element.value == key) {
            control.activate();
        } else {
            control.deactivate();
        }
    }
}

//修改矢量图层的样式，实现绘制不同风格的矢量图形
function Submit1_onclick() {
    var vecType = $("#VectorType")[0];
    var strokeCap = $("#capType")[0];
    var strokeDash = $("#LineType")[0];
    var linWidth = $("#linWid")[0];
    var linOpca = $("#linOpc")[0];
    var linColor = $("#linCol")[0];
    var linFillColor = $("#fillCol")[0];
    switch (vecType.value) {
        case "point":
            if (pointLayerSE != null) {
                if (strokeDash.value) {
                    pointLayerSE.styleMap.styles["default"].defaultStyle.strokeDashstyle = String(strokeDash.value);
                }
                if (linColor.value) {
                    pointLayerSE.styleMap.styles["default"].defaultStyle.strokeColor = String(linColor.value);
                }
                if (linWidth.value) {
                    pointLayerSE.styleMap.styles["default"].defaultStyle.strokeWidth = Number(linWidth.value);
                }
                if (linFillColor.value) {
                    pointLayerSE.styleMap.styles["default"].defaultStyle.fillColor = String(linFillColor.value);
                }
                if (linOpca.value) {
                    pointLayerSE.styleMap.styles["default"].defaultStyle.strokeOpacity = Number(linOpca.value);
                }
                if (strokeCap.value) {
                    pointLayerSE.styleMap.styles["default"].defaultStyle.strokeLinecap = String(strokeCap.value);
                }
                toggleControlStyleEx(vecType);
            }
            break;
        case "line":
            if (lineLayerSE != null) {
                if (strokeDash.value) {
                    lineLayerSE.styleMap.styles["default"].defaultStyle.strokeDashstyle = String(strokeDash.value);
                }
                if (linColor.value) {
                    lineLayerSE.styleMap.styles["default"].defaultStyle.strokeColor = String(linColor.value);
                }
                if (linWidth.value) {
                    lineLayerSE.styleMap.styles["default"].defaultStyle.strokeWidth = Number(linWidth.value);
                }
                if (linFillColor.value) {
                    lineLayerSE.styleMap.styles["default"].defaultStyle.fillColor = String(linFillColor.value);
                }
                if (linOpca.value) {
                    lineLayerSE.styleMap.styles["default"].defaultStyle.strokeOpacity = Number(linOpca.value);
                }
                if (strokeCap.value) {
                    lineLayerSE.styleMap.styles["default"].defaultStyle.strokeLinecap = String(strokeCap.value);
                }
                toggleControlStyleEx(vecType);
            }
            break;
        case "polygon":
            if (polygonLayerSE != null) {
                if (strokeDash.value) {
                    polygonLayerSE.styleMap.styles["default"].defaultStyle.strokeDashstyle = String(strokeDash.value);
                }
                if (linColor.value) {
                    polygonLayerSE.styleMap.styles["default"].defaultStyle.strokeColor = String(linColor.value);
                }
                if (linWidth.value) {
                    polygonLayerSE.styleMap.styles["default"].defaultStyle.strokeWidth = Number(linWidth.value);
                }
                if (linFillColor.value) {
                    polygonLayerSE.styleMap.styles["default"].defaultStyle.fillColor = String(linFillColor.value);
                }
                if (linOpca.value) {
                    polygonLayerSE.styleMap.styles["default"].defaultStyle.strokeOpacity = Number(linOpca.value);
                }
                if (strokeCap.value) {
                    polygonLayerSE.styleMap.styles["default"].defaultStyle.strokeLinecap = String(strokeCap.value);
                }
                toggleControlStyleEx(vecType);
            }
            break;
        default:
            break;
    }
}
//取消矢量图形绘制控件的激活状态
function Reset1_onclick() {
    for (key in drawControlsSE) {
        var control = drawControlsSE[key];
        control.deactivate();
    }
}
function closebackStyleEx() {
    map.removeLayer(pointLayerSE);
    map.removeLayer(lineLayerSE);
    map.removeLayer(polygonLayerSE);
    isSECheck = false;

    for (var key in drawControlsSE) {
        drawControlsSE[key].deactivate();
        map.removeControl(drawControlsSE[key]);
    }
    drawControlsSE = null; //矢量图形绘制控件数组
    pointLayerSE = null;          //矢量点图层
    lineLayerSE = null;           //矢量线图层
    polygonLayerSE = null;        //矢量多边形图层
    sInitColor = null;
    srcElementStyleEx = null;
}
var inputObjStyleEx = null;
//*设置颜色选择器
function showcolors(type, ids) {
    var o = document.getElementById(ids);
    inputObjStyleEx = o;
    showColorPicker(o, o, colorchangStyleEx);
}
function colorchangStyleEx(e) {
    inputObjStyleEx.style.background = inputObjStyleEx.value;
}

//清除绘制的图形
function StyleDraw_clearEx() {
    closebackStyleEx();
    initSECtrl();
    isSECheck = true;
}