var curResolutionTPWB = 0;   //当前地图分辨率
var curMapBoundTPWB = null;  //当前地图范围
var viewSizeTPWB = null;     //视口size(OpenLayers.Size)
var temMarkArrTPWB = null;   //存放临时的mark对象数组（3维，按照网格行列号）
var allMarkArrTPWB = new Array();   //存放所有mark的数组
var curGridStepTPWB = 0;
var imgPathTPWB = null;      //当网格范围内只有1个mark时采用的图片
var imgPathShortTPWB = null; //当网格范围内mark数(2,9)时采用的图片
var imgPathMidTPWB = null;   //当网格范围内mark数(10,49)时采用的图片
var imgPathBigTPWB = null;   //当网格范围内mark数(50,..)时采用的图片
var isClusterTPWB = false;   //是否聚合标注
var markSizeTPWB = null;
var annoLayerTPWB = null;    //动画图层
var tickNumTPWB = 0;      //触发mark移动的次数(mousedown发生时)
var pathTPWB = [];
var timeSpanTPWB = 1;
var annoMarksTPWB = null;  //存放播放动画的mark
var maxTickNumTPWB = 0;
var timeIDTPWB = 0;
var timeID2TPWB = 0;
var isMouseDownTPWB = false;
var vectorLayerTPWB = null;
var featurePntArrTPWB = [];
var style_pntTPWB = {
    strokeColor: "blue",
    fillColor: "blue",
    pointRadius: 0.8,
    strokeWidth: 0.8
};
var isPopClosedTPWB = false;
var m_timeIDTPWB = 0;
var isPopEventTPWB = false;
var popTimeIDTPWB = 0;
var delayNumTPWB = 30;
var imgTextMarkNumTPWB = 25; //自动在地图上生成多少个标注点
var ClusterStepTPWB = 200; //地图上的点间隔多少就聚合在一起

var SHADOW_Z_INDEXTPWB = 10;
var MARKER_Z_INDEXTPWB = 11;
var markLayerTPWB=null;

var mapVecStyleTPWB = new OpenLayers.StyleMap({ 'default': {
    strokeColor: "red", //#00FF00
    strokeOpacity: 1,
    strokeWidth: 6,
    fillColor: "blue", //#FF5500
    fillOpacity: 1,
    pointRadius: 0,
    pointerEvents: "visiblePainted",
    label: "${name}",  // label with \n linebreaks                    
    fontColor: "${favColor}",
    fontSize: "14px",
    fontFamily: "Vrinda", //Times New Roman
    fontWeight: "bold",
    labelOutlineColor: "",
    labelOutlineWidth: 4,
    labelXOffset: "${xOffset}",
    labelYOffset: "${yOffset}",

    externalGraphic: "lib/img/marker-green.png",
    graphicZIndex: MARKER_Z_INDEXTPWB,
    backgroundGraphicZIndex: SHADOW_Z_INDEXTPWB,
    pointRadius: 10
}
});

var m_marksSelectFeatureTPWB;
var dotsArrTPWB = new Array();
function addPointsTPWB() {
   // var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
   // renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers; 
    //在id为"map"的div层上创建一个地图容器
  
    viewSizeTPWB = map.getSize();
    curGridStepTPWB = 50; //步长50像素
    temMarkArrTPWB = new Array(Math.ceil(this.viewSizeTPWB.h / curGridStepTPWB));
    //allMarkArrTPWB = new Array();
    //按照步长划分网格，动态创建mark对象数组,向上取整获取行列数
    for (var i = 0; i < temMarkArrTPWB.length; i++) {
        temMarkArrTPWB[i] = new Array(Math.ceil(this.viewSizeTPWB.w / curGridStepTPWB));
    }
    // markLayerTPWB = new OpenLayers.Layer.Markers("聚合标注");
    markLayerTPWB = new OpenLayers.Layer.Vector("聚合标注", {
        styleMap: mapVecStyleTPWB
    });

    if (m_marksSelectFeatureTPWB==null) {
        m_marksSelectFeatureTPWB = new OpenLayers.Control.SelectFeature(markLayerTPWB, { overFeature: markMouseOverTPWB, outFeature: markMouseUp, hover: true });
        map.addControl(m_marksSelectFeatureTPWB);
    }
    imgPathTPWB = "lib/img/marker-green.png";
    imgPathShortTPWB = "lib/img/marker-green.png";
    imgPathMidTPWB = "lib/img/marker-green.png";
    imgPathBigTPWB = "lib/img/marker-gold.png";
    isClusterTPWB = false;
    randMarkTPWB();
}

