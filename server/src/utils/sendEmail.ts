import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, text: string) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try{
        await transporter.sendMail({
            from: `"E-commerce Application" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
        });
        console.log('OTP sent');
    } catch(error) {
        console.log(error);
    }
};
