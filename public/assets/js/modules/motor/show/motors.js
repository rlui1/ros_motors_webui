define(["application", "./motor", 'tpl!./templates/motors.tpl', 'jquery-ui'], function (App, motorView, motorsTemplate) {
    App.module("Motors.View", function (View, App, Backbone, Marionette, $, _) {
        View.Motors = Marionette.CompositeView.extend({
            template: motorsTemplate,
            childViewContainer: '.app-motors',
            childView: motorView,
            ui: {
                container: '.app-motors',
                editButton: '.app-edit-motors-button',
                saveButton: '.app-save-motors-button'
            },
            events: {
                'click @ui.editButton': 'enableEdit',
                'click @ui.saveButton': 'updateMotors'
            },
            initialize: function () {
                var self = this;
                App.vent.on('motors:selection:set', function (status) {
                    self.showSelectButtons(status);
                })
            },
            enableEdit: function () {
                var self = this;

                this.ui.editButton.hide();
                this.ui.saveButton.show();

                this.children.each(function (motorView) {
                    motorView.enableEdit();
                });

                $(this.ui.container).sortable({
                    axis: "y",
                    handle: ".app-motor-drag-handle",
                    placeholder: "ui-state-highlight",
                    deactivate: function () {
                        $(self.ui.container).find('li').each(function (i, motor) {
                            $(motor).attr('data-order-no', i);
                            self.children.each(function (motorView) {
                                if (motor == motorView.el) {
                                    // updating order_no at relevant model
                                    motorView.model.set('order_no', i);
                                }
                            });
                        });
                    }
                });
            },
            updateMotors: function () {
                this.ui.saveButton.hide();
                this.ui.editButton.show();

                this.children.each(function (motorView) {
                    motorView.disableEdit();
                });

                this.collection.sync();
            },
            showSelectButtons: function (status) {
                this.children.each(function (motorView) {
                    motorView.showSelectButton(status);
                });
            }
        });
    });

    return App.Motors.View.Motors;
});