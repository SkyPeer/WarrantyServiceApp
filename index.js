const express = require('express'),
    helmet = require('helmet'),
    path = require('path'),
    compression = require('compression'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    MongoClient = require('mongodb').MongoClient,
    mongoUrl = 'mongodb://localhost:27017',
    dbName = 'warranty',
    bodyParser = require('body-parser'),
    multer = require('multer'),
    ObjectID = require('mongodb').ObjectID,
    mongoose = require('mongoose'),
    mailer = require('express-mailer'),
    jade = require('jade'),
    datetime = require('node-datetime');
//mongoose = require('mongoose');


app.set('views', __dirname + '/views');
app.set('view engine', 'jade');


mongoose.connect('mongodb://localhost:27017/warranty', {
    useNewUrlParser: true,
    useFindAndModify: true,
})
    .then(() => {console.log('mongodb has started')})
    .catch((err) => {console.log(err)});

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
    serviceCenterTicket: String,
});
let TicketModel = mongoose.model('tickets', TicketsSchema);


let ServiceCentersSchema = new mongoose.Schema({
    scTitle: String,
    scVendors: String,
    scAdress: String

});
let ServiceCenterModel = mongoose.model('servicecenters', ServiceCentersSchema);


    function getRandomTicketNumber() {
        let random = parseInt(Math.random() * (9999 - 1) + 2000);
        console.log('newRequest', random);
        return (random)
    }

    function getCurrnetDateTime() {
        /*let date = new Date(); */
        let date = datetime.create();
        return date;
        //return(date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear() + ' ' + (date.getHours() + ':' + date.getMinutes()));
    }

    console.log(getCurrnetDateTime());

app.get('/getTicketRandomNumber', (req, res) => {
    res.json({ticketNumber: getRandomTicketNumber()})
});

// ----- get/post for ServiceCenters
app.get('/mongooseGetDataSC', function(req, res, next){

    ServiceCenterModel.find(function (err, scDocs){
        if (err) return next (err);
        res.json(scDocs.reverse())
    })
});

app.post('/mongooseSCUpdate', bodyParser.json(), function (req, res) {
    console.log('------- mongooseUpdate ' +
        'req.body:   id', req.body._id,
        'body.scTitle:',req.body.scTitle,
        'body.scVendors:',req.body.scVendors,
        'body.scAdress:',req.body.scAdress

    );

    ServiceCenterModel.findOneAndUpdate(
        {
            _id: req.body._id  // search query
        },
        {
            scTitle: req.body.scTitle,
            scVendors: req.body.scVendors,
            scAdress: req.body.scAdress
        },
        {
            new: true,                       // return updated doc
            runValidators: true              // validate before update
        })
        .then(() => {
            //console.log(doc)
            console.log('ok');
            res.sendStatus(200)
        })
        .catch(err => {
            console.error(err)
        })
});

app.post('/mongooseSCInsert', bodyParser.json(), function (req, res) {
    console.log('------- mongooseInsertSC ' + 'SC: ', req.body);

    ServiceCenterModel.create(
        {
            scTitle: req.body.scTitle,
            scVendors: req.body.scVendors,
            scAdress: req.body.scAdress
        })
        .then(() => {
            console.log('new SC inserted');
            res.sendStatus(200)})
        .catch(err => {
            console.error(err)
        })
});

app.post('/mongooseSCDelete', bodyParser.json(), function (req, res) {
    console.log('------- mongooseDeleteSC ' + 'SC: ', req.body);

    ServiceCenterModel.remove(
        {
            _id: req.body._id
        }
    )
        .then(() => {
        //console.log(doc)
        console.log('SC Deleted');
        res.sendStatus(200)
        })
        .catch(err => {
            console.error(err)
        })

});
// ----- get/post for ServiceCenters



// ----- get/post for Tickets
app.get('/mongooseGetDataTickets', function(req, res, next){

    TicketModel.find(function (err, ticketsDocs){
        if (err) return next (err);

        res.json({data: ticketsDocs.reverse(), currentDate: getCurrnetDateTime()})
    })
});

