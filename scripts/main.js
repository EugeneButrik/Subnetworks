import table from "./table.js"



export let columnsOnScreen
export let subnetsInMidColumn

export const canvas = {
	element: document.getElementById("canvas"),
	context: document.getElementById("canvas").getContext("2d"),

	resize: function () {
		this.element.width = window.innerWidth
		this.element.height = window.innerHeight

		columnsOnScreen = Math.round(this.element.width / 390)
		subnetsInMidColumn = Math.round(this.element.height / 200)
	},

	clear: function () {
		this.context.clearRect(
			0,
			0,
			this.element.width,
			this.element.height
		)
	},

	heightPercent: function (n) {
		return (this.element.height / 100) * n
	}
}

export const state = {
	panning: false,

	pointerPosition: {
		h: undefined,
		v: undefined,
	},

	panDisplacement: {
		h: 0,
		v: 0,
	},

	focus: {
		h: 24.5,
		v: 3232235648.5,
	},

	target: {
		h: 24.5,
		v: 3232235648.5,
	},

	drawFocus: () => {
		canvas.context.fillStyle = "rgba(0, 0, 255, 0.5)"
		canvas.context.beginPath();
		canvas.context.arc(
			canvas.element.width / 2,
			canvas.element.height / 2,
			canvas.heightPercent(0.3),
			0,
			2 * Math.PI
		);
		canvas.context.fill();
	},
}

export const infoPanel = {
	logStrings: [],
	logLastMessage: undefined,
	repeated: 1,
	logMaxStrings: 5,

	timeStamp: Date.now(),

	log: function (s) {
		if (s == this.logLastMessage) {
			this.logStrings[0] = `|${++this.repeated}| ` + s
		} else {
			this.logStrings.unshift(s)

			this.logLastMessage = s
			this.repeated = 1
		}

		if (this.logStrings.length > this.logMaxStrings) {
			this.logStrings.pop()
		}
	},

	draw: function () {
		canvas.context.fillStyle = "rgba(0, 0, 0, 1)"
		const fontSize = canvas.heightPercent(2)
		canvas.context.font = `${fontSize}px arial`

		const currentMoment = Date.now()
		const timeShift = currentMoment - this.timeStamp
		const FPS = Math.round(1000 / timeShift)

		this.timeStamp = currentMoment

		let panelStrings = [
			`${state.panning ? "Panning" : "Not panning"}`,

			`Pointer on-screen position: ` +
			`[${state.pointerPosition.h}, ` +
			`${state.pointerPosition.v}]`,

			`Pan displacement: ` +
			`[${state.panDisplacement.h}, ` +
			`${state.panDisplacement.v}]`,

			`Focus: ` +
			`[${state.focus.h}, ` +
			`${state.focus.v}]`,

			`Target: ` +
			`[${state.target.h}, ` +
			`${state.target.v}]`,

			`baseSubnet: ` +
			`${testTable.baseSubnet.label}`,

			`FPS: ` +
			`${FPS}`,
		]

		for (let s in panelStrings) {
			canvas.context.fillText(
				panelStrings[s],
				10,
				10 + (fontSize * (+(s) + 1))
			)
		}

		for (let s in this.logStrings) {
			canvas.context.fillText(
				this.logStrings[s],
				10,
				canvas.element.height - (fontSize * (+(s) + 1))
			)
		}
	},
}



canvas.resize()

export let testTable = new table()

render()

window.requestAnimationFrame(aligning)



export function render() {
	canvas.clear()

	testTable.draw()

	infoPanel.draw()

	state.drawFocus()
}

export function aligning() {
	if (!state.panning) {
		state.target.h =
			Math.floor(state.target.h) + 0.5

		state.target.v =
			Math.floor(state.target.v / testTable.baseSubnet.size) *
			testTable.baseSubnet.size +
			testTable.baseSubnet.size / 2.001

		const horOffset = state.target.h - state.focus.h
		const verOffset = state.target.v - state.focus.v

		if (Math.abs(horOffset) >= 0.001) {
			state.focus.h += horOffset / 10
		} else {
			state.focus.h = state.target.h
		}

		if (Math.abs(verOffset) >= 0.001) {
			state.focus.v += verOffset / 10
		} else {
			state.focus.v = state.target.v
		}

		checkFocusBoundaries()

		render()
	}

	window.requestAnimationFrame(aligning)
}

export function changeFocusPosition() {
	let horSensitivity =
		1 / (canvas.element.width / columnsOnScreen)

	let verSensitivity =
		testTable.baseSubnet.size /
		(canvas.element.height / subnetsInMidColumn)

	const horIncrement = state.panDisplacement.h * horSensitivity
	const verIncrement = state.panDisplacement.v * verSensitivity

	state.focus.h += horIncrement
	state.focus.v += verIncrement

	state.target.h += horIncrement
	state.target.v += verIncrement

	checkFocusBoundaries()
}

export function checkFocusBoundaries() {
	const min = 0.001

	if (state.focus.h < min) {
		state.focus.h = min
	}

	if (state.focus.h > 33 - min) {
		state.focus.h = 33 - min
	}

	if (state.focus.v < min) {
		state.focus.v = min
	}

	if (state.focus.v > 2 ** 32 - min) {
		state.focus.v = 2 ** 32 - min
	}

	if (state.target.h < 0.5) {
		state.target.h = 0.5
	}

	if (state.target.h > 33 - 0.5) {
		state.target.h = 33 - 0.5
	}

	if (state.target.v < 0.5) {
		state.target.v = 0.5
	}

	if (state.target.v > 2 ** 32 - 0.5) {
		state.target.v = 2 ** 32 - 0.5
	}
}