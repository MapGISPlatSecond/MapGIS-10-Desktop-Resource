/*---------------------系统框架设计------------------------------*/
var map, layer;
//地图初始化函数
function init() {
    var slideNav = new OpenLayers.Control.TouchNavigation({
        dragPanOptions: {         //惯性滑动,
            enableKinetic: {       //enableKinetic,可以设为bool，也可设为object,设为object时,object会考到{<OpenLayers.Kinetic> 的构造函数中
                deceleration: 0.0055 //地图滑动的速率
            }
        }
    });
    //加载地图
    map = new OpenLayers.Map("map", {
        maxExtent:SvrCfg.mapBound,
        maxResolution: SvrCfg.Resolution, 
        numZoomLevels: 7,
        layers: [new Zondy.Map.TileLayer("MapGIS TileLayer", SvrCfg.mapName, {
            isBaseLayer: true,
            port: SvrCfg.port,
            ip: SvrCfg.url,
            tileOrigin: new OpenLayers.LonLat(0, 0)
        })],
        controls: [new OpenLayers.Control.Navigation(),
        slideNav
        ],
        theme: null
    });
    map.setCenter(new OpenLayers.LonLat(0,0),2);
    //单击的标志位
    startClick = 0;
    initLogo();
    initStartBtn();
    initToolBar();
    get_JSON();
}

function initStartBtn() {
    var initStartFlag = 0;
    // start按钮事件
    $("#start").hide();
    $("#startBtn").click(function () {
        startClick = startFun(startClick);
        if (initStartFlag == 0) {
            initStartFlag = 1;
        } else return;
    });
}

function initToolBar() {

    //放大
    $("#toolbar ul").find('#zoomIn').click(zondy.setOperZoomIn);

    //缩小
    $("#toolbar ul").find('#zoomOut').click(zondy.setOperZoomOut);

    //移动
    $("#toolbar ul").find('#pan').click(zondy.setOperDrag);

    //复位
    $("#toolbar ul").find('#restore').click(function () {
        map.zoomToMaxExtent();
        zondy.setOperDrag();
        map.setCenter(new OpenLayers.LonLat(114402.96423, -8560938.82515), 2);
    });
}

function initLogo() {
    // logo显示隐藏事件
    var logoClick = 0;
    $("#logoBtn").click(function () {
        if (logoClick == 0) {
            $("#logoText").hide('drop', null, 500, null);
            $(this).find(".logoBtn").attr("title", "显示标题");
            logoClick = 1;
        } else {
            $("#logoText").show('drop', null, 500, null);
            $(this).find(".logoBtn").attr("title", "隐藏标题");
            logoClick = 0;
        }
    });
}
// start显示或隐藏函数
function startFun(clickNum) {
    if (clickNum == 0) {
        $("#start").show('explode', null, 500, null);
        $("#startBtn").find(".operator").removeClass("opStart");
        $("#startBtn").find(".operator").addClass("opDown");
        return 1;
    } else {
        $("#start").hide('explode', null, 500, null);
        $("#startBtn").find(".operator").removeClass("opDown");
        $("#startBtn").find(".operator").addClass("opStart");
        return 0;
    }
}


/*---------------------读取配置文件(json)创建功能插件标签---------*/
var toolID;
function get_JSON() {

    $.ajax({
        type: "GET",
        url: "$$framework$$.json?1",
        dataType: "text",
        success: function (data) {

            var json = eval("(" + data + ")");
            var tools = json.tools;
            var len = tools.length;
            for (var i = 0; i < len; i++) {
                var divID;
                if (i == 0 || i % 10 == 0) {
                    divID = "contPanel" + i / 10; //margin: 5px 10px 0px 0px;
                    var d = ' <div class="contPanel" id="' + divID + '" style="padding-top:15px;margin: 5px 10px 0px 0px; height: 222px; width: 443px;background-image:url(lib/img/menuBg/48.jpg);">';
                    $("#featured").append(d);
                    var s = $("#featured");
                }
                toolID = tools[i].id;
                CreateUI(divID, tools[i].imgSrc, tools[i].imgFun, tools[i].name, tools[i].id);
                //tools[i].js为插件js文件路径
                if (tools[i].jsPage != "" && tools[i].jsPage != undefined) {
                    loadjscssfile(tools[i].jsPage, "js", toolID);
                }
            }
            $('#featured').orbit({
                bullets: true, 					// true or false to activate the bullet navigation
                bulletThumbs: true, 			// thumbnails for the bullets 
                directionalNav: false,
                timer: false,
                animationSpeed: 500
            });
        }
    });
}
////动态加载js文件
function loadjscssfile(path, filetype, id) {
    var fileSrc = '$$tools$$/' + id; 
    fileSrc += path;
    fileSrc += "?toolId=" + id;
    if (filetype == "js") { //判断文件类型 
        var fileref = document.createElement('script'); //创建标签 
        fileref.setAttribute("type", "text/javascript"); //定义属性type的值为text/javascript 
        fileref.setAttribute("src", fileSrc); 	//文件的地址 
    }
    else if (filetype == "css") { //判断文件类型 
        var fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", fileSrc);
    }
    if (typeof fileref != "undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref);
}
function CreateUI(divID, imgSrc, imgFun, name, id) {
    var Menu = $("#" + divID);
    var plusDOM = '<div class="funRegion">';
    plusDOM += '<img id="' + id + '" style="width:48px;height:48px;" class="startMenu" src="$$tools$$/' +id+ imgSrc + '"  /><br />';
    plusDOM += name + '</div>';
    Menu.append(plusDOM);
    $("#" + id).click(
    function () {
        CallWorkFlow(imgFun, "", id);
    }
    );
}
 //jsfunction：插件是div层，调用的方法
//page：页面，调用的html
function CallWorkFlow(jsfunction, page, id) {
    if (jsfunction != "") {
        eval(jsfunction + '()');
    }
    else {
        page = "$$tools$$/" + id + page; //add by lf :20130702
        window.open(page);
    }
}
function loadNETfile(path, filetype) {
    var fileSrc = path;
    if (filetype == "js") { //判断文件类型 
        var fileref = document.createElement('script'); //创建标签 
        fileref.setAttribute("type", "text/javascript"); //定义属性type的值为text/javascript 
        fileref.setAttribute("src", fileSrc); 	//文件的地址 
    }
    else if (filetype == "css") { //判断文件类型 
        var fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", fileSrc);
    }
    if (typeof fileref != "undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref);
}