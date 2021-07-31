`use strict`;

let DEBUG = 1;

function draw() {
    let canvas = document.getElementById("canvas");

    if (!canvas.getContext) { return }; // Canvas support check (obsolete)

    let ctx = canvas.getContext("2d");
    let draging = false;

    let mousePos = {
        x: undefined,
        y: undefined,
    };

    let mouseOffset = {
        x: 0,
        y: 0,
    };

    let rectangle = {
        x: 100,
        y: 100,
        width: 200,
        height: 200,
        color: "rgba(200, 0, 0, 0.5)",

        draw: function () {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };

    resizeCanvas();
    render();

    window.onresize = function (e) {
        resizeCanvas();

        if (DEBUG) {console.log(`window 'resize' event occured`)};

        render();
    };

    window.oncontextmenu = function (e) {
        e.preventDefault();

        if (DEBUG) {console.log(`window 'oncontextmenu' event occured`)};

        render();
    };

    canvas.onmousedown = function (e) {
        e.preventDefault();

        draging = true;

        mouseOffset.x = e.clientX - rectangle.x;
        mouseOffset.y = e.clientY - rectangle.y;

        if (DEBUG) {console.log(`'mousedown' event occured`)};

        render();
    };

    canvas.onmouseup = function (e) {
        e.preventDefault();

        draging = false;

        if (DEBUG) {console.log(`'mouseup' event occured`)};

        render();
    };

    canvas.onmousemove = function (e) {
        e.preventDefault();

        mousePos.x = e.clientX;
        mousePos.y = e.clientY;

        if (draging) {
            rectangle.x = mousePos.x - mouseOffset.x;
            rectangle.y = mousePos.y - mouseOffset.y;
        };

        if (DEBUG) {console.log(`'mousemove' event occured`)};

        render();
    }

    canvas.onwheel = function (e) {
        e.preventDefault();

        rectangle.y += e.deltaY / Math.abs(e.deltaY) * rectangle.height;

        if (DEBUG) {console.log(`'wheel' event occured`)};

        render();
    };

    canvas.ontouchstart = function (e) {
        e.preventDefault();

        draging = true;

        mouseOffset.x = e.touches[0].clientX - rectangle.x;
        mouseOffset.y = e.touches[0].clientY - rectangle.y;

        if (DEBUG) {console.log(`'touchstart' event occured`)};

        render();
    };

    canvas.ontouchend = function (e) {
        e.preventDefault();

        draging = false;

        if (DEBUG) {console.log(`'touchend' event occured`)};

        render();
    };

    canvas.ontouchmove = function (e) {
        e.preventDefault();

        mousePos.x = e.touches[0].clientX;
        mousePos.y = e.touches[0].clientY;

        if (draging) {
            rectangle.x = mousePos.x - mouseOffset.x;
            rectangle.y = mousePos.y - mouseOffset.y;
        }

        if (DEBUG) {console.log(`'touchmove' event occured`)};

        render();
    };

    function render() {
        clearCanvas();
        drawLog();
        rectangle.draw();
    };

    function drawLog() {
        let fontSize = 24;

        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        ctx.font = `${fontSize}px courier`;

        ctx.fillText(`${draging ? "Draging" : "Not draging"}`, 10, fontSize);
        ctx.fillText(
            `Mouse position:    ` +
            `[${mousePos.x}, ${mousePos.y}]`,
            10, fontSize * 2
        );
        ctx.fillText(
            `Rectangle position:` +
            `[${rectangle.x}, ${rectangle.y}]`,
            10, fontSize * 3
        );
        ctx.fillText(
            `Mouse offset:      ` +
            `[${mouseOffset.x}, ${mouseOffset.y}]`,
            10, fontSize * 4
        );
        ctx.fillText(
            `Window size:       ` +
            `[${document.documentElement.clientWidth}` +
            ` x ` +
            `${document.documentElement.clientHeight}]`,
            10, fontSize * 5
        );
    };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
}