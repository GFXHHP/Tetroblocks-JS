import * as Tetromino from "./Tetromino.js";

export default class Field{
    #parent_game = null;
    #gameCanvas = null;
    #NextPieceCanvas = null;

    #width = 10;
    #height = 20;

    #blocks = [];
    #tetrominos = [];
    #next_piece = null;

    #lines = 0;

    constructor(game, game_canvas, next_piece_canvas)
    {
        this.#parent_game = game;
        this.#gameCanvas = game_canvas;
        this.#NextPieceCanvas = next_piece_canvas;
        this.InitField();
        this.#next_piece = this.RandomTetromino();
    }

    GetWidth()
    {
        return this.#width;
    }

    GetHeight()
    {
        return this.#height;
    }

    GetLines()
    {
        return this.#lines;
    }

    InitField()
    {
        this.#blocks = new Array(this.#width);
        for(var i=0; i < this.#blocks.length; i++)
        {
            this.#blocks[i] = new Array(this.#height);
            for(var j=0; j < this.#blocks[i].length; j++)
            {
                this.#blocks[i][j] = Tetromino.Block.NullBlock();
            }
        }
    }

    CalculateBlocks()
    {
        this.InitField();

        for(var i = 0; i < this.#tetrominos.length; i++)
        {
            let curr = this.#tetrominos[i];
            for(var j = 0; j < curr.GetBlocks().length; j++)
            {
                let block = curr.GetBlocks()[j];
                this.#blocks[block.X()][block.Y()] = block;
            }
        }
    }

    RandomTetromino()
    {
        let tmp = null;
        let rand = Math.floor(Math.random() * 7);
        switch(rand)
        {
            case 0:
                tmp = new Tetromino.I();
                break;
            case 1:
                tmp = new Tetromino.J();
                break;
            case 2:
                tmp = new Tetromino.L();
                break;
            case 3:
                tmp = new Tetromino.O();
                break;
            case 4:
                tmp = new Tetromino.S();
                break;
            case 5:
                tmp = new Tetromino.T();
                break;
            case 6:
                tmp = new Tetromino.Z();
                break;
            default:
                console.error("could not create random tetromino!");
                break;
        }

        let rotate = Math.floor(Math.random() * 3);
        for(var i = 0; i < rotate; i++)
            tmp.Rotate();

        return tmp;
    }

    AddTetromino(tetromino = this.#next_piece)
    {
        var ok = true;
        var shape = tetromino.GetShape();
        for(var i = 0; i < tetromino.GetBlocks().length; i++)
        {
            let block = tetromino.GetBlocks()[i]
            if(this.#blocks[block.X()][block.Y()].GetParent() != null)
            {
                this.#parent_game.GameOver();
                return;
            }
        }

        this.#tetrominos.push(tetromino);
        let blocks = tetromino.GetBlocks();
        for (var i = 0; i < blocks.length; i++)
            this.#blocks[blocks[i].X()][blocks[i].Y()] = blocks[i];
        this.#next_piece = this.RandomTetromino();
        this.DrawUI();
    }

    SetTetromino()
    {
        let current = this.#tetrominos[this.#tetrominos.length - 1];
        let blocks = current.GetBlocks();
        let rows = [];
        for(var i = 0; i < blocks.length; i++)
        {
            if(blocks[i].Y() < 4)
            {
                this.#parent_game.GameOver();
                return;
            }
            
            if(!rows.includes(blocks[i].Y()))
                rows.push(blocks[i].Y());
        }
        rows = rows.sort((a,b) => {return a - b;});
        for(var i = 0; i < rows.length; i++)
        {
            let full = true;
            for(var j = 0; j < this.#width; j++)
                if(this.#blocks[j][rows[i]].GetParent() == null) full = false;
            
            if(full)
                this.ClearRow(rows[i]);
        }

        let copy = new Tetromino.Tetromino(this.#next_piece.GetShape(), this.#next_piece.X(), this.#next_piece.Y());
        copy.Move(0,1);
        for(var i = 0; i < copy.GetBlocks().length; i++)
        {
            let block = copy.GetBlocks()[i];
            if(this.#blocks[block.X()][block.Y()].GetParent() != null)
            {
                this.#parent_game.GameOver();
                return;
            }
        }

        this.AddTetromino();
    }

    MoveTetromino(x, y)
    {
        let tetro = this.#tetrominos[this.#tetrominos.length - 1];
        let blocks = tetro.GetBlocks();

        //Collision detection:
        for(var i = 0; i < blocks.length; i++)
        {
            let newX = blocks[i].X() + x;
            let newY = blocks[i].Y() + y;

            if(newX < 0)
            {
                //console.log("New X value would be less than 0!");
                return false;
            }
            if (newY < 0)
            {
                //console.log("New Y value would be less than 0!");
                return false;
            }
            if (newY == this.#height)
            {
                this.SetTetromino();
                return false;
            }
            if(newX > (this.#width - 1) || newY > (this.#height - 1))
            {
                //console.log("cannot move tetromino, already against a border");
                return false;
            }
            let parent = this.#blocks[newX][newY].GetParent();
            if(parent != null && parent != blocks[i].GetParent())
            {
                //console.log("cannot move tetromino, already against another tetromino");
                if(x == 0 && y > 0)
                    this.SetTetromino();
                return false;
            }
        }

        tetro.Move(x, y);

        this.CalculateBlocks();

        return true;
    }

    RotateTetromino()
    {
        let current_tetromino = this.#tetrominos[this.#tetrominos.length - 1];
        let blocks = current_tetromino.GetBlocks();

        //Collision detection:
        let can_rotate = true;
        let moved = false;

        let tmp = new Tetromino.Tetromino(current_tetromino.GetShape(), current_tetromino.X(), current_tetromino.Y());
        tmp.Rotate();

        let count = 0;
        do
        {
            for(var i = 0; i < tmp.GetBlocks().length; i++)
            {
                let block = tmp.GetBlocks()[i];

                if (block.X() < 0)
                {
                    tmp.Move(-1 * tmp.X(), 0);
                    moved = true;
                }
                if (block.Y() < 0)
                {
                    tmp.Move(0, -1 * tmp.Y());
                    moved = true;
                }
                if (block.X() > (this.#width - 1))
                {
                    tmp.Move(-1 * tmp.X() + (this.#width - tmp.GetShape().length), 0);
                    moved = true;
                }
                if (block.Y() > (this.#height - 1))
                {
                    tmp.Move(0, -1 * tmp.Y() + (this.#height - tmp.GetShape().length));
                    moved = true;
                }

                let parent = this.#blocks[block.X()][block.Y()].GetParent();

                if (parent != null && parent != blocks[i].GetParent())
                {
                    if(moved)
                        return false;
                    else
                    {
                        tmp.Move(0,-1);
                        moved = true;
                    }
                }
            }
            count++;
        }
        while((count < 2) && moved)

        if(moved)
            current_tetromino.Move(tmp.X() - current_tetromino.X(), tmp.Y() - current_tetromino.Y());

        current_tetromino.Rotate();

        this.CalculateBlocks();

        return true;
    }

    GetTetromino()
    {
        return this.#tetrominos[this.#tetrominos.length - 1]; 
    }

    ClearRow(row)
    {
        for(var i = 0; i < this.#width; i++)
        {
            this.#blocks[i][row].GetParent().RemoveBlock(this.#blocks[i][row]);
            this.#blocks[i][row] = Tetromino.Block.NullBlock();
        }

        let tetrominos = [];
        for (var i = 4; i < row; i++)
        {
            for(var j = 0; j < this.#width; j++)
            {
                let parent = this.#blocks[j][i].GetParent();
                if(!tetrominos.includes(parent) && parent != null)
                    tetrominos.push(parent);
            }
        }

        for(var i = 0; i < tetrominos.length; i++)
            tetrominos[i].Move(0,1, row);

        this.#lines++;

        this.CalculateBlocks();
    }

    PrintBlocks()
    {
        console.log(this.#blocks);

        let out = "";
        for(var i = 0; i < this.#height; i++)
        {
            for(var j = 0; j < this.#width; j++)
            {
                if(this.#blocks[j][i].GetParent() == null)
                    out += "0 ";
                else
                    out += "1 ";
            }
            out += "\n";
        }
        console.log(out);
    }

    Draw()
    {
        const squareSize = (this.#gameCanvas.width / this.#width) - (this.#gameCanvas.width / this.#width) % 5;
        const widthMargin = (this.#gameCanvas.width - this.#width * squareSize) / 2;
        const heightMargin = (this.#gameCanvas.height - (this.#height - 4) * squareSize) / 2;

        const ctx = this.#gameCanvas.getContext("2d");
        ctx.clearRect(0, 0, this.#gameCanvas.width, this.#gameCanvas.height);
        ctx.beginPath();

        //Background:
        ctx.fillStyle = "#252525";
        ctx.fillRect(0, 0, this.#gameCanvas.width, this.#gameCanvas.height);

        this.CalculateBlocks();

        //Empty blocks:
        ctx.fillStyle = "#999999";
        ctx.fillRect(widthMargin, heightMargin, (squareSize * this.#width), (squareSize * (this.#height - 4)));

        //Where the falling peace will land:
        let copy = new Tetromino.Tetromino(this.GetTetromino().GetShape(), this.GetTetromino().X(), this.GetTetromino().Y());
        let collision = false;
        while(!collision)
        {
            copy.Move(0,1);
            for(var i = 0; i < copy.GetBlocks().length; i++)
            {
                let block = copy.GetBlocks()[i];
                if(block.Y() == this.#height)
                {
                    collision = true;
                    break;
                }
                let parent = this.#blocks[block.X()][block.Y()].GetParent();
                if((parent != null) && parent != this.GetTetromino())
                {
                    collision = true;
                    break;
                }
            }
        }
        copy.Move(0, -1);
        ctx.fillStyle = "#DDDDDD";
        for(var i = 0; i < copy.GetBlocks().length; i++)
        {
            let block = copy.GetBlocks()[i];
            if(block.Y() > 3)
            ctx.fillRect(widthMargin + (block.X() * squareSize), heightMargin+((block.Y() - 4) * squareSize), squareSize, squareSize);
        }

        //Tetrominos:
        for(var i = 0; i < this.#blocks.length; i++)
        {
            for(var j = 4; j < this.#blocks[i].length; j++)
            {
                if(this.#blocks[i][j].GetParent() != null)
                {
                    ctx.fillStyle = this.#blocks[i][j].color;
                    ctx.fillRect(widthMargin + (i*squareSize), heightMargin+((j-4)*squareSize), squareSize, squareSize);
                }
                ctx.rect(widthMargin + (i*squareSize), heightMargin+((j-4)*squareSize), squareSize, squareSize);
            }
        }

        ctx.stroke();
    }

    DrawUI()
    {
        const canvasArea = this.#NextPieceCanvas.width * this.#NextPieceCanvas.height;
        const squareArea = this.#next_piece.GetShape().length * this.#next_piece.GetShape().length;
        let squareSize = Math.floor(Math.sqrt(canvasArea/squareArea));
        squareSize -= squareSize % 5;
        const widthMargin = (this.#NextPieceCanvas.width - this.#next_piece.GetShape().length * squareSize) / 2;
        const heightMargin = (this.#NextPieceCanvas.height - (this.#next_piece.GetShape().length) * squareSize) / 2;

        const ctx = this.#NextPieceCanvas.getContext("2d");
        ctx.clearRect(0, 0, this.#NextPieceCanvas.width, this.#NextPieceCanvas.height);
        ctx.beginPath();

        //Background:
        ctx.fillStyle = "#252525";
        ctx.fillRect(0, 0, this.#NextPieceCanvas.width, this.#NextPieceCanvas.height);

        for(var i = 0; i < this.#next_piece.GetShape().length; i++)
        {
            for(var j = 0; j < this.#next_piece.GetShape()[i].length; j++)
            {
                if(this.#next_piece.GetShape()[i][j])
                    ctx.fillStyle = this.#next_piece.color;
                else
                    ctx.fillStyle = "#999999";
                
                ctx.fillRect(widthMargin + (i*squareSize), heightMargin+(j*squareSize), squareSize, squareSize);
                ctx.rect(widthMargin + (i*squareSize), heightMargin+(j*squareSize), squareSize, squareSize);
            }
        }

        ctx.stroke();
    }
}