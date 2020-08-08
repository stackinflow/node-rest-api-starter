const sgMail = require("@sendgrid/mail");
const pug = require("pug");
require("dotenv").config();

const _senderConfig = {
  email: process.env.SENDGRID_EMAIL,
  name: process.env.SENDGRID_USERNAME,
};

class Email {
  constructor() {
    if (!process.env.SENDGRID_API_KEY) {
      throw "Sendgrid API Key is not specified. Please specify the API key in your environment variables, as SENDGRID_API_KEY=<your-api-key-here>";
    }
  }

  _sendEmail(mailOptions) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: mailOptions.to,
      from: _senderConfig,
      subject: mailOptions.subject,
      html: mailOptions.html,
    };
    // console.log(mailOptions.html);
    //ES6
    sgMail.send(msg).then(
      () => {
        console.log("Email sent");
      },
      (error) => {
        console.error(error);
        if (error.response) {
          console.error(error.response.body);
        }
      }
    );
  }

  accVerification(token, email) {
    console.log("sending mail");
    try {
      const localHost = process.env.host;

      const render = pug.renderFile(__dirname + "/templates/verify_email.pug", {
        link: `${localHost}/api/v1/auth/token/verify?t=${token}`,
        host: localHost,
      });

      var mailOptions = {
        from: `Your app <${process.env.SENDGRID_EMAIL}>`,
        to: email,
        subject: "Account verification - Your app",
        html: render,
      };

      this._sendEmail(mailOptions);
    } catch (err) {
      console.log(`Unable to send email:`);
      console.log(err);
    }
  }
}

module.exports = Email;
