// const nodemailer = require('nodemailer');

// class EmailService {
//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       service: 'gmail',
//       host: 'smtp.gmail.com',
//       port: 587,
//       secure: false,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_APP_PASSWORD
//       },
//       tls: {
//         rejectUnauthorized: false
//       }
//     });

//     // Verify connection configuration
//     this.transporter.verify((error, success) => {
//       if (error) {
//         console.error('❌ Email service configuration error:', error);
//       } else {
//         console.log('✅ Email service ready to send messages');
//       }
//     });
//   }

//   async sendWelcomeEmail(userEmail, userName) {
//     const mailOptions = {
//       from: {
//         name: 'RelationSync',
//         address: process.env.EMAIL_USER
//       },
//       to: userEmail,
//       subject: '🎉 Welcome to RelationSync - Your Relationship Journey Begins',
//       html: `
//         <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
//           <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
//             <div style="text-align: center; margin-bottom: 32px;">
//               <div style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #ec4899); padding: 16px; border-radius: 16px; margin-bottom: 16px;">
//                 <span style="font-size: 32px;">💜</span>
//               </div>
//               <h1 style="color: #1f2937; margin: 0; font-size: 28px; font-weight: 700;">Welcome to RelationSync!</h1>
//             </div>
            
//             <p style="color: #374151; font-size: 18px; margin-bottom: 8px;">Hi ${userName},</p>
            
//             <div style="background: linear-gradient(135deg, #f3f4f6, #e5e7eb); padding: 24px; border-radius: 12px; margin-bottom: 24px; border-left: 4px solid #7c3aed;">
//               <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 12px 0;">
//                 🌟 <strong>Every relationship can be healed, strengthened, and transformed.</strong>
//               </p>
//               <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">
//                 You've taken the first brave step toward building a deeper, more connected relationship. 
//                 This journey of understanding and growth starts now, and we're here to guide you every step of the way.
//               </p>
//             </div>

//             <div style="text-align: center; margin: 32px 0;">
//               <a href="${process.env.FRONTEND_URL}/questionnaire" 
//                  style="background: linear-gradient(135deg, #7c3aed, #ec4899); color: white; padding: 16px 32px; 
//                         text-decoration: none; border-radius: 12px; font-weight: 600; display: inline-block;
//                         box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);">
//                 📝 Begin Your Relationship Assessment
//               </a>
//             </div>

//             <div style="background: #f3f4f6; padding: 24px; border-radius: 12px; margin: 24px 0;">
//               <h3 style="color: #374151; margin: 0 0 16px 0; font-size: 18px;">✨ What awaits you:</h3>
//               <ul style="color: #374151; line-height: 1.8; margin: 0; padding-left: 20px;">
//                 <li>🧠 Deep AI-powered relationship insights</li>
//                 <li>💬 Personalized communication strategies</li>
//                 <li>🤝 Conflict resolution techniques</li>
//                 <li>💕 Tools to rebuild and strengthen intimacy</li>
//                 <li>🌱 A roadmap for lasting relationship growth</li>
//               </ul>
//             </div>

//             <div style="background: linear-gradient(135deg, #eff6ff, #dbeafe); padding: 20px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #3b82f6;">
//               <p style="color: #1e40af; margin: 0; font-size: 14px; font-weight: 500;">
//                 💙 <strong>Remember:</strong> Every challenge in your relationship is an opportunity for deeper connection. 
//                 The fact that you're here shows your commitment to love and growth. That's already a beautiful beginning.
//               </p>
//             </div>

//             <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
//               <p style="color: #9ca3af; font-size: 12px; margin: 0;">
//                 Questions? Reply to this email - we're here to support your journey! 💙
//               </p>
//             </div>
//           </div>
//         </div>
//       `
//     };

//     try {
//       const info = await this.transporter.sendMail(mailOptions);
//       console.log('✅ Welcome email sent successfully:', info.messageId);
//       return { success: true, messageId: info.messageId };
//     } catch (error) {
//       console.error('❌ Welcome email failed:', error);
//       return { success: false, error: error.message };
//     }
//   }

