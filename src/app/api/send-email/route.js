import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const body = await request.json();

    const { email, name, pdfData } = body;

    if (!email || !pdfData) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and PDF data are required",
        },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true, // use SSL
      auth: {
        user: "support@mendingmind.org",
        pass: process.env.EMAIL_PASSWORD || "default-password-for-testing", // Store this in .env file
      },
      debug: true, // Show debug output
      logger: true, // Log information about the mail
    });

    // Create HTML email template with inline styles and no external images
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Assessment Report</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9f9f9;">
        <div style="height: 5px; background-color: #F0C93B; width: 100%;"></div>
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #F0C93B;">
            <h1 style="color: #1E1E1E; margin: 0;">MENDING MIND</h1>
            <p style="color: #666; font-style: italic; margin-top: 5px;">Skill Based Psychometric Assessment</p>
          </div>

          <div style="padding: 20px 0;">
            <h2 style="color: #1E1E1E;">Hello ${name || "there"},</h2>
            <p>Thank you for completing the <span style="color: #F0C93B; font-weight: bold;">Skill Based Psychometric Assessment</span> by Mending Mind.</p>
            <p>We're pleased to provide you with your personalized assessment report, which offers valuable insights into your:</p>
            <ul>
              <li>Personality traits</li>
              <li>Stress management</li>
              <li>Decision-making style</li>
              <li>Resilience levels</li>
              <li>Situational judgment capabilities</li>
            </ul>

            <div style="background-color: #FDF9F1; border-left: 4px solid #F0C93B; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; font-weight: bold;">Your detailed report is attached to this email.</p>
              <p style="margin-top: 10px; margin-bottom: 0;">Please take your time to review it and reflect on the insights provided.</p>
            </div>

            <p>If you have any questions about your results or would like to discuss them further, please don't hesitate to contact us.</p>
            <p>We appreciate your participation and wish you continued growth and success!</p>
            <p>Warm regards,<br>The Mending Mind Team</p>
          </div>

          <div style="text-align: center; padding: 20px 0; font-size: 12px; color: #666; border-top: 1px solid #eee;">
            <p>© ${new Date().getFullYear()} Mending Mind. All rights reserved.</p>
            <div style="margin-top: 20px;">
              <a href="https://www.instagram.com/mending__mind/" target="_blank" style="display: inline-block; margin: 0 10px; color: #1E1E1E; text-decoration: none;">Instagram</a>
              <a href="https://www.facebook.com/mendingmindfoundation/" target="_blank" style="display: inline-block; margin: 0 10px; color: #1E1E1E; text-decoration: none;">Facebook</a>
              <a href="https://www.linkedin.com/company/mendingmind/" target="_blank" style="display: inline-block; margin: 0 10px; color: #1E1E1E; text-decoration: none;">LinkedIn</a>
            </div>
            <p style="margin-top: 15px;">
              <a href="mailto:support@mendingmind.org" style="color: #F0C93B; text-decoration: none;">support@mendingmind.org</a> |
              <a href="https://mendingmind.org" style="color: #F0C93B; text-decoration: none;">mendingmind.org</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: '"Mending Mind" <support@mendingmind.org>',
      to: email,
      subject: "Your Skill Based Psychometric Assessment Report",
      html: htmlTemplate,
      attachments: [
        {
          filename: "Skill_Based_Psychometric_Assessment_Report.pdf",
          content: pdfData,
          encoding: "base64",
          contentType: "application/pdf",
        },
      ],
    };

    let messageId;
    try {
      const info = await transporter.sendMail(mailOptions);
      messageId = info.messageId;
    } catch (emailError) {
      console.error("Error in sendMail:", emailError);
      throw emailError; // Re-throw to be caught by the outer try/catch
    }

    return NextResponse.json({
      success: true,
      messageId: messageId,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
