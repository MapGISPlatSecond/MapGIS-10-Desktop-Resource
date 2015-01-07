
var markLayerMaC = null;    //标注图层
var curResolution = 0;   //当前地图分辨率
var curMapBound = null;  //当前地图范围
var viewSize_loc1 = null;     //视口size(OpenLayers.Size)
var temMarkArr = null;   //存放临时的mark对象数组（3维，按照网格行列号）
var allMarkArr = null;   //存放所有mark的数组
var curGridStep = 0;
var imgPath = null;      //当网格范围内只有1个mark时采用的图片
var imgPathShort = null; //当网格范围内mark数(2,9)时采用的图片
var imgPathMid = null;   //当网格范围内mark数(10,49)时采用的图片
var imgPathBig = null;   //当网格范围内mark数(50,..)时采用的图片
var isCluster = false;   //是否聚合标注
var markSize = null;
var annoLayer_loc1 = null;    //动画图层
var tickNum_loc1 = 0;      //触发mark移动的次数(mousedown发生时)
var path_loc1 = [];
var timeSpan_loc1 = 5;
var annoMarks_loc1 = null;  //存放播放动画的mark
var maxTickNum = 0;
var timeID = 0;
var timeID2 = 0;
var isMouseDown = false;
var vectorLayerMaC = null;
var featurePntArr = [];
var style_pnt = {
    strokeColor: "blue",
    fillColor: "blue",
    pointRadius: 0.8,
    strokeWidth: 0.8
};
var isPopClosed = false;
var m_timeID = 0;
var isPopEvent = false;
var popTimeID = 0;
var delayNum = 30;
function initMaC() {
    viewSize_loc1 = map.getSize();
    curGridStep = 50; //步长50像素
    temMarkArr = new Array(Math.ceil(this.viewSize_loc1.h / curGridStep));
    allMarkArr = new Array();
    //按照步长划分网格，动态创建mark对象数组,向上取整获取行列数
    for (var i = 0; i < temMarkArr.length; i++) {
        temMarkArr[i] = new Array(Math.ceil(this.viewSize_loc1.w / curGridStep));
    }
   // markLayerMaC = new OpenLayers.Layer.Markers("聚合标注1");
    imgPath = "$$tools$$/" + toolIdMaC + "/img/flashpoint.gif";
    imgPathShort = "$$tools$$/" + toolIdMaC + "/img/blue.png";
    imgPathMid = "$$tools$$/" + toolIdMaC + "/img/green.png";
    imgPathBig = "$$tools$$/" + toolIdMaC + "/img/red2.png";
    isCluster = false;
    delayNum = 30;
}

function randMark() {
    clearJHBZ();
    randomCreateMark(100, true);
}
//随机生成1000个mark
function randomCreateMark(num, isCluster) {
    curMapBound = map.getExtent();
    var w = curMapBound.right - curMapBound.left;
    var h = curMapBound.top - curMapBound.bottom;
    if (markLayerMaC == null) {
        markLayerMaC = new OpenLayers.Layer.Markers("聚合标注1");
        map.addLayer(markLayerMaC);
    }
    else {
        markLayerMaC.clearMarkers();
    }
    curResolution = map.getResolution();
    for (var i = 0; i < num; i++) {
        var x = Math.random() * w + curMapBound.left;
        var y = Math.random() * h + curMapBound.bottom;
        var pos = new OpenLayers.LonLat(x,y);
        var icon = new OpenLayers.Icon(this.imgPath);
        var mk = new OpenLayers.Marker(pos,icon);
        allMarkArr.push(mk);
        markLayerMaC.addMarker(mk);
    }
}
function CancelClusterFun() {
    map.events.unregister("zoomend", null, onJHBZResizeEnd);
    if (isCluster) {
        isCluster = false;
    }
    if (map != null && map.popups != null && map.popups.length > 0) {
        for (var i = 0; i < map.popups.length; i++) {
            map.removePopup(map.popups[i]);
        }
    }
    if (markLayerMaC != null) {
        markLayerMaC.clearMarkers();
        if (allMarkArr != null && allMarkArr.length > 0) {
            for (var i = 0; i < allMarkArr.length; i++) {
                markLayerMaC.addMarker(allMarkArr[i]);
            }
        }
    }
}
function moveallMcA() {
    if (vectorLayerMaC != null) {
        vectorLayerMaC.removeAllFeatures();
        map.removeLayer(vectorLayerMaC);
        vectorLayerMaC = null;
    }
    if (annoLayer_loc1 != null) {
        annoLayer_loc1.clearMarkers();
        map.removeLayer(annoLayer_loc1);
        annoLayer_loc1 = null;
    }
    if (markLayerMaC != null) {
         markLayerMaC.clearMarkers();
         map.removeLayer(markLayerMaC);
         markLayerMaC = null;
    }
    allMarkArr = [];
}

