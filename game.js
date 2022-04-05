import Field from "./Field.js";
import * as Tetromino from "./Tetromino.js";

export default class Game
{
    #field = null;
    #gameCanvas = null;
    #nextPieceCanvas = null;

    #Storage = window.localStorage;

    #canPlay = false;
    #canLower = true;

    constructor(game_canvas, next_piece_canvas)
    {
        this.#field = new Field(this, game_canvas, next_piece_canvas);
        this.#gameCanvas = game_canvas;
        this.#nextPieceCanvas = next_piece_canvas;

        window.addEventListener("keydown", this.KeyDown.bind(this));
    }

    Start()
    {
        this.#canPlay = true;
        console.log("Starting new game.");
        
        this.CanLowerCountdown();
        this.#field.AddTetromino();

        this.Loop();
    }

    GameOver()
    {
        if(this.#canPlay)
        {
            alert("Game over!\nYou can press space or reload the page to play again.");
            console.log("Game over!");
            this.#canPlay = false;
        }
    }

    Clear()
    {
        this.#field = new Field(this, this.#gameCanvas, this.#nextPieceCanvas);
    }

    Loop()
    {
        this.#field.MoveTetromino(0,1);
        this.#field.Draw();
        
        if(this.#canPlay)
        {
            let time = 1000 - (this.#field.GetLines() * 20);
            if(time < 350) time = 350;
            setTimeout(this.Loop.bind(this), time);
            
            let speed = new Intl.NumberFormat('en-EN', { maximumSignificantDigits: 4 }).format(1000.0 / time);
            $("#speed")[0].innerHTML = speed;
        }
    }

    KeyDown(e)
    {
        if(!this.#canPlay)
        {
            if(e.code == "Space")
            {
                this.Clear();
                this.Start();
            }
            else
                console.log("Game over. To restart press space.");
            
            return;
        }
        switch(e.code)
        {
            case "KeyW":
            case "ArrowUp":
                this.#field.RotateTetromino();
                break;
            case "KeyA":
            case "ArrowLeft":
                this.#field.MoveTetromino(-1,0);
                break;
            case "KeyS":
            case "ArrowDown":
                if(this.#canLower)
                    this.#field.MoveTetromino(0,1);
                this.#canLower = false;
                break;
            case "KeyD":
            case "ArrowRight":
                this.#field.MoveTetromino(1,0);
                break;
            case "Space":
                while(this.#field.MoveTetromino(0,1));     
                break;
            //Debug:
            case "Backspace":
                console.log(this.#field.GetTetromino());
                break;
            case "Delete":
                console.log(this.#field.PrintBlocks());
                break;

        }
        this.Draw();
    }

    CanLowerCountdown()
    {
        const interval = 500;
        this.#canLower = true;
        if(this.#canPlay)
            setTimeout(this.CanLowerCountdown.bind(this), interval);
    }

    Draw()
    {
        this.#field.Draw();
        let current_lines = this.#field.GetLines();
        let high_score = this.#Storage.getItem("highscore");
        $("#lines")[0].innerHTML = current_lines;
        if(current_lines > high_score)
        {
            high_score = current_lines;
            this.#Storage.setItem("highscore",high_score);
        }
        $("#hscore")[0].innerHTML = high_score;
    }
}