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
    divided: boolean
    subTrees: QuadTree[]
    constructor(x: number, y:number, width:number, height:number){
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.points = []
        this.capacity = 4
        this.divided = false
        this.subTrees=[]
        
    }

    checkValidPoint = (point: Point): boolean=> {
        return (point.x>this.x) && (point.x<=(this.x+this.width)) && (point.y>this.y) && (point.y<=(this.y+this.height))
    }
    subDivide = (): void => {
        this.divided = true
        this.subTrees.push(new QuadTree(this.x, this.y, this.width/2, this.height/2))
        this.subTrees.push(new QuadTree(this.x+this.width/2, this.y, this.width/2, this.height/2))
        this.subTrees.push(new QuadTree(this.x+this.width/2, this.y+this.height/2, this.width/2, this.height/2))
        this.subTrees.push(new QuadTree(this.x, this.y+this.height/2, this.width/2, this.height/2))
        this.subTrees.forEach(tree => {
            for(let i = 0; i<4; i++){
                tree.addPoint(this.points[i])
            }
        });
    }

    addPoint =(point: Point): boolean => {
        if(this.checkValidPoint(point) === false){
            return false
        }
        if(this.points.length<4){
            this.points.push(point)
            return true
        }
        else{
            if(!this.divided){
                this.subDivide()
                return true
            }
            for(let i=0; i<4; i++){
                if(this.subTrees[i].addPoint(point)){
                    return true
                }
            }
            throw("Point not in sub trees")
            return false
        }

    }

}