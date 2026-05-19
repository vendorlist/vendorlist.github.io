<?php

    $servidor   = "localhost";
    $usuario    = "root";
    $pwd        = "";
    $DB         = "e-class";

    //192.168.100.61:8080
    //http://192.168.100.61:8080/e-class2/LogIn/LogIn.html
    //Abriendo la conexión
    $conexion = mysqli_connect($servidor, $usuario, $pwd, $DB);

    if(!$conexion){
        echo "Falló la conexión <br>";
        die("Connection failed: " . mysqli_connect_error());
    }/*else{
        echo "Conexión exitosa";
    }*/

?>