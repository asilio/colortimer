function getGamePadStates(){
  let states = [];
  let pads = navigator.getGamepads();
  for(let i =0;i<4;i++){
    let gamepad = pads[i];
    let state = [];
    for(let j = 0;j<pads.buttons.length;i++){
      state.push(pads.buttons[j]);
    }
    states.push(state);
  }
  return states;
}

onmessage = (e)=>{
  postMessage(getGamePadStates());
};

