
window.Milstd = {};

/* * 
*该类实现了各种类型的指南针的算法
* 
*/
Milstd.Compass = OpenLayers.Class({
    getCrossVect: function (arg, CrossType) {
        Milstd.Flag.prototype.CreateNewVertices(arg);
        // this.CreateNewVertices(arg);
        var feaLin = null;
        var dots = new Array();
        if (arg != null && arg.length >= 2) {
            dots.push(arg[0]);
            dots.push(arg[1]);

            var parseDots = null;
            var multyLine = null;
            switch (CrossType) {
                case "ArrowCross":         //十字箭头指北针
                    parseDots = this.GetArrowCrossDots(dots);
                    break;
                case "CircleClosedangle":  //圆形尖角指北针
                    parseDots = this.GetCircleClosedangleDots(dots);
                    break;
                case "Closedangle":        //尖角指北针
                    parseDots = this.GetClosedangleDots(dots);
                    break;
                case "DoubleClosedangle":  //双向尖角指北针
                    parseDots = this.GetDoubleClosedangleDots(dots);
                    break;
                case "Fourstar":           //四角指北针
                    parseDots = this.GetFourstarDots(dots);
                    break;
                case "Rhombus":            //菱形指北针
                    parseDots = this.GetRhombusDots(dots);
                    break;
                case "SameDirectionClosedangle": //同向尖角指北针
                    parseDots = this.GetSameDirectionClosedangleDots(dots);
                    break;
                case "Triangle":                 //三角指北针
                    parseDots = this.GetTriangleDots(dots);
                    break;
                case "Vane":                     //风向标指北针
                    parseDots = this.GetVaneDots(dots);
                    break;

            }
            var geometryArr = new Array();
            if (parseDots != null && parseDots.length > 0) {
                for (var i = 0; i < parseDots.length; i++) {
                    switch (CrossType) {
                        case "ArrowCross":
                            if (i == (parseDots.length - 1)) {
                                //绘制中间的“十字”，以区块实现
                                geometryArr.push(new OpenLayers.Geometry.LinearRing(parseDots[i][0]));
                            }
                            else {
                                geometryArr.push(new OpenLayers.Geometry.LineString(parseDots[i][0]));
                            }
                            break;
                        case "CircleClosedangle":
                            if (i == (parseDots.length - 1)) {
                                geometryArr.push(new OpenLayers.Geometry.LineString(parseDots[i][0]));
                            }
                            else {
                                if (i % 2 == 0) {
                                    geometryArr.push(new OpenLayers.Geometry.LineString(parseDots[i][0]));
                                }
                                else {
                                    geometryArr.push(new OpenLayers.Geometry.LinearRing(parseDots[i][0]));
                                }
                            }
                            break;
                        case "Closedangle":
                            if (i % 2 == 0) {
                                geometryArr.push(new OpenLayers.Geometry.LineString(parseDots[i][0]));
                            }
                            else {
                                geometryArr.push(new OpenLayers.Geometry.LinearRing(parseDots[i][0]));
                            }
                            break;
                        case "DoubleClosedangle":  //双向尖角指北针
                            if (i == 1) {
                                geometryArr.push(new OpenLayers.Geometry.LinearRing(parseDots[i][0]));
                            }
                            else {
                                geometryArr.push(new OpenLayers.Geometry.LineString(parseDots[i][0]));
                            }
                            break;
                        case "Fourstar":          //四角指北针
                            if (i % 2 == 0) {
                                geometryArr.push(new OpenLayers.Geometry.LineString(parseDots[i][0]));
                            }
                            else {
                                geometryArr.push(new OpenLayers.Geometry.LinearRing(parseDots[i][0]));
                            }
                            break;
                        case "Rhombus":           //菱形指北针
                            if (i == 1) {
                                geometryArr.push(new OpenLayers.Geometry.LinearRing(parseDots[i][0]));
                            }
                            else {
                                geometryArr.push(new OpenLayers.Geometry.LineString(parseDots[i][0]));
                            }
                            break;
                        case "SameDirectionClosedangle": //同向尖角指北针
                            if (i == 1) {
                                geometryArr.push(new OpenLayers.Geometry.LinearRing(parseDots[i][0]));
                            }
                            else {
                                geometryArr.push(new OpenLayers.Geometry.LineString(parseDots[i][0]));
                            }
                            break;
                        case "Triangle":                 //三角指北针
                            if (i == 1 || i == 4) {
                                geometryArr.push(new OpenLayers.Geometry.LinearRing(parseDots[i][0]));
                            }
                            else {
                                geometryArr.push(new OpenLayers.Geometry.LineString(parseDots[i][0]));
                            }
                            break;
                        case "Vane":                     //风向标指北针
                            if (i == 1) {
                                geometryArr.push(new OpenLayers.Geometry.LineString(parseDots[i][0]));
                            }
                            else {
                                geometryArr.push(new OpenLayers.Geometry.LinearRing(parseDots[i][0]));
                            }
                            break;
                    }

                }
            }
            multyLine = new Milstd.MilstdMultyLine(geometryArr, dots, CrossType);
            feaLin = new OpenLayers.Feature.Vector(multyLine, null, null);
        }
        return feaLin;
    },
    styleClone: function (myObj) {
        if (typeof (myObj) != 'object') return myObj;
        if (myObj == null) return myObj;
        var myNewObj = new Object();
        for (var i in myObj)
            myNewObj[i] = MyClone(myObj[i]);
        return myNewObj;
    },
    getCrossFromVect: function (vectLin, CrossType) {
        var feaLin = null;
        if (vectLin == null)
            return null;
        if (vectLin.geometry.CLASS_NAME == "OpenLayers.Geometry.LinearRing" || vectLin.geometry.CLASS_NAME == "OpenLayers.Geometry.LineString") {
            var dots = vectLin.geometry.getVertices();
            if (dots != null) {
                if (dots.length >= 2) {
                    if (Milstd.commonFun.prototype.geomEquals(dots[dots.length - 1], dots[dots.length - 2])) {
                        dots.pop(dots[length - 1]);
                    }
                }
            }
            feaLin = this.getCrossVect(dots, CrossType);
        }
        return feaLin;
    },
    GetArrowCrossDots: function (arg1) {

        if (arg1 == null || arg1.length < 2) {
            return null;
        }

        var width = Math.abs(arg1[1].x - arg1[0].x);
        var height = Math.abs(arg1[1].y - arg1[0].y);
        //绘制一个字母“N”

        var locN = new Array();
        var loc1 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 15, arg1[0].y - height / 16 * 1);
        locN.push(loc1);
        var loc2 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 15, arg1[0].y);
        locN.push(loc2);
        var loc3 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 17, arg1[0].y - height / 16 * 1);
        locN.push(loc3);
        var loc4 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 17, arg1[0].y);
        locN.push(loc4);


        //绘制一个字母“W”

        var locW = new Array();
        var loc5 = new OpenLayers.Geometry.Point(arg1[0].x, arg1[0].y - height / 32 * 15);
        locW.push(loc5);
        var loc6 = new OpenLayers.Geometry.Point(arg1[0].x + width / 128 * 3, arg1[0].y - height / 32 * 17);
        locW.push(loc6);
        var loc7 = new OpenLayers.Geometry.Point(arg1[0].x + width / 128 * 6, arg1[0].y - height / 32 * 15);
        locW.push(loc7);
        var loc8 = new OpenLayers.Geometry.Point(arg1[0].x + width / 128 * 9, arg1[0].y - height / 32 * 17);
        locW.push(loc8);
        var loc9 = new OpenLayers.Geometry.Point(arg1[0].x + width / 128 * 12, arg1[0].y - height / 32 * 15);
        locW.push(loc9);

        //绘制一个字母“E”
        var locE = new Array();
        var loc10 = new OpenLayers.Geometry.Point(arg1[0].x + width, arg1[0].y - height / 32 * 15);
        var loc11 = new OpenLayers.Geometry.Point(arg1[0].x + width / 16 * 15, arg1[0].y - height / 32 * 15);
        var loc12 = new OpenLayers.Geometry.Point(arg1[0].x + width / 16 * 15, arg1[0].y - height / 32 * 17);
        var loc13 = new OpenLayers.Geometry.Point(arg1[0].x + width, arg1[0].y - height / 32 * 17);
        var loc14 = new OpenLayers.Geometry.Point(arg1[0].x + width / 16 * 15, arg1[0].y - height / 2);
        var loc15 = new OpenLayers.Geometry.Point(arg1[0].x + width / 50 * 48, arg1[0].y - height / 2);
        locE.push(loc10);
        locE.push(loc11);
        locE.push(loc14);
        locE.push(loc15);
        locE.push(loc14);
        locE.push(loc12);
        locE.push(loc13);
        //绘制字母“S”
        //        var locS = new Array();
        //        var loc16 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 17, arg1[0].y - height / 32 * 30);
        //        locS.push(loc16);
        //        var loc17 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[0].y - height / 32 * 29);
        //        locS.push(loc17);
        //        var loc18 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[0].y - height / 32 * 30);
        //        locS.push(loc18);
        //        var loc19 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 17, arg1[0].y - height / 32 * 31);
        //        locS.push(loc19);
        //        var loc20 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[0].y - height);
        //        locS.push(loc20);
        //        var loc21 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[0].y - height / 32 * 31);
        //        locS.push(loc21);

        var pnt4 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[1].y + height / 32);
        var pnt1 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2 + width / 32, arg1[1].y + height / 32 + height / 64);
        var pnt3 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2 + width / 32 - 2 * width / 32, arg1[1].y + height / 32 + height / 64);
        var pnt2 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[1].y + height / 32 + height / 32);
        var pnt6 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[1].y + height / 32 - height / 32);
        var pnt5 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2 + width / 32, arg1[1].y + height / 32 + height / 64 - height / 32);
        var pnt7 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2 + width / 32 - width / 16, arg1[1].y + height / 32 + height / 64 - height / 32);
        var sLoc = new Array();
        sLoc.push(pnt1);
        sLoc.push(pnt2);
        sLoc.push(pnt3);
        sLoc.push(pnt4);
        sLoc.push(pnt5);
        sLoc.push(pnt6);
        sLoc.push(pnt7);
        var sBezier = Milstd.commonFun.prototype.getBSplinePoints(sLoc, 2);

        //绘制十字箭头
        var locImg = new Array();
        var loc22 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[0].y - height / 16 * 2);
        locImg.push(loc22);
        var loc23 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 18, arg1[0].y - height / 16 * 4);
        locImg.push(loc23);
        var loc24 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 17, arg1[0].y - height / 16 * 4);
        locImg.push(loc24);
        var loc25 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 17, arg1[0].y - height / 32 * 15);
        locImg.push(loc25);
        var loc26 = new OpenLayers.Geometry.Point(arg1[0].x + width / 16 * 12, arg1[0].y - height / 32 * 15);
        locImg.push(loc26);
        var loc27 = new OpenLayers.Geometry.Point(arg1[0].x + width / 16 * 12, arg1[0].y - height / 32 * 14);
        locImg.push(loc27);
        var loc28 = new OpenLayers.Geometry.Point(arg1[0].x + width / 16 * 14, arg1[0].y - height / 2);
        locImg.push(loc28);
        var loc29 = new OpenLayers.Geometry.Point(arg1[0].x + width / 16 * 12, arg1[0].y - height / 32 * 18);
        locImg.push(loc29);
        var loc30 = new OpenLayers.Geometry.Point(arg1[0].x + width / 16 * 12, arg1[0].y - height / 32 * 17);
        locImg.push(loc30);
        var loc31 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 17, arg1[0].y - height / 32 * 17);
        locImg.push(loc31);
        var loc32 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 17, arg1[0].y - height / 16 * 12);
        locImg.push(loc32);
        var loc33 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 18, arg1[0].y - height / 16 * 12);
        locImg.push(loc33);
        var loc34 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[0].y - height / 16 * 14);
        locImg.push(loc34);
        var loc35 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 14, arg1[0].y - height / 16 * 12);
        locImg.push(loc35);
        var loc36 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 15, arg1[0].y - height / 16 * 12);
        locImg.push(loc36);
        var loc37 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 15, arg1[0].y - height / 32 * 17);
        locImg.push(loc37);
        var loc38 = new OpenLayers.Geometry.Point(arg1[0].x + width / 16 * 4, arg1[0].y - height / 32 * 17);
        locImg.push(loc38);
        var loc39 = new OpenLayers.Geometry.Point(arg1[0].x + width / 16 * 4, arg1[0].y - height / 32 * 18);
        locImg.push(loc39);
        var loc40 = new OpenLayers.Geometry.Point(arg1[0].x + width / 16 * 2, arg1[0].y - height / 2);
        locImg.push(loc40);
        var loc41 = new OpenLayers.Geometry.Point(arg1[0].x + width / 16 * 4, arg1[0].y - height / 32 * 14);
        locImg.push(loc41);
        var loc42 = new OpenLayers.Geometry.Point(arg1[0].x + width / 16 * 4, arg1[0].y - height / 32 * 15);
        locImg.push(loc42);
        var loc43 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 15, arg1[0].y - height / 32 * 15);
        locImg.push(loc43);
        var loc44 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 15, arg1[0].y - height / 16 * 4);
        locImg.push(loc44);
        var loc45 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 14, arg1[0].y - height / 16 * 4);
        locImg.push(loc45);

        locImg.push(loc22);

        var locArr = new Array();
        for (var i = 0; i < 5; i++) {
            locArr[i] = new Array();
        }
        locArr[0].push(locN);
        locArr[1].push(locW);
        locArr[2].push(locE);
        locArr[3].push(sBezier);
        locArr[4].push(locImg);

        return locArr;
    },
    GetCircleClosedangleDots: function (arg1) {

        if (arg1 == null || arg1.length < 2) {
            return null;
        }

        var width = Math.abs(arg1[1].x - arg1[0].x);
        var height = Math.abs(arg1[1].y - arg1[0].y);
        var loc1 = null;
        var loc2 = null;
        var loc3 = null;
        var loc4 = null;
        var loc5 = new Array();

        //绘制N
        loc1 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 15, arg1[0].y - height / 16);
        loc5.push(loc1);
        loc2 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 15, arg1[0].y);
        loc5.push(loc2);
        loc3 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 17, arg1[0].y - height / 16);
        loc5.push(loc3);
        loc4 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 17, arg1[0].y);
        loc5.push(loc4);



        //绘制菱形
        var loc6 = null;
        var loc7 = null;
        var loc8 = null;
        var loc9 = null;
        var loc10 = null;

        var loc11 = new Array();
        loc6 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[0].y - height / 16 * 2);
        loc11.push(loc6);
        loc7 = new OpenLayers.Geometry.Point(arg1[0].x + width / 64 * 15, arg1[0].y - height);
        loc11.push(loc7);
        loc8 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 15, arg1[0].y - height / 32 * 28);
        loc11.push(loc8);
        loc9 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 17, arg1[0].y - height / 32 * 28);
        loc11.push(loc9);
        loc10 = new OpenLayers.Geometry.Point(arg1[0].x + width / 64 * 49, arg1[0].y - height);
        loc11.push(loc10);

        loc11.push(loc6);

        //绘制横线
        var loc12 = null;
        var loc13 = null;
        var loc14 = new Array();
        var len1 = arg1[0].x + width / 2 - height / 20 * 9;
        var len2 = arg1[0].x + width / 2 + height / 20 * 9;

        loc12 = new OpenLayers.Geometry.Point(len1, arg1[0].y - height / 16 * 9);
        loc13 = new OpenLayers.Geometry.Point(len2, arg1[0].y - height / 16 * 9);

        loc14.push(loc12);
        loc14.push(loc13);

        //绘制圆
        var loc16 = null;
        var loc17 = null;
        var loc18 = 0;
        var loc19 = 0;
        var loc20 = 0;
        var loc21 = 0;
        var loc22 = 0;
        var loc23 = new Array();
        var loc24 = 0;

        loc16 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[0].y - height / 16 * 9);
        loc17 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[0].y - height / 5 * 1);
        loc18 = loc16.distanceTo(loc17);
        while (loc24 < 500) {
            loc19 = Math.sin(Math.PI * 2 * loc24 / 500);
            loc20 = Math.cos(Math.PI * 2 * loc24 / 500);
            loc21 = loc16.x + loc18 * loc19;
            loc22 = loc16.y + loc18 * loc20;
            loc23.push(new OpenLayers.Geometry.Point(loc21, loc22));
            ++loc24;
        }
        loc23.push(loc23[0]);

        var loc25 = new Array();
        for (var i = 0; i < 4; i++) {
            loc25[i] = new Array();
        }
        loc25[0].push(loc5);
        loc25[1].push(loc11);
        loc25[2].push(loc14);
        loc25[3].push(loc23);

        return loc25;
    },
    GetClosedangleDots: function (arg1) {

        if (arg1 == null || arg1.length < 2) {
            return null;
        }
        var loc4 = new Array();
        var width = Math.abs(arg1[1].x - arg1[0].x);
        var height = Math.abs(arg1[1].y - arg1[0].y);
        var loc1 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[0].y);
        loc4.push(loc1);
        var loc2 = new OpenLayers.Geometry.Point(arg1[0].x + width, arg1[0].y - height);
        loc4.push(loc2);
        var loc3 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[0].y - height / 4 * 3);
        loc4.push(loc3);
        //  loc4.push(loc1);


        var loc8 = new Array();
        var loc5 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[0].y);
        loc8.push(loc5);
        var loc6 = new OpenLayers.Geometry.Point(arg1[0].x, arg1[0].y - height);
        loc8.push(loc6);
        var loc7 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[0].y - height / 4 * 3);
        loc8.push(loc7);

        var loc9 = new Array();
        for (var i = 0; i < 2; i++) {
            loc9[i] = new Array();
        }
        loc9[0].push(loc4);
        loc9[1].push(loc8);

        return loc9;
    },
    GetDoubleClosedangleDots: function (arg1) {
        if (arg1 == null || arg1.length < 2) {
            return null;
        }
        var width = Math.abs(arg1[1].x - arg1[0].x);
        var height = Math.abs(arg1[1].y - arg1[0].y);
        var loc1 = null;
        var loc2 = null;
        var loc3 = null;
        var loc4 = null;

        var loc5 = new Array();

        //绘制N
        loc1 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 15, arg1[0].y - height / 16);
        loc5.push(loc1);
        loc2 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 15, arg1[0].y);
        loc5.push(loc2);
        loc3 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 17, arg1[0].y - height / 16);
        loc5.push(loc3);
        loc4 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 17, arg1[0].y);
        loc5.push(loc4);

        //绘制菱形
        var loc6 = null;
        var loc7 = null;
        var loc8 = null;
        var loc9 = null;
        var loc10 = null;
        var loc11 = new Array();
        loc6 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[0].y - height / 16 * 2);
        loc11.push(loc6);
        loc7 = new OpenLayers.Geometry.Point(arg1[0].x, arg1[0].y - height / 10 * 7);
        loc11.push(loc7);
        loc8 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 13, arg1[0].y - height / 32 * 18);
        loc11.push(loc8);
        loc9 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 19, arg1[0].y - height / 32 * 18);
        loc11.push(loc9);
        loc10 = new OpenLayers.Geometry.Point(arg1[0].x + width, arg1[0].y - height / 10 * 7);
        loc11.push(loc10);
        //绘制相反方向的菱形
        var loc12 = null;
        var loc13 = null;
        var loc14 = null;
        var loc15 = null;
        var loc16 = new Array();
        loc12 = new OpenLayers.Geometry.Point(arg1[0].x, arg1[0].y - height / 10 * 3);
        loc16.push(loc12);
        loc13 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[0].y - height / 8 * 7);
        loc16.push(loc13);
        loc14 = new OpenLayers.Geometry.Point(arg1[0].x + width, arg1[0].y - height / 10 * 3);
        loc16.push(loc14);
        loc15 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[0].y - height / 10 * 7);
        loc16.push(loc15);
        loc16.push(loc12);

        //        //绘制字母“S”
        //        var locS = new Array();
        //        var loc17 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 17, arg1[0].y - height / 32 * 30);
        //        locS.push(loc17);
        //        var loc18 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[0].y - height / 32 * 29);
        //        locS.push(loc18);
        //        var loc19 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[0].y - height / 32 * 30);
        //        locS.push(loc19);
        //        var loc20 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 17, arg1[0].y - height / 32 * 31);
        //        locS.push(loc20);
        //        var loc21 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[0].y - height);
        //        locS.push(loc21);
        //        var loc22 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[0].y - height / 32 * 31);
        //        locS.push(loc22);

        var pnt4 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[1].y + height / 32);
        var pnt1 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2 + width / 32, arg1[1].y + height / 32 + height / 64);
        var pnt3 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2 + width / 32 - 2 * width / 32, arg1[1].y + height / 32 + height / 64);
        var pnt2 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[1].y + height / 32 + height / 32);
        var pnt6 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[1].y + height / 32 - height / 32);
        var pnt5 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2 + width / 32, arg1[1].y + height / 32 + height / 64 - height / 32);
        var pnt7 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2 + width / 32 - width / 16, arg1[1].y + height / 32 + height / 64 - height / 32);

        var sLoc = new Array();
        sLoc.push(pnt1);
        sLoc.push(pnt2);
        sLoc.push(pnt3);
        sLoc.push(pnt4);
        sLoc.push(pnt5);
        sLoc.push(pnt6);
        sLoc.push(pnt7);
        var sBezier = Milstd.commonFun.prototype.getBSplinePoints(sLoc, 2);


        var loc23 = new Array();
        for (var i = 0; i < 4; i++) {
            loc23[i] = new Array();
        }
        loc23[0].push(loc5);
        loc23[1].push(loc11);
        loc23[2].push(loc16);
        loc23[3].push(sBezier);

        return loc23;
    },
    GetFourstarDots: function (arg1) {
        if (arg1 == null || arg1.length < 2) {
            return null;
        }
        var width = Math.abs(arg1[1].x - arg1[0].x);
        var height = Math.abs(arg1[1].y - arg1[0].y);
        var loc1 = null;
        var loc2 = null;
        var loc3 = null;
        var loc4 = null;
        var loc5 = new Array();
        loc1 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[0].y);
        loc5.push(loc1);
        loc2 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[0].y - height);
        loc5.push(loc2);
        loc3 = new OpenLayers.Geometry.Point(arg1[0].x + width / 8 * 3, arg1[0].y - height / 8 * 5);
        loc5.push(loc3);
        loc4 = new OpenLayers.Geometry.Point(arg1[0].x + width / 8 * 5, arg1[0].y - height / 8 * 3);
        loc5.push(loc4);

        loc5.push(loc1);

        var loc6 = null;
        var loc7 = null;
        var loc8 = new Array();

        loc6 = new OpenLayers.Geometry.Point(arg1[0].x, arg1[0].y - height / 2);
        loc8.push(loc6);
        loc7 = new OpenLayers.Geometry.Point(arg1[0].x + width, arg1[0].y - height / 2);
        loc8.push(loc7);
        loc8.push(loc4);
        loc8.push(loc3);

        var loc9 = null;
        var loc10 = null;
        var loc11 = new Array();
        loc11.push(loc6);
        loc11.push(loc7);
        loc9 = new OpenLayers.Geometry.Point(arg1[0].x + width / 8 * 5, arg1[0].y - height / 8 * 5);
        loc11.push(loc9);
        loc10 = new OpenLayers.Geometry.Point(arg1[0].x + width / 8 * 3, arg1[0].y - height / 8 * 3);
        loc11.push(loc10);
        loc11.push(loc6);

        var loc12 = new Array();
        loc12.push(loc1);
        loc12.push(loc2);
        loc12.push(loc9);
        loc12.push(loc10);


        var loc13 = new Array();
        for (var i = 0; i < 4; i++) {
            loc13[i] = new Array();
        }
        loc13[0].push(loc5);
        loc13[1].push(loc8);
        loc13[2].push(loc11);
        loc13[3].push(loc12);

        return loc13;
    },
    GetRhombusDots: function (arg1) {
        if (arg1 == null || arg1.length < 2) {
            return null;
        }
        var width = Math.abs(arg1[1].x - arg1[0].x);
        var height = Math.abs(arg1[1].y - arg1[0].y);
        var loc1 = null;
        var loc2 = null;
        var loc3 = null;
        var loc4 = null;
        var loc5 = new Array();
        var loc6 = new Array();

        var loc8 = null;
        var loc9 = null;
        var loc10 = null;
        var loc11 = null;
        var loc12 = new Array();

        loc1 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[0].y - height / 16 * 2);
        loc5.push(loc1);
        loc2 = new OpenLayers.Geometry.Point(arg1[0].x, arg1[0].y - height / 16 * 9);
        loc5.push(loc2);
        loc3 = new OpenLayers.Geometry.Point(arg1[0].x + width, arg1[0].y - height / 16 * 9);
        loc5.push(loc3);
        loc5.push(loc1);

        loc4 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[1].y);
        loc6.push(loc3);
        loc6.push(loc4);
        loc6.push(loc2);

        loc8 = new OpenLayers.Geometry.Point((arg1[0].x + width / 32 * 13), arg1[0].y - height / 16 * 1);
        loc12.push(loc8);
        loc9 = new OpenLayers.Geometry.Point((arg1[0].x + width / 32 * 13), arg1[0].y);
        loc12.push(loc9);
        loc10 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 19, arg1[0].y - height / 16 * 1);
        loc12.push(loc10);
        loc11 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 19, arg1[0].y);
        loc12.push(loc11);
        var loc7 = new Array();
        for (var i = 0; i < 3; i++) {
            loc7[i] = new Array();
        }
        loc7[0].push(loc5);
        loc7[1].push(loc6);
        loc7[2].push(loc12);

        return loc7;
    },
    GetSameDirectionClosedangleDots: function (arg1) {
        if (arg1 == null || arg1.length < 2) {
            return null;
        }

        var width = Math.abs(arg1[1].x - arg1[0].x);
        var height = Math.abs(arg1[1].y - arg1[0].y);
        var loc1 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 15, arg1[0].y);
        var loc2 = new OpenLayers.Geometry.Point(arg1[0].x, arg1[0].y - height / 16 * 13);
        var loc3 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 15, arg1[0].y - height / 16 * 11);
        var loc4 = new OpenLayers.Geometry.Point(arg1[0].x + width / 16 * 15, arg1[0].y - height / 16 * 13);
        var loc5 = new Array();
        loc5.push(loc1);
        loc5.push(loc2);
        loc5.push(loc3);
        loc5.push(loc4);
        loc5.push(loc1);

        var loc6 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 17, arg1[0].y - height / 32 * 1);
        var loc7 = new OpenLayers.Geometry.Point(arg1[0].x + width / 16, arg1[0].y - height / 32 * 27);
        var loc8 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 17, arg1[0].y - height / 16 * 12);
        var loc9 = new OpenLayers.Geometry.Point(arg1[0].x + width, arg1[0].y - height / 32 * 27);
        var loc10 = new Array();
        loc10.push(loc6);
        loc10.push(loc7);
        loc10.push(loc8);
        loc10.push(loc9);

        //绘制N
        var loc11 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 14, arg1[0].y - height);
        var loc12 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 14, arg1[0].y - height / 16 * 15);
        var loc13 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 18, arg1[0].y - height);
        var loc14 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 18, arg1[0].y - height / 16 * 15);
        var loc15 = new Array();
        loc15.push(loc11);
        loc15.push(loc12);
        loc15.push(loc13);
        loc15.push(loc14);


        var loc16 = new Array();
        for (var i = 0; i < 3; i++) {
            loc16[i] = new Array();
        }
        loc16[0].push(loc5);
        loc16[1].push(loc10);
        loc16[2].push(loc15);

        return loc16;
    },
    GetTriangleDots: function (arg1) {
        if (arg1 == null || arg1.length < 2) {
            return null;
        }
        var width = Math.abs(arg1[1].x - arg1[0].x);
        var height = Math.abs(arg1[1].y - arg1[0].y);
        var locN = new Array();
        var loc1 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 13, arg1[0].y - height / 16 * 1);
        locN.push(loc1);
        var loc2 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 13, arg1[0].y);
        locN.push(loc2);
        var loc3 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 19, arg1[0].y - height / 16 * 1);
        locN.push(loc3);
        var loc4 = new OpenLayers.Geometry.Point(arg1[0].x + width / 32 * 19, arg1[0].y);
        locN.push(loc4);

        var loc11 = new Array();
        var loc5 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[0].y - height / 16 * 2);
        loc11.push(loc5);
        var loc6 = new OpenLayers.Geometry.Point(arg1[0].x, arg1[0].y - height / 32 * 17);
        loc11.push(loc6);
        var loc7 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[0].y - height / 32 * 17);
        loc11.push(loc7);

        var loc12 = new Array();
        var loc8 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[0].y - height / 16 * 2);
        loc12.push(loc8);
        var loc9 = new OpenLayers.Geometry.Point(arg1[0].x + width, arg1[0].y - height / 32 * 17);
        loc12.push(loc9);
        var loc10 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[0].y - height / 32 * 17);
        loc12.push(loc10);

        var loc15 = new Array();
        var loc13 = new OpenLayers.Geometry.Point(arg1[0].x, arg1[0].y - height / 32 * 18);
        loc15.push(loc13);
        var loc14 = new OpenLayers.Geometry.Point(arg1[0].x + width, arg1[0].y - height / 32 * 18);
        loc15.push(loc14);

        var loc19 = new Array();
        var loc16 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[0].y - height);
        loc19.push(loc16);
        var loc17 = new OpenLayers.Geometry.Point(arg1[0].x, arg1[0].y - height / 32 * 19);
        loc19.push(loc17);
        var loc18 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[0].y - height / 32 * 19);
        loc19.push(loc18);

        var loc20 = new OpenLayers.Geometry.Point(arg1[0].x + width, arg1[0].y - height / 32 * 19);
        var loc21 = new Array();
        loc21.push(loc18);
        loc21.push(loc20);
        loc21.push(loc16);

        var loc22 = new Array();
        for (var i = 0; i < 6; i++) {
            loc22[i] = new Array();
        }
        loc22[0].push(locN);
        loc22[1].push(loc11);
        loc22[2].push(loc12);
        loc22[3].push(loc15);
        loc22[4].push(loc19);
        loc22[5].push(loc21);

        return loc22;
    },
    GetVaneDots: function (arg1) {
        if (arg1 == null || arg1.length < 2) {
            return null;
        }

        var width = Math.abs(arg1[1].x - arg1[0].x);
        var height = Math.abs(arg1[1].y - arg1[0].y);
        var loc1 = null;
        var loc2 = null;
        var loc3 = null;
        var loc4 = null;
        var loc5 = new Array();
        var loc6 = new Array();

        //菱形 
        loc1 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[0].y);
        loc2 = new OpenLayers.Geometry.Point(arg1[0].x, arg1[0].y - height / 8);
        loc3 = new OpenLayers.Geometry.Point(arg1[0].x + width / 2, arg1[0].y - height / 8 * 2);
        loc4 = new OpenLayers.Geometry.Point(arg1[0].x + width, arg1[0].y - height / 8);
        loc5.push(loc1);
        loc5.push(loc2);
        loc5.push(loc3);
        loc6.push(loc1);
        loc6.push(loc3);
        loc6.push(loc4);
        loc6.push(loc1);
        //矩形	
        var loc7 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 6, arg1[0].y - height / 8 * 2);
        var loc8 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 6, arg1[0].y - height);
        var loc9 = new OpenLayers.Geometry.Point(arg1[0].x + width / 28 * 13, arg1[0].y - height / 35 * 34);
        var loc10 = new OpenLayers.Geometry.Point(arg1[0].x + width / 28 * 15, arg1[0].y - height / 35 * 34);
        var loc11 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 8, arg1[0].y - height);
        var loc12 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 8, arg1[0].y - height / 8 * 2);
        var loc13 = new Array();
        loc13.push(loc7);
        loc13.push(loc8);
        loc13.push(loc9);
        loc13.push(loc10);
        loc13.push(loc11);
        loc13.push(loc12);
        //两侧小矩形	
        var loc46 = new Array();
        var loc14 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 6, arg1[0].y - height / 36 * 21);
        loc46.push(loc14);
        var loc15 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 2, arg1[0].y - height / 36 * 22);
        loc46.push(loc15);
        var loc16 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 2, arg1[0].y - height / 36 * 23);
        loc46.push(loc16);
        var loc17 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 6, arg1[0].y - height / 36 * 22);
        loc46.push(loc17);

        var loc47 = new Array();
        var loc18 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 6, arg1[0].y - height / 36 * 23);
        var loc19 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 2, arg1[0].y - height / 36 * 24);
        var loc20 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 2, arg1[0].y - height / 36 * 25);
        var loc21 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 6, arg1[0].y - height / 36 * 24);
        loc47.push(loc18);
        loc47.push(loc19);
        loc47.push(loc20);
        loc47.push(loc21);

        var loc48 = new Array();
        var loc22 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 6, arg1[0].y - height / 36 * 25);
        var loc23 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 2, arg1[0].y - height / 36 * 26);
        var loc24 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 2, arg1[0].y - height / 36 * 27);
        var loc25 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 6, arg1[0].y - height / 36 * 26);
        loc48.push(loc22);
        loc48.push(loc23);
        loc48.push(loc24);
        loc48.push(loc25);

        var loc49 = new Array();
        var loc26 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 6, arg1[0].y - height / 36 * 27);
        var loc27 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 2, arg1[0].y - height / 36 * 28);
        var loc28 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 2, arg1[0].y - height / 36 * 29);
        var loc29 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 6, arg1[0].y - height / 36 * 28);
        loc49.push(loc26);
        loc49.push(loc27);
        loc49.push(loc28);
        loc49.push(loc29);

        var loc50 = new Array();
        var loc30 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 8, arg1[0].y - height / 36 * 21);
        var loc31 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 12, arg1[0].y - height / 36 * 22);
        var loc32 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 12, arg1[0].y - height / 36 * 23);
        var loc33 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 8, arg1[0].y - height / 36 * 22);
        loc50.push(loc30);
        loc50.push(loc31);
        loc50.push(loc32);
        loc50.push(loc33);

        var loc51 = new Array();
        var loc34 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 8, arg1[0].y - height / 36 * 23);
        var loc35 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 12, arg1[0].y - height / 36 * 24);
        var loc36 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 12, arg1[0].y - height / 36 * 25);
        var loc37 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 8, arg1[0].y - height / 36 * 24);
        loc51.push(loc34);
        loc51.push(loc35);
        loc51.push(loc36);
        loc51.push(loc37);

        var loc52 = new Array();
        var loc38 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 8, arg1[0].y - height / 36 * 25);
        var loc39 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 12, arg1[0].y - height / 36 * 26);
        var loc40 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 12, arg1[0].y - height / 36 * 27);
        var loc41 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 8, arg1[0].y - height / 36 * 26);
        loc52.push(loc38);
        loc52.push(loc39);
        loc52.push(loc40);
        loc52.push(loc41);

        var loc53 = new Array();
        var loc42 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 8, arg1[0].y - height / 36 * 27);
        var loc43 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 12, arg1[0].y - height / 36 * 28);
        var loc44 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 12, arg1[0].y - height / 36 * 29);
        var loc45 = new OpenLayers.Geometry.Point(arg1[0].x + width / 14 * 8, arg1[0].y - height / 36 * 28);
        loc53.push(loc42);
        loc53.push(loc43);
        loc53.push(loc44);
        loc53.push(loc45);

        var loc54 = new Array();
        for (var i = 0; i < 11; i++) {
            loc54[i] = new Array();
        }
        loc54[0].push(loc5);
        loc54[1].push(loc6);
        loc54[2].push(loc13);
        loc54[3].push(loc46);
        loc54[4].push(loc47);
        loc54[5].push(loc48);
        loc54[6].push(loc49);
        loc54[7].push(loc50);
        loc54[8].push(loc51);
        loc54[9].push(loc52);
        loc54[10].push(loc53);

        return loc54;
    }
});

