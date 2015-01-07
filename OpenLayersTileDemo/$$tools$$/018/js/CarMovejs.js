var marksCM = null;     //mark图层
var dotArrCM = [];      //存储路径的dot数组
var temDotArrCM = [];   //存储离散化路径的dot数组
var angleArrCM = [];    //存储路径中各段的角度，以平面直角x轴正轴方向为0,顺时针为正
var dotNumArrCM = [];   //存储路径中各段点的个数
var orginAngleCM = 0;   //以平面直角x轴正轴方向为0,顺时针为正
var isMoveCM = false;   //标志位：地图是否随小车移动
var ImagePathCM = "$$tools$$/"+toolIDCM+"/img/car.png";  //小车图片路径
var tickNumCM = 0;      //触发小车移动的次数
var timeSpanCM = 0;     //触发小车移动的时间间隔
var mSizeCM = null;     //ICON.size（图片的大小,单位像素）
var isCMCheck = false;
var CarMarker = null;   //小车的标注Mark
var timeoutLJZZ = null;
var isStopOrStartCarFlag = false;//判断是否暂停


function DrawCM() {
    if (!isCMCheck) {

        if ($("#CMMdialog").attr("id") == undefined)
            BuildCMAlert();
        else {
            $.parser.parse($("#CMMdialog")); //局部重新渲染
            $("#CMMdialog").dialog("open");
        }
        initCMCtrl();
        isCMCheck = true;
    }
    else {
      //  closeCM();
        $("#CMMdialog").dialog("close");
       
    }
    $('#MarkCarLJZZ1').attr("disabled", false);
    $('#MarkCarLJZZ2').attr("disabled", true);
    $('#MarkCarLJZZ3').attr("disabled", true);
    $('#MarkCarLJZZ4').attr("disabled", true);
}
function BuildCMAlert() {
    var sb = '<div id="CMMdialog" class="easyui-dialog" title="轨迹回放" style="left:900px;top:300px;width:240px; height: 140px;overflow:hidden" resizable="true">'
        		+ '<div id="LJZZDialog">'
                  + '<button style= "border:1px dashed gray;width:90px;" class="functionButton" id="MarkCarLJZZ1" onclick=\'drawLinCM()\'>添加线路</button>'
                  + '<button style= "border:1px dashed gray;width:90px;" class="functionButton" id="MarkCarLJZZ2"  onclick=\'drawCarCM()\'>轨迹回放</button>'
                  + '<button style= "border:1px dashed gray;width:90px;" class="functionButton" id="MarkCarLJZZ3"   onclick=\'stopStartCarMove()\'>暂停/播放</button>'
                  + '<button style= "border:1px dashed gray;width:90px;" class="functionButton" id="MarkCarLJZZ4"   onclick=\'clearCarMoveLJZZ()\'>清除</button>'
                + '</div>' +
   '   </div>';

    $("#main").append(sb);
    $("#CMMdialog").dialog({
        closed: false,
        onClose: function () {
            closeCM();
        }
    });
    $('#MarkCarLJZZ1').attr("disabled", false);
    $('#MarkCarLJZZ2').attr("disabled", true);
    $('#MarkCarLJZZ3').attr("disabled", true);
    $('#MarkCarLJZZ4').attr("disabled", true);
}
//暂停和播放动画
function stopStartCarMove() {
    $('#MarkCarLJZZ1').attr("disabled", true);
    $('#MarkCarLJZZ2').attr("disabled", true);
    $('#MarkCarLJZZ3').attr("disabled", false);
    $('#MarkCarLJZZ4').attr("disabled", false);
    if (isStopOrStartCarFlag==false) {
        if (timeoutLJZZ != null) {
            clearTimeout(timeoutLJZZ);
            timeoutLJZZ = null;
            isStopOrStartCarFlag = true;
        }
    } else {
        if (timeoutLJZZ==null) {
            timeoutLJZZ = setTimeout(this.dynaDrawCarCM, this.timeSpanCM);
            isStopOrStartCarFlag = false;
        } 
    }
}
//清除路径和小车
function clearCarMoveLJZZ() {
    $('#MarkCarLJZZ1').attr("disabled", false);
    $('#MarkCarLJZZ2').attr("disabled", true);
    $('#MarkCarLJZZ3').attr("disabled", true);
    $('#MarkCarLJZZ4').attr("disabled", true);
    closeCM();
    isCMCheck = true ;
}

