var toolIdUD= "";
//获取工具插件ID
var fileName = "importUDCtrl.js";
var scripts = document.getElementsByTagName("script");
for (var i = 0; i < scripts.length; i++) {
    var src = scripts[i].src;

    if (src.indexOf(fileName) !== -1) {
        src = src.substring(src.lastIndexOf(fileName
+ "?") + (fileName.length + 1));
        var array = src.split("&");
        for (var j = 0; j < array.length; j++) {
            var finalObj = array[j].split("=");
            if (finalObj[j] == "toolId")
                toolIdUD = finalObj[j + 1]; //iD
        }
    }
}

loadjscssfile("/js/UserDefineControls.js", "js", toolIdUD); //ID
    var obj = $("#trashUD");

    if (obj.length<=0) {
        var html = '<div id="trashUD" style=" margin-left:210px; width:400px; height:80px; position:absolute; z-index: 1005;bottom:10px;" >' +
      '<div id="LayerSwitcher" title="图层显示" onclick=\'update(this)\' style="position:absolute;width:45px;height:80px;bottom:0;left:0px;background-position:0 0;cursor:pointer; background-image:url($$tools$$/' + toolIdUD + '/css/img/title_layers.png)"> </div>' +
     '<div id="PanZoomBar" title="导航条" onclick=\'update(this)\' style="position:absolute;width:45px;height:80px;bottom:0;left:50px;background-position:0 0;cursor:pointer; background-image:url($$tools$$/' + toolIdUD + '/css/img/daohan.png)"> </div>' +
      '<div id="ScaleBar" title="比例尺" onclick=\'update(this)\' style="position:absolute;width:45px;height:80px;bottom:0;left:100px;background-position:0 0;cursor:pointer; background-image:url($$tools$$/' + toolIdUD + '/css/img/blch.png)"> </div>' +
      // '<div id="Magnify" title="放大镜" onclick=\'update(this)\' style="position:absolute;width:45px;height:80px;bottom:0;left:150px;background-position:0 0;cursor:pointer; background-image:url($$tools$$/' + toolIdUD + '/css/img/fdj.png)"> </div>' +
      //  '<div id="OverviewMap" title="鹰眼" onclick=\'update(this)\' style="position:absolute;width:45px;height:80px;bottom:0;left:150px;background-position:0 0;cursor:pointer; background-image:url($$tools$$/' + toolIdUD + '/css/img/yy.png)"> </div>' +
         '<div id="LegendBar" title="图例" onclick=\'update(this)\' style="position:absolute;width:45px;height:80px;bottom:0;left:150px;background-position:0 0;cursor:pointer; background-image:url($$tools$$/' + toolIdUD + '/css/img/tl.png)"> </div>' +
          '<div id="RightcLickMenu" title="右键菜单" onclick=\'update(this)\' style="position:absolute;width:45px;height:80px;bottom:0;left:200px;background-position:0 0;cursor:pointer; background-image:url($$tools$$/' + toolIdUD + '/css/img/rm.png)"> </div>' +
           '<div id="Checkbox8" title="移除控件" onclick=\'removeallControl()\' style="position:absolute;width:45px;height:80px;bottom:0;left:250px;background-position:0 0;cursor:pointer; background-image:url($$tools$$/' + toolIdUD + '/css/img/clear.png)"> </div>' +
    '</div>';
        $("#main").append(html);
    }
    $("#trashUD")[0].style.display = "none";
  
