import { Arc, Circle, Point } from "./maths.js";

export class Renderer {
	readonly ctx: CanvasRenderingContext2D;

	viewX = -100;
	viewY = -100;
	viewWidth  = 100;
	viewHeight = 100;

	constructor(ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
	}

	get resX() {
		return this.ctx.canvas.width / this.viewWidth;
	}

	get resY() {
		return this.ctx.canvas.height / this.viewHeight;
	}

	distanceX(x: number) {
		return x * this.resX;
	}

	distanceY(y: number) {
		return y * this.resY;
	}

	pixelX(x: number) {
		return this.distanceX(x - this.viewX);
	}

	pixelY(y: number) {
		return this.ctx.canvas.height - this.distanceY(y - this.viewY);
	}

	clear() {
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
	}

	tracePolygon(points: Point[]): this {
		const p1 = points[0];
		if (!p1) return this;
		
		this.ctx.moveTo(this.pixelX(p1.x), this.pixelY(p1.y));

		for (let i = 1, l = points.length; i < l; i++) {
			const point = points[i]!;
			this.ctx.lineTo(this.pixelX(point.x), this.pixelY(point.y));
		}
		return this;
	}

	traceCircle(circle: Circle): this {
		this.ctx.ellipse(
			this.pixelX(circle.x),
			this.pixelY(circle.y),
			this.distanceX(circle.radius),
			this.distanceY(circle.radius),
			0,0,
			Math.PI*2
		);
		return this;
	}

	traceArc(arc: Arc): this {
		this.ctx.ellipse(
			this.pixelX(arc.x),
			this.pixelY(arc.y),
			Math.abs(this.distanceX(arc.radius)),
			Math.abs(this.distanceY(arc.radius)),
			0,
			-arc.orientation,
			-(arc.orientation + arc.angle),
			true
		);
		return this;
	}
	
	drawPolygon(points: Point[], closePath = true): this {
		this.ctx.beginPath();
		this.tracePolygon(points);
		if (closePath) this.ctx.closePath();
		this.ctx.stroke();
		return this;
	}

	drawCircle(circle: Circle): this {
		this.ctx.beginPath();
		this.traceCircle(circle);
		this.ctx.stroke();
		return this;
	}

	drawArc(arc: Arc):  this {
		this.ctx.beginPath();
		this.traceArc(arc);
		this.ctx.stroke();
		return this;
	}
}