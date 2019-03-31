import * as nodemailer from 'nodemailer';

import { GMAIL_ADDRESS, GMAIL_PASSWORD } from '../../config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_ADDRESS,
    pass: GMAIL_PASSWORD,
  },
});

export const sendCodeViaEMail = async (
  to: string,
  code: string
): Promise<void> => {
  const mailOptions = {
    from: GMAIL_ADDRESS,
    to,
    subject: 'Your conference code',
    html: `<p>Hello love, your conference code is ${code}</p>`,
  };

  try {
    const { accepted }: { accepted: string[] } = await transporter.sendMail(mailOptions);
    if (accepted.includes(to)) {
      console.log(`successfully sent code to ${to}`);
    }
  } catch (err) {
    // I am not sure on what to do when an error occurs
    console.error(err);
  }
};
