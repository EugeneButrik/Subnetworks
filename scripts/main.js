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
    panning: false,

    pointerOnScreenPosition: {
        h: undefined,
        v: undefined,
    },

    panOffset: {
        h: undefined,
        v: undefined,
    },

    spaceOriginOnScreenPosition: {
        h: undefined,
        v: undefined,
    },
};

let subnet = {
    position: {
        h: 0,
        v: 0,
    },

    width: 200,
    height: 200,

    color: "rgba(200, 0, 0, 0.5)",

    draw: function () {
        this.position.h = state.spaceOriginOnScreenPosition.h - this.width / 2;
        this.position.v = state.spaceOriginOnScreenPosition.v - this.height / 2;

        canvas.context.fillStyle = this.color;

        canvas.context.fillRect(this.position.h, this.position.v, this.width, this.height);
    }
};



canvas.resize();

state.spaceOriginOnScreenPosition.h = +((canvas.element.width / 2).toFixed());
state.spaceOriginOnScreenPosition.v = +((canvas.element.height / 2).toFixed());

render();



window.addEventListener('resize', function (e) {
    if (DEBUG) { console.log(`window 'resize' event occured`) };

    canvas.resize();

    render();
}, false);

window.addEventListener('contextmenu', function (e) {
    if (DEBUG) { console.log(`window 'contextmenu' event occured`) };

    e.preventDefault();

    render();
}, false);

window.addEventListener('mousedown', function (e) {
    if (DEBUG) { console.log(`'mousedown' event occured`) };
    
    e.preventDefault();
    
    state.panning = true;
    
    state.panOffset.h = int(e.clientX - state.spaceOriginOnScreenPosition.h);
    state.panOffset.v = int(e.clientY - state.spaceOriginOnScreenPosition.v);
    
    render();
}, false);

window.addEventListener('mouseup', function (e) {
    if (DEBUG) { console.log(`'mouseup' event occured`) };

    e.preventDefault();

    state.panning = false;

    render();
}, false);

window.addEventListener('mousemove', function (e) {
    if (DEBUG) { console.log(`'mousemove' event occured`) };

    e.preventDefault();

    state.pointerOnScreenPosition.h = int(e.clientX);
    state.pointerOnScreenPosition.v = int(e.clientY);

    if (e.buttons == 0) {
        state.panning = false;
    } else {
        state.panning = true;
    };

    if (state.panning) {
        state.spaceOriginOnScreenPosition.h =
            state.pointerOnScreenPosition.h - state.panOffset.h;

        state.spaceOriginOnScreenPosition.v =
            state.pointerOnScreenPosition.v - state.panOffset.v;
    };

    render();
}, false);

canvas.element.addEventListener('wheel', function (e) {
    /*
    This event listener can not to be added to window because in that case it is
    "Unable to preventDefault inside passive event listener
    due to target being treated as passive" (Google Chrome).
    So preventDefault() method can't be called and browser can handle mouse wheel events,
    e.g. zooming with Ctrl key pressed.
    */
    if (DEBUG) { console.log(`'wheel' event occured`) };

    e.preventDefault();

    state.spaceOriginOnScreenPosition.v += int(e.deltaY / Math.abs(e.deltaY) * subnet.height);

    render();
}, false);

canvas.element.addEventListener('touchstart', function (e) {
    if (DEBUG) { console.log(`'touchstart' event occured`) };

    e.preventDefault();

    state.panning = true;

    state.panOffset.h =
        int(e.touches[0].clientX - state.spaceOriginOnScreenPosition.h);
    state.panOffset.v =
        int(e.touches[0].clientY - state.spaceOriginOnScreenPosition.v);

    render();
}, true);

canvas.element.addEventListener('touchend', function (e) {
    if (DEBUG) { console.log(`'touchend' event occured`) };

    e.preventDefault();

    state.panning = false;

    render();
}, false);

canvas.element.addEventListener('touchmove', function (e) {
    if (DEBUG) { console.log(`'touchmove' event occured`) };

    e.preventDefault();

    state.pointerOnScreenPosition.h = int(e.touches[0].clientX);
    state.pointerOnScreenPosition.v = int(e.touches[0].clientY);

    if (state.panning) {
        state.spaceOriginOnScreenPosition.h =
            state.pointerOnScreenPosition.h - state.panOffset.h;
        state.spaceOriginOnScreenPosition.v =
            state.pointerOnScreenPosition.v - state.panOffset.v;
    }

    render();
}, false);



function render() {
    canvas.clear();
    drawLog();
    subnet.draw();
};

function int(number) {
    return +(number.toFixed());
};

function drawLog() {
    let fontSize = 24;

    canvas.context.fillStyle = "rgba(0, 0, 0, 1)";
    canvas.context.font = `${fontSize}px courier`;

    canvas.context.fillText(`${state.panning ? "Panning" : "Not panning"}`, 10, fontSize);
    canvas.context.fillText(
        `Pointer on-screen position:     ` +
        `[${state.pointerOnScreenPosition.h}, ${state.pointerOnScreenPosition.v}]`,
        10, fontSize * 2
    );
    canvas.context.fillText(
        `Pan offset:                     ` +
        `[${state.panOffset.h}, ${state.panOffset.v}]`,
        10, fontSize * 3
    );
    canvas.context.fillText(
        `Space origin on-screen position:` +
        `[${state.spaceOriginOnScreenPosition.h}, ${state.spaceOriginOnScreenPosition.v}]`,
        10, fontSize * 4
    );
};