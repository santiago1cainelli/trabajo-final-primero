import { obtenerArticulos, insertarArticulos, actualizarArticulos, eliminarArticulo } from "../modelos/articulos.js";

// Objetos del DOM
const listado = document.querySelector("#listado");
const alerta = document.querySelector('#alerta');
// Formulario
const formulario = document.querySelector('#formulario');
const formularioModal = new bootstrap.Modal(document.querySelector('#formularioModal'));
const btnNuevo = document.querySelector('#btnNuevo');
// Inputs
const inputCodigo = document.querySelector('#codigo');
const inputNombre = document.querySelector('#nombre');
const inputDescripcion = document.querySelector('#descripcion');
const inputPrecio = document.querySelector('#precio');
const inputImagen = document.querySelector('#imagen');
// Imagen del formulario
const frmImagen = document.querySelector('#frmimagen');
// Variables
let opcion = '';
let id;
let mensajeAlerta = '';
let articulos = [];
let articulo = {};

document.addEventListener('DOMContentLoaded', () => {
    mostrarArticulos();
})

async function mostrarArticulos() {
    articulos = await obtenerArticulos();
    listado.innerHTML = ''; // Borramos el listado

    articulos.map((articulo) => {
        listado.innerHTML += `
            <div class="col">
                <div class="card" style="width: 18rem">
                    <img src="./imagenes/productos/${articulo.imagen}" class="card-img-top" alt="${articulo.nombre}" />
                    <div class="card-body">
                        <h5 class="card-title">
                            <span name="spancodigo">${articulo.codigo}</span> - <span name="spannombre">${articulo.nombre}</span>
                        </h5>
                        <p class="card-text">
                            ${articulo.descripcion}
                        </p>
                        <h5>$ <span name="spanprecio">${articulo.precio}</span>.-</h5>
                        <input type="number" name="inputcantidad" class="form-control" value="0" min="0" max="30" />
                    </div>
                    <div class="card-footer d-flex justify-content-center">
                        <button class="btn-editar btn btn-primary">Editar</button>
                        <button class="btn-borrar btn btn-danger">Borrar</button>
                        <input type="hidden" class="id-articulo" value="${articulo.id}" />
                    </div>
                </div>
            </div>
        `;
    });
}

/**
* Ejecuta el evento click del botón Nuevo
*/
btnNuevo.addEventListener('click', () => {
    // Limpiamos los inputs
    inputCodigo.value = null;
    inputNombre.value = null;
    inputDescripcion.value = null;
    inputPrecio.value = null;
    inputImagen.value = null;
    frmImagen.src = './imagenes/productos/nodisponible.png';
// Mostramos el formulario Modal
    formularioModal.show();
    opcion = 'insertar';
})
/**
* Ejecuta el evento submit del formulario
*/
formulario.addEventListener('submit', (e) => {
    e.preventDefault(); // Previene la acción por defecto
    const datos = new FormData(formulario); // Guardamos los datos del formulario

    switch(opcion) {
        case 'insertar':
            insertarArticulos(datos); // Ejecutamos el método insertarArticulos del modelo
            mensajeAlerta = 'Datos guardados';
            break;
        case 'actualizar':
            actualizarArticulos(datos, id);
            mensajeAlerta = 'Datos actualizados';
            break;
        }
        insertarAlerta(mensajeAlerta, 'success');
        mostrarArticulos(); // Mostramos los artículos

        })

/**
* Define el mensaje de alerta
* @param mensaje el mensaje a mostrar
* @param tipo el tipo de mensaje
*/
const insertarAlerta = (mensaje, tipo) => {
    const envoltorio = document.createElement('div');
    envoltorio.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible" role="alert">
            <div>${mensaje}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
    `;
    alerta.append(envoltorio);
}

/**
* Determina en qué elemento se realiza un evento
* @param elemento el elemento que contiene el objeto
* @param evento el evento realizado
* @param selector el selector seleccionado
* @param manejador el manejador del evento
*/
const on = (elemento, evento, selector, manejador) => {
    elemento.addEventListener(evento, e => { // Agregamos el método para escuchar el evento
        if(e.target.closest(selector)) { // Si el objetivo del manejador es el selector
            manejador(e); // Ejecutamos el método del manejador
        }
    })
}

/**
* Función para el botón Editar
*/
on(document, 'click', '.btn-editar', e =>{
    const cardFooter = e.target.parentNode; // Guardamos el elemento padre del botón
    id = cardFooter.querySelector('.id-articulo').value; // Guardamos el id del artículo
    articulo = articulos.find(item => item.id == id); // Buscamos el artículo con ese id
    // Asignamos los valores a los input del formulario
    inputCodigo.value = articulo.codigo;
    inputNombre.value = articulo.nombre;
    inputDescripcion.value = articulo.descripcion;
    inputPrecio.value = articulo.precio;

    frmImagen.src = `./imagenes/productos/${articulo.imagen}`;

    // Mostramos el formulario
    formularioModal.show();

    opcion = 'actualizar';
})

/**
* Función para el botón borrar
*/
on(document, 'click', '.btn-borrar', e => {
    const cardFooter = e.target.parentNode;
    id = cardFooter.querySelector('.id-articulo').value;

    articulo = articulos.find(item => item.id == id);

    let aceptar = confirm(`¿Realmente desea eliminar a ${articulo.nombre}?`);
    if(aceptar) {
        eliminarArticulo(id);
        insertarAlerta(`${articulo.nombre} eliminado!`, 'danger');
        mostrarArticulos();
    }
})