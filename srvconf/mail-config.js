module.exports = {
  user: "", //this field for SMTP user
  pass: "", //this field for SMTP password
  confirmationEmail: "", //this field for confirmation e-emailAdress
  from: "arroway.service@yandex.ru",
  host: "smtp.yandex.ru", // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: "SMTP"
};
