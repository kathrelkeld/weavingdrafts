function Draft(shafts, treadles, width, length) {
  this.shafts = shafts;
  this.treadles = treadles;
  this.size = vec(width, length)
  this.squareSize = 20;
  this.gapSize = 1;
  this.defaultColor = "grey";
  this.div = document.getElementById('draftgrid');

  this.setup();
}

// Setup weaving draft.
Draft.prototype.setup = function() {
  //this.addOptions();
  this.warp = new WarpGrid(vec(this.size.x, this.shafts), this);
  this.tieup = new TieupGrid(vec(this.treadles, this.shafts), this);
  this.weft = new WeftGrid(vec(this.treadles, this.size.y), this);
  this.pattern = new PatternGrid(this.size, this);
  this.warpcolor = new WarpColorGrid(vec(this.size.x, 1), this);
  this.weftcolor = new WeftColorGrid(vec(1, this.size.y), this);

  var warpStartY = getDivPosBottomRight(
          this.warpcolor.grid.div).y + this.gapSize;
  this.warp.grid.move(vec(0, warpStartY));
  var tieupStartX = getDivPosBottomRight(this.warp.grid.div).x + this.gapSize;
  this.tieup.grid.move(vec(tieupStartX, warpStartY));
  var patternStartY = getDivPosBottomRight(this.warp.grid.div).y + this.gapSize;
  this.pattern.grid.move(vec(0, patternStartY));
  var weftStart = vAdd(getDivPosBottomRight(this.warp.grid.div),
                       vec(this.gapSize, this.gapSize));
  this.weft.grid.move(weftStart);
  var weftColorStart = vAdd(getDivPosBottomRight(this.tieup.grid.div),
                            vec(this.gapSize, this.gapSize));
  this.weftcolor.grid.move(weftColorStart);

  console.log("Finished setting up draft!");
}

Draft.prototype.setToWarpColor = function(position) {
  var color = this.warpcolor.getColor(position.x);
  this.pattern.setColor(position, color, "warp");
}

Draft.prototype.setToWeftColor = function(position) {
  var color = this.weftcolor.getColor(position.y);
  this.pattern.setColor(position, color, "weft");
}

Draft.prototype.setToDefaultColor = function(position) {
  this.pattern.setColor(position, this.defaultColor, "default");
}

// Redraw the pattern box.
Draft.prototype.redraw = function() {
  for (var y = 0; y < this.size.y; y++) {
    var weftToggled = this.weft.grid.getToggledInRow(y);

    // If no weft is set, change all colors to default.
    if (weftToggled.length == 0) {
      for (var x = 0; x < this.size.x; x++) {
        this.setToDefaultColor(vec(x, y));
      }
      continue;
    }

    var tieupToggled = this.tieup.grid.getToggledInCol(weftToggled[0]);

    // If no tieup, change all colors to default.
    if (tieupToggled.length == 0) { 
      for (var x = 0; x < this.size.x; x++) {
        this.setToDefaultColor(vec(x, y));
      }
      continue;
    }

    // Set row to weft color.
    for (var x = 0; x < this.size.x; x++) {
      this.setToWeftColor(vec(x, y));
    }

    // For each shaft tied to this tieup, set to warp color.  Else, weft.
    for (var tiedI = 0; tiedI < tieupToggled.length; tiedI++) {
      var warpToggled = this.warp.grid.getToggledInRow(tieupToggled[tiedI]);
      for (var i = 0; i < warpToggled.length; i++) {
        this.setToWarpColor(vec(warpToggled[i], y));
      }
    }
  }
}
