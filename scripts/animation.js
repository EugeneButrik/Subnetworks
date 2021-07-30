`use strict`;

function draw() {
    let canvas = document.getElementById("canvas");

    if (!canvas.getContext) { return }; // Canvas support check

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

    let testRect = {
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        color: "rgba(200, 0, 0, 0.5)",

        draw: function () {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };

    function drawLog() {
        ctx.fillStyle = "rgba(0, 0, 0, 1)";

        let fontSize = 24;
        ctx.font = `${fontSize}px courier`;

        ctx.fillText(`${draging ? "Draging" : "Not draging"}`, 10, fontSize);
        ctx.fillText(`Mouse position:       [${mousePos.x}, ${mousePos.y}]`, 10, fontSize * 2);
        ctx.fillText(`Rectangular position: [${testRect.x}, ${testRect.y}]`, 10, fontSize * 3);
        ctx.fillText(`Mouse offset:         [${mouseOffset.x}, ${mouseOffset.y}]`, 10, fontSize * 4);
    };

    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    canvas.addEventListener('mousemove', function (e) {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;

        clear();
        drawLog();

        if (e.buttons == 1) {
            draging = true;

            testRect.x = mousePos.x - mouseOffset.x;
            testRect.y = mousePos.y - mouseOffset.y;
        } else {
            draging = false;

            mouseOffset.x = mousePos.x - testRect.x;
            mouseOffset.y = mousePos.y - testRect.y;
        }

        testRect.draw();
    });

    drawLog();
    testRect.draw();
}