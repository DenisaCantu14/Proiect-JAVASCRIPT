// functia de validare email
function validateEmail() {
    var inputText = document.getElementById("email").value;
    var mailformat = /^[a-zA-Z0-9!#$&_*?^~-]+(\.[a-zA-Z0-9!#$&_*?^~-]+)*@([a-z0-9]+([a-z0-9-]*)\.)+[a-zA-Z]+$/;
    if (inputText.match(mailformat)) {
 
       { document.getElementById("email").style.color = "green"; return true; } //daca e corect scrisul va fi verde
 
    }
    else {
       { document.getElementById("email").style.color = "red"; return false; }// daca nu, va fi rosu
    }
 }
 document.getElementById("email").addEventListener("keydown", validateEmail);
 
 
 var Psw1Ok = document.createElement('p');//pt a insera un simbol ce arata daca parola e corecta sau nu
 document.getElementById("pswLabel").appendChild(Psw1Ok);
 // functia de validare parola
 function validatePassword() {
   var psw = document.getElementById("psw");
   var pswFormat = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!?$&% ])[a-zA-Z0-9!?$&% ]{8,}/;
    if (psw.value.match(pswFormat)) { Psw1Ok.innerHTML = '&#10004;'; return true; } 
    else { Psw1Ok.innerHTML = " &#10060;"; return false; }
 
 }
 document.getElementById("pswLabel").appendChild(Psw1Ok);
 
 var Psw2Ok = document.createElement('p');
 document.getElementById("pswRLabel").appendChild(Psw2Ok);
 // functia de validare pt repetarea parolei
 function validateRepeat() {
   var psw = document.getElementById("psw").value;
   var pswr = document.getElementById("pswr").value;
    if (psw != pswr) { Psw2Ok.innerHTML = '&#10060;'; return false; }
    else { Psw2Ok.innerHTML = "&#10004;"; return true; }
 }
 document.getElementById("psw").addEventListener("keyup", validatePassword);
 document.getElementById("psw").addEventListener("keyup", validateRepeat);
 document.getElementById("pswr").addEventListener("keyup", validateRepeat);
 