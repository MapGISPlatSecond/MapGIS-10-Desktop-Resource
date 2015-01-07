var IsAddMLCCtrl = false;
function InitMLCCtrl() {
    if (!IsAddMLCCtrl) {
        if ($("#MLCdialog").attr("id") == undefined)
            BuildMLCAlert();
        else {
            $.parser.parse($("#MLCdialog")); //局部重新渲染
            $("#MLCdialog").dialog("open");

        }
        IsAddMLCCtrl = true;
    } else {
        $("#MLCdialog").dialog("close");
    }

}

function moveToPoint() {
    // 跳转到某一级某个位置
    map.moveTo(new OpenLayers.LonLat(12957462.5195349, 4855510.23416721), 5); //通过moveTo方法定位到某一级别地图的某一点
}
function panToPoint() {
    //放大到某一级
    map.zoomTo(4);
    //跳转到某个位置
    map.panTo(new OpenLayers.LonLat(706039.745587222, 6414176.18465431)); //通过panTo方法定位到当前级别地图的某一点
}
function BuildMLCAlert() {
    var sb = '<div id="MLCdialog" class="easyui-dialog" title="地图定位" style="left:800px;top:65px;width: 230px; height: 200px;padding:5px" resizable="true">' +
    '<div id="toolspanelMLC" class="itembox">' +
        '<div>' +
         '<label>提示：定位到地图第5级的中国北京</label>' +
        '</div>'+
         '<div style="margin-bottom:5px;">' +
          '<button  class="functionButton" style="background-color:white;width:90px;margin-left:50px;" id="Button1" title="定位到地图第5级的中国北京" onclick="moveToPoint()" >moveTo定位 </button>' +
          '</div>'+
         '<div style="padding-top:10px;border-top:1px dotted #A7C0DC;">' +
          '<label>提示：定位到卢森堡的位置</label>' +
        '</div>' +
          '<div >' +
          '<button  class="functionButton"  style="background-color:white;width:90px;margin-left:50px;" id="Button2" title="定位到当前地图级别下的卢森堡" onclick="panToPoint()">panTo定位 </button>' +
          '</div>' +
     '</div>' +
    '</div>';
    $("#main").append(sb);
    $("#MLCdialog").dialog({ closed: false, onClose: function () { closeMLC(); } });
}
function closeMLC() {
    IsAddMLCCtrl = false;
}