//   async sendPairIdGeneratedEmail(userEmail, userName, pairId) {
//     const mailOptions = {
//       from: {
//         name: 'RelationSync',
//         address: process.env.EMAIL_USER
//       },
//       to: userEmail,
//       subject: `🔗 Your Pair ID is Ready: ${pairId}`,
//       html: `
//         <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
//           <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
//             <div style="text-align: center; margin-bottom: 32px;">
//               <div style="display: inline-block; background: linear-gradient(135deg, #10b981, #06b6d4); padding: 16px; border-radius: 16px; margin-bottom: 16px;">
//                 <span style="font-size: 32px;">🔗</span>
//               </div>
//               <h1 style="color: #1f2937; margin: 0; font-size: 28px; font-weight: 700;">Your Pair ID is Ready!</h1>
//             </div>
            
//             <p style="color: #374151; font-size: 18px; margin-bottom: 8px;">Hi ${userName},</p>
            
//             <div style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); padding: 24px; border-radius: 12px; margin-bottom: 24px; border-left: 4px solid #10b981; text-align: center;">
//               <p style="color: #374151; font-size: 16px; margin: 0 0 12px 0;">Your unique Pair ID:</p>
//               <div style="background: white; padding: 16px; border-radius: 8px; border: 2px dashed #10b981; margin: 12px 0;">
//                 <span style="font-size: 32px; font-weight: bold; color: #10b981; font-family: monospace;">${pairId}</span>
//               </div>
//               <p style="color: #6b7280; font-size: 14px; margin: 0;">Share this code with your partner to connect your accounts</p>
//             </div>

//             <div style="background: #f3f4f6; padding: 24px; border-radius: 12px; margin: 24px 0;">
//               <h3 style="color: #374151; margin: 0 0 16px 0; font-size: 18px;">📱 How to connect:</h3>
//               <ol style="color: #374151; line-height: 1.8; margin: 0; padding-left: 20px;">
//                 <li>Share your Pair ID <strong>${pairId}</strong> with your partner</li>
//                 <li>Have them enter it in their RelationSync app</li>
//                 <li>You'll both receive confirmation when connected</li>
//                 <li>Unlock couple insights and shared features!</li>
//               </ol>
//             </div>

//             <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
//               <p style="color: #9ca3af; font-size: 12px; margin: 0;">
//                 Keep this Pair ID safe and only share it with your partner.
//               </p>
//             </div>
//           </div>
//         </div>
//       `
//     };

//     try {
//       const info = await this.transporter.sendMail(mailOptions);
//       console.log('✅ Pair ID email sent successfully:', info.messageId);
//       return { success: true, messageId: info.messageId };
//     } catch (error) {
//       console.error('❌ Pair ID email failed:', error);
//       return { success: false, error: error.message };
//     }
//   }

//   async sendPairingSuccessEmail(userEmail, userName, partnerName) {
//     const mailOptions = {
//       from: {
//         name: 'RelationSync',
//         address: process.env.EMAIL_USER
//       },
//       to: userEmail,
//       subject: `🎉 Successfully Connected with ${partnerName}!`,
//       html: `
//         <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
//           <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
//             <div style="text-align: center; margin-bottom: 32px;">
//               <div style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #ec4899); padding: 16px; border-radius: 16px; margin-bottom: 16px;">
//                 <span style="font-size: 32px;">🎉</span>
//               </div>
//               <h1 style="color: #1f2937; margin: 0; font-size: 28px; font-weight: 700;">Accounts Successfully Connected!</h1>
//             </div>
            
//             <p style="color: #374151; font-size: 18px; margin-bottom: 8px;">Hi ${userName},</p>
            
//             <div style="background: linear-gradient(135deg, #f3f4f6, #e5e7eb); padding: 24px; border-radius: 12px; margin-bottom: 24px; border-left: 4px solid #7c3aed;">
//               <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 12px 0;">
//                 🎊 <strong>Congratulations!</strong> You and <strong>${partnerName}</strong> are now connected on RelationSync.
//               </p>
//               <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">
//                 This is a beautiful step toward deeper understanding and stronger connection in your relationship.
//               </p>
//             </div>

