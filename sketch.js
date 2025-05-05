// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY, circleSize = 100;
let isDragging = false;
let prevX = null,
  prevY = null; // Previous position of the finger for drawing the trail

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Initialize circle position
  circleX = width / 2;
  circleY = height / 2;

  // Start detecting hands
  handPose.detectStart(video, gotHands);

  // Set initial background
  background(0);
}

function draw() {
  // Draw the video feed
  image(video, 0, 0);

  // Draw the circle
  fill(0, 255, 0);
  noStroke();
  ellipse(circleX, circleY, circleSize);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Get the position of the index finger (keypoint 8)
        let indexFinger = hand.keypoints[8];

        // Draw the trail
        stroke(255, 0, 0); // Red color for the trail
        strokeWeight(10); // Set line thickness to 10
        if (prevX !== null && prevY !== null) {
          // Draw the line on a separate layer
          line(prevX, prevY, indexFinger.x, indexFinger.y);
        }
        prevX = indexFinger.x;
        prevY = indexFinger.y;

        // Check if the index finger is touching the circle
        let d = dist(indexFinger.x, indexFinger.y, circleX, circleY);
        if (d < circleSize / 2) {
          // Update circle position
          circleX = indexFinger.x;
          circleY = indexFinger.y;
        }
      }
    }
  } else {
    // Reset previous position when no hands are detected
    prevX = null;
    prevY = null;
  }
}
