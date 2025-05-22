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
  ctx.drawImage(originalImage, 0, 0);
};

function applyFilter() {
  const filterType = document.getElementById('filter').value;
  ctx.drawImage(originalImage, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    switch (filterType) {
      case 'grayscale':
        const avg = (r + g + b) / 3;
        data[i] = data[i + 1] = data[i + 2] = avg;
        break;
      case 'sepia':
        data[i]     = 0.393 * r + 0.769 * g + 0.189 * b;
        data[i + 1] = 0.349 * r + 0.686 * g + 0.168 * b;
        data[i + 2] = 0.272 * r + 0.534 * g + 0.131 * b;
        break;
      case 'invert':
        data[i]     = 255 - r;
        data[i + 1] = 255 - g;
        data[i + 2] = 255 - b;
        break;
      
    }
  }

  ctx.putImageData(imageData, 0, 0);
  
  function downloadImage() {
  const link = document.createElement('a');
  link.download = 'filtered-image.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}
}
