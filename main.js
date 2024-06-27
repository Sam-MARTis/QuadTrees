"use strict";
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.fillStyle = "white";
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
            console.error("Wrong rectangle dimensions given");
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
            if (this.checkValidPoint(point) == false) {
                return false;
            }
            this.pointsCount += 1;
            if (this.points.length < this.capacity && !this.divided) {
                this.points.push(point);
                return true;
            }
            else {
                if (!this.divided) {
                    this.points.push(point);
                    this.subDivide();
                    return true;
                }
                else {
                    for (let i = 0; i < this.subTrees.length; i++) {
                        if (this.subTrees[i].addPoint(point)) {
                            return true;
                        }
                    }
                }
                throw new Error("Point not in sub trees");
            }
        };
        this.doesIntersect = (r) => {
            let x1 = this.x;
            let x2 = this.x + this.width;
            let y1 = this.y;
            let y2 = this.y + this.height;
            return ((x2 >= r.x1) && (x1 <= r.x2) && (y1 <= r.y2) && (y2 >= r.y1));
        };
        this.queryTree = (rangeVal) => {
            if (!this.doesIntersect(rangeVal)) {
                return [];
            }
            let pointsToReturn = [];
            if (!this.divided) {
                this.points.forEach((point) => {
                    if (rangeVal.doesContain(point.x, point.y)) {
                        pointsToReturn.push(point);
                    }
                });
                return pointsToReturn;
            }
            this.subTrees.forEach((subtree) => {
                pointsToReturn.push(...subtree.queryTree(rangeVal));
            });
            return pointsToReturn;
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
let canvas = document.getElementById("QuadTreesCanvas");
let ctx = canvas.getContext("2d");
let highlightRect = [0, 0, 0, 0];
let pointsToHighlight = [];
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
const renderStuff = () => {
    drawTree(myTree);
    ctx.beginPath();
    ctx.strokeStyle = "green";
    ctx.lineWidth = 1;
    ctx.rect(...highlightRect);
    ctx.stroke();
    ctx.closePath();
    ctx.lineWidth = 0.1;
    points.forEach((pointCurrent) => {
        ctx.strokeStyle = pointCurrent.fillStyle;
        ctx.fillStyle = pointCurrent.fillStyle;
        ctx.beginPath();
        ctx.arc(pointCurrent.x, pointCurrent.y, 1, 0, 3.1416);
        ctx.fill();
    });
};
const startTime = performance.now();
addEventListener("mousemove", (event) => {
    if ((performance.now() - startTime) / 1000 < 4) {
        const x = event.clientX;
        const y = event.clientY;
        const point = new Point(x, y);
        points.push(point);
        myTree.addPoint(point);
    }
    renderStuff();
});
addEventListener("click", (event) => {
    pointsToHighlight = [];
    const width = 200;
    const height = 100;
    const x = event.clientX - width / 2;
    const y = event.clientY - height / 2;
    highlightRect = [x, y, width, height];
    pointsToHighlight = myTree.queryTree(new Rect(x, x + width, y, y + height));
    pointsToHighlight.forEach((point) => {
        point.fillStyle = "green";
    });
    renderStuff();
});
