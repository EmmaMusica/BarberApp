let pagina = 1;
/**Cuando trabajamos con paginas es de suma importancia prestar atencion donde volver a mandar a llamar una funcion,
 * por ejemplo para este caso, "botonesPaginador()". Si esta funcion no estaria siendo llamada nuevamente dentro de
 * las funciones "paginaSiguiente()" y "paginaAnterior()" nos encontrariamos con un problemas con los botones,
 * ya que es primordial que ante cualquier cambio de pagina los botones de paginacion revisen en qué pagina se encuentran.
 * 
 */

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

/**Creamos un objeto con la intencion de almacenar aquí todos los datos ingresados por el usuario 
 * para la cita que le corresponde.
 */

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
})

function iniciarApp(){
    mostrarServicios();

    //Resalta el Div actual al que se presiona segune el tab al que se presiona
    mostrarSeccion()

    //Oculta o Muestra una seccion segun el tab al que se presiona
    cambiarSeccion();

    //Paginacion: siguiente y anterior
    paginaSiguiente();
    paginaAnterior();

    //Comprueba la pagina actual para ocular o mostrar la paginacion
    botonesPaginador();

    //Muestra el resumen de la cita o mensaje de error en caso de no pasar la validacion
    mostrarResumen(); 

    //Almacena el nombre de la cita en el objeto
    nombreCita();

    //Almacena la fecha de la cita en el objeto
    fechaCita();

    //Deshabilita dias pasados
    deshabilitarFechaAnterior();

    //Almacena la hora de la cita en el objeto
    horaCita();

}


function mostrarSeccion( ) { //---------- Condicionales para mostrar las secciones

    //Eliminar mostrar-seccion de la seccion anterior-------------- (En caso de que existiera)
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if(seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }
    
    //agraga mostrar-seccion donde dimos click
    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion')

    //Eliminar la clase "actual" del tab anterior-------------------- (En caso de que existiera)
    const tabAnterior = document.querySelector('.tabs .actual')
    if(tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    //Resalta el tab actual---------
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');

}

function cambiarSeccion() { //------------------ Evento a los TABS para mostrar las secciones
    const enlaces = document.querySelectorAll('.tabs button');
    enlaces.forEach( (enlace) => {
        enlace.addEventListener('click', (e) => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);


            //Llamar la funcion de mostrar
            mostrarSeccion();
            botonesPaginador();
        })
    })
}

async function mostrarServicios() { //---- Genera HTML / DOM scripting
    try {

        const url = 'http://localhost:3000/servicios.php'; 

        const resultado = await fetch(url);
        const db = await resultado.json();
        // console.log(db)
        // const { servicios } = db;

        //Generar HTML
        db.forEach( servicio => {
            const { id, nombre, precio } = servicio
            
            //DOM scripting
            //-- Generar nombre del servicio

            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            //-- Generar el precio del servicio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            //-- Generar el div de cada boton
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            //-- Selecciona un servicio para la cita
            servicioDiv.onclick = seleccionarServicio  //--------Se le conoce como un eventhandler, difiere del eventListener en que el segundo se lo aplica solo en contenido exitente


            //-- Agregar nombre y precio al div
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            //***CREAMOS UNA CLASE ID="SERVICIOS" EN EL HTML */

            //Inyectamos el servicioDiv en el html

            document.querySelector('#servicios').appendChild(servicioDiv);

        });
    } catch (error) {
        console.log('error');
    }
}

function seleccionarServicio(e) { // ------ Selecciona los servicios a comprar y deselecciona
    //console.log(e.target.tagName); ----> muestra en la consola DIV o P
  
    //Forzar que el elemento al cual le damos click sea el DIV
    let elemento
    if(e.target.tagName === 'P'){
        
        // console.log('Click en el P')
        // console.log(e.target.parentElement) //-----parentElement indica el elemento padre, en este caso el DIV
        elemento = e.target.parentElement;
    
    } else {
        // console.log('Click en el DIV')

        elemento = e.target;
      
    } //-------de esta manera nos aseguramos de que sea donde sea que demos click siempre se esta seleccionando el DIV

    if(elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado'); 

        const id = parseInt(elemento.dataset.idServicio);
        eliminarServicio(id); //---------------------------------- Mandamos a llamar la funcion para que elimine el servicio

    }   else {
        elemento.classList.add('seleccionado');

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio), // id del servicio 
            nombre: elemento.firstElementChild.textContent, // firstElementChild selecciona el elemento 1er hijo (1er parrafo)
            precio: elemento.firstElementChild.nextElementSibling.textContent // con nextElementSibling seleccionamos el siguiente elemento (2do parrafo)
        }

        //console.log(servicioObj)
        agragarServicio(servicioObj); //-------------------------------mandamos a llamar la funcion para que agregue el servicio
    }

}

function eliminarServicio(id) {
    const { servicios } = cita;
    cita.servicios = servicios.filter( servicio => servicio.id !== id )

    console.log(cita); 
}


function agragarServicio(servicioObj){
    const { servicios } = cita;

    cita.servicios = [...servicios, servicioObj]

    console.log(cita);
}



function paginaSiguiente() { //----------- Evento al boton SIGUIENTE
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;


        botonesPaginador();
    });
}

function paginaAnterior() { //------------ Evento al boton ANTERIOR
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;
        
        botonesPaginador();
    })
}

