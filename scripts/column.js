import * as main from "./main.js"
import subnet from "./subnet.js"



export default class column {
	position = {
		h: undefined,
		v: undefined,
	}

	columnsOnScreen = 3
	rowsInMainColumn = 10

	subnets = []
	elementWidth
	elementHeight

	/**
	 * The distance from the pointer to the column origin vertical
	 * position, measured in pixels
	*/
	onScreenOffset = 0

	/**
	 * The distance from the pointer to the column origin vertical
	 * position, measured in its elements heights
	*/
	relativeOffset = 0

	constructor() {
	}

	draw() {
		this.position.h += main.state.panDisplacement.h

		if (main.state.panning) {
			if (this.relativeOffset == 0) {
				this.relativeOffset =
					(this.position.v - main.state.pointerPosition.v) /
					this.getElementHeight(this.position.h)
			}
		} else {
			this.onScreenOffset = 0
			this.relativeOffset = 0
		}

		let newOnScreenOffset =
			this.relativeOffset *
			this.getElementHeight(this.position.h)

		let onScreenOffsetIncrement

		if (this.onScreenOffset != 0) {
			onScreenOffsetIncrement =
				newOnScreenOffset - this.onScreenOffset
		} else {
			onScreenOffsetIncrement = 0
		}

		this.onScreenOffset = newOnScreenOffset

		this.position.v +=
			main.state.panDisplacement.v + onScreenOffsetIncrement

		this.elementWidth =
			main.canvas.element.width / this.columnsOnScreen
		this.elementHeight =
			this.getElementHeight(this.position.h)

		for (let s in this.subnets) {
			this.subnets[s].width = this.elementWidth
			this.subnets[s].height = this.elementHeight

			this.subnets[s].position.h =
				this.position.h - this.elementWidth / 2
			this.subnets[s].position.v =
				this.position.v + this.subnets[s].height *
				this.subnets[s].positionInColumn

			this.subnets[s].draw()
		}
	}

	getElementHeight(horPosition) {
		let baseElementHeight =
			main.canvas.element.height / this.rowsInMainColumn
		let elementHeight =
			baseElementHeight * this.getVertScale(horPosition)

		return elementHeight
	}

	getVertScale(horPosition) {
		let horPositionRelativeToCanvasMiddle =
			horPosition - main.canvas.element.width / 2
		let columnWidth = main.canvas.element.width /
			this.columnsOnScreen
		let power = -horPositionRelativeToCanvasMiddle / columnWidth
		/*
		The relative horizontal position must be negative for the
		inverse direction of vertical scale change (small subnets are
		placed to the left of large)
		*/
		let scale = 1 / 2 ** power

		return scale
	}

	appendBottom() {
		let newSubnet = new subnet()

		if (this.subnets.length != 0) {
			let last = this.subnets.length - 1

			newSubnet.positionInColumn =
				+(this.subnets[last].positionInColumn) + 1

			newSubnet.IP =
				+(this.subnets[last].IP) +
				(2 ** 32 / 2 ** this.subnets[last].mask)

			newSubnet.mask = this.subnets[last].mask
		} else {
			newSubnet.positionInColumn = 0

			newSubnet.IP = 3232235520
			newSubnet.mask = 24
		}

		this.subnets.push(newSubnet)
	}

	appendTop() {
		let newSubnet = new subnet()

		if (this.subnets.length != 0) {
			newSubnet.positionInColumn =
				+(this.subnets[0].positionInColumn) - 1

			newSubnet.IP =
				+(this.subnets[0].IP) -
				(2 ** 32 / 2 ** this.subnets[0].mask)

			newSubnet.mask = this.subnets[0].mask
		} else {
			newSubnet.positionInColumn = 0
			newSubnet.IP = 3232235520
			newSubnet.mask = 24
		}

		this.subnets.unshift(newSubnet)
	}

	cutBottom() {
		this.subnets.pop()
	}

	cutTop() {
		this.subnets.shift()
	}
}