let transporter = nodemailer.createTransport({
    service: "GMail",
    host: "gmail.com",
    port: process.env.PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
});
  
async function sendEmail(to: string, subject: string, text: string, html: string){
    await transporter.sendMail({
        from: process.env.EMAIL_USERNAME, 
        to: to, 
        subject: subject, 
        text: text, 
        html: html
    });
}
