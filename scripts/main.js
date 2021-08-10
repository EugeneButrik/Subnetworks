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
		this.context.clearRect(
			0,
			0,
			this.element.width,
			this.element.height
		);
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
			`[${state.pointerPosition.h}, ` +
			`${state.pointerPosition.v}]`,

			`Pan displacement:          ` +
			`[${state.panDisplacement.h}, ` +
			`${state.panDisplacement.v}]`,
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
	positionInColumn;
	IP;
	mask;
	label;

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

		this.getLabelFromIPAndMask();

		canvas.context.fillStyle = "rgba(0, 0, 0, 1)";

		let fontSize = canvas.element.height / 60;

		canvas.context.font = `${fontSize}px courier`;

		canvas.context.fillText(
			this.label,
			this.position.h + fontSize * 0.75,
			this.position.v + fontSize * 1.5,
		);
	};

	getLabelFromIPAndMask() {
		let octet1 =
			Math.floor(this.IP / 256 ** 3);
		let octet2 =
			Math.floor((this.IP % 256 ** 3) / 256 ** 2);
		let octet3 =
			Math.floor((this.IP % 256 ** 3) % 256 ** 2 / 256);
		let octet4 =
			Math.floor((this.IP % 256 ** 3) % 256 ** 2 % 256);
		this.label =
			`${octet1}.${octet2}.${octet3}.${octet4} / ${this.mask}`
	};
};

class column {
	position = {
		h: undefined,
		v: undefined,
	};

	subnets = [];
	elementWidth;
	elementHeight;

	/**
	 * The distance from the pointer to the column origin vertical
	 * position, measured in pixels
	*/
	onScreenOffset = 0;

	/**
	 * The distance from the pointer to the column origin vertical
	 * position, measured in its elements heights
	*/
	relativeOffset = 0;

	constructor() { };

	draw() {
		this.position.h += state.panDisplacement.h;

		if (state.panning) {
			if (this.relativeOffset == 0) {
				this.relativeOffset =
					(this.position.v - state.pointerPosition.v) /
					this.getElementHeight(this.position.h);
			};
		} else {
			this.onScreenOffset = 0;
			this.relativeOffset = 0;
		};

		let newOnScreenOffset =
			this.relativeOffset *
			this.getElementHeight(this.position.h);

		let onScreenOffsetIncrement;

		if (this.onScreenOffset != 0) {
			onScreenOffsetIncrement =
				newOnScreenOffset - this.onScreenOffset;
		} else {
			onScreenOffsetIncrement = 0;
		};

		this.onScreenOffset = newOnScreenOffset;

		this.position.v +=
			state.panDisplacement.v + onScreenOffsetIncrement;

		this.elementWidth =
			canvas.element.width / columnsOnScreen;
		this.elementHeight =
			this.getElementHeight(this.position.h);

		for (let s in this.subnets) {
			this.subnets[s].width = this.elementWidth;
			this.subnets[s].height = this.elementHeight;

			this.subnets[s].position.h =
				this.position.h - this.elementWidth / 2;
			this.subnets[s].position.v =
				this.position.v + this.subnets[s].height *
				this.subnets[s].positionInColumn;

			this.subnets[s].draw();
		};
	};

	getElementHeight(horPosition) {
		let baseElementHeight =
			canvas.element.height / rowsInMainColumn;
		let elementHeight =
			baseElementHeight * this.getVertScale(horPosition);

		return elementHeight;
	};

	getVertScale(horPosition) {
		let horPositionRelativeToCanvasMiddle =
			horPosition - canvas.element.width / 2;
		let columnWidth = canvas.element.width / columnsOnScreen;
		let power = -horPositionRelativeToCanvasMiddle / columnWidth;
		/*
		The relative horizontal position must be negative for the
		inverse direction of vertical scale change (small subnets are
		placed to the left of large)
		*/
		let scale = 1 / 2 ** power;

		return scale;
	};

