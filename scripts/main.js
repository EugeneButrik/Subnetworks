`use strict`

import column from "./column.js"

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
}

export let infoPanel = {
	logStrings: [],
	logLastMessage: undefined,
	repeated: 1,
	logMaxStrings: 5,

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
		let fontSize = canvas.element.height / 60
		canvas.context.font = `${fontSize}px courier`

		let panelStrings = [
			`${state.panning ? "Panning" : "Not panning"}`,

			`Pointer on-screen position:` +
			`[${state.pointerPosition.h}, ` +
			`${state.pointerPosition.v}]`,

			`Pan displacement:          ` +
			`[${state.panDisplacement.h}, ` +
			`${state.panDisplacement.v}]`,
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

export let testColumn = new column()

testColumn.position.h = canvas.element.width / 2
testColumn.position.v = canvas.element.height / 2

testColumn.appendBottom()
testColumn.appendBottom()
testColumn.appendTop()
testColumn.appendTop()

render()



export function render() {
	canvas.clear()

	infoPanel.draw()

	testColumn.draw()
}

export function int(x) {
	return +(x.toFixed())
}