<?php 




$db = mysqli_connect('localhost', 'root', 'root', 'appsalon');

$db->set_charset('utf8'); // muy importante codificar todo en utf8

if(!$db){
    echo "Error en la conexión";
    exit;
} 

//echo "Conexión correcta";