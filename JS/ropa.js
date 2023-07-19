class Datos2 {
    constructor() {
        this.productos = [];
        this.agregarProductos(1, 'Polares', 3500,['S', 'M', 'L', 'XL','XLL' ],"polares.jpg");
        this.agregarProductos(2, 'Harry Potter', 5000,['S', 'M', 'L', 'XL','XLL' ],"potter.jpg");
        this.agregarProductos(3, 'Rebel', 4000,['S', 'M', 'L', 'XL','XLL' ],"rebel.jpg");
        this.agregarProductos(4, 'Panda', 5200,['S', 'M', 'L', 'XL','XLL' ],"panda,jpg.jpg");
    }

    agregarProductos(id, nombre, precio, talle, imagen) {
        const producto = new Producto(id, nombre, precio,talle, imagen);
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


}

class Producto {
    constructor(id, nombre, precio, talle, imagen ) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.talle = talle;
        this.imagen = imagen;
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

        for (const producto of this.carrito) {
            divCarrito.innerHTML += `
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
        }


        const botonesQuitar = document.querySelectorAll(".btnQuitar");
            for (const boton of botonesQuitar) {
                boton.onclick = (event) => {
                    event.preventDefault();
                    this.quitar(producto); 
                };
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
const closebtn = document.querySelector (".close");




/* Filtrado de productos */

botonesCategorias.forEach((boton) => {
    boton.addEventListener("click", (event) => {
        event.preventDefault();
        boton.classList.add("seleccionado");
        const productosPorCategoria = bd.registrosPorCategoria(boton.innerText);
        cargarProductos(productosPorCategoria);
    })
});




cargarProductos(bd.traerRegistros());

function cargarProductos(productos) {
    divRopa.innerHTML = "";

    for (const producto of productos) {
        let tallesHTML ="";
        for (const talle of producto.talle) {
            tallesHTML += `<span class ="talles" type = "radio" name = "producto${producto.id}" value ="${talle}" > ${talle}</span>`;
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

    const botonesTalle = document.querySelectorAll (".talles");
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