/* * 
*该类实现了对多种旗帜，包括三角形 矩形以及波浪形这三种
* 类型旗帜的算法的实现
*/
Milstd.Flag = OpenLayers.Class({
    GetTriangleFlagDots: function (arg) {
        this.CreateNewVertices(arg);
        var locPnts = new Array();
        var num = arg.length;
        if ((num >= 2) && (!Milstd.commonFun.prototype.geomEquals(arg[num - 1], arg[num - 2]))) {
            var point = arg[0];
            var point2 = arg[1];
            var point3 = new OpenLayers.Geometry.Point(point.x, point2.y);
            var point4 = Milstd.commonFun.prototype.getMidPoint(point, point3);
            var point5 = new OpenLayers.Geometry.Point(point2.x, point4.y);

            locPnts.push(point3);
            locPnts.push(point);
            locPnts.push(point5);
            locPnts.push(point4);
            locPnts.push(point3);
        }
        return locPnts;
    },
    GetRectFlagDots: function (arg) {
        this.CreateNewVertices(arg);
        var locPnts = new Array();
        var num = arg.length;
        if ((num >= 2) && (!Milstd.commonFun.prototype.geomEquals(arg[num - 1], arg[num - 2]))) {
            var point = arg[0];
            var point2 = arg[1];
            var point3 = new OpenLayers.Geometry.Point(point.x, point2.y);
            var point4 = Milstd.commonFun.prototype.getMidPoint(point, point3);
            var point5 = new OpenLayers.Geometry.Point(point2.x, point4.y);
            var point6 = new OpenLayers.Geometry.Point(point2.x, point.y);

            locPnts.push(point3);
            locPnts.push(point);
            locPnts.push(point6);
            locPnts.push(point5);
            locPnts.push(point4);
            locPnts.push(point3);
        }
        return locPnts;
    },
    GetCurveFlagDots: function (arg) {
        this.CreateNewVertices(arg);
        var locPnts = new Array();
        var num = arg.length;
        if ((num >= 2) && (!Milstd.commonFun.prototype.geomEquals(arg[num - 1], arg[num - 2]))) {
            var point = arg[0];
            var point2 = arg[1];
            var point3 = new OpenLayers.Geometry.Point(point.x, point2.y);
            var point4 = Milstd.commonFun.prototype.getMidPoint(point, point3);
            var startPnt = new OpenLayers.Geometry.Point(point2.x, point4.y);
            var point6 = new OpenLayers.Geometry.Point(point2.x, point.y);

            var length = point.distanceTo(point4) / 2.0;
            var num3 = point.distanceTo(point6);
            var endPnt = Milstd.commonFun.prototype.getThirdPoint(point6, point, 0.0, num3 / 4.0, "left");
            var point8 = Milstd.commonFun.prototype.getThirdPoint(point, endPnt, Math.PI * 1.5, length, "right");
            endPnt = Milstd.commonFun.prototype.getThirdPoint(point6, point, 0.0, (num3 / 4.0) * 3.0, "left");
            var point9 = Milstd.commonFun.prototype.getThirdPoint(point, endPnt, Math.PI * 1.5, length, "left");
            endPnt = Milstd.commonFun.prototype.getThirdPoint(startPnt, point4, 0.0, num3 / 4.0, "left");
            var point10 = Milstd.commonFun.prototype.getThirdPoint(point4, endPnt, Math.PI * 1.5, length, "right");
            endPnt = Milstd.commonFun.prototype.getThirdPoint(startPnt, point4, 0.0, (num3 / 4.0) * 3.0, "left");
            var point11 = Milstd.commonFun.prototype.getThirdPoint(point4, endPnt, Math.PI * 1.5, length, "left");

            var list = new Array();
            list.push(point);
            list.push(point8);
            list.push(point9);
            list.push(point6);
            var list2 = Milstd.commonFun.prototype.getBezierPoints(list);
            var list3 = new Array();
            list3.push(point4);
            list3.push(point10);
            list3.push(point11);
            list3.push(startPnt);
            var list4 = Milstd.commonFun.prototype.getBezierPoints(list3);


            locPnts.push(point3);
            for (var i = 0; i < list2.length; i++) {
                locPnts.push(list2[i]);
            }

            list4.reverse();

            for (var i = 0; i < list4.length; i++) {
                locPnts.push(list4[i]);
            }

            locPnts.push(locPnts[0]);
        }
        return locPnts;
    },
    getFlagFromVect: function (vectLin, flagType) {
        var feaLin = null;
        if (vectLin == null)
            return null;
        if (vectLin.geometry.CLASS_NAME == "OpenLayers.Geometry.LinearRing" || vectLin.geometry.CLASS_NAME == "OpenLayers.Geometry.LineString") {
            var dots = vectLin.geometry.getVertices();
            if (dots != null) {
                if (dots.length >= 2) {
                    if (Milstd.commonFun.prototype.geomEquals(dots[dots.length - 1], dots[dots.length - 2])) {
                        dots.pop(dots[length - 1]);
                    }
                }
            }
            switch (flagType) {
                case "TriangleFlag":
                case "RectFlag":
                case "CurveFlag":
                    feaLin = this.getFlagVect(dots, flagType);
                    break;
            }

        }
        return feaLin;
    },
    getFlagVect: function (arg, flagType) {
        this.CreateNewVertices(arg);
        var feaLin = null;
        var dots = new Array();
        if (arg != null && arg.length >= 2) {
            dots.push(arg[0]);
            dots.push(arg[1]);

            var parseDots = null;
            var linearRing = null;
            switch (flagType) {
                case "TriangleFlag":
                    parseDots = this.GetTriangleFlagDots(dots);
                    break;
                case "RectFlag":
                    parseDots = this.GetRectFlagDots(dots);
                    break;
                case "CurveFlag":
                    parseDots = this.GetCurveFlagDots(dots);
                    break;
            }
            linearRing = new Milstd.MilstdGeomRing(parseDots, dots, flagType);
            feaLin = new OpenLayers.Feature.Vector(linearRing);
        }
        return feaLin;

    },
    CreateNewVertices: function (arg) {
        if (arg != null && arg.length >= 2) {
            var maxX = Math.max(arg[0].x, arg[1].x);
            var minX = Math.min(arg[0].x, arg[1].x);
            var maxY = Math.max(arg[0].y, arg[1].y);
            var minY = Math.min(arg[0].y, arg[1].y);
            var pnt1 = new OpenLayers.Geometry.Point(minX, maxY);
            var pnt2 = new OpenLayers.Geometry.Point(maxX, minY);
            arg.splice(0, 1, pnt1);
            arg.splice(1, 1, pnt2);
        }
    }
});

