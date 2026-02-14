import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendVoterCredentials = async (email, name, password, electionTitle) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Your Voting Credentials - ${electionTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to ${electionTitle}</h2>
        <p>Dear ${name},</p>
        <p>You have been registered as a voter for the upcoming election. Here are your login credentials:</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
        </div>
        
        <p style="color: #d9534f;"><strong>Important:</strong> Please keep these credentials safe and do not share them with anyone.</p>
        <p>You can use these credentials to login and cast your vote when the election starts.</p>
        
        <p>Best regards,<br>Election Management Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};