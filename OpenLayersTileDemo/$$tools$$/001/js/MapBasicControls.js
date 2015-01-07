var IsAdd = false;
var Navigationctrl, panctrl, layerctrl, scalectrl, mousectrl, overctrl;
//添加基本操作控件
function AddBasicControl () {
    if (!IsAdd) {
        Navigationctrl = new OpenLayers.Control.Navigation();
       map.addControl(Navigationctrl);
       panctrl = new OpenLayers.Control.PanZoomBar()
       map.addControl(panctrl);
       layerctrl = new OpenLayers.Control.LayerSwitcher();
       map.addControl(layerctrl);
       scalectrl = new OpenLayers.Control.ScaleLine();
       map.addControl(scalectrl);
       mousectrl = new OpenLayers.Control.MousePosition();
       map.addControl(mousectrl);
       overctrl = new OpenLayers.Control.OverviewMap();
        map.addControl(overctrl);
        IsAdd = true;
    }
    else {
        map.removeControl(Navigationctrl);
        map.removeControl(panctrl);
        map.removeControl(layerctrl);
        map.removeControl(scalectrl);
        map.removeControl(mousectrl);
        map.removeControl(overctrl);
       
        IsAdd = false ;
        
    }
}