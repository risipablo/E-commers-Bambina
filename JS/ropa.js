class Datos2 {
    constructor() {
        this.productos = [];
        this.agregarProductos(15, 'Polares', 3500,['S', 'M', 'L', 'XL','XLL' ],"polares.jpg","Polar");
        this.agregarProductos(16, 'Harry Potter', 5000,['S', 'M', 'L', 'XL','XLL' ],"potter.jpg","Buzo");
        this.agregarProductos(17, 'Rebel', 4000,['S', 'M', 'L', 'XL','XLL' ],"rebel.jpg","Buzo");
        this.agregarProductos(18, 'Panda', 5200,['S', 'M', 'L', 'XL','XLL' ],"panda,jpg.jpg","Buzo");
        this.agregarProductos(19, 'Bug Bunny', 3500,['S', 'M', 'L', 'XL'],"bugsroj.jpg","Buzo");
        this.agregarProductos(20, 'Piloto de lluvia', 5700,['S', 'M', 'L', 'XL'],"pilotolluvia.jpg","Piloto");
        this.agregarProductos(21, 'Polar Soft', 4200,['S', 'M', 'L'],"soft.jpg","Polar");
        this.agregarProductos(22, 'Buzo Captaine', 5800,['S', 'M', 'L', 'XL','XLL' ],"captaine.jpg","Buzo");
    }

    agregarProductos(id, nombre, precio, talle, imagen,categoria) {
        const producto = new Producto(id, nombre, precio,talle, imagen,categoria);
        this.productos.push(producto);
    }

    traerRegistros() {
        return this.productos;
    }
    
    registroPorId(id) {
        return this.productos.find((producto) => producto.id === id);
    }

    registrosPorNombre(palabra) {
        return this.productos.filter((producto) => producto.nombre.toLowerCase().includes(palabra));
    }

    registroPortalle(talle) {
        return this.productos.find((producto) => producto.talle === talle);
    }

    registrosPorCategoria(categoria) {
        return this.productos.filter((producto) => producto.categoria == categoria);
    }

}

class Producto {
    constructor(id, nombre, precio, talle, imagen, categoria ) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.talle = talle;
        this.imagen = imagen;
        this.categoria = categoria;
    }
}


class Carrito {
    constructor() {
        const carritoStorage = JSON.parse(localStorage.getItem("carrito"));

        this.carrito = carritoStorage || [];
        this.total = 0;
        this.totalProductos = 0;
        this.listar();
    }

    estaenelCarrito({ id, talle }) {
        return this.carrito.find((producto) => producto.id === id && producto.talle === talle);
    }

    agregar(producto) {
        const productoenCarrito = this.estaenelCarrito(producto);
        if (productoenCarrito) {
            productoenCarrito.cantidad++;
        } else {
            this.carrito.push({ ...producto, cantidad: 1 });
        }
        localStorage.setItem("carrito", JSON.stringify(this.carrito));

        this.listar();

        Toastify({
            text: `${producto.nombre} fue agregado`,
            position: "center",
            className: "info",
            gravity: "top",
            style: {
            background: "linear-gradient(to right, violet, red)",
            },
        }).showToast();
    }

    quitar({id, talle}) {
        const indice = this.carrito.findIndex((producto) => producto.id === id && producto.talle === talle);
        if (this.carrito[indice].cantidad > 1) {
            this.carrito[indice].cantidad--;
        } else {
            this.carrito.splice(indice, 1);
        }
        localStorage.setItem("carrito", JSON.stringify(this.carrito));

        this.listar();

    }

    vaciar() {
        this.carrito = [];
        localStorage.removeItem("carrito");
        this.listar();
    }


    listar (){

        this.total = 0;
        this.totalProductos = 0;
        divCarrito.innerHTML = "";
        contenedorCarrito.innerHTML = "";

        for (const producto of this.carrito) {
            contenedorCarrito.innerHTML += `
            <div class="productoCarrito">
                <div class="imagen">
                    <img src="../Imagen/Ropa/${producto.imagen}"/>
                </div>
                <h4 class="producto">${producto.nombre}</h4>
                <div class="talles">${producto.talle}</div>
                <p class="precio"> Precio: $${producto.precio}</p>
                <div class="items">
                <p class="cantidad">Cantidad: ${producto.cantidad}</p>
                <a href="#" data-id="${producto.id}" class="btnQuitar"><i class="fa-solid fa-trash-can">  </i>  </a>
                </div>
            </div>
        `;

        this.total += producto.precio * producto.cantidad;
        this.totalProductos += producto.cantidad;

            const botonesQuitar = document.querySelectorAll(".btnQuitar");
            for (const boton of botonesQuitar) {
                boton.onclick = (event) => {
                    event.preventDefault();
                    this.quitar(producto); 
                };
            }
        }
            spanCantidadProductos.innerText = this.totalProductos;
            spanTotalCarrito.innerText = this.total;
    }
}


const bd = new Datos2();

