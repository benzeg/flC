/**
 *
 *
 * @param {number} x
 * @param {number} y
 */
function Point2D (x, y, width, height, clientWidth = width, clientHeight = height, top = 0, left = 0) {
  this._width = width;
  this._height = height;
  this.clientWidth = clientWidth;
  this.clientHeight = clientHeight;
  this.top = top;
  this.left = left;
  this.x = (x - left) * (this._width / this.clientWidth);
  this.y = (y - top) * (this._height / this.clientHeight);
}