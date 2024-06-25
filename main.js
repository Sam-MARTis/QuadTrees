var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
var QuadTree = /** @class */ (function () {
    function QuadTree(x, y, width, height) {
        var _this = this;
        this.checkValidPoint = function (point) {
            return (point.x > _this.x &&
                point.x <= _this.x + _this.width &&
                point.y > _this.y &&
                point.y <= _this.y + _this.height);
        };
        this.subDivide = function () {
            // console.log("Subdivide function called")
            _this.divided = true;
            _this.subTrees.push(new QuadTree(_this.x, _this.y, _this.width / 2, _this.height / 2));
            _this.subTrees.push(new QuadTree(_this.x + _this.width / 2, _this.y, _this.width / 2, _this.height / 2));
            _this.subTrees.push(new QuadTree(_this.x + _this.width / 2, _this.y + _this.height / 2, _this.width / 2, _this.height / 2));
            _this.subTrees.push(new QuadTree(_this.x, _this.y + _this.height / 2, _this.width / 2, _this.height / 2));
            _this.points.forEach(function (point) {
                _this.subTrees.forEach(function (tree) {
                    tree.addPoint(point);
                });
            });
            _this.points = [];
        };
        this.addPoint = function (point) {
            // console.log("Addpoint function called")
            if (_this.checkValidPoint(point) == false) {
                return false;
            }
            _this.pointsCount += 1;
            if (_this.points.length < _this.capacity && !_this.divided) {
                console.log("Pushing point without subdividing");
                _this.points.push(point);
                return true;
            }
            else {
                if (!_this.divided) {
                    console.log("Subdividing");
                    _this.points.push(point);
                    _this.subDivide();
                    // console.log("Subdividing")
                    return true;
                }
                else {
                    for (var i = 0; i < _this.subTrees.length; i++) {
                        if (_this.subTrees[i].addPoint(point)) {
                            return true;
                            // break
                        }
                    }
                }
                throw new Error("Point not in sub trees");
                return false;
            }
        };
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.pointsCount = 0;
        this.points = [];
        this.capacity = 4;
        this.divided = false;
        this.subTrees = [];
    }
    return QuadTree;
}());
//Testing
// console.log(myTree)
// console.log(myTree.addPoint(new Point(100, 100)))
// console.log(myTree)
// console.log(myTree.addPoint(new Point(100, 101)))
// console.log(myTree.addPoint(new Point(100, 102)))
// console.log(myTree)
// console.log(myTree.addPoint(new Point(100, 303)))
// console.log(myTree)
// setTimeout(()=>{console.log(myTree.addPoint(new Point(100, 300)))}, 100)
// console.log(myTree.addPoint(new Point(100, 300)))
// console.log(myTree)
var canvas = document.getElementById("QuadTreesCanvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth * devicePixelRatio;
canvas.height = window.innerHeight * devicePixelRatio;
canvas.style.width = window.innerWidth + "px";
canvas.style.height = window.innerHeight + "px";
var myTree = new QuadTree(0, 0, Math.max(canvas.width, canvas.height), Math.max(canvas.width, canvas.height));
var points = [];
var drawTree = function (tree) {
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.rect(tree.x, tree.y, tree.width, tree.height);
    ctx.stroke();
    if (tree.divided) {
        tree.subTrees.forEach(function (subTree) {
            drawTree(subTree);
        });
    }
};
addEventListener("mousemove", function (event) {
    console.log(event);
    var x = event.clientX;
    var y = event.clientY;
    var point = new Point(x, y);
    points.push(point);
    myTree.addPoint(point);
    drawTree(myTree);
    points.forEach(function (pointCurrent) {
        ctx.beginPath();
        ctx.arc(pointCurrent.x, pointCurrent.y, 1, 0, 3.1416);
        ctx.fillStyle = "white";
        ctx.fill();
    });
});
