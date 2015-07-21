define(['application', 'tpl!./templates/layout.tpl', 'lib/regions/fade_in'], function (App, template, FadeInRegion) {
    App.module("Motors.Views", function (Common, App, Backbone, Marionette, $, _) {
        Common.Layout = Marionette.LayoutView.extend({
            template: template,

            regions: {
                motors: {
                    el: ".app-motors",
                    regionClass: FadeInRegion
                }
            }
        });
    });

    return App.module('Motors.Views.Layout');
});