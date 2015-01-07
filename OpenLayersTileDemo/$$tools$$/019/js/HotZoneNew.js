        var mapHZ = null;
        var tileLayerHZ = null;     //瓦片图层
        var vecLayerHZ = null;      //矢量要素图层

        var ModifyControlHZ = null;    //矢量图形编辑控件
        var drawControlHZ = null;      //矢量图形绘制控件
        var deleteControlHZ = null;    //删除要素控件
        var selectControlHZ = null;
        var modifyAttControlHZ = null; //修改属性控件
        var mousePosControlHZ = null;

        var selectTypeHZ = null;    //选择操作类型（delete/pop）
        var curZoomHZ = null;       //当前zoom等级
        var isDspHotHZ = false;     //是否显示热区
        var curPosHZ = null;        //鼠标的实时坐标（经纬度）
        var isOnlyDispHZ = false;    //控制查询标志

        var currentStateHZ = null;      //当前操作状态
        var m_mFeatureHZ = null;        // 当前正在修改的要素
        var srcElementHZ = null;

        var pop = null;
        var isHZCheck = false;
        function DrawHZ() {
    if (!isHZCheck) {

        if ($("#HZdialog").attr("id") == undefined) {
            buildHAhtml();
            initHZ();
        }
        else {
            $.parser.parse($("#HZdialog")); //局部重新渲染
            $("#HZdialog").dialog("open");
        }
       
        isHZCheck = true;
    }
    else {
        $("#HZdialog").dialog("close");
    }
}
       //地图初始化函数
        function initHZ() {
            document.body.onclick = OnDocumentClickHZ; //浏览器点击事件
            //创建地图容器
            mapHZ = new OpenLayers.Map("mapHZ", {
                tileSize: new OpenLayers.Size(256, 256),
                maxExtent: new OpenLayers.Bounds(1110078.36643173, 3236448.06045859, 1111428.96697105, 3237798.66099791),
                maxResolution: 5.2935,
                controls: [new OpenLayers.Control.Navigation(), new OpenLayers.Control.PanZoomBar(), new OpenLayers.Control.LayerSwitcher()]
            });

            mousePosControlHZ = new OpenLayers.Control.MousePosition();
            mapHZ.addControl(mousePosControlHZ);

            tileLayerHZ = new Zondy.Map.TileLayer("MapGIS TileLayer", "Wh3D"); //初始化瓦片图层对象
            //创建装地图文档sample_wuhan的层并添加在地图容器中

            mapHZ.addLayer(tileLayerHZ);

            vecLayerHZ = new OpenLayers.Layer.Vector("2");
            mapHZ.addLayer(vecLayerHZ);

            //监测地图缩放结束事件
            mapHZ.events.on({
                'zoomend': dispHotHZ
            });
//            BuildHZAlert();
            mapHZ.setCenter(new OpenLayers.LonLat(1110753.66670139, 3237123.36072825), 2);
            curZoomHZ = mapHZ.zoom;
            selectDataHZ();
        }

       /**
       * Method: dispHotHZ
       * 显示当前zoom级别下的热区（动态显示）
       * Parameters:
       * 
       */
       function dispHotHZ() {
           curZoomHZ = mapHZ.zoom;

           if (isDspHotHZ) {
               var isExist = isExistOfVectLayerHZ(curZoomHZ);
               if (isExist != true) {
                   vecLayerHZ = new OpenLayers.Layer.Vector(curZoomHZ.toString());
                   vecLayerHZ.setVisibility(true);
                   mapHZ.addLayer(vecLayerHZ);
               }
               else {
                   vecLayerHZ.removeAllFeatures();
                   vecLayerHZ.setVisibility(true);
               }

               selectDataHZ();
           }
       }

       function buildHAhtml() {
           sb = '<div id="HZdialog" class="easyui-dialog" title="热区功能" style="width:750px; height: 550px;padding: 5px" resizable="true">' +
        	 '<table>' +
             '<tr id="contenttablePA">' +
             '<td id="mapConHZ" style="width: 600px;"><div id="mapHZ" style="width:550px;height:450px;"></div></td>' +
            '<td> <table >' +
                    '<tr><td><p class="blockName">热区图例(人口/颜色):</p></td></tr>' +
                          ' <tr><td><label for="color1">0000-1000:</label>' +
                         '   <input id="color1" type="text" size="6" style="background: #FF9900" value="#FF9900"' +
                            '    alt="popColorDlg" readonly /></td></tr>' +
                            '     <tr><td><label for="color2">1000-2000:</label>' +
                           ' <input id="color2" type="text" size="6" style="background: #3366FF" value="#3366FF"' +
                          '  alt="popColorDlg" readonly /></td></tr>' +
                              '  <tr><td> <label for="color3">2000-3000:</label>' +
                          '  <input id="color3" type="text" size="6" style="background: #CC00FF" value="#CC00FF"' +
                             '   alt="popColorDlg" readonly /></td></tr>' +
                             ' <tr><td> <label for="color4">3000-4000:</label>' +
                          '  <input id="color4" type="text" size="6" style="background: #66FFFF" value="#66FFFF"' +
                           '     alt="popColorDlg" readonly /></td></tr>' +
                            ' <tr><td><label for="color5">4000-5000:</label>' +
                           ' <input id="color5" type="text" size="6" style="background: #CC6666" value="#CC6666"' +
                            '    alt="popColorDlg" readonly /></td></tr>' +
                             '   <tr><td> <label for="color6">其他:</label>' +
                            '<input id="color6" type="text" size="6" style="background: #FF0099" value="#FF0099"' +
                              '  alt="popColorDlg" readonly /></td></tr>' +
                        '<tr><td> <p class="blockName">热区属性显示:</p></td></tr>' +
                            '<tr><td> <label>名称：</label><input id="attName" type="text" size="13" value="" onchange="changeAttHZ()" /></td></tr>' +
                             '<tr><td><label>人数：</label><input id="attNum" type="text" size="13" value="" onchange="changeAttHZ()" /></td></tr>' +
                             '<tr><td><label>地址：</label><input id="attAdree" type="text" size="13" value="" onchange="changeAttHZ()" /></td></tr>' +
                              '<tr><td><button class="functionButton"  id="Button4"  onclick="toggleControlHZ(this)" >添加热区</button>' +
                       ' <button class="functionButton"  id="Button3"  onclick="toggleControlHZ(this)" >删除热区</button></td></tr>' +
                        '<tr><td><button class="functionButton"  id="Button5"  onclick="toggleControlHZ(this)" >更新热区</button>' +
                        '<button class="functionButton"  id="Button2"  onclick="toggleControlHZ(this)" >更新属性</button></td></tr>' + '</table></td>' +
                    '</tr></table>' +
            '</div>';
           $("#main").append(sb);
           $("#HZdialog").dialog({ closed: false, onClose: function () {
               closebackHZ();
           }
           });
       }
       function BuildHZAlert() {
           var sb = '<div id="HZdialog" class="easyui-dialog" title="热区设置" style="width: 255px; height: 400px;padding: 5px" resizable="true">' +
             '<table >' +
                    '<tr><td><p class="blockName">热区图例(人口/颜色):</p></td></tr>' +
                          ' <tr><td><label for="color1">0000-1000:</label>' +
                         '   <input id="color1" type="text" size="6" style="background: #FF9900" value="#FF9900"' +
                            '    alt="popColorDlg" readonly /></td></tr>' +
                            '     <tr><td><label for="color2">1000-2000:</label>' +
                           ' <input id="color2" type="text" size="6" style="background: #3366FF" value="#3366FF"' +
                          '  alt="popColorDlg" readonly /></td></tr>' +
                              '  <tr><td> <label for="color3">2000-3000:</label>' +
                          '  <input id="color3" type="text" size="6" style="background: #CC00FF" value="#CC00FF"' +
                             '   alt="popColorDlg" readonly /></td></tr>' +
                             ' <tr><td> <label for="color4">3000-4000:</label>' +
                          '  <input id="color4" type="text" size="6" style="background: #66FFFF" value="#66FFFF"' +
                           '     alt="popColorDlg" readonly /></td></tr>' +
                            ' <tr><td><label for="color5">4000-5000:</label>' +
                           ' <input id="color5" type="text" size="6" style="background: #CC6666" value="#CC6666"' +
                            '    alt="popColorDlg" readonly /></td></tr>' +
                             '   <tr><td> <label for="color6">其他:</label>' +
                            '<input id="color6" type="text" size="6" style="background: #FF0099" value="#FF0099"' +
                              '  alt="popColorDlg" readonly /></td></tr>' +
                        '<tr><td> <p class="blockName">热区属性显示:</p></td></tr>' +
                            '<tr><td> <label>名称：</label><input id="attName" type="text" size="13" value="" onchange="changeAttHZ()" /></td></tr>' +
                             '<tr><td><label>人数：</label><input id="attNum" type="text" size="13" value="" onchange="changeAttHZ()" /></td></tr>' +
                             '<tr><td><label>地址：</label><input id="attAdree" type="text" size="13" value="" onchange="changeAttHZ()" /></td></tr>' +
                              '<tr><td><button class="functionButton"  id="Button4"  onclick="toggleControlHZ(this)" >添加热区</button>' +
                       ' <button class="functionButton"  id="Button3"  onclick="toggleControlHZ(this)" >删除热区</button></td></tr>' +
                        '<tr><td><button class="functionButton"  id="Button5"  onclick="toggleControlHZ(this)" >更新热区</button>' +
                        '<button class="functionButton"  id="Button2"  onclick="toggleControlHZ(this)" >更新属性</button></td></tr>' + '</table>   </div>';
           $("#mainHZ").append(sb);
           $("#HZdialog").dialog({ closed: false});
       }
     

        /**
        * Method: isExistOfVectLayerHZ
        * 判断当前zoom级别下的矢量图层是否存在
        * Parameters:
        * zoom-{Number} 当前mapHZ的zoom级别
        * Returns:
        * {Boolean}
        */
        function isExistOfVectLayerHZ(zoom) {
            if (mapHZ != null && mapHZ.layers != null) {

                var layerNum = mapHZ.layers.length;
                for (var j = 0; j < layerNum; j++) {
                    if ((mapHZ.layers)[j].isBaseLayer == false) {
                        (mapHZ.layers)[j].setVisibility(false);
                    }
                }
                for (var i = 0; i < layerNum; i++) {
                    if ((mapHZ.layers)[i].name == curZoomHZ.toString()) {
                        (mapHZ.layers)[i].setVisibility(true);
                        vecLayerHZ = (mapHZ.layers)[i];
                        return true;
                    }
                }

            }
            else {
                return false;
            }
        }

        /**
        * Method: updateDataHZ
        * 更新数据（后台数据库），通过WCF服务来完成
        * Parameters:
        * itype-{String} 当前操作类型（insert、update、delete）
        * valStr-{String} 要素属性以及坐标序列的连接字符串
        * Returns:
        * 
        */
        function updateDataHZ(itype, valStr) {
            var sqlStr = "";
            switch (itype) {
                case "insert":
                    sqlStr += "INSERT INTO HotSpots([coord],[name],[oid],[lev],[pnum],[paddress]) VALUES(" + valStr + ")";
                    break;
                case "update":
                    sqlStr += "UPDATE HotSpots SET" + valStr;
                    break;
                case "delete":
                    sqlStr += "DELETE FROM HotSpots WHERE oid =" + valStr;
                    break;
            }
            // var urlStr = encodeURI("DoDatabase.svc/appendDate?sql=" + sqlStr);
            var urlStr = encodeURI("HotSpotService.svc/appendDate");
            var sqlStrNew = encodeURI(sqlStr);
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: urlStr,
                data: '{"sql":"' + sqlStr + '"}'
            });

        }

        /**
        * Method: selectDataHZ
        * 获取当前zoom下热区数据（从后台数据库中读取），并添加到当前矢量图层进行显示，
        * 通过WCF服务来完成，与updateDataHZ方法相对应，构成数据的增删改查操作
        * Parameters:
        * Returns:
        */
        function selectDataHZ() {
            isDspHotHZ = true;
            var sqlStr = "select * from HotSpots where lev='" + curZoomHZ + "'";

            var urlStr = encodeURI("../../../js/HotSpotService.svc/GetData");

            setBtnStateHZ(true);

            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: urlStr,
                data: '{"sql":"' + sqlStr + '"}',
                success: callbackHZ
            });
        }

        /**
        * Method: callbackHZ
        * ajax调用WCF服务获取后台数据库数据的回调函数，解析返回的字串，构建
        * 矢量要素，添加到当前矢量图层
        * Parameters:
        * data-{json字符串}
        * Returns:
        */
        function callbackHZ(data) {

            var isExist = isExistOfVectLayerHZ(curZoomHZ);
            if (isExist != true) {
                vecLayerHZ = new OpenLayers.Layer.Vector(curZoomHZ.toString());
                vecLayerHZ.setVisibility(true);
                mapHZ.addLayer(vecLayerHZ);
            }
            else {
                vecLayerHZ.removeAllFeatures();
                vecLayerHZ.setVisibility(true);
            }

            if (data != null && data.d != "[{}]") {

                var rcdData = $.parseJSON(data.d);
                var vectorFeature = rcdDataToVectorHZ(rcdData);
                vecLayerHZ.addFeatures(vectorFeature);
            }

            deleteControlsHZ();
            selectControlHZ = new OpenLayers.Control.SelectFeature(vecLayerHZ, { hover: true, geometryTypes: ["OpenLayers.Geometry.Polygon"] });
            selectControlHZ.onSelect = commSelectHZ;
            selectControlHZ.onUnselect = funUnSelectHZ;
            mapHZ.addControl(selectControlHZ);
            selectControlHZ.activate();
        }

        /**
        * Method: rcdDataToVectorHZ
        * 解析json字符串，构建矢量要素
        * Parameters:
        * rcdObj-{json字符串}
        * Returns:
        *{Array(OpenLayers.Feature.Vector)}
        */
        function rcdDataToVectorHZ(rcdObj) {
            var polygonFeature = [];
            if (rcdObj != null && rcdObj.length > 0) {
                for (var i = 0; i < rcdObj.length; i++) {
                    var dotstr = rcdObj[i].coord;
                    var oid = rcdObj[i].oid;
                    var name = rcdObj[i].name;
                    var adress = rcdObj[i].paddress;
                    var pnum = rcdObj[i].pnum;
                    var dotArray = new Array(); //定义一数组
                    dotArray = dotstr.split(","); //字符分割
                    if (dotArray.length > 0) {
                        var pointList = [];
                        for (var j = 0; j < dotArray.length; j++) {

                            var newPoint = new OpenLayers.Geometry.Point(parseFloat(dotArray[j]), parseFloat(dotArray[j + 1]));
                            pointList.push(newPoint);
                            j++;
                        }
                        pointList.push(pointList[0]);

                        var linearRing = new OpenLayers.Geometry.LinearRing(pointList);
                        var att = new Object();
                        att.oid = oid;
                        att.name = name;
                        att.paddress = adress;
                        att.pnum = pnum;

                        polygonFeature.push(new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon([linearRing]), att, getFeatureStyleHZ(pnum)));
                    }
                }

            }
            return polygonFeature;
        }


        /**
        * Method: updateTextHZ
        * 根据要素属性信息，更改相关text显示信息
        * Parameters:
        * feature-{OpenLayers.Feature.Vector}
        * 矢量要素
        * Returns:
        */
        function updateTextHZ(feature) {
            if (feature != null) {
                document.getElementById("attName").value = feature.attributes.name;
                document.getElementById("attNum").value = feature.attributes.pnum;
                document.getElementById("attAdree").value = feature.attributes.paddress;
            }
        }

        /**
        * Method: setEmptyHZ
        * 更改相关text显示信息为空
        * Parameters:
        * Returns:
        */
        function setEmptyHZ() {
            document.getElementById("attName").value = "";
            document.getElementById("attNum").value = "";
            document.getElementById("attAdree").value = "";
        }

        /**
        * Method: updateRcdHZ
        * 更新要素，主要是更新要素的几何信息，并从后台数据库中更新该要素对应的相关记录
        * Parameters:
        * feature-{OpenLayers.Feature.Vector}
        * 矢量要素
        * Returns:
        */
        function updateRcdHZ(feature) {
            if (feature != null) {
                var geom = feature.geometry;
                var att = feature.attributes;
                var oid = feature.attributes.oid;
                if (oid === undefined) {
                    oid = feature.id;
                }
                var dotStr = "";
                if (geom != null && geom.components.length > 0) {
                    for (var i = 0; i < geom.components[0].components.length; i++) {
                        if (i == geom.components[0].components.length - 1) {
                            dotStr += geom.components[0].components[i].toShortString();
                        }
                        else {
                            dotStr += geom.components[0].components[i].toShortString();
                            dotStr += ",";
                        }
                    }
                }
                var m_name = document.getElementById("attName").value;
                var m_pnum = document.getElementById("attNum").value;
                var m_paddress = document.getElementById("attAdree").value;

                var valstr = " pnum='" + m_pnum + "'," + " paddress='" + m_paddress + "'," + " coord='" + dotStr + "'," + "name='" + m_name + "',lev='" + curZoomHZ + "'  WHERE oid='" + oid + "'";
                updateDataHZ("update", valstr);
            }
        }

        /**
        * Method: deleteSelectHZ
        * 删除所选择的要素，并从后台数据库中清空该要素对应的相关记录
        * Parameters:
        * feature-{OpenLayers.Feature.Vector}
        * 矢量要素
        * Returns:
        */
        function deleteSelectHZ(feature) {
            if (feature != null) {
                deleteRcdHZ(feature);
            }
            setEmptyHZ();
        }

        /**
        * Method: attSelectHZ
        * 根据所选择的要素更改相关text显示信息
        * Parameters:
        * feature-{OpenLayers.Feature.Vector}
        * 矢量要素
        * Returns:
        */
        function attSelectHZ(feature) {
            updateTextHZ(feature);
        }

        /**
        * Method: changeAttHZ
        * textChange响应事件，修改相关的属性信息，并更改数据库中的对应信息
        * Parameters:
        * Returns:
        */
        function changeAttHZ() {
            if (currentStateHZ == "modifyAtt") {
                var features = this.vecLayerHZ.selectedFeatures;
                if (features != null && features.length > 0) {
                    var m_fea = features[0];
                    m_fea.attributes.name = document.getElementById("attName").value;
                    m_fea.attributes.pnum = document.getElementById("attNum").value;
                    m_fea.attributes.paddress = document.getElementById("attAdree").value;

                    if (m_fea.style != null) {
                        m_fea.style.fillColor = getColorNumHZ(m_fea.attributes.pnum);
                    }
                    updateRcdHZ(m_fea);
                }

            }
        }

        /**
        * Method: funUnSelectHZ
        * selectFeature的UnSelect响应事件，移除pop，修改要素显示风格（修改为不可见）
        * Parameters:
        * feature-{OpenLayers.Feature.Vector}
        * Returns:
        */
        function funUnSelectHZ(feature) {
            setEmptyHZ();
            if (feature != null) {
                setFeatureStyleHZ(feature, false);

                var len = mapHZ.popups.length;
                for (var i = len - 1; i >= 0; i--) {
                    mapHZ.removePopup(mapHZ.popups[i]);
                }
            }
        }

        /**
        * Method: commSelectHZ
        * selectFeature的Select响应事件，添加pop，修改要素显示风格（修改为不可见）
        * Parameters:
        * feature-{OpenLayers.Feature.Vector}
        * 矢量要素
        * Returns:
        */
        function commSelectHZ(feature) {
            setEmptyHZ();

            if (feature != null) {
                //  setFeatureStyleHZ(feature);
                setFeatureStyleHZ(feature, true);
                var att = feature.attributes;
                document.getElementById("attName").value = att.name;
                document.getElementById("attNum").value = att.pnum;
                document.getElementById("attAdree").value = att.paddress;

                curPosHZ = mapHZ.getLonLatFromPixel(mousePosControlHZ.lastXy);

                var popupContentHTMLStr = "名称:" + att.name + "<br>";
                popupContentHTMLStr += "人数:" + att.pnum + "<br>";
                popupContentHTMLStr += "地址:" + att.paddress + "<br>";
                var popupContentHTML = '<div>' + popupContentHTMLStr + '</div>';
                pop = new OpenLayers.Popup("chicken", curPosHZ, new OpenLayers.Size(80, 80), popupContentHTML, false);
                pop.setOpacity(0.7);
                pop.keepInMap = true;
                pop.panMapIfOutOfView = true;
                pop.autoSize = true;
                mapHZ.addPopup(pop, true);
                pop.show();
            }
            else {
                return;
            }
        }

        /**
        * Method: deleteRcdHZ
        * 删除要素响应事件，实现矢量图层和后台数据库要素记录的删除
        * Parameters:
        * feature-{OpenLayers.Feature.Vector}
        * 矢量要素
        * Returns:
        */
        function deleteRcdHZ(feature) {

            if (feature != null) {

                var geom = feature.geometry;
                var att = feature.attributes;
                var oid = feature.attributes.oid;
                if (oid === undefined) {
                    oid = feature.id;
                }

                if (oid != null) {
                    var valstr = "'" + oid + "'";
                    updateDataHZ("delete", valstr);
                }

                vecLayerHZ.removeFeatures([feature]);
            }
        }

        /**
        * Method: insertRcdHZ
        * 添加要素响应事件，实现矢量图层和后台数据库要素记录的添加
        * Parameters:
        * feature-{OpenLayers.Feature.Vector}
        * 矢量要素
        * Returns:
        */
        function insertRcdHZ(feature) {

            if (feature != null) {

                this.m_mFeatureHZ = feature;
                var oid = feature.id;
                var geom = feature.geometry;
                feature.style = getFeatureStyleHZ(0);

                var m_name = document.getElementById("attName").value;
                var m_pnum = document.getElementById("attNum").value;
                var m_paddress = document.getElementById("attAdree").value;

                var att = { 'oid': oid, 'name': m_name, 'pnum': m_pnum, 'paddress': m_paddress };
                feature.attributes = OpenLayers.Util.extend(feature.attributes, att);

                var dotStr = "";
                if (geom != null && geom.components.length > 0) {
                    for (var i = 0; i < geom.components[0].components.length; i++) {
                        if (i == geom.components[0].components.length - 1) {
                            dotStr += geom.components[0].components[i].toShortString();
                        }
                        else {
                            dotStr += geom.components[0].components[i].toShortString();
                            dotStr += ",";
                        }
                    }
                }
                var valstr = "'" + dotStr + "'," + "'" + m_name + "'," + "'" + oid + "'," + "'" + curZoomHZ + "'," + "'" + m_pnum + "'," + "'" + m_paddress + "'";
                updateDataHZ("insert", valstr);
                setEmptyHZ();

            }

        }

        /**
        * Method: toggleControlHZ
        * button响应事件
        * Parameters:
        * element-{DOM对象}
        * Returns:
        */
        function toggleControlHZ(element) {
            deactiveControlsHZ();
            deleteControlsHZ();
            setEmptyHZ();
            switch (element.id) {
                case "Button4":  //添加热区

                    this.isDspHotHZ = true;
                    dispFearuresOneZoomHZ(true);
                    addControlsHZ(vecLayerHZ, mapHZ, "add");
                    // document.getElementById("Button2").disabled = false;
                    currentStateHZ = "add";
                    setBtnStateHZ(true);
                    break;
                case "Button3":  //删除热区
                    this.isDspHotHZ = true;
                    dispFearuresOneZoomHZ(true);
                    addControlsHZ(vecLayerHZ, mapHZ, "delete");
                    //    document.getElementById("Button2").disabled = true;
                    currentStateHZ = "delete";
                    setBtnStateHZ(true);
                    break;
                case "Button5":  //更新热区
                    this.isDspHotHZ = true;
                    dispFearuresOneZoomHZ(true);
                    addControlsHZ(vecLayerHZ, mapHZ, "modify");
                    //   document.getElementById("Button2").disabled = false;
                    currentStateHZ = "modify";
                    setBtnStateHZ(true);
                    break;
                case "Button2":  //更新热区属性
                    this.isDspHotHZ = true;
                    dispFearuresOneZoomHZ(true);
                    addControlsHZ(vecLayerHZ, mapHZ, "modifyAtt");
                    currentStateHZ = "modifyAtt";
                    setBtnStateHZ(false);
                    break;
            }
        }

        /**
        * Method: OnDocumentClickHZ
        * 浏览器事件响应，实现弹出颜色拾取对话框
        * Parameters:
        * Returns:
        */
        function OnDocumentClickHZ() {
            srcElementHZ = event.srcElement;
            if (srcElementHZ.alt == "popColorDlg") {
                showColorPicker(document.getElementById(srcElementHZ.id), document.getElementById(srcElementHZ.id), funCallHZ);
            }
        }

        /**
        * Method: funCallHZ
        * 颜色拾取对话框回调函数，实现text的背景色修改
        * Parameters:
        * Returns:
        */
        function funCallHZ() {
            document.getElementById(srcElementHZ.id).style.background = srcElementHZ.value;
            selectDataHZ();
        }

        /**
        * Method: deactiveControlsHZ
        * 
        * Parameters:
        * Returns:
        */
        function deactiveControlsHZ() {
            if (ModifyControlHZ != null && ModifyControlHZ.active) {
                ModifyControlHZ.deactivate();
            }
            if (drawControlHZ != null && drawControlHZ.active) {
                drawControlHZ.deactivate();
            }
            if (selectControlHZ != null && selectControlHZ.active) {
                selectControlHZ.deactivate();
            }

            if (deleteControlHZ != null && deleteControlHZ.active) {
                deleteControlHZ.deactivate();
            }
            if (modifyAttControlHZ != null && modifyAttControlHZ.active) {
                modifyAttControlHZ.deactivate();
            }
        }

        /**
        * Method: deleteControlsHZ
        * 删除所有控件
        * Parameters:
        * Returns:
        */
        function deleteControlsHZ() {
            deactiveControlsHZ();
            if (ModifyControlHZ != null) {
                mapHZ.removeControl(ModifyControlHZ);
                ModifyControlHZ = null;
                //  ModifyControlHZ.destroy();
            }

            if (drawControlHZ != null) {
                mapHZ.removeControl(drawControlHZ);
                //  drawControlHZ.destroy();
                drawControlHZ = null;
            }

            if (selectControlHZ != null) {
                mapHZ.removeControl(selectControlHZ);
                selectControlHZ = null;
                //  selectControlHZ.destroy();
            }

            if (deleteControlHZ != null) {
                mapHZ.removeControl(deleteControlHZ);
                deleteControlHZ = null;
                //  deleteControlHZ.destroy();
            }

            if (modifyAttControlHZ != null) {
                mapHZ.removeControl(modifyAttControlHZ);
                modifyAttControlHZ = null;
                //  deleteControlHZ.destroy();
            }
        }
        /**
        * Method: addControlsHZ
        * 根据操作类型添加控件到矢量图层
        * Parameters:
        * m_vectLayer-{OpenLayers.Layer.Vector 矢量图层}
        * m_map-{OpenLayers.Map 地图容器}
        * m_type-{操作类型：modify、add、display、delete、modifyAtt}
        * Returns:
        */
        function addControlsHZ(m_vectLayer, m_map, m_type) {
            deleteControlsHZ();
            if (m_vectLayer != null && m_map != null) {
                switch (m_type) {
                    case "modify":
                        ModifyControlHZ = new OpenLayers.Control.ModifyFeature(m_vectLayer);
                        ModifyControlHZ.onModification = updateRcdHZ;
                        ModifyControlHZ.onModificationStart = updateTextHZ;
                        m_map.addControl(ModifyControlHZ);
                        ModifyControlHZ.activate();
                        break;
                    case "add":
                        drawControlHZ = new OpenLayers.Control.DrawFeature(m_vectLayer, OpenLayers.Handler.Polygon);
                        drawControlHZ.featureAdded = insertRcdHZ;
                        m_map.addControl(drawControlHZ);
                        drawControlHZ.activate();
                        break;
                    case "display":
                        selectControlHZ = new OpenLayers.Control.SelectFeature(m_vectLayer, { onSelect: commSelectHZ, hover: true, geometryTypes: ["OpenLayers.Geometry.Polygon"], selectStyle: OpenLayers.Feature.Vector.style["select"] });
                        m_map.addControl(selectControlHZ);
                        selectControlHZ.activate();
                        break;
                    case "delete":
                        deleteControlHZ = new OpenLayers.Control.SelectFeature(m_vectLayer, { selectStyle: OpenLayers.Feature.Vector.style["select"] });
                        deleteControlHZ.onSelect = deleteSelectHZ;
                        m_map.addControl(deleteControlHZ);
                        deleteControlHZ.activate();
                        break;
                    case "modifyAtt":
                        modifyAttControlHZ = new OpenLayers.Control.SelectFeature(m_vectLayer, { geometryTypes: ["OpenLayers.Geometry.Polygon"], selectStyle: OpenLayers.Feature.Vector.style["select"] });
                        modifyAttControlHZ.onSelect = attSelectHZ;
                        m_map.addControl(modifyAttControlHZ);
                        modifyAttControlHZ.activate();
                        break;
                }
            }
        }

        /**
        * Method: styleCloneHZ
        * 对象克隆
        * Parameters:
        * myObj-{object}
        * Returns:
        *{object：返回克隆对象}
        */
        function styleCloneHZ(myObj) {
            if (typeof (myObj) != 'object') return myObj;
            if (myObj == null) return myObj;

            var myNewObj = new Object();

            for (var i in myObj)
                myNewObj[i] = MyCloneHZ(myObj[i]);

            return myNewObj;
        }

        function MyCloneHZ(myObj) {
            if (typeof (myObj) != 'object') return myObj;
            if (myObj == null) return myObj;

            var myNewObj = new Object();

            for (var i in myObj)
                myNewObj[i] = MyCloneHZ(myObj[i]);

            return myNewObj;
        }

        /**
        * Method: getColorNumHZ
        * 根据人口数量获取颜色值
        * Parameters:
        * num-{Number}
        * Returns:
        *{string：颜色值字符串，以"#"号开头}
        */
        function getColorNumHZ(num) {
            var colorStr = null;

            if (num >= 0 && num < 1000) {
                colorStr = document.getElementById("color1").value;
            }
            else if (num >= 1000 && num < 2000) {
                colorStr = document.getElementById("color2").value;
            }
            else if (num >= 2000 && num < 3000) {
                colorStr = document.getElementById("color3").value;
            }
            else if (num >= 3000 && num < 4000) {
                colorStr = document.getElementById("color4").value;
            }
            else if (num >= 4000 && num < 5000) {
                colorStr = document.getElementById("color5").value;
            }
            else {
                colorStr = document.getElementById("color6").value;
            }
            return colorStr;
        }

        /**
        * Method: getFeatureStyleHZ
        * 根据人口数量克隆要素的显示风格
        * Parameters:
        * num-{Number}
        * Returns:
        *{object：要素显示风格对象}
        */
        function getFeatureStyleHZ(num) {

            var colorStr = null;

            if (num >= 0 && num < 1000) {
                colorStr = document.getElementById("color1").value;
            }
            else if (num >= 1000 && num < 2000) {
                colorStr = document.getElementById("color2").value;
            }
            else if (num >= 2000 && num < 3000) {
                colorStr = document.getElementById("color3").value;
            }
            else if (num >= 3000 && num < 4000) {
                colorStr = document.getElementById("color4").value;
            }
            else if (num >= 4000 && num < 5000) {
                colorStr = document.getElementById("color5").value;
            }
            else {
                colorStr = document.getElementById("color6").value;
            }
            var fStyle = this.styleCloneHZ(OpenLayers.Feature.Vector.style["default"]);
            fStyle.fillColor = colorStr;
            fStyle.fillOpacity = 0;
            fStyle.strokeOpacity = 0;
            return fStyle;
        }

        /**
        * Method: setFeatureStyleHZ
        * 根据要素显示与否，设置要素的显示风格(填充透明度和边线透明度)
        * Parameters:
        * fea-{OpenLayers.Feature.Vector}
        * isDisp-{Boolean，true/false}
        * Returns:
        */
        function setFeatureStyleHZ(fea, isDisp) {
            if (fea != null) {
                if (isDisp) {
                    fea.style.fillOpacity = 0;
                    fea.style.strokeOpacity = 0;
                }
                else {
                    fea.style.fillOpacity = 0.6;
                    fea.style.strokeOpacity = 1;
                }
            }
        }

        function getNoneStyleHZ() {
            return styleCloneHZ(OpenLayers.Feature.Vector.style["delete"]);
        }

        /**
        * Method: dispFearuresOneZoomHZ
        * 根据要素显示与否，控制一个Zoom等级下要素的显示风格
        * Parameters:
        * isDisp-{Boolean，true/false}
        * Returns:
        */
        function dispFearuresOneZoomHZ(isDsp) {
            if (vecLayerHZ != null) {
                if (vecLayerHZ.features != null) {
                    if (isDsp == true) {
                        for (var i = 0; i < vecLayerHZ.features.length; i++) {
                            vecLayerHZ.features[i].style.fillOpacity = 0.6;
                            vecLayerHZ.features[i].style.strokeOpacity = 1;
                        }
                    }
                    else {
                        for (var m = 0; m < vecLayerHZ.features.length; i++) {
                            vecLayerHZ.features[m].style.fillOpacity = 0;
                            vecLayerHZ.features[m].style.strokeOpacity = 0;
                        }
                    }
                    vecLayerHZ.redraw();
                }
            }
        }

        /**
        * Method: setBtnStateHZ
        * 根据操作状态，控制显示属性字段值的文本框的是否可编辑属性
        * Parameters:
        * state-{Boolean，true/false}
        * Returns:
        */
        function setBtnStateHZ(state) {
            if (state == true) {
                document.getElementById("attName").setAttribute("disabled", false);
                document.getElementById("attNum").setAttribute("disabled", false);
                document.getElementById("attAdree").setAttribute("disabled", false);
            }
            else {
                document.getElementById("attName").removeAttribute("disabled");
                document.getElementById("attNum").removeAttribute("disabled");
                document.getElementById("attAdree").removeAttribute("disabled");
            }
        }
        function closebackHZ() {
            this.isHZCheck = false;
//            mapHZ.removeLayer(vecLayerHZ);
//            mapHZ.removeLayer(tileLayerHZ);
//            mapHZ.removeControl(mousePosControlHZ);
        }
