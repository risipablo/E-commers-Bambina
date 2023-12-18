

let iniciarBtn = document.getElementById ("iniciar");
let crearBtn = document.getElementById ("crear");
let nombre = document.getElementById ("nombre");
let titulo= document.getElementById ("titulo");

iniciarBtn.onclick = function () {
  
  nombre.style.maxHeight = "65px";
  titulo.innerHTML = "Crear Usuario";

  iniciarBtn.classList.add("disable");
  iniciarBtn.classList.remove("disable");
}


crearBtn.onclick = function () {
  nombre.style.maxHeight = "0";
  nombre.style.display = "flex";
  titulo.innerHTML = "Iniciar Sesion";

  crearBtn.classList.remove("disable");
  crearBtn.classList.add("disable");
}



