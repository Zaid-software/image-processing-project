
const SplineApp = {

    canvas: document.getElementById('canvas'),
    ctx: document.getElementById('canvas').getContext('2d'),
    points: [],
    isInterpolated: false,
    isEditing: false,
    selectedPoint: null,
    tension: 0.5,


    init() {

        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
        
        document.getElementById('clearBtn').addEventListener('click', () => this.clearCanvas());
        document.getElementById('interpolateBtn').addEventListener('click', () => this.toggleInterpolation());
        document.getElementById('editBtn').addEventListener('click', () => this.toggleEditing());
        document.getElementById('tensionSlider').addEventListener('input', (e) => this.updateTension(e));
        
        this.draw();
    },


    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (this.isEditing) {

            for (let i = 0; i < this.points.length; i++) {
                const p = this.points[i];
                if (Math.sqrt((x - p.x) ** 2 + (y - p.y) ** 2) < 10) {
                    this.selectedPoint = i;
                    return;
                }
            }
        } else {

            this.points.push({ x, y });
            this.draw();
        }
    },


    handleMouseMove(e) {
        if (this.selectedPoint !== null) {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.points[this.selectedPoint].x = x;
            this.points[this.selectedPoint].y = y;
            this.draw();
        }
    },


    handleMouseUp() {
        this.selectedPoint = null;
    },


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        

        this.ctx.fillStyle = 'red';
        this.points.forEach(p => {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
            this.ctx.fill();
        });

        if (this.points.length > 1) {
            if (this.isInterpolated) {
                this.drawSpline();
            } else {
                this.drawBrokenLine();
            }
        }
    },


    drawBrokenLine() {
        this.ctx.strokeStyle = 'blue';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.points[0].x, this.points[0].y);
        
        for (let i = 1; i < this.points.length; i++) {
            this.ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        
        this.ctx.stroke();
    },

   
    drawSpline() {
        if (this.points.length < 2) return;

        this.ctx.strokeStyle = 'green';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        

        this.ctx.moveTo(this.points[0].x, this.points[0].y);
        

        for (let i = 0; i < this.points.length - 1; i++) {
            const p0 = i > 0 ? this.points[i - 1] : this.points[0];
            const p1 = this.points[i];
            const p2 = this.points[i + 1];
            const p3 = i < this.points.length - 2 ? this.points[i + 2] : p2;
            
            for (let t = 0; t <= 1; t += 0.05) {
                const point = this.catmullRom(p0, p1, p2, p3, t, this.tension);
                this.ctx.lineTo(point.x, point.y);
            }
        }
        
        this.ctx.stroke();
    },


    catmullRom(p0, p1, p2, p3, t, tension) {
        const t2 = t * t;
        const t3 = t2 * t;
        
        const s = tension;
        
        const a = 2 * p1.x - 2 * p2.x + s * p0.x + s * p3.x;
        const b = -3 * p1.x + 3 * p2.x - 2 * s * p0.x - s * p3.x;
        const c = s * p0.x;
        const d = p1.x;
        
        const e = 2 * p1.y - 2 * p2.y + s * p0.y + s * p3.y;
        const f = -3 * p1.y + 3 * p2.y - 2 * s * p0.y - s * p3.y;
        const g = s * p0.y;
        const h = p1.y;
        
        return {
            x: a * t3 + b * t2 + c * t + d,
            y: e * t3 + f * t2 + g * t + h
        };
    },

    clearCanvas() {
        this.points = [];
        this.isInterpolated = false;
        this.isEditing = false;
        document.getElementById('interpolateBtn').textContent = 'Interpolate';
        document.getElementById('editBtn').textContent = 'Edit Points';
        this.draw();
    },

    toggleInterpolation() {
        this.isInterpolated = !this.isInterpolated;
        document.getElementById('interpolateBtn').textContent = 
            this.isInterpolated ? 'Show Broken Line' : 'Interpolate';
        this.draw();
    },

    toggleEditing() {
        this.isEditing = !this.isEditing;
        document.getElementById('editBtn').textContent = 
            this.isEditing ? 'Finish Editing' : 'Edit Points';
        this.draw();
    },

    updateTension(e) {
        this.tension = parseFloat(e.target.value);
        if (this.isInterpolated) this.draw();
    }
};

window.onload = () => SplineApp.init();
