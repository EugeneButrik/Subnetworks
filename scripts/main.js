import table from "./table.js"



export let canvas = {
	element: document.getElementById("canvas"),
	context: document.getElementById("canvas").getContext("2d"),

	resize: function () {
		this.element.width = window.innerWidth
		this.element.height = window.innerHeight
	},

	clear: function () {
		this.context.clearRect(
			0,
			0,
			this.element.width,
			this.element.height
		)
	},

	percent: function (n) {
		const canvasSize =
			Math.sqrt(this.element.width * this.element.height)

		const percent = (canvasSize / 100) * n

		return percent
	}
}

export let state = {
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
		v: 3232235648,
	},
}

export let infoPanel = {
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
		const fontSize = canvas.percent(1.5)
		canvas.context.font = `${fontSize}px courier`

		const currentMoment = Date.now()
		const timeShift = currentMoment - this.timeStamp
		const FPS = Math.round(1000 / timeShift)

		this.timeStamp = currentMoment

		let panelStrings = [
			`${state.panning ? "Panning" : "Not panning"}`,

			`Pointer on-screen position:` +
			`[${state.pointerPosition.h}, ` +
			`${state.pointerPosition.v}]`,

			`Pan displacement:          ` +
			`[${state.panDisplacement.h}, ` +
			`${state.panDisplacement.v}]`,

			`Focus:                     ` +
			`[${state.focus.h}, ` +
			`${state.focus.v}]`,

			`baseSubnet:                ` +
			`${testTable.baseSubnet.label}`,

			`FPS:                       ` +
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

export const columnsOnScreen = 5
export const subnetsInMidColumn = 10



canvas.resize()

export let testTable = new table()

render()

window.requestAnimationFrame(aligning)



export function render() {
	canvas.clear()

	testTable.draw()

	infoPanel.draw()
}

export function aligning() {
	if (!state.panning) {

		const targetHorPosition =
			testTable.baseSubnet.mask + 0.5
		const targetVerPosition =
			testTable.baseSubnet.IP + testTable.baseSubnet.size / 2

		const horOffset = targetHorPosition - state.focus.h
		const verOffset = targetVerPosition - state.focus.v

		state.focus.h += +((horOffset / 10).toFixed(3))
		state.focus.v += +((verOffset / 10).toFixed(3))

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

	state.focus.h += state.panDisplacement.h * horSensitivity
	state.focus.v += state.panDisplacement.v * verSensitivity

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
}