app.get('/mongooseGetTicketsSC', function(req, res, next){

    TicketModel.find(function (err, ticketsDocs){
        if (err) return next (err);
        res.json(
            ticketsDocs.map(result => {
                return {ticketNumber: result.ticketNumber,  sc: result.serviceCenter}
            })
        )
    })
});

app.post('/mongooseFind', bodyParser.json(), function(req, res){
    //console.log('req.body', req.body);
    TicketModel.findById(req.body, function (err, taskDocs) {
        if (err) return next (err);
        //console.log(taskDocs);
        res.json(taskDocs)
    })
});

app.post('/mongooseSearchbyTicketNumber', bodyParser.json(), function (req, res) {
    console.log('SearchbyTicketNumber req.body', req.body, 'isNAN:', isNaN(req.body.ticketNumber));

    isNaN(req.body.ticketNumber) ? res.json({error: 'mongoNotFound'}) :

        TicketModel.findOne({ticketNumber: req.body.ticketNumber}, function (err, ticket) {
            if (err) return (err);
            console.log('findOne', ticket);
            ticket !== null ?  res.json(ticket): res.json({error: 'mongoNotFound'})
        })
});

app.post('/mongooseTicketDelete', bodyParser.json(), function (req, res) {
    console.log('------- mongooseDeleteTicket ' + 'TickedId: ', req.body);

    TicketModel.remove(
        {
            _id: req.body._id
        }
    )
        .then(() => {
            //console.log(doc)
            console.log('Ticket Deleted');
            res.sendStatus(200)
        })
        .catch(err => {
            console.error(err)
        })

});

app.post('/mongooseUpdate', bodyParser.json(), function (req, res) {
    console.log('------- mongooseUpdate ' +
        'req.body:   id', req.body._id,
        'body.comment:', req.body.comment,
        'body.status:', req.body.status,
        'body.serviceCenterTicket:',req.body.serviceCenterTicket,
        'body.daysForService:',req.body.daysForService
    );

    TicketModel.findOneAndUpdate(
        {
            _id: req.body._id  // search query
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
            new: true,                       // return updated doc
            runValidators: true              // validate before update
        })
        .then(() => {
            //console.log(doc)
            console.log('ok');
            res.sendStatus(200)
        })
        .catch(err => {
            console.error(err)
        })
});

app.post('/mongooseInsert', bodyParser.json(), function (req, res) {
    console.log('------- mongooseInsertTicket ' +
            'name: ', req.body.firstname
    );

    let randomTicketNumber = getRandomTicketNumber();
    let currnetDateTime = getCurrnetDateTime()._now;
    let resJson = {
        ticketNumber: randomTicketNumber,
        currnetDateTime: currnetDateTime,
        status: 200
    };
    TicketModel.create(
        {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            familyname: req.body.familyname,
            email: req.body.email,
            telnum: req.body.telnum,
            extnum: req.body.extnum,

            ticketNumber: randomTicketNumber,
            ticketDate: currnetDateTime,
            ticketPriority: req.body.ticketPriority,
            status: 0,

            vendor: req.body.vendor,
            model: req.body.model,
            partNumber: req.body.partNumber,
            problem: req.body.problem,
            place: req.body.place,
            placeAnother: req.body.placeAnother,
            projectCode: req.body.projectCode,

            daysForService: '',
            comment: '',
            serviceCenter: '',
            typeOfService: 0,
            serviceCenterTicket: '',
        })
        /*.then(() => {
            //console.log(doc)
            console.log('ok');
            res.sendStatus(200)})*/
        .then(() => {
            //res.setHeader('Content-Type', 'application/json');
            res.json({resJson})
        })
        .then(mailersend(req.body.email, randomTicketNumber, req.body.vendor))
        .then(mailersend('oleg.selivantsev@gmail.com', randomTicketNumber, req.body.vendor))
        .catch(err => {
            console.error(err)
        })
});

///

//---------------------------- mailer

