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
})
    .then(() => {console.log('mongodb has started')})
    .catch((err) => {console.log(err)});


mongoose.Promise = global.Promise;
let TicketsSchema = new mongoose.Schema({
    ticketNumber: Number,
    ticketDate: String,
    ticketPriority: String,
    status: Number,

    type: String,
    vendor: String,
    model: String,
    partNumber: String,
    problem: String,
    place: String,
    projectCode: String,

    firstname: String,
    lasname: String,
    familyname: String,
    email: String,
    telnum: String,
    extnum: String,

    finishDate: String,
    comment: String,
    serviceCentre: String,
    typeOfService: String,

});

let TicketModel = mongoose.model('tickets', TicketsSchema);

    //upload = multer(),
   // jsonParser = bodyParser.json();


app.get('/mongooseGetData', function(req, res, next){

    TicketModel.find(function (err, tasksDocs){
        if (err) return next (err);
        res.json(tasksDocs)
    })
});

app.post('/mongooseFind', bodyParser.json(), function(req, res){
    console.log('req.body', req.body);
    TicketModel.findById(req.body, function (err, taskDocs) {
        if (err) return next (err);
        console.log(taskDocs);
        res.json(taskDocs)
    })
});



let date = new Date();
console.log(date.getDate(), date.getMonth()+1, date.getFullYear());

function getRandomArbitary()
{
    return Math.random() * (9999 - 1) + 2000;
}
console.log('random number', parseInt(getRandomArbitary()))


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
