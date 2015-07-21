define(["application", "./touch_button", 'tpl!./templates/gestures.tpl', 'lib/api'],
    function (App, TouchButtonView, template, api) {
        App.module("Gestures.Views", function (Views, App, Backbone, Marionette, $, _) {
            Views.Gestures = Marionette.CompositeView.extend({
                childView: TouchButtonView,
                template: template,
                childItemContainer: '.app-gestures',
                ui: {
                    speedSlider: '.app-speed-slider',
                    speedValue: '.app-speed-value',
                    magnitudeSlider: '.app-magnitude-slider',
                    magnitudeValue: '.app-magnitude-value'
                },
                config: {
                    speed: {
                        default: 1,
                        current: 1,
                        min: 0,
                        max: 2,
                        unit: '%',
                        multiplier: 100
                    },
                    magnitude: {
                        default: 1,
                        current: 1,
                        min: 0,
                        max: 1,
                        unit: '%',
                        multiplier: 100
                    }
                },
                childViewOptions: function () {
                    return {
                        config: this.config,
                        callback: function (name, speed, magnitude) {
                            api.setGesture(name, 1, speed, magnitude);
                        }
                    };
                },
                serializeData: function () {
                    return this.config;
                },
                onRender: function () {
                    var self = this;

                    // init speed slider
                    this.ui.speedSlider.slider({
                        range: "min",
                        min: this.config.speed.min * 100,
                        max: this.config.speed.max * 100,
                        value: this.config.speed.current * 100,
                        change: function (e, ui) {
                            var speed = ui.value / 100.0;

                            // update ui label
                            self.ui.speedValue.html(speed * 100);

                            // update config
                            self.config.speed.current = speed;
                        }
                    });

                    // init magnitude slider
                    this.ui.magnitudeSlider.slider({
                        range: "min",
                        min: 0,
                        max: 100,
                        value: this.config.magnitude.current * 100,
                        change: function (e, ui) {
                            // update ui label
                            self.ui.magnitudeValue.html(ui.value);

                            // update config
                            self.config.magnitude.current = ui.value / 100.0;
                        }
                    });
                }
            });
        });

        return App.module('Gestures.Views').Gestures;
    });
