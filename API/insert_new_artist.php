<?php
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
}

$response = array();

if(isset($_POST["id"])&&isset($_POST["name"])&&isset($_FILES["foto"])){
    $id = $_POST["id"];
    $name = $_POST["name"];
    $photo = $_FILES["photo"];
    require_once __DIR__.'/dbconfig.php';
    $db = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE) or
    die(mysqli_connect_error());
    $source2 = $file['tmp_name2'];
    $destination2 = 'uploads/artist' . $photo['name'];
    move_uploaded_file($source2, $destination2);
    $result = mysqli_query($db, "INSERT INTO artists(id, name,  photo) VALUES('$id', '$name', '$photo')");
    if($result){
        $response["success"] = 1;
        $response["message"] = "Data artist berhasil dimasukkan";
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