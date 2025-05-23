const canvas = document.getElementById('filterCanvas');
const ctx = canvas.getContext('2d');
let img = new Image();

document.getElementById('uploadFilter').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

img.onload = function () {
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
};

function applyFilter(type) {
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');

  if (type === 'bilinear') {
    tempCanvas.width = img.width * 2;
    tempCanvas.height = img.height * 2;
    tempCtx.imageSmoothingEnabled = true;
    tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
  } else if (type === 'trilinear') {
    tempCanvas.width = img.width / 2;
    tempCanvas.height = img.height / 2;
    tempCtx.imageSmoothingEnabled = true;
    tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);

    const finalCanvas = document.createElement('canvas');
    const finalCtx = finalCanvas.getContext('2d');
    finalCanvas.width = img.width;
    finalCanvas.height = img.height;
    finalCtx.imageSmoothingEnabled = true;
    finalCtx.drawImage(tempCanvas, 0, 0, finalCanvas.width, finalCanvas.height);
    tempCanvas.width = finalCanvas.width;
    tempCanvas.height = finalCanvas.height;
    tempCtx.drawImage(finalCanvas, 0, 0);
  }

  canvas.width = tempCanvas.width;
  canvas.height = tempCanvas.height;
  ctx.drawImage(tempCanvas, 0, 0);
}

function downloadFilter() {
  const link = document.createElement('a');
  link.download = 'filtered-image.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}
