`use strict`;

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
        width: 100,
        height: 100,
        color: "rgba(200, 0, 0, 0.5)",

        draw: function () {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };

    render();

    window.addEventListener('resize', function () {
        render();
    });

    canvas.addEventListener('mousemove', function (e) {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;

        if (e.buttons == 1) {
            draging = true;

            rectangle.x = mousePos.x - mouseOffset.x;
            rectangle.y = mousePos.y - mouseOffset.y;
        } else {
            draging = false;

            mouseOffset.x = mousePos.x - rectangle.x;
            mouseOffset.y = mousePos.y - rectangle.y;
        }

        render();
    });

    canvas.addEventListener('wheel', function (e) {
        rectangle.width += +(e.deltaY * 0.1).toFixed();
        rectangle.height += +(e.deltaY * 0.1).toFixed();
        // Both prior values need to be rounded due to precision loss (found in Firefox)

        render();
    });

    function render() {
        prepareCanvas();
        drawLog();
        rectangle.draw();
    }

    function drawLog() {
        ctx.fillStyle = "rgba(0, 0, 0, 1)";

        let fontSize = 24;
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
            `Rectangle size:    ` +
            `[${rectangle.width} x ${rectangle.height}]`,
            10, fontSize * 5
        );
        ctx.fillText(
            `Window size:       ` +
            `[${document.documentElement.clientWidth}` +
            ` x ` +
            `${document.documentElement.clientHeight}]`,
            10, fontSize * 6
        );
    };

    function prepareCanvas() {
        canvas.width = document.documentElement.clientWidth;
        canvas.height = document.documentElement.clientHeight - 4;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
}