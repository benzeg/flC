class Sketchpad extends HTMLElement {
  constructor() {
    super();
    this.activeTouches = new Map();
    this.activePointer = null;
    this.pointerWidth = 1;
    this.pointerColor = '#000';

    const shadow = this.attachShadow({mode: 'open'});
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', 'sketchpad.css')
    shadow.appendChild(linkElem);

    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('id', 'draw');
    
    shadow.appendChild(this.canvas);

    this.addEventListener('touchstart', this.touchstart.bind(this));
    this.addEventListener('touchmove', this.touchmove.bind(this));
    window.addEventListener('resize', this.updateDimensions.bind(this));

    this.updateDimensions();
    //Save Draw
		const Save = document.createElement('input');
		Save.value = 'save';
		Save.type = 'button';
    Save.className += 'save-drawing';
    shadow.appendChild(Save);
    Save.addEventListener('click', this.save.bind(this));

    //storage
    let imageStore = localStorage.getItem('handNotes');
    if (!imageStore) {
      this.images = new Map();
    } else {
      this.images = new Map(JSON.parse(imageStore));
    }
  }

  save() {
    this.canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      this.images.set(new Date().getTime(), url);
    });
  }

  touchstart(evt) {
    evt.preventDefault();
    this.activeTouches.clear();
    const ctx = this.canvas.getContext('2d');
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
    const ctx = this.canvas.getContext('2d');
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
    const { x } = this.canvas.getBoundingClientRect();
    return (pointer_x - x) + this.canvas.scrollLeft;
  }

  gridY(pointer_y) {
    const { y } = this.canvas.getBoundingClientRect();
    return (pointer_y - y) + this.canvas.scrollTop;
  }

  updateDimensions() {
    this.canvas.width = this.canvas.scrollWidth;
    this.canvas.height = this.canvas.scrollHeight;
  }

  //connectedCallback() {
  //  this.updateDimensions();
  //}

  static get observedAttributes() {
    return ['scrollWidth', 'scrollHeight'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch(name) {
      case 'scrollWidth':
        this.canvas.width = newValue;
        break;
      case 'scrollHeight':
        this.canvas.height = newValue;
        break;
    }
  }

  disconnectedCallback() {
    localStorage.setItem('handNotes', JSON.stringify(Array.from(this.images)));
  }
}