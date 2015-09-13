function Grid(size, type, draft) {
  this.draft = draft;
  this.type = type;
  this.size = size; // (x, y) of grid dimensions.
  this.div = createDiv('grid', draft.div);
  this.squareSize = draft.squareSize;

  // Customize grid div.
  resizeDiv(this.div, vScale(this.size, this.squareSize));

  this.setup();
}

Grid.prototype.setup = function() {
  // Create x by y grid of squares.
  this.squares = [];
  for (var y = 0; y < this.size.y; y++) {
    this.squares.push([]);
    for (var x = 0; x < this.size.x; x++) {
      var current = new Square(vec(x, y), this);
      this.squares[y].push(current);
    }
  }
}

// Get the square at the given position.
Grid.prototype.getSquare = function(position) {
  return this.squares[position.y][position.x];
}

Grid.prototype.isSet = function(position) {
  return this.getSquare(position).value
}

Grid.prototype.toggle = function(position) {
  this.getSquare(position).toggle();
}

Grid.prototype.setOff = function(position) {
  var current = this.getSquare(position);
  current.setValue(false);
}

Grid.prototype.getToggledInRow = function(row) {
  var found = [];
  for (var x = 0; x < this.size.x; x++) {
    var current = this.getSquare(vec(x, row));
    if (current.value) {
      found.push(x)
    }
  }
  return found;
}

Grid.prototype.getToggledInCol = function(col) {
  var found = [];
  for (var y = 0; y < this.size.y; y++) {
    var current = this.getSquare(vec(col, y));
    if (current.value) {
      found.push(y);
    }
  }
  return found;
}

// Apply function to all squares.
Grid.prototype.applyToAll = function(func) {
  for (var i=0; i < this.size.x; i++) {
    for (var j=0; j < this.size.y; j++) {
      func(this.squares[j][i]);
    }
  }
}

Grid.prototype.setColorOfAll = function(color) {
  this.applyToAll(function(square) {
    square.div.style.backgroundColor = color;
  })
}

Grid.prototype.addClassToAll = function(c) {
  this.applyToAll(function(square) {
    square.div.classList.add(c);
  })
}

Grid.prototype.removeClassFromAll = function(c) {
  this.applyToAll(function(square) {
    square.div.classList.remove(c);
  })
}

Grid.prototype.move = function(newPosition) {
  moveDiv(this.div, newPosition);
  //this.applyToAll(function(square) {
    //square.moveSquareDiv();
  //});
}

// Expand grid in the given direction.
Grid.prototype.expand = function(direction) {
  if (direction == "right" || direction == "left") {
    var rowToAdd = [];
    for (var i=0; i < this.size.y; i++) {
      var current = new Square(vec(this.size.x, i), this);
      rowToAdd.push(current);
    }
    this.size.x += 1;
    this.squares.push(rowToAdd);
    //TODO: handle left case
  } else {
    for (var i=0; i < this.size.x; i++) {
      var current = new Square(vec(i, this.size.y), this);
      this.squares.push(this.createCellDiv(vec(i, this.size.y)));
    }
    this.size.y += 1;
    //TODO: handle up case
  }
}

function WarpGrid(size, draft) {
  this.draft = draft;
  this.grid = new Grid(size, this, draft);
}

WarpGrid.prototype.handleClick = function(position) {
  var square = this.grid.getSquare(position);
  if (square.value) {
    square.setValue(false);
  } else {
    square.setValue(true);
    for (var y = 0; y < this.grid.size.y; y++) {
      var current = this.grid.getSquare(vec(position.x, y));
      if ((y != position.y) && current.value) {
        current.setValue(false);
      }
    }
  }
  this.draft.redraw();
}

function TieupGrid(size, draft) {
  this.draft = draft;
  this.grid = new Grid(size, this, draft);
}

TieupGrid.prototype.handleClick = function(position) {
  var square = this.grid.getSquare(position);
  square.toggle(position);
  this.draft.redraw();
}

function WeftGrid(size, draft) {
  this.draft = draft;
  this.grid = new Grid(size, this, draft);
}

WeftGrid.prototype.handleClick = function(position) {
  var square = this.grid.getSquare(position);
  if (square.value) {
    square.setValue(false);
  } else {
    square.setValue(true);
    for (var x = 0; x < this.grid.size.x; x++) {
      var current = this.grid.getSquare(vec(x, position.y));
      if ((x != position.x) && current.value) {
        current.setValue(false);
      }
    }
  }
  this.draft.redraw();
}

function PatternGrid(size, draft) {
  this.draft = draft;
  this.grid = new Grid(size, this, draft);
  this.grid.removeClassFromAll('square');
  this.grid.setColorOfAll(this.draft.defaultColor);
}

PatternGrid.prototype.handleClick = function(position) {
}

PatternGrid.prototype.setColor = function(position, color, type) {
  var square = this.grid.getSquare(position);
  square.setColor(color);
}

function WarpColorGrid(size, draft) {
  this.draft = draft;
  this.grid = new Grid(size, this, draft);
  this.grid.removeClassFromAll('square');
  this.grid.setColorOfAll(this.draft.defaultColor);
}

WarpColorGrid.prototype.handleClick = function(position) {
  this.grid.getSquare(position).setColor("yellow");
  this.draft.redraw();
}

WarpColorGrid.prototype.getColor = function(col) {
  return this.grid.getSquare(vec(col, 0)).div.style.backgroundColor;
}

function WeftColorGrid(size, draft) {
  this.draft = draft;
  this.grid = new Grid(size, this, draft);
  this.grid.removeClassFromAll('square');
  this.grid.setColorOfAll(this.draft.defaultColor);
}

WeftColorGrid.prototype.handleClick = function(position) {
  this.grid.getSquare(position).setColor("orange");
  this.draft.redraw();
}

WeftColorGrid.prototype.getColor = function(row) {
  return this.grid.getSquare(vec(0, row)).div.style.backgroundColor;
}
