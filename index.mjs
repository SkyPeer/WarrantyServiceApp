/*

    Start server:
    node index.js --port {portNumber}
    example:
    node index.js --port 3100
    
    default port 3100

*/

import express from "express";
import helmet from"helmet"
import path from "path"
import compression from "compression"
import app from 'express'
import http from "http"
import server from http.createServer(app),
  
import bodyParser = require("body-parser")),
  
import mongoose = require("mongoose")),
import mailer = require("express-mailer")),
  
import datetime = require("node-datetime"));

//ServerConfiguration Block
import minimist = require("minimist");
import masterconfig = require("./serverconfig");
import ailconfig = require("./mail-config");
import db = require("./dbconfig");

let args = minimist(process.argv.slice(2));

import config from "./config2.mjs";

console.log("newConfig", config2);

if (args.port) {
  console.log("port was bind by args:", args.port);
  masterconfig.server.port = args.port;
}

console.log("-----------------------------------------------------");
console.log("TRY START ServiceApp Server:");
console.log("mailConfig:", mailconfig);
console.log("masterConfig:", masterconfig);
console.log("DataBase Configuration", db);
console.log("-----------------------------------------------------");

app.set("views", __dirname + "/views");
app.set("view engine", "jade");

mongoose
  .connect(`mongodb://${db.host}:${db.port}/${db.dbname}`, {
    useNewUrlParser: true,
    useFindAndModify: true
  })
  .then(() => {
    console.log("mongodb has started");
  })
  .catch(err => {
    console.log(err);
  });

mongoose.Promise = global.Promise;

let TicketsSchema = new mongoose.Schema({
  ticketNumber: Number,
  ticketDate: String,
  ticketPriority: Number,
  status: Number,

  vendor: String,
  model: String,
  partNumber: String,
  problem: String,
  place: Number,
  placeAnother: String,
  projectCode: String,

  firstname: String,
  lastname: String,
  familyname: String,
  email: String,
  telnum: String,
  extnum: String,

  daysForService: String,
  comment: String,
  serviceCenter: String,
  typeOfService: Number,
  serviceCenterTicket: String
});
let TicketModel = mongoose.model("tickets", TicketsSchema);

let ServiceCentersSchema = new mongoose.Schema({
  scTitle: String,
  scVendors: String,
  scAdress: String
});
let ServiceCenterModel = mongoose.model("servicecenters", ServiceCentersSchema);

function getRandomTicketNumber() {
  let random = parseInt(Math.random() * (9999 - 1) + 2000);
  console.log("newRequest", random);
  return random;
}

function getCurrnetDateTime() {
  /*let date = new Date(); */
  let date = datetime.create();
  return date;
  //return(date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear() + ' ' + (date.getHours() + ':' + date.getMinutes()));
}

console.log(getCurrnetDateTime());

app.get("/getTicketRandomNumber", (req, res) => {
  res.json({ ticketNumber: getRandomTicketNumber() });
});

// ----- get/post for ServiceCenters
app.get("/mongooseGetDataSC", function(req, res, next) {
  ServiceCenterModel.find(function(err, scDocs) {
    if (err) return next(err);
    res.json(scDocs.reverse());
  });
});

app.post("/mongooseSCUpdate", bodyParser.json(), function(req, res) {
  // console.log(
  //   "------- mongooseUpdate " + "req.body:   id",
  //   req.body._id,
  //   "body.scTitle:",
  //   req.body.scTitle,
  //   "body.scVendors:",
  //   req.body.scVendors,
  //   "body.scAdress:",
  //   req.body.scAdress
  // );

  ServiceCenterModel.findOneAndUpdate(
    {
      _id: req.body._id // search query
    },
    {
      scTitle: req.body.scTitle,
      scVendors: req.body.scVendors,
      scAdress: req.body.scAdress
    },
    {
      new: true, // return updated doc
      runValidators: true // validate before update
    }
  )
    .then(() => {
      //console.log(doc)
      console.log("ok");
      res.sendStatus(200);
    })
    .catch(err => {
      console.error(err);
    });
});

app.post("/mongooseSCInsert", bodyParser.json(), function(req, res) {
  console.log("------- mongooseInsertSC " + "SC: ", req.body);

  ServiceCenterModel.create({
    scTitle: req.body.scTitle,
    scVendors: req.body.scVendors,
    scAdress: req.body.scAdress
  })
    .then(() => {
      console.log("new SC inserted");
      res.sendStatus(200);
    })
    .catch(err => {
      console.error(err);
    });
});

app.post("/mongooseSCDelete", bodyParser.json(), function(req, res) {
  console.log("------- mongooseDeleteSC " + "SC: ", req.body);

  ServiceCenterModel.remove({
    _id: req.body._id
  })
    .then(() => {
      //console.log(doc)
      console.log("SC Deleted");
      res.sendStatus(200);
    })
    .catch(err => {
      console.error(err);
    });
});
// ----- get/post for ServiceCenters

// ----- get/post for Tickets
app.get("/mongooseGetDataTickets", function(req, res, next) {
  TicketModel.find(function(err, ticketsDocs) {
    if (err) return next(err);
    console.log("GET TICKETS FUNCTION");
    res.json({
      data: ticketsDocs.reverse(),
      currentDate: getCurrnetDateTime()._now
    });
  });
});

