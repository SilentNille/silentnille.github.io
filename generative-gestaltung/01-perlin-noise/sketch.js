// Platzhalter für HA 1. Hier kommt meine eigene Lösung hin.
// Regler gehören in den Sketch: mit .parent(controls) landen sie unter dem Bild.

let scaleSlider;

function setup() {
  createCanvas(720, 300).parent('sketch');
  pixelDensity(1);
  noLoop();

  const controls = select('#sketch-controls');
  createSpan('Skalierung').parent(controls);
  scaleSlider = createSlider(0.002, 0.05, 0.01, 0.001).parent(controls);
  scaleSlider.input(() => redraw());
  createButton('neu würfeln').parent(controls).mousePressed(() => {
    noiseSeed(random(1e6));
    redraw();
  });
}

function draw() {
  const s = scaleSlider.value();
  loadPixels();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const v = noise(x * s, y * s) * 255;
      const i = 4 * (y * width + x);
      pixels[i] = pixels[i + 1] = pixels[i + 2] = v;
      pixels[i + 3] = 255;
    }
  }
  updatePixels();
  noStroke();
  fill(31, 58, 147);
  textSize(28);
  textAlign(CENTER, CENTER);
  text('Hier kommt meine Lösung hin', width / 2, height / 2);
}
