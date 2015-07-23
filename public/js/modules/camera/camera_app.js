define(['application', './controller'], function (App, controller) {
    console.log(controller);

    App.module('Camera', function (Camera, App, Backbone, Marionette, $, _) {
        Camera.Router = Marionette.AppRouter.extend({
            'appRoutes': {
                'camera': 'camera'
            }
        });
        Camera.on('start', function () {
            new Camera.Router({controller: controller});
        });
    });
});
