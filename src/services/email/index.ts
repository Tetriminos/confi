import * as nodemailer from 'nodemailer';

import { GMAIL_ADDRESS, GMAIL_PASSWORD } from '../../config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_ADDRESS,
    pass: GMAIL_PASSWORD,
  },
});

/**
 * Constructs and sends the email
 * @param {string} to - email address of the receiver
 * @param {string} code - code to put inside the mail body
 */
export const sendCodeViaEMail = async (
  to: string,
  code: string
): Promise<void> => {
  const mailOptions = constructMailOptions(to, code);

  try {
    const {
      accepted,
      rejected,
    }: { accepted: string[]; rejected: string[] } = await transporter.sendMail(
      mailOptions
    );
    if (accepted.includes(to)) {
      console.log(`successfully sent code to ${to}`);
    } else if (rejected.includes(to)) {
      // not sure whether I retry sending the email, how long do I wait before retries, do I still save the user to the
      // DB now that he can't get his code, etc.
      console.error(`email rejected by ${to}`);
    }
  } catch (err) {
    // I am not sure on what to do when an error occurs
    console.error(err);
  }
};

/**
 * Constructs the mail options object used by nodemailer
 * @param {string} to - email address of the receiver
 * @param {string} code - code to put inside the mail body
 * @returns {MailOptions}
 */
const constructMailOptions = (to: string, code: string) => {
  return {
    from: GMAIL_ADDRESS,
    to,
    subject: 'Your conference code',
    html: `<p>Hello love, your conference code is ${code}</p>`,
  };
};
