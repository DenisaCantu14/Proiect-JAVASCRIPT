
// selectez butonul de log in si divul ce se va afisa la click
let logIn = document.getElementById('login');
logIn.afisare = document.getElementById('login_form');

// selectez butonul de sign up si divul ce se va afisa la click
let signUp = document.getElementById("sign");
signUp.afisare = document.getElementById("signUp");

// selectez butonul de setari si divul ce se va afisa la click
let yourAccount = document.getElementById("account");
yourAccount.afisare = document.getElementById("yourAccount");

// selectez butonul de ranking si divul ce se va afisa la click



//functia de afisare
afisare = function (event) {  //afisez divul corespunzator fiecarui buton
   event.currentTarget.afisare.style.display = 'block';
}
//apelez functia de afisare pt fiecare buton
logIn.addEventListener("click", afisare);
signUp.addEventListener("click", afisare);
yourAccount.addEventListener("click", afisare);

//pun in vectorul conturi datele din local storage
let conturi = JSON.parse(localStorage.getItem('items')) || [];
// selectez tagul h2 in care pun mesajul "hello " + username
const helloUser = document.querySelector('h2');
//verific daca este vreun utilizator logat
async function updateVisits() {
   const info = {
      "username": conturi[0].username,
      "visited": conturi[0].visited,
      "ip": conturi[0].ip,
      "lastDate": new Date()
   }
   let URL = "http://localhost:3000/updateVisits";
   let response = await update(URL, info);
}
yourAccount.style.display = 'none';
if (conturi.length) { //daca da, nu mai afisez butoanele de log in si sign up
   logIn.style.display = 'none';
   signUp.style.display = 'none';
   yourAccount.style.display = 'inline';
   helloUser.innerHTML = "Hello " + conturi[0].username + ", last time you have logged in from " + conturi[0].ip + " on " + conturi[0].lastDate + ". You have visited this site for " + (conturi[0].visited + 1) + " times.";
   conturi[0].visited++;
   localStorage.setItem('items', JSON.stringify(conturi));
   updateVisits()
}

async function update(url = '', data = {}) {
   const response = await fetch(url, {
      method: 'PUT',
      headers:
      {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)

   });
   return response.json();
}
// butonul play ce duce catre joc
document.getElementById('play').addEventListener('click', function (e) {
   if (conturi.length == 0 || conturi[conturi.length - 1].isConnected == false) { //daca nu e logat nu poate accesa jocul 
      e.preventDefault();
      Swal.fire({
         icon: 'error',
         title: 'Oops...',
         text: 'You need to log in first!'
      })
   }

})
// butonul pt log in

conectare = async function (event) {
   event.preventDefault();
   const username = (this.querySelector('[name="uname"]')).value; //selectez username ul
   const password = (this.querySelector('[name="psw"]')).value; //selectez parola
   let info =
   {
      username,
      password
   }
   let URL = "http://localhost:3000/login";
   const response = await postData(URL, info);

   if (response.status == 404) //username ul nu fost gasit
      Swal.fire({
         icon: 'error',
         title: 'Oops...',
         text: 'Your username is introduced incorrect!',
      })
   else

      if (response["status"] == 202) {

         //daca sunt corecte

         //memorez intr un obiect datele 
         document.querySelector("#attemptsAllowed").innerHTML = "";
         const item =
         {
            username,
            "ip": response["ip"],
            "lastDate": response["lastDate"],
            "visited": response["visited"]
         }

         //adauga aceste noi date si in local storage
         conturi.push(item)

         localStorage.setItem('items', JSON.stringify(conturi));
         //ascund butoanle de log in si sign up
         logIn.style.display = 'none';
         signUp.style.display = 'none';
         yourAccount.style.display = 'inline';
         //afizez mesajul cu hello usename
         helloUser.innerHTML = "Hello " + conturi[0].username + ", last time you have logged into from " + conturi[0].ip + " on " + conturi[0].lastDate + ". You have visited this site for " + conturi[0].visited + " times.";
         // golesc inputurile
         this.reset();
         document.querySelector('#login_form').style.display = 'none';
         Swal.fire({
            position: 'center',
            icon: 'success',
            title: `Hello ${username}!`,
            showConfirmButton: false,
            timer: 1500
         })

      }
      else
         if (response.status == 423) { //daca s a depasit nr de incercari
            document.querySelector("#loginSubmit").style.display = "none";
            document.querySelector("#attemptsAllowed").innerHTML = ""
            setTimeout(function () { document.querySelector("#loginSubmit").style.display = "inline"; }, 7000); //pentru un anumit timp nu se mai poate accesa butonul de log in
         }
         else {

            document.querySelector("#attemptsAllowed").innerHTML = "You have left " + response["value"] + " attempts";//se fiseaza nr de incercari ramse
            Swal.fire({
               icon: 'error',
               title: 'Oops...',
               text: 'Your password is introduced incorrect!',
            })
         }
}


//apelez functia
const logare = document.querySelector("#loginBtn");
logare.addEventListener('submit', conectare);


// selectez butoanele de close si divurile ce se vor disparea la click
let closeLogin = document.querySelectorAll(".close")[0];
closeLogin.close = document.getElementById('login_form');
let closeSignup = document.querySelectorAll(".close")[1];
closeSignup.close = document.getElementById('signUp');
let closeYAccount = document.querySelectorAll(".close")[2];
closeYAccount.close = document.getElementById('yourAccount');


