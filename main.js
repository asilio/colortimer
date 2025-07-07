import {folder} from "./modules/config.js"
import {AudioElement} from "./modules/aac.js"
if('serviceWorker' in navigator){
 // window.addEventListener('load',()=>{
    navigator.serviceWorker.register('/service-worker.js').then(registration=>{
      //console.log('SW Registered: ', registration);
    }).catch(registrationError=>{
      console.warn('SW registration failed: ', registrationError);
    });
 // });
}


function getGamePadStates(){
  let states = [];
  let pads = navigator.getGamepads();
  for(let i =0;i<4;i++){
    let gamepad = pads[i];
    let state = [];
    if(pads.buttons === undefined) continue;
    for(let j = 0;j<pads.buttons.length;i++){
      state.push(pads.buttons[j]);
    }
    states.push(state);
  }
  return states;
}

function handleInput(){
  let states = getGamePadStates();
}
function prerender(){

}
function render(){
  //console.log('rendering...');
  if(globals.currentLayout != globals.contentElement.firstChild)
  {
    try{
      globals.contentElement.removeChild(globals.contentElement.firstChild);
    }catch(error){}
    globals.contentElement.appendChild(globals.currentLayout);
  }
}
function postrender(){

}
function fixedUpdate(){

}
function update(){

}

const globals = {
  time_now:0,
  delta_time:0,
  time_last_update:Date.now(),
  time_accumulator:0,
  time_slice: 5 //ms

}

function updateTime(){
  globals.time_now = Date.now();
  globals.delta_time = globals.time_now - globals.time_last_update;
  globals.time_last_update += globals.delta_time;
  globals.time_accumulator += globals.delta_time;
}

/*Main Application loop*/
function main(){
  updateTime();
  handleInput();
  while(globals.time_accumulator > globals.time_slice){
    fixedUpdate(globals.time_slice);
    globals.time_accumulator -= globals.time_slice;
  }
  update();
  prerender();
  render();
  postrender();

  requestAnimationFrame(main);
}

async function fetchDefaults(){
  const url = "http://localhost:3000/user-profile.json";
  try {
    const response = await fetch(url);
    if (!response.ok){
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    console.log(json);/*
    const transaction = globals.userprofiles.db.transaction(["UserProfiles"],"readwrite");
    transaction.oncomplete = (event) =>{
      console.log("Loaded Defaults into local database");
    }

    const objectStore = transaction.objectStore("UserProfiles");
    const request = objectStore.add(json['profiles'][0]);
    request.onsuccess = (event)=>{
      console.log("Successfully saved to the DB");993170
    }
    request.onerror = (event)=>{
      console.warn("Error saving to the DB",event);
    }
    //globals.userprofiles = json;
    main();*/
  } catch(error){
    console.warn(error.message);
  }
}
/*
function newUserProfile(name){
  //TODO pull in the current settings to save to the profile
  const profile = {
    "name":name,
    "settings":{
      "speech volume":1,
      "prompt volume":0.75,
      "speech voice":"default",
      "prompt voice":"default",
      "speech delay":200
    },
    "pages":[
      {
        "name":"default",
        "description":"Simple 3x5 layout",
        "layout":[3,5],
        "buttons":[
          {
            "position":[0,0],
            "action":"TextToSpeech",
            "label":"Hello World",
            "value":"Hello World"
          }
        ]
      }
    ]
  };
  const request = globals.objectStore.add(profile);
  request.onerror=(event)=>{console.warn(event)};
  request.onsuccess=(event)=>{
    console.log("Added new User");
    globals.currentProfile=profile;
  };
}



function saveCurrentProfile(){
  const request = globals.objectStore.put(globals.currentProfile);
  request.onerror=(event)=>{console.warn(event)};
  request.onsuccess=(event)=>{console.log("Saved");};
}

function loadProfile(name){
  const request = globals.objectStore.get(name);
  request.onerror=(event)=>{console.warn(event);};
  request.onsuccess=(event)=>{
    console.log("Loaded profile successfully");
    globals.currentProfile=event.target.result;
    globals.currentLayout = generateLayout(0);
  };
}

function generateLayout(page_number=0){
  if(page_number>globals.currentProfile.pages.length) page_number = 0;
  let layout = document.createElement('div');
  layout.classList.add('layout');
  let page = globals.currentProfile.pages[page_number];
  let rows = page.layout[0];
  let cols = page.layout[1];
  let grid = [];
  let buttons = new Array(rows*cols);
  for(let i = 0;i<page.buttons.length;i++){
    let button = page.buttons[i];
    let row = button.position[0];
    let col = button.position[1];
    buttons[col+row*cols] = button;
  }
  for(let row = 0;row<rows;row++){
    grid[row] = document.createElement('div');
    grid[row].classList.add('row');
    layout.appendChild(grid[row]);
  }
  for(let i = 0;i<buttons.length;i++){
    let row = Math.floor(i/cols);
    let col = i%cols;
    let button = buttons[i];
    if(button == undefined){
      let a = new AudioElement("empty", "","",grid[row]);
      a.button.x = row;
      a.button.y = col;
      a.button.ondblclick=editButton;
      a.button.page_number = page_number;
    }else{
      let a = new AudioElement(button.action,button.label,button.value, grid[row]);
      a.button.x = row;
      a.button.y = col;
      a.button.page_number = page_number;
      a.button.ondblclick = editButton;
    }
  }
  console.log(layout); 
  return layout;
}

function editButton(event){
  let buttonEl = event.target;
  let page_number = buttonEl.page_number;
  let position = [buttonEl.x,buttonEl.y];
  let button = globals.currentProfile.pages[page_number].buttons.filter((el)=>{
    return el.position[0] == position[0] && el.position[1] == position[1];
  })[0];
  if(button == undefined){
    button = {};
    button.action = "TextToSpeech";
    button.label = " ";
    button.value = "";
    button.position = position;
  }
  console.log(button);
}

function databaseCallback(){
  globals.objectStore = globals.userprofiles.db.transaction(["UserProfiles"],"readwrite").objectStore("UserProfiles");
  
  //newUserProfile("Rafael2");
  loadProfile("Rafael2");
  //
  main();
}

globals.userprofiles={
  name:"AAC Profiles",
  callback:databaseCallback,
  version:1,
};*/
function initialize(){
  globals.contentElement = document.getElementById("content");
  globals.currentLayout = document.createElement("div");
  folder.build(()=>{
    console.log("Database loaded");

  });

  let button = document.createElement("button");
  button.label = "Input Settings";
  button.innerHTML = "Input Settings";

  let settings = document.getElementById("settings");
  settings.appendChild(button);

  button.addEventListener("click",()=>{
      console.log("settings");
      console.log(navigator.getGamepads())
  });
  /*Testing Features*/
 // let row1 = document.createElement("div");
  //row1.classList.add("row");
  //let row2 =document.createElement("div");
  //row2.classList.add("row");

//  let a = new AudioElement("text", "My Name is Rafael", "A", row1);
 // let b = new AudioElement("text", "My Name is Rafael", "B", row1);
  //let c = new AudioElement("text", "My Name is Rafael", "C", row2);
  //let d = new AudioElement("text", "My Name is Rafael", "D", row2);
  //globals.contentElement.appendChild(row1);
  //globals.contentElement.appendChild(row2);
}
initialize();
main();
