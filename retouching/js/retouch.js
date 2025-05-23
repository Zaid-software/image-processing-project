let retouchImage = new Image();
const canvas = document.getElementById('retouchCanvas');
const ctx = canvas.getContext('2d');

let drawing = false;
let currentEffect = 'blur';
let brushSize = 20;

document.getElementById('uploadRetouch').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    retouchImage.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

document.getElementById('effectBlur').addEventListener('click', () => {
  currentEffect = 'blur';
  setActiveButton('effectBlur');
});
document.getElementById('effectSepia').addEventListener('click', () => {
  currentEffect = 'sepia';
  setActiveButton('effectSepia');
});
document.getElementById('effectRedTint').addEventListener('click', () => {
  currentEffect = 'redtint';
  setActiveButton('effectRedTint');
});

document.getElementById('brushSize').addEventListener('input', function(e) {
  brushSize = parseInt(e.target.value);
  document.getElementById('brushSizeValue').textContent = brushSize;
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

  if (currentEffect === 'blur') {
    applyBlur(x, y);
  } else if (currentEffect === 'sepia') {
    applySepia(x, y);
  } else if (currentEffect === 'redtint') {
    applyRedTint(x, y);
  }
});

function applyBlur(x, y) {
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  tempCanvas.width = brushSize;
  tempCanvas.height = brushSize;
  
  tempCtx.drawImage(
    canvas, 
    x - brushSize/2, y - brushSize/2, brushSize, brushSize,
    0, 0, brushSize, brushSize
  );
  
  const blurPasses = 2;
  for (let i = 0; i < blurPasses; i++) {
    tempCtx.globalAlpha = 0.5;
    tempCtx.drawImage(
      tempCanvas,
      0, 0, brushSize, brushSize,
      0, 0, brushSize/2, brushSize/2
    );
    tempCtx.drawImage(
      tempCanvas,
      0, 0, brushSize/2, brushSize/2,
      0, 0, brushSize, brushSize
    );
  }
  
  ctx.drawImage(
    tempCanvas,
    0, 0, brushSize, brushSize,
    x - brushSize/2, y - brushSize/2, brushSize, brushSize
  );
}

function applySepia(x, y) {
  const imageData = ctx.getImageData(x - brushSize/2, y - brushSize/2, brushSize, brushSize);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
    data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
    data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
  }

  ctx.putImageData(imageData, x - brushSize/2, y - brushSize/2);
}

function applyRedTint(x, y) {
  const imageData = ctx.getImageData(x - brushSize/2, y - brushSize/2, brushSize, brushSize);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] * 1.5);
    data[i + 1] = data[i + 1] * 0.8;
    data[i + 2] = data[i + 2] * 0.8;
  }

  ctx.putImageData(imageData, x - brushSize/2, y - brushSize/2);
}

function setActiveButton(buttonId) {
  document.querySelectorAll('.effect-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.getElementById(buttonId).classList.add('active');
}

function downloadRetouchedImage() {
  const link = document.createElement('a');
  link.download = 'retouched-image.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}