function randMarkTPWB() {

    randomCreateMarkTPWB(markLayerTPWB, imgTextMarkNumTPWB, true)
    map.addLayer(markLayerTPWB);
    //clusterConfirmTPWB();
}
//随机生成1000个mark
function randomCreateMarkTPWB(mksLayer, num, isClusterTPWB) {

    curMapBoundTPWB = map.getExtent();
    var w = curMapBoundTPWB.right - curMapBoundTPWB.left;
    var h = curMapBoundTPWB.top - curMapBoundTPWB.bottom;
    if (mksLayer == null) {
        mksLayer = new OpenLayers.Layer.Vector("聚合标注", {
            styleMap: mapVecStyleTPWB
        });
        if (m_marksSelectFeatureTPWB==null) {
            m_marksSelectFeatureTPWB = new OpenLayers.Control.SelectFeature(mksLayer, { overFeature: markMouseOverTPWB, outFeature: markMouseUp, hover: true });
            map.addControl(m_marksSelectFeatureTPWB);
            m_marksSelectFeatureTPWB.activate();  
        }
        map.addLayer(annoLayerTPWB);
    }
    else {
        mksLayer.removeAllFeatures();
    }

    curResolutionTPWB = map.getResolution();
    for (var i = 0; i < num; i++) {
        var x = Math.random() * w + curMapBoundTPWB.left;
        var y = Math.random() * h + curMapBoundTPWB.bottom;
        var pos = new OpenLayers.LonLat(x, y);
        var pnt = new OpenLayers.Geometry.Point(x,y);
        var feature = new OpenLayers.Feature.Vector(pnt);
        feature.attributes = { name: "成都", favColor: "rgb(255,128,64)", xOffset: 30, yOffset: 1 };
        allMarkArrTPWB.push(feature);
    }
    mksLayer.addFeatures(allMarkArrTPWB);
}
function CancelClusterFunTPWB() {
    map.events.unregister("zoomend", null, onTPWBClusterResizeEnd);
    if (isClusterTPWB) {
        isClusterTPWB = false;
    }
    if (markLayerTPWB != null) {
        markLayerTPWB.removeAllFeatures();
        if (allMarkArrTPWB != null && allMarkArrTPWB.length > 0) {
            markLayerTPWB.addFeatures(allMarkArrTPWB);
        }
    }

    if (vectorLayerTPWB != null) {
        vectorLayerTPWB.removeAllFeatures();
    }
    if (annoLayerTPWB != null) {
        annoLayerTPWB.removeAllFeatures();
    }
}

function clusterConfirmTPWB() {
    isClusterTPWB = true;
    ClusterFunTPWB();
    map.events.unregister("zoomend", null, onTPWBClusterResizeEnd);
    map.events.register("zoomend", null, onTPWBClusterResizeEnd);
}
function onTPWBClusterResizeEnd() {
    clusterConfirmTPWB();
}
function ClusterFunTPWB() {
    clearMarkMouseUpTPWB();
    if (!isClusterTPWB) {
        return;
    }

    for (var i = 0; i < temMarkArrTPWB.length; i++) {
        if (temMarkArrTPWB[i] == null || temMarkArrTPWB[i].length <= 0) {
            continue;
        }
        for (var j = 0; j < temMarkArrTPWB[i].length; j++) {

            if (temMarkArrTPWB[i][j] == null || temMarkArrTPWB[i][j].length <= 0) {
                continue;
            }
            else {
                temMarkArrTPWB[i][j] = null;
            }
        }
    }
    curResolutionTPWB = map.getResolution();
    curMapBoundTPWB = map.getExtent();
    ClusterMarkTPWB(allMarkArrTPWB, ClusterStepTPWB);
}

