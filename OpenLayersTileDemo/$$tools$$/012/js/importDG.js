var toolIdDG = "";
//获取工具插件ID
var fileName = "importDG.js";
var isLoadDG= false;
var scripts = document.getElementsByTagName("script");
for (var i = 0; i < scripts.length; i++) {

    var src = scripts[i].src;
    if (src.indexOf("jquery.easyui.min.js") !== -1) {
        isLoadDG = true;
    }
    if (src.indexOf(fileName) !== -1) {
        src = src.substring(src.lastIndexOf(fileName
+ "?") + (fileName.length + 1));
        var array = src.split("&");
        for (var j = 0; j < array.length; j++) {
            var finalObj = array[j].split("=");
            if (finalObj[j] == "toolId")
                toolIdDG = finalObj[j + 1]; //iD
        }
    }
}
if (!isLoadDG) {
    loadjscssfile("/lib/easyui.css", "css", toolIdDG); //ID
    loadjscssfile("/lib/icon.css", "css", toolIdDG); //ID
    loadjscssfile("/lib/tablestyle.css", "css", toolIdDG); 
    loadjscssfile("/lib/jquery.easyui.min.js", "js", toolIdDG); //ID
}
loadjscssfile("/js/DrawGeometry.js", "js", toolIdDG); //ID