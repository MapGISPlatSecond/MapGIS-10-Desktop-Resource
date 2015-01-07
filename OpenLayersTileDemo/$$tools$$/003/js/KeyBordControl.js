var IsshowKBCCtrl = false;
function showKBCControl() {
    if (!IsshowKBCCtrl) {
        map.addControl(new OpenLayers.Control.KeyboardDefaults());
        if ($("#KeyBordDialog").attr("id") == undefined)
            addKeyBordHelpDIV();
        else {
            $.parser.parse($("#KeyBordDialog")); //局部重新渲染
            $("#KeyBordDialog").dialog("open");
        }
        IsshowKBCCtrl = true;
    }
    else {
       
        $("#KeyBordDialog").dialog("close");
      
    }
}
function addKeyBordHelpDIV() {
    var sb = '<div id="KeyBordDialog" class="easyui-dialog" title="键盘操作帮助说明" style="left:950px;top:150px;width: 300px; height: 192px;padding: 5px" resizable="true">' +
             '<div >' +
                   ' <div id="dialogboxKeyBord">' +
                        '<div id="itembox1" class="itembox">' +
                            '<span style="font-weight:bold;display:block; float:left;width:70px;">↑←↓→：</span><span>控制地图上右下左的方向移动</span>' +
                       ' </div>' +
                        '<div id="itembox2" class="itembox">' +
                            '<span style="font-weight:bold;display:block; float:left;width:70px;"> -/+：</span><span >放大和缩小地图</span>' +
                       ' </div>' +
                        '<div id="itembox3" class="itembox">' +
                            '<span style="font-weight:bold;display:block; float:left;width:70px;"> PgUp：</span><span>地图向下滚动到四分之三的位置</span>' +
                       ' </div>' +
                       '<div id="itembox4" class="itembox">' +
                          '  <span style="font-weight:bold;display:block; float:left;width:70px;"> PgDn：</span><span>地图向上滚动到四分之三的位置</span>' +
                       '</div>' +
                        '<div id="itembox4" class="itembox">' +
                          '<span style="font-weight:bold;display:block; float:left;width:70px;"> Home：</span><span>地图向右滚动到四分之三的位置</span> ' +
                       '</div>' +
                       '<div id="itembox4" class="itembox">' +
                          ' <span style="font-weight:bold;display:block; float:left;width:70px;"> End：</span><span>地图向左滚动到四分之三的位置</span>' +
                       '</div>' +
                    '</div>' +
               ' </div>' +
   '   </div>';
    $("#main").append(sb);
    $("#KeyBordDialog").dialog({ closed: false, onClose: function () { clearKeybordControl(); } });

}
function clearKeybordControl() {
    map.removeControl(new OpenLayers.Control.KeyboardDefaults());
    IsshowKBCCtrl = false;
}