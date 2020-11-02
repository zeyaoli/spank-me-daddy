import { add, sub, angle, scale, distance } from "./vector.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let pixelRatio = 1.5;
canvas.width = window.innerWidth * pixelRatio;
canvas.height = window.innerHeight * pixelRatio;
let { width, height } = canvas;

//init images
let left_hand = new Image();
left_hand.src = "./src/left-hand.png";
let right_hand = new Image();
right_hand.src = "./src/right-hand.png";
let butt = new Image();
butt.src = "./src/butt.png";

//init hands positions
let p1 = { x: 0, y: 0 };
let p2 = { x: width - 100, y: height - 100 };

//test mouse move
canvas.addEventListener("mousemove", (e) => {
  e.preventDefault();
  p1 = {
    x: e.clientX * pixelRatio,
    y: e.clientY * pixelRatio,
  };
  render();
});

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  let touches = Array.from(e.touches);
  let touch = touches[0];

  p1 = {
    x: touch.clientX * pixelRatio,
    y: touch.clientY * pixelRatio,
  };

  touch = touches[1];
  if (touch) {
    p2 = {
      x: touch.clientX * pixelRatio,
      y: touch.clientY * pixelRatio,
    };
  }
  render();
});

render();

function render() {
  ctx.clearRect(0, 0, width, height);
  drawButt();
  drawLeftHand();
  drawRightHand();

  makeSound();
}

function drawLeftHand() {
  ctx.strokeStyle = `black`;
  ctx.beginPath();
  let leftHand_size = 150;
  let leftHand_x = p1.x - leftHand_size / 2;
  let leftHand_y = p1.y - leftHand_size / 2;
  ctx.drawImage(
    left_hand,
    leftHand_x,
    leftHand_y,
    leftHand_size,
    leftHand_size
  );
}

function drawRightHand() {
  ctx.strokeStyle = `black`;
  ctx.beginPath();
  let rightHand_size = 150;
  let rightHand_x = p2.x - rightHand_size / 2;
  let rightHand_y = p2.y - rightHand_size / 2;
  ctx.drawImage(
    right_hand,
    rightHand_x,
    rightHand_y,
    rightHand_size,
    rightHand_size
  );
}

function drawButt() {
  let pDiff = sub(p1, p2);
  pDiff = scale(pDiff, 0.5);
  let buttPos = add(p1, pDiff);

  ctx.beginPath();
  let butt_size = 350;
  let butt_x = buttPos.x - butt_size / 2;
  let butt_y = buttPos.y - butt_size / 2;
  ctx.drawImage(butt, butt_x, butt_y, butt_size, butt_size);
}

function makeSound() {
  let handDist = Math.floor(distance(p1, p2));
  //   console.log(handDist);
  const synth = window.speechSynthesis;
  const voices = speechSynthesis.getVoices();
  const speak = (text) => {
    if (synth.speaking) {
      //   console.error("already talking");
      return;
    }
    let utterThis = new SpeechSynthesisUtterance(text);
    utterThis.voice = voices[0];
    synth.speak(utterThis);
  };
  if (handDist > height - 100 || handDist > width - 10) {
    // test if the boundary is ok
    // ctx.beginPath();
    // ctx.arc(width / 2, height / 2, 50, 0, Math.PI * 2);
    // ctx.fill();
    setInterval(speak("come on! daddy! you can do it!", 5000));
  } else if (handDist > 450 && handDist < 800) {
    setInterval(speak("come closer, daddy! ", 5000));
  } else if (handDist > 350 && handDist <= 450) {
    setInterval(speak("almost there, daddy!", 5000));
  } else if (handDist > 0 && handDist <= 300) {
    setInterval(speak("spank me, daddy!", 5000));
  }
}