function ClusterMarkTPWB(allMarks, step) {
    if (allMarks == null || allMarks.length <= 0) {
        return;
    }
    curGridStepTPWB = step;
    for (var i = 0; i < allMarks.length; i++) {
        calGridTPWB(this.map, allMarks[i], step);
    }
    if (markLayerTPWB != null) {
        markLayerTPWB.removeAllFeatures();
    }

    CreateClusterMarkTPWB(markLayerTPWB, temMarkArrTPWB);
}
/* * 
*把一个mark按照网格大小分配到具体的网格中
*Parameters:
* map：地图容器，需要该地图容器中已装载基础图层
* mark：OpenLayers.Marker
* gridStep：单位为像素，网格大小(int),网格设计为gridStep*gridStep
* 返回：true/false 
*/
function calGridTPWB(m_map, m_mark, gridStep) {

    if (m_map == null || m_map.baseLayer == null) {
        //alert("没有地图或地图中没有基础图层");
        return false;
    }

    if (m_mark == null) {
        //alert("没有mark或者该mark中不含坐标");
        return false;
    }

    if (m_mark.geometry.x < curMapBoundTPWB.left || m_mark.geometry.x > curMapBoundTPWB.right
            || m_mark.geometry.y < curMapBoundTPWB.bottom || m_mark.geometry.y > curMapBoundTPWB.top) {
        //alert("该mark没有在当前地图范围内！");
        return false;
    }

    if (gridStep > this.viewSizeTPWB.w && gridStep > this.viewSizeTPWB.h) {
        //alert("网格步长太大！");
        return false;
    }

    //计算mark在具体网格行列号
    var col; //列号
    var row; //行号

    //向下取整，行列号都是从0开始
    col = Math.floor((m_mark.geometry.x - curMapBoundTPWB.left) / (curResolutionTPWB * gridStep));
    row = Math.floor((curMapBoundTPWB.top - m_mark.geometry.y) / (curResolutionTPWB * gridStep));
    if (temMarkArrTPWB[row][col] == null) {
        temMarkArrTPWB[row][col] = new Array();
    }
    temMarkArrTPWB[row][col].push(m_mark);
    return true;
}

