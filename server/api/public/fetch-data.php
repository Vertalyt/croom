<?php
 
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
include 'db.php';

$category = $_GET['category'];
$parent = isset($_GET['parent']) ? $_GET['parent'] : null;


$parentCondition = $parent !== null ? "parent = $parent" : '';
$conditions = array($parentCondition);
$conditionsString = implode(' AND ', array_filter($conditions));

$query = "SELECT * FROM $category" . ($conditionsString ? " WHERE $conditionsString" : '');

$result = $conn->query($query);

if ($result === false) {
	    echo json_encode(array('error' => 'Internal Server Error: ' . $conn->error));
} else {
    $data = array();
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
}

$conn->close();
?>
