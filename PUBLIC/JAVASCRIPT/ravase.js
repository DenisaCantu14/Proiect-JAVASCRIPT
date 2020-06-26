var mesaje = 
[`I know you can do it!`,
`You're gonna win this level!`,
`You will have more luck this time!`,
`I see a winner!`,
`You're gonna be in top 10!`,
`This time your score will explode!`,
`This level will take you 30s!`

]

function afiseazaMesaj()
{ 
    let poz = Math.floor(Math.random() * 7);
    document.getElementById("message").innerHTML=mesaje[poz];
}