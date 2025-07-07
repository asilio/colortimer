let seconds = 0;
let startTime = 0;
function NeutralBackground(){
  document.body.classList.remove("red","green");
  document.body.classList.add("neutral");
}
function RedBackground(){
  document.body.classList.remove("green", "neutral");
  document.body.classList.add("red");
  document.getElementById("inputs").style.display="block";
  startTime = 0;
}

function GreenBackground(minutes){
  console.log("Green");
  document.body.classList.remove("red","neutral");
  document.body.classList.add("green");
  seconds = Number(minutes)*60;
  console.log(`Timer set for ${seconds} seconds`);
  setTimeout(RedBackground,seconds*1000);
}

function main(){
  NeutralBackground();
  let submit=document.getElementById("submit");
  let timer = document.getElementById("timer");
  let calculate = document.getElementById("calculate");
  let datetime = document.getElementById("datetime");

  submit.addEventListener("mousedown",(event)=>{
    startTime = Date.now();
    GreenBackground(timer.value);
    document.getElementById("inputs").style.display="none";
  });

  calculate.addEventListener("mousedown",(event)=>{
    let target = new Date(datetime.value);
    let ms =  target.getTime()- Date.now();
    console.log(ms);
    timer.value = Math.round(ms/60000);
  });

  updateCountdown();
}

function updateCountdown(){
  if(startTime == 0){return requestAnimationFrame(updateCountdown)};
  let S =Math.round(seconds-(Date.now()-startTime)/1000);
  let minutes = Math.floor(S/60);
  let hours = Math.floor(minutes/60);
  S = S%60;
  minutes=minutes%60;
  if(S<10)S=`0${S}`;
  if(minutes<10)minutes=`0${minutes}`;
  if(hours<10)hours=`0${hours}`;
  document.getElementById("countdown").innerHTML=`${hours}:${minutes}:${S}`;
  requestAnimationFrame(updateCountdown)
}

main();
