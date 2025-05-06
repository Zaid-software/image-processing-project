let originalImage = new Image();
let canvas = document.getElementById('canvas');
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

originalImage.onload = function () {
  canvas.width = originalImage.width;
  canvas.height = originalImage.height;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(originalImage, 0, 0);
};

function rotateImage() {
  const angle = parseInt(document.getElementById('angle').value);
  
  if (angle === 0) {
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(originalImage, 0, 0);
    return;
  }

  const angleRad = angle * Math.PI / 180;
  const offscreenCanvas = document.createElement('canvas');
  const offscreenCtx = offscreenCanvas.getContext('2d');

  if (angle === 90 || angle === 270) {
    offscreenCanvas.width = originalImage.height;
    offscreenCanvas.height = originalImage.width;
  } else {
    offscreenCanvas.width = originalImage.width;
    offscreenCanvas.height = originalImage.height;
  }

  offscreenCtx.translate(offscreenCanvas.width / 2, offscreenCanvas.height / 2);
  offscreenCtx.rotate(angleRad);
  offscreenCtx.drawImage(originalImage, -originalImage.width / 2, -originalImage.height / 2);

  canvas.width = offscreenCanvas.width;
  canvas.height = offscreenCanvas.height;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(offscreenCanvas, 0, 0);
}
