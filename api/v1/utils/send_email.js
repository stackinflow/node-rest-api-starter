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
    // set the api key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: mailOptions.to,
      from: _senderConfig,
      subject: mailOptions.subject,
      html: mailOptions.html,
    };
    // console.log(mailOptions.html);

    if (process.env.NODE_ENV === "test")
      console.log("mails will not be sent in test env");
    // ES6
    else
      sgMail.send(msg).then(
        () => {
          console.log("Email sent");
        },
        (error) => {
          // console.error(error);
          if (error.response) {
            // console.error(error.response.body);
          }
        }
      );
  }

  accVerification(token, email, name) {
    console.log("sending mail");
    try {
      // this host will be used for sending the account verification link to the user
      // when the user registers
      const localHost = process.env.host;

      // this will render the html placing the link and host wherever specified
      const render = pug.renderFile(__dirname + "/templates/verify_email.pug", {
        link: `${localHost}/api/v1/auth/token/verify?t=${token}`,
        host: localHost,
        name: name.replace("undefined", ""),
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

  pwdReset(otp, email) {
    try {
      var htmlMessage = `<p>Hi, here is the OTP for resetting your password, this is valid only for 1 hour. 
          <br/>
          <blockquote> <strong> ${otp} </strong> </blockquote>
          </p> `;

      var mailOptions = {
        from: `Your app <${process.env.SENDGRID_EMAIL}>`,
        to: email,
        subject: "Password reset",
        html: htmlMessage,
      };
      this._sendEmail(mailOptions);
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Email;
