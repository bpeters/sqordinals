import { Illustration, Group, Box, Shape } from 'zdog';

const HASH = '0x46bb2f90bdd710f233888feb4d6b22dbfd057b03b74d109c8f3bd88d048c5a19';
let canvasElement = document.querySelector('#sqordinal');

let isRotating = false;

let width = window.innerWidth;
let height = window.innerHeight;

canvasElement.width = width;
canvasElement.height = height;

let illo = new Illustration({
  element: canvasElement,
  dragRotate: true,
  zoom: 1,
  width: width,
  height: height,
  rotate: { x: Math.PI / 3, y: Math.PI, z: Math.PI / 3 },
});

let group = new Group({
  addTo: illo,
  translate: { x: -1 * (width / 4), z: 100 },
});

let objects = [];

const hashToNumber = (hash) => {
  if (hash.startsWith('0x')) {
    hash = hash.substring(2);
  }
  let bigInt = parseInt(hash.substring(0, 16), 16);
  let number = bigInt / 0xffffffffffffffff;

  return number;
}

const mapValue = (value, start1, stop1, start2, stop2) => {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

const curvePoint = (x1, y1, x2, y2, x3, y3, x4, y4, t) => {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  const x = uuu * x1 + 3 * uu * t * x2 + 3 * u * tt * x3 + ttt * x4;
  const y = uuu * y1 + 3 * uu * t * y2 + 3 * u * tt * y3 + ttt * y4;

  return { x, y };
};

function quadraticBezierCurve(x1, y1, x2, y2, x3, y3, t) {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;

  const x = uu * x1 + 2 * u * t * x2 + tt * x3;
  const y = uu * y1 + 2 * u * t * y2 + tt * y3;

  return { x, y };
}

const rnd = (sqord) => {
  sqord.seed ^= sqord.seed << 13;
  sqord.seed ^= sqord.seed >> 17;
  sqord.seed ^= sqord.seed << 5;
  return (((sqord.seed < 0) ? ~sqord.seed + 1 : sqord.seed) % 1000) / 1000;
};

const makeSqord = (hash, isNext, sqord2) => {
  let sqord = {
    hash: sqord2 ? sqord2.hash : hash,
    hashPairs: [],
    counter: 0,
  }

  if (!sqord2) {
    sqord.lcg_index = hashToNumber(sqord.hash);
  } else {
    sqord.lcg_index = sqord2.lcg_index;
  }

  sqord.moveSteps = 0;
  sqord.moveStepsR = 0;
  sqord.moveSegments = 0;
  sqord.moveSegmentsR = 0;
  sqord.moveSteps2 = 0;
  sqord.moveStepsR2 = 0;
  sqord.moveSegments2 = 0;
  sqord.moveSegmentsR2 = 0;

  for (let j = 0; j < 32; j++) {
    sqord.hashPairs.push(sqord.hash.slice(2 + (j * 2), 4 + (j * 2)));
  }

  sqord.decPairs = sqord.hashPairs.map((x) => parseInt(x, 16));
  sqord.seed = parseInt(sqord.hash.slice(0, 16), 16);
  sqord.color = 0;
  sqord.backgroundColor = 0;
  sqord.ht = 0;
  sqord.wt = 2;
  sqord.speed = ((sqord.decPairs[1] % 128) / 100) + 0.1;
  sqord.segments = mapValue(sqord.decPairs[26], 0, 255, 12, 20);
  sqord.startColor = sqord.decPairs[29];
  sqord.slinky = sqord.decPairs[31] < 30;
  sqord.pipe = sqord.decPairs[22] < 30;
  sqord.bold = sqord.decPairs[23] < 15;
  sqord.segmented = sqord.decPairs[24] < 30;
  sqord.fuzzy = sqord.pipe && !sqord.slinky;
  sqord.flipper = sqord.decPairs[5] < 15;
  sqord.familia = sqord.decPairs[4] < 15;
  sqord.flowers = sqord.decPairs[3] < 15;
  sqord.creepy = sqord.decPairs[7] < 15;
  sqord.dodge = sqord.decPairs[8] < 15;
  sqord.squared = sqord.decPairs[6] < 15;
  sqord.spread = (sqord.decPairs[28] < 15 ? 2 : mapValue(sqord.decPairs[28], 0, 255, 5, 50)) || 0;
  sqord.rotateX = (sqord.decPairs[15] < 128 ? -1 * sqord.decPairs[15] / 255 : sqord.decPairs[15] / 255) || 1;
  sqord.rotateY = (sqord.decPairs[16] < 128 ? -1 * sqord.decPairs[16] / 255 : sqord.decPairs[15] / 255) || 1;
  sqord.rotateZ = (sqord.decPairs[14] < 128 ? -1 * sqord.decPairs[14] / 255 : sqord.decPairs[14] / 255) || 1;
  sqord.spikes = sqord.decPairs[13] < 128;
  sqord.flow = sqord.decPairs[12] < 128;
  sqord.index = 0;
  sqord.pause = false;

  sqord.steps = sqord.slinky ?
    ((sqord.decPairs[17] % 100) + 1) :
    sqord.fuzzy ?
      ((sqord.decPairs[17] % 2000) + 1) :
      ((sqord.decPairs[17] % 400) + 1);

  if (sqord.squared) {
    sqord.steps = Math.round(sqord.steps / 2) + 1;
  }

  if (isNext) {
    sqord.reverse = sqord2.reverse;
    sqord.amp = sqord2.amp;
    sqord.flipper = sqord2.flipper;
    sqord.familia = sqord2.familia;

    if (sqord.familia) {
      sqord.startColor = sqord2.startColor;
      sqord.slinky = sqord2.slinky;
      sqord.pipe = sqord2.pipe;
      sqord.bold = sqord2.bold;
      sqord.segmented = sqord2.segmented;
      sqord.fuzzy = sqord2.fuzzy;
      sqord.flowers = sqord2.flowers;
      sqord.squared = sqord2.squared;
      sqord.creepy = sqord2.creepy;
      sqord.dodge = sqord2.creepy;
    }
  } else {
    sqord.amp = ((sqord.decPairs[2] % 128) / 100);
    sqord.reverse = sqord.decPairs[30] < 128;
  }

  sqord.ht = mapValue(sqord.decPairs[27], 0, 255, 3, 4);
  sqord.color = 0;
  sqord.div = Math.floor(mapValue(Math.round(sqord.decPairs[24]), 0, 230, 3, 20));

  sqord.start = true;

  return sqord;
};

const displaySqord = (
  sqord,
  group,
  j,
  i,
) => {
  let t = i / sqord.steps;

  if (sqord.flowers) {
    t = 1
  }

  let x1 = width / sqord.segments / sqord.wt * j;
  let x2 = width / sqord.segments / sqord.wt * (j + 1);
  let x3 = width / sqord.segments / sqord.wt * (j + 2);
  let x4 = width / sqord.segments / sqord.wt * (j + 3);
  let y1 = mapValue(sqord.decPairs[j], 0, 255, -height / sqord.ht, height / sqord.ht) * sqord.amp || 0;
  let y2 = mapValue(sqord.decPairs[j + 1], 0, 255, -height / sqord.ht, height / sqord.ht) * sqord.amp || 0;
  let y3 = mapValue(sqord.decPairs[j + 2], 0, 255, -height / sqord.ht, height / sqord.ht) * sqord.amp || 0;
  let y4 = mapValue(sqord.decPairs[j + 3], 0, 255, -height / sqord.ht, height / sqord.ht) * sqord.amp || 0;

  let { x, y } = curvePoint(x1, y1, x2, y2, x3, y3, x4, y4, t);

  y = y * -1;

  let z = -1 * ((sqord.segments * sqord.amp) + i + 1)

  let hue = sqord.reverse ?
    360 - (((sqord.color / sqord.spread) + sqord.startColor + Math.abs(sqord.index)) % 360) :
    (((sqord.color / sqord.spread) + sqord.startColor) + Math.abs(sqord.index)) % 360;

  if (sqord.creepy) {
    let u = 1 - t;
    let tt = t * t;
    let uu = u * u;
    let uuu = uu * u;
    let ttt = tt * t;

    x = uuu * x1 + 3 * uu * t * x2 + 3 * u * tt * x3 + ttt * x4;
    y = uuu * y1 + 3 * uu * t * y2 + 3 * u * tt * y3 + ttt * y4;
  }

  if (sqord.flowers && sqord.spikes) {
    let { x: x0, y: y0 } = quadraticBezierCurve(x1, y1, x2, y2, x3, y3, 1);

    if (Math.round(t * 10) % 10 === 0) {
      objects.push({
        object: new Shape({
          addTo: group,
          stroke: height / 128,
          color: '#fff',
          translate: { x: x0, y: y0, z: -1 * mapValue(rnd(sqord), 0, 1, 0, height / 4) },
          visible: sqord.flipper ? true : false,
        }),
        opacity: 1,
      });
    }
  }

  let isBlack = false;

  if (sqord.fuzzy) {
    let fuzzX = x + mapValue(rnd(sqord), 0, 1, 0, height / 10);
    let fuzzY = y - mapValue(rnd(sqord), 0, 1, 0, height / 10);
    let fuzzZ = mapValue(rnd(sqord), 0, 1, 0, height / 4);

    let size = mapValue(rnd(sqord), 0, 1, height / 160, height / 16);

    if (sqord.squared) {
      objects.push({
        object: new Box({
          addTo: group,
          width: size,
          height: size,
          depth: size,
          stroke: false,
          color: '#fff',
          leftFace: '#fff',
          rightFace: '#fff',
          topFace: '#fff',
          bottomFace: '#fff',
          translate: { x: fuzzX, y: fuzzY, z: fuzzZ  },
          visible: sqord.flipper ? true : false,
        }),
        opacity: 0.8,
        isCube: true,
      });
    } else {
      objects.push({
        object: new Shape({
          addTo: group,
          stroke: size,
          color: '#fff',
          translate: { x: fuzzX, y: fuzzY, z: fuzzZ  },
          visible: sqord.flipper ? true : false,
        }),
        opacity: 0.8,
      });
    }
  } else {
    let size = height / 32;
    
    if (sqord.slinky && sqord.pipe) {
      let newSize = size * 1.2;
      if (sqord.squared) {
        objects.push({
          object: new Box({
            addTo: group,
            width: newSize,
            height: newSize,
            depth: newSize,
            stroke: false,
            color: '#000',
            leftFace: '#000',
            rightFace: '#000',
            topFace: '#000',
            bottomFace: '#000',
            translate: { x, y, z },
            visible: sqord.flipper ? true : false,
          }),
          opacity: 1,
          isCube: true,
          isBlack: true,
        });
      } else {
        objects.push({
          object: new Shape({
            addTo: group,
            stroke: newSize,
            color: '#000',
            translate: { x, y, z },
            visible: sqord.flipper ? true : false,
          }),
          opacity: 1,
          isBlack: true,
        });
      }
    }

    if (sqord.squared) {
      let newSize = (sqord.bold && !sqord.slinky ? size * 3 : size) * 2;

      objects.push({
        object: new Box({
          addTo: group,
          width: newSize,
          height: newSize,
          depth: newSize,
          stroke: false,
          color: '#000',
          leftFace: '#000',
          rightFace: '#000',
          topFace: '#000',
          bottomFace: '#000',
          translate: { x, y, z },
          visible: sqord.flipper ? true : false,
        }),
        opacity: 1,
        isCube: true,
        isBlack,
      });
    } else {
      objects.push({
        object: new Shape({
          addTo: group,
          stroke: sqord.bold && !sqord.slinky ? size * 3 : size,
          color: '#000',
          translate: { x, y, z },
          visible: sqord.flipper ? true : false,
        }),
        opacity: 1,
        isBlack,
      });
    }

    if (sqord.slinky) {
      let newSize = size * 0.9;
      let color = '#000';

      let localIsBlack = false;

      if (i === 0 || i === (sqord.steps) - 1) {
        localIsBlack = false;
      } else {
        localIsBlack = true;
      }

      if (sqord.squared) {
        objects.push({
          object: new Box({
            addTo: group,
            width: newSize,
            height: newSize,
            depth: newSize,
            stroke: newSize,
            color,
            leftFace: color,
            rightFace: color,
            topFace: color,
            bottomFace: color,
            translate: { x, y, z },
            visible: sqord.flipper ? true : false,
          }),
          opacity: 1,
          isCube: true,
          isBlack: localIsBlack,
        });
      } else {
        objects.push({
          object: new Shape({
            addTo: group,
            stroke: newSize,
            color,
            translate: { x, y, z },
            visible: sqord.flipper ? true : false,
          }),
          opacity: 1,
          isBlack: localIsBlack,
        });
      }
    }

    if (sqord.segmented && !sqord.slinky && !sqord.bold) {
      if (i % sqord.div === 0 || i === 0 || i === (sqord.steps) - 1) {
        const grayValue = sqord.decPairs[25] / 255;

        let newSize = size * 1;
        let color = grayscaleValue(grayValue, 1);

        if (sqord.squared) {
          objects.push({
            object: new Box({
              addTo: group,
              width: newSize,
              height: newSize,
              depth: newSize,
              stroke: newSize,
              color,
              leftFace: color,
              rightFace: color,
              topFace: color,
              bottomFace: color,
              translate: { x, y, z },
              visible: sqord.flipper ? true : false,
            }),
            opacity: 1,
            isCube: true,
            isBlack: true,
          });
        } else {
          objects.push({
            object: new Shape({
              addTo: group,
              stroke: newSize,
              color,
              translate: { x, y, z },
              visible: sqord.flipper ? true : false,
            }),
            opacity: 1,
            isBlack: true,
          });
        }
      }
    }
    
  }

  sqord.color++;
};

let sqord = makeSqord(HASH, false, null);

console.log(sqord);

for (let j = 0; j < (sqord.segments - 1); j++) {
  for (let i = 0; i <= (sqord.steps); i++) {
    displaySqord(sqord, group, j, i);
  }

  sqord.seed = parseInt(sqord.hash.slice(0, 16), 16);
}

sqord.counter = !sqord.reverse ? objects.length - 1 : 0;

document.getElementById('sqordinal').addEventListener('wheel', function(event) {
  let zoomChange = event.deltaY * -0.01;
  illo.zoom += zoomChange;

  event.preventDefault();
}, { passive: false });

document.body.addEventListener("keydown", function (event) {
  if (event.code === 'Space') {
    isRotating = !isRotating;
  }
}, false);

function hslToRgba(h, s, l, a) {
  let r, g, b;
  if(s == 0) {
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

function grayscaleValue(value, opacity) {
  let grayScale = Math.round(value * 255);
  return `rgba(${grayScale}, ${grayScale}, ${grayScale}, ${opacity})`;
}

function animate() {
  let time = Date.now() * 0.001;
  sqord.color = 0;

  if (isRotating) {
    illo.rotate.y += sqord.speed / 100 * sqord.rotateY;
    illo.rotate.x += sqord.speed / 100 * sqord.rotateX;
    illo.rotate.z += sqord.speed / 100 * sqord.rotateZ;
  }

  if (!sqord.start && !sqord.flipper) {
    const object = objects[sqord.counter];
    object.object.visible = false;

    sqord.counter = !sqord.reverse ? sqord.counter - 1 : sqord.counter + 1;

    if (
      (!sqord.reverse && sqord.counter === 0) ||
      (sqord.reverse && sqord.counter === objects.length - 1)
    ) {
      sqord.reverse = !sqord.reverse;
      sqord.start = true;
    }
  }

  if (sqord.start && !sqord.flipper && !sqord.changing) {
    const object = objects[sqord.counter];
    object.object.visible = true;

    sqord.counter = !sqord.reverse ? sqord.counter - 1 : sqord.counter + 1;

    if (
      (!sqord.reverse && sqord.counter === 0) ||
      (sqord.reverse && sqord.counter === objects.length - 1)
    ) {
      sqord.changing = true;

      setTimeout(() => {
        sqord.start = false;
        sqord.changing = false;
        if (sqord.dodge) {
          sqord.counter = sqord.reverse ? 0 : objects.length - 1;
        } else {
          sqord.reverse = !sqord.reverse;
        }
      }, 10000);
    }
  }

  for (const object of objects) {
    let hue = sqord.flow ?
      360 - (((sqord.color / sqord.spread) + sqord.startColor + Math.abs(sqord.index)) % 360) :
      (((sqord.color / sqord.spread) + sqord.startColor) + Math.abs(sqord.index)) % 360;

    if (!object.isBlack) {
      if (object.isCube) {
        if (hue) {
          object.object.color = hslToRgba(hue / 360, 1, 0.5, object.opacity || 1);
          object.object.leftFace = hslToRgba(hue / 360, 1, 0.5, object.opacity || 1);
          object.object.rightFace = hslToRgba(hue / 360, 1, 0.5, object.opacity || 1);
          object.object.topFace = hslToRgba(hue / 360, 1, 0.5, object.opacity || 1);
          object.object.bottomFace = hslToRgba(hue / 360, 1, 0.5, object.opacity || 1);
        } else {
          let gray = ((sqord.color + Math.abs(sqord.index)) % 255) / 255;
          object.object.color = grayscaleValue(gray, object.opacity || 1);
          object.object.leftFace = grayscaleValue(gray, object.opacity || 1);
          object.object.rightFace = grayscaleValue(gray, object.opacity || 1);
          object.object.topFace = grayscaleValue(gray, object.opacity || 1);
          object.object.bottomFace = grayscaleValue(gray, object.opacity || 1);
        }
      } else {
        if (hue) {
          object.object.color = hslToRgba(hue / 360, 1, 0.5, object.opacity || 1);
        } else {
          let gray = ((sqord.color + Math.abs(sqord.index)) % 255) / 255;

          object.object.color = grayscaleValue(gray, object.opacity || 1);
        }
      }
    }

    sqord.color++;

    sqord.seed = parseInt(sqord.hash.slice(0, 16), 16);
  }

  sqord.index = sqord.reverse ? (sqord.index - sqord.speed) : sqord.index + sqord.speed;


  illo.updateRenderGraph();
  requestAnimationFrame(animate);
}
animate();