//             <div style="text-align: center; margin: 32px 0;">
//               <a href="${process.env.FRONTEND_URL}/couple-report" 
//                  style="background: linear-gradient(135deg, #7c3aed, #ec4899); color: white; padding: 16px 32px; 
//                         text-decoration: none; border-radius: 12px; font-weight: 600; display: inline-block;
//                         box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);">
//                 💕 Explore Couple Insights
//               </a>
//             </div>

//             <div style="background: linear-gradient(135deg, #eff6ff, #dbeafe); padding: 20px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #3b82f6;">
//               <h3 style="color: #1e40af; margin: 0 0 12px 0; font-size: 18px;">✨ What you can now access together:</h3>
//               <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.8;">
//                 <li>💕 Combined relationship compatibility analysis</li>
//                 <li>💬 Partner-to-partner message exchange</li>
//                 <li>🤝 Shared growth recommendations</li>
//                 <li>📊 Couple progress tracking</li>
//                 <li>🌱 Weekly relationship sync sessions</li>
//               </ul>
//             </div>

//             <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
//               <p style="color: #9ca3af; font-size: 12px; margin: 0;">
//                 Your individual responses remain private. Only combined insights are shared between partners.
//               </p>
//             </div>
//           </div>
//         </div>
//       `
//     };

//     try {
//       const info = await this.transporter.sendMail(mailOptions);
//       console.log('✅ Pairing success email sent successfully:', info.messageId);
//       return { success: true, messageId: info.messageId };
//     } catch (error) {
//       console.error('❌ Pairing success email failed:', error);
//       return { success: false, error: error.message };
//     }
//   }
// }

// module.exports = new EmailService();

// const nodemailer = require('nodemailer');

// class EmailService {
//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       service: 'gmail',
//       host: 'smtp.gmail.com',
//       port: 587,
//       secure: false,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_APP_PASSWORD
//       },
//       tls: {
//         rejectUnauthorized: false
//       }
//     });

//     // Verify connection configuration
//     this.transporter.verify((error, success) => {
//       if (error) {
//         console.error('❌ Email service configuration error:', error);
//       } else {
//         console.log('✅ Email service ready to send messages');
//       }
//     });
//   }

//   async sendWelcomeEmail(userEmail, userName) {
//     const mailOptions = {
//       from: {
//         name: 'RelationSync',
//         address: process.env.EMAIL_USER
//       },
//       to: userEmail,
//       subject: '🎉 Welcome to RelationSync - Your Relationship Journey Begins',
//       html: `
//         <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
//           <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
//             <div style="text-align: center; margin-bottom: 32px;">
//               <div style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #ec4899); padding: 16px; border-radius: 16px; margin-bottom: 16px;">
//                 <span style="font-size: 32px;">💜</span>
//               </div>
//               <h1 style="color: #1f2937; margin: 0; font-size: 28px; font-weight: 700;">Welcome to RelationSync!</h1>
//             </div>
            
//             <p style="color: #374151; font-size: 18px; margin-bottom: 8px;">Hi ${userName},</p>
            
//             <div style="background: linear-gradient(135deg, #f3f4f6, #e5e7eb); padding: 24px; border-radius: 12px; margin-bottom: 24px; border-left: 4px solid #7c3aed;">
//               <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 12px 0;">
//                 🌟 <strong>Every relationship can be healed, strengthened, and transformed.</strong>
//               </p>
//               <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">
//                 You've taken the first brave step toward building a deeper, more connected relationship. 
//                 This journey of understanding and growth starts now, and we're here to guide you every step of the way.
//               </p>
//             </div>

//             <div style="text-align: center; margin: 32px 0;">
//               <a href="${process.env.FRONTEND_URL}/questionnaire" 
//                  style="background: linear-gradient(135deg, #7c3aed, #ec4899); color: white; padding: 16px 32px; 
//                         text-decoration: none; border-radius: 12px; font-weight: 600; display: inline-block;
//                         box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);">
//                 📝 Begin Your Relationship Assessment
//               </a>
//             </div>