function markMouseOverTPWB(evt) {
    if (isClusterTPWB) {
        var temlonlat = new OpenLayers.LonLat(evt.geometry.x, evt.geometry.y);
        var col = Math.floor((temlonlat.lon - curMapBoundTPWB.left) / (curResolutionTPWB * curGridStepTPWB));
        var row = Math.floor((curMapBoundTPWB.top - temlonlat.lat) / (curResolutionTPWB * curGridStepTPWB));
        if (temMarkArrTPWB[row][col].length == 1) {
            return;
        }
        
       
        if (annoMarksTPWB != null) {
            annoMarksTPWB = null;
        }
        if (this.pathTPWB != null) {
            this.pathTPWB.splice(0, this.pathTPWB.length);  
            this.pathTPWB = null;
        }
        if (featurePntArrTPWB != null) {
            featurePntArrTPWB = null;
        }
        this.tickNumTPWB = 0;
        isMouseDownTPWB = true;
        if (temMarkArrTPWB[row][col] != null && temMarkArrTPWB[row][col].length > 0) {
            var lastPosArr = calLastMarkPosTPWB(temlonlat, temMarkArrTPWB[row][col].length, 100);
            this.pathTPWB = new Array();
            var pathEvery = getEveryPathTPWB(temlonlat, lastPosArr,200000);
            this.pathTPWB = pathEvery;
          
            if (this.pathTPWB != null && this.pathTPWB.length > 0) {
                getMaxTPWB();
            }
            if (annoMarksTPWB == null) {
                annoMarksTPWB = new Array();
            }
            else {
                for (var m = 0; m < annoMarksTPWB.length; m++) {
                    annoMarksTPWB.pop();
                }
            }
            if (featurePntArrTPWB == null) {
                featurePntArrTPWB = new Array();
            }

            if (vectorLayerTPWB == null) {
                vectorLayerTPWB = new OpenLayers.Layer.Vector("轨迹线");
                vectorLayerTPWB.setZIndex(200);
                map.addLayer(vectorLayerTPWB);
            }
            else {
                vectorLayerTPWB.removeAllFeatures();
            }
            if (annoLayerTPWB == null) {
                annoLayerTPWB = new OpenLayers.Layer.Vector("动画标注", {
                    styleMap: mapVecStyleTPWB
                });
                map.addLayer(annoLayerTPWB);
                map.raiseLayer(annoLayerTPWB, -1);
            }
            else {
                annoLayerTPWB.removeAllFeatures();
            }

            for (var i = 0; i < temMarkArrTPWB[row][col].length; i++) {
                if (temMarkArrTPWB[row][col][i] != null) {
                    var pnt = new OpenLayers.Geometry.Point(temlonlat.lon, temlonlat.lat);
                    var feature = new OpenLayers.Feature.Vector(pnt);
                    feature.attributes = { name: temMarkArrTPWB[row][col][i].attributes.name, favColor: "rgb(255,128,64)", xOffset: 30, yOffset: 1 };
                    annoLayerTPWB.addFeatures([feature]);
                    annoMarksTPWB.push(feature);
                    var nowZoomLeavel = map.getZoom();
                    var fontSizeNum = 14;
                    var markimgSrc = "lib/img/marker-green.png";
                    if (nowZoomLeavel == 0) {
                        fontSizeNum = 10;
                        markimgSrc = "lib/img/marker-green.png";
                    } else if (nowZoomLeavel == 1) {
                        fontSizeNum = 11;
                        markimgSrc = "lib/img/marker-blue.png";
                    } else if (nowZoomLeavel == 2) {
                        fontSizeNum = 12;
                        markimgSrc = "lib/img/marker-gold.png";
                    } else if (nowZoomLeavel == 3) {
                        fontSizeNum = 14;
                        markimgSrc = "lib/img/marker-green.png";
                    } else if (nowZoomLeavel == 4) {
                        fontSizeNum = 18;
                        markimgSrc = "lib/img/marker-blue.png";
                    } else if (nowZoomLeavel == 5) {
                        fontSizeNum = 22;
                        markimgSrc = "lib/img/marker-gold.png";
                    } else if (nowZoomLeavel == 6) {
                        fontSizeNum = 24;
                        markimgSrc = "lib/img/marker-green.png";
                    } else {
                        fontSizeNum = 24;
                        markimgSrc = "lib/img/marker-green.png";
                    }
                    if (annoLayerTPWB) {
                        annoLayerTPWB.styleMap.styles["default"].defaultStyle.fontSize = fontSizeNum +"px";
                        annoLayerTPWB.styleMap.styles["default"].defaultStyle.externalGraphic = markimgSrc;
                        annoLayerTPWB.redraw();
                    }
                
                }
            }
            dynaDrawMarkTPWB();

        }

    }

}
//清除地图放大缩小时动画延伸标注的setTimeout
function clearMarkMouseUpTPWB() {
    if (timeIDTPWB > 0) {
        clearTimeout(timeIDTPWB);
        timeIDTPWB = 0;
    }

    if (annoMarksTPWB == null || annoMarksTPWB.length <= 0) {
        return;
    }
    if (pathTPWB == null || pathTPWB.length <= 0) {
        return;
    }
    dynaDrawMarkReverseTPWB();
}
//鼠标移出的时候清除setTimeout
function markMouseUp(evt) {
    clearMarkMouseUpTPWB();
}  

