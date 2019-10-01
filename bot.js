// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.


const { ActivityHandler, ActionTypes, ActivityTypes, CardFactory } = require('botbuilder');
const path = require('path');
const axios = require('axios');
const fs = require('fs');

class EchoBot extends ActivityHandler {
    constructor() {
        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
                    
                   await this.handleOutgoingAttachment(context);
                        await next();


            // By calling next() you ensure that the next BotHandler is run.
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity('Hello and welcome!');
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });


    }


    async handleOutgoingAttachment(turnContext) {
        
        const reply = { type: ActivityTypes.Message };
        reply.text = turnContext;
        reply.attachments = [this.getInlineAttachment(turnContext)];


        await turnContext.sendActivity(reply);
    }

    getInlineAttachment(turnContext) {
    const imageData = fs.readFileSync(path.join(__dirname, 'img/1.png'));
    const base64Image = Buffer.from(imageData).toString('base64');

    return {
        name: '1.png',
        contentType: 'image/png',
        contentUrl: `data:image/png;base64,${ base64Image }`
    };
}
}

module.exports.EchoBot = EchoBot;
