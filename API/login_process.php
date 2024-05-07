<?php
session_start();
require_once __DIR__.'/dbconfig.php';

$email = $_POST["email"];
$pass = $_POST["pass"];

$sql = "SELECT * FROM users WHERE email = ?";
$stmt = $db->prepare($sql);
$stmt->execute([$email]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if(!row){
    echo "User tidak ditemukan";
}else{
    if(!password_verify($pass, $row['pass'])){
        echo"Password salah";
    }else{
        $_SESSION['id']= $row['id'];
        $_SESSION['type']=$row['type'];
        $_SESSION['email']=$row['email'];
        header('location:Page.php');
    };
};
?>