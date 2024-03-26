const {SerialPort} = require("serialport");
const {ReadlineParser} = require("@serialport/parser-readline");
const {Server, Socket} = require("socket.io");
const http = require("http");
const express = require("express");
const mysql = require("mysql")

// Connection To Database
const db = mysql.createConnection({
    host : "yourhost",
    database: "yourdb",
    user : "youruser",
    password : "yourpass" ,

})

const app = express();
const server = http.createServer(app)
const io = new Server(server);

db.connect((err) => {
    if (err) throw err
    console.log("database connected...");

    app.use(express.json())

    app.use("/public", express.static('public'));

    app.get("/", (req, res) => {
        res.sendFile(__dirname + "/views/index.html")
    })

    app.get("/receiveData", (req, res) => {

        try {
            let result = {
                "perusahaan": req.query.perusahaan,
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

    // Route Handling & Get Data
    // app.get("/", (req, res) => {
    //     // Get Data From Database
    //     const sql = "SELECT * FROM user";
    //     db.query(sql, (err, result) => {
    //         const users = JSON.parse(JSON.stringify(result));
    //         res.render("index", { users:users, titleDocument : "CRUD NODE.JS", titleTable : "DATA SISWA" })
    //     });
    // });

    // // Inser Data
    // app.post("/tambah", (req, res,) => {
    //     const insertSql = `INSERT INTO user (nama, kelas) VALUES('${req.body.nama}', '${req.body.kelas}');`;
    //     db.query(insertSql, (err, result) => {
    //         if (err) throw err
    //         res.redirect("/");
    //     })
    // });
});

io.on("connection", (socket) => {
    console.log("connected..")
    socket.on("disconnect", () => {
        console.log("disconnected..");
    })
})

server.listen(5000, () => {
    console.log("server running..");
})