app.get("/mongooseGetTicketsSC", function(req, res, next) {
  TicketModel.find(function(err, ticketsDocs) {
    if (err) return next(err);
    res.json(
      ticketsDocs.map(result => {
        return { ticketNumber: result.ticketNumber, sc: result.serviceCenter };
      })
    );
  });
});

app.post("/mongooseFind", bodyParser.json(), function(req, res) {
  //console.log('req.body', req.body);
  TicketModel.findById(req.body, function(err, ticketsDocs) {
    //if (err) return next (err);
    if (err) return err;
    //console.log(taskDocs);
    res.json(ticketsDocs);
  });
});

app.post("/mongooseSearchbyTicketNumber", bodyParser.json(), function(
  req,
  res
) {
  console.log(
    "SearchbyTicketNumber req.body",
    req.body,
    "isNAN:",
    isNaN(req.body.ticketNumber)
  );

  isNaN(req.body.ticketNumber)
    ? res.json({ error: "mongoNotFound" })
    : TicketModel.findOne({ ticketNumber: req.body.ticketNumber }, function(
        err,
        ticket
      ) {
        if (err) return err;
        console.log("findOne", ticket);
        ticket !== null
          ? res.json({ data: ticket, currentDate: getCurrnetDateTime()._now })
          : res.json({ error: "mongoNotFound" });
      });
});

app.post("/mongooseTicketDelete", bodyParser.json(), function(req, res) {
  console.log("------- mongooseDeleteTicket " + "TickedId: ", req.body);

  TicketModel.remove({
    _id: req.body._id
  })
    .then(() => {
      //console.log(doc)
      console.log("Ticket Deleted");
      res.sendStatus(200);
    })
    .catch(err => {
      console.error(err);
    });
});

app.post("/mongooseUpdate", bodyParser.json(), function(req, res) {
  // console.log(
  //   "------- mongooseUpdate " + "req.body:   id",
  //   req.body._id,
  //   "body.comment:",
  //   req.body.comment,
  //   "body.status:",
  //   req.body.status,
  //   "body.serviceCenterTicket:",
  //   req.body.serviceCenterTicket,
  //   "body.daysForService:",
  //   req.body.daysForService
  // );

  TicketModel.findOneAndUpdate(
    {
      _id: req.body._id // search query
    },
    {
      ticketPriority: req.body.ticketPriority,
      typeOfService: req.body.typeOfService,
      status: req.body.status,
      comment: req.body.comment,
      serviceCenter: req.body.serviceCenter,
      daysForService: req.body.daysForService,
      serviceCenterTicket: req.body.serviceCenterTicket
      // field:values to update
    },
    {
      new: true, // return updated doc
      runValidators: true // validate before update
    }
  )
    .then(() => {
      //console.log(doc)
      console.log("ok");
      res.sendStatus(200);
    })
    .catch(err => {
      console.error(err);
    });
});

app.post("/mongooseInsert", bodyParser.json(), function(req, res) {
  console.log("------- mongooseInsertTicket " + "name: ", req.body.firstname);

  let randomTicketNumber = getRandomTicketNumber();
  let currentDateTime = getCurrnetDateTime()._now;
  let resJson = {
    ticketNumber: randomTicketNumber,
    currentDateTime: currentDateTime,
    status: 200
  };
  TicketModel.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    familyname: req.body.familyname,
    email: req.body.email,
    telnum: req.body.telnum,
    extnum: req.body.extnum,

    ticketNumber: randomTicketNumber,
    ticketDate: currentDateTime,
    ticketPriority: req.body.ticketPriority,
    status: 0,

    vendor: req.body.vendor,
    model: req.body.model,
    partNumber: req.body.partNumber,
    problem: req.body.problem,
    place: req.body.place,
    placeAnother: req.body.placeAnother,
    projectCode: req.body.projectCode,

    daysForService: "",
    comment: "",
    serviceCenter: "",
    typeOfService: 0,
    serviceCenterTicket: ""
  })
    /*.then(() => {
            //console.log(doc)
            console.log('ok');
            res.sendStatus(200)})*/
    .then(() => {
      //res.setHeader('Content-Type', 'application/json');
      res.json({ resJson });
    })
    .then(
      mailersend(
        req.body.email,
        randomTicketNumber,
        req.body.vendor,
        req.body.model,
        req.body.partNumber,
        req.body.problem
      )
    )
    .then(mailersend(mailconfig.confirmationEmail, randomTicketNumber))
    .catch(err => {
      console.error(err);
    });
});

//---------------------------- mailer

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
        console.log("There was an error sending the email to", mailadress);
        return;
      }
      console.log("Email Sent to:", mailadress);
    }
  );
}

app.use(helmet());
app.use(compression());

app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/build", express.static(path.join(__dirname, "build")));
app.use("/", (req, res, next) => {
  // console.log('send default')
  res.sendFile("index.html", { root: __dirname });
});

server.listen(masterconfig.server.port, function() {
  console.log(
    `WarrantyServiceApp Start http://${masterconfig.server.host}:${masterconfig.server.port}`
  );
});