mailer.extend(app, {
    from: 'service@arroway.cloud',
    host: 'smtp.yandex.ru', // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
        user: 'service@arroway.cloud',
        pass: 'Qwerty0111'
    }
});
function mailersend(mailadress, ticketNumber, vendor) {

    app.mailer.send('email', {
        to: mailadress, // REQUIRED. This can be a comma delimited string just like a normal email to field.
        subject: 'Создана заявка на сервисное обслуживание '+ ticketNumber, // REQUIRED.
        otherProperty: ticketNumber, // All additional properties are also passed to the template as local variables.
        vendorProperty: vendor
    }, function (err) {
        if (err) {
            // handle error
            console.log(err);
            console.log('There was an error sending the email to', mailadress);
            return;
        }
        console.log('Email Sent to:', mailadress);
    });

}










/*app.get('/email', function (req, res, next) {
    app.mailer.send('email', {
        to: 'oleg.selivantsev@gmail.com', // REQUIRED. This can be a comma delimited string just like a normal email to field.
        subject: 'Test Email', // REQUIRED.
        otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables.
    }, function (err) {
        if (err) {
            // handle error
            console.log(err);
            console.log('There was an error sending the email');
            return;
        }
        console.log('Email Sent');
    });
});*/



// ----- get/post for Tickets




// ----------------------------------------------- OLD MongoClient
app.post('/delete', bodyParser.json(), function (req, res){
    console.log('--- delete', req.body);

    MongoClient.connect(mongoUrl)
        .then( client => {
            const db = client.db(dbName);
            const col = db.collection('tasks');
            /*col.updateOne({id: ObjectId("5bc16e50ddc7c1304065cf56")}, {$set: {complete: true}}) */
            /*col.updateOne(("_id", "5bc16e44d4b3d823f44d207f"), ("$set", ("zipcode", "10462")) ) */

            col.deleteOne({"_id": ObjectID(req.body._id)}).then(res.sendStatus(200))

        });
});

app.post('/update', bodyParser.json(), function (req, res) {
    console.log('--- update', req.body);

    MongoClient.connect(mongoUrl)
        .then( client => {
            const db = client.db(dbName);
            const col = db.collection('tasks');
            /*col.updateOne({id: ObjectId("5bc16e50ddc7c1304065cf56")}, {$set: {complete: true}}) */
            /*col.updateOne(("_id", "5bc16e44d4b3d823f44d207f"), ("$set", ("zipcode", "10462")) ) */

            col.updateOne({"_id": ObjectID(req.body._id)}, {$set: {"complete": req.body.complete}})

    });

});

app.post('/add', bodyParser.json(), function(req, res) {
    console.log('---add', req.body);
    res.sendStatus(200);

    MongoClient.connect(mongoUrl).then(client => {
        const db = client.db(dbName);
        const col = db.collection('tasks');

        col.insert(req.body)
    });
});

app.get('/test', (req, res) => {

    // opens connection to mongodb
    MongoClient.connect(mongoUrl).then(client => {
        let tasksArray = [];
        // creates const for our database
        const db = client.db(dbName);

        // creates const for 'employees' collection in database
        const col = db.collection('tasks');

        // finds ALL employees in 'employees' collection/converts to array
        col.find({}).toArray().then(docs => {

            // logs message upon finding collection
          //  console.log('found tasks for index');

            //console.log(docs);
            // renders index ejs template and passes employees array as data

            for (let i=0; i<docs.length; i++){
                tasksArray.push(
                    {
                        title: docs[i].title,
                        complete: docs[i].complete,
                        id: docs[i]._id
                    }

                   // docs[i].title

                )
            }

            res.send(tasksArray);

            // closes connection to mongodb and logs message
            //client.close(() => console.log('connection closed'));
            client.close();

            // checks for error in finding 'employees' collection
        }).catch(err => {

            // logs message upon error in finding 'employees' collection
            console.log('error finding employees', err);

        });

        // checks for error in connecting to mongodb
    }).catch(err => {

        // logs message upon error connecting to mongodb
        console.log('error connecting to mongodb', err);

    });

});

app.use(helmet());
app.use(compression());

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/build', express.static(path.join(__dirname, 'build')));
app.use('/', (req, res, next) => {
   // console.log('send default')
    res.sendFile('index.html', {root: __dirname})
});

server.listen(3000, function () {
    console.log(`WarrantyServiceApp Start http://localhost:3000`);
});


/* add in DB
*
* // note_routes.js


*
* */
