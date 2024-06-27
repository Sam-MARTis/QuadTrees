"use strict";
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class Rect {
    constructor(x1, x2, y1, y2) {
        this.doesContain = (x, y) => {
            return ((x > this.x1) && (x < this.x2) && (y > this.y1) && (y < this.y2));
        };
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
        if (this.x2 < this.x1 || this.y2 < this.y1) {
            console.error("Wrongg recangle dimensions given");
            return;
        }
    }
}
class QuadTree {
    constructor(x, y, width, height) {
        this.checkValidPoint = (point) => {
            return (point.x > this.x &&
                point.x <= this.x + this.width &&
                point.y > this.y &&
                point.y <= this.y + this.height);
        };
        this.subDivide = () => {
            // console.log("Subdivide function called")
            this.divided = true;
            this.subTrees.push(new QuadTree(this.x, this.y, this.width / 2, this.height / 2));
            this.subTrees.push(new QuadTree(this.x + this.width / 2, this.y, this.width / 2, this.height / 2));
            this.subTrees.push(new QuadTree(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, this.height / 2));
            this.subTrees.push(new QuadTree(this.x, this.y + this.height / 2, this.width / 2, this.height / 2));
            this.points.forEach((point) => {
                this.subTrees.forEach((tree) => {
                    tree.addPoint(point);
                });
            });
            this.points = [];
        };
        this.addPoint = (point) => {
            // console.log("Addpoint function called")
            if (this.checkValidPoint(point) == false) {
                return false;
            }
            this.pointsCount += 1;
            if (this.points.length < this.capacity && !this.divided) {
                console.log("Pushing point without subdividing");
                this.points.push(point);
                return true;
            }
            else {
                if (!this.divided) {
                    console.log("Subdividing");
                    this.points.push(point);
                    this.subDivide();
                    // console.log("Subdividing")
                    return true;
                }
                else {
                    for (let i = 0; i < this.subTrees.length; i++) {
                        if (this.subTrees[i].addPoint(point)) {
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
}
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
let canvas = document.getElementById("QuadTreesCanvas");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth * devicePixelRatio;
canvas.height = window.innerHeight * devicePixelRatio;
canvas.style.width = window.innerWidth + "px";
canvas.style.height = window.innerHeight + "px";
const myTree = new QuadTree(0, 0, Math.max(canvas.width, canvas.height), Math.max(canvas.width, canvas.height));
const points = [];
const drawTree = (tree) => {
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.rect(tree.x, tree.y, tree.width, tree.height);
    ctx.stroke();
    if (tree.divided) {
        tree.subTrees.forEach((subTree) => {
            drawTree(subTree);
        });
    }
};
addEventListener("mousemove", (event) => {
    console.log(event);
    const x = event.clientX;
    const y = event.clientY;
    const point = new Point(x, y);
    points.push(point);
    myTree.addPoint(point);
    drawTree(myTree);
    points.forEach((pointCurrent) => {
        ctx.beginPath();
        ctx.arc(pointCurrent.x, pointCurrent.y, 1, 0, 3.1416);
        ctx.fillStyle = "white";
        ctx.fill();
    });
});
