import * as main from "./main.js"
import subnet from "./subnet.js"



export default class table {
	baseSubnet

	constructor() {
		this.baseSubnet = new subnet()
	}

	draw() {
		this.baseSubnet.getMaskSizeAndIPFromOnTablePos(
			main.state.focus
		)

		this.baseSubnet.getLabelFromIPAndMask()

		const theSmallestBaseSubnet =
			this.getSmallerSubnet(
				this.baseSubnet,
				Math.round(main.subnetsInMidColumn / 2)
			)

		let ancestors = []

		const ancestorNumber =
			Math.round(
				main.subnetsInMidColumn /
				2 ** (main.columnsOnScreen / 2)
			)

		const theSmallestBaseSubnetAncestor =
			this.getParentSubnet(
				theSmallestBaseSubnet,
				Math.round(main.columnsOnScreen / 2)
			)

		ancestors.push(theSmallestBaseSubnetAncestor)

		for (let i = 0; i < ancestorNumber; i++) {
			const lastAncestor = ancestors[ancestors.length - 1]
			const nextAncestor = this.getBiggerSubnet(lastAncestor, 1)

			if (nextAncestor.IP != lastAncestor.IP) {
				ancestors.push(nextAncestor)
			}
		}

		for (let i = 0; i <= main.columnsOnScreen + 1; i++) {
			let children = []

			for (const a in ancestors) {
				if (ancestors[a].mask <= 32) {
					ancestors[a].draw()

					children.push(
						this.getSmallChildSubnet(ancestors[a])
					)

					children.push(
						this.getBigChildSubnet(ancestors[a])
					)
				}
			}

			ancestors = children
		}
	}



	getSmallerSubnet(currentSubnet, depth) {
		for (let d = depth; d >= 0; d--) {
			if (d == 0) {
				return currentSubnet
			}

			let smallerSubnet = new subnet()

			smallerSubnet.mask = currentSubnet.mask
			smallerSubnet.size = currentSubnet.size
			smallerSubnet.IP =
				currentSubnet.IP - currentSubnet.size * d

			if (
				smallerSubnet.mask >= 0 &&
				smallerSubnet.mask <= 32 &&
				smallerSubnet.IP >= 0 &&
				smallerSubnet.IP < 2 ** 32
			) {
				return smallerSubnet
			}
		}
	}

	getBiggerSubnet(currentSubnet, depth) {
		for (let d = depth; d >= 0; d--) {
			if (d == 0) {
				return currentSubnet
			}

			let smallerSubnet = new subnet()

			smallerSubnet.mask = currentSubnet.mask
			smallerSubnet.size = currentSubnet.size
			smallerSubnet.IP =
				currentSubnet.IP + currentSubnet.size * d

			if (
				smallerSubnet.mask >= 0 &&
				smallerSubnet.mask <= 32 &&
				smallerSubnet.IP >= 0 &&
				smallerSubnet.IP < 2 ** 32
			) {
				return smallerSubnet
			}
		}
	}

	getParentSubnet(currentSubnet, depth) {
		for (let d = depth; d >= 0; d--) {
			if (d == 0) {
				return currentSubnet
			}

			let parentSubnet = new subnet()

			parentSubnet.mask = currentSubnet.mask - d
			parentSubnet.size = currentSubnet.size * (2 ** d)

			parentSubnet.IP =
				currentSubnet.IP -
				currentSubnet.IP % parentSubnet.size

			if (
				parentSubnet.mask >= 0 &&
				parentSubnet.mask <= 32 &&
				parentSubnet.IP >= 0 &&
				parentSubnet.IP < 2 ** 32
			) {
				return parentSubnet
			}
		}
	}

	getSmallChildSubnet(currentSubnet) {
		let smallChildSubnet = new subnet()

		smallChildSubnet.mask = currentSubnet.mask + 1
		smallChildSubnet.size = currentSubnet.size / 2

		smallChildSubnet.IP = currentSubnet.IP

		if (
			smallChildSubnet.mask < 0 ||
			smallChildSubnet.mask > 32 ||
			smallChildSubnet.IP < 0 ||
			smallChildSubnet.IP > 2 ** 32 - 1
		) {
			return false
		}

		return smallChildSubnet
	}

	getBigChildSubnet(currentSubnet) {
		let bigChildSubnet = new subnet()

		bigChildSubnet.mask = currentSubnet.mask + 1
		bigChildSubnet.size = currentSubnet.size / 2

		bigChildSubnet.IP = currentSubnet.IP + bigChildSubnet.size

		if (
			bigChildSubnet.mask < 0 ||
			bigChildSubnet.mask > 32 ||
			bigChildSubnet.IP < 0 ||
			bigChildSubnet.IP > 2 ** 32 - 1
		) {
			return false
		}

		return bigChildSubnet
	}
}