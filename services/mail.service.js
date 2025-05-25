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

  async sendMail(email, activationLink) {
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
}

const MailService = new MailServiceClass()
export {MailService}