/* * 
*该类是对双箭头算法的实现
* 
*/
Milstd.DoubleArrowFun = OpenLayers.Class(
{
    getDoubleArrowFromVect: function (vectLin, headHeightFactor, headWidthFactor, neckHeightFactor, neckWidthFactor) {
        var feaLin = null;
        if (vectLin == null)
            return null;
        if (vectLin.geometry.CLASS_NAME == "OpenLayers.Geometry.LinearRing" || vectLin.geometry.CLASS_NAME == "OpenLayers.Geometry.LineString") {
            var dots = vectLin.geometry.getVertices();
            if (dots != null) {
                if (dots.length >= 2) {
                    if (Milstd.commonFun.prototype.geomEquals(dots[dots.length - 1], dots[dots.length - 2])) {
                        dots.pop(dots[length - 1]);
                    }
                }
            }
            feaLin = this.getDoubleArrowVect(dots, headHeightFactor, headWidthFactor, neckHeightFactor, neckWidthFactor)
        }
        return feaLin;

    },
    getDoubleArrowVect: function (arg1, headHeightFactor, headWidthFactor, neckHeightFactor, neckWidthFactor) {
        var feaLin = null;
        var dots = new Array();
        if (arg1 != null && arg1.length >= 3) {
            dots.push(arg1[0]);
            dots.push(arg1[1]);
            dots.push(arg1[2]);
            if (arg1.length == 3) {
                dots.push(this.getTempPnt4(arg1[0], arg1[1], arg1[2]));
            }
            else {
                dots.push(arg1[3]);
            }
            var parseDots = this.getDoubleArrowPnts(arg1, headHeightFactor, headWidthFactor, neckHeightFactor, neckWidthFactor);
            var linearRing = new Milstd.MilstdGeomRing(parseDots, dots, "DoubleArrow");
            linearRing.setOptions({ headHeightFactor: headHeightFactor,
                headWidthFactor: headWidthFactor,
                neckHeightFactor: neckHeightFactor,
                neckWidthFactor: neckWidthFactor
            });
            feaLin = new OpenLayers.Feature.Vector(linearRing);
        }
        return feaLin;
    },
    getDoubleArrowPnts: function (arg1, headHeightFactor, headWidthFactor, neckHeightFactor, neckWidthFactor) {
        var range = null;
        var num = arg1.length;
    
        if ((num >= 3) && (!Milstd.commonFun.prototype.geomEquals(arg1[num - 1], arg1[num - 2]))) {
            var point = arg1[0];
            var point2 = arg1[1];
            var point3 = arg1[2];
            var point4 = null;
            if (num == 3) {
                point4 = this.getTempPnt4(point, point2, point3);
            }
            else {
                point4 = arg1[3];
            }
            var connPointTemp = Milstd.commonFun.prototype.getMidPoint(point, point2);

            var list = this.getArrowPoints(point, connPointTemp, point4, "left", headHeightFactor, headWidthFactor, neckHeightFactor, neckWidthFactor);
            var list2 = this.getArrowPoints(connPointTemp, point2, point3, "right", headHeightFactor, headWidthFactor, neckHeightFactor, neckWidthFactor);

            var num2 = list.length;
            var num3 = Math.ceil((num2 - 5) / 2);
            range = list.slice(0, num3);
            var list4 = list.slice(num3, num3 + 5);
            var list5 = list.slice(num3 + 5);
            var list6 = list2.slice(0, num3);
            var list7 = list2.slice(num3, num3 + 5);
            var list8 = list2.slice(num3 + 5);
            range = Milstd.commonFun.prototype.getBezierPoints(range);
            for (var i = 0; i < list6.length; i++) {
                list5.push(list6[i]);
            }

            var list9 = Milstd.commonFun.prototype.getBezierPoints(list5);
            list8 = Milstd.commonFun.prototype.getBezierPoints(list8);

            for (var i = 0; i < list4.length; i++) {
                range.push(list4[i]);
            }
            for (var i = 0; i < list9.length; i++) {
                range.push(list9[i]);
            }
            for (var i = 0; i < list7.length; i++) {
                range.push(list7[i]);
            }
            for (var i = 0; i < list8.length; i++) {
                range.push(list8[i]);
            }
            if (range.length > 0) {

                if (!Milstd.commonFun.prototype.geomEquals(range[0], range[range.length - 1])) {
                    range.push(range[0]);
                }
            }
        }

        return range;
    },
    getArrowPoints: function (pnt1, pnt2, pnt3, side, headHeightFactor, headWidthFactor, neckHeightFactor, neckWidthFactor) {
        var point = Milstd.commonFun.prototype.getMidPoint(pnt1, pnt2);
        var num = point.distanceTo(pnt3);
        var endPnt = Milstd.commonFun.prototype.getThirdPoint(pnt3, point, 0.0, num * 0.3, "left");
        var point3 = Milstd.commonFun.prototype.getThirdPoint(pnt3, point, 0.0, num * 0.5, "left");
        var point4 = Milstd.commonFun.prototype.getThirdPoint(pnt3, point, 0.0, num * 0.7, "left");
        endPnt = Milstd.commonFun.prototype.getThirdPoint(point, endPnt, 1.5 * Math.PI, num / 4.0, side);
        point3 = Milstd.commonFun.prototype.getThirdPoint(point, point3, 1.5 * Math.PI, num / 4.0, side);
        point4 = Milstd.commonFun.prototype.getThirdPoint(point, point4, 1.5 * Math.PI, num / 4.0, side);

        var points = new Array();
        points.push(point);
        points.push(endPnt);
        points.push(point3);
        points.push(point4);
        points.push(pnt3);

        var list2 = Milstd.commonFun.prototype.getArrowHeadPoints(points, headHeightFactor, headWidthFactor, neckHeightFactor, neckWidthFactor);
        var neckLeftPoint = list2[0];
        var neckRightPoint = list2[4];
        var tailWidthFactor = (pnt1.distanceTo(pnt1, pnt2) / Milstd.commonFun.prototype.wholeDistance(points)) / 2.0;
        var leftFactor = (side == "left") ? 1.0 : 0.01;
        var rightFactor = (side == "left") ? 0.01 : 1.0;
        var list3 = Milstd.commonFun.prototype.getArrowBodyPoints(points, neckLeftPoint, neckRightPoint, tailWidthFactor, leftFactor, rightFactor);
        var num5 = list3.length;

        var range = list3.slice(0, Math.ceil(num5 / 2));
        var list5 = list3.slice(Math.ceil(num5 / 2));

        range.push(neckLeftPoint);
        list5.push(neckRightPoint);
        range.reverse();
        range.push(pnt1);
        list5.reverse();
        list5.push(pnt2);
        range.reverse();

        for (var i = 0; i < list2.length; i++) {
            range.push(list2[i]);
        }
        for (var i = 0; i < list5.length; i++) {
            range.push(list5[i]);
        }

        return range;
    },

    getTempPnt4: function (linePnt1, linePnt2, point) {
        var point4 = null;
        var point3 = Milstd.commonFun.prototype.getMidPoint(linePnt1, linePnt2);
        var num = point3.distanceTo(point);
        var num2 = Milstd.commonFun.prototype.getAngleOfThreePoints(linePnt1, point3, point);
        var length = 0.0;
        var num4 = 0.0;
        if (num2 < Math.PI / 2) {
            length = num * Math.sin(num2);
            num4 = num * Math.cos(num2);
            point4 = Milstd.commonFun.prototype.getThirdPoint(linePnt1, point3, 1.5 * Math.PI, length, "left");
            return Milstd.commonFun.prototype.getThirdPoint(point3, point4, 1.5 * Math.PI, num4, "right");
        }
        else if ((num2 >= Math.PI / 2) && (num2 < Math.PI)) {
            length = num * Math.sin(Math.PI - num2);
            num4 = num * Math.cos(Math.PI - num2);
            point4 = Milstd.commonFun.prototype.getThirdPoint(linePnt1, point3, 1.5 * Math.PI, length, "left");
            return Milstd.commonFun.prototype.getThirdPoint(point3, point4, 1.5 * Math.PI, num4, "left");
        }
        else if ((num2 >= Math.PI) && (num2 < 1.5 * Math.PI)) {
            length = num * Math.sin(num2 - Math.PI);
            num4 = num * Math.cos(num2 - Math.PI);
            point4 = Milstd.commonFun.prototype.getThirdPoint(linePnt1, point3, 1.5 * Math.PI, length, "right");
            return Milstd.commonFun.prototype.getThirdPoint(point3, point4, 1.5 * Math.PI, num4, "right");
        }
        else {
            length = num * Math.sin(2 * Math.PI - num2);
            num4 = num * Math.cos(2 * Math.PI - num2);
            point4 = Milstd.commonFun.prototype.getThirdPoint(linePnt1, point3, 1.5 * Math.PI, length, "right");
            return Milstd.commonFun.prototype.getThirdPoint(point3, point4, 1.5 * Math.PI, num4, "left");
        }
    },

    CLASS_NAME: "Milstd.DoubleArrowFun"
});
Milstd.commonFun = OpenLayers.Class({
    /* * 
    *计算箭头头部的点
    *Parameters:
    * dots{array(OpenLayers.LonLat)}根据轨迹线解析得到坐标序列
    * 返回：temDotArr {array(OpenLayers.LonLat)}
    */
    getArrowHeadPoints: function (points, headHeightFactor, headWidthFactor, neckHeightFactor, neckWidthFactor) {
        if (points.length < 2) {
            return points;
        }
        var length = this.wholeDistance(points) * headHeightFactor;
        var num3 = length * headWidthFactor;
        var num4 = length * neckWidthFactor;
        var num5 = points.length;

        var point = points[num5 - 1].clone();
        var num6 = point.distanceTo(points[num5 - 2]);
        length = (length > num6) ? num6 : length;
        var num7 = length * neckHeightFactor;
        var endPnt = this.getThirdPoint(points[num5 - 2], point, 0.0, length, "left");
        var point3 = this.getThirdPoint(points[num5 - 2], point, 0.0, num7, "left");
        var point4 = this.getThirdPoint(point, endPnt, 1.5 * Math.PI, num3, "right");
        var point5 = this.getThirdPoint(point, point3, 1.5 * Math.PI, num4, "right");
        var point6 = this.getThirdPoint(point, endPnt, 1.5 * Math.PI, num3, "left");
        var point7 = this.getThirdPoint(point, point3, 1.5 * Math.PI, num4, "left");
        var listHead = new Array();
        listHead.push(point5);
        listHead.push(point4);
        listHead.push(point);
        listHead.push(point6);
        listHead.push(point7);
        return listHead;
    },

    /* * 
    *计算箭头腰部的点
    *Parameters:
    * dots{array(OpenLayers.LonLat)}根据轨迹线解析得到坐标序列
    * 返回：temDotArr {array(OpenLayers.LonLat)}
    */
    getArrowBodyPoints: function (points, neckLeftPoint, neckRightPoint, tailWidthFactor, leftFactor, rightFactor) {
        if (points.length < 2) {
            return points;
        }
        var num = this.wholeDistance(points);
        var num3 = this.wholeDistance(points) * tailWidthFactor;
        var num4 = neckLeftPoint.distanceTo(neckRightPoint);
        var num5 = num3 - (num4 / 2.0);
        var num6 = 0.0;
        var list = new Array();
        var list2 = new Array();
        for (var i = 1; i < (points.length - 1); i++) {
            var angle = this.getAngleOfThreePoints(points[i - 1], points[i], points[i + 1]) / 2.0;
            num6 += points[i - 1].distanceTo(points[i]);
            var num9 = (num3 - ((num6 / num) * num5)) / Math.sin(angle);
            list.push(this.getThirdPoint(points[i - 1], points[i], angle, num9 * leftFactor, "right"));
            list2.push(this.getThirdPoint(points[i - 1], points[i], Math.PI - angle, num9 * rightFactor, "left"));
        }
        for (var j = 0; j < list2.length; j++) {
            list.push(list2[j]);
        }
        return list;
    },

    /* * 
    *计算箭头尾部的点
    *Parameters:
    * dots{array(OpenLayers.LonLat)}根据轨迹线解析得到坐标序列
    * 返回：temDotArr {array(OpenLayers.LonLat)}
    */
    getArrowTailPoints: function (points, tailWidthFactor, hasSwallowTail, swallowTailFactor) {
        if (points.length < 2) {
            return points;
        }
        var length = this.wholeDistance(points) * tailWidthFactor;
        var list = new Array();
        var point = this.getThirdPoint(points[1], points[0], 1.5 * Math.PI, length, "right");
        var point2 = this.getThirdPoint(points[1], points[0], 1.5 * Math.PI, length, "left");
        if (hasSwallowTail) {
            var num3 = length * swallowTailFactor;
            var point3 = this.getThirdPoint(points[1], points[0], 0.0, num3, "left");
            list.push(point);
            list.push(point3);
            list.push(point2);
            return list;
        }
        list.push(point);
        list.push(point2);
        return list;
    },

    getBezierPoints: function (points) {
        if (points.length <= 2) {
            return points;
        }
        var list = new Array();
        var n = points.length - 1;
        for (var i = 0.0; i <= 1.0; i += 0.01) {
            var x = 0.0;
            var y = 0.0;
            for (var j = 0; j <= n; j++) {
                var num6 = this.getBinomialFactor(n, j);
                var num7 = Math.pow(i, j);
                var num8 = Math.pow(1.0 - i, (n - j));
                x += ((num6 * num7) * num8) * points[j].x;
                y += ((num6 * num7) * num8) * points[j].y;
            }
            list.push(new OpenLayers.Geometry.Point(x, y));
        }
        list.push(points[n]);
        return list;
    },

    getBSplinePoints: function (points, n) {
        if ((points.length <= 2) || (points.length <= n)) {
            return points;
        }
        var list = new Array();
        var num = (points.length - n) - 1;
        list.push(points[0]);
        for (var i = 0; i <= num; i++) {
            for (var j = 0.0; j <= 1.0; j += 0.05) {
                var x = 0.0;
                var y = 0.0;
                for (var k = 0; k <= n; k++) {
                    var num7 = this.getBSplineFFactor(k, n, j);
                    x += num7 * points[i + k].x;
                    y += num7 * points[i + k].y;
                }
                list.push(new OpenLayers.Geometry.Point(x, y));
            }
        }
        list.push(points[points.length - 1]);
        return list;
    },

    /* * 
    *构建箭头的所有点
    *Parameters:
    * dots{array(OpenLayers.Geometry.Point)}根据轨迹线解析得到坐标序列
    * 返回：temDotArr {array(OpenLayers.Geometry.Point)}
    */
    getArrowPlot: function (inpoints, hasSwallowTail, swallowTailFactor, curveFitMethod, headHeightFactor, headWidthFactor, neckHeightFactor, neckWidthFactor, tailWidthFactor) {
        if (inpoints.length < 2) {
            return inpoints;
        }
        var list2 = this.getArrowHeadPoints(inpoints, headHeightFactor, headWidthFactor, neckHeightFactor, neckWidthFactor);
        var neckLeftPoint = list2[0];
        var neckRightPoint = list2[4];
        var list3 = this.getArrowBodyPoints(inpoints, neckLeftPoint, neckRightPoint, tailWidthFactor, 1.0, 1.0);
        var list4 = this.getArrowTailPoints(inpoints, tailWidthFactor, hasSwallowTail, swallowTailFactor);
        var point3 = list4[0];

        var point4 = (list4.length == 3) ? list4[1] : list4[1];
        var point5 = (list4.length == 3) ? list4[2] : list4[1];
        var num = list3.length;
        var range = list3.slice(0, Math.ceil(num / 2));
        var list6 = list3.slice(Math.ceil(num / 2));
        range.push(neckLeftPoint);
        list6.push(neckRightPoint);
        range.reverse();
        range.push(point3);
        list6.reverse();
        list6.push(point5);

        var rangNew = null;
        var list6New = null;

        if (curveFitMethod == "useBezierFit") {
            rangNew = this.getBezierPoints(range);
            list6New = this.getBezierPoints(list6);
        }
        else {
            rangNew = this.getBSplinePoints(range, 2);
            list6New = this.getBSplinePoints(list6, 2);
        }
        if (point4 != null) {
            rangNew.push(point4);
            list6New.push(point4);
        }
        rangNew.reverse();
        for (var i = 0; i < list2.length; i++) {
            rangNew.push(list2[i]);
        }
        for (var j = 0; j < list6New.length; j++) {
            rangNew.push(list6New[j]);
        }
        //rangNew.concat(list2, list6New);
        return rangNew;

    },

    wholeDistance: function (arrDots) {
        var len = 0;
        if (arrDots != null && arrDots.length > 1) {
            for (var i = 0; i < arrDots.length - 1; i++) {
                len += arrDots[i].distanceTo(arrDots[i + 1]);
            }
        }
        return len;
    },

    getAzimuthAngle: function (geoPntStart, geoPntEnd) {
        var num = 0.0;
        var num2 = Math.asin(Math.abs((geoPntEnd.y - geoPntStart.y)) / geoPntEnd.distanceTo(geoPntStart));
        if ((geoPntEnd.y >= geoPntStart.y) && (geoPntEnd.x >= geoPntStart.x)) {
            return (num2 + Math.PI);
        }
        if ((geoPntEnd.y >= geoPntStart.y) && (geoPntEnd.x < geoPntStart.x)) {
            return (2 * Math.PI - num2);
        }
        if ((geoPntEnd.y < geoPntStart.y) && (geoPntEnd.x < geoPntStart.x)) {
            return num2;
        }
        if ((geoPntEnd.y < geoPntStart.y) && (geoPntEnd.x >= geoPntStart.x)) {
            num = Math.PI - num2;
        }
        return num;
    },

    getThirdPoint: function (startPnt, endPnt, angle, length, side) {
        var num = this.getAzimuthAngle(startPnt, endPnt);
        var num2 = 0.0;
        if (side.toLowerCase() == "left") {
            num2 = num + angle;
        }
        else {
            num2 = num - angle;
        }
        var num3 = length * Math.cos(num2);
        var num4 = length * Math.sin(num2);
        return new OpenLayers.Geometry.Point(endPnt.x + num3, endPnt.y + num4);
    },

    getAngleOfThreePoints: function (pntA, pntB, pntC) {
        var num = this.getAzimuthAngle(pntB, pntA) - this.getAzimuthAngle(pntB, pntC);
        if (num < 0.0) {
            num += 2 * Math.PI;
        }
        return num;
    },

    getFactorial: function (n) {
        var num = 1;
        for (var i = 1; i <= n; i++) {
            num *= i;
        }
        return num;
    },

    getBinomialFactor: function (n, index) {
        return this.getFactorial(n) / (this.getFactorial(index) * this.getFactorial(n - index));
    },

    getQuadricBSplineFactor: function (k, t) {
        if (k == 0) {
            return (Math.pow((t - 1.0), 2.0) / 2.0);
        }
        if (k == 1) {
            return ((((-2.0 * Math.pow(t, 2.0)) + (2.0 * t)) + 1.0) / 2.0);
        }
        if (k == 2) {
            return (Math.pow(t, 2.0) / 2.0);
        }
        return 0.0;
    },

    getBSplineFFactor: function (k, n, t) {
        if (n == 2) {
            return this.getQuadricBSplineFactor(k, t);
        }
        var num = 0.0;
        var num2 = this.getFactorial(n);
        for (var i = 0; i <= (n - k); i++) {
            var num4 = ((i % 2) == 0) ? 1 : -1;
            num += (num4 * this.getBinomialFactor(n + 1, i)) * Math.pow(((t + n) - k) - i, n);
        }
        return (num / num2);
    },

    getSide: function (pnt1, pnt2, pnt) {
        var num = ((pnt2.y - pnt1.y) * (pnt.x - pnt1.x)) - ((pnt.y - pnt1.y) * (pnt2.x - pnt1.x));
        if (num > 0.0) {
            return "left";
        }
        if (num < 0.0) {
            return "right";
        }
        return null;
    },

    getMidPoint: function (pnt1, pnt2) {
        return new OpenLayers.Geometry.Point((pnt1.x + pnt2.x) / 2.0, (pnt1.y + pnt2.y) / 2.0);
    },


    /* * 
    *根据几何点序列创建多边形区要素
    *Parameters:
    * lastLinVect{OpenLayers.Feature.Vector}根据解析得到的线构建多边形要素
    * 返回：feaPolygon {OpenLayers.Feature.Vector}
    */
    getPolygonFeature: function (lastLinVect) {
        var feaPolygon = null;
        if (lastLinVect != null && lastLinVect.geometry != null) {
            // var linearRing = new OpenLayers.Geometry.LinearRing(lastLinVect.geometry.getVertices());
            feaPolygon = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon([lastLinVect.geometry]));
        }
        return feaPolygon;
    },

    /* * 
    *根据几何点序列创建多边形线要素
    *Parameters:
    * pointList{array(OpenLayers.Geometry.Point)}根据轨迹线解析得到坐标序列
    * 返回：feaLin {OpenLayers.Feature.Vector}
    */
    getLineFeature: function (pointList) {
        var feaLin = null;
        if (pointList != null && pointList.length > 0) {
            //            var pnts = pointList.clone();
            //            if (!pnts[0].equals(pnts[pointList.length - 1])) {
            //                pnts.push(pnts[0]);
            //            }
            var m_lin = new OpenLayers.Geometry.LineString();
            m_lin.addComponents(pointList);
            feaLin = new OpenLayers.Feature.Vector(m_lin);
        }
        return feaLin;
    },

    getParseLine: function (vectLin, hasSwallowTail, swallowTailFactor, curveFitMethod, headHeightFactor, headWidthFactor, neckHeightFactor, neckWidthFactor, tailWidthFactor) {
        var feaLin = null;
        if (vectLin != null && vectLin.geometry != null) {
            if (vectLin.geometry.CLASS_NAME == "OpenLayers.Geometry.LinearRing" || vectLin.geometry.CLASS_NAME == "OpenLayers.Geometry.LineString") {
                var dots = vectLin.geometry.getVertices();
                if (dots != null) {
                    if (dots.length >= 2) {
                        if (this.geomEquals(dots[dots.length - 1], dots[dots.length - 2])) {
                            dots.pop(dots[length - 1]);
                        }
                    }
                }
                var parseDots = this.getArrowPlot(dots, hasSwallowTail, swallowTailFactor, curveFitMethod, headHeightFactor, headWidthFactor, neckHeightFactor, neckWidthFactor, tailWidthFactor);
                //var linearRing = new OpenLayers.Geometry.LinearRing(parseDots);
                var linearRing = new Milstd.MilstdGeomRing(parseDots, dots, "SimpleArrow");
                linearRing.setOptions({ headHeightFactor: headHeightFactor,
                    headWidthFactor: headWidthFactor,
                    neckHeightFactor: neckHeightFactor,
                    neckWidthFactor: neckWidthFactor, 
                    tailWidthFactor: tailWidthFactor,
                    hasSwallowTail: hasSwallowTail,
                    swallowTailFactor: swallowTailFactor,
                    curveFitMethod: "curveFitMethod"});
                feaLin = new OpenLayers.Feature.Vector(linearRing);
            }

        }
        return feaLin;
    },

    geomEquals: function (geom, geom1) {
        var equals = false;
        if (geom != null) {
            equals = ((geom1.x == geom.x && geom1.y == geom.y) ||
                      (isNaN(geom1.x) && isNaN(geom1.y) && isNaN(geom.x) && isNaN(geom.y)));
        }
        return equals;
    },
    CLASS_NAME: "Milstd.commonFun"
});
Milstd.MilStdPathHandle = OpenLayers.Class(OpenLayers.Handler.Point, {

    /**
    * Property: featureStyle
    * {Openlayers.Feature.Vector.Style} 要素符号化的参数
    */
    featureStyle: null,
    /**
    * Property: headHeightFactor
    * {Number} 箭头头部高度因子
    */
    headHeightFactor: 0.2,

    /**
    * Property: headHeightFactor
    * {Number} 箭头头部宽度因子
    */
    headWidthFactor: 0.5,

    /**
    * Property: headHeightFactor
    * {Number} 箭头腰部高度因子
    */
    neckHeightFactor: 0.8,

    /**
    * Property: headHeightFactor
    * {Number} 箭头腰部宽度因子
    */
    neckWidthFactor: 0.2,

    /**
    * Property: headHeightFactor
    * {Number} 箭头尾部宽度因子
    */
    tailWidthFactor: 0.1,

    hasSwallowTail: true,
    swallowTailFactor: 0.5,
    curveFitMethod: "useBSplieFit",

    /**
    * Property: graphy
    * {Number} 箭头类型
    */
    graphics: null,


    /**
    * Property: Orgline 表示原始的路径
    * {<OpenLayers.Feature.Vector>}
    */
    Orgline: null,

    /**
    * Property: line
    * {<OpenLayers.Feature.Vector>}
    */
    line: null,

    /**
    * APIProperty: maxVertices
    * {Number} The maximum number of vertices which can be drawn by this
    * handler. When the number of vertices reaches maxVertices, the
    * geometry is automatically finalized. This property doesn't
    * apply if freehand is set. Default is null.
    */
    maxVertices: null,

    /**
    * Property: doubleTouchTolerance
    * {Number} Maximum number of pixels between two touches for
    *     the gesture to be considered a "finalize feature" action.
    *     Default is 20.
    */
    doubleTouchTolerance: 20,

    /**
    * Property: freehand
    * {Boolean} In freehand mode, the handler starts the path on mouse down,
    * adds a point for every mouse move, and finishes the path on mouse up.
    * Outside of freehand mode, a point is added to the path on every mouse
    * click and double-click finishes the path.
    */
    freehand: false,

    /**
    * Property: freehandToggle
    * {String} If set, freehandToggle is checked on mouse events and will set
    * the freehand mode to the opposite of this.freehand.  To disallow
    * toggling between freehand and non-freehand mode, set freehandToggle to
    * null.  Acceptable toggle values are 'shiftKey', 'ctrlKey', and 'altKey'.
    */
    freehandToggle: 'shiftKey',

    /**
    * Property: timerId
    * {Integer} The timer used to test the double touch.
    */
    timerId: null,

    /**
    * Constructor: OpenLayers.Handler.Path
    * Create a new path hander
    *
    * Parameters:
    * control - {<OpenLayers.Control>} The control that owns this handler
    * callbacks - {Object} An object with a properties whose values are
    *     functions.  Various callbacks described below.
    * options - {Object} An optional object with properties to be set on the
    *           handler
    *
    * Named callbacks:
    * create - Called when a sketch is first created.  Callback called with
    *     the creation point geometry and sketch feature.
    * modify - Called with each move of a vertex with the vertex (point)
    *     geometry and the sketch feature.
    * point - Called as each point is added.  Receives the new point geometry.
    * done - Called when the point drawing is finished.  The callback will
    *     recieve a single argument, the linestring geometry.
    * cancel - Called when the handler is deactivated while drawing.  The
    *     cancel callback will receive a geometry.
    */
    initialize: function (control, callbacks, options) {
        OpenLayers.Handler.Point.prototype.initialize.apply(this, arguments);

        //        OpenLayers.Handler.prototype.initialize.apply(this, [control, callbacks, options]);
        //        this.options = (options) ? options : {};

    },

    setOptions: function (newOptions) {
        OpenLayers.Util.extend(this.options, newOptions);
        OpenLayers.Util.extend(this, newOptions);
    },

    /**
    * Method: createFeature
    * Add temporary geometries
    *
    * Parameters:
    * pixel - {<OpenLayers.Pixel>} The initial pixel location for the new
    *     feature.
    */
    createFeature: function (pixel) {
        var geometry;
        if (pixel) {
            var lonlat = this.map.getLonLatFromPixel(pixel);
            geometry = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
        } else {
            geometry = new OpenLayers.Geometry.Point();
        }
        this.point = new OpenLayers.Feature.Vector(geometry);
        this.line = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.LineString([this.point.geometry]));



        switch (this.graphics) {
            case "SimpleArrow":
                this.Orgline = Milstd.commonFun.prototype.getParseLine(this.line, this.hasSwallowTail, this.swallowTailFactor, this.curveFitMethod, this.headHeightFactor, this.headWidthFactor, this.neckHeightFactor, this.neckWidthFactor, this.tailWidthFactor);
                break;
            case "DoubleArrow":
                this.Orgline = Milstd.DoubleArrowFun.prototype.getDoubleArrowFromVect(this.line, this.headHeightFactor, this.headWidthFactor, this.neckHeightFactor, this.neckWidthFactor);
                break;
            case "TriangleFlag":
            case "RectFlag":
            case "CurveFlag":
                this.Orgline = Milstd.Flag.prototype.getFlagFromVect(this.line, this.graphics);
                break;
            case "ArrowCross":
            case "CircleClosedangle":
            case "Closedangle":
            case "DoubleClosedangle":
            case "Fourstar":          //四角指北针
            case "Rhombus":           //菱形指北针
            case "SameDirectionClosedangle": //同向尖角指北针
            case "Triangle":                 //三角指北针
            case "Vane":                     //风向标指北针
                this.Orgline = Milstd.Compass.prototype.getCrossFromVect(this.line, this.graphics);
                break;
        }

        if (this.featureStyle != null) {
            if (this.Orgline != null) {
                this.Orgline.style = this.featureStyle;
            }
        }

        // this.Orgline = Milstd.commonFun.prototype.getParseLine(this.line, this.hasSwallowTail, this.swallowTailFactor, this.curveFitMethod, this.headHeightFactor, this.headWidthFactor, this.neckHeightFactor, this.neckWidthFactor, this.tailWidthFactor);


        this.callback("create", [this.point.geometry, this.getSketch()]);
        this.point.geometry.clearBounds();
        // this.layer.addFeatures([this.line, this.point], { silent: true });
        if (this.point != null) {
            this.layer.addFeatures([this.point], { silent: true });
        }
        if (this.Orgline != null) {
            this.layer.addFeatures([this.Orgline], { silent: true });
        }
    },

    /**
    * Method: destroyFeature
    * Destroy temporary geometries
    */
    destroyFeature: function () {
        OpenLayers.Handler.Point.prototype.destroyFeature.apply(this);

        this.line = null;
        this.Orgline = null;
    },

    /**
    * Method: destroyPersistedFeature
    * Destroy the persisted feature.
    */
    destroyPersistedFeature: function () {
        var layer = this.layer;
        if (layer && layer.features.length > 2) {
            this.layer.features[0].destroy();
        }
    },

    /**
    * Method: removePoint
    * Destroy the temporary point.
    */
    removePoint: function () {
        if (this.point) {
            this.layer.removeFeatures([this.point]);
        }
    },

    /**
    * Method: addPoint
    * Add point to geometry.  Send the point index to override
    * the behavior of LinearRing that disregards adding duplicate points.
    *
    * Parameters:
    * pixel - {<OpenLayers.Pixel>} The pixel location for the new point.
    */
    addPoint: function (pixel) {
        if (this.point == null || this.line == null) {
            this.createFeature();
        }
        this.layer.removeFeatures([this.point]);
        var lonlat = this.control.map.getLonLatFromPixel(pixel);
        this.point = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat)
        );
        this.line.geometry.addComponent(this.point.geometry, this.line.geometry.components.length);

        if (this.Orgline != null) {
            this.layer.removeFeatures([this.Orgline]);
        }
        this.Orgline = null;
        //this.Orgline.destroy();
        switch (this.graphics) {
            case "SimpleArrow":
                this.Orgline = Milstd.commonFun.prototype.getParseLine(this.line, this.hasSwallowTail, this.swallowTailFactor, this.curveFitMethod, this.headHeightFactor, this.headWidthFactor, this.neckHeightFactor, this.neckWidthFactor, this.tailWidthFactor);
                break;
            case "DoubleArrow":
                this.Orgline = Milstd.DoubleArrowFun.prototype.getDoubleArrowFromVect(this.line, this.headHeightFactor, this.headWidthFactor, this.neckHeightFactor, this.neckWidthFactor);
                break;
            case "TriangleFlag":
            case "RectFlag":
            case "CurveFlag":
                this.Orgline = Milstd.Flag.prototype.getFlagFromVect(this.line, this.graphics);
                break;
            case "ArrowCross":
            case "CircleClosedangle":
            case "Closedangle":
            case "DoubleClosedangle":
            case "Fourstar":          //四角指北针
            case "Rhombus":           //菱形指北针
            case "SameDirectionClosedangle": //同向尖角指北针
            case "Triangle":                 //三角指北针
            case "Vane":                     //风向标指北针
                this.Orgline = Milstd.Compass.prototype.getCrossFromVect(this.line, this.graphics);
                break;
        }

        if (this.featureStyle != null) {
            if (this.Orgline != null) {
                this.Orgline.style = this.featureStyle;
            }
        }
        // this.Orgline = Milstd.commonFun.prototype.getParseLine(this.line, this.hasSwallowTail, this.swallowTailFactor, this.curveFitMethod, this.headHeightFactor, this.headWidthFactor, this.neckHeightFactor, this.neckWidthFactor, this.tailWidthFactor);
        this.layer.addFeatures([this.point]);
        this.callback("point", [this.point.geometry, this.getGeometry()]);
        this.callback("modify", [this.point.geometry, this.getSketch()]);
        this.drawFeature();
    },

    /**
    * Method: freehandMode
    * Determine whether to behave in freehand mode or not.
    *
    * Returns:
    * {Boolean}
    */
    freehandMode: function (evt) {
        return (this.freehandToggle && evt[this.freehandToggle]) ?
                    !this.freehand : this.freehand;
    },

    /**
    * Method: modifyFeature
    * Modify the existing geometry given the new point
    *
    * Parameters:
    * pixel - {<OpenLayers.Pixel>} The updated pixel location for the latest
    *     point.
    * drawing - {Boolean} Indicate if we're currently drawing.
    */
    modifyFeature: function (pixel, drawing) {
        if (this.point == null || this.line == null) {
            this.createFeature();
        }
        var lonlat = this.control.map.getLonLatFromPixel(pixel);
        if (this.point == null) {
            this.point = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat));
        }
        else {
            this.point.geometry.x = lonlat.lon;
            this.point.geometry.y = lonlat.lat;
        }
        this.callback("modify", [this.point.geometry, this.getSketch(), drawing]);
        //加入绘制
        //var linVect = this.getSketch();
        if (this.Orgline != null) {
            this.layer.removeFeatures([this.Orgline]);
        }
        if (this.Orgline != null) {
            this.Orgline.destroy();
        }
        switch (this.graphics) {
            case "SimpleArrow":
                this.Orgline = Milstd.commonFun.prototype.getParseLine(this.line, this.hasSwallowTail, this.swallowTailFactor, this.curveFitMethod, this.headHeightFactor, this.headWidthFactor, this.neckHeightFactor, this.neckWidthFactor, this.tailWidthFactor);
                break;
            case "DoubleArrow":
                this.Orgline = Milstd.DoubleArrowFun.prototype.getDoubleArrowFromVect(this.line, this.headHeightFactor, this.headWidthFactor, this.neckHeightFactor, this.neckWidthFactor);
                break;
            case "TriangleFlag":
            case "RectFlag":
            case "CurveFlag":
                this.Orgline = Milstd.Flag.prototype.getFlagFromVect(this.line, this.graphics);
                break;
            case "ArrowCross":
            case "CircleClosedangle":
            case "Closedangle":
            case "DoubleClosedangle":
            case "Fourstar":          //四角指北针
            case "Rhombus":           //菱形指北针
            case "SameDirectionClosedangle": //同向尖角指北针
            case "Triangle":                 //三角指北针
            case "Vane":                     //风向标指北针
                this.Orgline = Milstd.Compass.prototype.getCrossFromVect(this.line, this.graphics);
                break;
        }
        // this.Orgline = Milstd.commonFun.prototype.getParseLine(this.line, this.hasSwallowTail, this.swallowTailFactor, this.curveFitMethod, this.headHeightFactor, this.headWidthFactor, this.neckHeightFactor, this.neckWidthFactor, this.tailWidthFactor);
        if (this.featureStyle != null) {
            if (this.Orgline != null) {
                this.Orgline.style = this.featureStyle;
            }
        }
        this.point.geometry.clearBounds();
        if (this.layer != null) {
            if (this.point != null) {
                this.layer.addFeatures([this.point]);
            }
            if (this.Orgline != null) {
                this.layer.addFeatures([this.Orgline]);
            }
        }
        //this.drawFeature();
    },

    /**
    * Method: drawFeature
    * Render geometries on the temporary layer.
    */
    drawFeature: function () {
        if (this.Orgline != null) {
            if (this.Orgline.style == null) {
                //this.layer.drawFeature(this.Orgline, this.style);
                this.layer.addFeatures([this.Orgline], this.style);
            }
            else {
               // this.layer.drawFeature(this.Orgline, this.Orgline.style);
                this.layer.addFeatures([this.Orgline], this.Orgline.style);
            }
        }
        //  this.layer.drawFeature(this.line, this.style);
        if (this.point != null) {
            this.layer.drawFeature(this.point, this.style);
        }
    },

    /**
    * Method: getSketch
    * Return the sketch feature.
    *
    * Returns:
    * {<OpenLayers.Feature.Vector>}
    */
    getSketch: function () {
        return this.line;
    },

    /**
    * Method: getGeometry
    * Return the sketch geometry.  If <multi> is true, this will return
    *     a multi-part geometry.
    *
    * Returns:
    * {<OpenLayers.Geometry.LineString>}
    */
    getGeometry: function () {
        var geometry = this.line && this.line.geometry;
        if (geometry && this.multi) {
            geometry = new OpenLayers.Geometry.MultiLineString([geometry]);
            // geometry = new Milstd.MilstdMultyLine([geometry]);
        }
        return geometry;
    },

    /**
    * method: touchstart
    * handle touchstart.
    *
    * parameters:
    * evt - {event} the browser event
    *
    * returns:
    * {boolean} allow event propagation
    */
    touchstart: function (evt) {
        if (this.timerId &&
            this.passesTolerance(this.lastTouchPx, evt.xy,
                                 this.doubleTouchTolerance)) {
            // double-tap, finalize the geometry
            this.finishGeometry();
            window.clearTimeout(this.timerId);
            this.timerId = null;
            return false;
        } else {
            if (this.timerId) {
                window.clearTimeout(this.timerId);
                this.timerId = null;
            }
            this.timerId = window.setTimeout(
                OpenLayers.Function.bind(function () {
                    this.timerId = null;
                }, this), 300);
            return OpenLayers.Handler.Point.prototype.touchstart.call(this, evt);
        }
    },

    /**
    * Method: down
    * Handle mousedown and touchstart.  Add a new point to the geometry and
    * render it. Return determines whether to propagate the event on the map.
    * 
    * Parameters:
    * evt - {Event} The browser event
    *
    * Returns: 
    * {Boolean} Allow event propagation
    */
    down: function (evt) {
        var stopDown = this.stopDown;
        if (this.freehandMode(evt)) {
            stopDown = true;
        }
        if (!this.touch && (!this.lastDown ||
                            !this.passesTolerance(this.lastDown, evt.xy,
                                                  this.pixelTolerance))) {
            this.modifyFeature(evt.xy, !!this.lastUp);
        }
        this.mouseDown = true;
        this.lastDown = evt.xy;
        this.stoppedDown = stopDown;
        return !stopDown;
    },

    /**
    * Method: move
    * Handle mousemove and touchmove.  Adjust the geometry and redraw.
    * Return determines whether to propagate the event on the map.
    * 
    * Parameters:
    * evt - {Event} The browser event
    *
    * Returns: 
    * {Boolean} Allow event propagation
    */
    move: function (evt) {
        if (this.stoppedDown && this.freehandMode(evt)) {
            if (this.persist) {
                this.destroyPersistedFeature();
            }
            this.addPoint(evt.xy);
            return false;
        }
        if (!this.touch && (!this.mouseDown || this.stoppedDown)) {
            this.modifyFeature(evt.xy, !!this.lastUp);
        }
        return true;
    },

    /**
    * Method: up
    * Handle mouseup and touchend.  Send the latest point in the geometry to
    * the control. Return determines whether to propagate the event on the map.
    * 
    * Parameters:
    * evt - {Event} The browser event
    *
    * Returns: 
    * {Boolean} Allow event propagation
    */
    up: function (evt) {
        if (this.mouseDown && (!this.lastUp || !this.lastUp.equals(evt.xy))) {
            if (this.stoppedDown && this.freehandMode(evt)) {
                this.removePoint();
                this.finalize();
            } else {
                if (this.passesTolerance(this.lastDown, evt.xy,
                                         this.pixelTolerance)) {
                    if (this.touch) {
                        this.modifyFeature(evt.xy);
                    }
                    if (this.lastUp == null && this.persist) {
                        this.destroyPersistedFeature();
                    }
                    this.addPoint(evt.xy);
                    this.lastUp = evt.xy;

                    if (this.line != null && this.line.geometry != null) {
                        if (this.line.geometry.components.length === this.maxVertices + 1) {
                            this.finishGeometry();
                        }

                    }

                }
            }
        }
        this.stoppedDown = this.stopDown;
        this.mouseDown = false;
        return !this.stopUp;
    },

    /**
    * APIMethod: finishGeometry
    * Finish the geometry and send it back to the control.
    */
    finishGeometry: function () {
        if (this.line != null && this.line.geometry != null) {
            var index = this.line.geometry.components.length - 1;
            this.line.geometry.removeComponent(this.line.geometry.components[index]);
        }
        this.removePoint();
        this.finalizePath();

    },

    finalizePath: function (cancel) {

        var key = cancel ? "cancel" : "done";
        this.drawing = false;
        this.mouseDown = false;
        this.lastDown = null;
        this.lastUp = null;
        this.callback(key, [this.geometryClonePath()]);
        if (cancel || !this.persist) {
            this.destroyFeature();
        }
    },


    geometryClonePath: function () {
        var geom = null;
        if (this.Orgline != null && this.Orgline.geometry != null) {
            geom = this.Orgline.geometry;
        }
        switch (this.graphics) {
            case "ArrowCross":
            case "CircleClosedangle":
            case "Closedangle":
            case "DoubleClosedangle":
            case "Fourstar":          //四角指北针
            case "Rhombus":           //菱形指北针
            case "SameDirectionClosedangle": //同向尖角指北针
            case "Triangle":                 //三角指北针
            case "Vane":                     //风向标指北针
                var cloneGeom = geom.multyClone();
                return geom && cloneGeom;
                break;
            default:
                return geom && geom.clone();
                break;
        }
        //        if (this.graphics == "ArrowCross") {
        //            var cloneGeom = geom.multyClone();
        //            return geom && cloneGeom;
        //        }
        //        else {
        //            return geom && geom.clone();
        //        }

    },



    /**
    * Method: dblclick 
    * Handle double-clicks.
    * 
    * Parameters:
    * evt - {Event} The browser event
    *
    * Returns: 
    * {Boolean} Allow event propagation
    */
    dblclick: function (evt) {
        if (!this.freehandMode(evt)) {
            this.finishGeometry();
        }
        return false;
    },

    CLASS_NAME: "Milstd.MilStdPathHandle"
});
Milstd.MilstdMultyLine = OpenLayers.Class(OpenLayers.Geometry.Collection, {
    /**
    * Property: componentTypes
    * {Array(String)} An array of class names representing the types of
    * components that the collection can include.  A null value means the
    * component types are not restricted.
    */
    componentTypes: null,

    /**
    * Constructor: OpenLayers.Geometry.MultiLineString
    * Constructor for a MultiLineString Geometry.
    *
    * Parameters: 
    * components - {Array(<OpenLayers.Geometry.LineString>)} 
    *
    */

    /**
    * Property: graphics
    * {String("SimpleArrow  DoubleArrow etc")} 用来描述指北针图形的类型
    */
    graphics: null,

    /**
    * Property: componentTypes
    * {Array(OpenLayers.Geometry.Point)} 用来保存临时的拐点
    */
    oldVertices: null,

    initialize: function (components, oldPnts, graphicsName) {
        if (oldPnts != null) {
            this.oldVertices = oldPnts;
            this.graphics = graphicsName;
        }
        OpenLayers.Geometry.Collection.prototype.initialize.apply(this, arguments);
    },

    getVertices: function () {
        return this.oldVertices;
    },

    multyClone: function () {
        var geometry = new Milstd.MilstdMultyLine([],this.oldVertices,this.graphics);
        //var geometry = eval("new " + this.CLASS_NAME + "()");
        for (var i = 0, len = this.components.length; i < len; i++) {
            geometry.addComponent(this.components[i].clone());
        }

        // catch any randomly tagged-on properties
        OpenLayers.Util.applyDefaults(geometry, this);

        return geometry;
    },

    /**
    * Method: split
    * Use this geometry (the source) to attempt to split a target geometry.
    * 
    * Parameters:
    * target - {<OpenLayers.Geometry>} The target geometry.
    * options - {Object} Properties of this object will be used to determine
    *     how the split is conducted.
    *
    * Valid options:
    * mutual - {Boolean} Split the source geometry in addition to the target
    *     geometry.  Default is false.
    * edge - {Boolean} Allow splitting when only edges intersect.  Default is
    *     true.  If false, a vertex on the source must be within the tolerance
    *     distance of the intersection to be considered a split.
    * tolerance - {Number} If a non-null value is provided, intersections
    *     within the tolerance distance of an existing vertex on the source
    *     will be assumed to occur at the vertex.
    * 
    * Returns:
    * {Array} A list of geometries (of this same type as the target) that
    *     result from splitting the target with the source geometry.  The
    *     source and target geometry will remain unmodified.  If no split
    *     results, null will be returned.  If mutual is true and a split
    *     results, return will be an array of two arrays - the first will be
    *     all geometries that result from splitting the source geometry and
    *     the second will be all geometries that result from splitting the
    *     target geometry.
    */
    split: function (geometry, options) {
        var results = null;
        var mutual = options && options.mutual;
        var splits, sourceLine, sourceLines, sourceSplit, targetSplit;
        var sourceParts = [];
        var targetParts = [geometry];
        for (var i = 0, len = this.components.length; i < len; ++i) {
            sourceLine = this.components[i];
            sourceSplit = false;
            for (var j = 0; j < targetParts.length; ++j) {
                splits = sourceLine.split(targetParts[j], options);
                if (splits) {
                    if (mutual) {
                        sourceLines = splits[0];
                        for (var k = 0, klen = sourceLines.length; k < klen; ++k) {
                            if (k === 0 && sourceParts.length) {
                                sourceParts[sourceParts.length - 1].addComponent(
                                    sourceLines[k]
                                );
                            } else {
                                sourceParts.push(
                                    new OpenLayers.Geometry.MultiLineString([
                                        sourceLines[k]
                                    ])
                                );
                            }
                        }
                        sourceSplit = true;
                        splits = splits[1];
                    }
                    if (splits.length) {
                        // splice in new target parts
                        splits.unshift(j, 1);
                        Array.prototype.splice.apply(targetParts, splits);
                        break;
                    }
                }
            }
            if (!sourceSplit) {
                // source line was not hit
                if (sourceParts.length) {
                    // add line to existing multi
                    sourceParts[sourceParts.length - 1].addComponent(
                        sourceLine.clone()
                    );
                } else {
                    // create a fresh multi
                    sourceParts = [
                        new OpenLayers.Geometry.MultiLineString(
                            sourceLine.clone()
                        )
                    ];
                }
            }
        }
        if (sourceParts && sourceParts.length > 1) {
            sourceSplit = true;
        } else {
            sourceParts = [];
        }
        if (targetParts && targetParts.length > 1) {
            targetSplit = true;
        } else {
            targetParts = [];
        }
        if (sourceSplit || targetSplit) {
            if (mutual) {
                results = [sourceParts, targetParts];
            } else {
                results = targetParts;
            }
        }
        return results;
    },

    /**
    * Method: splitWith
    * Split this geometry (the target) with the given geometry (the source).
    *
    * Parameters:
    * geometry - {<OpenLayers.Geometry>} A geometry used to split this
    *     geometry (the source).
    * options - {Object} Properties of this object will be used to determine
    *     how the split is conducted.
    *
    * Valid options:
    * mutual - {Boolean} Split the source geometry in addition to the target
    *     geometry.  Default is false.
    * edge - {Boolean} Allow splitting when only edges intersect.  Default is
    *     true.  If false, a vertex on the source must be within the tolerance
    *     distance of the intersection to be considered a split.
    * tolerance - {Number} If a non-null value is provided, intersections
    *     within the tolerance distance of an existing vertex on the source
    *     will be assumed to occur at the vertex.
    * 
    * Returns:
    * {Array} A list of geometries (of this same type as the target) that
    *     result from splitting the target with the source geometry.  The
    *     source and target geometry will remain unmodified.  If no split
    *     results, null will be returned.  If mutual is true and a split
    *     results, return will be an array of two arrays - the first will be
    *     all geometries that result from splitting the source geometry and
    *     the second will be all geometries that result from splitting the
    *     target geometry.
    */
    splitWith: function (geometry, options) {
        var results = null;
        var mutual = options && options.mutual;
        var splits, targetLine, sourceLines, sourceSplit, targetSplit, sourceParts, targetParts;
        if (geometry instanceof OpenLayers.Geometry.LineString) {
            targetParts = [];
            sourceParts = [geometry];
            for (var i = 0, len = this.components.length; i < len; ++i) {
                targetSplit = false;
                targetLine = this.components[i];
                for (var j = 0; j < sourceParts.length; ++j) {
                    splits = sourceParts[j].split(targetLine, options);
                    if (splits) {
                        if (mutual) {
                            sourceLines = splits[0];
                            if (sourceLines.length) {
                                // splice in new source parts
                                sourceLines.unshift(j, 1);
                                Array.prototype.splice.apply(sourceParts, sourceLines);
                                j += sourceLines.length - 2;
                            }
                            splits = splits[1];
                            if (splits.length === 0) {
                                splits = [targetLine.clone()];
                            }
                        }
                        for (var k = 0, klen = splits.length; k < klen; ++k) {
                            if (k === 0 && targetParts.length) {
                                targetParts[targetParts.length - 1].addComponent(
                                    splits[k]
                                );
                            } else {
                                targetParts.push(
                                    new OpenLayers.Geometry.MultiLineString([
                                        splits[k]
                                    ])
                                );
                            }
                        }
                        targetSplit = true;
                    }
                }
                if (!targetSplit) {
                    // target component was not hit
                    if (targetParts.length) {
                        // add it to any existing multi-line
                        targetParts[targetParts.length - 1].addComponent(
                            targetLine.clone()
                        );
                    } else {
                        // or start with a fresh multi-line
                        targetParts = [
                            new OpenLayers.Geometry.MultiLineString([
                                targetLine.clone()
                            ])
                        ];
                    }

                }
            }
        } else {
            results = geometry.split(this);
        }
        if (sourceParts && sourceParts.length > 1) {
            sourceSplit = true;
        } else {
            sourceParts = [];
        }
        if (targetParts && targetParts.length > 1) {
            targetSplit = true;
        } else {
            targetParts = [];
        }
        if (sourceSplit || targetSplit) {
            if (mutual) {
                results = [sourceParts, targetParts];
            } else {
                results = targetParts;
            }
        }
        return results;
    },

    CLASS_NAME: "OpenLayers.Geometry.MultiLineString"
});
Milstd.MilstdGeomRing = OpenLayers.Class(OpenLayers.Geometry.LineString, {

      /**
      * Property: headHeightFactor
      * {Number} 箭头头部高度因子
      */
      headHeightFactor: 0.2,

      /**
      * Property: headHeightFactor
      * {Number} 箭头头部宽度因子
      */
      headWidthFactor: 0.5,

      /**
      * Property: headHeightFactor
      * {Number} 箭头腰部高度因子
      */
      neckHeightFactor: 0.8,

      /**
      * Property: headHeightFactor
      * {Number} 箭头腰部宽度因子
      */
      neckWidthFactor: 0.2,

      /**
      * Property: headHeightFactor
      * {Number} 箭头尾部宽度因子
      */
      tailWidthFactor: 0.1,

      hasSwallowTail: true,
      swallowTailFactor: 0.5,
      curveFitMethod: "useBSplieFit",

      /**
      * Property: graphics
      * {String("SimpleArrow  DoubleArrow etc")} 用来描述图形的类型，包括单箭头 双箭头等
      */
      graphics:null,

      /**
      * Property: componentTypes
      * {Array(OpenLayers.Geometry.Point)} 用来保存临时的拐点
      */
      oldVertices: null,

      /**
      * Property: componentTypes
      * {Array(String)} An array of class names representing the types of 
      *                 components that the collection can include.  A null 
      *                 value means the component types are not restricted.
      */
      componentTypes: ["OpenLayers.Geometry.Point"],

      /**
      * Constructor: OpenLayers.Geometry.LinearRing
      * Linear rings are constructed with an array of points.  This array
      *     can represent a closed or open ring.  If the ring is open (the last
      *     point does not equal the first point), the constructor will close
      *     the ring.  If the ring is already closed (the last point does equal
      *     the first point), it will be left closed.
      * 
      * Parameters:
      * points - {Array(<OpenLayers.Geometry.Point>)} points
      */
      initialize: function (points, oldPnts , graphicsName) {
          if (oldPnts != null) {
              this.oldVertices = oldPnts;
              this.graphics = graphicsName;
          }
          OpenLayers.Geometry.LineString.prototype.initialize.apply(this, arguments);
      },

      setOptions: function (newOptions) {
          OpenLayers.Util.extend(this.options, newOptions);
          OpenLayers.Util.extend(this, newOptions);
      },

      /**
      * APIMethod: addComponent
      * Adds a point to geometry components.  If the point is to be added to
      *     the end of the components array and it is the same as the last point
      *     already in that array, the duplicate point is not added.  This has 
      *     the effect of closing the ring if it is not already closed, and 
      *     doing the right thing if it is already closed.  This behavior can 
      *     be overridden by calling the method with a non-null index as the 
      *     second argument.
      *
      * Parameter:
      * point - {<OpenLayers.Geometry.Point>}
      * index - {Integer} Index into the array to insert the component
      * 
      * Returns:
      * {Boolean} Was the Point successfully added?
      */
      addComponent: function (point, index) {
          var added = false;

          //remove last point
          var lastPoint = this.components.pop();

          // given an index, add the point
          // without an index only add non-duplicate points
          if (index != null || !point.equals(lastPoint)) {
              added = OpenLayers.Geometry.Collection.prototype.addComponent.apply(this,
                                                                    arguments);
          }

          //append copy of first point
          var firstPoint = this.components[0];
          OpenLayers.Geometry.Collection.prototype.addComponent.apply(this,
                                                                [firstPoint]);
          //this.oldVertices.push(point);
          return added;
      },

      /**
      * APIMethod: removeComponent
      * Removes a point from geometry components.
      *
      * Parameters:
      * point - {<OpenLayers.Geometry.Point>}
      */
      removeComponent: function (point) {
          if (this.components.length > 4) {

              //remove last point
              this.components.pop();

              //remove our point
              OpenLayers.Geometry.Collection.prototype.removeComponent.apply(this,
                                                                    arguments);
              //append copy of first point
              var firstPoint = this.components[0];
              OpenLayers.Geometry.Collection.prototype.addComponent.apply(this,
                                                                [firstPoint]);
          }
      },

      /**
      * APIMethod: move
      * Moves a geometry by the given displacement along positive x and y axes.
      *     This modifies the position of the geometry and clears the cached
      *     bounds.
      *
      * Parameters:
      * x - {Float} Distance to move geometry in positive x direction. 
      * y - {Float} Distance to move geometry in positive y direction.
      */
      move: function (x, y) {
          for (var i = 0, len = this.components.length; i < len - 1; i++) {
              this.components[i].move(x, y);
          }
      },

      /**
      * APIMethod: rotate
      * Rotate a geometry around some origin
      *
      * Parameters:
      * angle - {Float} Rotation angle in degrees (measured counterclockwise
      *                 from the positive x-axis)
      * origin - {<OpenLayers.Geometry.Point>} Center point for the rotation
      */
      rotate: function (angle, origin) {
          for (var i = 0, len = this.components.length; i < len - 1; ++i) {
              this.components[i].rotate(angle, origin);
          }
      },

      /**
      * APIMethod: resize
      * Resize a geometry relative to some origin.  Use this method to apply
      *     a uniform scaling to a geometry.
      *
      * Parameters:
      * scale - {Float} Factor by which to scale the geometry.  A scale of 2
      *                 doubles the size of the geometry in each dimension
      *                 (lines, for example, will be twice as long, and polygons
      *                 will have four times the area).
      * origin - {<OpenLayers.Geometry.Point>} Point of origin for resizing
      * ratio - {Float} Optional x:y ratio for resizing.  Default ratio is 1.
      * 
      * Returns:
      * {OpenLayers.Geometry} - The current geometry. 
      */
      resize: function (scale, origin, ratio) {
          for (var i = 0, len = this.components.length; i < len - 1; ++i) {
              this.components[i].resize(scale, origin, ratio);
          }
          return this;
      },

      /**
      * APIMethod: transform
      * Reproject the components geometry from source to dest.
      *
      * Parameters:
      * source - {<OpenLayers.Projection>}
      * dest - {<OpenLayers.Projection>}
      * 
      * Returns:
      * {<OpenLayers.Geometry>} 
      */
      transform: function (source, dest) {
          if (source && dest) {
              for (var i = 0, len = this.components.length; i < len - 1; i++) {
                  var component = this.components[i];
                  component.transform(source, dest);
              }
              this.bounds = null;
          }
          return this;
      },

      /**
      * APIMethod: getCentroid
      *
      * Returns:
      * {<OpenLayers.Geometry.Point>} The centroid of the collection
      */
      getCentroid: function () {
          if (this.components && (this.components.length > 2)) {
              var sumX = 0.0;
              var sumY = 0.0;
              for (var i = 0; i < this.components.length - 1; i++) {
                  var b = this.components[i];
                  var c = this.components[i + 1];
                  sumX += (b.x + c.x) * (b.x * c.y - c.x * b.y);
                  sumY += (b.y + c.y) * (b.x * c.y - c.x * b.y);
              }
              var area = -1 * this.getArea();
              var x = sumX / (6 * area);
              var y = sumY / (6 * area);
              return new OpenLayers.Geometry.Point(x, y);
          } else {
              return null;
          }
      },

      /**
      * APIMethod: getArea
      * Note - The area is positive if the ring is oriented CW, otherwise
      *         it will be negative.
      * 
      * Returns:
      * {Float} The signed area for a ring.
      */
      getArea: function () {
          var area = 0.0;
          if (this.components && (this.components.length > 2)) {
              var sum = 0.0;
              for (var i = 0, len = this.components.length; i < len - 1; i++) {
                  var b = this.components[i];
                  var c = this.components[i + 1];
                  sum += (b.x + c.x) * (c.y - b.y);
              }
              area = -sum / 2.0;
          }
          return area;
      },

      /**
      * APIMethod: getGeodesicArea
      * Calculate the approximate area of the polygon were it projected onto
      *     the earth.  Note that this area will be positive if ring is oriented
      *     clockwise, otherwise it will be negative.
      *
      * Parameters:
      * projection - {<OpenLayers.Projection>} The spatial reference system
      *     for the geometry coordinates.  If not provided, Geographic/WGS84 is
      *     assumed.
      * 
      * Reference:
      * Robert. G. Chamberlain and William H. Duquette, "Some Algorithms for
      *     Polygons on a Sphere", JPL Publication 07-03, Jet Propulsion
      *     Laboratory, Pasadena, CA, June 2007 http://trs-new.jpl.nasa.gov/dspace/handle/2014/40409
      *
      * Returns:
      * {float} The approximate signed geodesic area of the polygon in square
      *     meters.
      */
      getGeodesicArea: function (projection) {
          var ring = this;  // so we can work with a clone if needed
          if (projection) {
              var gg = new OpenLayers.Projection("EPSG:4326");
              if (!gg.equals(projection)) {
                  ring = this.clone().transform(projection, gg);
              }
          }
          var area = 0.0;
          var len = ring.components && ring.components.length;
          if (len > 2) {
              var p1, p2;
              for (var i = 0; i < len - 1; i++) {
                  p1 = ring.components[i];
                  p2 = ring.components[i + 1];
                  area += OpenLayers.Util.rad(p2.x - p1.x) *
                        (2 + Math.sin(OpenLayers.Util.rad(p1.y)) +
                        Math.sin(OpenLayers.Util.rad(p2.y)));
              }
              area = area * 6378137.0 * 6378137.0 / 2.0;
          }
          return area;
      },

      /**
      * Method: containsPoint
      * Test if a point is inside a linear ring.  For the case where a point
      *     is coincident with a linear ring edge, returns 1.  Otherwise,
      *     returns boolean.
      *
      * Parameters:
      * point - {<OpenLayers.Geometry.Point>}
      *
      * Returns:
      * {Boolean | Number} The point is inside the linear ring.  Returns 1 if
      *     the point is coincident with an edge.  Returns boolean otherwise.
      */
      containsPoint: function (point) {
          var approx = OpenLayers.Number.limitSigDigs;
          var digs = 14;
          var px = approx(point.x, digs);
          var py = approx(point.y, digs);
          function getX(y, x1, y1, x2, y2) {
              return (((x1 - x2) * y) + ((x2 * y1) - (x1 * y2))) / (y1 - y2);
          }
          var numSeg = this.components.length - 1;
          var start, end, x1, y1, x2, y2, cx, cy;
          var crosses = 0;
          for (var i = 0; i < numSeg; ++i) {
              start = this.components[i];
              x1 = approx(start.x, digs);
              y1 = approx(start.y, digs);
              end = this.components[i + 1];
              x2 = approx(end.x, digs);
              y2 = approx(end.y, digs);

              /**
              * The following conditions enforce five edge-crossing rules:
              *    1. points coincident with edges are considered contained;
              *    2. an upward edge includes its starting endpoint, and
              *    excludes its final endpoint;
              *    3. a downward edge excludes its starting endpoint, and
              *    includes its final endpoint;
              *    4. horizontal edges are excluded; and
              *    5. the edge-ray intersection point must be strictly right
              *    of the point P.
              */
              if (y1 == y2) {
                  // horizontal edge
                  if (py == y1) {
                      // point on horizontal line
                      if (x1 <= x2 && (px >= x1 && px <= x2) || // right or vert
                       x1 >= x2 && (px <= x1 && px >= x2)) { // left or vert
                          // point on edge
                          crosses = -1;
                          break;
                      }
                  }
                  // ignore other horizontal edges
                  continue;
              }
              cx = approx(getX(py, x1, y1, x2, y2), digs);
              if (cx == px) {
                  // point on line
                  if (y1 < y2 && (py >= y1 && py <= y2) || // upward
                   y1 > y2 && (py <= y1 && py >= y2)) { // downward
                      // point on edge
                      crosses = -1;
                      break;
                  }
              }
              if (cx <= px) {
                  // no crossing to the right
                  continue;
              }
              if (x1 != x2 && (cx < Math.min(x1, x2) || cx > Math.max(x1, x2))) {
                  // no crossing
                  continue;
              }
              if (y1 < y2 && (py >= y1 && py < y2) || // upward
               y1 > y2 && (py < y1 && py >= y2)) { // downward
                  ++crosses;
              }
          }
          var contained = (crosses == -1) ?
          // on edge
            1 :
          // even (out) or odd (in)
            !!(crosses & 1);

          return contained;
      },

      /**
      * APIMethod: intersects
      * Determine if the input geometry intersects this one.
      *
      * Parameters:
      * geometry - {<OpenLayers.Geometry>} Any type of geometry.
      *
      * Returns:
      * {Boolean} The input geometry intersects this one.
      */
      intersects: function (geometry) {
          var intersect = false;
          if (geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
              intersect = this.containsPoint(geometry);
          } else if (geometry.CLASS_NAME == "OpenLayers.Geometry.LineString") {
              intersect = geometry.intersects(this);
          } else if (geometry.CLASS_NAME == "OpenLayers.Geometry.LinearRing") {
              intersect = OpenLayers.Geometry.LineString.prototype.intersects.apply(
                this, [geometry]
            );
          } else {
              // check for component intersections
              for (var i = 0, len = geometry.components.length; i < len; ++i) {
                  intersect = geometry.components[i].intersects(this);
                  if (intersect) {
                      break;
                  }
              }
          }
          return intersect;
      },

      /**
      * APIMethod: getVertices
      * Return a list of all points in this geometry.
      *
      * Parameters:
      * nodes - {Boolean} For lines, only return vertices that are
      *     endpoints.  If false, for lines, only vertices that are not
      *     endpoints will be returned.  If not provided, all vertices will
      *     be returned.
      *
      * Returns:
      * {Array} A list of all vertices in the geometry.
      */
      //      getVertices: function (nodes) {
      //          return (nodes === true) ? [] : this.components.slice(0, this.components.length - 1);
      //      },

      getVertices: function (nodes) {
          return (nodes === true) ? [] : this.oldVertices;
      },
      CLASS_NAME: "OpenLayers.Geometry.LinearRing"
  });
  /* * 
  *
  *更改OpenLayers.Feature形状和位置的控件
  * 
  */