/* * 
*Parameters:
* m_marks：OpenLayers.Layer.Markers聚合标注层
* MarkArr：网格数组，存储了网格范围内所有的mark
*/
function CreateClusterMarkTPWB(m_marks, MarkArr) {
    
    if (m_marks == null) {
        m_marks = new OpenLayers.Layer.Vector("聚合标注", {
            styleMap: mapVecStyleTPWB
        });
        if (m_marksSelectFeatureTPWB==null) {
            m_marksSelectFeatureTPWB = new OpenLayers.Control.SelectFeature(m_marks, { overFeature: markMouseOverTPWB, outFeature: markMouseUp, hover: true });
            map.addControl(m_marksSelectFeatureTPWB);
            m_marksSelectFeatureTPWB.activate();  
        }
    }
    else {
        m_marks.removeAllFeatures();
        m_marksSelectFeatureTPWB.activate();  
    }
    if (MarkArr == null || MarkArr.length <= 0) {
        alert("mark数组为空！");
        return;
    }

    var nowZoomLeavel = map.getZoom();
    var fontSizeNum = 14;
    var markimgSrc = "lib/img/marker-green.png";
    if (nowZoomLeavel == 0) {
        fontSizeNum = 10;
        markimgSrc = "lib/img/marker-green.png";
    } else if (nowZoomLeavel == 1) {
        fontSizeNum = 11;
        markimgSrc = "lib/img/marker-blue.png";
    } else if (nowZoomLeavel == 2) {
        fontSizeNum = 12;
        markimgSrc = "lib/img/marker-gold.png";
    } else if (nowZoomLeavel == 3) {
        fontSizeNum = 14;
        markimgSrc = "lib/img/marker-green.png";
    } else if (nowZoomLeavel == 4) {
        fontSizeNum = 18;
        markimgSrc = "lib/img/marker-blue.png";
    } else if (nowZoomLeavel == 5) {
        fontSizeNum = 22;
        markimgSrc = "lib/img/marker-gold.png";
    } else if (nowZoomLeavel == 6) {
        fontSizeNum = 24;
        markimgSrc = "lib/img/marker-green.png";
    } else {
        fontSizeNum = 24;
        markimgSrc = "lib/img/marker-green.png";
    }
    if (m_marks) {
        m_marks.styleMap.styles["default"].defaultStyle.fontSize = fontSizeNum + "px";
        m_marks.styleMap.styles["default"].defaultStyle.externalGraphic = markimgSrc;
       // m_marks.redraw();
    }


    for (var i = 0; i < MarkArr.length; i++) {
        if (MarkArr[i] == null || MarkArr[i].length <= 0) {
            continue;
        }
        for (var j = 0; j < MarkArr[i].length; j++) {

            if (MarkArr[i][j] == null || MarkArr[i][j].length <= 0) {
                continue;
            }
            for (var k = 0; k < MarkArr[i][j].length; k++) {
                //随机选择一个mark，获取其地图位置
                var m_index = Math.floor(Math.random() * MarkArr[i][j].length);
                //创建一个mark
                var marker = null;
               
                if (MarkArr[i][j].length == 1) {
                    var pnt = new OpenLayers.Geometry.Point(MarkArr[i][j][0].geometry.x, MarkArr[i][j][0].geometry.y); 
                    var feature = new OpenLayers.Feature.Vector(pnt);
                    feature.attributes = { name: MarkArr[i][j][k].attributes.name, favColor: "rgb(255,128,64)", xOffset: 30, yOffset: 1 };
                    m_marks.addFeatures([feature]);
                   
                }
               
                else if (MarkArr[i][j].length > 1 && MarkArr[i][j].length < 10) {
          
                    var pnt = new OpenLayers.Geometry.Point(MarkArr[i][j][m_index].geometry.x, MarkArr[i][j][m_index].geometry.y);
                    var feature = new OpenLayers.Feature.Vector(pnt);
                    feature.attributes = { name: MarkArr[i][j].length.toString(), favColor: "rgb(255,128,64)", xOffset: 30, yOffset: 1 };
                    m_marks.addFeatures([feature]);

                }
                else if (MarkArr[i][j].length >= 10 && MarkArr[i][j].length < 50) {
 
                    var pnt = new OpenLayers.Geometry.Point(MarkArr[i][j][m_index].geometry.x, MarkArr[i][j][m_index].geometry.y);
                    var feature = new OpenLayers.Feature.Vector(pnt);
                    feature.attributes = { name: MarkArr[i][j].length.toString(), favColor: "rgb(255,128,64)", xOffset: 30, yOffset: 1 };
                    m_marks.addFeatures([feature]);
                }
                else {
                    var pnt = new OpenLayers.Geometry.Point(MarkArr[i][j][m_index].geometry.x, MarkArr[i][j][m_index].geometry.y);
                    var feature = new OpenLayers.Feature.Vector(pnt);
                    feature.attributes = { name: MarkArr[i][j].length.toString(), favColor: "rgb(255,128,64)", xOffset: 30, yOffset: 1 };
                    m_marks.addFeatures([feature]);
                }
                m_marks.addFeatures([feature]);
                break;

            }
        }
    }
}
function getMaxTPWB() {
    maxTickNumTPWB = 0;
    if (this.pathTPWB == null) {
        return 0;
    }
    for (var i = 0; i < this.pathTPWB.length; i++) {
        if (this.pathTPWB[i] != null) {
            (maxTickNumTPWB < this.pathTPWB[i].length) ? (maxTickNumTPWB = this.pathTPWB[i].length) : (maxTickNumTPWB = maxTickNumTPWB);
        }
    }
    return maxTickNumTPWB;
}
/* * 
*通过时钟控制绘制mark动画
*Parameters:
*/
function dynaDrawMarkTPWB() {
    if (!isMouseDownTPWB) {
        clearTimeout(timeIDTPWB);
    }
    if (this.tickNumTPWB >= maxTickNumTPWB) {
        clearTimeout(timeIDTPWB);
        return;
    }
    if (this.pathTPWB == null) {
        return;
    }

    for (var i = 0; i < this.pathTPWB.length; i++) {
        if (this.pathTPWB[i] == null || this.pathTPWB[i].length <= 0) {
            continue;
        }
        if (this.pathTPWB[i][this.tickNumTPWB] == null) {
            continue;
        }
        var temPix = this.map.getLayerPxFromLonLat(this.pathTPWB[i][this.tickNumTPWB]);
        if (annoMarksTPWB[i] != null) {
            annoMarksTPWB[i].move(this.pathTPWB[i][this.tickNumTPWB]);
            var newPoint = new OpenLayers.Geometry.Point(this.pathTPWB[i][this.tickNumTPWB].lon, this.pathTPWB[i][this.tickNumTPWB].lat);
            var pntFeature = new OpenLayers.Feature.Vector(newPoint, null, style_pntTPWB);
            vectorLayerTPWB.addFeatures([pntFeature]);
            if (featurePntArrTPWB == null) {
                featurePntArrTPWB = new Array();
            }
            if (featurePntArrTPWB[i] == null) {
                featurePntArrTPWB[i] = new Array();
            }
            featurePntArrTPWB[i].push(pntFeature);
        }
    }
    this.tickNumTPWB++;
    timeIDTPWB = setTimeout(this.dynaDrawMarkTPWB, this.timeSpanTPWB);
}