function closeCM() {
    if (timeoutLJZZ != null) {
        clearTimeout(timeoutLJZZ);
        timeoutLJZZ = null;
    }
    isCMCheck = false;
    var layers = map.getLayersByName("路径追踪轨迹线");
    if (layers != null && layers.length > 0) {
        for (var i = 0; i < layers.length; i++) {
            map.removeLayer(layers[i]);
        }
    }
    if (CarMarker) {
        if (marksCM) {
            marksCM.removeMarker(CarMarker);
            CarMarker = null;
        }
    }

    if (marksCM != null) {
        map.removeLayer(marksCM);
        marksCM = null;
    }
    isStopOrStartCarFlag = false;
}
function initCMCtrl() {
    //设置地图中心
    map.setCenter(new OpenLayers.LonLat(2194370.3211515, 2157588.3421518), 3);
}

//绘制路径的响应事件
function drawLinCM() {
    $('#MarkCarLJZZ1').attr("disabled", true);
    $('#MarkCarLJZZ2').attr("disabled", false);
    $('#MarkCarLJZZ3').attr("disabled", true);
    $('#MarkCarLJZZ4').attr("disabled", false);

    dotArrCM = [];
    //构造路径所需的点序列，本示例路径为4个点
    var dot1CM = new OpenLayers.LonLat();
    dot1CM.lon = -1430643.3956528;
    dot1CM.lat = 1049646.4643154;
    dotArrCM.push(dot1CM);

    var dot2CM = new OpenLayers.LonLat();
    dot2CM.lon = 376485.10411904;
    dot2CM.lat = 748458.38102013;
    dotArrCM.push(dot2CM);

    var dot3CM = new OpenLayers.LonLat();
    dot3CM.lon = 1301562.788526;
    dot3CM.lat = 468783.73224591;
    dotArrCM.push(dot3CM);

    var dot4CM = new OpenLayers.LonLat();
    dot4CM.lon = 3646527.1513252;
    dot4CM.lat = 49271.759084605;
    dotArrCM.push(dot4CM);

    var dot5CM = new OpenLayers.LonLat();
    dot5CM.lon = 6206625.8593352;
    dot5CM.lat = 17001.607302949;
    dotArrCM.push(dot5CM);
    drawPathCM(dotArrCM, map);
}
//绘制小车的响应事件
function drawCarCM() {
    $('#MarkCarLJZZ1').attr("disabled", true);
    $('#MarkCarLJZZ2').attr("disabled", true);
    $('#MarkCarLJZZ3').attr("disabled", false);
    $('#MarkCarLJZZ4').attr("disabled", false);
    isStopOrStartCarFlag = false;
    if (timeoutLJZZ != null) {
        clearTimeout(timeoutLJZZ);
        timeoutLJZZ = null;
    }
    if (this.temDotArrCM == null || this.temDotArrCM.length <= 0) {
        //根据路径的坐标数组，按照1.5的地图单位长度序列化，生成新的路径坐标序列
        this.temDotArrCM = disperseToDotsCM(dotArrCM, 20000);
    }
    if (marksCM == null) {
        //创建绘制小车的mark层
        marksCM = new OpenLayers.Layer.Markers("车");
    }
    //计算原始路径中的夹角
    calAngleCM(dotArrCM);
    //图片的原始角度，示例中是以小车车头为x轴正向为0度，顺时针为正，逆时针为负
    this.orginAngleCM = 0;
    this.ImagePathCM = "$$tools$$/" + toolIDCM + "/img/car.png"; ;
    //小车图片大小为50*50像素
    mSizeCM = new OpenLayers.Size(50, 50);
    drawCarFuncCM(this.temDotArrCM, this.ImagePathCM, 10, false);
}

/* * 
*把轨迹解析得到的坐标序列进行序列化处理
*Parameters:
* dots{array(OpenLayers.LonLat)}根据轨迹线解析得到坐标序列
* step：歩长，单位为地图单位
* 返回：temDotArrCM {array(OpenLayers.LonLat)}
*/
function disperseToDotsCM(dots, step) {
    if (dots == null && dots.length <= 0) {
        return null;
    }
    var dotNum = 0;
    var offx = 0;  //x方向的偏移值
    var offy = 0;  //y方向的偏移值
    var rate = 0;  //两点之间连线于X轴正向的斜率
    for (var i = 0; i < dots.length - 1; i++) {
        rate = (dots[i + 1].lat - dots[i].lat) / dots[i + 1].lon - dots[i].lon;
        var dotDis = Math.sqrt(Math.pow(dots[i + 1].lon - dots[i].lon, 2) + Math.pow(dots[i + 1].lat - dots[i].lat, 2));
        offx = (dots[i + 1].lon - dots[i].lon) * step / dotDis;
        offy = (dots[i + 1].lat - dots[i].lat) * step / dotDis;
        if (i == 0) {
            temDotArrCM[0] = dots[0];
            dotNum++;

        }

        var temDis = Math.sqrt(Math.pow(dots[i + 1].lon - temDotArrCM[temDotArrCM.length - 1].lon, 2) + Math.pow(dots[i + 1].lat - temDotArrCM[temDotArrCM.length - 1].lat, 2));
        while (temDis > step) {
            var temDot = new OpenLayers.LonLat();
            temDot.lon = temDotArrCM[temDotArrCM.length - 1].lon + offx;
            temDot.lat = temDotArrCM[temDotArrCM.length - 1].lat + offy;
            temDotArrCM.push(temDot);
            temDis = Math.sqrt(Math.pow(dots[i + 1].lon - temDotArrCM[temDotArrCM.length - 1].lon, 2) + Math.pow(dots[i + 1].lat - temDotArrCM[temDotArrCM.length - 1].lat, 2));
            dotNum++;
        }
        dotNumArrCM.push(dotNum);
        dotNum = 0;
    }
    for (var j = 0; j < dotNumArrCM.length - 1; j++) {
        dotNumArrCM[j + 1] += dotNumArrCM[j];
    }
    return temDotArrCM;
}

