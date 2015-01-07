var toolIdIM = "";
//获取工具插件ID
var fileName = "importIM.js";
var isLoadTPBZ = false;
var scripts = document.getElementsByTagName("script");
for (var i = 0; i < scripts.length; i++) {
    var src = scripts[i].src;
    if (src.indexOf("NestFramedCloud.js") !== -1) {
        isLoadTPBZ = true;
    }
    if (src.indexOf(fileName) !== -1) {
        src = src.substring(src.lastIndexOf(fileName+ "?") + (fileName.length + 1));
        var array = src.split("&");
        for (var j = 0; j < array.length; j++) {
            var finalObj = array[j].split("=");
            if (finalObj[j] == "toolId")
                toolIdIM = finalObj[j + 1]; //获取动态生成的tool的id号
        }
    }
}
if (!isLoadTPBZ) {
    loadjscssfile("/lib/NestFramedCloud.js", "js", toolIdIM);
}
loadjscssfile("/js/imageMarker.js", "js", toolIdIM); 


