define(["application", "tpl!./templates/layout.tpl"], function (App, template) {
    App.module("Camera.Views", function (Views, App, Backbone, Marionette, $, _) {
        Views.Layout = Marionette.LayoutView.extend({
            template: template,
            ui: {
            },
            regions: {
            },
            events: {
            }
        });
    });

    return App.module('Camera.Views').Layout;
});
