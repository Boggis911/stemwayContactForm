const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: process.env.SES });
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    let body = JSON.parse(event.body);

    const emailParams = {
        Source: process.env.SENDER_EMAIL,
        Destination: {
            ToAddresses: [process.env.STEMWAY_EMAIL],
        },
        Message: {
            Body: {
                Text: {
                    Charset: 'UTF-8',
                    Data: `
                        First Name: ${body.firstName || 'Not provided'}
                        Last Name: ${body.lastName || 'Not provided'}
                        Email: ${body.email || 'Not provided'}
                        Phone: ${body.phone || 'Not provided'}
                        Subject: ${body.subject || 'Not provided'}
                        Message: ${body.message || 'Not provided'}
                    `,
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'A NEW CUSTOMER ENQUIRY',
            },
        },
    };

    let emailSent = 'No';

    try {
        await ses.sendEmail(emailParams).promise();
        emailSent = 'Yes';
    } catch (error) {
        console.error('Error sending email:', error);
        emailSent = 'No';
    }

    const currentTimestamp = new Date().toISOString();
    
    const dbParams = {
        TableName: process.env.TABLE_NAME,
        Item: {
            email: body.email || 'Not provided', // this is the partition key
            submissionTime: currentTimestamp,    // this is the sort key
            firstName: body.first_name || 'Not provided',
            lastName: body.last_name || 'Not provided',
            phone: body.phone || 'Not provided',
            subject: body.subject || 'Not provided',
            message: body.message || 'Not provided',
            emailSent: emailSent,
        }
    };


    try {
        await dynamo.put(dbParams).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: `Email sent: ${emailSent}. Data stored in DynamoDB` }),
        };
    } catch (error) {
        console.error('Error storing data in DynamoDB:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error storing data in DynamoDB' }),
        };
    }
};
