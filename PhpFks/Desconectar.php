<?php

    include("../PhpFks/Conexion.php");
    include("../PhpFks/validateLogIn.php");

    $Per = $_SESSION['IDP'];
    
    $sql1 = "UPDATE chat
            SET Estado = '0'
            WHERE Nombre = '$Per'";
    mysqli_query($conexion, $sql1);

    $sql2 = "UPDATE persona
            SET Estado = '0'
            WHERE User = '$Per'";
    mysqli_query($conexion, $sql2);

?>

<h1><?php echo $Per;?>, seguro que quieres salir?</h1>
<a href="../PhpFks/CerrarSesion.php">Sí</a>