/* * 
*计算路径中各段的角度，角度单位为度，各段以起点为坐标原点的
*平面直角坐标系，大小为与x轴正向的角度，顺时针为正，逆时针为负
*Parameters:
* dots{array(OpenLayers.LonLat)}路径的原始坐标点序列
*/
function calAngleCM(dots) {
    for (var i = 0; i < dots.length - 1; i++) {
        var dx = dots[i + 1].lon - dots[i].lon;
        var dy = dots[i + 1].lat - dots[i].lat;
        if (dx > 0) {   //第一象限 第四象限
            if (dy == 0) {
                angleArrCM.push(0);
            }
            else {
                angleArrCM.push(-Math.atan(dy / dx) * 180 / Math.PI);
            }

        }
        else if (dx < 0) { //第二象限 第三象限
            if (dy == 0) {
                angleArrCM.push(180);
            }
            else {
                angleArrCM.push(180 - Math.atan(dy / dx) * 180 / Math.PI);
            }

        }
        else if (dx == 0 && dy < 0) {
            angleArrCM(90)
        }
        else if (dx == 0 && dy > 0) {
            angleArrCM.push(-90);
        }
        else {
        }
        // else if ()
    }

}

/* * 
*绘制轨迹线
*平面直角坐标系，大小为与x轴正向的角度，顺时针为正，逆时针为负
*Parameters:
* dots{array(OpenLayers.LonLat)}路径序列化后的坐标序列（入口参数）
* map：地图容器（入口参数）
*/
function drawPathCM(dots, map) {
    if (dots == null || dots.length <= 1) {
        alert('没有轨迹线');
    }
    //判断地图容器中是否有名为“轨迹线”的图层，有则删除
    var layers = map.getLayersByName("路径追踪轨迹线");
    if (layers != null && layers.length > 0) {
        for (var i = 0; i < layers.length; i++) {
            map.removeLayer(layers[i]);
        }
    }
    //创建轨迹线图层，并在地图容器中装载
    var vectorLayer = new OpenLayers.Layer.Vector("路径追踪轨迹线");
    map.addLayer(vectorLayer);
    var pointList = [];
    var newPoint;

    //根据序列化的路径的点序列，创建几何点序列
    for (var i = 0; i < dots.length; i++) {
        newPoint = new OpenLayers.Geometry.Point(dots[i].lon, dots[i].lat);
        pointList.push(newPoint);
    }

    var style_green = {
        strokeColor: "#00FF00",
        strokeWidth: 3,
        strokeDashstyle: "dashdot",
        pointRadius: 6,
        pointerEvents: "visiblePainted"
    };

    //根据创建的几何线(几何线由几何点序列构成)，创建矢量要素
    var lineFeature = new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.LineString(pointList), null, style_green);

    //在绘制轨迹的矢量图层中添加轨迹线要素
    vectorLayer.addFeatures([lineFeature]);


}

