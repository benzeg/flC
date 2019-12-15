class Sketchpad extends HTMLCanvasElement {
  constructor() {
    super();
    const clientRect = this.getBoundingClientRect();
    this.x = clientRect.x;
    this.y = clientRect.y;
    this.clientWidth_ratio = this.width / this.clientWidth;
    this.clientHeight_ratio = this.height / this.clientHeight;
    this.activeTouches = {};
    this.activePointer = null;
  }

  touchstart() {

  }

  touchmove() {

  }
  
  touchend() {

  }

  touchcancel() {

  }
}