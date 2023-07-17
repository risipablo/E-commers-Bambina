class Datos {
    constructor() {
        this.productos = [];
        this.agregarProductos(1, 'Agility', 3500,"Perro","Agility","Agilityadulto.jpg");
        this.agregarProductos(2, 'Excellent', 5000, "Gato","Excellent","excegato.jpg");
        this.agregarProductos(3, 'Gati', 4000,"Gato","Gati","gati.jpg");
        this.agregarProductos(4, 'Agility Urinary', 5200, "Gato","Agility","agiliuri.jpg");
        this.agregarProductos(5, 'Biopet', 6300, "Perro","Biopet","asdadsa.jpg");
        this.agregarProductos(6, 'Royal Canin', 8500, "Perro","Royal Canin","royalm.jpg");
        this.agregarProductos(7, 'Sieger', 4500, "Perro","Sieger","Sieger.jpg");
        this.agregarProductos(8, 'Royal Canin ', 12500, "Gato","Royal Canin","urinary.jpg");
        this.agregarProductos(9, 'Old Prince ', 4500, "Perro","Old Prince","oldprnce.jpg");
        this.agregarProductos(10, 'Excellent ', 8200, "Perro","Excellent","miniexcell.jpg");
        this.agregarProductos(11, 'Balanced Adulto ', 4500, "Perro","Balanced","corderobalanced.jpg");
        this.agregarProductos(12, 'Optimun', 4500, "gato","Optimun","optimun.jpg");
    }

    agregarProductos(id, nombre, precio, categoria ,marca, imagen) {
        const producto = new Producto(id, nombre, precio, categoria, marca, imagen);
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

    registrosPorCategoria(categoria) {
        return this.productos.filter((producto) => producto.categoria == categoria);
    }

    registrosPorMarca(marca) {
        return this.productos.filter((producto) => producto.marca == marca);
    }
}

class Producto {
    constructor(id, nombre, precio, categoria, marca, imagen ) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.marca = marca;
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

    estaenelCarrito({ id }) {
        return this.carrito.find((producto) => producto.id === id);
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

    quitar(id) {
        const indice = this.carrito.findIndex((producto) => producto.id === id);
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
                    <img src="../Imagen/Alimentos/${producto.imagen}"/>
                </div>
                <h4 class="producto">${producto.nombre}</h4>
                <p class="precio"> Precio: $${producto.precio}</p>
                <p>Cantidad: ${producto.cantidad}</p>
                <a href="#" data-id="${producto.id}" class="btnQuitar"> Quitar </a>
            </div>
        `;

        this.total += producto.precio * producto.cantidad;
        this.totalProductos += producto.cantidad;
        }


        const botonesQuitar = document.querySelectorAll(".btnQuitar");
            for (const boton of botonesQuitar) {
                boton.onclick = (event) => {
                event.preventDefault();
                this.quitar(Number(boton.dataset.id));
                };
            }
            spanCantidadProductos.innerText = this.totalProductos;
            spanTotalCarrito.innerText = this.total;
    }
}


const bd = new Datos();

const divProductos = document.querySelector("#productos");
const divCarrito = document.querySelector("#carrito");
const spanCantidadProductos = document.querySelector("#cantidadProductos");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const inputBuscar = document.querySelector("#inputBuscar");
const botonCarrito = document.querySelector("section h3");
const botonComprar = document.querySelector("#botonComprar");
const botonesCategorias = document.querySelectorAll(".btnCategoria");
const botonMarca = document.querySelectorAll (".btnMarca");





/* Filtrado de productos */

botonesCategorias.forEach((boton) => {
    boton.addEventListener("click", (event) => {
        event.preventDefault();
        boton.classList.add("seleccionado");
        const productosPorCategoria = bd.registrosPorCategoria(boton.innerText);
        cargarProductos(productosPorCategoria);
    })
});

/* filtrado por marca */ 

botonMarca.forEach((boton) => {
    boton.addEventListener("click", (event) => {
        event.preventDefault();
        boton.classList.add("seleccionado");
        const marcaSeleccionada = boton.innerText;
        const productosPorMarca = bd.registrosPorMarca(marcaSeleccionada);
        cargarProductos(productosPorMarca);
    });
});




cargarProductos(bd.traerRegistros());

function cargarProductos(productos) {
    divProductos.innerHTML = "";

    for (const producto of productos) {
        divProductos.innerHTML += `
            <div class="producto">
                <div class="imagen">
                    <img src="../Imagen/Alimentos/${producto.imagen}"/>
                    </div>
                <h3>${producto.nombre}</h3>
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
            carrito.agregar(producto);
        });
        }

}
    botonComprar.addEventListener("click", (event) => {
        event.preventDefault();
        Swal.fire({
        title: "¡Su compra ha sido realizada!",
        text: "Estamos preparando tu pedido",
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




const carrito = new Carrito();