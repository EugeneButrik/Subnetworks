import * as main from "./main.js"



export default class subnet {
    position = {
        h: undefined,
        v: undefined,
    }

    width
    height
    color = "rgba(200, 0, 0, 0.5)"
    positionInColumn
    IP
    mask
    label

    constructor() {
    }

    draw() {
        main.canvas.context.fillStyle = this.color

        main.canvas.context.strokeRect(
            this.position.h,
            this.position.v,
            this.width,
            this.height
        )

        main.canvas.context.fillRect(
            this.position.h,
            this.position.v,
            this.width,
            this.height
        )

        this.getLabelFromIPAndMask()

        main.canvas.context.fillStyle = "rgba(0, 0, 0, 1)"

        let fontSize = main.canvas.element.height / 60

        main.canvas.context.font = `${fontSize}px courier`

        main.canvas.context.fillText(
            this.label,
            this.position.h + fontSize * 0.75,
            this.position.v + fontSize * 1.5,
        )
    }

    getLabelFromIPAndMask() {
        let octet1 =
            Math.floor(this.IP / 256 ** 3)
        let octet2 =
            Math.floor((this.IP % 256 ** 3) / 256 ** 2)
        let octet3 =
            Math.floor((this.IP % 256 ** 3) % 256 ** 2 / 256)
        let octet4 =
            Math.floor((this.IP % 256 ** 3) % 256 ** 2 % 256)
        this.label =
            `${octet1}.${octet2}.${octet3}.${octet4} / ${this.mask}`
    }
}