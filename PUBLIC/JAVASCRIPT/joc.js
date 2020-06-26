let score = 0; //setez scorul initial ca 0
loadPage = function (event) {
    afiseazaMesaj();
    let setari = JSON.parse(localStorage.getItem('setari')) || [];
    let imgS = document.createElement('img'); //imaginea jucatorului
    let bkMusic = document.createElement('audio'); //muzica de fundal
    let backgr = document.querySelector('body');  
    
    if (setari.length != 0) { //daca utilizatorul curent a facut modificari
        
        backgr.style.backgroundColor = setari[0].background;
        bkMusic.src = setari[0].melody;
        imgS.src = setari[0].character;
        bkMusic.autoplay = true;
        bkMusic.loop = true;
       
    }
    let hearts = ['&#128155;', '&#128155;', '&#128155;'] //salvez 3 simboluri pt vieti
    let vieti = [];
    vieti = vieti.concat(hearts);
    let heart = document.querySelectorAll('.life');
    fill = function () { //refisez pe ecran inimile la inceperea unui nivel
        for (let i = 0; i < 3; i++)
            heart[i].innerHTML = "";
        for (let i = 0; i < vieti.length; i++)
            heart[i].innerHTML = vieti[i];
    }
    fill();
    let sec = 59;
    let ok = 1; //marcheaza trecerea unui minut
    let t = 0; // textul care indica timpul
    let min2 = 1;
    function setInter() {//afiseaza pe ecarnul timpul
        if (min2) {
            t = '02:00';
            min2 = 0;
        }
        else {
            if (sec == 0) {
                ok = 0;
                sec = 59;
            }
            if (ok) {
                t = '01:' + sec;
                sec--;
            }
            else {
                t = '00:' + sec;
                sec--;
            }
        }

        document.getElementById("timer").innerHTML = t; //afisez pe ecran timpul

    }
    document.querySelector('body').style.backgroundImage = "url('')"; //sterg imaginea de fundal
    let timer = document.getElementById('timer'); //divul in care se afiseaza timpul
    let message = document.getElementById('message'); //divul in care se afiseaza prezicerea de la cerinta 7
    timer.style.display = 'block';
    message.style.display = 'block';
    let currentLevel = maze1; //level ul curent
    let poz = 0; //pozitia in vector
    let levels = [maze1, maze2, maze3, maze4, maze5, maze6, maze7, maze8, maze9, maze10];
    let body = document.querySelector('body');
    let joc = document.getElementById('joc');
    let tableEl = document.querySelector('table');

    const clearTable = (tableEl) => {  //sterge labirintul pt a fi creat unul nou
        while (tableEl.firstChild) {
            tableEl.removeChild(tableEl.firstChild);
        }
        sec = 59; //timpul se restareteaza
        stop() // se apeleaza functia pt clearInterval
        stopSetTimeOut();
    };

    changeScore = async function () { //functie care reactualizeaza scorul daca acesta este mai mare decat cel deja existent
        const conturi = JSON.parse(localStorage.getItem('items')) || [];
        const cont = conturi[0];
        let URL = "http://localhost:3000/lista-users";
        const UsersList = await verify(URL);
        let id = 0;
        UsersList.forEach(user => {//caut id ul utilizatorului curent
            if (user.username === cont.username && user.password === cont.password)
                id = user.id;
        });
        const newUser =
         {
            "id":id,
            "score":score
         }

        URL = "http://localhost:3000/updateScore";
        const newUsersList = await update(URL, newUser); //fac update scorului
        
    }

    loseOneLife=function()
    {vieti.pop();
    
        if (vieti.length != 0)
            fill()
        else
            lose();
        }
    //functie apelata cand pierde
    lose = function () {
        //se reactualizeaza scorul
            changeScore();
            fill();
            //dispare divul cu timpul
            timer.style.display = 'none';
            message.style.display = 'none';
            document.querySelector('#hearts').style.display='none';
            bkMusic.pause(); //muzica de fundal se opreste
            let looseP = document.createElement('section');
            let h1 = document.createElement('h1');
            let button = document.createElement('button');
            let imagine = document.createElement('img');
            let audio = document.createElement('audio');
            audio.src = "../AUDIO/loseEfect.mp3";
            audio.autoplay = true;//se da play efectului de lose
            imagine.src = "https://www.pinclipart.com/picdir/big/409-4099260_free-minion-cliparts-download-free-clip-art-free.png";
            imagine.style.width = "130px";
            imagine.style.height = "180px";
            clearTable(tableEl); //dispare labirintul
            mover.style.display = 'none';
            h1.textContent = 'GAME OVER';
            button.textContent = 'Restart';
            button.setAttribute('onclick', 'window.location.reload();');
            button.setAttribute('type', 'button');
            body.appendChild(looseP);
            looseP.appendChild(h1);
            looseP.appendChild(button);
            looseP.appendChild(document.createElement('br'));
            looseP.appendChild(imagine);
            looseP.appendChild(audio);
            imagine.style.top = '100px';
            body.style.justifyContent = 'center';
        
    };
//se apeleaza cand castiga
    let winLvl = () => {
        vieti = []; 
        fill();//se reactualizeaza vietile
        const secunde = timer.innerHTML;
        const timp_ramas = parseInt(secunde[1]) * 60 + parseInt(secunde[3] + secunde[4])
        score = score + timp_ramas * 100 * (poz + 1); //calculez scorul
        clearTable(tableEl); //dispare labirintul
        bkMusic.pause();
        let audio = document.createElement('audio');
        audio.autoplay = true; //se  da play la efectul de win
        timer.style.display = 'none';
        message.style.display = 'none';
        player.style.display = 'none';
        let winP = document.createElement('section');
        let button = document.createElement('button');
        let h1 = document.createElement('h1');
        let imagine = document.createElement('img');
        let video = document.createElement('video');
        if (poz < levels.length) { //daca nu s a ajuns la finalul jocului
            button.textContent = 'Next Level'; //se creaza un buton pt next level ce are setat un eventListener
            button.addEventListener("click", function (event) {
                player.style.display = 'block';
                winP.style.display = 'none';
                timer.style.display = 'block';
                message.style.display = 'block';
                currentLevel = levels[poz]
                mover.style.left = '10px';
                mover.style.top = '35px';
                audio.pause();
                audio.currentTime = 0;
                drawMaze(currentLevel); //se afiseaza urmatorul labirint
                vieti = vieti.concat(hearts);
                fill();
                bkMusic.play() = true;


            });
            imagine.src = "../IMAGINI/img.png"; //apare o imagine specifica si un audio spacific
            imagine.style.width = "280px";
            imagine.style.height = "250px";
            audio.src = "../AUDIO/audio.mp3";

        }
        else { //daca s au terminat nivelele
            button.textContent = 'Restart'; //se creaza un buton pt restart
            button.setAttribute('onclick', 'window.location.reload();');
            video.src = "../VIDEO/video.mp4"; //apare un video
            video.autoplay = true;
            video.style.width = "500px";
            video.style.height = "290px";
        }
        button.setAttribute('type', 'button');

        h1.textContent = 'CONGRATS!';
        body.appendChild(winP);
        winP.appendChild(h1);
        winP.appendChild(button);
        winP.appendChild(document.createElement('br'));
        if (poz < levels.length) {//daca nu s a terminat ultimul nivel afisez audio si imaginea
            winP.appendChild(imagine);
            winP.appendChild(audio);
        }
        else
            winP.appendChild(video);//else afisez videoul

    }

    let mover = document.createElement('div'); //designul pt jucator
    imgS.style.width = "10px";
    imgS.style.height = "10px";
    mover.appendChild(imgS);
    let inter = 0;
    let timeout = 0;
    const drawMaze = (maze) => { //functie pt desenatul labirintului


        joc.appendChild(mover); // inserez jucatorul
        mover.style.left = '10px';
        mover.style.top = '35px';
        mover.setAttribute('id', 'player');

        for (let i = 0; i < currentLevel.length; i++) {

            let rowEl = document.createElement('tr');

            tableEl.appendChild(rowEl);

            for (let x = 0; x < currentLevel[i].length; x++) {
                let tdEl = document.createElement('td');
                rowEl.appendChild(tdEl)
                tdEl.innerHTML = maze[i].charAt(x);

                switch (maze[i].charAt(x)) { //atribui fiecarui caracter o clasa specifica  pt a le modifica in css
                    case '#':
                        {
                            tdEl.setAttribute('class', 'wall');
                            tdEl.innerHTML = "";
                        }
                        break;
                    case '.':
                        {
                            tdEl.setAttribute('class', 'freespace');
                            tdEl.innerHTML = "";
                        }
                        break;
                    case '_':
                        {
                            tdEl.setAttribute('id', 'start');
                            tdEl.innerHTML = "";
                        }
                        break;
                    case '!':
                        {
                            tdEl.setAttribute('id', 'win');
                            tdEl.innerHTML = "";
                            let imgF = document.createElement('img');
                            imgF.src = "https://www.pinclipart.com/picdir/big/29-291088_banana-png-image-free-picture-downloads-bananas-banana.png";
                            imgF.style.width = "13px";
                            imgF.style.height = "13px";
                            tdEl.appendChild(imgF);
                        }
                        break;

                }

            }

        }
        min2 = 1;
        inter = setInterval(setInter, 1000); //functia care afiseaza timpul pe ecran
        timeout = setTimeout(lose, 120000);//daca trec 2 minute si nivelul nu e gata, jucatorul pierde
    }

    drawMaze(currentLevel);



    window.addEventListener('keydown', event => { //functie pt deplasarea jucatorului
        switch (event.key.toLowerCase()) {
            case 'arrowup':
                mover.style.top = parseInt(mover.style.top) - 5 + 'px';
                break;
            case 'arrowleft':
                mover.style.left = parseInt(mover.style.left) - 5 + 'px';
                break;
            case 'arrowdown':
                mover.style.top = parseInt(mover.style.top) + 5 + 'px';

                break;
            case 'arrowright':

                mover.style.left = parseInt(mover.style.left) + 5 + 'px';
                break;

        }

        let pos = mover.getBoundingClientRect();
        let win = document.querySelector('#win');
        let wins = win.getBoundingClientRect();
        let walls = document.querySelectorAll('.wall');

        for (let wall of walls) {
            let wowWalls = wall.getBoundingClientRect();
            // verific daca a avut vreo coleziune 
            if (pos.x < wowWalls.x + wowWalls.width && pos.x + pos.width > wowWalls.x && pos.y < wowWalls.y + wowWalls.height && pos.y + pos.height > wowWalls.y) {
                {
                    loseOneLife();
                    break;
                }
                //daca a ajuns la final
            } else if (pos.x < wins.x + wins.width && pos.x + pos.width > wins.x && pos.y < wins.y + wins.height && pos.y + pos.height > wins.y) {
                poz++;
                winLvl();
                break;


            }
            if (pos.x == 0) {
                lose();
            }
        }

    });

    function stop() {
        clearInterval(inter);
    }
    function stopSetTimeOut() {
        clearTimeout(timeout);
    }
    let left = 0;
    const yellowHearts = document.querySelector("#hearts");
    window.addEventListener('keydown', event => {


        if (event.key.toLowerCase() == 'escape') {

            const pause = document.querySelector('#pause');
            //blurez fundalul
            pause.style.display = 'block'; 
            tableEl.style.filter = "blur(11px)";
            timer.style.filter = "blur(11px)";
            message.style.filter = "blur(11px)";
            mover.style.display = "none";
            yellowHearts.style.filter = "blur(11px)";
            stop();//opresc trecerea timpului
            stopSetTimeOut();
            let timeLeft = timer.innerHTML;
            const m = timeLeft.substr(0, 2);
            const s = timeLeft.substr(3, 2);
            left = parseInt((m * 60 + s) * 1000); //calculez cat a ramas

        }
    });
    document.querySelector('#resume').addEventListener("click", event => {
        const pause = document.querySelector('#pause');
        //fundalul revine la normal
        pause.style.display = 'none';
        tableEl.style.filter = "blur(0px)";
        timer.style.filter = "blur(0px)";
        message.style.filter = "blur(0px)";
        mover.style.display = "block";
        yellowHearts.style.filter = "blur(0px)";
        //pornesc cronometrul de unde a ramas
        inter = setInterval(setInter, 1000);
        timeout = setTimeout(lose, left);
    });
    document.querySelector('#restart').setAttribute('onclick', 'window.location.reload();');//repornesc jocul
    document.querySelector('#settings').addEventListener("click", event => {//apare formularul pentru setari
        document.getElementById("setari").style.display = 'block';
        const pause = document.querySelector('#pause');
        pause.style.display = 'none';


    });
    //pt inchiderea optiunilor pt setari
    document.querySelector(".close").addEventListener("click", event => {  document.getElementById("setari").style.display = 'none';
    const pause = document.querySelector('#pause');
    pause.style.display = 'block';});
    document.getElementById('save').addEventListener("click", event => {
        let modif =
        {
            "background": '',
            "melody": "",
            "character": ""
        }
        let saveBtn = document.getElementById('#save');

        bkMusic.autoplay = true;
        bkMusic.loop = true;
      
        let color = document.getElementById('color').value; //setez culoarea de fundal
        switch (color) {
            case 'grey':
                {
                    backgr.style.backgroundColor = "grey";
                    modif.background = "grey";
                }
                break;
            case 'plum':
                {
                    backgr.style.backgroundColor = "plum";
                    modif.background = "plum";
                }
                break;
            case 'black':
                {
                    backgr.style.backgroundColor = "rgb(30, 38, 47)";
                    modif.background = "rgb(30, 38, 47)";
                }
                break;
            case 'pink':
                {
                    backgr.style.backgroundColor = "rgb(255, 128, 170)";
                    modif.background = "rgb(255, 128, 170)";
                }
                break;
            case 'blue':
                {
                    backgr.style.backgroundColor = "rgb(128, 255, 229)";
                    modif.background = "rgb(128, 255, 229)";
                }
                break;
            case 'random':
                {
                    let r = Math.floor(Math.random() * 256);
                    let g = Math.floor(Math.random() * 256);
                    let b = Math.floor(Math.random() * 256);
                    backgr.style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
                    modif.background = "rgb(" + r + "," + g + "," + b + ")";
                }

        }

        const melodies = document.querySelectorAll('input[name="melody"]');//setez melodia de fundal
        let melody;
        for (const current of melodies) {
            if (current.checked) {
                melody = current.value;
                break;
            }
        }
        if (melody) {
            switch (melody) {
                case 'melody1':
                    {
                        bkMusic.src = "../AUDIO/melody1.mp3";
                        modif.melody = "../AUDIO/melody1.mp3";
                    }
                    break;
                case 'melody2':
                    {
                        bkMusic.src = "../AUDIO/melody2.mp3";
                        modif.melody = "../AUDIO/melody2.mp3";
                    }
                    break;
                case 'melody3':
                    {
                        bkMusic.src = "../AUDIO/melody3.mp3";
                        modif.melody = "../AUDIO/melody3.mp3";
                    }
                    break;

            }
        }
        let characterOption = document.getElementById('character').value;//setez imaginea jucatorului
        if (characterOption == 'Stuart') {
            imgS.src = "../IMAGINI/1.png";
            modif.character = "../IMAGINI/1.png";
        }
        else {
            imgS.src = 'https://www.pinclipart.com/picdir/big/97-976108_face-clipart-minion-minion-avatar-png-download.png';
            modif.character = 'https://www.pinclipart.com/picdir/big/97-976108_face-clipart-minion-minion-avatar-png-download.png';
        }
        document.getElementById('setari').style.display = 'none';

        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Saved',
            showConfirmButton: false,
            timer: 1500

        })

        //adauga aceste noi date si in local storage
        setari = [];
        setari.push(modif);
        localStorage.removeItem('setari');
        localStorage.setItem('setari', JSON.stringify(setari));
        const pause = document.querySelector('#pause');
        pause.style.display = 'none';
        tableEl.style.filter = "blur(0px)";
        timer.style.filter = "blur(0px)";
        message.style.filter = "blur(0px)";
        mover.style.display = "block";
        yellowHearts.style.filter = "blur(0px)";
        inter = setInterval(setInter, 1000);
        timeout = setTimeout(lose, left);

    });

}

loadPage();
