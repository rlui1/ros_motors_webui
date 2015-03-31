RosUI.interaction = {
    init: function () {
        RosUI.ros.topics.chat_responses.subscribe(function (msg) {
            RosUI.interaction.addMessage('Robot', msg.data);
        });
        RosUI.interaction.speech_active = false;
        RosUI.ros.topics.speech_active.subscribe(function (msg) {
            if(msg.data == 'start'){
                console.log('paused');
                annyang.pause();
            }else{
                annyang.resume();
            }
            console.log('speech active');
        });

        $('#app-record-button').click(function () {
            RosUI.interaction.recognizeSpeech();
        });

        $('#app-message-input').keyup(function (e) {
            if (e.keyCode == 13)
                $('#app-send-button').click();
        });

        $('#app-send-button').click(function () {
            if ($('#app-message-input').val() != "") {
                RosUI.interaction.addMessage('Me', $('#app-message-input').val());
                RosUI.api.sendChatMessage($('#app-message-input').val());
                $('#app-message-input').val('');
            }
        });
    },
    loadPage: function () {
        var blenderMessage, blinkMessage, treeMessage;

        RosUI.api.blenderMode.enable();

        treeMessage = new ROSLIB.Message({data: 'btree_on'});
        RosUI.ros.topics.cmdTree.publish(treeMessage);
        RosUI.api.setExpression("Neutral", 0);
        //
        annyang.start();
        annyang.debug();
        commands = {
            'hi (han)': RosUI.interaction.hello,
            'hello (han)' : RosUI.interaction.hello,
            'hello (hun)' : RosUI.interaction.hello,
            'hello (hon)' : RosUI.interaction.hello,
            'hi (hun)' : RosUI.interaction.hello,
            'hi (hon)' : RosUI.interaction.hello,
            'bye *bye' : RosUI.interaction.bye,
            '*text' : RosUI.interaction.voiceRecognized
        };
        annyang.addCommands(commands);
        RosUI.interaction.started = false;

        //RosUI.gestures.demo.enable()
    },
    hello: function(){
        console.log('Conversation started');
        RosUI.interaction.started = true;
        var chat_message = new ROSLIB.Message({
            utterance: 'hello',
            confidence: 99
        });
        RosUI.ros.topics.speech_topic.publish(chat_message);
    },
    bye: function(){
        if (RosUI.interaction.started){
            console.log('Conversation Finished');
            var chat_message = new ROSLIB.Message({
                utterance: 'bye',
                confidence: 99
            });
            RosUI.ros.topics.speech_topic.publish(chat_message);
        }
        RosUI.interaction.started = false;
    },
    voiceRecognized: function(text){
        console.log(text);
        if (RosUI.interaction.started){
            var chat_message = new ROSLIB.Message({
                utterance: text,
                confidence: 99
            });
            RosUI.ros.topics.speech_topic.publish(chat_message);
            RosUI.interaction.addMessage('Me', text);
        }
    },
    recognizeSpeech: function () {
        alert('Say Hi to start');
    },
    addMessage: function (name, message) {
        var element;

        if (name == 'Robot') {
            element = $('#leftMsg').clone().removeAttr('id');
        } else {
            element = $('#rightMsg').clone().removeAttr('id');
        }

        if (typeof this.scrolling == 'undefined')
            this.scrolling = false;

        $(element).find('.msg').text(message);
        $(element).find('.name').text(name);
        $(element).find('.time').text(RosUI.interaction.currentTime());
        $(element).hide();
        $('#app-chat').append(element);
        $(element).fadeIn(400, function () {
            if (!RosUI.interaction.scrolling)
                $('html, body').animate({scrollTop: $(document).height()}, 'slow', 'swing', function () {
                    RosUI.interaction.scrolling = false;
                });

            RosUI.interaction.scrolling = true;
        });
    },
    currentTime: function () {
        var date = new Date();
        var hour = date.getHours();
        var min = date.getMinutes();

        if (min < 10)
            min = "0" + min;

        var amPm = hour < 12 ? "am" : "pm";

        if (hour > 12)
            hour = hour - 12;

        return hour + ":" + min + " " + amPm;
    }
};
