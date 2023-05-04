const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Maksim Pashkevich <${process.env.EMAIL_FROM}>`;
  }

  emailTransport() {
    // if (process.env.NODE_ENV === 'production') {
    //   // Sendgrid
    //   return 1;
    // }

    // Nodemailer
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_GMAIL_EMAIL,
        pass: process.env.NODEMAILER_GMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    await this.emailTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family');
  }

  async sendResetPassword() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for 10 minutes)'
    );
  }
};
