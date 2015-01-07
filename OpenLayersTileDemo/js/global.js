

/**
* 各种全局变量
*/

var dlgList = []; //当前存在的对话框数组
var roleID = 0;//登录用户角色
window.map = null;
window.zondy = {};
window.YndzWarning = {};
zondy.switchCurOper = function (control) {
    if (!zondy.activeControl) {
        zondy.activeControl = control;
        control.activate();
    } else {
        zondy.activeControl.deactivate();
        control.activate();
        zondy.activeControl = control;
    }
};
zondy.setOperZoomIn = function () {
    if (!zondy.zoomBox) {
        zondy.zoomBox = new OpenLayers.Control.ZoomBox({ map: map });
        zondy.zoomBox.draw();
    }
    zondy.switchCurOper(zondy.zoomBox);
    //zondy.messageBox.showMessage("正在放大地图正在放大地图", 1);
};
zondy.setOperZoomOut = function () {
    if (!zondy.zoomOutBox) {
        zondy.zoomOutBox = new OpenLayers.Control.ZoomBox({
            map: map,
            out: true
        });
        zondy.zoomOutBox.draw();
    }
    zondy.switchCurOper(zondy.zoomOutBox);
    //zondy.messageBox.showMessage("正在缩小地图正在缩小地图", 2);
};
zondy.setOperDrag = function () {
    if (!zondy.dragPan) {
        zondy.dragPan = new OpenLayers.Control.DragPan({ map: map });
        zondy.dragPan.draw();
    }
    zondy.switchCurOper(zondy.dragPan);
    //zondy.messageBox.showMessage("正在移动地图正在移动地图正在移动地图", 3);
};
/*************************************       对话框的公共函数       ***********************************/


