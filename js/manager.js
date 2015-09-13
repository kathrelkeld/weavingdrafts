function Draft(shafts, treadles, width, length) {
  this.shafts = shafts;
  this.treadles = treadles;
  this.size = vec(width, length)
  this.squareSize = 20;
  this.gapSize = 1;
  this.defaultColor = "purple";
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

Draft.prototype.drawInNewWarp = function(warpPos) {
  var warpColor = this.warpcolor.getColor(warpPos.x);
  var tieupToggled = this.tieup.grid.getToggledInRow(warpPos.y);
  if (tieupToggled.length == 0) { return; }
  for (var i = 0; i < tieupToggled.length; i++) {
    var currWeftCol = tieupToggled[i];
    var weftToggled = this.weft.grid.getToggledInCol(currWeftCol);
    if (weftToggled.length == 0) { continue; }
    for (var j = 0; j < weftToggled.length; j++) {
      var currWeftRow = weftToggled[j];
      this.pattern.setColor(vec(warpPos.x, currWeftRow), warpColor);
    }
  }
}

Draft.prototype.removeOldWarp = function(warpPos) {
  var tieupToggled = this.tieup.grid.getToggledInRow(warpPos.y);
  if (tieupToggled.length == 0) { return; }
  for (var i = 0; i < tieupToggled.length; i++) {
    var currWeftCol = tieupToggled[i];
    var weftToggled = this.weft.grid.getToggledInCol(currWeftCol);
    if (weftToggled.length == 0) { continue; }
    for (var j = 0; j < weftToggled.length; j++) {
      var currWeftRow = weftToggled[j];
      var weftColor = this.weftcolor.getColor(currWeftRow);
      this.pattern.setColor(vec(warpPos.x, currWeftRow), weftColor);
    }
  }
}
