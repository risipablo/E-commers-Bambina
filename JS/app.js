class Datos {
    constructor() {
        this.productos = [];
    }

    agregarProductos(id, nombre, precio, categoria ,marca,edad, imagen,descripcion) {
        const producto = new Producto(id, nombre, precio, categoria, marca,edad, imagen,descripcion);
        this.productos.push(producto);
    }

    async traerRegistros() {
        const response = await fetch('../JS/productos.json');
        this.productos = await response.json();
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

    registrosPorEdad(edad) {
        return this.productos.filter((producto) => producto.edad == edad);
    }
}



class Producto {
    constructor(id, nombre, precio, categoria, marca, edad, imagen, descripcion ) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.marca = marca;
        this.edad = edad;
        this.imagen = imagen;
        this.descripcion = descripcion;
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
                <p class="descripcion"> ${producto.descripcion}</p>
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

        if (this.totalProductos > 0) {
            botonComprar.classList.remove("oculto"); 
        } else {
            botonComprar.classList.add("oculto")
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
const botonEdad = document.querySelectorAll (".btnEdad");
const check = document.querySelectorAll(".btnCategoria, .btnMarca, .btnEdad");
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


/* filtrado por edad */ 
botonEdad.forEach((boton) => {
    boton.addEventListener("click", (event) => {
        event.preventDefault();
        boton.classList.add("seleccionado");
        const edadSeleccionada = boton.innerText;
        const productosPorEdad = bd.registrosPorEdad(edadSeleccionada);
        cargarProductos(productosPorEdad);
    });
});



bd.traerRegistros().then((productos) => cargarProductos(productos));

function cargarProductos(productos) {
    (async () => {
        const productos = await bd.traerRegistros();
        cargarProductos(productos);
        })();
    divProductos.innerHTML = "";

    for (const producto of productos) {
        divProductos.innerHTML += `

            <div class="producto">
                <div class="imagen">
                    <img src="../Imagen/Alimentos/${producto.imagen}"/>
                    </div>
                <h3>${producto.nombre}</h3>
                <p class="descripcion"> ${producto.descripcion}</p>
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