/* * 
*绘制小车
*Parameters:
* dots{array(OpenLayers.LonLat)}路径序列化后的坐标序列（入口参数）
* imgPath：小车图片路径（入口参数）
* timeDis：时钟触发器时间间隔（入口参数）
* moving： 地图是否随小车移动的标志位（入口参数：true/false）
*/
function drawCarFuncCM(dots, imgPath, timeDis, moving) {
    if (dots == null || dots.length <= 1) {
        alert('该车没有轨迹');
    }
    this.timeSpanCM = timeDis;
    this.isMoveCM = moving;

    //判断地图容器中是否有名称为“车”的图层，有则删除
    var layers = map.getLayersByName("车");
    if (layers != null && layers.length > 0) {
        for (var i = 0; i < layers.length; i++) {
            map.removeLayer(layers[i]);
        }
    }

    //在地图容器中添加mark层
    map.addLayer(this.marksCM);

    //清除mark层中所有的mark
    marksCM.clearMarkers();

    //创建一个小车的mark，并添加到mark层中
    var icon = new OpenLayers.Icon(this.ImagePathCM, this.mSizeCM);
    CarMarker = new OpenLayers.Marker(dots[0], icon);
    marksCM.addMarker(CarMarker);

    //对装载小车mark的div层设置滤镜
    var imgDiv = icon.imageDiv;
    imgDiv.style.filter = "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand')";

    //对div层进行旋转
    Img.rotate(imgDiv.id, angleArrCM[0] - this.orginAngleCM);

    this.ImagePathCM = imgPath;
    this.tickNumCM = 1;

    //绘制小车动画
    this.dynaDrawCarCM();


}


/* * 
*通过时钟控制绘制小车动画
*Parameters:
*/
function dynaDrawCarCM() {

    if (this.tickNumCM < this.temDotArrCM.length) {

        if (CarMarker != null) {

            if (this.isMoveCM) {
                var zoom = this.map.getZoom();
                this.map.setCenter(this.temDotArrCM[this.tickNumCM], zoom);
            }
            var newPoint = new OpenLayers.Geometry.Point(this.temDotArrCM[this.tickNumCM].lon, this.temDotArrCM[this.tickNumCM].lat);
            //       marksCM.clearMarkers();

            var icon = CarMarker.icon;

            //icon.setSize(mSizeCM);
            //       var marker = new OpenLayers.Marker(this.temDotArrCM[this.tickNumCM], icon);
            //       marksCM.addMarker(marker);

            var temPix = this.map.getLayerPxFromLonLat(this.temDotArrCM[this.tickNumCM]);
            if (CarMarker != null) {
                CarMarker.moveTo(temPix);
            }



            var imgDiv = icon.imageDiv;
            imgDiv.style.filter = "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand')";

            //需要判断角度值：根据原始路径的序列化时生成的每段路径的坐标点数和当前小车触发的次数进行比较
            if (this.tickNumCM <= dotNumArrCM[0]) {

                Img.rotate(imgDiv.id, angleArrCM[0] - this.orginAngleCM);
            }
            else {

                for (var k = 0; k < angleArrCM.length - 1; k++) {

                    if (this.tickNumCM > dotNumArrCM[k] && this.tickNumCM <= dotNumArrCM[k + 1]) {

                        Img.rotate(imgDiv.id, angleArrCM[k + 1] - this.orginAngleCM);
                        break;
                    }

                }

            }
        }
        this.tickNumCM++;
        timeoutLJZZ = setTimeout(this.dynaDrawCarCM, this.timeSpanCM);
    } else {
        $('#MarkCarLJZZ1').attr("disabled", true);
        $('#MarkCarLJZZ2').attr("disabled", false);
        $('#MarkCarLJZZ3').attr("disabled", true);
        $('#MarkCarLJZZ4').attr("disabled", false);
        if (timeoutLJZZ!=null) {
            clearTimeout(timeoutLJZZ);
            timeoutLJZZ = null;
        }
    }
}

/* * 
*实现div层旋转
*/
var Img = function () {

    //取装载图片的div层（根据div层的id）
    var T$ = function (id) { return document.getElementById(id); }

    //获取当前用户的浏览器
    var ua = navigator.userAgent,

    //判断是否为IE
		isIE = /msie/i.test(ua) && !window.opera;
    var i = 0, sinDeg = 0, cosDeg = 0;

    //根据不同的浏览器，实现div层的旋转
    var rotate = function (target, angle) {
        target = T$(target);
        var orginW = target.clientWidth, orginH = target.clientHeight;
        if (isIE) { // IE
            cosDeg = Math.cos(angle * Math.PI / 180);
            sinDeg = Math.sin(angle * Math.PI / 180);
            with (target.filters.item(0)) {
                M11 = M22 = cosDeg; M12 = -(M21 = sinDeg);
            }
        } else if (target.style.MozTransform !== undefined) {  // Mozilla
            target.style.MozTransform = 'rotate(' + angle + 'deg)';
        } else if (target.style.OTransform !== undefined) {   // Opera
            target.style.OTransform = 'rotate(' + angle + 'deg)';
        } else if (target.style.webkitTransform !== undefined) { // Chrome Safari
            target.style.webkitTransform = 'rotate(' + angle + 'deg)';
        } else {
            target.style.transform = "rotate(" + angle + "deg)";
        }
    }
    return { rotate: rotate }
} ();