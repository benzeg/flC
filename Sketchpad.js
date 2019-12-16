export default class Sketchpad extends HTMLCanvasElement {
  constructor() {
    super();
    const clientRect = this.getBoundingClientRect();
    this.x = clientRect.x;
    this.y = clientRect.y;
    this.clientWidth_ratio = this.width / this.clientWidth;
    this.clientHeight_ratio = this.height / this.clientHeight;
    this.activeTouches = new Map();
    this.activePointer = null;

    this.pointerWidth = 0.5;
    this.pointerColor = '#000';

    this.addEventListener('touchstart', this.touchstart, false);
    this.addEventListener('touchmove', this.touchmove, false);
  }

  touchstart(evt) {
    evt.preventDefault();
    this.activeTouches.clear();
    const ctx = this.getContext('2d');
    ctx.fillStyle = this.pointerColor;

    let i = 0;
    while (i < evt.changedTouches.length) {
      const { identifier, clientX, clientY } = evt.changedTouches[i];
      this.activeTouches.set(identifier,  { clientX, clientY });
      ctx.beginPath();
      ctx.arc(this.gridX(clientX), this.gridY(clientY), 0.5*this.pointerWidth, 0, 2*Math.PI, false);
      ctx.fill();
      i++;
    }
  }

  touchmove(evt) {
    evt.preventDefault();
    const ctx = this.getContext('2d');
    ctx.fillStyle = this.pointerColor;

    let i = 0;
    while (i < evt.changedTouches.length) {
      const { identifier, clientX: clientX_next, clientY: clientY_next } = evt.changedTouches[i];
      const point_prev = this.activeTouches.get(identifier); 
      if (point_prev) {
        ctx.beginPath();
        ctx.moveTo(this.gridX(point_prev.clientX), this.gridY(point_prev.clientY));
        ctx.lineTo(this.gridX(clientX_next), this.gridY(clientY_next));
        this.activeTouches.set(identifier, {
          clientX: clientX_next,
          clientY: clientY_next
        });
      }

      i++;
    }
  }

  gridX(pointer_x) {
    return (pointer_x - this.x)*this.clientWidth_ratio;
  }

  gridY(pointer_y) {
    return (pointer_y - this.y)*this.clientHeight_ratio;
  }
}