class Point{
    x: number
    y: number
    constructor(x:number, y:number){
        this.x = x
        this.y = y
    }
}

class QuadTree{
    x: number
    y: number
    width: number
    height: number
    points: Point[]
    capacity: number
    constructor(x: number, y:number, width:number, height:number){
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.points = []
        this.capacity = 4
    }

    checkValidPoint = (point: Point): boolean=> {
        return (point.x>this.x) && (point.x<(this.x+this.width)) && (point.y>this.y) && (point.y<(this.y+this.height))
    }

    addPoint =(point: Point): void => {
        if(this.checkValidPoint(point) === false){
            return
        }
        if(this.points.length<4){
            this.points.push(point)
        }
        else{
            
        }

    }
}