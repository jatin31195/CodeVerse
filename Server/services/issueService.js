const sendEmail = require('../utils/email');

async function sendIssueReport({ userEmail, description, screenshotUrl }) {
  const subject = `New Issue Report from ${userEmail}`;
  const text = `User: ${userEmail}\n\nDescription:\n${description}\n\nScreenshot: ${screenshotUrl || 'None'}`;
  const html = `
    <p><strong>Reporter:</strong> ${userEmail}</p>
    <p><strong>Description:</strong></p>
    <p>${description.replace(/\n/g, '<br>')}</p>
    ${screenshotUrl ? `<p><strong>Screenshot:</strong></p><img src="${screenshotUrl}" style="max-width:600px;" />` : ''}
  `;

  await sendEmail('noreply.at.codeverse@gmail.com', subject, text, html);
}

module.exports = { sendIssueReport };
