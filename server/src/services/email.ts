import sgMail from '@sendgrid/mail';

export const sendEmail = async (email: string, subject: string, text: string) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

    console.log('key', process.env.SENDGRID_API_KEY)

    const msg = {
        to: email,
        from: 'vvillaci@its.jnj.com',
        subject: subject,
        text: text,
        html: `<strong>${text}</strong>`,
    };

    try {
        await sgMail.send(msg);
        console.log('Email sent');
    } catch (error) {
        console.error(error);
    }
};
