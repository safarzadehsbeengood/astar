// A* Search Algorithm
// 1.  Initialize the open list
// 2.  Initialize the closed list
//     put the starting node on the open 
//     list (you can leave its f at zero)

// 3.  while the open list is not empty
//     a) find the node with the least f on 
//        the open list, call it "q"

//     b) pop q off the open list

//     c) generate q's 8 successors and set their 
//        parents to q

//     d) for each successor
//         i) if successor is the goal, stop search

//         ii) else, compute both g and h for successor
//           successor.g = q.g + distance between 
//                               successor and q
//           successor.h = distance from goal to 
//           successor (This can be done using many 
//           ways, we will discuss three heuristics- 
//           Manhattan, Diagonal and Euclidean 
//           Heuristics)

//           successor.f = successor.g + successor.h

//         iii) if a node with the same position as 
//             successor is in the OPEN list which has a 
//            lower f than successor, skip this successor

//         iV) if a node with the same position as 
//             successor  is in the CLOSED list which has
//             a lower f than successor, skip this successor
//             otherwise, add  the node to the open list
//      end (for loop)

//     e) push q on the closed list
//     end (while loop)

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

var cols = 50; // init cols
var rows = 50; // init rows
var w, h; // height and width
var q; // current node

// make grid
var grid = new Array(cols)
for (var i = 0; i < cols; i++) {
  grid[i] = new Array(rows);
}

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
  this.neighbors = [];
  this.addNeighbors = function () {

    // left edge
    if (this.i > 0) {
      this.neighbors.push(grid[this.i - 1][this.j]);
    }
    // right edge
    if (this.i < cols - 1) {
      this.neighbors.push(grid[this.i + 1][this.j]);
    }
    // bottom edge
    if (this.j > 0) {
      this.neighbors.push(grid[this.i][this.j - 1]);
    }
    // top edge
    if (this.j < rows - 1) {
      this.neighbors.push(grid[this.i][this.j + 1]);
    }
  }

  this.show = function (clr) {
    fill(clr);
    stroke(0);
    rect(this.i * w, this.j * h, w - 1, h - 1);
  }
}

function setup() {
  var cnv = createCanvas(800, 800);
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
  background(0);

  w = width / cols;
  h = height / rows;


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
  end = grid[Math.floor(Math.random() * cols)][Math.floor(Math.random() * rows)];
  
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
      console.log("DONE");
      noLoop();
      for (var i = 0; i < openSet.length; i++) {
        openSet[i].show(color(0, 0, 0));
      }
      end.show(color(200,0,200));
      return;
    }
    removeFromArray(q, openSet); // remove current node from open set
    closedSet.push(q); // add it to closed set

    neighbors = q.neighbors;
    for (var i = 0; i < q.neighbors.length; i++) {
      var neighbor = neighbors[i];

      if (!closedSet.includes(neighbor)) {
        var tempG = q.g + 1;

        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
          } 
        } else {
          neighbor.g = tempG;
          openSet.push(neighbor);
        }
        neighbor.h = heuristic(neighbor, end);
        neighbor.f = neighbor.g + neighbor.h;
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

  for (var i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(255, 0, 0));
  }

  for (var i = 0; i < openSet.length; i++) {
    openSet[i].show(color(0, 255, 0));
  }
  start.show(color(200,200,0));
  end.show(color(200,0,200));
}

function reset() {
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      delete grid[i][j];
      openSet.length = 0;
      closedSet.length = 0;
    }
  }
}

document.getElementById("reset").onclick = () => {
  clear();
  reset();
  console.log(grid);
  setup();
  loop();
}