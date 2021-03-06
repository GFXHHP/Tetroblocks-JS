<!DOCTYPE html>
<html>
    <head>
    <title>Tetroblocks</title>
    <script src="./jquery-3.6.0.min.js"></script>
    <script type="text/javascript">
        window.onload = resizeCanvas;
        function resizeCanvas()
        {
            let width = window.innerWidth;
            let height = window.innerHeight;
            if(width < 200 || height < 400)
                alert("Your window might be too small to enjoy the game!");
            else
            {
                height-= height * 0.15;
                $("#game_canvas")[0].height = height - (height % 100);
                $("#game_canvas")[0].width = (height - (height % 100)) / 1.6;
            }
        }
    </script>
    <script type="module">
        import Game from "./game.js";
        let game = new Game($("#game_canvas")[0],$("#display")[0]);
        game.Start();
    </script>
    <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <h1>Tetroblocks</h1>
        <p>work in progress</p>
        <div id="game">
            <div id="gameplay_area">
                <canvas width="600" height="900" id="game_canvas"></canvas>
            </div>
            <div id="display">
                <h2>Next piece:</h2>
                <canvas width="300" height="300" id="next_piece"></canvas>
                <table>
                    <tr>
                        <td>
                            Lines cleared:
                        </td>
                        <td>
                            <div id="lines">0</div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            High score:
                        </td>
                        <td>
                            <div id="hscore">0</div>
                        </td>
                    </tr>
                    <tr>
                        <td>Current speed:</td>
                        <td>
                            <div id="speed">1.000</div>
                        </td>
                    </tr>
                </table>
                <div id="gameover_display"></div>
                
                <h2>Controls:</h2>

                <table>
                    <tr>
                        <th>Key</th>
                        <th>Alternative key</th>
                        <th>Action</th>
                    </tr>
                    <tr>
                        <td>Left arrow</td>
                        <td>A</td>
                        <td>Move tetromino left.</td>
                    </tr>
                    <tr>
                        <td>Down arrow</td>
                        <td>S</td>
                        <td>Move tetromino down.</td>
                    </tr>
                    <tr>
                        <td>Right arrow</td>
                        <td>D</td>
                        <td>Move tetromino right.</td>
                    </tr>
                    <tr>
                        <td>Up arrow</td>
                        <td>W</td>
                        <td>Rotate tetromino.</td>
                    </tr>
                    <tr>
                        <td colspan="2" align="center">Space</td>
                        <td>
                            Drop tetromino.
                            <br>
                            Restart game after game over.
                        </td>
                    </tr>
                </table>

                <?php
                    require_once "top5.php";
                ?>

                <p>GitHub link:
                    <a href="https://github.com/GFXHHP/Tetroblocks-JS" target="_blank" title="GitHub link">https://github.com/GFXHHP/Tetroblocks-JS</a>
                </p>
                
            </div>
        </div>
    </body>
</html>