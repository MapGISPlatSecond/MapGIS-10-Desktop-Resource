var IsAddMCICtrl = false;
function InitMCICtrl() {
    if (!IsAddMCICtrl) {
        if ($("#MCIdialog").attr("id") == undefined)
            BuildMCIAlert();
        else {
            $.parser.parse($("#MCIdialog")); //局部重新渲染
            $("#MCIdialog").dialog("open");
        }
        IsAddMCICtrl = true;
    } else {
        $("#MCIdialog").dialog("close");
       
    }

}
function BuildMCIAlert() {
    var sb = '<div id="MCIdialog" class="easyui-dialog" title="地图容器信息" style="left:900px;top:140px;width: 160px; height: 210px;padding: 5px;overflow:hidden" resizable="true">' +
    '<div id="toolspanelMCI">' +
               '<button class="functionButton" id="resolution" style="width:100px;" onclick="getCurResolution()" >当前分辨率</button><br />'+
                '    <button class="functionButton" id="bound" style="width:100px;"   onclick="getCurBound()">当前地图范围</button><br />' +
                 '   <button class="functionButton" id="view"  style="width:100px;"   onclick="getMapDivInfo()">当前视窗范围</button><br />' +
   '   </div>';
    $("#main").append(sb);
    $("#MCIdialog").dialog({ closed: false, onClose: function () { closeMCI(); } });
}
function closeMCI() {
    IsAddMCICtrl = false;
}
function getCurResolution() {
     var  curResolution = map.getResolution();
     $.messager.alert("当前分辨率", "当前分辨率：" + curResolution, "info");
}
function getCurBound() {
    var curMapBound = map.getExtent();
    var curBoundArr = curMapBound.toString().split(",");
    $.messager.alert("当前地图范围","地图范围："+curBoundArr[0] + "," + curBoundArr[1] + ",</br>" + curBoundArr[2] + "," + curBoundArr[3], "");
}
function getMapDivInfo() {
     var viewSize = map.getSize();
     $.messager.alert("当前视窗范围", "当前视窗高：" + viewSize.h + "  宽：" + viewSize.w, "info");
}
