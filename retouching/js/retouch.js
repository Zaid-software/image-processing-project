let retouchImage = new Image();
const canvas = document.getElementById('retouchCanvas');
const ctx = canvas.getContext('2d');

let drawing = false;
let currentEffect = 'blur';
let brushSize = 20;


document.getElementById('effectBlur').addEventListener('click', () => {
  currentEffect = 'blur';
});
document.getElementById('effectSepia').addEventListener('click', () => {
  currentEffect = 'sepia';
});
document.getElementById('effectRedTint').addEventListener('click', () => {
  currentEffect = 'redtint';
});

document.getElementById('uploadRetouch').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    retouchImage.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

retouchImage.onload = function() {
  canvas.width = retouchImage.width;
  canvas.height = retouchImage.height;
  ctx.drawImage(retouchImage, 0, 0);
};

canvas.addEventListener('mousedown', () => drawing = true);
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mouseout', () => drawing = false);

canvas.addEventListener('mousemove', function(e) {
  if (!drawing) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (currentEffect === 'blur') {
    applyGaussianBlur(x, y);
  } else if (currentEffect === 'sepia') {
    applySepia(x, y);
  } else if (currentEffect === 'redtint') {
    applyRedTint(x, y);
  }
});

function applyGaussianBlur(x, y) {
  const radius = brushSize / 2;
  const diameter = radius * 2;
  const kernel = createGaussianKernel(radius);
  
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  tempCanvas.width = diameter;
  tempCanvas.height = diameter;
  
  tempCtx.drawImage(
    canvas,
    x - radius, y - radius, diameter, diameter,
    0, 0, diameter, diameter
  );
  
  const imageData = tempCtx.getImageData(0, 0, diameter, diameter);
  const blurredData = gaussianBlur(imageData, kernel);
  
  tempCtx.putImageData(blurredData, 0, 0);
  ctx.drawImage(tempCanvas, 0, 0, diameter, diameter, x - radius, y - radius, diameter, diameter);
}

function createGaussianKernel(radius) {
  const kernel = [];
  const sigma = radius / 3;
  let sum = 0;
  
  for (let y = -radius; y <= radius; y++) {
    for (let x = -radius; x <= radius; x++) {
      const value = Math.exp(-(x * x + y * y) / (2 * sigma * sigma));
      kernel.push(value);
      sum += value;
    }
  }
  
  return kernel.map(v => v / sum);
}

function gaussianBlur(imageData, kernel) {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const radius = Math.sqrt(kernel.length) / 2 | 0;
  const result = new Uint8ClampedArray(data.length);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      let k = 0;
      
      for (let ky = -radius; ky <= radius; ky++) {
        for (let kx = -radius; kx <= radius; kx++) {
          const px = Math.min(width - 1, Math.max(0, x + kx));
          const py = Math.min(height - 1, Math.max(0, y + ky));
          const idx = (py * width + px) * 4;
          
          r += data[idx] * kernel[k];
          g += data[idx + 1] * kernel[k];
          b += data[idx + 2] * kernel[k];
          a += data[idx + 3] * kernel[k];
          k++;
        }
      }
      
      const idx = (y * width + x) * 4;
      result[idx] = r;
      result[idx + 1] = g;
      result[idx + 2] = b;
      result[idx + 3] = a;
    }
  }
  
  return new ImageData(result, width, height);
}

function applySepia(x, y) {
  const radius = brushSize / 2;
  const diameter = radius * 2;
  const imageData = ctx.getImageData(x - radius, y - radius, diameter, diameter);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
    data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
    data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
  }

  ctx.putImageData(imageData, x - radius, y - radius);
}

function applyRedTint(x, y) {
  const radius = brushSize / 2;
  const diameter = radius * 2;
  const imageData = ctx.getImageData(x - radius, y - radius, diameter, diameter);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] * 1.5);
    data[i + 1] = data[i + 1] * 0.8;
    data[i + 2] = data[i + 2] * 0.8;
  }

  ctx.putImageData(imageData, x - radius, y - radius);
}

function downloadRetouchedImage() {
  const link = document.createElement('a');
  link.download = 'retouched-image.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}