function clusterConfirm() {
    isCluster = true;
    ClusterFun();
}
function ClusterFun() {
    if (!isCluster) {
        return;
    }

    for (var i = 0; i < temMarkArr.length; i++) {
        if (temMarkArr[i] == null || temMarkArr[i].length <= 0) {
            continue;
        }
        for (var j = 0; j < temMarkArr[i].length; j++) {

            if (temMarkArr[i][j] == null || temMarkArr[i][j].length <= 0) {
                continue;
            }
            else {
                temMarkArr[i][j] = null;
            }
        }
    }
    curResolution = map.getResolution();
    curMapBound = map.getExtent();
    ClusterMark(allMarkArr, 100);
}

function ClusterMark(allMarks, step) {
    if (allMarks == null || allMarks.length <= 0) {
        return;
    }
    curGridStep = step;
    for (var i = 0; i < allMarks.length; i++) {
        calGrid(this.map, allMarks[i], step);
    }
    if (markLayerMaC != null) {
        markLayerMaC.clearMarkers();
    }

    CreateClusterMark(markLayerMaC, temMarkArr);
}

/* * 
*把一个mark按照网格大小分配到具体的网格中
*Parameters:
* map：地图容器，需要该地图容器中已装载基础图层
* mark：OpenLayers.Marker
* gridStep：单位为像素，网格大小(int),网格设计为gridStep*gridStep
* 返回：true/false 
*/
function calGrid(m_map, m_mark, gridStep) {

    if (m_map == null || m_map.baseLayer == null) {
        //alert("没有地图或地图中没有基础图层");
        return false;
    }

    if (m_mark == null || m_mark.lonlat == null) {
        //alert("没有mark或者该mark中不含坐标");
        return false;
    }

    if (m_mark.lonlat.lon < curMapBound.left || m_mark.lonlat.lon > curMapBound.right
            || m_mark.lonlat.lat < curMapBound.bottom || m_mark.lonlat.lat > curMapBound.top) {
        //alert("该mark没有在当前地图范围内！");
        return false;
    }

    if (gridStep > this.viewSize_loc1.w && gridStep > this.viewSize_loc1.h) {
        //alert("网格步长太大！");
        return false;
    }

    //计算mark在具体网格行列号
    var col; //列号
    var row; //行号

    //向下取整，行列号都是从0开始
    col = Math.floor((m_mark.lonlat.lon - curMapBound.left) / (curResolution * gridStep));
    row = Math.floor((curMapBound.top - m_mark.lonlat.lat) / (curResolution * gridStep));
    if (temMarkArr[row][col] == null) {
        temMarkArr[row][col] = new Array();
    }
    temMarkArr[row][col].push(m_mark);
    return true;
}
function markMouseDown(evt) {

    if (isCluster) {
        var temlonlat = evt.object.lonlat;
        var col = Math.floor((temlonlat.lon - curMapBound.left) / (curResolution * curGridStep));
        var row = Math.floor((curMapBound.top - temlonlat.lat) / (curResolution * curGridStep));
        if (annoMarks_loc1 != null) {
            annoMarks_loc1 = null;
        }
        if (this.path_loc1 != null) {
            this.path_loc1 = null;
        }
        if (featurePntArr != null) {
            featurePntArr = null;
        }
        this.tickNum_loc1 = 0;
        isMouseDown = true;



        if (temMarkArr[row][col] != null && temMarkArr[row][col].length > 0) {
            var lastPosArr = calLastMarkPos(temlonlat, temMarkArr[row][col].length, 100);
            getEveryPath(temlonlat, lastPosArr, 150000);
            if (this.path_loc1 != null && this.path_loc1.length > 0) {
                getMax();
            }
            if (annoMarks_loc1 == null) {
                annoMarks_loc1 = new Array();
            }
            else {
                //annoMarks_loc1.slice(0);
                for (var m = 0; m < annoMarks_loc1.length; m++) {
                    annoMarks_loc1.pop();
                }
            }
            if (featurePntArr == null) {
                featurePntArr = new Array();
            }

            if (vectorLayerMaC == null) {
                vectorLayerMaC = new OpenLayers.Layer.Vector("轨迹线1");
                vectorLayerMaC.setZIndex(200);
                map.addLayer(vectorLayerMaC);
                map.raiseLayer(vectorLayerMaC, -1);
            }
            else {
                vectorLayerMaC.removeAllFeatures();
            }
            if (annoLayer_loc1 == null) {
                annoLayer_loc1 = new OpenLayers.Layer.Markers("动画标注1");
                map.addLayer(annoLayer_loc1);
            }
            else {
                annoLayer_loc1.clearMarkers();
            }
            for (var i = 0; i < temMarkArr[row][col].length; i++) {
                if (temMarkArr[row][col][i] != null) {

                    var marker = new OpenLayers.Marker(temlonlat, temMarkArr[row][col][i].icon);
                    marker.events.on({
                        "mousedown": markMouseDownNew,
                        scope: this
                    });
                    annoMarks_loc1.push(marker);
                    annoLayer_loc1.addMarker(marker);
                }
            }

            dynaDrawMark();

        }

    }

}
function markMouseDownNew(evt) {
    //添加popup    
    if (evt.object == null) {
        return;
    }
    var m_map = evt.object.map;
    if (m_map != null) {

        if (m_map.popups != null && m_map.popups.length > 0) {
            for (var i = 0; i < m_map.popups.length; i++) {
                m_map.removePopup(m_map.popups[i]);
            }
        }
//        popup = new OpenLayers.Popup("chicken", evt.object.lonlat,new OpenLayers.Size(50, 50),"aaaa", true, callBackPop);
//        m_map.addPopup(popup);
        isPopEvent = true;
    }

}
function callBackPop() {

    isPopClosed = true;
    if (map.popups != null && map.popups.length > 0) {
        for (var i = 0; i < map.popups.length; i++) {
            map.removePopup(map.popups[i]);
        }
    }
    dynaDrawMarkReverse();
   
}
function markMouseUpJHBZ(evt) {
    if (timeID > 0) {
        clearTimeout(timeID);
        timeID = 0;
    }

    if (annoMarks_loc1 == null || annoMarks_loc1.length <= 0) {
        return;
    }
    if (path_loc1 == null || path_loc1.length <= 0) {
        return;
    }
       dynaDrawMarkReverse();
}  
function isClosePopup() {
    if (isPopClosed) {
        dynaDrawMarkReverse()
        isPopEvent = false;
        if (m_timeID > 0) {
            clearTimeout(m_timeID);
            m_timeID = 0;
        }
    } 
    m_timeID = setTimeout(isClosePopup, 20);
}
/* * 
*Parameters:
* m_marks：OpenLayers.Layer.Markers聚合标注层
* MarkArr：网格数组，存储了网格范围内所有的mark
*/
function CreateClusterMark(m_marks, MarkArr) {

    if (m_marks == null) {
        m_marks = new OpenLayers.Layer.Markers("聚合标注1");
    }
    else {
        m_marks.clearMarkers();
    }
    if (MarkArr == null || MarkArr.length <= 0) {
        alert("mark数组为空！");
        return;
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
                    var icon = null;
                    icon = new OpenLayers.Icon(this.imgPath);
                    marker = new OpenLayers.Marker(MarkArr[i][j][0].lonlat, icon);
                    m_marks.addMarker(marker);
                }
               
                else if (MarkArr[i][j].length > 1 && MarkArr[i][j].length < 10) {
                    var iconS = null;
                    iconS = new OpenLayers.Icon(imgPathShort);
                    iconS.imageDiv.innerHTML += "<b>" + MarkArr[i][j].length.toString() + "</b>";
                    marker = new OpenLayers.Marker(MarkArr[i][j][m_index].lonlat, iconS);
                    marker.events.on({
                        "mousedown": markMouseDown,
                        "mouseup": markMouseUpJHBZ,
                       // "mouseout":markMouseOut,
                        scope: this
                    });
                    m_marks.addMarker(marker);

                }
                else if (MarkArr[i][j].length >= 10 && MarkArr[i][j].length < 50) {
                    var iconM = null;
                    iconM = new OpenLayers.Icon(imgPathMid);
                    iconM.imageDiv.innerHTML += "<b>" + MarkArr[i][j].length.toString() + "</b>";
                    marker = new OpenLayers.Marker(MarkArr[i][j][m_index].lonlat, iconM);
                    marker.events.on({
                        "mousedown": markMouseDown,
                        "mouseup": markMouseUpJHBZ,
                        //"mouseout": markMouseOut,
                        scope: this
                    });
                    m_marks.addMarker(marker);
                }
                else {
                    var iconB = null;
                    iconB = new OpenLayers.Icon(imgPathBig);
                    iconB.imageDiv.innerHTML += "<b>" + MarkArr[i][j].length.toString() + "</b>";
                    marker = new OpenLayers.Marker(MarkArr[i][j][m_index].lonlat, iconB);
                    marker.events.on({
                        "mousedown": markMouseDown,
                        "mouseup": markMouseUpJHBZ,
                        //"mouseout": markMouseOut,
                        scope: this
                    });
                    m_marks.addMarker(marker);
                }
                m_marks.addMarker(marker);
                break;

            }
        }
    }
}
function markMouseOut(evt) {

}
function getMax() {
    maxTickNum = 0;
    if (this.path_loc1 == null) {
        return 0;
    }
    for (var i = 0; i < this.path_loc1.length; i++) {
        if (this.path_loc1[i] != null) {
            (maxTickNum < this.path_loc1[i].length) ? (maxTickNum = this.path_loc1[i].length) : (maxTickNum = maxTickNum);
        }
    }
    return maxTickNum;
}
/* * 
*通过时钟控制绘制mark动画
*Parameters:
*/
function dynaDrawMark() {
    if (!isMouseDown) {
        clearTimeout(timeID);
    }
    if (this.tickNum_loc1 >= maxTickNum) {

        clearTimeout(timeID);
        return;
    }
    if (this.path_loc1 == null) {
        return;
    }

    for (var i = 0; i < this.path_loc1.length; i++) {
        if (this.path_loc1[i] == null || this.path_loc1[i].length <= 0) {
            continue;
        }
        if (this.path_loc1[i][this.tickNum_loc1] == null) {
            continue;
        }
        var temPix = this.map.getLayerPxFromLonLat(this.path_loc1[i][this.tickNum_loc1]);
        if (annoMarks_loc1[i] != null) {
            annoMarks_loc1[i].moveTo(temPix);
            var newPoint = new OpenLayers.Geometry.Point(annoMarks_loc1[i].lonlat.lon, annoMarks_loc1[i].lonlat.lat);
            var pntFeature = new OpenLayers.Feature.Vector(newPoint, null, style_pnt);
            vectorLayerMaC.addFeatures([pntFeature]);
            if (featurePntArr == null) {
                featurePntArr = new Array();
            }
            if (featurePntArr[i] == null) {
                featurePntArr[i] = new Array();
            }
            featurePntArr[i].push(pntFeature);
        }
    }
    this.tickNum_loc1++;
    timeID = setTimeout(this.dynaDrawMark, this.timeSpan_loc1);
}

