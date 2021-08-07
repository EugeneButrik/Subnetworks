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

	pointerPosition: {
		h: undefined,
		v: undefined,
	},

	panDisplacement: {
		h: 0,
		v: 0,
	},
};

let infoPanel = {
	logStrings: [],
	logLastMessage: undefined,
	repeated: 1,
	logMaxStrings: 5,

	log: function (s) {
		if (s == this.logLastMessage) {
			this.logStrings[0] = `|${++this.repeated}| ` + s;
		} else {
			this.logStrings.unshift(s);

			this.logLastMessage = s;
			this.repeated = 1;
		};

		if (this.logStrings.length > this.logMaxStrings) {
			this.logStrings.pop();
		};
	},

	draw: function () {
		canvas.context.fillStyle = "rgba(0, 0, 0, 1)";
		let fontSize = canvas.element.height / 60;
		canvas.context.font = `${fontSize}px courier`;

		let panelStrings = [
			`${state.panning ? "Panning" : "Not panning"}`,
	
			`Pointer on-screen position:` +
			`[${state.pointerPosition.h}, ${state.pointerPosition.v}]`,
	
			`Pan displacement:          ` +
			`[${state.panDisplacement.h}, ${state.panDisplacement.v}]`
		];

		for (let s in panelStrings) {
			canvas.context.fillText(
				panelStrings[s],
				10,
				10 + (fontSize * (+(s) + 1))
			);
		};

		for (let s in this.logStrings) {
			canvas.context.fillText(
				this.logStrings[s],
				10,
				canvas.element.height - (fontSize * (+(s) + 1))
			);
		};
	},
};

class subnet {
	position = {
		h: undefined,
		v: undefined,
	};

	width;
	height;

	color = "rgba(200, 0, 0, 0.5)";

	label = 5;

	constructor() { };

	draw() {
		canvas.context.fillStyle = this.color;

		canvas.context.strokeRect(
			this.position.h,
			this.position.v,
			this.width,
			this.height
		);

		canvas.context.fillRect(
			this.position.h,
			this.position.v,
			this.width,
			this.height
		);

		canvas.context.fillStyle = "rgba(0, 0, 0, 1)";

		let fontSize = canvas.element.height / 60;

		canvas.context.font = `${fontSize}px courier`;

		canvas.context.fillText(
			this.label,
			this.position.h + fontSize / 2,
			this.position.v + fontSize,
		);
	};
};

class column {
	position = {
		h: undefined,
		v: undefined,
	};

	elementWidth;
	elementHeight;

	subnets = [];

	constructor() { };

	draw() {
		this.position.h += state.panDisplacement.h;
		this.position.v += state.panDisplacement.v;

		let baseElementHeight = canvas.element.height / rowsInMainColumn;
		let power = (
			(canvas.element.width / 2 - this.position.h)
			/
			(canvas.element.width / columnsOnScreen)
		);
		let ratio = 1 / 2 ** power;
		this.elementHeight = baseElementHeight * ratio;

		this.elementWidth = canvas.element.width / columnsOnScreen;

		for (let s in this.subnets) {
			this.subnets[s].width = this.elementWidth;
			this.subnets[s].height = this.elementHeight;

			this.subnets[s].position.h = this.position.h - this.elementWidth / 2;
			this.subnets[s].position.v = this.position.v + this.subnets[s].height * int(this.subnets[s].label);

			this.subnets[s].draw();
		};
	};

	appendBottom() {
		let newSubnet = new subnet();

		if (this.subnets.length != 0) {
			newSubnet.label = +(this.subnets[this.subnets.length - 1].label) + 1;
		} else {
			newSubnet.label = 0;
		};

		this.subnets.push(newSubnet);
	};

	appendTop() {
		let newSubnet = new subnet();

		if (this.subnets.length != 0) {
			newSubnet.label = +(this.subnets[0].label) - 1;
		} else {
			newSubnet.label = 0;
		};

		this.subnets.unshift(newSubnet);
	};

	cutBottom() {
		this.subnets.pop();
	};

	cutTop() {
		this.subnets.shift();
	};
};



canvas.resize();

