

const fs = require('fs');
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();
require('dotenv').config();
var i = require("ip");
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');
app.use(cors())
const uid = require('uid');

class usersRepository {
    constructor(filename) {
        // verificam daca s-a specificat un nume de fisier
        if (!filename) {
            throw new Error('Eroare: Nu ai specificat un nume de fisier.');
        }
        // salvam numele fisierului pe "this" ca sa fie accesibil in toate functiile de mai jos.
        this.filename = filename;
        
        try {
            fs.accessSync(this.filename); //daca fisierul exista deja
        } catch (err) {
            fs.writeFileSync(this.filename, '[]');//daca nu creez unul
        }
    }

    // citeste si returneaza toate datele din fisier
    async getAll() {
        return JSON.parse(
            await fs.promises.readFile(this.filename, {
                encoding: 'utf8'
            })
        );
    }

    // scrie un array intr-un fisier
    async writeAll(users) {
        await fs.promises.writeFile(
            this.filename,
            JSON.stringify(users, null, 2)
        );

    }

    // Creaza un nou user si apeleaza functia pentru scrierea in fisier
    async addUser(user) {

        user.id = uid(10);
        user.score = 0;
        user.date = [];
        user.attempts = 0;
        let now = new Date();
        user.lastDate = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");//data de la ultima logare
        user.ip = i.address(); //adresa ip de pe care s a logat
        user.visited = 1;//nr de vizite ale site ului
        user.scoreDate = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT"); //data cand a obtinut scorul
        user.deleteScore = 0;
        // citim din fisier lista de utilizatori deja existente
        let users = await this.getAll();

        // adaugam utilizatorul creat in array
        users.push(user);
        await this.writeAll(users);
    }

    async getById(id) {
        const animale = await this.getAll();
        return animale.find(record => record.id === id);
    }

    async deleteUser(id) {
        let users = await this.getAll();
        // eliminam din array elementul cu id-ul primit ca parametru
        users = users.filter(user => user.id !== id);
        await this.writeAll(users);
        return users;
    }

    async deleteScore(id) { //marchez cu 1 scorul sters pentru a nu mai fi afisat
        let users = await this.getAll();
        users = users.map(u => {
            if (u.id === id)
                u.deleteScore = 1;
            return u
        });
        await this.writeAll(users);
        return users;
    }

    async resetScore(id) {//marchez cu 0 scorul resetat 

        let users = await this.getAll();

        users = users.map(u => {
            if (u.id === id)
                u.score = 0;
            return u
        });
        await this.writeAll(users);
        return users;
    }

    async UpdateScore(newUser) { //in cazul in care utilizatorul are un scor mai mare decat cel precedent il actualizez

        let users = await this.getAll();

        users = users.map((user) => {
            if (user.id === newUser.id && user.score < newUser.score) {
                user.score = newUser.score;
                let now = new Date();
                user.lastDate = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");//marchez data
                return user;
            }
            return user;
        })
        await this.writeAll(users);
        return users;
    }

    async UpdateVisits(newUser) { //cresc nr de vizite ale site ului

        let users = await this.getAll();

        users = users.map((user) => {
            if (user.username === newUser.username) {
                user.visited++;
                return user;
            }
            return user;
        })
        await this.writeAll(users);
        return users;
    }




}


module.exports = { usersRepository }