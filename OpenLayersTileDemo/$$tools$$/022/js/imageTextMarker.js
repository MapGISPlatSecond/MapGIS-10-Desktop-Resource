var imgTextWZTPFlagDialog = false;
var WZBZInitLonlatX = -26.2;
var WZBZInitLonlatY = 14.35;

//开始调用的函数
function imgTextInitWZTP() {
    if (!imgTextWZTPFlagDialog) {
        var lonlat = new OpenLayers.LonLat(WZBZInitLonlatX, WZBZInitLonlatY);
        map.setCenter(lonlat, 2);
        var sb = '<div id="WZTPdialog" class="easyui-dialog" title="文本图片标注" style="left:900px;top:100px;width:190px; height: 150px;padding: 5px" resizable="true">'
            + '<div id="toolspanelWZTP">'
                  + '<button  class="functionButton" onclick="addPointsTPWB()">添加标注</button>'
                  + '<button  class="functionButton"  onclick="clusterConfirmTPWB()">聚合标注</button>'
                   + '<button  class="functionButton"  onclick="CancelClusterFunTPWB()">取消聚合</button>'
                  + '<button  class="functionButton"  onclick="clearTextImgMarkTPWB()">清除标注</button>'
            + '</div></div>';
        $("#main").append(sb);
        $("#WZTPdialog").dialog({ closed: false, onClose: function () {
            clearTextImgMarkTPWB();
            clearTPWBDialog();
            imgTextWZTPFlagDialog = false;
        }
        });
       imgTextWZTPFlagDialog = true;
    } else {
       $("#WZTPdialog").dialog("close");
    }
}
//删掉弹出的操作框
function clearTPWBDialog() {
    var divobj = $("#WZTPdialog");
    if (divobj[0]) {
        divobj.remove();
    }
    //if (divobj[0]) {
       // $("div.panel.window").remove();
       // $("div.window-shadow").remove();
    //}
}