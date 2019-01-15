// Copyright (c) 2015 Hanson Robotics, Ltd. 
define(['application', './views/interaction', 'lib/api', 'entities/interaction'],
    function (App, InteractionView, api) {
        return {
            index: function () {
                // api.topics.cmdTree.publish(new ROSLIB.Message({data: 'btree_on'}));

                var messageCollection = new App.Entities.MessageCollection();
                this.interactionView = new InteractionView({collection: messageCollection});

                App.LayoutInstance.setTitle('Interaction');
                App.LayoutInstance.getRegion('content').show(this.interactionView);
                App.LayoutInstance.showNav();
            }
        };
    });
