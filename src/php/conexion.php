<?php 
    $conexion = mysqli_connect(
        'localhost',
        'root',
        '',
        'inventario_productos'
    );

    if(!$conexion){
        die("Error en la conexión..." . mysqli_connect_error());
    }else{
        #echo "Conexión establecida con exito";
    }

?>