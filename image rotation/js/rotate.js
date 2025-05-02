function rotateImage() {
    const input = document.getElementById('upload');
    const angle = parseInt(document.getElementById('angle').value);
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
  
    if (input.files && input.files[0]) {
      const img = new Image();
      img.onload = function () {
        // Set canvas size based on angle
        if (angle === 90 || angle === 270) {
          canvas.width = img.height;
          canvas.height = img.width;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }
  
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
  

        switch (angle) {
          case 0:

            ctx.drawImage(img, 0, 0);
            break;
          case 90:
            ctx.translate(canvas.width, 0);
            ctx.rotate(Math.PI / 2);
            ctx.drawImage(img, 0, 0);
            break;
          case 180:
            ctx.translate(canvas.width, canvas.height);
            ctx.rotate(Math.PI);
            ctx.drawImage(img, 0, 0);
            break;
          case 270:
            ctx.translate(0, canvas.height);
            ctx.rotate(3 * Math.PI / 2);
            ctx.drawImage(img, 0, 0);
            break;
        }
  
        ctx.restore();
      };
  
      const reader = new FileReader();
      reader.onload = function (e) {
        img.src = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  