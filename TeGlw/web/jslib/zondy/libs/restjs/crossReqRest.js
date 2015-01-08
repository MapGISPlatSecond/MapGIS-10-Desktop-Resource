//begin zondy edit by 0529 01
//创建地图容器对象
function createMapObj(mapDiv)
{
	//新裁图工具裁剪瓦片图访问代码————所有级别均显示
	var maxBound = new OpenLayers.Bounds(12657280.02295371, 3499575.5991454381, 12810933.425539734, 3679755.0409897016);
	var mapObj = new OpenLayers.Map(mapDiv, {
         projection:"EPSG:900913",
         maxExtent: maxBound,
         zoom:9,
         resolutions: [266.93283333333335, 175.95638333333332, 87.97819166666666, 43.98909583333333, 21.994547916666665, 10.997273958333333, 5.4986502083333333, 2.749311875, 1.3746612291666667],
         controls: [
                    new OpenLayers.Control.Navigation(),
	         		new Zondy.Control.OverviewMap(
	         			{mapOptions:{
	         				maxExtent: maxBound,
	         				zoom:9,
	         				resolutions: [266.93283333333335, 175.95638333333332, 87.97819166666666, 43.98909583333333, 21.994547916666665, 10.997273958333333, 5.4986502083333333, 2.749311875, 1.3746612291666667]}
	         			}
	         		)]
	    });
    return mapObj;
}

function lonLatToMeter(map,x,y)
{
	return new OpenLayers.LonLat(x,y).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
}

function meterToLonLat(map,x,y)
{
	return new OpenLayers.LonLat(x,y).transform(map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"));
}
//end zondy edit by 0529 01


/**begin zondy by hyl 01*/
/**
 * 通过URL访问Rest服务，有分页查询
 * @param url  		Rest服务访问地址，带参数，http://127.0.0.1:8080/ServerRest/services/poi/keywordquery？param=value形式
 * @param currentPage  当前页
 * @param pageSize   每页数据记录条数
 * @param fn       请求成功时的回调函数
 * @return
 */
function callRestPageForURL(url,currentPage,pageSize,functionName,fn) {
	if(url.indexOf("?") == -1) {
		url = url + "?";
	}
	url = url + "&batch=" + currentPage;
	url = url + "&number=" + pageSize;
	$.ajax({
		type : "get",
		async:true,
		url:url,			//访问URL
		dataType : "jsonp",//服务返回数据类型为jsonp 
		jsonp:'callback', //回调函数名参数
		jsonpCallback: functionName,//回调函数名
		success : function(data){   
			fn(data);
		},            
		error:function(XMLHttpRequest, textStatus, errorThrown){    
            alert("查询失败");
		}       
	}); 
}
/**end zondy by hyl 01*/

/**begin zondy by hyl 02*/
/**
 * 通过URL访问Rest服务，无分页查询
 * @param url   Rest服务访问地址，带参数，http://127.0.0.1:8080/ServerRest/services/poi/keywordquery？param=value形式
 * @param fn    请求成功时的回调函数
 * @return
 */
function callRestForURL(url,functionName,fn) {
	$.ajax({
		type : "get",
		async:true,
		url:url,			//访问URL
		dataType : "jsonp",//服务返回数据类型为jsonp 
		jsonp:'callback', //回调函数名参数
		jsonpCallback: functionName,//回调函数名
		success : function(data){   
			fn(data);
		},            
		error:function(XMLHttpRequest, textStatus, errorThrown){    
            alert("查询失败");
		}       
	}); 
}
/**end zondy by hyl 02*/

/**begin zondy by hyl 03*/
/**
 * 大地坐标转经纬坐标
 * @param dot  传进的大地坐标
 * @return  返回相对应的经纬坐标
 */
function Mercator2lonLat(mercator) {
	var lonLat = {};
    var x = mercator.x/20037508.34*180;
    var y = mercator.y/20037508.34*180;
    y= 180/Math.PI*(2*Math.atan(Math.exp(y*Math.PI/180))-Math.PI/2);
    
    lonLat.x = x;
    lonLat.y = y;
    return lonLat;
}
/**end zondy by hyl 03*/

/**begin zondy by hyl 04*/
/**
 * 经纬坐标转大地坐标
 * @param lonLat	传进的经纬坐标
 * @return			返回相对应的大地坐标
 */
function lonLat2Mercator(lonLat) {
	var  mercator = {};
    var x = lonLat.x *20037508.34/180;
    var y = Math.log(Math.tan((90+lonLat.y)*Math.PI/360))/(Math.PI/180);
    y = y *20037508.34/180;
    mercator.x = x;
    mercator.y = y;
    return mercator ;
}
/**end zondy by hyl 04*/

//end zondy edit by 0529 01