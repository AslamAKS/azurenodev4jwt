const { app } = require('@azure/functions');
const { createTable }=require('../Handler/DBHandler')

app.http('createDB', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        let DBCreationMessage = await createTable();
        return{
            headers: { 'content-type': 'application/json' },
            body:JSON.stringify(DBCreationMessage)
        }
    }
});