function dynaDrawMarkReverseTPWB() {
    if (this.tickNumTPWB <= 0) {
        if (timeID2TPWB > 0) {
            clearTimeout(timeID2TPWB);
            timeID2TPWB = 0;
        }
        return;
    }
    if (this.pathTPWB == null) {
        return;
    }

    if (annoLayerTPWB != null) {
        annoLayerTPWB.removeFeatures(annoMarksTPWB);
    }
    for (var i = 0; i < this.pathTPWB.length; i++) {
        if (vectorLayerTPWB != null) {
            vectorLayerTPWB.removeFeatures(featurePntArrTPWB[i]);
        }
    }
    this.tickNumTPWB = 0;
}
/* * 
*根据聚合mark的位置及每个mark最终的位置离散化成路径
*Parameters:
* dot{OpenLayers.LonLat}聚合mark的坐标
* dotArr：dotArr {array(OpenLayers.LonLat)}，每个mark的最终位置
* step：歩长，单位为地图单位
* 返回：pathArr {array(OpenLayers.LonLat)}
*/
function getEveryPathTPWB(dot, dotArr, step) {
    var temDots = [];

    temDots.push(dot);
    for (var i = 0; i < dotArr.length; i++) {
        temDots.push(dotArr[i]);
        var path_i = disperseToDotsTPWB(temDots, step);
        if (pathTPWB == null) {
            pathTPWB = new Array();
        }
        pathTPWB.push(path_i);
        temDots.pop();
    }
    return pathTPWB;
}
/* * 
*根据聚合mark的位置计算出散开以后各个mark的最终位置
*Parameters:
* dot{OpenLayers.LonLat}聚合mark的坐标
* n：该mark共聚合的数量
* len：聚合mark散开的半径长度(OpenLayers.Pixel)
* 返回：dotArr {array(OpenLayers.LonLat)}
*/
function calLastMarkPosTPWB(dot, n, len) {
    var temLen = map.getResolution() * len;
    var dotArr = [];
    for (var i = 0; i < n; i++) {
        var temDot = new OpenLayers.LonLat();
        temDot.lon = dot.lon + Math.cos(360 * Math.PI * i / (n * 180)) * temLen;
        temDot.lat = dot.lat + Math.sin(360 * Math.PI * i / (n * 180)) * temLen;
        dotArr.push(temDot);
    }
    return dotArr;
}
/* * 
*把轨迹解析得到的坐标序列进行序列化处理
*Parameters:
* dots{array(OpenLayers.LonLat)}根据轨迹线解析得到坐标序列
* step：歩长，单位为地图单位
* 返回：temDotArr {array(OpenLayers.LonLat)}
*/
function disperseToDotsTPWB(dots, step) {
    if (dots == null && dots.length <= 0) {
        return null;
    }
    //            var dotNum = 0;
    var offx = 0;  //x方向的偏移值
    var offy = 0;  //y方向的偏移值
    var rate = 0;  //两点之间连线于X轴正向的斜率
    var temDotArr = [];
    for (var i = 0; i < dots.length - 1; i++) {
        rate = (dots[i + 1].lat - dots[i].lat) / dots[i + 1].lon - dots[i].lon;
        var dotDis = Math.sqrt(Math.pow(dots[i + 1].lon - dots[i].lon, 2) + Math.pow(dots[i + 1].lat - dots[i].lat, 2));
        offx = (dots[i + 1].lon - dots[i].lon) * step / dotDis;
        offy = (dots[i + 1].lat - dots[i].lat) * step / dotDis;
        if (i == 0) {
            temDotArr[0] = dots[0];
        }

        var temDis = Math.sqrt(Math.pow(dots[i + 1].lon - temDotArr[temDotArr.length - 1].lon, 2) + Math.pow(dots[i + 1].lat - temDotArr[temDotArr.length - 1].lat, 2));
        while (temDis > step) {
            var temDot = new OpenLayers.LonLat();
            temDot.lon = temDotArr[temDotArr.length - 1].lon + offx;
            temDot.lat = temDotArr[temDotArr.length - 1].lat + offy;
            temDotArr.push(temDot);
            temDis = Math.sqrt(Math.pow(dots[i + 1].lon - temDotArr[temDotArr.length - 1].lon, 2) + Math.pow(dots[i + 1].lat - temDotArr[temDotArr.length - 1].lat, 2));
        }
    }
    return temDotArr;
}
function PauseTPWB(obj, iMinSecond) {
    if (window.eventList == null) window.eventList = new Array();
    var ind = -1;
    for (var i = 0; i < window.eventList.length; i++) {
        if (window.eventList[i] == null) {
            window.eventList[i] = obj;
            ind = i;
            break;
        }
    }
    if (ind == -1) {
        ind = window.eventList.length;
        window.eventList[ind] = obj;
    }
    setTimeout("GoOnTPWB(" + ind + ")", iMinSecond);
}

