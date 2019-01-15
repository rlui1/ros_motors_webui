// Copyright (c) 2015 Hanson Robotics, Ltd. 
define(["application", "lib/api", './views/motors', './views/layout', './views/configuration', 'entities/motor'],
    function (App, api, MotorsView, LayoutView, ConfigurationView) {
        return {
            public_index: function () {
                // reset robot
                api.topics.cmdTree.publish(new ROSLIB.Message({data: 'btree_off'}));
                api.pointHead();

                // init collection and views
                var motorsCollection = new App.Entities.MotorCollection(),
                    motorsView = new MotorsView({collection: motorsCollection}),
                    layoutView = new LayoutView();

                motorsCollection.fetch();

                App.LayoutInstance.showNav();
                App.LayoutInstance.setTitle('Motors');
                App.LayoutInstance.getRegion('content').show(layoutView);

                layoutView.getRegion('motors').show(motorsView);
            },
            admin_index: function () {
                App.LayoutInstance.showAdminNav();
                App.LayoutInstance.setTitle('Motors');

                var configurationView = new ConfigurationView();
                App.LayoutInstance.getRegion('content').show(configurationView);
            }
        };
    });