//             <div style="background: #f3f4f6; padding: 24px; border-radius: 12px; margin: 24px 0;">
//               <h3 style="color: #374151; margin: 0 0 16px 0; font-size: 18px;">✨ What awaits you:</h3>
//               <ul style="color: #374151; line-height: 1.8; margin: 0; padding-left: 20px;">
//                 <li>🧠 Deep AI-powered relationship insights</li>
//                 <li>💬 Personalized communication strategies</li>
//                 <li>🤝 Conflict resolution techniques</li>
//                 <li>💕 Tools to rebuild and strengthen intimacy</li>
//                 <li>🌱 A roadmap for lasting relationship growth</li>
//               </ul>
//             </div>

//             <div style="background: linear-gradient(135deg, #eff6ff, #dbeafe); padding: 20px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #3b82f6;">
//               <p style="color: #1e40af; margin: 0; font-size: 14px; font-weight: 500;">
//                 💙 <strong>Remember:</strong> Every challenge in your relationship is an opportunity for deeper connection. 
//                 The fact that you're here shows your commitment to love and growth. That's already a beautiful beginning.
//               </p>
//             </div>

//             <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
//               <p style="color: #9ca3af; font-size: 12px; margin: 0;">
//                 Questions? Reply to this email - we're here to support your journey! 💙
//               </p>
//             </div>
//           </div>
//         </div>
//       `
//     };

//     try {
//       const info = await this.transporter.sendMail(mailOptions);
//       console.log('✅ Welcome email sent successfully:', info.messageId);
//       return { success: true, messageId: info.messageId };
//     } catch (error) {
//       console.error('❌ Welcome email failed:', error);
//       return { success: false, error: error.message };
//     }
//   }

//   async sendPairIdGeneratedEmail(userEmail, userName, pairId) {
//     const mailOptions = {
//       from: {
//         name: 'RelationSync',
//         address: process.env.EMAIL_USER
//       },
//       to: userEmail,
//       subject: `🔗 Your Pair ID is Ready: ${pairId}`,
//       html: `
//         <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
//           <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
//             <div style="text-align: center; margin-bottom: 32px;">
//               <div style="display: inline-block; background: linear-gradient(135deg, #10b981, #06b6d4); padding: 16px; border-radius: 16px; margin-bottom: 16px;">
//                 <span style="font-size: 32px;">🔗</span>
//               </div>
//               <h1 style="color: #1f2937; margin: 0; font-size: 28px; font-weight: 700;">Your Pair ID is Ready!</h1>
//             </div>
            
//             <p style="color: #374151; font-size: 18px; margin-bottom: 8px;">Hi ${userName},</p>
            
//             <div style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); padding: 24px; border-radius: 12px; margin-bottom: 24px; border-left: 4px solid #10b981; text-align: center;">
//               <p style="color: #374151; font-size: 16px; margin: 0 0 12px 0;">Your unique Pair ID:</p>
//               <div style="background: white; padding: 16px; border-radius: 8px; border: 2px dashed #10b981; margin: 12px 0;">
//                 <span style="font-size: 32px; font-weight: bold; color: #10b981; font-family: monospace;">${pairId}</span>
//               </div>
//               <p style="color: #6b7280; font-size: 14px; margin: 0;">Share this code with your partner to connect your accounts</p>
//             </div>

//             <div style="background: #f3f4f6; padding: 24px; border-radius: 12px; margin: 24px 0;">
//               <h3 style="color: #374151; margin: 0 0 16px 0; font-size: 18px;">📱 How to connect:</h3>
//               <ol style="color: #374151; line-height: 1.8; margin: 0; padding-left: 20px;">
//                 <li>Share your Pair ID <strong>${pairId}</strong> with your partner</li>
//                 <li>Have them enter it in their RelationSync app</li>
//                 <li>You'll both receive confirmation when connected</li>
//                 <li>Unlock couple insights and shared features!</li>
//               </ol>
//             </div>

