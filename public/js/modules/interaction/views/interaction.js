define(["application", './message', "tpl!./templates/interaction.tpl", 'lib/api', 'annyang'],
    function (App, MessageView, template, api, annyang) {
        var self;
        App.module("Interaction.Views", function (Views, App, Backbone, Marionette, $, _) {
            Views.Interaction = Marionette.CompositeView.extend({
                template: template,
                childView: MessageView,
                childViewContainer: '.app-messages',
                ui: {
                    messageInput: '.app-message-input',
                    sendButton: '.app-send-button',
                    unsupported: '.app-unsupported',
                    supported: '.app-supported',
                    recordContainer: '.record-container',
                    instructions: '.app-chatbox-instructions'
                },
                events: {
                    'keyup @ui.messageInput': 'messageKeyUp',
                    'click @ui.sendButton': 'sendClicked'
                },
                initialize: function () {
                    self = this;
                },
                onRender: function () {
                    api.topics.chat_responses.subscribe(function (msg) {
                        self.collection.add({author: 'Robot', message: msg.data});
                    });

                    api.topics.speech_active.subscribe(function (msg) {
                        if (msg.data == 'start') {
                            console.log('Interaction paused');
                            if (annyang) annyang.pause();
                        } else {
                            console.log('Interaction activated');
                            if (annyang) annyang.resume();
                        }
                    });

                    if (annyang) {
                        annyang.start();
                        annyang.debug();

                        var commands = {
                            'hi (han)': this.hello,
                            'hello (han)': this.hello,
                            'hello (hun)': this.hello,
                            'hello (hon)': this.hello,
                            'hi (hun)': this.hello,
                            'hi (hon)': this.hello,
                            'bye *bye': this.bye,
                            '*text': this.sendMessage
                        };
                        annyang.addCommands(commands);
                        this.keepAlive();
                    } else {
                        this.ui.recordContainer.hide();
                    }
                },
                onDestroy: function(){
                    if (annyang)
                        annyang.abort();

                    clearTimeout(self.keepAlive);
                },
                messageKeyUp: function (e) {
                    if (e.keyCode == 13)
                        this.ui.sendButton.click();
                },
                sendClicked: function () {
                    var message = this.ui.messageInput.val();

                    if (message != '') {
                        this.collection.add({author: 'Me', message: message});
                        api.sendChatMessage(message);
                    }

                    this.ui.messageInput.val('');
                },
                keepAlive: function () {
                    this.keepAlive = setInterval(function () {
                        if (annyang)
                            annyang.start();
                    }, 10000);
                },
                attachHtml: function (collectionView, childView) {
                    childView.$el.hide();
                    collectionView._insertAfter(childView);

                    $(childView.$el).fadeIn(400, function () {
                        if (!self.scrolling)
                            $('html, body').animate({scrollTop: $(document).height()}, 'slow', 'swing', function () {
                                self.scrolling = false;
                            });

                        self.scrolling = true;
                    });

                    // hide chatbox instructions
                    this.ui.instructions.hide();
                },
                sendMessage: function (message) {
                    self.collection.add({author: 'Me', message: message});

                    var chat_message = new ROSLIB.Message({
                        utterance: message,
                        confidence: 99
                    });

                    api.topics.speech_topic.publish(chat_message);
                },
                hello: function () {
                    self.sendMessage('hello');
                },
                bye: function () {
                    self.sendMessage('bye');
                }
            });
        });

        return App.module('Interaction.Views').Interaction;
    })
;