function botonesPaginador() { //---------- Condicionales de los botones (Cuándo deben mostrarse?)
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(pagina === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (pagina === 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');

        mostrarResumen(); //Estamos en la pagina 3, por lo tanto la funcion mostrarResumen debe mandarse a llamar para ser ejecutada otra vez.
    } else{   
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }
    mostrarSeccion(); //Cambia la seccion que se muestra por la de la pagina a la que nos dirigimos
    
}

function mostrarResumen() {
    //Destructuring
    const { nombre, fecha, hora, servicios } = cita;

    //Seleccionar el resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    //limpia el HTML previo

    // resumenDiv.innerHTML = ''; --->> es la formavieja de hacerlo, no es lo correcto

    while( resumenDiv.firstChild ) {
        resumenDiv.removeChild( resumenDiv.firstChild ); 
    }



    //Validacion de objeto con la funcion "Object.values()" y el string metod ".includes()"
    if(Object.values(cita).includes('')) {  //-----------> Object.values() extrae los valores de un objeto | .includes('') revisa si tiene strings vacios
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de servicios, hora, fecha o nombre.';
        noServicios.classList.add('invalidar-cita');

        //Agragar a resumenDiv la nueva clase y el parrafo
        resumenDiv.appendChild(noServicios);

        return; //utilizamos return para que el codigo termine y retorne los resultados. En el if hace que el else no se ejecute

    }
    // Titulo del resumen

    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita'

    //Mostrar el resumen


    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;
    //nombreCita.textContent = `<span>Nombre:</span> ${nombre}`; ---------> con textContent span es tomado como texto, con innerHTML no, es tomado como una etiqueta html

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios'

    serviciosCita.appendChild(headingServicios);

    let cantidad = 0
    // Iterar sobre el arrelo de servicios
    servicios.forEach( servicio => {
        const {nombre, precio} = servicio;

        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;
        
        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicio = precio.split('$');
        // console.log(parseInt(totalServicio[1].trim())); //---------------------------> .trim() elimina los espacios

        cantidad += parseInt(totalServicio[1].trim())
        //Colocar texto y precio en el div

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);

    });


    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita); 
    resumenDiv.appendChild(serviciosCita);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = `<span>Total a pagar: </span> $${cantidad}`

    resumenDiv.appendChild(cantidadPagar);
}

function nombreCita() {
    const nombreInput = document.querySelector('#nombre');
    
    nombreInput.addEventListener('input', (e) => {
        // console.log(e.target.value);
        const nombreTexto = e.target.value.trim(); //---------.trim() es un metodo utilizado para que elimine todos los espacios

        //Validacion de que nombreTexto debe tener algo
        if(nombreTexto === '' || nombreTexto.length < 3) {
            mostarAlerta('Nombre no valido', 'error');
        } else {
            const alerta = document.querySelector('.alerta');
            if (alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto;
        }
    })
}
function mostarAlerta(mensaje, tipo) {

    //Si hay una alerta previa entonces no crear otra
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) {
        return; //recordar que el return corta la ejecucion del codigo.
    }

    const alerta = document.createElement('DIV');

    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    if (tipo === 'error') {
        alerta.classList.add('error');
    }

    //Instertar en el HTML
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    //Eliminar Alerta despues de 3 segundos
    // setTimeout(() => {
    //  alerta.remove();   
    // }, 3000);

}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {
        //console.log(e.target.value);

        const dia = new Date(e.target.value).getUTCDay();
        
        if([0, 6].includes(dia)) {
            e.preventDefault();
            fechaInput.value = '';
            mostarAlerta('Fines de semana no estan permitidos', 'error')
        } else{
            cita.fecha = fechaInput.value;
        }

        // const opciones = {
        //     weekday: 'long',
        //     year: 'numeric', ---------------------------------------------------------------------------Fechas opciones 
        //     month: 'long'
        // }
        // console.log(dia.toLocaleDateString('es-ES', opciones ));
    })
}

function deshabilitarFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');
    
    const fechaAhora = new Date(); //---------Nos da la fecha actual

    const year = fechaAhora.getFullYear(); //--------Nos da el año
    const mes = fechaAhora.getMonth() + 1; //-----------Nos da el mes - 1
    const dia = fechaAhora.getDate() + 1; //------------Nos da el dia

    //Formato deseado: AAAA-MM-DD

    // let fechaDeshabilitar;
    // if(mes < 10 & dia < 10) {
    //     fechaDeshabilitar = `${year}-0${mes}-0${dia}`;
    // } else if( mes < 10){
    //     fechaDeshabilitar = `${year}-0${mes}-${dia}`;
    // } else if( dia < 10){
    //     fechaDeshabilitar = `${year}-${mes}-0${dia}`;
    // } else {
    //     fechaDeshabilitar = `${year}-${mes}-${dia}`;
    // }
    
    // Operador condicional ternario:
    const fechaDeshabilitar = `${year}-${mes < 10 ? `0${mes}` : mes}-${dia < 10 ? `0${dia}` : dia}`
    inputFecha.min = fechaDeshabilitar;
}

function horaCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {
        const horaCita = e.target.value;
        const hora = horaCita.split(':') // ---> .split(':') el metodo split se utiliza para dividir los strings en el valor que se le da de argumento, en este caso serian ':'
        
        if (hora[0] < 10 || hora[0] > 18) {
            mostarAlerta('Hora no válida', 'error')
           
            setTimeout( () => {
                inputHora.value = ''; // para que se reinicie el valor de la hora
            }, 2000)
        } else {
            const alerta = document.querySelector('.alerta');
            if (alerta) {
                alerta.remove();
            }
            cita.hora = horaCita;
        }
    })
}