// Return the vector (x, y).
function vec(x, y) {
  return { x: x, y: y };
}

// Add the vector a to the vector b.
function vAdd(a, b) {
  return vec(a.x + b.x, a.y + b.y);
}

// Subtract the vector b from the vector a.
function vSub(a, b) {
  return vec(a.x - b.x, a.y - b.y);
}

// Scale the vector a by the constant c.
function vScale(a, c) {
  return vec(a.x * c, a.y * c);
}

// Return whether the elements of vectors a and b are equivalent.
function vEquals(a, b) {
  return ((a.x == b.x) && (a.y == b.y));
}

// Whether a given vector is positive and less than size in all directions.
function inBoundsOfSize(v, size) {
  return (v.x >= 0 && v.y >= 0 && v.x < size.x && v.y < size.y);
}

// Create a div with the given className and append to given parentDiv.
function createDiv(className, parentDiv) {
  var div = document.createElement('div');
  div.className = className;
  if (parentDiv) {
    parentDiv.appendChild(div);
  }
  //TODO: remove this line
  div.style.position = "absolute";

  return div;
}

// Create a div the size of the window and hide it.
function createOverlayDiv(id, parentDiv) {
  overlayDiv = createDiv("overlay", parentDiv);
  overlayDiv.id = id;
  moveDiv(overlayDiv, vec(0, 0));
  sizeToWindow(overlayDiv);
  overlayDiv.classList.add('hidden');
  return overlayDiv;
}

function createButton(id, text, parentDiv) {
  var button = document.createElement("button");
  var textNode = document.createTextNode(text);
  button.appendChild(textNode);
  button.id = id;
  if (parentDiv) {
    parentDiv.appendChild(button);
  }
  return button;
}

function createInput(id, defaultValue, parentDiv) {
  var input = document.createElement("input");
  input.type = "text";
  input.id = id;
  input.defaultValue = defaultValue;
  if (parentDiv) {
    parentDiv.appendChild(input);
  }
  return input;
}

function hideDiv(div) {
  div.style.display = "none";
}

function showDiv(div) {
  div.style.display = "initial";
}

// Move the given div to the given position.
function moveDiv(div, position) {
  div.style.left = position.x;
  div.style.top = position.y;
}

// Move the given div to the given position relative to the given parent.
function moveDivRelative(div, position, pdiv) {
  var pCorner = getDivPos(pdiv);
  var newPosition = vAdd(pCorner, position);
  moveDiv(div, newPosition);
}

// Resize the given div to the given dimensions .
function resizeDiv(div, dimensions) {
  div.style.width = dimensions.x;
  div.style.height = dimensions.y;
}

// Resize the given div to the window's dimensions.
function sizeToWindow(div) {
  div.style.width = window.innerWidth;
  div.style.height = window.innerHeight;
}

// Get the top-left position of the given div.
function getDivPos(div) {
  return vec(div.offsetLeft, div.offsetTop);
}

// Get the bottom-right position of the given div.
function getDivPosBottomRight(div) {
  return vec(div.offsetLeft + div.offsetWidth,
             div.offsetTop + div.offsetHeight);
}

// Return the center of the given div.
function getDivCenter(div) {
  return vec(div.offsetLeft + div.offsetWidth/2,
             div.offsetTop + div.offsetHeight/2);
}

// Whether a given mouse position is in bounds of a given div.
function inBoundsOfDiv(position, div) {
  var topLeft = getDivPos(div);
  var bottomRight = getDivPosBottomRight(div);
  return position.x >= topLeft.x && position.x <= bottomRight.x &&
    position.y >= topLeft.y && position.y <= bottomRight.y;
}

// Calculate the nearest integer coordinates, given the cell size and parent div.
// Does not check whether position is actually within the given div's bounds.
function nearestCoordsInDiv(position, cellSize, div) {
  var relative = vSub(position, getDivPos(div));
  var coords = vScale(relative, 1 / cellSize);
  return vec(Math.floor(coords.x), Math.floor(coords.y));
}

// Remove a div from its parent.
function removeDiv(div) {
  div.parentNode.removeChild(div);
}
