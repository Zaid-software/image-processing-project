let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let outputCanvas = document.getElementById('output');
let outputCtx = outputCanvas.getContext('2d');

let image = new Image();
let points = [];
let selecting = false;

document.getElementById('upload').addEventListener('change', function(e) {
  const reader = new FileReader();
  reader.onload = function(event) {
    image.src = event.target.result;
  };
  reader.readAsDataURL(e.target.files[0]);
});

image.onload = function() {
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
};

canvas.addEventListener('click', function(e) {
  if (!selecting) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  points.push({ x, y });
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fill();

  if (points.length === 6) {
    selecting = false;
    alert("6 points selected (3 source + 3 destination)");
  }
});

function startSelection() {
  points = [];
  selecting = true;
  ctx.drawImage(image, 0, 0);
}

function applyTransformation() {
  if (points.length !== 6) {
    alert("Select exactly 3 source and 3 destination points");
    return;
  }

  const src = points.slice(0, 3);
  const dst = points.slice(3, 6);



  bilinearScale(image, outputCanvas, 1.5);
}

function bilinearScale(img, outCanvas, scale) {
  const srcCanvas = document.createElement('canvas');
  srcCanvas.width = img.width;
  srcCanvas.height = img.height;
  const srcCtx = srcCanvas.getContext('2d');
  srcCtx.drawImage(img, 0, 0);
  const srcData = srcCtx.getImageData(0, 0, img.width, img.height).data;

  const outCtx = outCanvas.getContext('2d');
  const outWidth = Math.floor(img.width * scale);
  const outHeight = Math.floor(img.height * scale);
  outCanvas.width = outWidth;
  outCanvas.height = outHeight;
  const outImage = outCtx.createImageData(outWidth, outHeight);

  for (let y = 0; y < outHeight; y++) {
    for (let x = 0; x < outWidth; x++) {
      const gx = x / scale;
      const gy = y / scale;
      const x1 = Math.floor(gx);
      const y1 = Math.floor(gy);
      const x2 = Math.min(x1 + 1, img.width - 1);
      const y2 = Math.min(y1 + 1, img.height - 1);

      const dx = gx - x1;
      const dy = gy - y1;

      for (let c = 0; c < 3; c++) {
        const i11 = ((y1 * img.width) + x1) * 4 + c;
        const i21 = ((y1 * img.width) + x2) * 4 + c;
        const i12 = ((y2 * img.width) + x1) * 4 + c;
        const i22 = ((y2 * img.width) + x2) * 4 + c;

        const val = (1 - dx) * (1 - dy) * srcData[i11] +
                    dx * (1 - dy) * srcData[i21] +
                    (1 - dx) * dy * srcData[i12] +
                    dx * dy * srcData[i22];

        outImage.data[(y * outWidth + x) * 4 + c] = val;
      }
      outImage.data[(y * outWidth + x) * 4 + 3] = 255;
    }
  }

  outCtx.putImageData(outImage, 0, 0);
}
