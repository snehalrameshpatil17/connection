const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
 

//connecting to react

const cors=require('cors')
app.use(cors())


// Connect to MongoDB
const mongoDB = 'mongodb://127.0.0.1/myDB';
mongoose.connect(mongoDB)
    .then(() => {
        console.log('DB connection is successful..');
        
    })
    .catch(err => console.error("MongoDB connection error:", err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, "MongoDB connection error"));

const DoctorSchema = mongoose.Schema({
    id: Number,
    name: String,
    specification: String,
    phone_num: Number,
    location: String
});

const DoctorTable = mongoose.model('doctor', DoctorSchema);

app.post('/adddoctor', (req, res) => {
    const newDoctor = new DoctorTable({
        id: req.body.id,
        name: req.body.name,
        specification: req.body.specification,
        phone_num: req.body.phone_num,
        location: req.body.location
    });

    newDoctor.save()
        .then(data => {
            res.status(201).send({ message: "Doctor record added successfully", data });
        })
        .catch(err => {
            res.status(400).send({ message: "Error adding doctor record", error: err });
        });
});


// Update doctor information by ID
app.put('/updatedoctor/:id', async (req, res) => {
    try {
        const doctorId = req.params.id;
        const updatedData = {
            name: req.body.name,
            specification: req.body.specification,
            phone_num: req.body.phone_num,
            location: req.body.location
        };

        const updatedDoctor = await DoctorTable.findOneAndUpdate(
            { id: doctorId },
            { $set: updatedData },
            { new: true, runValidators: true }
        );

        if (!updatedDoctor) {
            return res.status(404).send({ message: "Doctor not found" });
        }

        res.status(200).send({ message: "Doctor record updated successfully", data: updatedDoctor });
    } catch (err) {
        res.status(400).send({ message: "Error updating doctor record", error: err.message });
    }
});

// Delete doctor information by ID
app.delete('/deletedoctor/:id', async (req, res) => {
    try {
        const doctorId = parseInt(req.params.id, 10);  // Parse id as an integer

        const deletedDoctor = await DoctorTable.findOneAndDelete({ id: doctorId });

        if (!deletedDoctor) {
            return res.status(404).send({ message: "Doctor not found" });
        }

        res.status(200).send({ message: "Doctor record deleted successfully", data: deletedDoctor });
    } catch (err) {
        res.status(500).send({ message: "Error deleting doctor record", error: err.message });
    }
});



// Get all doctor info
app.get('/docinfo', (req, res) => {
    DoctorTable.find()
        .then(data => res.status(200).send(data))
        .catch(err => res.status(400).send(err));
});


const PORT = 8001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));