let columnsOnScreen = 3;
let rowsInMainColumn = 10;

let testColumn = new column();
testColumn.position.h = int(canvas.element.width / 2);
testColumn.position.v = int(canvas.element.height / 2);

testColumn.appendBottom();
testColumn.appendBottom();
testColumn.appendBottom();
testColumn.appendTop();
testColumn.appendTop();

render();



window.addEventListener('resize', function (e) {
	if (DEBUG) { infoPanel.log(`window 'resize' event occurred`) };

	canvas.resize();

	render();
}, false);

window.addEventListener('contextmenu', function (e) {
	if (DEBUG) { infoPanel.log(`window 'contextmenu' event occurred`) };

	e.preventDefault();

	render();
}, false);

window.addEventListener('mousedown', function (e) {
	if (DEBUG) { infoPanel.log(`'mousedown' event occurred`) };

	e.preventDefault();

	state.panning = true;

	render();
}, false);

window.addEventListener('mouseup', function (e) {
	if (DEBUG) { infoPanel.log(`'mouseup' event occurred`) };

	e.preventDefault();

	state.panning = false;

	render();
}, false);

window.addEventListener('mousemove', function (e) {
	if (DEBUG) { infoPanel.log(`'mousemove' event occurred`) };

	e.preventDefault();

	if (e.buttons == 0) {
		state.panning = false;
	} else {
		state.panning = true;
	};

	if (state.panning) {
		state.panDisplacement.h = e.clientX - state.pointerPosition.h;
		state.panDisplacement.v = e.clientY - state.pointerPosition.v;
	} else {
		state.panDisplacement.h = 0;
		state.panDisplacement.v = 0;
	};

	state.pointerPosition.h = e.clientX;
	state.pointerPosition.v = e.clientY;

	render();
}, false);

canvas.element.addEventListener('wheel', function (e) {
	/*
	This event listener can not to be added to window because in that case it is
	"Unable to preventDefault inside passive event listener due to target being
	treated as passive" (Google Chrome).
	So preventDefault() method can't be called and browser can handle mouse wheel
	events, e.g. zooming with Ctrl key pressed.
	*/
	if (DEBUG) { infoPanel.log(`'wheel' event occurred`) };

	e.preventDefault();

	if (e.deltaY < 0 && !e.altKey) {
		testColumn.cutBottom();

		if (DEBUG) { infoPanel.log(`Column bottom cut`) };
	};

	if (e.deltaY > 0 && !e.altKey) {
		testColumn.appendBottom();

		if (DEBUG) { infoPanel.log(`Column bottom appended`) };
	};

	if (e.deltaY < 0 && e.altKey) {
		testColumn.appendTop();

		if (DEBUG) { infoPanel.log(`Column top appended`) };
	};

	if (e.deltaY > 0 && e.altKey) {
		testColumn.cutTop();

		if (DEBUG) { infoPanel.log(`Column top cut`) };
	};

	render();
}, false);

canvas.element.addEventListener('touchstart', function (e) {
	if (DEBUG) { infoPanel.log(`'touchstart' event occurred`) };

	e.preventDefault();

	state.panning = true;

	state.pointerPosition.h = e.touches[0].clientX;
	state.pointerPosition.v = e.touches[0].clientY;

	render();
}, true);

canvas.element.addEventListener('touchend', function (e) {
	if (DEBUG) { infoPanel.log(`'touchend' event occurred`) };

	e.preventDefault();

	state.panning = false;

	render();
}, false);

canvas.element.addEventListener('touchmove', function (e) {
	if (DEBUG) { infoPanel.log(`'touchmove' event occurred`) };

	e.preventDefault();

	state.panDisplacement.h = int(e.touches[0].clientX) - state.pointerPosition.h;
	state.panDisplacement.v = int(e.touches[0].clientY) - state.pointerPosition.v;

	state.pointerPosition.h = int(e.touches[0].clientX);
	state.pointerPosition.v = int(e.touches[0].clientY);

	render();
}, false);



function render() {
	canvas.clear();

	infoPanel.draw();

	testColumn.draw();
};

function int(number) {
	return +(number.toFixed());
};