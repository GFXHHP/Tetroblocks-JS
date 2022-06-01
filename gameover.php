<?php
    $score = isset($_POST["score"]) ? intval($_POST["score"]) : null;

    echo "<h3 style=\"color:red;\">Game over! Press space to start a new game!</h3>";
    //Form:
    //echo "<form target=\"_blank\" action=\"send_score.php\" method=\"post\">";
    if($score > 0)
    {
        echo "<form action=\"send_score.php\" method=\"post\">";
        echo "<table><tr>";
        echo "<td>Name: </td>";
        echo "<td><input type=\"text\" name=\"name\"></input></td>";
        echo "<input type=\"hidden\" name=\"score\" value=\"$score\"></input>";
        echo "<td><input type=\"submit\" value=\"Submit score\"></input></td>";
        echo "</tr></table>";
        echo "</form>";
    }
?>