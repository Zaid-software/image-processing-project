let originalImage = new Image();
let canvas = document.getElementById('retouchcanvas');
let ctx = canvas.getContext('2d');

document.getElementById('upload').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    originalImage.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

retouchImage.onload = function () {
  canvas.width = retouchImage.width;
  canvas.height = retouchImage.height;
  ctx.drawImage(retouchImage, 0, 0);
};

canvas.addEventListener('mousedown', () => { drawing = true; });
canvas.addEventListener('mouseup', () => { drawing = false; });
canvas.addEventListener('mouseout', () => { drawing = false; });

canvas.addEventListener('mousemove', function (e) {
  if (!drawing) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  blurArea(x, y);
});

function blurArea(x, y) {
  const size = 20;
  const imageData = ctx.getImageData(x - size/2, y - size/2, size, size);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = data[i + 1] = data[i + 2] = avg;
  }

  ctx.putImageData(imageData, x - size/2, y - size/2);
}


