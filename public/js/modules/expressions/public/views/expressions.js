define(["application", "tpl!./templates/expressions.tpl", 'lib/api'], function (App, template, api) {
    App.module("Expressions.Views", function (Views, App, Backbone, Marionette, $, _) {
        Views.Expressions = Marionette.LayoutView.extend({
            template: template,
            ui: {
                forwardButton: '.app-move-forward',
                backwardButton: '.app-move-backward',
                leftButton: '.app-move-left',
                rightButton: '.app-move-right'
            },
            events: {
                'mousedown @ui.forwardButton': 'moveForward',
                'mousedown @ui.backwardButton': 'moveBackward',
                'mousedown @ui.leftButton': 'moveLeft',
                'mousedown @ui.rightButton': 'moveRight'
            },
            moveForward: function (e, a) {
                this.setMovementInterval(0, this.ui.forwardButton);
            },
            moveBackward: function () {
                this.setMovementInterval(1, this.ui.backwardButton);
            },
            moveLeft: function () {
                this.setMovementInterval(2, this.ui.leftButton);
            },
            moveRight: function () {
                this.setMovementInterval(3, this.ui.rightButton);
            },
            setMovementInterval: function (direction, button) {
                var interval = setInterval(function () {
                    if ($(button).is(':active'))
                        api.sendBodyControlCommand(direction);
                    else
                        clearInterval(interval);
                }, 100);
            }
        });
    });

    return App.module('Expressions.Views').Expressions;
});
