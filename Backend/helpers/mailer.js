import nodemailer from 'nodemailer';
const mailer = nodemailer.createTransport({

    host: process.env.EMAIL_HOST,
    port: 465, 
    secure: true, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, 
    },
    tls: {
        rejectUnauthorized: false 
    },
    logger: true, 
    debug: true 
});

export const sendWelcomeEmail = async (toEmail, firstName) => {

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.error("ERRORE: Variabili d'ambiente EMAIL_USER o EMAIL_PASSWORD mancanti. Impossibile inviare l'email.");
        return; 
    }
    
    const mailOptions = {
        from: `EpiCommerce <${process.env.EMAIL_USER}>`, 
        to: toEmail,
        subject: 'Benvenuto nella Community di EpiCommerce! 🚀',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #007bff;">Ciao ${firstName}, benvenuto!</h2>
                <p>Grazie per esserti registrato su EpiCommerce. Siamo entusiasti di averti nella nostra community.</p>
                <p>Ora puoi esplorare il nostro catalogo, personalizzare i tuoi Phone S e Phone L, e lasciare recensioni sui tuoi acquisti.</p>
                <p style="margin-top: 20px;">Inizia subito: 
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" 
                        style="display: inline-block; padding: 10px 20px; background-color: #ffc107; color: #333; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Vai al Sito
                    </a>
                </p>
                <p style="font-size: 0.9em; margin-top: 30px; color: #777;">A presto,<br>Il team di EpiCommerce</p>
            </div>
        `,
    };

    return mailer.sendMail(mailOptions);
};

export default mailer;