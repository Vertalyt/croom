<?php
include '../db_config.php';

$conn = new mysqli($dbConfig['host'], $dbConfig['user'], $dbConfig['password'], $dbConfig['database']);

if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}
?>
