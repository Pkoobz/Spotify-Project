<?php
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
}

$response = array();

if(isset($_POST["id"])&&isset($_POST["name"])&&isset($_FILES["file1"])&&isset($_FILES["foto"])){
    $id = $_POST["id"];
    $name = $_POST["name"];
    $file1 = $_FILES["file1"];
    $photo = $_FILES["photo"];
    require_once __DIR__.'/dbconfig.php';
    $db = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE) or
    die(mysqli_connect_error());
    $source0 = $file1['tmp_name0'];
    $destination0 = 'uploads/song/lagu' . $file1['name'];
    move_uploaded_file($source0, $destination0);
    $source1 = $photo['tmp_name1'];
    $destination1 = 'uploads/song/photolagu' . $photo['name'];
    move_uploaded_file($source1, $destination1);
    $result = mysqli_query($db, "INSERT INTO songs(id, name, file1, photo) VALUES('$id', '$name', '$file1', '$photo')");
    if($result){
        $response["success"] = 1;
        $response["message"] = "Data song berhasil dimasukkan";
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