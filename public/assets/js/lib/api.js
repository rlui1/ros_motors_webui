define(['jquery', 'roslib', './utilities'], function ($, ROSLIB, utilities) {
    var api = {
        config: {},
        setExpression: function (name, intensity) {
            console.log('setting expression to: ' + name + ", intensity: " + intensity);

            api.topics.expression.publish(
                new ROSLIB.Message({
                    exprname: name,
                    intensity: intensity
                })
            );
        },
        pointHead: utilities.limitCallRate(30, function () {
            api._pointHead.apply(api, arguments);
        }),
        _pointHead: function (angles) {
            if (typeof angles == 'undefined')
                angles = {};

            angles = $.extend({yaw: 0, pitch: 0, roll: 0}, angles);

            console.log('pointing head:');
            console.log(angles);

            api.topics.pointHeadTopic.publish(
                new ROSLIB.Message(angles)
            );
        },
        expressionList: function (success) {
            api.services.expressionList.callService(new ROSLIB.ServiceRequest(), success);
        },
        playAnimation: function (animation) {
            api.topics.animations.publish(
                new ROSLIB.Message({
                    data: 'play:' + animation
                })
            );
        },
        sendChatMessage: function (text) {
            var message = new ROSLIB.Message({
                utterance: text,
                confidence: Math.round(0.9 * 100)
            });

            api.topics.speech_topic.publish(message);
        },
        sendMotorCommand: utilities.limitCallRate(30, function () {
            api._sendMotorCommand.apply(api, arguments);
        }),
        _sendMotorCommand: function (confEntry, angle, speed, acc) {
            console.log('Sending motor command:');
            console.log([confEntry, angle, speed, acc]);

            var topicParams = api.topics[confEntry.topic],
                cmd;

            if (!confEntry.topic || confEntry.topic == 'none' || typeof topicParams == 'undefined')
                return false;

            if (topicParams.messageType == 'std_msgs/Float64') {
                cmd = new ROSLIB.Message({data: Math.min(Math.max(angle, confEntry.min), confEntry.max)});
            } else {
                cmd = new ROSLIB.Message({
                    joint_name: confEntry.motor_id ? confEntry.motor_id.toString() : confEntry.name.toString(),
                    position: Math.min(Math.max(angle, confEntry.min), confEntry.max),
                    speed: (speed || confEntry.speed || 100) / 255,
                    acceleration: (acc || confEntry.acceleration || 50) / 255
                });
            }

            api.topics[confEntry.topic].publish(cmd);
        },
        setDefaultMotorValues: function () {
            for (var i = 0; i < api.config.motors.length; i++) {
                this._sendMotorCommand(api.config.motors[i], api.config.motors[i].default);
            }
        },
        getPololuMotorTopics: function (success) {
            api.services.topicsForType.callService({type: 'ros_pololu_servo/MotorCommand'}, function (response) {
                success(response.topics);
            }, function (error) {
                console.log(error);
            });
        },
        /**
         * Passes a list of available gestures to success function
         *
         * @param success
         */
        getAvailableGestures: function (success) {
            api.topics.available_gestures.subscribe(function (message) {
                success(message.data);
            });
        },

        /**
         * Set a gesture
         *
         * @param name
         * @param repeat
         * @param speed
         * @param magnitude
         */
        setGesture: function (name, repeat, speed, magnitude) {
            if (typeof repeat == 'undefined')
                repeat = 1;

            if (typeof speed == 'undefined')
                speed = 0.5;

            if (typeof magnitude == 'undefined')
                magnitude = 0.5;

            api.topics.set_gesture.publish(
                new ROSLIB.Message({
                    name: name,
                    repeat: repeat,
                    speed: speed,
                    magnitude: magnitude
                })
            );
        },

        /**
         * Passes a list of available emotions to success function
         *
         * @param success
         */
        getAvailableEmotionStates: function (success) {
            api.topics.available_emotion_states.subscribe(function (message) {
                success(message.data);
            });
        },

        /**
         * Set an emotion, call multiple times to blend emotions together
         *
         * @param name
         * @param magnitude 0..1
         * @param duration array [seconds, nanoseconds]
         */
        setEmotion: function (name, magnitude, duration) {
            if (typeof magnitude == 'undefined')
                magnitude = 0.5;

            if (typeof duration == 'undefined')
                duration = {secs: 1, nsecs: 0};

            api.topics.set_emotion_state.publish(
                new ROSLIB.Message({
                    name: name,
                    magnitude: magnitude,
                    duration: duration
                })
            );
        },
        blenderMode: {
            enable: function () {
                api.services.headPauMux.callService(new ROSLIB.ServiceRequest({topic: "/blender_api/get_pau"}), function () {
                    return 0;
                });
                api.services.neckPauMux.callService(new ROSLIB.ServiceRequest({topic: "/blender_api/get_pau"}), function () {
                    return 0;
                });
            },
            disable: function () {
                api.services.headPauMux.callService(new ROSLIB.ServiceRequest({topic: "/" + api.config.robot + "/no_pau"}), function () {
                    return 0;
                });
                api.services.neckPauMux.callService(new ROSLIB.ServiceRequest({topic: "/" + api.config.robot + "/cmd_neck_pau"}), function () {
                    return 0;
                });
            }
        },
        getMotorsConfig: function (callback) {
            var param = new ROSLIB.Param({ros: api.ros, name: '/' + api.config.robot + '/motors'});
            param.get(function (motors) {
                for (var i = 0; i < motors.length; i++) {
                    // Create topics for specific motors
                    if (!(motors[i]['topic'] in api.topics)) {
                        if ('motor_id' in motors[i]) {
                            // Pololu
                            api.topics[motors[i]['topic']] = new ROSLIB.Topic({
                                ros: api.ros,
                                name: '/' + api.config.robot + '/' + motors[i]['topic'] + '/command',
                                messageType: 'ros_pololu_servo/MotorCommand',
                                throttle_rate: 5
                            });
                        } else {
                            // Dynamixel
                            api.topics[motors[i]['topic']] = new ROSLIB.Topic({
                                ros: api.ros,
                                name: '/' + api.config.robot + '/' + motors[i]['topic'] + '_controller/command',
                                messageType: 'std_msgs/Float64'
                            });
                        }
                    }
                }

                callback(motors);
            });
        },
        getRobotName: function (callback) {
            var param = new ROSLIB.Param({ros: api.ros, name: '/robot_name'});
            param.get(callback);
        }
    };

    return api;
});