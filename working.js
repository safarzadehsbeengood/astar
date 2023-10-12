// Thank you to Coding Train!

function removeFromArray(node, arr) {
  for (var i = arr.length-1; i >= 0; i--) {
    if (node = arr[i]) {
      arr.splice(i, 1);
    }
  }
}

function heuristic(a, b) {
  var d = dist(a.i, a.j, b.i, b.j);
  return d;
}

var cols = 100; // init cols
var rows = 100; // init rows
var w, h; // height and width
var q; // current node
var path = [];

// make grid
var grid = new Array(cols)


var start, end;

// sets
var openSet = [];
var closedSet = [];

// declare node
function Node(i, j) {
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.i = i; // column
  this.j = j; // row
  this.wall = false;
  if (random(1) < 0.3) {
    this.wall = true;
  }
  this.neighbors = [];
  this.cameFrom;
  this.addNeighbors = function(grid) {
    var i = this.i;
    var j = this.j;
    if (i < cols - 1) {
      this.neighbors.push(grid[i + 1][j]);
    }
    if (i > 0) {
      this.neighbors.push(grid[i - 1][j]);
    }
    if (j < rows - 1) {
      this.neighbors.push(grid[i][j + 1]);
    }
    if (j > 0) {
      this.neighbors.push(grid[i][j - 1]);
    }
    if (i > 0 && j > 0) {
      this.neighbors.push(grid[i - 1][j - 1]);
    }
    if (i < cols - 1 && j > 0) {
      this.neighbors.push(grid[i + 1][j - 1]);
    }
    if (i > 0 && j < rows - 1) {
      this.neighbors.push(grid[i - 1][j + 1]);
    }
    if (i < cols - 1 && j < rows - 1) {
      this.neighbors.push(grid[i + 1][j + 1]);
    }
  }

  this.show = function(col) {
    if (this.wall) {
      fill(153, 76, 0);
      noStroke();
      ellipse(this.i * w + w / 2, this.j * h + h / 2, w / 2, h / 2);
    } else if (col) {
      fill(col);
      rect(this.i * w, this.j * h, w, h);
    }
  }
}

function setup() {
  var cnv = createCanvas(600, 600);
  randomSeed(3);
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
  background(0);

  w = width / cols;
  h = height / rows;

  for (var i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Node(i, j);
    }
  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid);
    }
  }


  // set start and end;
  start = grid[Math.floor(Math.random() * cols)][Math.floor(Math.random() * rows)];
  start.wall = false;
  end = grid[Math.floor(Math.random() * cols)][Math.floor(Math.random() * rows)];
  end.wall = false;
  
  openSet.push(start);
}

function draw() {
  
  if (openSet.length > 0) {
    // find node with lowest f in open set
    var lowest = 0;
    for (var i = 0; i < openSet.length; i++) {
      // if f is less than current lowest, set it
      if (openSet[i].f < openSet[lowest].f) {
        lowest = i;
        // tie breaking
      } else if (openSet[i].f == openSet[lowest].f) {
        if (openSet[i].h < openSet[lowest].h) {
          lowest = i;
        }
      }
    }
    var q = openSet[lowest];
    // if current node is the end, we're done
    if (q === end) {
      noLoop();
      console.log("DONE");
      end.show(color(255,0,255));

      return;
    }
    removeFromArray(q, openSet); // remove current node from open set
    closedSet.push(q); // add it to closed set

    var neighbors = q.neighbors;
    for (var i = 0; i < q.neighbors.length; i++) {
      var neighbor = neighbors[i];

      if (!closedSet.includes(neighbor) && !neighbor.wall) {
        var tempG = q.g + heuristic(neighbor, q);
        var newPath = false;
        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
            newPath = true;
          } 
        } else {
          neighbor.g = tempG;
          newPath = true;
          openSet.push(neighbor);
        }
        if (newPath) {
          neighbor.h = heuristic(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.cameFrom = q;
        }
      }
    }

  } else {
    console.log("no solution");
    noLoop();
    return;
  }
  background(0);

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show(color(0));
    }
  }

  // for (var i = 0; i < closedSet.length; i++) {
  //   closedSet[i].show(color(255, 0, 0));
  // }

  // for (var i = 0; i < openSet.length; i++) {
  //   openSet[i].show(color(0, 255, 0));
  // }

  path = [];
  var temp = q;
  path.push(temp);
  while (temp.cameFrom) {
    path.push(temp.cameFrom);
    temp = temp.cameFrom;
  }
  noFill();
  stroke(252, 238, 33);
  strokeWeight(w / 4);
  beginShape();
  for (var i = 0; i < path.length; i++) {
    vertex(path[i].i * w + w / 2, path[i].j * h + h / 2);
  }
  endShape();
  start.show(color(50,50,255));
  end.show(color(255,255,255));
}

function reset() {
  clear();
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      delete grid[i][j];
      openSet.length = 0;
      closedSet.length = 0;
    }
    delete[grid[i]];
  }
}

document.getElementById("reset").onclick = () => {
  reset();
  setup();
  loop();
}