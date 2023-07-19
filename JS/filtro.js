const abrir = document.querySelector('.despliegue');
const cerrar = document.querySelector('.cerrar');
const contenido = document.querySelector('.contenido');

abrir.addEventListener('click', function () {
    contenido.classList.add('show'); 
});

cerrar.addEventListener("click", () => {
    contenido.classList.remove('show');
});