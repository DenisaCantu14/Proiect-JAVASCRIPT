
const text = document.querySelector("h1"); //selecte titlul
const strText = text.innerText;
const splitText = strText.split("") 
text.innerHTML=""
for (let i = 0; i<splitText.length; i++ )
     text.innerHTML+="<span>"+splitText[i]+"</span>"; //pun fiecare litera intr-un span
let l=0, r=splitText.length-1;
let timer=setInterval(onTick, 100) ; //la fiecare 100 ms apelez functia pentru apartia a 2 litere
function onTick()
{
  const span1 = text.querySelectorAll("span")[l]; //litera din stanga
  span1.classList.add("fade"); 

  const span2 = text.querySelectorAll("span")[r]; //litera din dreapta
  span2.classList.add("fade");
 
  l++; r--;
  if(l>r) //cand am trecut de jumatate
  {complete(); //opresc functia setInterval
  return;
  }
   
}   
function complete()
{
  clearInterval(timer);
  timer=null;
}
