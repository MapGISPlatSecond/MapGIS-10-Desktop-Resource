var toolIdSE = "";
//获取工具插件ID
var fileName = "importSE.js";
var isLoadSE = false;
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
                toolIdSE = finalObj[j + 1]; //iD
        }
    }
}

loadjscssfile("/lib/styleSE.css", "css", toolIdSE);
loadjscssfile("/js/styleExample.js", "js", toolIdSE); //ID