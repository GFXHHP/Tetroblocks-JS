import Field from "./Field.js";

class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  
    static displayName = "Point";
    static distance(a, b) {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
  
      return Math.hypot(dx, dy);
    }
} //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#static_methods_and_properties

export class Block{
    #position = new Point(0,0);
    #parent_tetromino = null;
    color = "#FFFFFF";

    constructor(parent, x = 0, y = 0)
    {
        this.#parent_tetromino = parent;
        this.#position.x = x;
        this.#position.y = y;
        if(parent != null)
            this.color = parent.color;
    }

    static NullBlock()
    {
        return new Block(null,-111,-111);
    }

    GetPos()
    {
        return JSON.parse(JSON.stringify(this.#position));
    }

    X()
    {
        return this.#position.x;
    }

    Y()
    {
        return this.#position.y;
    }

    GetParent()
    {
        return this.#parent_tetromino;
    }

    Move(x, y)
    {
        this.#position.x += x;
        this.#position.y += y;
    }

    SetPos(x, y)
    {
        this.#position.x = x;
        this.#position.y = y;
    }
}

export class Tetromino{
    #position = new Point(0,0);
    #shape = [  ];
    #blocks = [];
    color = "#FF00FF";

    constructor(shape, x = 0, y = 0)
    {
        this.#shape = shape;
        this.#position.x = x;
        this.#position.y = y;
        for(var i = 0; i < this.#shape.length; i++)
        {
            for(var j = 0; j < this.#shape[i].length; j++)
            {
                if(this.#shape[i][j])
                    this.#blocks.push(new Block(this, x + i, y + j));
            }
        }
    }

    GetShape()
    {
        return JSON.parse(JSON.stringify(this.#shape));
    }

    GetBlocks()
    {
        return this.#blocks.map((x) => x);
    }

    GetPos()
    {
        return JSON.parse(JSON.stringify(this.#position));
    }

    X()
    {
        return this.#position.x;
    }

    Y()
    {
        return this.#position.y;
    }

    RemoveBlock(block)
    {
        this.#blocks = this.#blocks.filter((value, index, array) => {return value != block;});
    }

    Move(x, y, fromRow = 100)
    {
        this.#position.x += x;
        this.#position.y += y;

        for(var i = 0; i < this.#blocks.length; i++)
        {
            if(this.#blocks[i].Y() <= fromRow)
                this.#blocks[i].Move(x,y);
        }
    }

    Rotate()
    {
        let rotated = new Array(this.#shape.length);
        for(var i = 0; i < rotated.length; i++)
            rotated[i] = new Array(this.#shape[i].length);
        
        this.#blocks.length = 0;

        for(var i = 0; i < this.#shape.length; i++)
        {
            for(var j = 0; j < this.#shape[i].length; j++)
            {
                rotated[j][this.#shape.length - i - 1] = this.#shape[i][j];
            }
        }

        for(var i = 0; i < this.#shape.length; i++)
        {
            for(var j = 0; j < this.#shape[i].length; j++)
            {
                if(rotated[i][j])
                    this.#blocks.push(new Block(this, this.#position.x + i, this.#position.y + j));
            }
        }

        this.#shape = rotated;
    }

    NewColor(color = null)
    {
        if (color == null)
        {
            let rgb = [0, 0, 0];
            let sum = 0;
            while (sum == 0 || sum > 2) {
                rgb[0] = Math.round(Math.random());
                rgb[1] = Math.round(Math.random());
                rgb[2] = Math.round(Math.random());
                sum = rgb[0] + rgb[1] + rgb[2]
            }
            this.color = "#";
            for (var i = 0; i < rgb.length; i++)
            {
                if (rgb[i])
                    this.color += "FF";
                else
                    this.color += "00";
            }
        }
        else
        {
            this.color = color;
        }

        for(var i = 0; i < this.#blocks.length; i++)
            this.#blocks[i].color = this.color;

        //console.log("New color: " + this.color);
    }
}

export class I extends Tetromino{
    constructor()
    {
        let shape = [   [0,0,0,0],
                        [1,1,1,1],
                        [0,0,0,0],
                        [0,0,0,0]];
        super(shape, 4, 0);
        this.NewColor("#00FFFF");
    }
}

export class J extends Tetromino{
    constructor()
    {
        let shape = [   [0,0,1],
                        [1,1,1],
                        [0,0,0]];
        super(shape, 4, 1);
        this.NewColor("#0000FF");
    }
}

export class L extends Tetromino{
    constructor()
    {
        let shape = [   [1,0,0],
                        [1,1,1],
                        [0,0,0]];
        super(shape, 4, 1);
        this.NewColor("#FFC800");
    }
}

export class O extends Tetromino{
    constructor()
    {
        let shape = [   [1,1,],
                        [1,1,]];
        super(shape, 4, 1);
        this.NewColor("#FFFF00");
    }
}

export class S extends Tetromino{
    constructor()
    {
        let shape = [   [0,1,1],
                        [1,1,0],
                        [0,0,0]];
        super(shape, 4, 1);
        this.NewColor("#00FF00");
    }
}

export class T extends Tetromino{
    constructor()
    {
        let shape = [   [0,1,0],
                        [1,1,1],
                        [0,0,0]];
        super(shape, 4, 1);
        this.NewColor("#FF00FF");
    }
}

export class Z extends Tetromino{
    constructor()
    {
        let shape = [   [1,1,0],
                        [0,1,1],
                        [0,0,0]];
        super(shape, 4, 1);
        this.NewColor("#FF0000");
    }
}