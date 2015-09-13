function Square(position, grid) {
  this.grid = grid;
  this.position = position;
  this.value = false;
  this.color = null;

  this.div = createDiv('square', grid.div);
  resizeDiv(this.div, vec(grid.squareSize, grid.squareSize));
  this.moveSquareDiv()
  this.div.addEventListener('mousedown', this.mouseDown.bind(this));
  this.div.style.lineHeight = grid.cellSize + "px";
}

// Move the div to where it should be (based on current location of grid).
Square.prototype.moveSquareDiv = function() {
  newPosition = vScale(this.position, this.grid.squareSize);
  moveDivRelative(this.div, newPosition, this.grid.div);
}

// Set the value to given.
Square.prototype.setValue = function(value) {
  if (this.value == value) { return; }
  this.value = value;
  if (this.value) {
    this.div.classList.add("toggled");
  } else {
    this.div.classList.remove("toggled");
  }
}

// Set the color to given.
Square.prototype.setColor = function(color) {
  this.color = color;
  this.div.style.backgroundColor = color;
}

// Toggle value of square.
Square.prototype.toggle = function() {
  this.setValue(!this.value);
}

// onMouseDown event handler.
Square.prototype.mouseDown = function(e) {
  this.grid.type.handleClick(this.position);
}
