// Copyright (c) 2015 Hanson Robotics, Ltd. 
define(['application', 'marionette'], function (App, Marionette) {
    // set up behavior lookup
    Marionette.Behaviors.behaviorsLookup = function () {
        return App.module('Behaviors');
    };
});