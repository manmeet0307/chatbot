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
            // Determine how the bot should process the message by checking for attachments.
            if (context.activity.attachments && context.activity.attachments.length > 0) {
                // The user sent an attachment and the bot should handle the incoming attachment.
                await this.handleIncomingAttachment(context);
            } else {
                // Since no attachment was received, send an attachment to the user.
                await this.handleOutgoingAttachment(context);
            }
            // Send a HeroCard with potential options for the user to select.
            //await this.displayOptions(context);

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }

    /**
     * Saves incoming attachments to disk by calling `this.downloadAttachmentAndWrite()` and
     * responds to the user with information about the saved attachment or an error.
     * @param {Object} turnContext
     */
    
    /**
     * Downloads attachment to the disk.
     * @param {Object} attachment
     */
    
    /**
     * Responds to user with either an attachment or a default message indicating
     * an unexpected input was received.
     * @param {Object} turnContext
     */
    async handleOutgoingAttachment(turnContext) {
        const reply = { type: ActivityTypes.Message };

        // Look at the user input, and figure out what type of attachment to send.
        // If the input matches one of the available choices, populate reply with
        // the available attachments.
        // If the choice does not match with a valid choice, inform the user of
        // possible options.
        const firstChar = turnContext.activity.text;
        
       
//         if (firstChar === '1') {
            //reply.text =firstchar;
            reply.attachments = [this.getInlineAttachment(firstChar[0])];
       
//         } else if (firstChar === '2') {
//             reply.attachments = [this.getInternetAttachment()];
//             reply.text = 'This is an internet attachment.';
//         } else if (firstChar === '3') {
//             reply.attachments = [await this.getUploadedAttachment(turnContext)];
//             reply.text = 'This is an uploaded attachment.';
//         } else {
//             // The user did not enter input that this bot was built to handle.
//             reply.text = 'Your input was not recognized, please try again.';
//         }
        await turnContext.sendActivity(reply);
    }

    /**
     * Sends a HeroCard with choices of attachments.
     * @param {Object} turnContext
     */
    async displayOptions(turnContext) {
        const reply = { type: ActivityTypes.Message };
        
        // Note that some channels require different values to be used in order to get buttons to display text.
        // In this code the emulator is accounted for with the 'title' parameter, but in other channels you may
        // need to provide a value for other parameters like 'text' or 'displayText'.
        const buttons = [
            { type: ActionTypes.ImBack, title: '1. Inline Attachment', value: '1' },
//             { type: ActionTypes.ImBack, title: '2. Internet Attachment', value: '2' },
//             { type: ActionTypes.ImBack, title: '3. Uploaded Attachment', value: '3' }
        ];

        const card = CardFactory.heroCard('', undefined,
            buttons, { text: 'You can upload an image or select one of the following choices.' });

        reply.attachments = [card];

        await turnContext.sendActivity(reply);
    }

    /**
     * Returns an inline attachment.
     */
    getInlineAttachment(str) 
        {
            const reply = { type: ActivityTypes.Message };
          const var imageData;
       
//              const imageData = fs.readFileSync(path.join(__dirname, '/resources/a.png'));
//         const base64Image = Buffer.from(imageData).toString('base64');
         
         imageData = fs.readFileSync(path.join(__dirname, '/resources/finalex.png'));
            
        const base64Image = Buffer.from(imageData).toString('base64');
           
        
    
        return {
            name: 'a.png',
            contentType: 'image/png',
            contentUrl: `data:image/png;base64,${ base64Image }`
        };
        
    
    }

    /**
     * Returns an attachment to be sent to the user from a HTTPS URL.
     */
    getInternetAttachment() {
        // NOTE: The contentUrl must be HTTPS.
        return {
            name: 'architecture-resize.png',
            contentType: 'image/png',
            contentUrl: 'https://docs.microsoft.com/en-us/bot-framework/media/how-it-works/architecture-resize.png'
        };
    }

    /**
     * Returns an attachment that has been uploaded to the channel's blob storage.
     * @param {Object} turnContext
     */
    async getUploadedAttachment(turnContext) {
        const imageData = fs.readFileSync(path.join(__dirname, '../resources/architecture-resize.png'));
        const connector = turnContext.adapter.createConnectorClient(turnContext.activity.serviceUrl);
        const conversationId = turnContext.activity.conversation.id;
        const response = await connector.conversations.uploadAttachment(conversationId, {
            name: 'architecture-resize.png',
            originalBase64: imageData,
            type: 'image/png'
        });

        // Retrieve baseUri from ConnectorClient for... something.
        const baseUri = connector.baseUri;
        const attachmentUri = baseUri + (baseUri.endsWith('/') ? '' : '/') + `v3/attachments/${ encodeURI(response.id) }/views/original`;
        return {
            name: 'architecture-resize.png',
            contentType: 'image/png',
            contentUrl: attachmentUri
        };
    }
}

module.exports.AttachmentsBot = AttachmentsBot;
