export const COMPANY_EMAIL = 'hellothealvryn@gmail.com';

// Gmail opens a draft; visitors review and send it themselves.
export const COMPANY_GMAIL_URL = 'https://mail.google.com/mail/?' + new URLSearchParams({
  view: 'cm',
  fs: '1',
  to: COMPANY_EMAIL,
  su: 'Enquiry about Alvryn Workforce',
}).toString();