function dynaDrawMarkReverse() {
    if (this.tickNum_loc1 <= 0) {
        if (timeID2 > 0) {
            clearTimeout(timeID2);
            timeID2 = 0;
        }
        return;
    }
    if (this.path_loc1 == null) {
        return;
    }

    for (var i = 0; i < this.path_loc1.length; i++) {
        if (this.path_loc1[i] == null || this.path_loc1[i].length <= 0) {
            continue;
        }
        if (this.path_loc1[i][this.tickNum_loc1] == null) {
            continue;
        }
        if (this.tickNum_loc1 == 1) {
            if (annoLayer_loc1 != null) {
                annoLayer_loc1.removeMarker(annoMarks_loc1[i]);
            }
            if (vectorLayerMaC != null) {
                vectorLayerMaC.removeFeatures(featurePntArr[i]);
            }
            
            continue;
        }

        var temPix = this.map.getLayerPxFromLonLat(this.path_loc1[i][this.tickNum_loc1 - 1]);
        if (annoMarks_loc1[i] != null) {
            annoMarks_loc1[i].moveTo(temPix);
        }
        if (featurePntArr[i] != null) {
            if (featurePntArr[i][this.tickNum_loc1] != null) {
                vectorLayerMaC.removeFeatures([featurePntArr[i][this.tickNum_loc1]]);
            }
        }


    }
    this.tickNum_loc1--;
    timeID2 = setTimeout(this.dynaDrawMarkReverse, this.timeSpan_loc1);
}
/* * 
*根据聚合mark的位置及每个mark最终的位置离散化成路径
*Parameters:
* dot{OpenLayers.LonLat}聚合mark的坐标
* dotArr：dotArr {array(OpenLayers.LonLat)}，每个mark的最终位置
* step：歩长，单位为地图单位
* 返回：pathArr {array(OpenLayers.LonLat)}
*/
function getEveryPath(dot, dotArr, step) {
    var temDots = [];

    temDots.push(dot);
    for (var i = 0; i < dotArr.length; i++) {
        temDots.push(dotArr[i]);
        var path_i = disperseToDots(temDots, step);
        if (path_loc1 == null) {
            path_loc1 = new Array();
        }
        path_loc1.push(path_i);
        temDots.pop();
    }
    return path_loc1;
}
/* * 
*根据聚合mark的位置计算出散开以后各个mark的最终位置
*Parameters:
* dot{OpenLayers.LonLat}聚合mark的坐标
* n：该mark共聚合的数量
* len：聚合mark散开的半径长度(OpenLayers.Pixel)
* 返回：dotArr {array(OpenLayers.LonLat)}
*/
function calLastMarkPos(dot, n, len) {
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
function disperseToDots(dots, step) {
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
            //                    dotNum++;

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
function Pause(obj, iMinSecond) {
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
    setTimeout("GoOn(" + ind + ")", iMinSecond);
}

function GoOn(ind) {
    var obj = window.eventList[ind];
    window.eventList[ind] = null;
    if (obj.NextStep) obj.NextStep();
    else obj();
}  