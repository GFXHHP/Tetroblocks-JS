<?php
    $name = isset($_POST["name"]) ? substr(htmlspecialchars($_POST["name"]), 0, 128) : null;
    $score = isset($_POST["score"]) ? intval($_POST["score"]) : null;

    if( $name != null && $score != null)
    {    
        require_once "dbcon.php";
        $conn = OpenCon();
        
        $conn->query("INSERT INTO scores(name, score) VALUES (\"$name\", $score)");

        $conn->close();
    }

    //echo "<script type=\"text/javascript\">window.close();</script>";
    $referer = $_SERVER['HTTP_REFERER'];
    header("Location: $referer");
    
?>