const divRopa = document.querySelector("#ropa");
const divCarrito = document.querySelector("#carrito");
const spanCantidadProductos = document.querySelector("#cantidadProductos");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const inputBuscar = document.querySelector("#inputBuscar");
const botonCarrito = document.querySelector("section h3");
const botonComprar = document.querySelector("#botonComprar");
const botonesCategorias = document.querySelectorAll(".btnCategoria");
const botonTalle = document.querySelectorAll(".btntalle");
const closebtn = document.querySelector (".close");
const botonTodos = document.querySelector("#Todos");



/* Filtro para orden de precios */

document.getElementById("orden").addEventListener("click", () => {
    document.querySelector(".orden ").classList.toggle("active");
});
document.getElementById("ordenarMayor").addEventListener("click", () => {
    const productosOrdenados = bd.traerRegistros().slice().sort((a, b) => b.precio - a.precio);
    cargarProductos(productosOrdenados);
});
document.getElementById("ordenarMenor").addEventListener("click", () => {
    const productosOrdenados = bd.traerRegistros().slice().sort((a, b) => a.precio - b.precio);
    cargarProductos(productosOrdenados);
});


/* FIltro boton*/ 
const abrir = document.querySelector('.filtro');
const cerrar = document.querySelector('.cerrar');
const contenido = document.querySelector('.contenido');

abrir.addEventListener('click', function () {
    contenido.classList.add('show'); 
});

cerrar.addEventListener("click", () => {
    contenido.classList.remove('show');
});




/* Mostrar todos los productos */

    botonTodos.addEventListener("click", (event) => {
    event.preventDefault();
    quitarClase();
    botonTodos.classList.add("seleccionado");

    cargarProductos(bd.productos);
    });

    function quitarClase() {
        const botonSeleccionado = document.querySelector(".seleccionado");
        if (botonSeleccionado) {
        botonSeleccionado.classList.remove("seleccionado");
        }
    }


/* Filtrado de productos */
botonesCategorias.forEach((boton) => {
    boton.addEventListener("click", (event) => {
        event.preventDefault();
        boton.classList.add("seleccionado");
        const productosPorCategoria = bd.registrosPorCategoria(boton.innerText);
        cargarProductos(productosPorCategoria);
    })
});




botonTalle.forEach((botonTalleElement) => {
    botonTalleElement.addEventListener("click", (event) => {
        event.preventDefault();
        botonTalleElement.classList.add("seleccionado");
        const talleSeleccionado = botonTalleElement.innerText;
        const productosPorTalle = bd.registroPortalle(talleSeleccionado);
        cargarProductos(productosPorTalle);
    });
}); 






cargarProductos(bd.traerRegistros());

function cargarProductos(productos) {
    divRopa.innerHTML = "";

    for (const producto of productos) {
        let tallesHTML ="";
        for (const talle of producto.talle) {
            tallesHTML += `<input class ="input-talles" type = "checkbox" name = "producto${producto.id}" value ="${talle}" > ${talle} </input>`;
        }
        divRopa.innerHTML += `
            <div class="ropas">
                <div class="imagen">
                    <img src="../Imagen/Ropa/${producto.imagen}"/>
                    </div>
                <h3>${producto.nombre}</h3>
                <div id="${producto.id}" class="talles">${tallesHTML}</div>
                <p class="precio">$${producto.precio}</p>
                <a href="#" class="btnAgregar" data-id="${producto.id}"> Agregar </a>
            </div>
        `;
    }

        const botonesAgregar = document.querySelectorAll(".btnAgregar");
        for (const boton of botonesAgregar) {
        boton.addEventListener("click", (event) => {
            event.preventDefault();
            const id = Number(boton.dataset.id);
            const producto = bd.registroPorId(id);
            const talleEl = document.getElementById (id);
            
            carrito.agregar({
                ...producto, 
                talle: talleEl.getAttribute ("value")
            });
        });
    }
}

    const botonesTalle = document.querySelectorAll (".input-talles");
    for (const boton of botonesTalle) {
        boton.addEventListener ("click", (event) => {
            const value = boton.value;
            event.target.parentNode.setAttribute("value", value);
        })
    }


    botonComprar.addEventListener("click", (event) => {
        event.preventDefault();
        Swal.fire({
        title: "¡Su compra ha sido realizada!",
        text: "Gracias por comprar con nosotros",
        icon: "success",
        confirmButtonText: "Aceptar",
        });
    
        carrito.vaciar();
    
        document.querySelector("section").classList.add("ocultar");
    });


inputBuscar.addEventListener("keyup", (event) => {
    event.preventDefault();
    const palabra = inputBuscar.value;
    const productos = bd.registrosPorNombre(palabra.toLowerCase());
    cargarProductos(productos);
});

botonCarrito.addEventListener("click", (event) => {
    document.querySelector("section").classList.toggle("ocultar");
});

closebtn.addEventListener("click" , (event) => {
    document.querySelector("section").classList.toggle ("ocultar");
});

const carrito = new Carrito();




