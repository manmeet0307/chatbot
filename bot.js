// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, ActionTypes, ActivityTypes, CardFactory } = require('botbuilder');
const path = require('path');
const axios = require('axios');
const fs = require('fs');

class AttachmentsBot extends ActivityHandler {
    constructor() {
        super();

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; cnt++) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    // If the Activity is a ConversationUpdate, send a greeting message to the user.
                   await context.sendActivity('Intro');
                  // await context.sendActivity('Alternatively, I can send you an attachment.');

                    // Send a HeroCard with potential options for the user to select.
                   // await this.displayOptions(context);

                    // By calling next() you ensure that the next BotHandler is run.
                    await next();
                }
            }
        });

        this.onMessage(async (context, next) => {
              // Since no attachment was received, send an attachment to the user.
                await this.handleOutgoingAttachment(context);
            
            await next();
        });
    }

    
    /**
     * Responds to user with either an attachment or a default message indicating
     * an unexpected input was received.
     * @param {Object} turnContext
     */
    async handleOutgoingAttachment(turnContext) {
        const reply = { type: ActivityTypes.Message };        
        const firstChar = turnContext.activity.text;       

            reply.attachments = [this.getInlineAttachment(firstChar[0])];

        await turnContext.sendActivity(reply);
    }

    
    getInlineAttachment(str) 
        {
            const reply = { type: ActivityTypes.Message };
       
             const imageData = fs.readFileSync(path.join(__dirname, '/resources/a.png'));
        const base64Image = Buffer.from(imageData).toString('base64');
         
            
           
        
    
        return {
            name: 'a.png',
            contentType: 'image/png',
            contentUrl: `data:image/png;base64,${ base64Image }`
        };
        
    
    }

    
    
}

module.exports.AttachmentsBot = AttachmentsBot;
