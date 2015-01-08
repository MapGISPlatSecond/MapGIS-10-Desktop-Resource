/**
 * Created by dukang on 14-11-27.
 */
var move,zoomOut,zoomIn;

var selfNavToolbar = OpenLayers.Control.SelfNavToolbar = OpenLayers.Class(OpenLayers.Control.Panel, {
    initialize: function(options) {
        OpenLayers.Control.Panel.prototype.initialize.apply(this, [options]);
        this.addControls([
            move = new OpenLayers.Control.Navigation({title:"移动"}),
            zoomOut = new OpenLayers.Control.ZoomBox({title:"放大"}),
            zoomIn = new OpenLayers.Control.SelfZoomIn(),
            new OpenLayers.Control.ZoomToMaxExtent({title:"复位"}),
            new OpenLayers.Control.Refresh({title:"刷新"}),
            new OpenLayers.Control.Clear({title:"清除"})

        ]);
    },
    draw: function() {
        var div = OpenLayers.Control.Panel.prototype.draw.apply(this, arguments);
        if (this.defaultControl === null) {
            this.defaultControl = this.controls[0];
        }
        return div;
    },
    CLASS_NAME: "OpenLayers.Control.SelfNavToolbar"
});


OpenLayers.Control.Refresh = OpenLayers.Class(OpenLayers.Control.Button, {

    trigger: function(){
        ResSearch.Spatial.refresh();
    },

    CLASS_NAME: "OpenLayers.Control.Refresh"
});

OpenLayers.Control.Clear = OpenLayers.Class(OpenLayers.Control.Button, {

    trigger: function(){
        spatial.clearMarks();
        spatial.clearPopups();
        spatial.clearVectors();
    },

    CLASS_NAME: "OpenLayers.Control.Clear"
});

OpenLayers.Control.SelfZoomIn = OpenLayers.Class(OpenLayers.Control.ZoomBox, {

    map: this._map,out:true,title:"缩小",

    CLASS_NAME: "OpenLayers.Control.SelfZoomIn"
});


function deActivateTool(){
    move.deactivate();
    zoomOut.deactivate();
    zoomIn.deactivate();
}






function deActivateTool(){
    move.deactivate(),zoomOut.deactivate(),zoomIn.deactivate();
}







