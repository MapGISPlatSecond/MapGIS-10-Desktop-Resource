var IsAddMLCtrl = false;
function InitMLCtrl() {
    if (!IsAddMLCtrl) {
        if ($("#MLdialog").attr("id") == undefined)
            BuildMLAler();
        IsAddMLCtrl = true;
        $("#MLdialog").dialog("open");
    }
    else {

        $("#MLdialog").dialog("close");
    }
}
function BuildMLAler() {
    var sb = '<div id="MLdialog" class="easyui-dialog"  title="显示级数设置" style="left:900px;top:30px;width: 300px; height:370px;padding: 5px" resizable="true">' +
    '<div id="toolspanelML" style="width:inherit;height:inherit;border:0px;padding-left:1px;font-family:Microsoft YaHei;font-size:13px;vertical-align:top;">' +
                  '  <div id="dialogboxML">' +
                      '<div id="itembox" > ' +
                            '<p class="blockName" >输入地图显示级别：</p>' +                            
                            '级数：<input id="level" type="text" size="13" />' +
                            ' <input class="functionButton" style="background-color:white" type="button" id="Button1" value="级数控制" title="地图缩放到指定级别"' +
                            ' onclick="zoomToLevel()" />' +
                      ' </div>' +
                     
                       ' <div id="Div1" class="itembox">' +
                           ' <p class="blockName" >输入地图矩形范围：</p>' +
                          '  xmin:<input id="xmin" type="text" size="26" value="-6573564.9344032"/></br>' +
                           ' ymin:<input id="ymin" type="text" size="26" value="-2537457.2878762"/></br>' +
                          '  xmax:<input id="xmax" type="text" size="26" value="8120110.8435032"/></br>' +
                          '  ymax:<input id="ymax" type="text" size="26" value="4400625.3451762"/>' +
                        '</div>' +
                        ' <div id="itembox"  style="margin-top:-10px;">' +
                       ' <input class="functionButton" style="background-color:white;margin-left:160px;" type="button" id="Button2" value="范围控制" title="根据指定范围地图缩放到适应级别"' +
                          '  onclick="zoomToExtent()" />' +
                    '</div></div>' +
                '</div>' +
   '   </div>';
    $("#main").append(sb);
    $("#MLdialog").dialog({ closed: true, onClose: function () { onCloseMLdialog(); } });

}
function onCloseMLdialog() {
    IsAddMLCtrl = false;
}
function zoomToLevel() {
    var lev = parseInt($("#level").val());
    if (lev >=0 && lev <=7) {
        map.zoomTo(parseInt($("#level").val()));
    } else { 
        $.messager.alert("操作提示","请输入0到6之间的数字！", "info");
    }
   
   
    //map.moveTo(null, 8);
}
function zoomToExtent() {
    var bound = new OpenLayers.Bounds($("#xmin").val(), $("#ymin").val(), $("#xmax").val(), $("#ymax").val()); //12689158.189799, 3542856.2605248, 12775073.40958, 3619140.4147428
    map.zoomToExtent(bound);
}