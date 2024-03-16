const {SerialPort} = require("serialport");
const {ReadlineParser} = require("@serialport/parser-readline");
const {Server, Socket} = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app)
const io = new Server(server);

app.use(express.json())

app.use("/public", express.static('public'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html")
})

app.get("/getData", (req, res) => {
    let result = {
        "device": "deviceA",
        "suhu": Math.floor(Math.random() * (100 - 0 + 1) + 0)
    }

    let result2 = {
        "device": "deviceB",
        "suhu": Math.floor(Math.random() * (100 - 0 + 1) + 0)
    }
    res.status(200).json(result)
    io.emit("data", result)
    io.emit("data", result2)
})

app.get("/receiveData", (req, res) => {

    try {
        let result = {
            "device": req.query.device,
            // "suhu": req.query.suhu,
            // "valueA": req.query.valueA,
            // "valueN": req.query.valueN
            "suhu": Math.floor(Math.random() * (100 - 0 + 1) + 0),
            "valueA": Math.floor(Math.random() * (100 - 0 + 1) + 0),
            "valueN": Math.floor(Math.random() * (100 - 0 + 1) + 0)
        }
        
        res.status(200).json({"message": "Data received"})
    
        io.emit("data", result)
        
    } catch (error) {
        res.status(200).json({"status": 401, "message": "Unauthtorized"})
    }

})

io.on("connection", (socket) => {
    console.log("connected..")
    socket.on("disconnect", () => {
        console.log("disconnected..");
    })
})

server.listen(5000, () => {
    console.log("server running..");
})
