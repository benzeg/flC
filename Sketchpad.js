class Sketchpad extends HTMLCanvasElement {
  constructor() {
    const self = super();
    this.self = self;
    this.activeTouches = new Map();
    this.activePointer = null;
    this.pointerWidth = 1;
    this.pointerColor = '#000';

    window.onorientationchange = this.updateDimensions; 
    this.self.addEventListener('touchstart', this.touchstart, false);
    this.self.addEventListener('touchmove', this.touchmove, false);
  }

  touchstart(evt) {
    const Log = document.getElementById('log');
    Log.innerHTML = 'touchstart: ' + JSON.stringify(evt.changedTouches);
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
    const Log = document.getElementById('log');
    Log.innerHTML = 'touchmove: ' + JSON.stringify(evt.changedTouches);
    evt.preventDefault();
    const ctx = this.self.getContext('2d');
    ctx.fillStyle = this.pointerColor;

    let i = 0;
    while (i < evt.changedTouches.length) {
      const { identifier, clientX: clientX_next, clientY: clientY_next } = evt.changedTouches[i];
      const point_prev = this.activeTouches.get(identifier); 

      if (point_prev) {
        ctx.beginPath();
        ctx.moveTo(this.gridX(point_prev.clientX), this.gridY(point_prev.clientY));
        ctx.lineTo(this.gridX(clientX_next), this.gridY(clientY_next));
        ctx.stroke();

        this.activeTouches.set(identifier, {
          clientX: clientX_next,
          clientY: clientY_next
        });
      }

      i++;
    }
  }

  gridX(pointer_x) {
    const { x } = this.self.getBoundingClientRect();
    return (pointer_x - x) + this.self.scrollLeft;
  }

  gridY(pointer_y) {
    const { y } = this.self.getBoundingClientRect();
    return (pointer_y - y) + this.self.scrollTop;
  }

  updateDimensions() {
    this.self.width = this.self.scrollWidth;
    this.self.height = this.self.scrollHeight;
  }

  connectedCallback() {
    this.updateDimensions();
  }

  static get observedAttributes() {
    return ['scrollWidth', 'scrollHeight'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch(name) {
      case 'scrollWidth':
        this.self.width = newValue;
        break;
      case 'scrollHeight':
        this.self.height = newValue;
        break;
    }
  }
}