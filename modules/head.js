class Head {
    constructor(x, y, width) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._offset = 1;
    }

    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }

    draw() {
        const canvas = document.querySelector('.background');
        const ctx = canvas.getContext('2d');
        let awidth = this._width;
        let headimg = new Image();
        headimg.src = 'http://localhost:8000/modules/head.png';
        let ax = this._x;
        let ay = this._y;
        headimg.onload = function() {
            ctx.drawImage(this, ax, ay, awidth, awidth);
        };
    }

    move(dir, body, apple, fence) {
        const canvas = document.querySelector('.background');
        const ctx = canvas.getContext('2d');

        if (body.length == 0) {
            let awidth = this._width;
            let bgimage = new Image();
            bgimage.src = 'http://localhost:8000/modules/bg.png';
            let ax = this._x;
            let ay = this._y;
            bgimage.onload = function() {
                    ctx.drawImage(this, ax, ay, awidth+2, awidth+2);
            };
        }

        let incrementx = dir[0] * (this._width + this._offset*2);
        let incrementy = dir[1] * (this._width + this._offset*2);
        
        if (this._x + incrementx > (canvas.width - 2)) {
            this._x = 0;
        } else if (this._x + incrementx < 0) {
            this._x = canvas.width - this._width - 2;
        } else if (this._y + incrementy > (canvas.width - this._offset*2)) {
            this._y = 0;
        } else if (this._y + incrementy < 0) {
            this._y = canvas.width - this._width - 2;
        } else {
            this._x += incrementx;
            this._y += incrementy;
        }

        this.draw();

        if (this._x === apple.x && this._y === apple.y) {
            return 1;
        }
        for (let i = 0; i < body.length; i++) {
            if (this._x === body[i].x && this._y === body[i].y) {
                return 2;
            }
        }
        for (let i = 0; i < fence.length; i++) {
            if (this._x === fence[i].x && this._y === fence[i].y) {
                return 2;
            }
        }

        return 0;
    }
}

export { Head };