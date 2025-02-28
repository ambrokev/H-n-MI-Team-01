// A variable to initialize the Image Classifier
let classifier;

// A variable to hold the video we want to classify
let video;

// Variable for displaying the results on the canvas
let label = "Model loading...";
let targetPose;
let poses = ["alto", "teapot", "face", "queen", "helicopter", "superbitch"];
let currentPose = "";
let nextPose = "";
let poseMatched = false;
let audioFiles = {}; // Object to store audio files
let poseImages = {}; // Object to store pose images
let imageX = 0; // X-coordinate of the image
let animationSpeed = 2; // Speed of the animation
let background;


let imageModelURL = "https://teachablemachine.withgoogle.com/models/TXRTbxn8_/";

function preload() {
  ml5.setBackend('webgl');
  classifier = ml5.imageClassifier(imageModelURL + "model.json");
  // Load audio files
  audioFiles.alto = loadSound("/Audios/alto.mp3");
  audioFiles.teapot = loadSound("/Audios/teapot.mp3");
  audioFiles.face = loadSound("/Audios/face.mp3");
  audioFiles.helicopter = loadSound("/Audios/helicopter.mp3");
  audioFiles.queen = loadSound("/Audios/queen.mp3");
  audioFiles.superbitch = loadSound("/Audios/super-bitch.mp3");

  // Load images
  poseImages.alto = loadImage('/Images/alto.png');
  poseImages.teapot = loadImage('/Images/teapot.png');
  poseImages.face = loadImage('/Images/face.png');
  poseImages.helicopter = loadImage('/Images/helicopter.png');
  poseImages.queen = loadImage('/Images/queen.png');
  poseImages.superbitch = loadImage('/Images/superbitch.png');
  
  background = loadImage('background2.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create the webcam video and hide it
  video = createCapture(VIDEO, { flipped: true });
  video.size((windowWidth*0.6), (windowHeight*0.6));
  video.hide();

  // Start detecting objects in the video
  classifier.classifyStart(video, gotResult);

  // Initialize the first pose
  setNextPose();
}

function draw() {
  // Clear the canvas
 // background(255);

  // Center and scale the background image
  imageMode(CENTER);
  let scaleFactor = min(width / background.width, height / background.height);
  scale(scaleFactor);
  image(background, width / 2 / scaleFactor, height / 2 / scaleFactor);

  // Reset the transformation matrix
  resetMatrix();

  // Each video frame is painted on the canvas
  image(video, width / 2, height / 1.8);

  // Display the pose image with animation
  if (poseImages[nextPose]) {
    image(poseImages[nextPose], imageX, height / 2, 600, 600); // Display the image
    imageX -= animationSpeed; // Move the image to the left

    // Reset the image position when it goes off-screen
    if (imageX < -poseImages[nextPose].width) {
      imageX = width;
    }
  }

  // Clear the text area
  fill(248, 173, 255); // Use the same color as your background
  rect(0, 0, 300, 150); // Adjust the rectangle dimensions as needed

  // Printing class with the highest probability on the canvas
  fill("white");
  textSize(32);
  text("Do: " + nextPose, 20, 50);
  text("Current: " + label, 20, 100);
}

// A function to run when we get the results
function gotResult(results) {
  // Update label variable which is displayed on the canvas
  label = results[0].label;
  if (label === nextPose && !poseMatched) {
    poseMatched = true;
    setTimeout(setNextPose, 2000); // Wait 2 seconds before next pose.
  }
}

function setNextPose() {
  poseMatched = false;
  nextPose = getRandomPose();
  // Play audio
  if (audioFiles[nextPose]) {
    audioFiles[nextPose].play();
  }
  imageX = width; // Reset image position to the right
}

function getRandomPose() {
  let newPose;
  do {
    newPose = poses[Math.floor(Math.random() * poses.length)];
  } while (newPose === nextPose); // Ensure it's a different pose

  return newPose;
}