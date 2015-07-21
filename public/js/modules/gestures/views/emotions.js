define(["application", "./touch_button", 'tpl!./templates/emotions.tpl', 'lib/api'],
    function (App, TouchButtonView, template, api) {
        App.module("Gestures.Views", function (Views, App, Backbone, Marionette, $, _) {
            Views.Emotions = Marionette.CompositeView.extend({
                childView: TouchButtonView,
                childViewContainer: '.app-emotions-container',
                template: template,
                ui: {
                    speedSlider: '.app-speed-slider',
                    speedValue: '.app-speed-value',
                    magnitudeSlider: '.app-magnitude-slider',
                    magnitudeValue: '.app-magnitude-value'
                },
                config: {
                    speed: {
                        default: 3,
                        current: 3,
                        min: 0,
                        max: 10,
                        unit: 's',
                        multiplier: 1
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
                /**
                 * Pass data to child views
                 *
                 * @returns {{config: *}}
                 */
                childViewOptions: function () {
                    return {
                        config: this.config,
                        callback: function (name, speed, magnitude) {
                            api.setEmotion(name, speed, magnitude);
                        }
                    };
                },
                /**
                 * Pass data to the template
                 */
                serializeData: function () {
                    return this.config;
                },
                onRender: function () {
                    var self = this;

                    // init speed slider
                    this.ui.speedSlider.slider({
                        range: "min",
                        min: 0,
                        max: 1000,
                        value: this.config.speed.default * 100,
                        change: function (e, ui) {
                            var speed = ui.value / 100.0;

                            // update ui label
                            self.ui.speedValue.html(speed);

                            // update config
                            self.config.speed.current = speed;
                        }
                    });

                    // init magnitude slider
                    this.ui.magnitudeSlider.slider({
                        range: "min",
                        min: 0,
                        max: 100,
                        value: this.config.magnitude.default * 100,
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

        return App.module('Gestures.Views').Emotions;
    });
