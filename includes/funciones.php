<?php
/**1ro. Importamos la conexion a la base de datos
 * 2do. Escribimos el codigo que tenemos que consultar, es decir, realizamos la consulta.
 * 3ro. Transformamos el resultado en un arreglo para que php pueda interpretarlos.
 */
function obtenerServicios() : array {  // " : array "  declara que la funcion retorna un array
    try {
        //importar una conexion de base de datos
        require 'databases.php';


        //Escribir el codigo SQL

        $sql = "SELECT * FROM servicios;";

        $consulta = mysqli_query($db, $sql);

        //Arreglo vacio
        $servicios = [];

        $i = 0;
        //Obtener los resultados
        while( $row = mysqli_fetch_assoc($consulta) ) {
            $servicios[$i]['id'] = $row['id'];
            $servicios[$i]['nombre'] = $row['nombre'];
            $servicios[$i]['precio'] = $row['precio'];


            $i++;
        }
        
        // echo '<pre>';
        // var_dump( $servicios );
        // echo '</pre>';

        return $servicios;

    }catch(\Throwable $th) {

        var_dump($th);
    }
}


obtenerServicios();