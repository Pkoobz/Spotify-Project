<?php
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
}

$response = array();

if(isset($_POST["id"])&&isset($_POST["name"])&&isset($_POST["type"])&&isset($_FILES["foto"])&&isset($_POST["email"])&&isset($_POST["pass"])){
    $id = $_POST["id"];
    $name = $_POST["name"];
    $type = $_POST["type"];
    $foto = $_FILES["foto"];
    $email = $_POST["email"];
    $pass = $_POST["pass"];
    $en_pass = password_hash($pass, PASSWORD_BCRYPT);
    require_once __DIR__.'/dbconfig.php';
    $db = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE) or
    die(mysqli_connect_error());
    $source = $foto['tmp_name'];
    $destination = 'uploads/user' . $foto['name'];
    move_uploaded_file($source, $destination);
    $result = mysqli_query($db, "INSERT INTO users(id, name, type, foto, email, pass) VALUES(?, ?, ?, ?, ?, ?)");
    if($result){
        $response["success"] = 1;
        $response["message"] = "Data user berhasil dimasukkan";
    } else {
        $response["success"] = 0;
        $response["message"] = "Ada kesalahan";
    }
    echo json_encode($response);

}else {
    $response["success"] = 0;
    $response["message"] = "data tidak lengkap";
    echo json_encode($response);
}
?>