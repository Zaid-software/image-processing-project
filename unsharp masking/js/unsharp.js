let unsharpImage = new Image();
const canvas = document.getElementById('unsharpCanvas');
const ctx = canvas.getContext('2d');

document.getElementById('uploadUnsharp').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    unsharpImage.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

unsharpImage.onload = function () {
  canvas.width = unsharpImage.width;
  canvas.height = unsharpImage.height;
  ctx.drawImage(unsharpImage, 0, 0);
};

function applyUnsharpMask() {
  const amount = parseFloat(document.getElementById('amount').value);

  const width = canvas.width;
  const height = canvas.height;

  const originalData = ctx.getImageData(0, 0, width, height);
  const blurredData = ctx.getImageData(0, 0, width, height);


  const data = blurredData.data;
  const copy = new Uint8ClampedArray(data);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const i = ((y + ky) * width + (x + kx)) * 4 + c;
            sum += copy[i];
          }
        }
        const i = (y * width + x) * 4 + c;
        data[i] = sum / 9;
      }
    }
  }


  const result = ctx.createImageData(width, height);
  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const original = originalData.data[i + c];
      const blurred = data[i + c];
      let sharpened = original + amount * (original - blurred);
      result.data[i + c] = Math.min(255, Math.max(0, sharpened));
    }
    result.data[i + 3] = 255; 
  }

  ctx.putImageData(result, 0, 0);
}

function downloadUnsharp() {
  const link = document.createElement('a');
  link.download = 'unsharp-masked-image.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}
