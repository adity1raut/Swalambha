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

export const sendPasswordResetEmail = async (email, name, resetUrl) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Password Reset Request - Election Portal',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="background-color: #007bff; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">Password Reset Request</h1>
        </div>
        
        <div style="padding: 30px;">
          <p style="font-size: 16px; color: #333;">Dear ${name},</p>
          <p style="font-size: 14px; color: #666; line-height: 1.6;">
            We received a request to reset your password for your Election Portal account. 
            Click the button below to create a new password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #007bff; color: white; padding: 14px 40px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;
                      font-weight: bold; font-size: 16px;">
              Reset Password
            </a>
          </div>
          
          <p style="font-size: 13px; color: #666; margin-top: 20px;">
            Or copy and paste this link into your browser:
          </p>
          <p style="background-color: #f5f5f5; padding: 12px; word-break: break-all; 
                    border-radius: 4px; font-size: 12px; color: #333;">
            ${resetUrl}
          </p>
          
          <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 25px 0; border-radius: 4px;">
            <p style="color: #856404; margin: 0; font-weight: bold; font-size: 14px;">⚠️ Important Security Information:</p>
            <ul style="color: #856404; margin: 10px 0 0 0; padding-left: 20px; font-size: 13px;">
              <li>This link will expire in <strong>1 hour</strong></li>
              <li>If you didn't request this password reset, please ignore this email</li>
              <li>Your password won't change until you click the link above and set a new password</li>
              <li>Never share this link with anyone</li>
            </ul>
          </div>
          
          <div style="border-top: 1px solid #e0e0e0; margin-top: 30px; padding-top: 20px;">
            <p style="font-size: 13px; color: #999; margin: 0;">
              If you're having trouble clicking the button, copy and paste the URL into your web browser.
            </p>
            <p style="font-size: 13px; color: #999; margin: 10px 0 0 0;">
              Best regards,<br>
              <strong>Election Management Team</strong>
            </p>
          </div>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 0 0 8px 8px; text-align: center;">
          <p style="font-size: 11px; color: #6c757d; margin: 0;">
            This is an automated email. Please do not reply to this message.
          </p>
        </div>
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

export const sendOTPEmail = async (email, name, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Password Reset OTP - Election Portal',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="background-color: #10b981; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">Password Reset OTP</h1>
        </div>
        
        <div style="padding: 30px;">
          <p style="font-size: 16px; color: #333;">Dear ${name},</p>
          <p style="font-size: 14px; color: #666; line-height: 1.6;">
            We received a request to reset your password. Use the OTP below to proceed:
          </p>
          
          <div style="background-color: #f8f9fa; padding: 25px; margin: 30px 0; text-align: center; border-radius: 8px; border: 2px dashed #10b981;">
            <p style="font-size: 14px; color: #666; margin: 0 0 10px 0;">Your OTP Code:</p>
            <p style="font-size: 36px; font-weight: bold; color: #10b981; margin: 0; letter-spacing: 8px; font-family: monospace;">
              ${otp}
            </p>
          </div>
          
          <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 25px 0; border-radius: 4px;">
            <p style="color: #856404; margin: 0; font-weight: bold; font-size: 14px;">⚠️ Important Security Information:</p>
            <ul style="color: #856404; margin: 10px 0 0 0; padding-left: 20px; font-size: 13px;">
              <li>This OTP will expire in <strong>10 minutes</strong></li>
              <li>You have <strong>3 attempts</strong> to enter the correct OTP</li>
              <li>If you didn't request this, please ignore this email</li>
              <li>Never share this OTP with anyone</li>
            </ul>
          </div>
          
          <div style="border-top: 1px solid #e0e0e0; margin-top: 30px; padding-top: 20px;">
            <p style="font-size: 13px; color: #999; margin: 10px 0 0 0;">
              Best regards,<br>
              <strong>Election Management Team</strong>
            </p>
          </div>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 0 0 8px 8px; text-align: center;">
          <p style="font-size: 11px; color: #6c757d; margin: 0;">
            This is an automated email. Please do not reply to this message.
          </p>
        </div>
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