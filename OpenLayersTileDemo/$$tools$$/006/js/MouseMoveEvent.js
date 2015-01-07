var IsAddMMECtrl = false;
function InitMMECtrl() {
    if (!IsAddMMECtrl) {
        if ($("#MMEventDialog").attr("id") == undefined)
            BuildMMEAlert();
        else {
            $.parser.parse($("#MMEventDialog")); //局部重新渲染
            $("#MMEventDialog").dialog("open");


        }
        //定义map的鼠标事件
        map.events.on({ 'mousemove': dispPos });
        IsAddMMECtrl = true;
    }
    else {
        $("#MMEventDialog").dialog("close");
      
    }
    
}
function BuildMMEAlert() {
    var sb = '<div id="MMEventDialog" class="easyui-dialog" title="鼠标事件—坐标信息" style="left:850px;top:20px;width: 260px; height: 132px;padding: 5px;overflow:hidden;" resizable="true">' +
    '<div id="toolspanelMME">' +
                  '  <div id="dialogboxMME">' +
                      '   <div class="itembox">'+
                        '<label for="dynaAnno">'+
                           ' 视窗坐标:</label>'+
                        '<input type="text" id="TXT_ViewPort" name="type" value="dynaAnno" size="13" />'+
                        '</div>'+
                        '<div class="itembox">'+
                        '<label for="dynaAnno">'+
                           ' 逻辑坐标:</label>'+
                        '<input type="text" id="TXT_Logic" name="type" value="dynaAnno" size="13" />'+
                        '</div> '+  
                    '</div>' +
                '</div>' +
   '   </div>';
    $("#main").append(sb);
    $("#MMEventDialog").dialog({ closed: false, onClose: function () {
        closeMMEvent();
    }});
}
function closeMMEvent()
{
    IsAddMMECtrl = false;
    map.events.on({ 'mousemove': null });
}
function dispPos(e) {
    document.getElementById("TXT_ViewPort").value = e.xy.x + "," + e.xy.y;
    var lonlat = map.getLonLatFromViewPortPx(e.xy);
    //如果小数位数太长，可调用lonlat.lon.toFixed(5);
    document.getElementById("TXT_Logic").value = lonlat.toShortString();
}