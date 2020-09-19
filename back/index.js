const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const log = require('electron-log');

//setup express

const app = express();
app.use(express.json());
app.use(cors());

//use this to change port (5000 for testing)

const PORT = 5000;
log.info('index.js is working');

app.listen(PORT, () => log.info(`The server has started on port: ${PORT}`));

mongoose.connect("mongodb+srv://critanaro:babLTAy1Y5a0OEQS@main.w3oxl.mongodb.net/test?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    },).then(()=> log.info("Mongodb connected")).catch(err => log.info("dang" + err));

app.use("/users", require("./routes/userRouter"))
   