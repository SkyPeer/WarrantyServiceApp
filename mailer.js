// Mailer Module


mailer.extend(app, {
  from: mailconfig.from,
  host: mailconfig.host, // hostname
  secureConnection: mailconfig.secureConnection, // use SSL
  port: mailconfig.port, // port for secure SMTP
  transportMethod: mailconfig.transportMethod, // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: mailconfig.user,
    pass: mailconfig.pass
  }
});
function mailersend(
  mailadress,
  ticketNumber,
  vendor,
  model,
  partnumber,
  problem
) {
  app.mailer.send(
    "email",
    {
      to: mailadress, // REQUIRED. This can be a comma delimited string just like a normal email to field.
      subject: "Создана заявка на сервисное обслуживание " + ticketNumber, // REQUIRED.
      otherProperty: ticketNumber, // All additional properties are also passed to the template as local variables.
      vendorProperty: vendor,
      modelProperty: model,
      partnumberProperty: partnumber,
      problemProperty: problem
    },
    function(err) {
      if (err) {
        // handle error
        //console.log(err);
        console.log('There was an error sending the email to', mailadress);
        return;
      }
      console.log('Email Sent to:', mailadress);
    }
  );
}