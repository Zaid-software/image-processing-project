let scaleImageObj = new Image();
let scaleCanvas = document.getElementById('scaleCanvas');
let scaleCtx = scaleCanvas.getContext('2d');

document.getElementById('uploadScale').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    scaleImageObj.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

function scaleImage() {
  const ratio = parseFloat(document.getElementById('scaleRatio').value);
  if (isNaN(ratio) || ratio <= 0) {
    alert("Please enter a valid scale ratio.");
    return;
  }

  const newWidth = scaleImageObj.width * ratio;
  const newHeight = scaleImageObj.height * ratio;

  scaleCanvas.width = newWidth;
  scaleCanvas.height = newHeight;

  scaleCtx.clearRect(0, 0, newWidth, newHeight);
  scaleCtx.drawImage(scaleImageObj, 0, 0, newWidth, newHeight);
}

function downloadScaledImage() {
  const link = document.createElement('a');
  link.download = 'scaled-image.png';
  link.href = scaleCanvas.toDataURL('image/png');
  link.click();
}

