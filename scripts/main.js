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
        h: undefined,
        v: undefined,
    },

    mouseOffset: {
        h: undefined,
        v: undefined,
    },
};

let subnet = {
    position: {
        h: 100,
        v: 100,
    },

    width: 200,
    height: 200,
    color: "rgba(200, 0, 0, 0.5)",

    draw: function () {
        canvas.context.fillStyle = this.color;
        canvas.context.fillRect(this.position.h, this.position.v, this.width, this.height);
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

    state.mouseOffset.h = e.clientX - subnet.position.h;
    state.mouseOffset.v = e.clientY - subnet.position.v;

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

    state.draging = (e.buttons != 0);

    state.mousePos.h = e.clientX;
    state.mousePos.v = e.clientY;

    if (state.draging) {
        subnet.position.h = state.mousePos.h - state.mouseOffset.h;
        subnet.position.v = state.mousePos.v - state.mouseOffset.v;
    };

    render();
}

canvas.element.onmouseleave = function (e) {
    if (DEBUG) { console.log(`'mouseleave' event occured`) };

    e.preventDefault();

    state.draging = false;

    render();
}

canvas.element.onwheel = function (e) {
    if (DEBUG) { console.log(`'wheel' event occured`) };

    e.preventDefault();

    subnet.position.v += e.deltaY / Math.abs(e.deltaY) * subnet.height;

    render();
};

canvas.element.ontouchstart = function (e) {
    if (DEBUG) { console.log(`'touchstart' event occured`) };

    e.preventDefault();

    state.draging = true;

    state.mouseOffset.h = e.touches[0].clientX - subnet.position.h;
    state.mouseOffset.v = e.touches[0].clientY - subnet.position.v;

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

    state.mousePos.h = e.touches[0].clientX;
    state.mousePos.v = e.touches[0].clientY;

    if (state.draging) {
        subnet.position.h = state.mousePos.h - state.mouseOffset.h;
        subnet.position.v = state.mousePos.v - state.mouseOffset.v;
    }

    render();
};



function render() {
    canvas.clear();
    drawLog();
    subnet.draw();
};

function drawLog() {
    let fontSize = 24;

    canvas.context.fillStyle = "rgba(0, 0, 0, 1)";
    canvas.context.font = `${fontSize}px courier`;

    canvas.context.fillText(`${state.draging ? "Draging" : "Not draging"}`, 10, fontSize);
    canvas.context.fillText(
        `Mouse position:    ` +
        `[${state.mousePos.h}, ${state.mousePos.v}]`,
        10, fontSize * 2
    );
    canvas.context.fillText(
        `Rectangle position:` +
        `[${subnet.position.h}, ${subnet.position.v}]`,
        10, fontSize * 3
    );
    canvas.context.fillText(
        `Mouse offset:      ` +
        `[${state.mouseOffset.h}, ${state.mouseOffset.v}]`,
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