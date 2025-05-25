const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let points = [];

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  points.push([x, y]);
  draw();
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "red";
  points.forEach(([x, y]) => ctx.fillRect(x - 3, y - 3, 6, 6));

  if (points.length < 2) return;


  const xs = points.map(p => p[0]);
  const ys = points.map(p => p[1]);

  const spline = new SplineInterpolator(xs, ys);

  ctx.beginPath();
  ctx.moveTo(xs[0], ys[0]);

  for (let x = xs[0]; x <= xs[xs.length - 1]; x += 1) {
    const y = spline.interpolate(x);
    ctx.lineTo(x, y);
  }

  ctx.strokeStyle = "blue";
  ctx.lineWidth = 2;
  ctx.stroke();
}

