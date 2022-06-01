<?php
    require_once "dbcon.php";
    $conn = OpenCon();
    echo "<h2>Top 5 scores:</h2>";
    $query = "SELECT name, score, date FROM scores ORDER BY score DESC LIMIT 5";
    $result = $conn->query($query);
    //var_dump($result);
    if($result->num_rows > 0)
    {
        echo "<table>";
        echo "<tr><th>Place</th><th>Name</th><th>Score</th><th>Date</th></tr>";
        for( $i = 1; $row = $result->fetch_assoc(); $i++)
        {
            echo "<tr>\n<td>" . $i . ".</td><td>" . $row['name'] . "</td>\n<td>" . $row['score'] . "</td>\n<td>" . $row['date'] . "</td>\n</tr>";
        }
        echo "</table>";
        echo "<a href=\"scores.php\">All high scores</a>";
    }
    else
    {
        echo "<p>No scores yet/cannot connect to database.</p>";
    }
?>