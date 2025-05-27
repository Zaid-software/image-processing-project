let originalImage = new Image();
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

document.getElementById('upload').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    originalImage.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

originalImage.onload = function () {
  // Initial draw
  canvas.width = originalImage.width;
  canvas.height = originalImage.height;
  ctx.drawImage(originalImage, 0, 0);
};

function scaleImage() {
  const factor = parseFloat(document.getElementById('scaleFactor').value);
  if (isNaN(factor) || factor <= 0) {
    alert("Enter a valid scale factor greater than 0.");
    return;
  }

  const newWidth = originalImage.width * factor;
  const newHeight = originalImage.height * factor;

  canvas.width = newWidth;
  canvas.height = newHeight;
  ctx.clearRect(0, 0, newWidth, newHeight);
  ctx.drawImage(originalImage, 0, 0, newWidth, newHeight);
}