	appendBottom() {
		let newSubnet = new subnet();

		if (this.subnets.length != 0) {
			let last = this.subnets.length - 1;

			newSubnet.positionInColumn =
				+(this.subnets[last].positionInColumn) + 1;

			newSubnet.IP =
				+(this.subnets[last].IP) +
				(2 ** 32 / 2 ** this.subnets[last].mask);

			newSubnet.mask = this.subnets[last].mask;
		} else {
			newSubnet.positionInColumn = 0;

			newSubnet.IP = 3232235520;
			newSubnet.mask = 24;
		};

		this.subnets.push(newSubnet);
	};

	appendTop() {
		let newSubnet = new subnet();

		if (this.subnets.length != 0) {
			newSubnet.positionInColumn =
				+(this.subnets[0].positionInColumn) - 1;

			newSubnet.IP =
				+(this.subnets[0].IP) -
				(2 ** 32 / 2 ** this.subnets[0].mask);

			newSubnet.mask = this.subnets[0].mask;
		} else {
			newSubnet.positionInColumn = 0;
			newSubnet.IP = 3232235520;
			newSubnet.mask = 24;
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
	canvas.resize();

	render();
}, false);

window.addEventListener('contextmenu', function (e) {
	e.preventDefault();

	render();
}, false);

window.addEventListener('keydown', function (e) {
	if (e.code == `ArrowUp`) {
		state.panning = true;
		state.panDisplacement.v = -10;
	};

	if (e.code == `ArrowDown`) {
		state.panning = true;
		state.panDisplacement.v = 10;
	};

	if (e.code == `ArrowRight`) {
		state.panning = true;
		state.panDisplacement.h = 10;
	};

	if (e.code == `ArrowLeft`) {
		state.panning = true;
		state.panDisplacement.h = -10;
	};

	render();
}, false);

window.addEventListener('keyup', function (e) {
	state.panning = false;
	state.panDisplacement.h = 0;
	state.panDisplacement.v = 0;

	render();
}, false);

window.addEventListener('mousedown', function (e) {
	e.preventDefault();

	state.panning = true;

	render();
}, false);

window.addEventListener('mouseup', function (e) {
	e.preventDefault();

	state.panning = false;

	state.panDisplacement.h = 0;
	state.panDisplacement.v = 0;

	render();
}, false);

window.addEventListener('mousemove', function (e) {
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
	This event listener can not to be added to window because in that
	case it is "Unable to preventDefault inside passive event listener
	due to target being treated as passive" (Google Chrome).
	So preventDefault() method can't be called and browser can handle
	mouse wheel events, e.g. zooming with Ctrl key pressed.
	*/

	e.preventDefault();

	if (e.deltaY < 0 && !e.altKey) {
		testColumn.cutBottom();
	};

	if (e.deltaY > 0 && !e.altKey) {
		testColumn.appendBottom();
	};

	if (e.deltaY < 0 && e.altKey) {
		testColumn.appendTop();
	};

	if (e.deltaY > 0 && e.altKey) {
		testColumn.cutTop();
	};

	render();
}, false);

canvas.element.addEventListener('touchstart', function (e) {
	e.preventDefault();

	state.panning = true;

	state.pointerPosition.h = e.touches[0].clientX;
	state.pointerPosition.v = e.touches[0].clientY;

	render();
}, true);

canvas.element.addEventListener('touchend', function (e) {
	e.preventDefault();

	state.panning = false;

	render();
}, false);

canvas.element.addEventListener('touchmove', function (e) {
	e.preventDefault();

	state.panDisplacement.h = int(e.touches[0].clientX) -
		state.pointerPosition.h;
	state.panDisplacement.v = int(e.touches[0].clientY) -
		state.pointerPosition.v;

	state.pointerPosition.h = int(e.touches[0].clientX);
	state.pointerPosition.v = int(e.touches[0].clientY);

	render();
}, false);



function render() {
	canvas.clear();

	infoPanel.draw();

	testColumn.draw();
};

function int(x) {
	return +(x.toFixed());
};