class Point {
  x: number;
  y: number;
  fillStyle: string
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.fillStyle = "white"
  }
}
class Rect{
  x1: number
  y1: number
  x2:number
  y2:number
  constructor(x1:number, x2:number, y1:number, y2:number){
    this.x1=x1;
    this.x2=x2;
    this.y1=y1;
    this.y2=y2;
    if(this.x2<this.x1 || this.y2<this.y1){
      console.error("Wrongg recangle dimensions given");
      return
    }
  }
  doesContain = (x:number, y:number): boolean => {
    return ((x>this.x1) && (x<this.x2 )&& (y>this.y1) && (y<this.y2));
  }

}
class QuadTree {
  x: number;
  y: number;
  width: number;
  height: number;
  points: Point[];
  capacity: number;
  divided: boolean;
  subTrees: QuadTree[];
  pointsCount: number;
  constructor(x: number, y: number, width: number, height: number) {
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

  checkValidPoint = (point: Point): boolean => {
    return (
      point.x > this.x &&
      point.x <= this.x + this.width &&
      point.y > this.y &&
      point.y <= this.y + this.height
    );
  };
  subDivide = (): void => {
    // console.log("Subdivide function called")
    this.divided = true;
    this.subTrees.push(
      new QuadTree(this.x, this.y, this.width / 2, this.height / 2)
    );
    this.subTrees.push(
      new QuadTree(
        this.x + this.width / 2,
        this.y,
        this.width / 2,
        this.height / 2
      )
    );
    this.subTrees.push(
      new QuadTree(
        this.x + this.width / 2,
        this.y + this.height / 2,
        this.width / 2,
        this.height / 2
      )
    );
    this.subTrees.push(
      new QuadTree(
        this.x,
        this.y + this.height / 2,
        this.width / 2,
        this.height / 2
      )
    );
    this.points.forEach((point) => {
      this.subTrees.forEach((tree) => {
        tree.addPoint(point);
      });
    });
    this.points = [];
  };

  addPoint = (point: Point): boolean => {
    // console.log("Addpoint function called")
    if (this.checkValidPoint(point) == false) {
      return false;
    }
    this.pointsCount += 1;

    if (this.points.length < this.capacity && !this.divided) {
      console.log("Pushing point without subdividing");
      this.points.push(point);

      return true;
    } else {
      if (!this.divided) {
        console.log("Subdividing");
        this.points.push(point);
        this.subDivide();
        // console.log("Subdividing")
        return true;
      } else {
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

  doesIntersect = (r: Rect): boolean => {
    let x1 = this.x;
    let x2 = this.x + this.width;
    let y1 = this.y;
    let y2 = this.y + this.height
    return ((x2>=r.x1) && (x1 <= r.x2) && (y1 <= r.y2) && (y2 >= r.y1));
  }

  queryTree = (rangeVal: Rect): Point[]=> {
    if(!this.doesIntersect(rangeVal)){
      return []
    }
    let pointsToReturn: Point[] = []
    if(!this.divided){
      
      this.points.forEach((point)=> {
        if(rangeVal.doesContain(point.x, point.y)){
          pointsToReturn.push(point);
        }
      })
      return pointsToReturn;
    }
    this.subTrees.forEach((subtree) =>{
      pointsToReturn.push(...subtree.queryTree(rangeVal));
    })
    
    return pointsToReturn
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

let canvas: any = document.getElementById("QuadTreesCanvas");
let ctx: CanvasRenderingContext2D = canvas.getContext("2d");
let highlightRect: [number, number, number, number] = [0,0,0,0];
let pointsToHighlight: Point[] = [];


canvas.width = window.innerWidth * devicePixelRatio;
canvas.height = window.innerHeight * devicePixelRatio;
canvas.style.width = window.innerWidth + "px";
canvas.style.height = window.innerHeight + "px";
const myTree: QuadTree = new QuadTree(
  0,
  0,
  Math.max(canvas.width, canvas.height),
  Math.max(canvas.width, canvas.height)
);
const points: Point[] = [];
const drawTree = (tree: QuadTree): void => {
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
  ctx.lineWidth = 1
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
}

const startTime = performance.now()
addEventListener("mousemove", (event) => {
  if((performance.now()-startTime)/1000 < 4){
  console.log(event);
  const x = event.clientX;
  const y = event.clientY;
  const point = new Point(x, y);
  points.push(point);
  myTree.addPoint(point);
  }
  renderStuff();
  
});



addEventListener("click", (event)=>{
  pointsToHighlight = [];
  const width = 200;
  const height = 100;
  const x = event.clientX - width/2;
  const y = event.clientY - height/2;

  highlightRect = [x, y, width, height];
  pointsToHighlight = myTree.queryTree(new Rect(x, x+width, y, y+height));
  pointsToHighlight.forEach((point)=> {
    point.fillStyle = "green";
  })


  renderStuff();


  
})


