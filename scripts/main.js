`use strict`;

let DEBUG = 1;

let canvas = {
    element: document.getElementById("canvas"),
    context: document.getElementById("canvas").getContext("2d"),

    resize: function () {
        this.element.width = window.innerWidth;
        this.element.height = window.innerHeight;
    },

    clear: function () {
        this.context.clearRect(0, 0, this.element.width, this.element.height);
    },
};

let state = {
    draging: false,

    mousePos: {
        x: undefined,
        y: undefined,
    },

    mouseOffset: {
        x: undefined,
        y: undefined,
    },
};

let rectangle = {
    x: 100,
    y: 100,
    width: 200,
    height: 200,
    color: "rgba(200, 0, 0, 0.5)",

    draw: function () {
        canvas.context.fillStyle = this.color;
        canvas.context.fillRect(this.x, this.y, this.width, this.height);
    }
};



canvas.resize();
render();

window.onresize = function (e) {
    if (DEBUG) { console.log(`window 'resize' event occured`) };

    canvas.resize();
    render();
};

window.oncontextmenu = function (e) {
    if (DEBUG) { console.log(`window 'oncontextmenu' event occured`) };
    
    e.preventDefault();

    render();
};

canvas.element.onmousedown = function (e) {
    if (DEBUG) { console.log(`'mousedown' event occured`) };

    e.preventDefault();

    state.draging = true;

    state.mouseOffset.x = e.clientX - rectangle.x;
    state.mouseOffset.y = e.clientY - rectangle.y;

    render();
};

canvas.element.onmouseup = function (e) {
    if (DEBUG) { console.log(`'mouseup' event occured`) };
    
    e.preventDefault();

    state.draging = false;

    render();
};

canvas.element.onmousemove = function (e) {
    if (DEBUG) { console.log(`'mousemove' event occured`) };
    
    e.preventDefault();

    state.mousePos.x = e.clientX;
    state.mousePos.y = e.clientY;

    if (state.draging) {
        rectangle.x = state.mousePos.x - state.mouseOffset.x;
        rectangle.y = state.mousePos.y - state.mouseOffset.y;
    };

    render();
}

canvas.element.onwheel = function (e) {
    if (DEBUG) { console.log(`'wheel' event occured`) };
    
    e.preventDefault();

    rectangle.y += e.deltaY / Math.abs(e.deltaY) * rectangle.height;

    render();
};

canvas.element.ontouchstart = function (e) {
    if (DEBUG) { console.log(`'touchstart' event occured`) };
    
    e.preventDefault();

    state.draging = true;

    state.mouseOffset.x = e.touches[0].clientX - rectangle.x;
    state.mouseOffset.y = e.touches[0].clientY - rectangle.y;

    render();
};

canvas.element.ontouchend = function (e) {
    if (DEBUG) { console.log(`'touchend' event occured`) };
    
    e.preventDefault();

    state.draging = false;

    render();
};

canvas.element.ontouchmove = function (e) {
    if (DEBUG) { console.log(`'touchmove' event occured`) };
    
    e.preventDefault();

    state.mousePos.x = e.touches[0].clientX;
    state.mousePos.y = e.touches[0].clientY;

    if (state.draging) {
        rectangle.x = state.mousePos.x - state.mouseOffset.x;
        rectangle.y = state.mousePos.y - state.mouseOffset.y;
    }

    render();
};



function render() {
    canvas.clear();
    drawLog();
    rectangle.draw();
};

function drawLog() {
    let fontSize = 24;

    canvas.context.fillStyle = "rgba(0, 0, 0, 1)";
    canvas.context.font = `${fontSize}px courier`;

    canvas.context.fillText(`${state.draging ? "Draging" : "Not draging"}`, 10, fontSize);
    canvas.context.fillText(
        `Mouse position:    ` +
        `[${state.mousePos.x}, ${state.mousePos.y}]`,
        10, fontSize * 2
    );
    canvas.context.fillText(
        `Rectangle position:` +
        `[${rectangle.x}, ${rectangle.y}]`,
        10, fontSize * 3
    );
    canvas.context.fillText(
        `Mouse offset:      ` +
        `[${state.mouseOffset.x}, ${state.mouseOffset.y}]`,
        10, fontSize * 4
    );
    canvas.context.fillText(
        `Window size:       ` +
        `[${document.documentElement.clientWidth}` +
        ` x ` +
        `${document.documentElement.clientHeight}]`,
        10, fontSize * 5
    );
};