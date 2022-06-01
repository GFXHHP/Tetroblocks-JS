<?php
    define("N", 100);

    require_once "dbcon.php";
    $conn = OpenCon();

    for($i = 0; $i < N; $i++)
    {
        $name = substr(md5(rand()), 0, rand(1, 128));
        $score = rand(1, 301);
        $query = "INSERT INTO scores(name, score) VALUES (\"$name\", $score)";
        //echo $query . "<br>";
        $conn->query($query);
    }
    $conn->close();
    echo "done.";
?>