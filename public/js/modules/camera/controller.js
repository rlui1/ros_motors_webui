define(['application', './views/layout'], function (App, LayoutView) {
    return {
        camera: function () {
            App.LayoutInstance.setTitle('Camera Control');
            var layoutView = new LayoutView();
            App.LayoutInstance.getRegion('content').show(layoutView);
        }
    };
});
