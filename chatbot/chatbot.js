'use strict';
const dialogflow = require('dialogflow');
const uuid = require('uuid');
const config = require('../config/keys');
const structJson = require('structjson')

const projectID = config.googleProjectID;
// const sessionID = config.dialogFlowSessionID;
const languageCode = config.dialogFlowSessionLanguageCode;

const credentials = {
    client_email: config.googleClientEmail,
    private_key: config.googlePrivateKey
};

const sessionClient = new dialogflow.SessionsClient({projectID, credentials});
const sessionID = uuid.v4()

module.exports = {

    textQuery: async function(text,parameters = {}){
        let sessionPath = sessionClient.sessionPath(projectID,sessionID)
       
        
        let self = module.exports;
        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: text,
                    languageCode: languageCode,
                },
            },
            queryParams : {
                payload: {
                    data: parameters
                }
            }
        };
        
      let responses = await sessionClient
                .detectIntent(request)

        responses = await self.handleAction(responses);

        return responses; 

    },

    eventQuery: async function(event,parameters = {}){ try{
        let sessionPath = sessionClient.sessionPath(projectID,sessionID);

        let self = module.exports;
        const request = {
            session: sessionPath,
            queryInput: {
                event: {
                    name: event,
                    parameters: structJson.jsonToStructProto(parameters),
                    languageCode: config.dialogFlowSessionLanguageCode,
                },
            },
        };
    
        
      let responses = await sessionClient
                .detectIntent(request);
                

        responses = await self.handleAction(responses);
        
        return responses; 
    } catch(e){console.error('error:',e);
                console.log('error [chatbot]:',e);
    }
    
    
    },

    handleAction: function(responses){
        return responses;
    }

}