/**
 * Mailing system
 * Provided by mailgun
 * 
 * @requires mailgun-js NPM Library
 */
const mailgun = require('mailgun-js');

const mailgunAPIKey = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;

const mg = mailgun({apiKey: mailgunAPIKey, domain: DOMAIN});

/**
 * Sending function
 */
const sendWelcomeEmail = ( email, name ) => {
  mg.messages().send({

    to: email,
    from: `Task Manager App <me@${ DOMAIN }>`,
    subject: 'Thanks for joining in!',
    text: `Welcome to the app, ${ name }. Let me know how you get along with the app.`

  });
};

/**
 * Challenge Cancelation Email
 */
const sendCancelationEmail = ( email, name ) => {
  mg.messages().send({

    to: email,
    from: `Task Manager App <me@${ DOMAIN }>`,
    subject: 'Cancelation request successfull',
    text: `Thanks for work with us, ${ name } :(. We hope to see you again later here.`

  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
}