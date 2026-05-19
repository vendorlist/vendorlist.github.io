<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <?php
        include("../PhpFks/Conexion.php");
        include("../PhpFks/validateLogIn.php");

        
        //$fname = mysqli_real_escape_string($conn, $_POST['fname']);
        //$lname = mysqli_real_escape_string($conn, $_POST['lname']);
        
        if(isset($_FILES['userImg'])){
            $img_name = $_FILES['userImg']['name'];
            $img_type = $_FILES['userImg']['type'];
            $tmp_name = $_FILES['userImg']['tmp_name'];
                        
            $img_explode = explode('.',$img_name);
            $img_ext = end($img_explode);
        
            $extensions = ["jpeg", "png", "jpg"];
            if(in_array($img_ext, $extensions) === true){
                $types = ["image/jpeg", "image/jpg", "image/png"];
                if(in_array($img_type, $types) === true){
                    $time = time();
                    $new_img_name = $time.$img_name;

                    $micarpeta = ("../$tmp_name'images/'.$new_img_name");
                    if (!file_exists($micarpeta)) {
                        mkdir($micarpeta, 0777, true);
                    }

                    if(move_uploaded_file("../$tmp_name'images/'.$new_img_name")){
                        $ran_id = rand(time(), 100000000);

                        $sql = "UPDATE persona
                                SET FotoPerfil='$name'
                                WHERE User = '$user'";

                        if(mysqli_query($conexion, $sql)){  //Ejecutamos el query y verificamos si se guardaron los datos
                            echo "alert('Tu foto ha sido guardada')";
                            header("Location: http://eclass:8080/PhpFks/leerImg.php");
                        }else{
                            echo "Error: " . $sql . "<br>" . mysqli_error($conexion);
                        }
                        
                    }
                }else{
                    echo "Cargue un archivo de imagen - jpeg, png, jpg";
                }
            }else{
                echo "Cargue un archivo de imagen - jpeg, png, jpg";
            }
        }
            
    /*$types = ["image/jpeg", "image/jpg", "image/png"];
                if(in_array($img_type, $types) === true){
                    $time = time();
                    $new_img_name = $time.$img_name;
                    if(move_uploaded_file($tmp_name,"images/".$new_img_name)){
                        $ran_id = rand(time(), 100000000);
                        $status = "Activo ahora";
                        $encrypt_pass = md5($password);
                        $insert_query = mysqli_query($conn, "INSERT INTO users (unique_id, fname, lname, email, password, img, status)
                        VALUES ({$ran_id}, '{$fname}','{$lname}', '{$email}', '{$encrypt_pass}', '{$new_img_name}', '{$status}')");
                        if($insert_query){
                            $select_sql2 = mysqli_query($conn, "SELECT * FROM users WHERE email = '{$email}'");
                            if(mysqli_num_rows($select_sql2) > 0){
                                $result = mysqli_fetch_assoc($select_sql2);
                                $_SESSION['unique_id'] = $result['unique_id'];
                                echo "success";
                            }else{
                                echo "¡Esta dirección de correo electrónico no existe!";
                            }
                        }else{
                            echo "Algo salió mal. ¡Inténtalo de nuevo!";
                        }
                    }
                }else{
                    echo "Cargue un archivo de imagen - jpeg, png, jpg";
                }
     */



/*
        $query="SELECT FotoPerfil
                FROM persona
                WHERE User = '$user'";

        $res = mysqli_query($conexion, $query);
        //while($row=mysqli_fetch_assoc($res)){}
        $row=mysqli_fetch_assoc($res);
        echo $row['FotoPerfil'];
        echo filetype($row['FotoPerfil']);
        $micarpeta = "../img/'$user'";
        /*if (!file_exists($micarpeta)) {
            mkdir($micarpeta, 0777, true);
        }*/
        //ibase_blob_echo($row['FotoPerfil']);
        
    ?>
    <!--<img src="data:image/png;base64,--><?php //echo base64_encode($row['FotoPerfil']); ?><!--">-->
    
</body>
</html>