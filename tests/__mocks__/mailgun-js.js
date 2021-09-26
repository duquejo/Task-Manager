/**
 * Mocking mailgun-js emails
 * 
 * @requires mailgun-js
 * 
 * @see If the mocked library have "/" ex. @sendgrid/mail, you need to separate it by subdirectories like this:
 *      subdirectory: @sendgrid
 *      mock file: mail.js
 * if the library to mock has not directory, create the mock file directly with the required library name, Ex: mailgun-js.js
 */

module.exports = function( apiKey, domain ) {
    const sendObject = {
        send() {
     
        }
    };
    const messagesObject = {
        messages() {
            return sendObject;
        }
    };
    return messagesObject;
}