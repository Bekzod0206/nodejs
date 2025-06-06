import nodemailer from "nodemailer"

class MailServiceClass {

  transporterConfig() {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      }
    })
  }

  async sendActivationMail(email, activationLink) {
    const transporter = await this.transporterConfig()
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: `Activation account link ${activationLink}`,
      html: `
        <div>
          <a href="${activationLink}">Click to activate account</a>
        </div>
      `
    })
  }

  async sendForgotPasswordMail(email, activationLink) {
    const transporter = await this.transporterConfig()
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: `Forgot password.`,
      html: `
        <div>
          <h1>Click the link below in order to recover your account</h1>
          <a href="${activationLink}"> - Recovery link</a>
          <b>This link expires within 15 minutes</b>
        </div>
      `
    })
  }
}

const MailService = new MailServiceClass()
export {MailService}