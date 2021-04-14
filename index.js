const express = require('express')
const app = express()
const port = 5003
const cors = require('cors');
const fs = require('fs-extra');
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID
const fileUpload = require('express-fileupload')
require('dotenv').config()



app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(express.static('doctors'))
app.use(fileUpload())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x4chh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const appointmentCollection = client.db("doctorsPortal").collection("appointments");
  const doctorCollection = client.db("doctorsPortal").collection("doctors");
 
  
app.post('/addAppointment',(req,res)=> {
    const appointment = req.body;
    console.log(appointment)
    appointmentCollection.insertOne(appointment)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
})



app.post('/appointmentsByDate', (req,res)=>{

    const date = req.body
    console.log(date.date)
    appointmentCollection.find({date: date.date})
    .toArray((err, documents)=>{
        res.send(documents)
    })
})
app.get('/appointments', (req,res)=>{
  appointmentCollection.find()
 .toArray((err, documents)=>{

  res.send(documents)
  console.log('documents', documents)
 })

})
 app.post('/addADoctor', (req,res)=>{
 const file = req.files.file
 const name = req.body.name
 const email = req.body.email
console.log(file, email, name)
const newImg = file.data
const encImg = newImg.toString('base64')

var image = {
  contentType: file.mimetype,
  size: file.size,
  img: Buffer.from(encImg, 'base64')
};
doctorCollection.insertOne({ name, email, image })
            .then(result => {
               
               res.send(result.insertedCount > 0);
               
                
            })

 })

app.get('/doctors', (req, res) => {
  doctorCollection.find({})
      .toArray((err, documents) => {
          res.send(documents);
          console.log(documents)
      })
});

app.post('/isDoctor', (req, res) => {
  const email = req.body.email;
  console.log(email)
  doctorCollection.find({ email: email })
      .toArray((err, doctors) => {
          res.send(doctors.length > 0);
      })
})

})















app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.listen(process.env.PORT || port)