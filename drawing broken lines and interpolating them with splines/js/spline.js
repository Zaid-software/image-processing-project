const canvas = document.getElementById('splineCanvas');
const ctx = canvas.getContext('2d');
let points = [];

canvas.addEventListener('click', function (e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  points.push({ x, y });
  drawPointsAndLines();
});

function drawPointsAndLines() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  for (let i = 0; i < points.length; i++) {
    ctx.arc(points[i].x, points[i].y, 4, 0, Math.PI * 2);
    ctx.fill();
    if (i > 0) {
      ctx.beginPath();
      ctx.moveTo(points[i - 1].x, points[i - 1].y);
      ctx.lineTo(points[i].x, points[i].y);
      ctx.stroke();
    }
  }
}

function interpolate() {
  if (points.length < 3) return alert("Need at least 3 points");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  if (points.length > 1) {
    ctx.lineTo(points[1].x, points[1].y);
  }

  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];

    const dx1 = curr.x - prev.x;
    const dy1 = curr.y - prev.y;
    const dx2 = next.x - curr.x;
    const dy2 = next.y - curr.y;

    const mid1x = (prev.x + curr.x) / 2;
    const mid1y = (prev.y + curr.y) / 2;
    const mid2x = (curr.x + next.x) / 2;
    const mid2y = (curr.y + next.y) / 2;

    const factor = 0.5;

    const cp1x = mid1x + factor * dy1;
    const cp1y = mid1y - factor * dx1;
    const cp2x = mid2x + factor * dy2;
    const cp2y = mid2y - factor * dx2;

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, next.x, next.y);
  }

  ctx.strokeStyle = "blue";
  ctx.lineWidth = 2;
  ctx.stroke();

  for (const pt of points) {
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function resetCanvas() {
  points = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
