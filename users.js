const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();
require('dotenv').config();
var i = require("ip");
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('PUBLIC'))
app.use(express.static('CSS'))
app.use(express.static('HTML'))
const r = require('./fisier.js').usersRepository //import din fisierul fisier.js

repo = new r('UtilizatoriFisier.json');

const port = 3000;
const uid = require('uid');

app.get('/users-list', async (req, res) => { //returnez toata lista de utilizatori
    let users = await repo.getAll();

    res.send(users);
});

app.post('/adauga-user', async (req, res) => { //adaug in fisier un nou utlizator
    const userData = req.body;
    await repo.addUser(userData);
    let users = await repo.getAll();
    res.statusCode = 201;
    res.send(users);
});



app.delete('/sterge-user/:id', async (req, res) => { //sterg un utilizator dupa id

    let users = await repo.deleteUser(req.params.id);

    res.send(users);
});

app.delete('/deleteScore/:id', async (req, res) => { //sterg scorul cand se apasa pe butonul delete
    let users = await repo.deleteScore(req.params.id);

    res.send(users);
});

app.put('/reset/:id', async (req, res) => { //resetez scorul cand se apasa pe butonul reset
    let users = await repo.resetScore(req.params.id);
    res.send(users);
})
app.put('/updateScore', async (req, res) => { //cand castiga un nivel, se actualizeaza scorul
    const newUser = req.body;
    let users = await repo.UpdateScore(newUser);
    res.send(users);

});
app.put('/updateVisits', async (req, res) => { //marchez pt fiecare utilizator de cate ori a vizitat site ul
    const newUser = req.body;
    let users = await repo.UpdateVisits(newUser);
    res.send(users);

});
app.post('/login', async (req, res) => { //functie pentru conectare laun cont deja existent
    const info = req.body;
    const users = await repo.getAll(); //retin toata lista de utilizatori
    let username = info.username;
    let password = info.password;
    let usedUsername = false;
    let usedPassword = false;
    let dates, attempts, email, ip, lastDate, visited;
    users.forEach(user => {
        if (user.username === username && user.password === password) { //daca date introduse de utilizator corespund unui cont
            usedUsername = true;
            usedPassword = true;
            user.ip = i.address(); //memorez adresa ip de pe care s-a logat
            ip = user.ip;
            let now = new Date(); //memorez data in care s a logat
            user.lastDate = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");

            lastDate = user.lastDate;
            user.visited++; //cresc nr de vizitari ale site ului
            visited = user.visited;

        }

        if (user.username === username) { //daca usernameul corespunde dar parola nu
            usedUsername = true;
            dates = user.date;
            attempts = user.attempts; //memorez cate incercari nereusite au fost
            email = user.email;
        }

    });
    if (usedUsername == true && usedPassword == true) { //daca si parola si username ul sunt corecte
        const u = {
            username,
            ip,
            lastDate,
            visited,
            "status": 202 //status:created

        }
        res.statusCode = 202;
        res.send(u)
    }
    else {
        if (usedUsername == false) //daca username ul este gresit
            res.sendStatus(404); //status:not found
        else { //parola e gresita
            currentDate = new Date();
            let i = 0;
            let nr;
            if (dates.length)
                nr = Date.parse(dates[i])
            while (dates.length > 0 && currentDate.getTime() - nr >= 3 * 60 * 1000) {//pastrez in vectorul dates doar datele in care au fost marcate logari esuate in interval de 3 minute
                dates.splice(i, 1);
                nr = Date.parse(dates[i])
            }
            dates.push(currentDate); //adaug si data de la ultima logare esuata
            attempts = dates.length; //nr de incercari esuate
            if (attempts >= 5) { //daca nr e mai mare decat 5
                res.sendStatus(423) //status:locked
                dates = [];  //resetez datele
                attepmts = 0;
                trimitEmail(email, username); //apelez funtia de trimitere mail catre utlizator pentru a-l informa
            }
            else { //daca nu s-au depasit 5 incercari
                const nr = { "value": (5 - attempts) };
                res.send(nr) //trimit nr de incercari ramase
            }

            users.forEach(user => {
                if (user.username === username) {
                    user.date = dates;
                    user.attempts = attempts; //memoerez datele despre incercarile esuate actualizate
                }
            });
        }
    }
    repo.writeAll(users); //le pun in fisier 
});

app.get('/index.html/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/HTML/joc.html/', function (req, res) {
    res.sendFile(__dirname + '/HTML/joc.html');
});

app.get('*', function (req, res) { //pagina pt eroarea 404
    res.status(404).sendFile(__dirname + '/HTML/error.html');
});

function trimitEmail(email, username) {//funtia pentru trimiterea mailului

    let transporter = nodemailer.createTransport
        ({
            service: 'gmail',
            auth: {
                user: "trytoescape06@gmail.com",
                pass: "escape9000"
            }
        });
    let mailOptions = {
        from: "trytoescape06@gmail.com",
        to: email,
        subject: "Your account is temporarily locked",
        text: "Hi " + username + ",\n" + "We've locked your account because you have tried to log in multiple times. It will be available after 2 hours. If that was not you, please contact us and will we offer our help.\n\n\n" +
            "Best,\n" + "The TryToEscape Team"
    };
    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log("Error occurs")
        }
        else console.log("Email sent")
    });

}
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))