import { Illustration, Shape, Box, Cylinder, TAU } from 'zdog';

let canvasElement = document.querySelector('#sqordinal');

let width = window.innerWidth;
let height = window.innerHeight;

canvasElement.width = width;
canvasElement.height = height;

let illo = new Illustration({
  element: canvasElement,
  dragRotate: true,
  zoom: 3,
  width: width,
  height: height,
  rotate: { x: -0.42, y: -0.4 },
  translate: {
    y: 10,
  }
});

// Define the size and the gap between the cubes
let cubeWidthDepth = 50;
let cubeGap = 0;

// The height of each individual cube to make sure the overall structure remains a cube
let cubeHeight = cubeWidthDepth / 10;

// The total size of a cube including the gap
let totalSize = cubeHeight + cubeGap;

const boxes = [];
const cylinders = [];

let totalHeight = (cubeHeight + cubeGap) * 9;

// Iterate to create the 10 cubes
for(let i = 0; i < 10; i++) {
  let hue = i * 36; // Initial hue for this box
  let color = 'hsl(' + hue + ', 100%, 50%)'; // Create color string
  let box = new Box({
    addTo: illo,
    width: cubeWidthDepth * 2,
    height: cubeHeight - 2,
    depth: cubeWidthDepth * 2,
    stroke: false,
    color: color,
    translate: { y: -i * totalSize },
  });

  box.rotate.x = Math.random() * 0.1; // Random rotation around x-axis
  box.rotate.y = Math.random() * 0.1; // Random rotation around y-axis
  box.rotate.z = Math.random() * 0.1; // Random rotation around z-axis
  boxes.push({
    box,
    hue,
  });
}

let innerCube = new Box({
  addTo: illo,
  width: cubeWidthDepth / 1.5,
  height: cubeWidthDepth / 1.5,
  depth: cubeWidthDepth / 1.5,
  stroke: 10,
  color: '#fff', // placeholder color
  leftFace: '#fff',
  rightFace: '#fff',
  topFace: '#fff',
  bottomFace: '#fff',
  translate: { y: -totalHeight / 1.5 },
});


let atomCube = new Box({
  addTo: illo,
  width: cubeWidthDepth / 4,
  height: cubeWidthDepth / 4,
  depth: cubeWidthDepth / 4,
  stroke: false,
  color: '#fff', // placeholder color
  leftFace: '#fff',
  rightFace: '#fff',
  topFace: '#fff',
  bottomFace: '#fff',
  translate: { y: -totalHeight / 1.5 },
});

let eyeSize = cubeWidthDepth / 5;

let leftEye = new Shape({
  addTo: innerCube,
  stroke: eyeSize / 1.2,
  color: 'white',
  translate: { x: -10, z: 22 }, // Position the left eye
});

let rightEye = new Shape({
  addTo: innerCube,
  stroke: eyeSize / 1.2,
  color: 'white',
  translate: { x: 10, z: 22 }, // Position the left eye
});

for(let i = 0; i < 6; i++) {
  let hue = i * 36;

  let cylinder = new Cylinder({
    addTo: illo,
    diameter: cubeWidthDepth / 1.5,
    length: cubeHeight,
    stroke: false,
    color: '#fff',
    rotate: { x: TAU / 4 },
    translate: { y: i * totalSize },
  });

  cylinders.push({
    cylinder,
    hue,
  });
}



canvasElement.addEventListener('wheel', function(event) {
  let zoomChange = event.deltaY * -0.01;
  illo.zoom += zoomChange;

  event.preventDefault();
}, { passive: false });

let initialDistance = 0;

canvasElement.addEventListener('touchmove', function(event) {
  if (event.touches.length === 2) {
    let touch1 = event.touches[0];
    let touch2 = event.touches[1];
    let deltaX = touch2.pageX - touch1.pageX;
    let deltaY = touch2.pageY - touch1.pageY;
    let currentDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (initialDistance > 0) {
      let deltaDistance = currentDistance - initialDistance;
      illo.zoom += deltaDistance * 0.01;
    }

    initialDistance = currentDistance;
  } else {
    initialDistance = 0;
  }

  event.preventDefault();
});

const hslToRgba = (h, s, l, a) => {
  let r, g, b;
  if(s === 0) {
    r = g = b = l;
  } else {
    let hue2rgb = function hue2rgb(p, q, t) {
      if(t < 0) t += 1;
      if(t > 1) t -= 1;
      if(t < 1/6) return p + (q - p) * 6 * t;
      if(t < 1/2) return q;
      if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }
    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
}

let innerHue = 100;
let innerColor;

// Animation loop
function animate() {
  // Apply color to all boxes
  for (let item of boxes) {
    item.hue = (item.hue + 1) % 360; // Increment hue and make sure it stays between 0 and 359
    let color = hslToRgba(item.hue / 360, 1, 0.5, 0.8);
    let trans = hslToRgba(item.hue / 360, 1, 0.5, 0)
    item.box.color = color;
    item.box.leftFace = trans;
    item.box.rightFace = trans;
    item.box.topFace = trans;
    item.box.bottomFace = trans;

    let rotationX = Math.random() * 0.01; // Random rotation around x-axis
    let rotationY = Math.random() * 0.01; // Random rotation around y-axis
    let rotationZ = Math.random() * 0.01; // Random rotation around z-axis
    item.box.rotate.x += rotationX;
    item.box.rotate.y += rotationY;
    item.box.rotate.z += rotationZ;
  }

  for (let item of cylinders) {
    item.hue = (item.hue + 1) % 360; // Increment hue and make sure it stays between 0 and 359
    let color = hslToRgba(item.hue / 360, 1, 0.5, 0.5);
    item.cylinder.color = color;
    innerColor = color;
  }

  innerCube.color = innerColor;
  innerCube.leftFace = innerColor;
  innerCube.rightFace = innerColor;
  innerCube.topFace = innerColor;
  innerCube.bottomFace = innerColor;

  atomCube.rotate.x += 0.01;
  atomCube.rotate.y += 0.01;
  atomCube.rotate.z += 0.01;

  illo.updateRenderGraph();
  requestAnimationFrame(animate);
}

// Start the animation
animate();
