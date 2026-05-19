<?php

    session_start();    //Inicia una nueva sesión o reanuda la existente
    $login = $_SESSION['login'];

    if(!$login){
        header("Location: http://eclass:8080/LogIn/LogIn.html");
    }else{
        $user = $_SESSION['user'];
        //header('Access-Control-Allow-Origin: *');   //CORS
        //header("Location: http://eclass:8080/Home/Home.php");

    }

?>

