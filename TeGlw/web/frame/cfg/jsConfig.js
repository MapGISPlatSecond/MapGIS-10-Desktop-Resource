//地图访问IP和端口
var ZDMAP_IP = "134.99.68.117";
var ZDMAP_PORT = "8089";
var Enum_LayerType={
    MultiTileLayer:"BaiduLayer",
    VectorLayer:"VectorLayer"
}

//控制是否进行经纬度转换，true转换，false不转换
var lonLatTrans = false;

var mapConfig={
   // baiduMapBounds:{xmin: -20037508.34,ymin:-20037508.34,xmax:20037508.34,ymax:20037508.34},2.354879618  -179.99804142868,"y":-85.090991873268},{"x":179.99804142868,"y":85.090991873268}]}
    baiduMapBounds:{xmin:-180,ymin:-85.0511,xmax:180,ymax:85.0511},
    baiduMaxResolution:262144,
    baiduNumZoomLevels:20,
    baiduResetLev:9,  // 百度地图级别和Openlayers相差3级 9级在百度拾取坐标系统上是12级
    baiduCenter:{ x:120.17673703593,y:31.586556697704},//120.24701457177,31.600273710755//120.1653994,30.2147044  120.215638,30.29692  120.217363,30.29692

    layers:[
        {name:"湖州矢量地图",layerName:[
            {name:"SL_HUZ-0-3",minLev:0,maxLev:3},
            {name:"SL_HUZ-4-5",minLev:4,maxLev:5},
            {name:"SL_HUZ-6",minLev:6,maxLev:6},
            {name:"SL_HUZ-7",minLev:7,maxLev:7},
            {name:"SL_HUZ-8",minLev:8,maxLev:8},
            {name:"SL_HUZ-9-10-WG",minLev:9,maxLev:10},
            {name:"SL_HUZ-11-WG",minLev:11,maxLev:11},
            {name:"SL_HUZ-12",minLev:12,maxLev:12}],layerType:Enum_LayerType.BaiduLayer,isBaseLayer:true,visibility:true
        },
        {name:"湖州影像矢量地图",layerName:[
            {name:"YXSL_HUZ-0-5",minLev:0,maxLev:5},
            {name:"YXSL_HUZ-6",minLev:6,maxLev:6},
            {name:"YXSL_HUZ-7",minLev:7,maxLev:7},
            {name:"YXSL_HUZ-8",minLev:8,maxLev:8},
            {name:"YXSL_HUZ-9-jpg",minLev:9,maxLev:9},
            {name:"YXSL_HUZ-10-jpg",minLev:10,maxLev:10},
            {name:"YXSL_HUZ-11-jpg",minLev:11,maxLev:11},
            {name:"YXSL_HUZ-12",minLev:12,maxLev:12}],layerType:Enum_LayerType.MultiTileLayer,isBaseLayer:true,visibility:false
        },
        {
            name:"网格速率专题图",
            layerName:"TeGridReg_Rate",
            layerType:Enum_LayerType.VectorLayer,
            isBaseLayer:false,
            visibility:false,
            opacity:0.3
        }
    ]
}