function GoOnTPWB(ind) {
    var obj = window.eventList[ind];
    window.eventList[ind] = null;
    if (obj.NextStep) obj.NextStep();
    else obj();
}

function clearTextImgMarkTPWB() {
    CancelClusterFunTPWB();
    if (m_marksSelectFeatureTPWB) {
        map.removeControl(m_marksSelectFeatureTPWB);
        m_marksSelectFeatureTPWB = null;
    }
    if (annoLayerTPWB != null) {
        annoLayerTPWB.removeAllFeatures();
        map.removeLayer(annoLayerTPWB);
        annoLayerTPWB = null;
    }
    if (markLayerTPWB != null) {
        markLayerTPWB.removeAllFeatures();
        map.removeLayer(markLayerTPWB);
        markLayerTPWB = null;
    }
    if (vectorLayerTPWB != null) {
        vectorLayerTPWB.removeAllFeatures();
        map.removeLayer(vectorLayerTPWB);
        vectorLayerTPWB = null;
    }
    isClusterTPWB = false
    featurePntArrTPWB = null;
    temMarkArrTPWB = null;
    tickNumTPWB = 0;
    pathTPWB = [];
    timeSpanTPWB = 1;
    annoMarksTPWB = null;  //存放播放动画的mark
    allMarkArrTPWB = [];
    maxTickNumTPWB = 0;
    timeIDTPWB = 0;
    timeID2TPWB = 0;
    isMouseDownTPWB = false;
    vectorLayerTPWB = null;
    featurePntArrTPWB = [];
    isPopClosedTPWB = false;
     m_timeIDTPWB = 0;
    isPopEventTPWB = false;
    popTimeIDTPWB = 0;
    delayNumTPWB = 30;
    dotsArrTPWB = new Array();
}