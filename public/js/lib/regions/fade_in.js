// Copyright (c) 2015 Hanson Robotics, Ltd. 
define(['marionette'], function (Marionette) {
    return Marionette.Region.extend({
        attachHtml: function (view) {
            this.$el.hide();
            this.$el.html(view.el);
            this.$el.fadeIn();
        }
    });
});
