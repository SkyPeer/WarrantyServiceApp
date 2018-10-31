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
    mongoose = require('mongoose');

//mongoose = require('mongoose');


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
    lasname: String,
    familyname: String,
    email: String,
    telnum: String,
    extnum: String,

    finishDate: String,
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
        let date = new Date();
        return(date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear() + ' ' + (date.getHours() + ':' + date.getMinutes()));
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

        res.json(ticketsDocs.reverse())
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

app.post('/mongooseSearchbyTicketNumber', bodyParser.json(), function(req, res){
    console.log('req.body', req.body);
    TicketModel.findOne({ticketNumber: req.body.ticketNumber}, function (err, taskDocs) {
        if (err) return next (err);
        console.log(taskDocs);
        res.json(taskDocs)
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
        'body.finishDate:',req.body.finishDate
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
            finishDate: req.body.finishDate,
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
    let currnetDateTime = getCurrnetDateTime();
    let resJson = {
        ticketNumber: randomTicketNumber,
        currnetDateTime: currnetDateTime,
        status: 200
    };
    TicketModel.create(
        {
            firstname: req.body.firstname,
            lasname: req.body.lastname,
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

            finishDate: '',
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
        .catch(err => {
            console.error(err)
        })
});

///



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