//             <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
//               <p style="color: #9ca3af; font-size: 12px; margin: 0;">
//                 Keep this Pair ID safe and only share it with your partner.
//               </p>
//             </div>
//           </div>
//         </div>
//       `
//     };

//     try {
//       const info = await this.transporter.sendMail(mailOptions);
//       console.log('✅ Pair ID email sent successfully:', info.messageId);
//       return { success: true, messageId: info.messageId };
//     } catch (error) {
//       console.error('❌ Pair ID email failed:', error);
//       return { success: false, error: error.message };
//     }
//   }

//   async sendPairingSuccessEmail(userEmail, userName, partnerName) {
//     const mailOptions = {
//       from: {
//         name: 'RelationSync',
//         address: process.env.EMAIL_USER
//       },
//       to: userEmail,
//       subject: `🎉 Successfully Connected with ${partnerName}!`,
//       html: `
//         <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
//           <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
//             <div style="text-align: center; margin-bottom: 32px;">
//               <div style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #ec4899); padding: 16px; border-radius: 16px; margin-bottom: 16px;">
//                 <span style="font-size: 32px;">🎉</span>
//               </div>
//               <h1 style="color: #1f2937; margin: 0; font-size: 28px; font-weight: 700;">Accounts Successfully Connected!</h1>
//             </div>
            
//             <p style="color: #374151; font-size: 18px; margin-bottom: 8px;">Hi ${userName},</p>
            
//             <div style="background: linear-gradient(135deg, #f3f4f6, #e5e7eb); padding: 24px; border-radius: 12px; margin-bottom: 24px; border-left: 4px solid #7c3aed;">
//               <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 12px 0;">
//                 🎊 <strong>Congratulations!</strong> You and <strong>${partnerName}</strong> are now connected on RelationSync.
//               </p>
//               <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">
//                 This is a beautiful step toward deeper understanding and stronger connection in your relationship.
//               </p>
//             </div>

//             <div style="text-align: center; margin: 32px 0;">
//               <a href="${process.env.FRONTEND_URL}/couple-report" 
//                  style="background: linear-gradient(135deg, #7c3aed, #ec4899); color: white; padding: 16px 32px; 
//                         text-decoration: none; border-radius: 12px; font-weight: 600; display: inline-block;
//                         box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);">
//                 💕 Explore Couple Insights
//               </a>
//             </div>

//             <div style="background: linear-gradient(135deg, #eff6ff, #dbeafe); padding: 20px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #3b82f6;">
//               <h3 style="color: #1e40af; margin: 0 0 12px 0; font-size: 18px;">✨ What you can now access together:</h3>
//               <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.8;">
//                 <li>💕 Combined relationship compatibility analysis</li>
//                 <li>💬 Partner-to-partner message exchange</li>
//                 <li>🤝 Shared growth recommendations</li>
//                 <li>📊 Couple progress tracking</li>
//                 <li>🌱 Weekly relationship sync sessions</li>
//               </ul>
//             </div>

//             <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
//               <p style="color: #9ca3af; font-size: 12px; margin: 0;">
//                 Your individual responses remain private. Only combined insights are shared between partners.
//               </p>
//             </div>
//           </div>
//         </div>
//       `
//     };

//     try {
//       const info = await this.transporter.sendMail(mailOptions);
//       console.log('✅ Pairing success email sent successfully:', info.messageId);
//       return { success: true, messageId: info.messageId };
//     } catch (error) {
//       console.error('❌ Pairing success email failed:', error);
//       return { success: false, error: error.message };
//     }
//   }
// }

