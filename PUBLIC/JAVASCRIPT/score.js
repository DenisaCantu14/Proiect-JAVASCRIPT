// disparitia divului ce contine clasamentul
let closeRanking = document.querySelectorAll(".close")[3];
closeRanking.close = document.getElementById('ranking');
close = function (event) {  // setez displayul none 
    event.currentTarget.close.style.display = 'none';
 }
closeRanking.addEventListener("click", close);

//afisarea divului ce contine clasamentul
let ranking = document.getElementById("clasament");
ranking.afisare = document.getElementById("ranking");
afisare = function (event) {  
    event.currentTarget.afisare.style.display = 'block';
 }

ranking.addEventListener("click", afisare);
ranking.addEventListener("click", afiseazaUtilizatori); //la fiecare click preia lista de utilizatori si afiseaza clasamentul



async function afiseazaUtilizatori() { //afisez clasamentul utilizatorilor
 
    let usersArray = await verify('http://localhost:3000/users-list');
 
    container.innerHTML = '';
    usersArray = usersArray.filter(user => user.deleteScore==0);
    let utilizatori =usersArray;
    
    //filtrarea utilizatorilor
    const filterBy = document.getElementById('sort').value;
    if (filterBy == ">10000") { utilizatori = usersArray.filter(user => parseInt(user.score) > 10000); }
    if (filterBy === '>500000')
       utilizatori = usersArray.filter(user => user.score > 500000);
    if (filterBy === '>1000000')
       utilizatori = usersArray.filter(user => user.score > 1000000);
    if (filterBy === 'Descending' | filterBy == "Top 10") {
       function GetSortOrder(prop) {
          return function (a, b) {
             if (parseInt(a[prop]) > parseInt(b[prop])) {
                return -1;
             } else if (parseInt(a[prop]) < parseInt(b[prop])) {
                return 1;
             }
             return 0;
          }
       }
       utilizatori.sort(GetSortOrder("score"));
 
    }
    if (filterBy == "Top 10") { utilizatori = utilizatori.slice(0, 10)}
    //ii afizez in clasament
    let current = 1;
    utilizatori.forEach(user => {
       const tempUser = `<div class="item" data-id=${user.id}>
         <h2 class="nume">${current}. Name: ${user.username}</h2>
         <h3>Score: ${user.score}</h3>
         <h3>Data: ${user.scoreDate}</h3>
         <button class="D" "${user.username}"> Delete</button>
         <button class="R" > Reset</button>`
 
       container.insertAdjacentHTML("beforeend", tempUser);
 
       current++;
    });
    let deleteArr = document.getElementsByClassName("D"); 
  
    for (let i = 0; i < deleteArr.length; i++) 
    {
        deleteArr[i].addEventListener("click", async function () //la fiecare click pe butonul delete dispare scorul utilizatorului respectiv
         { 
          
            let id = deleteArr[i].parentElement.dataset.id;
            let URL = "http://localhost:3000/deleteScore/" + id;
            let users = await del(URL);
          
            afiseazaUtilizatori(users);
        })
    } 

    let resetArr = document.getElementsByClassName("R");
    for (let i = 0; i < resetArr.length; i++) 
    {
        resetArr[i].addEventListener("click", async function ()  //la fiecare click pe butonul reset se reseteaza scorul utilizatorului respectiv
         { 
            let id = resetArr[i].parentElement.dataset.id;
            let URL = "http://localhost:3000/reset/" + id;
            let users = await update(URL);
            afiseazaUtilizatori(users);
        })
    } 
 
 
 }
 document.getElementById('filter').addEventListener('click', afiseazaUtilizatori);


async function update(url = '') { //actualizez informatiile despre scor daca a fost resetat
    const response = await fetch(url, {
        method: 'PUT',
        headers:
        {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },

    });
    return response.json();
}

async function del(url = '') { //actualizez informatiile despre scor daca a fost sters
   
   const response = await fetch(url, {
      method: 'DELETE',
   });
   return response.json();
}
