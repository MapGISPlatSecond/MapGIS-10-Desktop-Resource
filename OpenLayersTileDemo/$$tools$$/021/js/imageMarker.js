var imagemarkerlayer;
var TPBZInitLonlatX=12946456.7792577;
var TPBZInitLonlatY = 4865942.27950318;
var TPBZPopupArr = [];
var TPBZMarkArr = [new OpenLayers.LonLat(12946456.7792577, 4865942.27950318),
                    new OpenLayers.LonLat(11582793.0170401, 3587377.91450212),
                    new OpenLayers.LonLat(12064806.412175, 2590952.8464552),
                    new OpenLayers.LonLat(12130484.911743, 4070503.79627404)];
var TPBZMarkPopupIMGSrc = ["beijing.png", "chengdu.png", "nanning.png", "xian.png"];
var TPBZDialogFlag = false;
function ImgMarkerDisplay() {
    if (!TPBZDialogFlag) {
        clearImgMarker();
        clearTPBZDialog();
        var lonlat = new OpenLayers.LonLat(TPBZInitLonlatX, TPBZInitLonlatY);
        map.setCenter(lonlat, 3);
        //添加“删除标注和Popup”的弹出框
        var sb = '<div id="TPBZdialog" class="easyui-dialog" title="图片标注" style="left:900px;top:100px;width:220px; height: 140px;padding: 5px;overflow:hidden;" resizable="true">'
                     + '<div id="ImgMarkTPBZ" class="itembox">' +
                           ' 选择图片：' +
                           ' <select id="ImgMarkTPBZType" onchange="changeTPBZImg(this.value)" >' +
                              '  <option value="marker-red.png">图片1</option>' +
                             '   <option value="marker-green.png">图片2</option>' +
                             '   <option value="marker-blue.png">图片3</option>' +
                              '   <option value="marker-gold.png">图片4</option>' +
                            '</select>' +
                            '<img  style="padding-left:10px;padding-top:4px;" id="imgMarkTPBZSrc" src="$$tools$$/' + toolIdIM + '/lib/images/marker-red.png" />' +
                       ' </div>'
            + '<div id="toolspanelIM">'
                  + '<button  class="functionButton"  onclick="addIMGMarkTPBZ()">添加标注</button>'
                  + '<button  class="functionButton"  onclick="clearImgMarker()">清除标注</button>'
            + '</div></div>';
        $("#main").append(sb);
        $("#TPBZdialog").dialog({ closed: false, onClose: function () {
            clearImgMarker();
            TPBZDialogFlag = false;
        }
    });
    TPBZDialogFlag = true;

} else {
        $("#TPBZdialog").dialog("close");
    }
}
//添加图片标注
function addIMGMarkTPBZ() {
    var imgURL = $("#imgMarkTPBZSrc").attr("src");
    if (imagemarkerlayer==null) {
        imagemarkerlayer = new OpenLayers.Layer.Markers("sampleML");
        map.addLayer(imagemarkerlayer);
    }
    if (TPBZMarkArr) {
        for (var i = 0; i < TPBZMarkArr.length; i++) {
            var html = '<div style="width:220px;height:110px;"><img style="width:100%;height:100%" src="$$tools$$/' + toolIdIM + '/lib/images/' + TPBZMarkPopupIMGSrc[i] + '" /></div>';
            var lonlat = TPBZMarkArr[i];
            marker = new OpenLayers.Marker(lonlat, new OpenLayers.Icon(imgURL, new OpenLayers.Size(30, 30), new OpenLayers.Pixel(-(25 / 2), -25)));
            imagemarkerlayer.addMarker(marker);
            var popup = TPBZCreatePopup(lonlat, html, null);
            TPBZPopupArr.push(popup);
            marker.index = i;
            popup.index = i;
            marker.events.register('mousedown', marker, function (evt) {
                var tmark = evt.object;
                TPBZPopupArr[tmark.index].toggle();
            });
        }
    }

}
//创建popup层
function TPBZCreatePopup(logxy, context, callback) {
    var popup = new OpenLayers.Popup.NestFramedCloud(null, logxy, new OpenLayers.Size(220, 110), context, null, true, null); // (null, logxy, new OpenLayers.Size(220, 110), null, context, true, moPopupCloseCallBack);
    map.addPopup(popup);
    popup.hide();
    return popup;
}
//选中图片时显示出该图片
function changeTPBZImg(val) {
    var imgURL = '$$tools$$/' + toolIdIM + '/lib/images/' + val;
    $("#imgMarkTPBZSrc").attr("src",imgURL);  

}

//清除结果
function clearImgMarker() {
    var layer = map.getLayersByName("sampleML");
    if (layer[0]) {
        clearImgMarbox();
        map.removeLayer(imagemarkerlayer);
        imagemarkerlayer = null;
    }
    TPBZPopupArr = [];
}

//删除气泡弹出框
function clearImgMarbox() {
    if (TPBZPopupArr) {
        if (TPBZPopupArr.length>0) {
            for (var i = 0; i < TPBZPopupArr.length;i++ ) {
                map.removePopup(TPBZPopupArr[i]);
            }
        }
        TPBZPopupArr = null;
    }
}
//删除弹出框
function clearTPBZDialog() {
    var divobj = $("#TPBZdialog");
    if (divobj[0]) {
        divobj.remove();
    }
}
