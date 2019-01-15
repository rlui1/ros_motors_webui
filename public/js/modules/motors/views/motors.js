// Copyright (c) 2015 Hanson Robotics, Ltd. 
define(["application", "./motor", 'tpl!./templates/motors.tpl', 'jquery-ui'], function (App, motorView, motorsTemplate) {
    App.module("Motors.Views", function (View, App, Backbone, Marionette, $, _) {
        View.Motors = Marionette.CompositeView.extend({
            template: motorsTemplate,
            childViewContainer: '.app-motors',
            childView: motorView,
            ui: {
                container: '.app-motors',
                saveButton: '.app-save-motors-button',
                editing: '.app-motor-editing'
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
            /**
             * Pass label of the motor group to motor views when a new group appears
             *
             * @param model
             * @param index
             * @returns {{motorGroupLabel: *}}
             */
            childViewOptions: function(model, index) {
                var motorGroup = model.get('group');
                if (motorGroup && (typeof this.lastMotorGroup == 'undefined' || this.lastMotorGroup != motorGroup))
                    this.lastMotorGroup = motorGroup;
                else
                    motorGroup = null;

                return {
                    motorGroupLabel: motorGroup
                }
            },
            onAddChild: function() {
                if (this.options.enable_edit)
                    this.enableEdit();
            },
            enableEdit: function () {
                var self = this;

                this.ui.editing.show();

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
            updateMotors: function (e) {
                this.collection.sync(function () {
                    App.Utilities.showPopover(e.target, 'Saved')
                }, function () {
                    App.Utilities.showPopover(e.target, 'Error saving motors')
                });
            },
            showSelectButtons: function (status) {
                this.children.each(function (motorView) {
                    motorView.showSelectButton(status);
                });
            }
        });
    });

    return App.module('Motors.Views.Motors');
});
