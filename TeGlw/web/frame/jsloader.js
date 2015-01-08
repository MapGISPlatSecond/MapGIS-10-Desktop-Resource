(function(){
    var jsConfig = {
        baseUrl:"./",
        packages:[
            {path:"frame/css/style.css",type:"css"},
            {path:"jslib/jquery.cookie.js",type:"js"},
            {path:"jslib/easyui/jquery.easyui.min.js",type:"js"},
            {path:"jslib/easyui/easyui-lang-zh_CN.js",type:"js"},
            {path:"bootstrap2.0/js/bootstrap.min.js",type:"js"},
            {path:"jslib/pagination/jquery-pager-1.0.js",type:"js"},
            {path:"jslib/zondy/libs/zdclient.js",type:"js"},
            {path:"jslib/zondy/libs/zdcontrol.js",type:"js"},
            {path:"jslib/E.js",type:"js"},
            {path:"frame/cfg/jsConfig.js",type:"js"}
        ]
    }
    function loadFile(filepath,filetype){
        if(filetype == "js"){
            var fileRef = document.createElement('script');
            fileRef.setAttribute("type","text/javascript");
            fileRef.setAttribute("src",filepath);
        }else if(filetype == "css"){

            var fileRef = document.createElement('link');
            fileRef.setAttribute("rel","stylesheet");
            fileRef.setAttribute("type","text/css");
            fileRef.setAttribute("href",filepath);
        }

        if(typeof fileRef != "undefined"){
            document.getElementsByTagName("head")[0].appendChild(fileRef);
        }
    }
    if(typeof jsConfig !=  "undefined") {
        for(var i in jsConfig.packages){
            loadFile(jsConfig.baseUrl+jsConfig.packages[i].path,jsConfig.packages[i].type);
        }
    }
})();