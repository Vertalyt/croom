<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
include 'db.php';

$category = $_GET['category'];
$parent = isset($_GET['parent']) ? $_GET['parent'] : null;
$typeid = isset($_GET['typeid']) ? $_GET['typeid'] : null;
$minlevel = isset($_GET['minlevel']) ? $_GET['minlevel'] : null;

$conditions = array();
$bindTypes = "";
$bindValues = array();

if ($parent !== null) {
    $conditions[] = "parent = ?";
    $bindTypes .= "i"; // i - целое число
    $bindValues[] = $parent;
}

if ($typeid !== null && is_array($typeid)) {
    $inPlaceholders = implode(', ', array_fill(0, count($typeid), '?'));
    $conditions[] = "typeid IN ($inPlaceholders)";
    $bindTypes .= str_repeat("i", count($typeid));
    $bindValues = array_merge($bindValues, $typeid);
} elseif ($typeid !== null) {
    $conditions[] = "typeid = ?";
    $bindTypes .= "i"; // i - целое число
    $bindValues[] = $typeid;
}

if ($minlevel !== null) {
    $conditions[] = "minlevel = ?";
    $bindTypes .= "i"; // i - целое число
    $bindValues[] = $minlevel;
}

$conditionsString = implode(' AND ', $conditions);

$query = "SELECT * FROM $category" . ($conditionsString ? " WHERE $conditionsString" : '');

$stmt = $conn->prepare($query);

if ($stmt) {
    if (!empty($bindTypes)) {
        $bindParams = array_merge(array($bindTypes), $bindValues);
        call_user_func_array(array($stmt, 'bind_param'), $bindParams);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    if ($result === false) {
        echo json_encode(array('error' => 'Internal Server Error: ' . $conn->error));
    } else {
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
    }

    $stmt->close();
} else {
    echo json_encode(array('error' => 'Internal Server Error: ' . $conn->error));
}

$conn->close();
?>
