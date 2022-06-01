<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<?php

define("DEFAULT_ROWS_PER_PAGE", 50);

function GetFrom()
{
    if (isset($_GET["from"]))
    {
        $from = htmlspecialchars($_GET["from"]);
        $val = intval($from);
        if($val > 1)
            return $val;
    }
    return 1;
}

function GetRows()
{
    if (isset($_GET["rows"]))
    {
        $rows = htmlspecialchars($_GET["rows"]);
        $val = intval($rows);
        if($val > 0)
            return $val;
    }
    return DEFAULT_ROWS_PER_PAGE;
}

function GetSort()
{
    if (isset($_GET["sort"]))
    {
        $sort = htmlspecialchars($_GET["sort"]);
        switch ($sort)
        {
            case "score":
            case "name":
            case "date":
                return $sort;
        }
    }
    return "score";
}

    require_once "dbcon.php";
    $conn = OpenCon();

    $rows = GetRows();
    //echo "rows: " . $rows . "<br>";
    $num_of_scores = ($conn->query("SELECT COUNT(id) as 'count' FROM scores"))->fetch_assoc()["count"];
    //echo "num_o_s: " . $num_of_scores . "<br>";
    $sort = GetSort();
    //echo $sort . "<br>";
    $from = GetFrom();
    if($from > $num_of_scores)
        $from = $num_of_scores;
    //echo "from: " . $from . "<br>";
    $to = $from + $rows - 1;
    //echo "to:" . $to . "<br>";
    $query = "SELECT name, score, date FROM scores ORDER BY $sort DESC LIMIT $rows";
    if($num_of_scores >= $from)
        $query .= " OFFSET " . ($from - 1);
    //echo $query . "<br>";
    $result = $conn->query($query);

    echo "<h1>Tetroblocks high scores</h1>";

    if($result->num_rows > 0)
    {
        echo "<table>";

        //Table Head:
        echo "<tr>";
        echo "<th>Place</th>";
        echo "<th><a class=\"";
        if($sort == "name")
            echo "chosen_header_sort";
        else
            echo "header_sort";
        echo "\" href=\"scores.php?from=$from&rows=$rows&sort=name\">Name</a></th>";
        echo "<th><a class=\"";
        if($sort == "score")
            echo "chosen_header_sort";
        else
            echo "header_sort";
        echo "\" href=\"scores.php?from=$from&rows=$rows&sort=place\">Score</a></th>";
        echo "<th><a class=\"";
        if($sort == "date")
            echo "chosen_header_sort";
        else
            echo "header_sort";
        echo "\" href=\"scores.php?from=$from&rows=$rows&sort=date\">Date</a></th>";
        echo "</tr>";

        //Scores:
        for( $i = 0; $row = $result->fetch_assoc(); $i++)
        {
            echo "<tr>\n<td>" . ($from + $i) . ".</td><td>" . $row['name'] . "</td>\n<td align=\"center\">" . $row['score'] . "</td>\n<td>" . $row['date'] . "</td>\n</tr>";
        }

        //Navigation:
        echo "<tr>";
        echo "<td align=\"left\"> <a href=\"scores.php?from=1&rows=$rows&sort=$sort\">First page</a> </td>";
        echo "<td align=\"center\">";
        if(($from > 1) && ($from - $rows) > 0)
            echo "<a href=\"scores.php?from=" . ($from - $rows) . "&rows=$rows&sort=$sort\">";
        echo "<- Previous page";
        if(($from > 1) && ($from - $rows) > 0)
            echo "</a>";

        echo "</td><td align=\"center\">";
        if($to + 1 <= $num_of_scores)
            echo "<a href=\"scores.php?from=" . ($to + 1) . "&rows=$rows&sort=$sort" . "\">";
        echo "Next page ->";
        if($to + 1 <= $num_of_scores)
            echo "</a>";
        echo "</td>";
        echo "<td align=\"right\"> <a href=\"scores.php?from=" . ($rows * floor($num_of_scores / $rows) + 1) . "&rows=$rows&sort=$sort\">Last page</a> </td>";
        echo "</tr>";

        echo "</table>";
    }
    else
    {
        echo "<p>No scores submitted yet/cannot connect to database.</p>";
    }
    $conn->close();
    echo "<a href=\"/Tetroblocks-JS/\">Back to the game!</a>"
?>

</body>
</html>