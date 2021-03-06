import * as main from "./main.js"



window.addEventListener('resize', function (e) {
	main.canvas.resize()

	main.render()
}, false)



window.addEventListener('contextmenu', function (e) {
	e.preventDefault()

	main.render()
}, false)



window.addEventListener('keydown', function (e) {
	if (e.code == `ArrowUp`) {
		main.state.target.v -= main.testTable.baseSubnet.size
	}

	if (e.code == `ArrowDown`) {
		main.state.target.v += main.testTable.baseSubnet.size
	}

	if (e.code == `ArrowRight`) {
		main.state.target.h += 1
	}

	if (e.code == `ArrowLeft`) {
		main.state.target.h -= 1
	}

	main.changeFocusPosition()

	main.render()
}, false)



window.addEventListener('keyup', function (e) {
	main.state.panning = false

	main.render()
}, false)



window.addEventListener('mousedown', function (e) {
	e.preventDefault()

	main.state.panning = true

	main.render()
}, false)



window.addEventListener('mouseup', function (e) {
	e.preventDefault()

	main.state.panning = false

	main.state.panDisplacement.h = 0
	main.state.panDisplacement.v = 0

	main.render()
}, false)



window.addEventListener('mousemove', function (e) {
	e.preventDefault()

	if (e.buttons == 0) {
		main.state.panning = false
	} else {
		main.state.panning = true
	}

	if (main.state.panning) {
		main.state.panDisplacement.h =
			main.state.pointerPosition.h - e.clientX
		main.state.panDisplacement.v =
			main.state.pointerPosition.v - e.clientY
	} else {
		main.state.panDisplacement.h = 0
		main.state.panDisplacement.v = 0
	}

	main.changeFocusPosition()

	main.state.pointerPosition.h = e.clientX
	main.state.pointerPosition.v = e.clientY

	main.render()
}, false)



main.canvas.element.addEventListener('wheel', function (e) {
	/*
	This event listener can not be added to window because in that
	case it is "Unable to preventDefault inside passive event listener
	due to target being treated as passive" (Google Chrome).
	So preventDefault() method can't be called and browser can handle
	mouse wheel events, e.g. zooming with Ctrl key pressed.
	*/

	e.preventDefault()

	if (e.deltaY < 0) {
		main.state.target.v -= main.testTable.baseSubnet.size
	}

	if (e.deltaY > 0) {
		main.state.target.v += main.testTable.baseSubnet.size
	}

	main.checkFocusBoundaries()

	main.render()
}, false)



main.canvas.element.addEventListener('touchstart', function (e) {
	e.preventDefault()

	main.state.panning = true

	main.state.pointerPosition.h = e.touches[0].clientX
	main.state.pointerPosition.v = e.touches[0].clientY

	main.render()
}, true)



main.canvas.element.addEventListener('touchend', function (e) {
	e.preventDefault()

	main.state.panning = false

	main.state.panDisplacement.h = 0
	main.state.panDisplacement.v = 0

	main.render()
}, false)



main.canvas.element.addEventListener('touchmove', function (e) {
	e.preventDefault()

	main.state.panDisplacement.h =
		main.state.pointerPosition.h -
		Math.round(e.touches[0].clientX)

	main.state.panDisplacement.v =
		main.state.pointerPosition.v -
		Math.round(e.touches[0].clientY)

	main.changeFocusPosition()

	main.state.pointerPosition.h = Math.round(e.touches[0].clientX)
	main.state.pointerPosition.v = Math.round(e.touches[0].clientY)

	main.render()
}, false)