Milstd.ModifyControl = OpenLayers.Class(OpenLayers.Control, {

      /**
      * APIProperty: indexOfVectice
      * {Number} 当前拖拽的控制点的索引
      */
      indexOfVectice: null,

      /**
      * APIProperty: dragStartVect
      * {Point} 拖拽开始所捕捉的点
      */
      dragStartVect: null,

      /**
      * APIProperty: geometryTypes
      * {Array(String)} To restrict modification to a limited set of geometry
      *     types, send a list of strings corresponding to the geometry class
      *     names.
      */
      geometryTypes: null,

      /**
      * APIProperty: clickout
      * {Boolean} Unselect features when clicking outside any feature.
      *     Default is true.
      */
      clickout: true,

      /**
      * APIProperty: toggle
      * {Boolean} Unselect a selected feature on click.
      *      Default is true.
      */
      toggle: true,

      /**
      * APIProperty: standalone
      * {Boolean} Set to true to create a control without SelectFeature
      *     capabilities. Default is false.  If standalone is true, to modify
      *     a feature, call the <selectFeature> method with the target feature.
      *     Note that you must call the <unselectFeature> method to finish
      *     feature modification in standalone mode (before starting to modify
      *     another feature).
      */
      standalone: false,

      /**
      * Property: layer
      * {<OpenLayers.Layer.Vector>}
      */
      layer: null,

      /**
      * Property: feature
      * {<OpenLayers.Feature.Vector>} Feature currently available for modification.
      */
      feature: null,

      /**
      * Property: vertices
      * {Array(<OpenLayers.Feature.Vector>)} Verticies currently available
      *     for dragging.
      */
      vertices: null,

      /**
      * Property: virtualVertices
      * {Array(<OpenLayers.Feature.Vector>)} Virtual vertices in the middle
      *     of each edge.
      */
      virtualVertices: null,

      /**
      * Property: selectControl
      * {<OpenLayers.Control.SelectFeature>}
      */
      selectControl: null,

      /**
      * Property: dragControl
      * {<OpenLayers.Control.DragFeature>}
      */
      dragControl: null,

      /**
      * Property: handlers
      * {Object}
      */
      handlers: null,

      /**
      * APIProperty: deleteCodes
      * {Array(Integer)} Keycodes for deleting verticies.  Set to null to disable
      *     vertex deltion by keypress.  If non-null, keypresses with codes
      *     in this array will delete vertices under the mouse. Default
      *     is 46 and 68, the 'delete' and lowercase 'd' keys.
      */
      deleteCodes: null,

      /**
      * APIProperty: virtualStyle
      * {Object} A symbolizer to be used for virtual vertices.
      */
      virtualStyle: null,

      /**
      * APIProperty: mode
      * {Integer} Bitfields specifying the modification mode. Defaults to
      *      OpenLayers.Control.ModifyFeature.RESHAPE. To set the mode to a
      *      combination of options, use the | operator. For example, to allow
      *      the control to both resize and rotate features, use the following
      *      syntax
      * (code)
      * control.mode = OpenLayers.Control.ModifyFeature.RESIZE |
      *                OpenLayers.Control.ModifyFeature.ROTATE;
      *  (end)
      */
      mode: null,

      /**
      * Property: modified
      * {Boolean} The currently selected feature has been modified.
      */
      modified: false,

      /**
      * Property: radiusHandle
      * {<OpenLayers.Feature.Vector>} A handle for rotating/resizing a feature.
      */
      radiusHandle: null,

      /**
      * Property: dragHandle
      * {<OpenLayers.Feature.Vector>} A handle for dragging a feature.
      */
      dragHandle: null,

      /**
      * APIProperty: onModificationStart 
      * {Function} *Deprecated*.  Register for "beforefeaturemodified" instead.
      *     The "beforefeaturemodified" event is triggered on the layer before
      *     any modification begins.
      *
      * Optional function to be called when a feature is selected
      *     to be modified. The function should expect to be called with a
      *     feature.  This could be used for example to allow to lock the
      *     feature on server-side.
      */
      onModificationStart: function () { },

      /**
      * APIProperty: onModification
      * {Function} *Deprecated*.  Register for "featuremodified" instead.
      *     The "featuremodified" event is triggered on the layer with each
      *     feature modification.
      *
      * Optional function to be called when a feature has been
      *     modified.  The function should expect to be called with a feature.
      */
      onModification: function () { },

      /**
      * APIProperty: onModificationEnd
      * {Function} *Deprecated*.  Register for "afterfeaturemodified" instead.
      *     The "afterfeaturemodified" event is triggered on the layer after
      *     a feature has been modified.
      *
      * Optional function to be called when a feature is finished 
      *     being modified.  The function should expect to be called with a
      *     feature.
      */
      onModificationEnd: function () { },

      /**
      * Constructor: OpenLayers.Control.ModifyFeature
      * Create a new modify feature control.
      *
      * Parameters:
      * layer - {<OpenLayers.Layer.Vector>} Layer that contains features that
      *     will be modified.
      * options - {Object} Optional object whose properties will be set on the
      *     control.
      */
      initialize: function (layer, options) {
          this.layer = layer;
          this.vertices = [];
          this.virtualVertices = [];
          this.virtualStyle = OpenLayers.Util.extend({},
            this.layer.style || this.layer.styleMap.createSymbolizer());
          this.virtualStyle.fillOpacity = 0.3;
          this.virtualStyle.strokeOpacity = 0.3;
          this.deleteCodes = [46, 68];
          this.mode = OpenLayers.Control.ModifyFeature.RESHAPE;
          OpenLayers.Control.prototype.initialize.apply(this, [options]);
          if (!(this.deleteCodes instanceof Array)) {
              this.deleteCodes = [this.deleteCodes];
          }
          var control = this;

          // configure the select control
          var selectOptions = {
              geometryTypes: this.geometryTypes,
              clickout: this.clickout,
              toggle: this.toggle,
              onBeforeSelect: this.beforeSelectFeature,
              onSelect: this.selectFeature,
              onUnselect: this.unselectFeature,
              scope: this
          };
          if (this.standalone === false) {
              this.selectControl = new OpenLayers.Control.SelectFeature(
                layer, selectOptions
            );
          }

          // configure the drag control
          var dragOptions = {
              geometryTypes: ["OpenLayers.Geometry.Point"],
              snappingOptions: this.snappingOptions,
              onStart: function (feature, pixel) {
                  control.dragStart.apply(control, [feature, pixel]);
              },
              onDrag: function (feature, pixel) {
                  control.dragVertex.apply(control, [feature, pixel]);
              },
              onComplete: function (feature) {
                  control.dragComplete.apply(control, [feature]);
              },
              featureCallbacks: {
                  over: function (feature) {
                      /**
                      * In normal mode, the feature handler is set up to allow
                      * dragging of all points.  In standalone mode, we only
                      * want to allow dragging of sketch vertices and virtual
                      * vertices - or, in the case of a modifiable point, the
                      * point itself.
                      */
                      if (control.standalone !== true || feature._sketch ||
                       control.feature === feature) {
                          control.dragControl.overFeature.apply(
                            control.dragControl, [feature]);
                      }
                  }
              }
          };
          this.dragControl = new OpenLayers.Control.DragFeature(
            layer, dragOptions
        );

          // configure the keyboard handler
          var keyboardOptions = {
              keydown: this.handleKeypress
          };
          this.handlers = {
              keyboard: new OpenLayers.Handler.Keyboard(this, keyboardOptions)
          };
      },

      /**
      * APIMethod: destroy
      * Take care of things that are not handled in superclass.
      */
      destroy: function () {
          this.layer = null;
          this.standalone || this.selectControl.destroy();
          this.dragControl.destroy();
          OpenLayers.Control.prototype.destroy.apply(this, []);
      },

      /**
      * APIMethod: activate
      * Activate the control.
      * 
      * Returns:
      * {Boolean} Successfully activated the control.
      */
      activate: function () {
          return ((this.standalone || this.selectControl.activate()) &&
                this.handlers.keyboard.activate() &&
                OpenLayers.Control.prototype.activate.apply(this, arguments));
      },

      /**
      * APIMethod: deactivate
      * Deactivate the control.
      *
      * Returns: 
      * {Boolean} Successfully deactivated the control.
      */
      deactivate: function () {
          var deactivated = false;
          // the return from the controls is unimportant in this case
          if (OpenLayers.Control.prototype.deactivate.apply(this, arguments)) {
              this.layer.removeFeatures(this.vertices, { silent: true });
              this.layer.removeFeatures(this.virtualVertices, { silent: true });
              this.vertices = [];
              this.dragControl.deactivate();
              var feature = this.feature;
              var valid = feature && feature.geometry && feature.layer;
              if (this.standalone === false) {
                  if (valid) {
                      this.selectControl.unselect.apply(this.selectControl,
                                                      [feature]);
                  }
                  this.selectControl.deactivate();
              } else {
                  if (valid) {
                      this.unselectFeature(feature);
                  }
              }
              this.handlers.keyboard.deactivate();
              deactivated = true;
          }
          return deactivated;
      },

      /**
      * Method: beforeSelectFeature
      * Called before a feature is selected.
      *
      * Parameters:
      * feature - {<OpenLayers.Feature.Vector>} The feature about to be selected.
      */
      beforeSelectFeature: function (feature) {
          return this.layer.events.triggerEvent(
            "beforefeaturemodified", { feature: feature }
        );
      },

      /**
      * Method: selectFeature
      * Called when the select feature control selects a feature.
      *
      * Parameters:
      * feature - {<OpenLayers.Feature.Vector>} the selected feature.
      */
      selectFeature: function (feature) {
          this.feature = feature;
          this.modified = false;
          this.resetVertices();
          this.dragControl.activate();
          this.onModificationStart(this.feature);
      },

      /**
      * Method: unselectFeature
      * Called when the select feature control unselects a feature.
      *
      * Parameters:
      * feature - {<OpenLayers.Feature.Vector>} The unselected feature.
      */
      unselectFeature: function (feature) {
          this.layer.removeFeatures(this.vertices, { silent: true });
          this.vertices = [];
          this.layer.destroyFeatures(this.virtualVertices, { silent: true });
          this.virtualVertices = [];
          if (this.dragHandle) {
              this.layer.destroyFeatures([this.dragHandle], { silent: true });
              delete this.dragHandle;
          }
          if (this.radiusHandle) {
              this.layer.destroyFeatures([this.radiusHandle], { silent: true });
              delete this.radiusHandle;
          }
          this.feature = null;
          this.dragControl.deactivate();
          this.onModificationEnd(feature);
          this.layer.events.triggerEvent("afterfeaturemodified", {
              feature: feature,
              modified: this.modified
          });
          this.modified = false;
      },

      /**
      * Method: dragStart
      * Called by the drag feature control with before a feature is dragged.
      *     This method is used to differentiate between points and vertices
      *     of higher order geometries.  This respects the <geometryTypes>
      *     property and forces a select of points when the drag control is
      *     already active (and stops events from propagating to the select
      *     control).
      *
      * Parameters:
      * feature - {<OpenLayers.Feature.Vector>} The point or vertex about to be
      *     dragged.
      * pixel - {<OpenLayers.Pixel>} Pixel location of the mouse event.
      */
      dragStart: function (feature, pixel) {
          if (feature != null && feature.geometry != null) {

              //Mode==reshape 
              if (this.mode == OpenLayers.Control.ModifyFeature.RESHAPE) {
                  var verticesOld = this.feature.geometry.oldVertices;
                  for (var i = 0; i < verticesOld.length; i++) {
                      if (verticesOld[i].equals(feature.geometry)) {
                          this.indexOfVectice = i;
                          break;
                      }
                  }
              }


              //Mode==Drag
              if (this.mode == OpenLayers.Control.ModifyFeature.DRAG) {
                  this.dragStartVect = feature;
              }

          }

      },

      /**
      * Method: dragVertex
      * Called by the drag feature control with each drag move of a vertex.
      *
      * Parameters:
      * vertex - {<OpenLayers.Feature.Vector>} The vertex being dragged.
      * pixel - {<OpenLayers.Pixel>} Pixel location of the mouse event.
      */
      dragVertex: function (vertex, pixel) {
          this.modified = true;

          if (this.feature.geometry.CLASS_NAME == "OpenLayers.Geometry.LinearRing" || this.feature.geometry.CLASS_NAME == "OpenLayers.Geometry.MultiLineString") {

              var m_oldVertices = this.feature.geometry.oldVertices;

              if (this.mode == OpenLayers.Control.ModifyFeature.RESHAPE) {
                  if (this.indexOfVectice < 0 || this.indexOfVectice == null) {
                      return;
                  }
                  if (this.feature.geometry != null) {
                      //                      if (this.feature.geometry.graphics == "TriangleFlag" || this.feature.geometry.graphics == "RectFlag" || this.feature.geometry.graphics == "CurveFlag") {
                      //                          if (this.indexOfVectice == 0) {
                      //                              if (vertex.geometry.x >= m_oldVertices[1].x || vertex.geometry.y <= m_oldVertices[1].y) {
                      //                                  return;
                      //                              }
                      //                          }
                      //                          if (this.indexOfVectice == 1) {
                      //                              if (vertex.geometry.x <= m_oldVertices[0].x || vertex.geometry.y >= m_oldVertices[0].y) {
                      //                                  return;
                      //                              }
                      //                          }
                      //                          m_oldVertices.splice(this.indexOfVectice, 1, vertex.geometry);
                      //                          Milstd.Flag.prototype.CreateNewVertices(m_oldVertices);
                      //                      }
                      //                      else {
                      //                          m_oldVertices.splice(this.indexOfVectice, 1, vertex.geometry);
                      //                      }

                      switch (this.feature.geometry.graphics) {
                          case "TriangleFlag":
                          case "RectFlag":
                          case "CurveFlag":
                          case "ArrowCross":
                          case "CircleClosedangle":
                          case "Closedangle":
                          case "DoubleClosedangle":
                          case "Fourstar":          //四角指北针
                          case "Rhombus":           //菱形指北针
                          case "SameDirectionClosedangle": //同向尖角指北针
                          case "Triangle":                 //三角指北针
                          case "Vane":                     //风向标指北针

                              if (this.indexOfVectice == 0) {
                                  if (vertex.geometry.x >= m_oldVertices[1].x || vertex.geometry.y <= m_oldVertices[1].y) {
                                      return;
                                  }
                              }
                              if (this.indexOfVectice == 1) {
                                  if (vertex.geometry.x <= m_oldVertices[0].x || vertex.geometry.y >= m_oldVertices[0].y) {
                                      return;
                                  }
                              }
                              m_oldVertices.splice(this.indexOfVectice, 1, vertex.geometry);
                              Milstd.Flag.prototype.CreateNewVertices(m_oldVertices);
                              break;
                          case "SimpleArrow":
                          case "DoubleArrow":
                              m_oldVertices.splice(this.indexOfVectice, 1, vertex.geometry);
                              break;
                      }
                  }
                  else {
                      return;
                  }


                  //  Milstd.Flag.prototype.CreateNewVertices(m_oldVertices);

              }

              if (this.mode == OpenLayers.Control.ModifyFeature.DRAG) {
                  // this.control.map.getLonLatFromPixel(pixel);

                  // var temPos = this.layer.map.getLonLatFromPixel(pixel);
                  var xDis = vertex.geometry.x - this.dragStartVect.geometry.x;
                  var yDis = vertex.geometry.y - this.dragStartVect.geometry.y;
                  for (var i = 0; i < m_oldVertices.length; i++) {
                      //   m_oldVertices[i].move(xDis, yDis);
                      var temPnt = m_oldVertices[i].clone();
                      var temPnt1 = new OpenLayers.Geometry.Point((temPnt.x + xDis), (temPnt.y + yDis));
                      m_oldVertices.splice(i, 1, temPnt1);
                      //   Milstd.Flag.prototype.CreateNewVertices(m_oldVertices);
                  }
              }
              //this.dragStartVect = vertex.clone();

              var lin = Milstd.commonFun.prototype.getLineFeature(m_oldVertices);
              var linVectParse = null;
              if (this.feature.geometry != null) {
                  switch (this.feature.geometry.graphics) {
                      case "SimpleArrow":
                          linVectParse = Milstd.commonFun.prototype.getParseLine(lin, this.feature.geometry.hasSwallowTail,
                                 this.feature.geometry.swallowTailFactor, this.feature.geometry.curveFitMethod,
                                 this.feature.geometry.headHeightFactor, this.feature.geometry.headWidthFactor,
                                 this.feature.geometry.neckHeightFactor, this.feature.geometry.neckWidthFactor,
                                 this.feature.geometry.tailWidthFactor);
                          linVectParse.style = this.feature.style;
                          break;
                      case "DoubleArrow":
                          linVectParse = Milstd.DoubleArrowFun.prototype.getDoubleArrowFromVect(lin, this.feature.geometry.headHeightFactor, this.feature.geometry.headWidthFactor,
                                 this.feature.geometry.neckHeightFactor, this.feature.geometry.neckWidthFactor);
                          linVectParse.style = this.feature.style;
                          break;
                      case "TriangleFlag":
                      case "RectFlag":
                      case "CurveFlag":
                          //                          if (this.dragStartVect.geometry.x == vertex.geometry.x || this.dragStartVect.geometry.y == vertex.geometry.y) {
                          //                              return;
                          //                          }
                          linVectParse = Milstd.Flag.prototype.getFlagFromVect(lin, this.feature.geometry.graphics);
                          linVectParse.style = this.feature.style;
                          break;
                      case "ArrowCross":
                      case "CircleClosedangle":
                      case "Closedangle":
                      case "DoubleClosedangle":
                      case "Fourstar":          //四角指北针
                      case "Rhombus":           //菱形指北针
                      case "SameDirectionClosedangle": //同向尖角指北针
                      case "Triangle":                 //三角指北针
                      case "Vane":                     //风向标指北针
                          linVectParse = Milstd.Compass.prototype.getCrossFromVect(lin, this.feature.geometry.graphics);
                          linVectParse.style = this.feature.style;
                          break;
                  }

              }
              this.dragStartVect = vertex.clone();

              this.layer.destroyFeatures([this.feature]);
              this.feature.destroy();
              this.feature = linVectParse;

          }

          if (this.feature != null) {
              this.layer.addFeatures([this.feature]);
          }
          if (vertex != null) {
              this.layer.addFeatures([vertex]);
          }

      },

      /**
      * Method: dragComplete
      * Called by the drag feature control when the feature dragging is complete.
      *
      * Parameters:
      * vertex - {<OpenLayers.Feature.Vector>} The vertex being dragged.
      */
      dragComplete: function (vertex) {
          this.resetVertices();
          this.setFeatureState();
          this.onModification(this.feature);
          this.layer.events.triggerEvent("featuremodified",
                                       { feature: this.feature });
      },

      /**
      * Method: setFeatureState
      * Called when the feature is modified.  If the current state is not
      *     INSERT or DELETE, the state is set to UPDATE.
      */
      setFeatureState: function () {
          if (this.feature.state != OpenLayers.State.INSERT &&
           this.feature.state != OpenLayers.State.DELETE) {
              this.feature.state = OpenLayers.State.UPDATE;
          }
      },

      /**
      * Method: resetVertices
      */
      resetVertices: function () {
          // if coming from a drag complete we're about to destroy the vertex
          // that was just dragged. For that reason, the drag feature control
          // will never detect a mouse-out on that vertex, meaning that the drag
          // handler won't be deactivated. This can cause errors because the drag
          // feature control still has a feature to drag but that feature is
          // destroyed. To prevent this, we call outFeature on the drag feature
          // control if the control actually has a feature to drag.
          if (this.dragControl.feature) {
              this.dragControl.outFeature(this.dragControl.feature);
          }
          if (this.vertices.length > 0) {
              this.layer.removeFeatures(this.vertices, { silent: true });
              this.vertices = [];
          }
          if (this.virtualVertices.length > 0) {
              this.layer.removeFeatures(this.virtualVertices, { silent: true });
              this.virtualVertices = [];
          }
          if (this.dragHandle) {
              this.layer.destroyFeatures([this.dragHandle], { silent: true });
              this.dragHandle = null;
          }
          if (this.radiusHandle) {
              this.layer.destroyFeatures([this.radiusHandle], { silent: true });
              this.radiusHandle = null;
          }
          if (this.feature &&
           this.feature.geometry.CLASS_NAME != "OpenLayers.Geometry.Point") {
              if ((this.mode & OpenLayers.Control.ModifyFeature.DRAG)) {
                  this.collectDragHandle();
              }
              if ((this.mode & (OpenLayers.Control.ModifyFeature.ROTATE |
                             OpenLayers.Control.ModifyFeature.RESIZE))) {
                  this.collectRadiusHandle();
              }
              if (this.mode & OpenLayers.Control.ModifyFeature.RESHAPE) {
                  // Don't collect vertices when we're resizing
                  if (!(this.mode & OpenLayers.Control.ModifyFeature.RESIZE)) {
                      this.collectVertices();
                  }
              }
          }
      },

      /**
      * Method: handleKeypress
      * Called by the feature handler on keypress.  This is used to delete
      *     vertices. If the <deleteCode> property is set, vertices will
      *     be deleted when a feature is selected for modification and
      *     the mouse is over a vertex.
      *
      * Parameters:
      * {Integer} Key code corresponding to the keypress event.
      */
      handleKeypress: function (evt) {
          var code = evt.keyCode;

          // check for delete key
          if (this.feature &&
           OpenLayers.Util.indexOf(this.deleteCodes, code) != -1) {
              var vertex = this.dragControl.feature;
              if (vertex &&
               OpenLayers.Util.indexOf(this.vertices, vertex) != -1 &&
               !this.dragControl.handlers.drag.dragging &&
               vertex.geometry.parent) {
                  // remove the vertex
                  vertex.geometry.parent.removeComponent(vertex.geometry);
                  this.layer.drawFeature(this.feature, this.standalone ?
                                       undefined :
                                       this.selectControl.renderIntent);
                  this.resetVertices();
                  this.setFeatureState();
                  this.onModification(this.feature);
                  this.layer.events.triggerEvent("featuremodified",
                                               { feature: this.feature });
              }
          }
      },

      /**
      * Method: collectVertices
      * Collect the vertices from the modifiable feature's geometry and push
      *     them on to the control's vertices array.
      */
      collectVertices: function () {
          this.vertices = [];
          this.virtualVertices = [];
          var control = this;
          function collectComponentVertices(geometry) {
              var i, vertex, component, len;
              if (geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
                  vertex = new OpenLayers.Feature.Vector(geometry);
                  vertex._sketch = true;
                  control.vertices.push(vertex);
              } else {
                  var numVert = geometry.components.length;
                  if (geometry.CLASS_NAME == "OpenLayers.Geometry.LinearRing" || geometry.CLASS_NAME == "OpenLayers.Geometry.MultiLineString") {
                      var geoVertices = geometry.oldVertices;
                      if (geoVertices != null && geoVertices.length > 0) {
                          for (var i = 0; i < geoVertices.length; i++) {
                              vertex = new OpenLayers.Feature.Vector(geoVertices[i].clone());
                              vertex._sketch = true;
                              control.vertices.push(vertex);
                          }
                      }
                  }

              }
          }
          collectComponentVertices.call(this, this.feature.geometry);
          this.layer.addFeatures(this.vertices, { silent: true });
      },

      /**
      * Method: collectDragHandle
      * Collect the drag handle for the selected geometry.
      */
      collectDragHandle: function () {
          var geometry = this.feature.geometry;
          var center = geometry.getBounds().getCenterLonLat();
          var originGeometry = new OpenLayers.Geometry.Point(
            center.lon, center.lat
        );
          var origin = new OpenLayers.Feature.Vector(originGeometry);
          originGeometry.move = function (x, y) {
              OpenLayers.Geometry.Point.prototype.move.call(this, x, y);
              geometry.move(x, y);
          };
          origin._sketch = true;
          this.dragHandle = origin;
          this.layer.addFeatures([this.dragHandle], { silent: true });
      },

      /**
      * Method: collectRadiusHandle
      * Collect the radius handle for the selected geometry.
      */
      collectRadiusHandle: function () {
          var geometry = this.feature.geometry;
          var bounds = geometry.getBounds();
          var center = bounds.getCenterLonLat();
          var originGeometry = new OpenLayers.Geometry.Point(
            center.lon, center.lat
        );
          var radiusGeometry = new OpenLayers.Geometry.Point(
            bounds.right, bounds.bottom
        );
          var radius = new OpenLayers.Feature.Vector(radiusGeometry);
          var resize = (this.mode & OpenLayers.Control.ModifyFeature.RESIZE);
          var reshape = (this.mode & OpenLayers.Control.ModifyFeature.RESHAPE);
          var rotate = (this.mode & OpenLayers.Control.ModifyFeature.ROTATE);

          radiusGeometry.move = function (x, y) {
              OpenLayers.Geometry.Point.prototype.move.call(this, x, y);
              var dx1 = this.x - originGeometry.x;
              var dy1 = this.y - originGeometry.y;
              var dx0 = dx1 - x;
              var dy0 = dy1 - y;
              if (rotate) {
                  var a0 = Math.atan2(dy0, dx0);
                  var a1 = Math.atan2(dy1, dx1);
                  var angle = a1 - a0;
                  angle *= 180 / Math.PI;
                  geometry.rotate(angle, originGeometry);
              }
              if (resize) {
                  var scale, ratio;
                  // 'resize' together with 'reshape' implies that the aspect 
                  // ratio of the geometry will not be preserved whilst resizing 
                  if (reshape) {
                      scale = dy1 / dy0;
                      ratio = (dx1 / dx0) / scale;
                  } else {
                      var l0 = Math.sqrt((dx0 * dx0) + (dy0 * dy0));
                      var l1 = Math.sqrt((dx1 * dx1) + (dy1 * dy1));
                      scale = l1 / l0;
                  }
                  geometry.resize(scale, originGeometry, ratio);
              }
          };
          radius._sketch = true;
          this.radiusHandle = radius;
          this.layer.addFeatures([this.radiusHandle], { silent: true });
      },

      /**
      * Method: setMap
      * Set the map property for the control and all handlers.
      *
      * Parameters:
      * map - {<OpenLayers.Map>} The control's map.
      */
      setMap: function (map) {
          this.standalone || this.selectControl.setMap(map);
          this.dragControl.setMap(map);
          OpenLayers.Control.prototype.setMap.apply(this, arguments);
      },

      CLASS_NAME: "Milstd.ModifyControl"
  });

  /**
  * Constant: RESHAPE
  * {Integer} Constant used to make the control work in reshape mode
  */
  OpenLayers.Control.ModifyFeature.RESHAPE = 1;
  /**
  * Constant: RESIZE
  * {Integer} Constant used to make the control work in resize mode
  */
  OpenLayers.Control.ModifyFeature.RESIZE = 2;
  /**
  * Constant: ROTATE
  * {Integer} Constant used to make the control work in rotate mode
  */
  OpenLayers.Control.ModifyFeature.ROTATE = 4;
  /**
  * Constant: DRAG
  * {Integer} Constant used to make the control work in drag mode
  */
  OpenLayers.Control.ModifyFeature.DRAG = 8;


  /**
  * Constant: SimpleArrow
  * {Integer} 
  */
  Milstd.MilStdPathHandle.SimpleArrow = 100;

  /**
  * Constant: DoubleArrow
  * {Integer} 
  */
  Milstd.MilStdPathHandle.DoubleArrow = 101;

  /**
  * Class: SelectFeatureNew
  * {OpenLayers.Control} 
  */
  Milstd.SelectFeatureNew = OpenLayers.Class(OpenLayers.Control, {

      /**
      * Constant: EVENT_TYPES
      * Supported event types:
      *  - *beforefeaturehighlighted* Triggered before a feature is highlighted
      *  - *featurehighlighted* Triggered when a feature is highlighted
      *  - *featureunhighlighted* Triggered when a feature is unhighlighted
      */
      EVENT_TYPES: ["beforefeaturehighlighted", "featurehighlighted", "featureunhighlighted"],

      isDeleteControl: false,
      /**
      * Property: multipleKey
      * {String} An event modifier ('altKey' or 'shiftKey') that temporarily sets
      *     the <multiple> property to true.  Default is null.
      */
      multipleKey: null,

      /**
      * Property: toggleKey
      * {String} An event modifier ('altKey' or 'shiftKey') that temporarily sets
      *     the <toggle> property to true.  Default is null.
      */
      toggleKey: null,

      /**
      * APIProperty: multiple
      * {Boolean} Allow selection of multiple geometries.  Default is false.
      */
      multiple: false,

      /**
      * APIProperty: clickout
      * {Boolean} Unselect features when clicking outside any feature.
      *     Default is true.
      */
      clickout: true,

      /**
      * APIProperty: toggle
      * {Boolean} Unselect a selected feature on click.  Default is false.  Only
      *     has meaning if hover is false.
      */
      toggle: false,

      /**
      * APIProperty: hover
      * {Boolean} Select on mouse over and deselect on mouse out.  If true, this
      * ignores clicks and only listens to mouse moves.
      */
      hover: false,

      /**
      * APIProperty: highlightOnly
      * {Boolean} If true do not actually select features (i.e. place them in the
      * layer's selected features array), just highlight them. This property has
      * no effect if hover is false. Defaults to false.
      */
      highlightOnly: false,

      /**
      * APIProperty: box
      * {Boolean} Allow feature selection by drawing a box.
      */
      box: false,

      /**
      * Property: onBeforeSelect 
      * {Function} Optional function to be called before a feature is selected.
      *     The function should expect to be called with a feature.
      */
      onBeforeSelect: function () { },

      /**
      * APIProperty: onSelect 
      * {Function} Optional function to be called when a feature is selected.
      *     The function should expect to be called with a feature.
      */
      onSelect: function () { },

      /**
      * APIProperty: onUnselect
      * {Function} Optional function to be called when a feature is unselected.
      *     The function should expect to be called with a feature.
      */
      onUnselect: function () { },

      /**
      * Property: scope
      * {Object} The scope to use with the onBeforeSelect, onSelect, onUnselect
      *     callbacks. If null the scope will be this control.
      */
      scope: null,

      /**
      * APIProperty: geometryTypes
      * {Array(String)} To restrict selecting to a limited set of geometry types,
      *     send a list of strings corresponding to the geometry class names.
      */
      geometryTypes: null,

      /**
      * Property: layer
      * {<OpenLayers.Layer.Vector>} The vector layer with a common renderer
      * root for all layers this control is configured with (if an array of
      * layers was passed to the constructor), or the vector layer the control
      * was configured with (if a single layer was passed to the constructor).
      */
      layer: null,

      /**
      * Property: layers
      * {Array(<OpenLayers.Layer.Vector>)} The layers this control will work on,
      * or null if the control was configured with a single layer
      */
      layers: null,

      /**
      * APIProperty: callbacks
      * {Object} The functions that are sent to the handlers.feature for callback
      */
      callbacks: null,

      /**
      * APIProperty: selectStyle 
      * {Object} Hash of styles
      */
      selectStyle: null,

      /**
      * Property: renderIntent
      * {String} key used to retrieve the select style from the layer's
      * style map.
      */
      renderIntent: "select",

      /**
      * Property: handlers
      * {Object} Object with references to multiple <OpenLayers.Handler>
      *     instances.
      */
      handlers: null,

      /**
      * Constructor: OpenLayers.Control.SelectFeature
      * Create a new control for selecting features.
      *
      * Parameters:
      * layers - {<OpenLayers.Layer.Vector>}, or an array of vector layers. The
      *     layer(s) this control will select features from.
      * options - {Object} 
      */
      initialize: function (layers, options) {
          // concatenate events specific to this control with those from the base
          this.EVENT_TYPES =
            OpenLayers.Control.SelectFeature.prototype.EVENT_TYPES.concat(
            OpenLayers.Control.prototype.EVENT_TYPES
        );
          OpenLayers.Control.prototype.initialize.apply(this, [options]);

          if (this.scope === null) {
              this.scope = this;
          }
          this.initLayer(layers);
          var callbacks = {
              click: this.clickFeature,
              clickout: this.clickoutFeature
          };
          if (this.hover) {
              callbacks.over = this.overFeature;
              callbacks.out = this.outFeature;
          }

          this.callbacks = OpenLayers.Util.extend(callbacks, this.callbacks);
          this.handlers = {
              feature: new OpenLayers.Handler.Feature(
                this, this.layer, this.callbacks,
                { geometryTypes: this.geometryTypes }
            )
          };

          if (this.box) {
              this.handlers.box = new OpenLayers.Handler.Box(
                this, { done: this.selectBox },
                { boxDivClassName: "olHandlerBoxSelectFeature" }
            );
          }
      },

      /**
      * Method: initLayer
      * Assign the layer property. If layers is an array, we need to use
      *     a RootContainer.
      *
      * Parameters:
      * layers - {<OpenLayers.Layer.Vector>}, or an array of vector layers.
      */
      initLayer: function (layers) {
          if (layers instanceof Array) {
              this.layers = layers;
              this.layer = new OpenLayers.Layer.Vector.RootContainer(
                this.id + "_container", {
                    layers: layers
                }
            );
          } else {
              this.layer = layers;
          }
      },

      /**
      * Method: destroy
      */
      destroy: function () {
          if (this.active && this.layers) {
              this.map.removeLayer(this.layer);
          }
          OpenLayers.Control.prototype.destroy.apply(this, arguments);
          if (this.layers) {
              this.layer.destroy();
          }
      },

      /**
      * Method: activate
      * Activates the control.
      * 
      * Returns:
      * {Boolean} The control was effectively activated.
      */
      activate: function () {
          if (!this.active) {
              if (this.layers) {
                  this.map.addLayer(this.layer);
              }
              this.handlers.feature.activate();
              if (this.box && this.handlers.box) {
                  this.handlers.box.activate();
              }
          }
          return OpenLayers.Control.prototype.activate.apply(
            this, arguments
        );
      },

      /**
      * Method: deactivate
      * Deactivates the control.
      * 
      * Returns:
      * {Boolean} The control was effectively deactivated.
      */
      deactivate: function () {
          if (this.active) {
              this.handlers.feature.deactivate();
              if (this.handlers.box) {
                  this.handlers.box.deactivate();
              }
              if (this.layers) {
                  this.map.removeLayer(this.layer);
              }
          }
          return OpenLayers.Control.prototype.deactivate.apply(
            this, arguments
        );
      },

      /**
      * Method: unselectAll
      * Unselect all selected features.  To unselect all except for a single
      *     feature, set the options.except property to the feature.
      *
      * Parameters:
      * options - {Object} Optional configuration object.
      */
      unselectAll: function (options) {
          // we'll want an option to supress notification here
          var layers = this.layers || [this.layer];
          var layer, feature;
          for (var l = 0; l < layers.length; ++l) {
              layer = layers[l];
              for (var i = layer.selectedFeatures.length - 1; i >= 0; --i) {
                  feature = layer.selectedFeatures[i];
                  if (!options || options.except != feature) {
                      this.unselect(feature);
                  }
              }
          }
      },

      /**
      * Method: clickFeature
      * Called on click in a feature
      * Only responds if this.hover is false.
      *
      * Parameters:
      * feature - {<OpenLayers.Feature.Vector>} 
      */
      clickFeature: function (feature) {
          if (!this.hover) {
              var selected = (OpenLayers.Util.indexOf(
                feature.layer.selectedFeatures, feature) > -1);
              if (selected) {
                  if (this.toggleSelect()) {
                      this.unselect(feature);
                  } else if (!this.multipleSelect()) {
                      this.unselectAll({ except: feature });
                  }
              } else {
                  if (!this.multipleSelect()) {
                      this.unselectAll({ except: feature });
                  }
                  this.select(feature);
              }
          }
      },

      /**
      * Method: multipleSelect
      * Allow for multiple selected features based on <multiple> property and
      *     <multipleKey> event modifier.
      *
      * Returns:
      * {Boolean} Allow for multiple selected features.
      */
      multipleSelect: function () {
          return this.multiple || (this.handlers.feature.evt &&
                                 this.handlers.feature.evt[this.multipleKey]);
      },

      /**
      * Method: toggleSelect
      * Event should toggle the selected state of a feature based on <toggle>
      *     property and <toggleKey> event modifier.
      *
      * Returns:
      * {Boolean} Toggle the selected state of a feature.
      */
      toggleSelect: function () {
          return this.toggle || (this.handlers.feature.evt &&
                               this.handlers.feature.evt[this.toggleKey]);
      },

      /**
      * Method: clickoutFeature
      * Called on click outside a previously clicked (selected) feature.
      * Only responds if this.hover is false.
      *
      * Parameters:
      * feature - {<OpenLayers.Vector.Feature>} 
      */
      clickoutFeature: function (feature) {
          if (!this.hover && this.clickout) {
              this.unselectAll();
          }
      },

      /**
      * Method: overFeature
      * Called on over a feature.
      * Only responds if this.hover is true.
      *
      * Parameters:
      * feature - {<OpenLayers.Feature.Vector>} 
      */
      overFeature: function (feature) {
          var layer = feature.layer;
          if (this.hover) {
              if (this.highlightOnly) {
                  this.highlight(feature);
              } else if (OpenLayers.Util.indexOf(
                layer.selectedFeatures, feature) == -1) {
                  this.select(feature);
              }
          }
      },

      /**
      * Method: outFeature
      * Called on out of a selected feature.
      * Only responds if this.hover is true.
      *
      * Parameters:
      * feature - {<OpenLayers.Feature.Vector>} 
      */
      outFeature: function (feature) {
          if (this.hover) {
              if (this.highlightOnly) {
                  // we do nothing if we're not the last highlighter of the
                  // feature
                  if (feature._lastHighlighter == this.id) {
                      // if another select control had highlighted the feature before
                      // we did it ourself then we use that control to highlight the
                      // feature as it was before we highlighted it, else we just
                      // unhighlight it
                      if (feature._prevHighlighter &&
                       feature._prevHighlighter != this.id) {
                          delete feature._lastHighlighter;
                          var control = this.map.getControl(
                            feature._prevHighlighter);
                          if (control) {
                              control.highlight(feature);
                          }
                      } else {
                          this.unhighlight(feature);
                      }
                  }
              } else {
                  this.unselect(feature);
              }
          }
      },

      /**
      * Method: highlight
      * Redraw feature with the select style.
      *
      * Parameters:
      * feature - {<OpenLayers.Feature.Vector>} 
      */
      highlight: function (feature) {
          var layer = feature.layer;
          var cont = this.events.triggerEvent("beforefeaturehighlighted", {
              feature: feature
          });
          if (cont !== false) {
              feature._prevHighlighter = feature._lastHighlighter;
              feature._lastHighlighter = this.id;
              var style = this.selectStyle || this.renderIntent;
              layer.drawFeature(feature, style);
              this.events.triggerEvent("featurehighlighted", { feature: feature });
          }
      },

      /**
      * Method: unhighlight
      * Redraw feature with the "default" style
      *
      * Parameters:
      * feature - {<OpenLayers.Feature.Vector>} 
      */
      unhighlight: function (feature) {
          var layer = feature.layer;
          // three cases:
          // 1. there's no other highlighter, in that case _prev is undefined,
          //    and we just need to undef _last
          // 2. another control highlighted the feature after we did it, in
          //    that case _last references this other control, and we just
          //    need to undef _prev
          // 3. another control highlighted the feature before we did it, in
          //    that case _prev references this other control, and we need to
          //    set _last to _prev and undef _prev
          if (feature._prevHighlighter == undefined) {
              delete feature._lastHighlighter;
          } else if (feature._prevHighlighter == this.id) {
              delete feature._prevHighlighter;
          } else {
              feature._lastHighlighter = feature._prevHighlighter;
              delete feature._prevHighlighter;
          }
          layer.drawFeature(feature, feature.style || feature.layer.style ||
            "default");
          this.events.triggerEvent("featureunhighlighted", { feature: feature });
      },

      /**
      * Method: select
      * Add feature to the layer's selectedFeature array, render the feature as
      * selected, and call the onSelect function.
      * 
      * Parameters:
      * feature - {<OpenLayers.Feature.Vector>} 
      */
      select: function (feature) {
          var cont = this.onBeforeSelect.call(this.scope, feature);
          var layer = feature.layer;
          if (cont !== false) {
              cont = layer.events.triggerEvent("beforefeatureselected", {
                  feature: feature
              });
              if (cont !== false) {
                  layer.selectedFeatures.push(feature);
                  this.highlight(feature);
                  // if the feature handler isn't involved in the feature
                  // selection (because the box handler is used or the
                  // feature is selected programatically) we fake the
                  // feature handler to allow unselecting on click
                  if (!this.handlers.feature.lastFeature) {
                      this.handlers.feature.lastFeature = layer.selectedFeatures[0];
                  }
                  layer.events.triggerEvent("featureselected", { feature: feature });
                  this.onSelect.call(this.scope, feature);
              }
          }
      },

      /**
      * Method: unselect
      * Remove feature from the layer's selectedFeature array, render the feature as
      * normal, and call the onUnselect function.
      *
      * Parameters:
      * feature - {<OpenLayers.Feature.Vector>}
      */
      unselect: function (feature) {
          var layer = feature.layer;
          // Store feature style for restoration later
          this.unhighlight(feature);
          OpenLayers.Util.removeItem(layer.selectedFeatures, feature);
          layer.events.triggerEvent("featureunselected", { feature: feature });
          this.onUnselect.call(this.scope, feature);
      },

      /**
      * Method: selectBox
      * Callback from the handlers.box set up when <box> selection is true
      *     on.
      *
      * Parameters:
      * position - {<OpenLayers.Bounds> || <OpenLayers.Pixel> }  
      */
      selectBox: function (position) {
          if (position instanceof OpenLayers.Bounds) {
              var minXY = this.map.getLonLatFromPixel(
                new OpenLayers.Pixel(position.left, position.bottom)
            );
              var maxXY = this.map.getLonLatFromPixel(
                new OpenLayers.Pixel(position.right, position.top)
            );
              var bounds = new OpenLayers.Bounds(
                minXY.lon, minXY.lat, maxXY.lon, maxXY.lat
            );

              // if multiple is false, first deselect currently selected features
              if (!this.multipleSelect()) {
                  this.unselectAll();
              }

              // because we're using a box, we consider we want multiple selection
              var prevMultiple = this.multiple;
              this.multiple = true;
              var layers = this.layers || [this.layer];
              var layer;
              for (var l = 0; l < layers.length; ++l) {
                  layer = layers[l];
                  for (var i = 0, len = layer.features.length; i < len; ++i) {
                      var feature = layer.features[i];
                      // check if the feature is displayed
                      if (!feature.getVisibility()) {
                          continue;
                      }

                      if (this.geometryTypes == null || OpenLayers.Util.indexOf(
                            this.geometryTypes, feature.geometry.CLASS_NAME) > -1) {
                          if (bounds.toGeometry().intersects(feature.geometry)) {
                              if (OpenLayers.Util.indexOf(layer.selectedFeatures, feature) == -1) {
                                  this.select(feature);
                              }
                          }
                      }
                  }
              }
              endSelect = true;
              this.multiple = prevMultiple;
              if (this.isDeleteControl) {
                  for (var l = 0; l < layers.length; l++) {
                      layers[l].removeFeatures(layers[l].selectedFeatures);
                  }
              }
          }
      },

      /** 
      * Method: setMap
      * Set the map property for the control. 
      * 
      * Parameters:
      * map - {<OpenLayers.Map>} 
      */
      setMap: function (map) {
          this.handlers.feature.setMap(map);
          if (this.box) {
              this.handlers.box.setMap(map);
          }
          OpenLayers.Control.prototype.setMap.apply(this, arguments);
      },

      /**
      * APIMethod: setLayer
      * Attach a new layer to the control, overriding any existing layers.
      *
      * Parameters:
      * layers - Array of {<OpenLayers.Layer.Vector>} or a single
      *     {<OpenLayers.Layer.Vector>}
      */
      setLayer: function (layers) {
          var isActive = this.active;
          this.unselectAll();
          this.deactivate();
          if (this.layers) {
              this.layer.destroy();
              this.layers = null;
          }
          this.initLayer(layers);
          this.handlers.feature.layer = this.layer;
          if (isActive) {
              this.activate();
          }
      },

      CLASS_NAME: "Milstd.SelectFeatureNew"
  });






