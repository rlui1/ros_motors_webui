define(['application', './controller'], function (App, controller) {
    App.module('Monitor', function (Monitor, app, Backbone, Marionette, $, _) {
        Monitor.Router = Marionette.AppRouter.extend({
            'appRoutes': {
                'monitor': 'motors',
                'monitor/motors': 'motors',
                'monitor/messages': 'messages',
                'monitor/logs': 'logs',
                'monitor/processes': 'processes',
                'monitor/speed': 'speed',
                'monitor/system': 'system'
            }
        });

        Monitor.on('start', function () {
            new Monitor.Router({controller: controller});
        });
    });
});
