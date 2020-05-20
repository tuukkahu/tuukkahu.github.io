class Body {
    constructor(x, y, width) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._offset = 1;
        this._bodyimg = new Image();
    }

    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    get bodyimg() {
        return this._bodyimg;
    }

    set x(updated_x) {
        this._x = updated_x;
    }
    set y(updated_y) {
        this._y = updated_y;
    }
    set bodyimg(updated_bodyimg) {
        this._bodyimg.src = updated_bodyimg;
    }

    draw(newimg=true) {
        const canvas = document.querySelector('.background');
        const ctx = canvas.getContext('2d');
        let awidth = this._width;
        if (newimg == false) {
            this._bodyimg = new Image();
            this._bodyimg.src = 'http://localhost:8000/modules/body.png';
        }
        let ax = this._x;
        let ay = this._y;
        this._bodyimg.onload = function() {
            ctx.drawImage(this, ax, ay, awidth+2, awidth+2);
        };
        
    }
    
    hide() {
        const canvas = document.querySelector('.background');
        const ctx = canvas.getContext('2d');

        let awidth = this._width;
        let bgimage = new Image();
        bgimage.src = 'http://localhost:8000/modules/bg.png';
        let ax = this._x;
        let ay = this._y;
        bgimage.onload = function() {
            ctx.drawImage(this, ax, ay, awidth+2, awidth+2);
        };
    }

    move() {
        let newimg;
        this.draw(newimg=false);
    }
}

class Apple extends Body {
    constructor(x, y, width) {
        super(x, y, width);
    }

    drawApple() {
        const canvas = document.querySelector('.background');
        const ctx = canvas.getContext('2d');
        let appleimage = new Image();
        appleimage.src = 'http://localhost:8000/modules/apple.png';
        var ax = this._x;
        var ay = this._y;
        var aoffset = this._offset;
        var awidth = this._width;
        appleimage.onload = function() {
            ctx.drawImage(this, ax+aoffset, ay+aoffset, awidth, awidth);
        };
        return appleimage;
    }
}

export { Body, Apple };