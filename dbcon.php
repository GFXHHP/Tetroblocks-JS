<?php

define("SERVER", "localhost");
define("USER", "root");
define("PASSWORD", "");
define("DB", "tetroblocks");

function OpenCon()
{
    $conn = new mysqli(SERVER, USER, PASSWORD, DB) or die("Connect failed: %s\n". $conn->error);
    return $conn;
}

function CloseCon($conn)
{
    $conn->close();
}

?>