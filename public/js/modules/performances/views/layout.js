define(['jquery', 'marionette', 'tpl!./templates/layout.tpl', 'lib/regions/fade_in'],
    function ($, Marionette, template, FadeInRegion) {
        return Marionette.LayoutView.extend({
            template: template,
            regions: {
                content: {
                    el: '.app-content',
                    regionClass: FadeInRegion
                }
            }
        });
    });
