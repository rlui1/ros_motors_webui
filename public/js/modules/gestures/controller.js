define(['application', './views/layout', './views/gestures',
        './views/emotions', 'lib/api', 'entities/gesture', 'entities/emotion'],
    function (App, LayoutView, GesturesView, EmotionsView, api) {
        var gestures = {
            index: function () {
                this.layoutView = new LayoutView();

                App.LayoutInstance.setTitle('Gestures');
                App.LayoutInstance.getRegion('content').show(this.layoutView);
                App.LayoutInstance.showNav();

                gestures.createGestureButtons();
                gestures.createEmotionSliders();

                api.blenderMode.enable();
                api.setExpression("Neutral", 0);
                api.topics.cmdTree.publish(new ROSLIB.Message({data: 'btree_off'}));
            },
            createGestureButtons: function () {
                var gestureCollection = new App.Entities.GestureCollection(),
                    gesturesView = new GesturesView({
                        collection: gestureCollection
                    });

                this.layoutView.getRegion('gestures').show(gesturesView);
                gestureCollection.fetch();
            },
            createEmotionSliders: function () {
                var emotionCollection = new App.Entities.EmotionCollection(),
                    emotionsView = new EmotionsView({
                        collection: emotionCollection
                    });

                this.layoutView.getRegion('emotions').show(emotionsView);
                emotionCollection.fetch();
            }
        };

        return gestures;
    });