//functie pt close
close = function (event) {  // setez displayul none 
   event.currentTarget.close.style.display = 'none';
}
//apelez functia pt butoanele de close 
closeLogin.addEventListener("click", close);
closeSignup.addEventListener("click", close);
closeYAccount.addEventListener("click", close);
closeRanking.addEventListener("click", close);



const container = document.querySelector("#listaClasament");
const adaugaBtn = document.querySelector("#inregBtn");



// creez un cont nou
adaugaUser = async function (e) {
   e.preventDefault();
   let URL = "http://localhost:3000/users-list/";
   let u = await verify(URL);
   let username = document.querySelector('#uname').value;
   let email = document.querySelector("#email").value;
   let usedUsername = false;
   let usedEmail = false;  //verific daca nu mai este un user cu acelasi nume
   u.forEach(user => {
      if (user.username === username)
         usedUsername = true;
      if (user.email === email)
         usedEmail = true;
   })
   if (usedUsername == true && usedEmail == true) { //daca emailul si username ul deja exista
      Swal.fire({
         icon: 'error',
         title: 'Oops...',
         text: 'Your username and email already exist!',
      })
   }
   else
      if (usedUsername == true) { //daca usernameul deja exista
         Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Your username already exists!',
         })
      }
      else
         if (usedEmail == true) { //daca emailul deja exista
            Swal.fire({
               icon: 'error',
               title: 'Oops...',
               text: 'Your email already exists!',
            })
         }

         else //verific daca toate datele sunt valide 
            if (validatePassword() == false || validateRepeat() == false || validateEmail() == false || (document.querySelectorAll('input[name="gender"]'))[0].checked == false && document.querySelectorAll('input[name="gender"]')[1].checked == false) {
               Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Your information are incorrect!',
               })
            }
            else {//daca sunt ok
               //preiau informatille
               document.getElementById('signUp').style.display = 'none';
               let username = document.querySelector('#uname').value;
               let email = document.querySelector("#email").value;
               let password = document.querySelector("#psw").value;
               let genderBtn = document.querySelectorAll('input[name="gender"]');
               let gender = 'male';
               if (genderBtn[1].checked) {
                  gender = 'female';
               }
               const age = document.querySelector("#age").value;

               // creez un obiect nou cu datele selectate
               let newUser =
               {
                  username,
                  email,
                  password,
                  gender,
                  age
               }
//il adaug in fisier
               let newUsersList = await postData('http://localhost:3000/adauga-user', newUser)
               newUsersList.forEach(user => {
                  if (user.username === username)
                     newUser = user;
               });
               //il marchez ca logat in local storage
               const item =
               {
                  username,
                  "ip": newUser["ip"],
                  "lastDate": newUser["lastDate"],
                  "visited": newUser["visited"]
               }
               conturi.push(item)

               localStorage.setItem('items', JSON.stringify(conturi));
               logIn.style.display = 'none';
               signUp.style.display = 'none';
               yourAccount.style.display = 'inline';
               helloUser.innerHTML = `Hello ${conturi[conturi.length - 1].username}, you have logged in for the first time!`; //afisez in un mesaj cu datele utilizatorului  
               //golsesc inputurile
               this.reset();
               Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: `Hello ${username}!`,
                  showConfirmButton: false,
                  timer: 1500
               })
               afiseazaUtilizatori(newUsersList)
            }
}

adaugaBtn.addEventListener('submit', adaugaUser);


const disconnect = document.getElementById('disconnect');
//deconectare

deconectare = function () {
   logIn.style.display = 'inline'; //setez ca vizibile butoanele de logare
   signUp.style.display = 'inline';

   yourAccount.style.display = 'none'; //ascund setarile pt cont
   helloUser.innerHTML = "";
   conturi = [];
   yourAccount.afisare.style.display = 'none';
   localStorage.clear('items');


};
disconnect.addEventListener("click", deconectare);

const deleteBtn = document.getElementById('delete');

deleteBtn.addEventListener("click", async function () {
   document.querySelector("#msj").style.display = "block"; //se va afisa o intrebare

})
const no = document.getElementById('no'); //daca raspunsul este nu, nu se va sterge contul
no.addEventListener("click", async function () {
   document.querySelector("#msj").style.display = "none";

})
const yes = document.getElementById('yes');//se va sterge contul
yes.addEventListener("click", async function () {
   document.querySelector("#msj").style.display = "none";
   const conturi = JSON.parse(localStorage.getItem('items'));
   const cont = conturi[0]; //selecte contul curent
   let URL = "http://localhost:3000/users-list";
   const UsersList = await verify(URL);
   let id = 0;
   UsersList.forEach(user => { //caut id ul corespunzator
      if (user.username === cont.username)
         id = user.id;

   });
   URL = "http://localhost:3000/sterge-user/" + id;
   const newUsersList = await deleteUser(URL);//sterg contul
   deconectare(); //si il marchez ca si deconectat
   afiseazaUtilizatori();
   yourAccount.afisare.style.display = 'none';
   yourAccount.style.display = 'none'; //ascund setarile pt cont

});

const visibilityToggle = document.querySelectorAll('.visibility');

const input = document.querySelector('.input-container input');

//butoane pentru afisarea/ascunderea parolei
for (i = 0; i < 3; i++) {
   let v = visibilityToggle[i];
   visibilityToggle[i].addEventListener('click', function () {
      let input = v.previousElementSibling;

      if (input.type == 'password') {
         input.setAttribute('type', 'text');
         v.innerHTML = 'visibility';

      } else
         if (input.type == 'text') {

            input.setAttribute('type', 'password');
            v.innerHTML = 'visibility_off';
         }


   });
}