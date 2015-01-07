var toolIDCM = "";
//获取工具插件ID
var fileName = "importCM.js";
var isLoadCM = false;
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
                toolIDCM = finalObj[j + 1]; //iD
        }
    }
}
loadjscssfile("/lib/icon1.css", "css", toolIDCM); //ID
loadjscssfile("/js/CarMovejs.js", "js", toolIDCM); //ID
