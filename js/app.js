//Variables

const carrito = document.querySelector('#carrito')
const cursos = document.querySelector('#lista-cursos')
const listacarrito = document.querySelector('#lista-carrito tbody')
const vaciarbtn = document.getElementById('vaciar-carrito')
//Listeners

cargareventos()

function cargareventos(){
    //Al presionar agregar a carrito
    cursos.addEventListener('click',comprarcurso)
    //Al eliminar curso del carrito
    carrito.addEventListener('click',eliminarcurso)
    //Al vaciar el carrito
    vaciarbtn.addEventListener('click',vaciarcarrito)
    //Al cargar la página
    document.addEventListener('DOMContentLoaded',leerls)
}
//Funciones
//Función que añade cursos al carrito
function comprarcurso(e){
    e.preventDefault()
    //Delegation al presionar agregar carrito
    if(e.target.classList.contains('agregar-carrito')){
        const curso = e.target.parentElement.parentElement
        //Tomar los datos del curso seleccionado
        leerdatoscurso(curso)
    }
}
//Leer los datos de un curso
function leerdatoscurso(curso){
    const precio = curso.dataset.precio
    const infocurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: parseFloat(precio),
        cantidad: 1,
        subtotal: parseFloat(precio),
        id: curso.querySelector('a').getAttribute('data-id')
    }
    
    agregarcarrito(infocurso)
}

//Agregar la información de un curso a un carrito (DOM)
function agregarcarrito(infocurso){
    const cursos = obtenercursosls()
    const exist = cursos.find((curso)=>curso.id === infocurso.id)

    if(exist){
        aumentarexistentels(cursos, exist.id)
        aumentarexistente(exist);
    }else{
        agregarcursosdom(infocurso);
        guardarcursols(infocurso)
    }
    carritonotificaciones()
    carritototal()
}

//Eliminar un curso del carrito (DOM)
function eliminarcurso(e){
    e.preventDefault()
    let curso, cursoid
    if(e.target.classList.contains('borrar-curso')){
        e.target.parentElement.parentElement.remove()
        curso = e.target.parentElement.parentElement
        cursoid = curso.querySelector('a').getAttribute('data-id')
    }
    eliminarcursols(cursoid)
    carritonotificaciones()
    carritototal()
}

//Eliminar todos los cursos del carrito (DOM)
function vaciarcarrito(e){
    e.preventDefault()
    //Forma lenta
    // listacarrito.innerHTML = ``
    //Forma rápida y recomendada
    while(listacarrito.firstChild) {
        listacarrito.removeChild(listacarrito.firstChild)
    }
    //Vaciar de local storage
    vaciarls()
    carritonotificaciones()
    carritototal()
    return false
}

//Almacenar carrito n local storage
function guardarcursols(infocurso){
    let cursos
    cursos = obtenercursosls()
    //Agregar curso al arreglo
    cursos.push(infocurso)
    //Sobreponer el array en local storage
    localStorage.setItem('cursos',JSON.stringify(cursos))
}

//Obtener cursos local storage
function obtenercursosls(){
    let cursosls
    if(localStorage.getItem('cursos') == null){
        cursosls = []
    }else{
        cursosls = JSON.parse(localStorage.getItem('cursos')) 
    }
    return cursosls
}

//Leer los cursos de local storage
function leerls(){
    let cursosls
    cursosls = obtenercursosls()
    cursosls.forEach(function(curso){
        //construir template
        agregarcursosdom(curso);
    })

    carritonotificaciones()

    carritototal()
}

//Eliinar el curso de local storage, con su id
function eliminarcursols(cursoid){
    let cursosls
    //Obtenemos los cursos en local storage
    cursosls = obtenercursosls()
    cursosls.forEach(function(curso, index){
        if(curso.id === cursoid){
            cursosls.splice(index, 1)
        }
    })
    localStorage.setItem('cursos',JSON.stringify(cursosls))
}

//Vciar el localstorage
function vaciarls(){
    localStorage.clear()
}

function agregarcursosdom(curso){
    const row = document.createElement('tr')
    row.setAttribute('data-id', curso.id)
    row.innerHTML = `
        <td>
        <img src="${curso.imagen}" width=100>
        </td>
        <td>${curso.titulo}</td>
        <td rel="cant" style="text-align: center">${curso.cantidad}</td>
        <td>S/ ${curso.precio}</td>
        <td rel="subtotal">S/ ${curso.subtotal}</td>
        <td>
            <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
        </td>
    `
    listacarrito.appendChild(row)
}

function aumentarexistente(curso){
    const td = listacarrito.querySelector(`tr[data-id="${curso.id}"]`)
    const cantidad = td.querySelector(`td[rel="cant"]`)
    const subtotal = td.querySelector(`td[rel="subtotal"]`)
    cantidad.innerText = curso.cantidad
    subtotal.innerText = "S/ "+curso.subtotal
}

function aumentarexistentels(cursos, cursoid){
    cursos.forEach(function(curso){
        if(curso.id === cursoid){
            curso.cantidad += 1
            curso.subtotal = curso.cantidad * curso.precio
        }
    })
    localStorage.setItem('cursos',JSON.stringify(cursos))
}

function carritonotificaciones(){
    const divnotificaciones = document.getElementById('carrito-notificaciones')
    const cursosls = obtenercursosls()
    divnotificaciones.children[0].innerText = cursosls.length
    if (cursosls.length !== 0){
        divnotificaciones.style.display = 'block'
    }else{
        divnotificaciones.style.display = 'none'
    }
}

function carritototal(){
    const divcarrito = document.getElementById('div-carrito')
    const cursosls = obtenercursosls()
    const total = cursosls.reduce((a, b) => a + (b.subtotal || 0), 0);
    if (cursosls.length !== 0){
        divcarrito.querySelector('#total-carrito').innerText = "$"+total
        divcarrito.style.display = 'block'
    }else{
        divcarrito.style.display = 'none'
    }
}