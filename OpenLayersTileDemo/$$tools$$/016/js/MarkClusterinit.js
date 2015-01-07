var vecLayerFF = null, vLayerFF = null;      //矢量要素图层
var selFeatureCtrlFF = null; //矢量要素选择控件
var selFeaturesFF = null;
var getFeatureCtrlFF = null;
var selectFF, controlFF;
var numFF = 0;
var kFF = 0;
var timerFF;
var style_greenFF;
var isMaCCheck = false;
function DrawMaC() {
    if (!isMaCCheck) {
        if ($("#MaCdialog").attr("id") == undefined)
            BuildMaCAlert();
        else {
            $.parser.parse($("#MaCdialog")); //局部重新渲染
            $("#MaCdialog").dialog("open");
        }
        initMaC();
        isMaCCheck = true;
    }
    else {
        $("#MaCdialog").dialog("close");
     
    }
}
function BuildMaCAlert() {
    var sb = '<div id="MaCdialog" class="easyui-dialog" title="聚合标注" style="left:900px;top:300px;width:190px; height: 140px;overflow:hidden;" resizable="false">' 
        		+ '<div id="toolspanelMaC">'
                  + '<button style= "border:1px dashed gray;" class="functionButton" id="createMark"  onclick=\'randMark()\'>随机标注</button>'
                  + '<button style= "border:1px dashed gray;" class="functionButton" id="Cluster"  onclick=\'clusterClickJHBZ()\'>聚合标注</button>'
                  + '<button  style= "border:1px dashed gray;" class="functionButton" id="cancel"  onclick=\'CancelClusterFun()\'>取消聚合</button>'
                  + '<button  style= "border:1px dashed gray;" class="functionButton" id="cancel"  onclick=\'clearJHBZ()\'>清除</button>'
                +'</div>' +
   '   </div>';
    $("#main").append(sb);
    $("#MaCdialog").dialog({ closed: false, onClose: function () { closeMaC(); } });
}

function closeMaC() {
    clearJHBZ();
    isMaCCheck = false;
}
function clearJHBZ() {
   CancelClusterFun();
   moveallMcA();
  
}
//点击聚合标注按钮执行的方法
function clusterClickJHBZ() {
    map.events.unregister("zoomend", null, onJHBZResizeEnd);
    clusterConfirm();
    map.events.register("zoomend", null, onJHBZResizeEnd);
}
function onJHBZResizeEnd(e) {
    clusterConfirm();
}
    