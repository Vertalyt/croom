<?php
$allowedOrigins = array(
    'http://localhost:5173',
    'http://192.168.1.161:5173'
);

$origin = $_SERVER['HTTP_ORIGIN'];
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
include 'db.php';

$category = $_GET['category'];
$parent = isset($_GET['parent']) ? $_GET['parent'] : null;
$typeid = isset($_GET['typeid']) ? $_GET['typeid'] : null;
$minlevel = isset($_GET['minlevel']) ? $_GET['minlevel'] : null;
$rarity = isset($_GET['rarity']) ? $_GET['rarity'] : null;
$requiredSubclass = isset($_GET['requiredSubclass']) ? $_GET['requiredSubclass'] : array();

$conditions = array();
$bindTypes = "";
$bindValues = array();

if ($parent !== null) {
    $conditions[] = "parent = ?";
    $bindTypes .= "i"; // i - целое число
    $bindValues[] = $parent;
}

if ($typeid !== null) {
    if (is_array($typeid)) {
        // Используем точное совпадение
        $conditions[] = "typeid IN (" . implode(',', array_fill(0, count($typeid), '?')) . ")";
        $bindTypes .= str_repeat("s", count($typeid)); // s - строка
        $bindValues = array_merge($bindValues, $typeid);
    } else {
        // Используем точное совпадение
        $conditions[] = "typeid = ?";
        $bindTypes .= "s"; // s - строка
        $bindValues[] = $typeid;
    }
}

if ($minlevel !== null) {
    if (is_array($minlevel)) {
        // Используем IN для массива чисел
        $inPlaceholders = implode(', ', array_fill(0, count($minlevel), '?'));
        $conditions[] = "minlevel IN ($inPlaceholders)";
        $bindTypes .= str_repeat("i", count($minlevel)); // i - целое число
        $bindValues = array_merge($bindValues, $minlevel);
    } else {
        // Используем точное совпадение для числа
        $conditions[] = "minlevel = ?";
        $bindTypes .= "i"; // i - целое число
        $bindValues[] = $minlevel;
    }
}

if ($rarity !== null && is_array($rarity) && count($rarity) > 0) {
    $inPlaceholders = implode(', ', array_fill(0, count($rarity), '?'));
    $conditions[] = "rarity IN ($inPlaceholders)";
    $bindTypes .= str_repeat("s", count($rarity)); // s - строка
    $bindValues = array_merge($bindValues, $rarity);
}

if (!empty($requiredSubclass)) {
    $inPlaceholders = implode(', ', array_fill(0, count($requiredSubclass), '?'));
    $conditions[] = "requiredSubclass IN ($inPlaceholders)";
    $bindTypes .= str_repeat("s", count($requiredSubclass)); // s - строка
    $bindValues = array_merge($bindValues, $requiredSubclass);
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