// module.exports = new EmailService();
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection configuration
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Email service configuration error:', error);
      } else {
        console.log('✅ Email service ready to send messages');
      }
    });
  }

  async sendWelcomeEmail(userEmail, userName) {
    const mailOptions = {
      from: {
        name: 'RelationSync',
        address: process.env.EMAIL_USER
      },
      to: userEmail,
      subject: '🎉 Welcome to RelationSync - Your Relationship Journey Begins',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #ec4899); padding: 16px; border-radius: 16px; margin-bottom: 16px;">
                <span style="font-size: 32px;">💜</span>
              </div>
              <h1 style="color: #1f2937; margin: 0; font-size: 28px; font-weight: 700;">Welcome to RelationSync!</h1>
            </div>
            
            <p style="color: #1f2937; font-size: 18px; margin-bottom: 8px; font-weight: 600;">Hi ${userName},</p>
            
            <div style="background: linear-gradient(135deg, #f3f4f6, #e5e7eb); padding: 24px; border-radius: 12px; margin-bottom: 24px; border-left: 4px solid #7c3aed;">
              <p style="color: #1f2937; font-size: 16px; line-height: 1.6; margin: 0 0 12px 0; font-weight: 600;">
                🌟 <strong>Every relationship can be healed, strengthened, and transformed.</strong>
              </p>
              <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0; font-weight: 500;">
                You've taken the first brave step toward building a deeper, more connected relationship. 
                This journey of understanding and growth starts now, and we're here to guide you every step of the way.
              </p>
            </div>

            <div style="text-align: center; margin: 32px 0;">
              <a href="${process.env.FRONTEND_URL}/questionnaire" 
                 style="background: linear-gradient(135deg, #7c3aed, #ec4899); color: white; padding: 16px 32px; 
                        text-decoration: none; border-radius: 12px; font-weight: 600; display: inline-block;
                        box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);">
                📝 Begin Your Relationship Assessment
              </a>
            </div>

            <div style="background: #f9fafb; padding: 24px; border-radius: 12px; margin: 24px 0; border: 1px solid #e5e7eb;">
              <h3 style="color: #1f2937; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">✨ What awaits you:</h3>
              <ul style="color: #374151; line-height: 1.8; margin: 0; padding-left: 20px; font-weight: 500;">
                <li>🧠 Deep AI-powered relationship insights</li>
                <li>💬 Personalized communication strategies</li>
                <li>🤝 Conflict resolution techniques</li>
                <li>💕 Tools to rebuild and strengthen intimacy</li>
                <li>🌱 A roadmap for lasting relationship growth</li>
              </ul>
            </div>

            <div style="background: linear-gradient(135deg, #eff6ff, #dbeafe); padding: 20px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #3b82f6; border: 1px solid #bfdbfe;">
              <p style="color: #1e40af; margin: 0; font-size: 14px; font-weight: 600;">
                💙 <strong>Remember:</strong> Every challenge in your relationship is an opportunity for deeper connection. 
                The fact that you're here shows your commitment to love and growth. That's already a beautiful beginning.
              </p>
            </div>

            <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0; font-weight: 500;">
                Questions? Reply to this email - we're here to support your journey! 💙
              </p>
            </div>
          </div>
        </div>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Welcome email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Welcome email failed:', error);
      return { success: false, error: error.message };
    }
  }

  async sendPairIdGeneratedEmail(userEmail, userName, pairId) {
    const mailOptions = {
      from: {
        name: 'RelationSync',
        address: process.env.EMAIL_USER
      },
      to: userEmail,
      subject: `🔗 Your Pair ID is Ready: ${pairId}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; background: linear-gradient(135deg, #10b981, #06b6d4); padding: 16px; border-radius: 16px; margin-bottom: 16px;">
                <span style="font-size: 32px;">🔗</span>
              </div>
              <h1 style="color: #1f2937; margin: 0; font-size: 28px; font-weight: 700;">Your Pair ID is Ready!</h1>
            </div>
            
            <p style="color: #1f2937; font-size: 18px; margin-bottom: 8px; font-weight: 600;">Hi ${userName},</p>
            
            <div style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); padding: 24px; border-radius: 12px; margin-bottom: 24px; border-left: 4px solid #10b981; text-align: center; border: 1px solid #bbf7d0;">
              <p style="color: #1f2937; font-size: 16px; margin: 0 0 12px 0; font-weight: 600;">Your unique Pair ID:</p>
              <div style="background: white; padding: 16px; border-radius: 8px; border: 2px dashed #10b981; margin: 12px 0;">
                <span style="font-size: 32px; font-weight: bold; color: #10b981; font-family: monospace;">${pairId}</span>
              </div>
              <p style="color: #374151; font-size: 14px; margin: 0; font-weight: 500;">Share this code with your partner to connect your accounts</p>
            </div>

            <div style="background: #f9fafb; padding: 24px; border-radius: 12px; margin: 24px 0; border: 1px solid #e5e7eb;">
              <h3 style="color: #1f2937; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">📱 How to connect:</h3>
              <ol style="color: #374151; line-height: 1.8; margin: 0; padding-left: 20px; font-weight: 500;">
                <li>Share your Pair ID <strong style="color: #10b981;">${pairId}</strong> with your partner</li>
                <li>Have them enter it in their RelationSync app</li>
                <li>You'll both receive confirmation when connected</li>
                <li>Unlock couple insights and shared features!</li>
              </ol>
            </div>

            <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0; font-weight: 500;">
                Keep this Pair ID safe and only share it with your partner.
              </p>
            </div>
          </div>
        </div>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Pair ID email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Pair ID email failed:', error);
      return { success: false, error: error.message };
    }
  }

  async sendPairingSuccessEmail(userEmail, userName, partnerName) {
    const mailOptions = {
      from: {
        name: 'RelationSync',
        address: process.env.EMAIL_USER
      },
      to: userEmail,
      subject: `🎉 Successfully Connected with ${partnerName}!`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #ec4899); padding: 16px; border-radius: 16px; margin-bottom: 16px;">
                <span style="font-size: 32px;">🎉</span>
              </div>
              <h1 style="color: #1f2937; margin: 0; font-size: 28px; font-weight: 700;">Accounts Successfully Connected!</h1>
            </div>
            
            <p style="color: #1f2937; font-size: 18px; margin-bottom: 8px; font-weight: 600;">Hi ${userName},</p>
            
            <div style="background: linear-gradient(135deg, #f3f4f6, #e5e7eb); padding: 24px; border-radius: 12px; margin-bottom: 24px; border-left: 4px solid #7c3aed; border: 1px solid #d1d5db;">
              <p style="color: #1f2937; font-size: 16px; line-height: 1.6; margin: 0 0 12px 0; font-weight: 600;">
                🎊 <strong>Congratulations!</strong> You and <strong style="color: #7c3aed;">${partnerName}</strong> are now connected on RelationSync.
              </p>
              <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0; font-weight: 500;">
                This is a beautiful step toward deeper understanding and stronger connection in your relationship.
              </p>
            </div>

            <div style="text-align: center; margin: 32px 0;">
              <a href="${process.env.FRONTEND_URL}/couple-report" 
                 style="background: linear-gradient(135deg, #7c3aed, #ec4899); color: white; padding: 16px 32px; 
                        text-decoration: none; border-radius: 12px; font-weight: 600; display: inline-block;
                        box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);">
                💕 Explore Couple Insights
              </a>
            </div>

            <div style="background: linear-gradient(135deg, #eff6ff, #dbeafe); padding: 20px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #3b82f6; border: 1px solid #bfdbfe;">
              <h3 style="color: #1e40af; margin: 0 0 12px 0; font-size: 18px; font-weight: 600;">✨ What you can now access together:</h3>
              <ul style="color: #1f2937; margin: 0; padding-left: 20px; line-height: 1.8; font-weight: 500;">
                <li>💕 Combined relationship compatibility analysis</li>
                <li>💬 Partner-to-partner message exchange</li>
                <li>🤝 Shared growth recommendations</li>
                <li>📊 Couple progress tracking</li>
                <li>🌱 Weekly relationship sync sessions</li>
              </ul>
            </div>

            <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0; font-weight: 500;">
                Your individual responses remain private. Only combined insights are shared between partners.
              </p>
            </div>
          </div>
        </div>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Pairing success email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Pairing success email failed:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();