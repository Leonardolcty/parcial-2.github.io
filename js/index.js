
let productos = [];
let carrito = [];


// 
fetch("./productos.json")
.then(response => response.json())
.then(data => {
    productos = data.map(p => new Producto(p.id, p.nombre, p.precio, p.url_portada, p.descripcion, p.categoria));
    Producto.mostrarProductos(productos);
    cargarCategorias(); // Para filtro
})

class Producto {
    constructor(id, nombre, precio, url_portada, descripcion, categoria){
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.url_portada = url_portada;
        this.descripcion = descripcion;
        this.categoria = categoria;
    }

    static mostrarProductos(productos) {
        const contenedor = document.querySelector("#productos");
        contenedor.innerHTML = ""; // Limpia el contenedor

        productos.forEach(producto => {
            const productosDiv = document.createElement("div");
            productosDiv.setAttribute("class", "productos");

            const img = document.createElement("img");
            img.setAttribute("class", "card-img-top");
            img.setAttribute("alt", `Producto: ${producto.descripcion}`);
            img.setAttribute("src", producto.url_portada);

            const titulo = document.createElement("h2");
            titulo.innerText = producto.nombre;

            const descripcion = document.createElement("p");
            descripcion.innerText = producto.descripcion;

            const precio = document.createElement("p");
            precio.setAttribute("class", "precio");
            precio.innerText = `$ ${producto.precio}`;

            const cuotas = document.createElement("p");
            cuotas.innerText = "6 cuotas sin interés";

            const metodos = document.createElement("p");
            metodos.setAttribute("class", "metodos");
            metodos.innerText = "Métodos de pago";

            const button = document.createElement("div");
            button.setAttribute("class", "button");

            const buttonA = document.createElement("a");
            buttonA.setAttribute("class", "button-a");
            buttonA.setAttribute("href", "#");
            buttonA.innerText = "Comprar";

            const buttonB = document.createElement("a");
            buttonB.setAttribute("class", "button-b");
            buttonB.setAttribute("href", "#");
            buttonB.innerText = "Añadir al carro";

            buttonB.addEventListener("click", (e) => {
                e.preventDefault();
                agregarAlCarrito(producto.id);
            });

            button.append(buttonA, buttonB);
            productosDiv.append(img, titulo, descripcion, precio, cuotas, metodos, button);

            contenedor.append(productosDiv);
        });
    }
}

// Guardar carrito cada vez que se actualiza
function actualizarCarrito() {
    const total = carrito.reduce((t, p) => t + p.precio, 0);
    document.querySelector("#carrito-cantidad-icono").textContent = carrito.length;
    document.querySelector("#carrito-total-modal").textContent = `Precio Total : $ ${total}`;
    guardarCarritoEnLocalStorage();
    actualizarCantidadIcono();
    actualizarModalCarrito();
}



function agregarAlCarrito(id) {
    //Agregamos productos al carrito
    const producto = productos.find(producto => producto.id === id);

    if(producto){
        carrito.push(producto);
        actualizarCarrito();
}
}


function cargarCategorias() {
    // Creamos un array que contenga todas las categorias
    const categorias = ["Todos"].concat([...new Set(productos.map(p => p.categoria))]);
    const select = document.querySelector("#filtro");
    //Pasamos por los elementos que el array tenga y por cada elemento se crea un "option".
    categorias.forEach(categoria => {
        const option = document.createElement("option");
        option.setAttribute("id","filtro")
        option.value = categoria;
        option.innerText = categoria;
        select.append(option);
    });

    select.addEventListener("change", (e) => {
        const categoriaSeleccionada = e.target.value;
        // Si la opcion es "Todos" muestra los productos que ya estan, sino hace un filtro por la categoria(option) selecionada.
        const filtrados = categoriaSeleccionada === "Todos" ? productos : productos.filter(p => p.categoria === categoriaSeleccionada);
        Producto.mostrarProductos(filtrados);
    });
}

document.addEventListener("DOMContentLoaded", () => {

    
    
    
    // Ordenar por mayor o menor
    const selectOrden = document.querySelector("#orden-precio");

    selectOrden.addEventListener("change", (e) => {
        let productosOrdenados = [...productos];
        if (e.target.value === "menor") {
            productosOrdenados.sort((a, b) => a.precio - b.precio);
        } else if (e.target.value === "mayor") {
            productosOrdenados.sort((a, b) => b.precio - a.precio);
        }
        Producto.mostrarProductos(productosOrdenados);
    });

    // Notificaciones
    // Notification 1 (Procesador en oferta)
    setTimeout(() => {
    document.getElementById("oferta").style.display = "block";
    document.getElementById("cerrar-oferta").addEventListener("click", () => {
        document.getElementById("oferta").style.display = "none";
    });
    }, 3000);   

    // Notification 2 (Auriculares en oferta)
    document.querySelector("#filtro").addEventListener("click", () =>{
    setTimeout(() => {
    document.getElementById("oferta-dos").style.display = "block";
    document.getElementById("cerrar-oferta-dos").addEventListener("click", () => {
        document.getElementById("oferta-dos").style.display = "none";
    });
    }, 2000);   
    })

    // Crea button carrito
    const iconoCarrito = document.createElement("button");
    iconoCarrito.setAttribute("type","button");
    iconoCarrito.setAttribute("class","btn btn-primary");

    // Crea Modal (Sacada de Bootstrap 5)
    const modalFade = document.createElement("div");
    modalFade.setAttribute("class","modal fade");

    const dialog = document.createElement("div");
    dialog.setAttribute("class","modal-dialog");

    const content = document.createElement("div");
    content.setAttribute("class","modal-content");

    const header = document.createElement("div");
    header.setAttribute("class","modal-header");

    const title = document.createElement("h1");
    title.setAttribute("class","modal-title fs-5");
    title.innerText= "Carrito";

    const total = document.createElement("p");
    total.setAttribute("id","carrito-total-modal");
    total.setAttribute("class","text-center pt-3 fw-bold");


    // Button X
    const close = document.createElement("button");
    close.setAttribute("type","button");
    close.setAttribute("class","btn-close");
    close.addEventListener("click", () => {
        
        const modal = document.querySelector(".modal");
        modal.classList.remove("show"); 
        modal.setAttribute("style", "display: none;");

        document.querySelector(".modal-backdrop").remove();

    });

    // Button Vaciar el array carrito
    const vaciar = document.createElement("button");
    vaciar.setAttribute("type","button");
    vaciar.setAttribute("class","btn btn-secondary");
    vaciar.innerText = "Vaciar Carrito";
    vaciar.addEventListener("click", () => {
        carrito = [];
        actualizarCarrito();

    });

    const body = document.createElement("div");
    body.setAttribute("class","modal-body");

    const listaCarrito = document.createElement("div");
    listaCarrito.setAttribute("id", "carrito-lista");
    
    const text = document.createElement("p");
    text.innerText = "Ejemplo de modal de Boostrap";

    const footer = document.createElement("div");
    footer.setAttribute("class","modal-footer");

    //Button Cerrar la modal
    const btn = document.createElement("button");
    btn.setAttribute("type","button");
    btn.setAttribute("class","btn btn-secondary");
    btn.innerText = "Close";
    btn.addEventListener("click", () => {
        
        const modal = document.querySelector(".modal");
        modal.classList.remove("show"); 
        modal.setAttribute("style", "display: none;");

        document.querySelector(".modal-backdrop").remove();

    });

    footer.append(vaciar, btn);
    body.append(listaCarrito);
    header.append(title, close);
    content.append(header, total, body, footer);
    dialog.append(content);
    modalFade.append(dialog);

    document.querySelector("body").prepend(modalFade);

    //Abre la modal
    document.querySelector("#open").addEventListener("click", () => {

        const modal = document.querySelector(".modal");
        modal.classList.add("show"); 
        modal.setAttribute("style", "display: block;");

        const backdrop = document.createElement("div")
        backdrop.setAttribute("class","modal-backdrop fade show");
        document.querySelector("body").append(backdrop);


    })

    function actualizarCantidadIcono() {
        document.getElementById("carrito-cantidad-icono").textContent = carrito.length;
    }

    actualizarCarrito = function () {
        const total = carrito.reduce((t, p) => t + p.precio, 0);
        document.querySelector("#carrito-cantidad-icono").textContent =  carrito.length;
        document.querySelector("#carrito-total-modal").textContent = `Precio Total : $ ${total}`; 
        actualizarCantidadIcono();
        actualizarModalCarrito();
    };
    

    actualizarModalCarrito = function () {
        const lista = body.querySelector("#carrito-lista");
        lista.innerHTML = "";
        // Si no hay nada en el array Carrito, dentro del modal se mostrá "El carrito esta vacio."
        if (!carrito.length) {
            const vacio  = document.createElement("p")
            vacio.innerText = "El carrito esta vacio.";
            lista.append(vacio)
        } else {
            // Si hay algo creamos un array nuevo donde iran los productos de carrito
            const productosUnicos = [];
            carrito.forEach((p) => {
                // Si el producto selecionado no esta se le pushea al array, si esta, no se le agrega al array
            if (!productosUnicos.some(prod => prod.id === p.id)) {
                productosUnicos.push(p);
            }

            });

            //Tabla del los productos agregados al carrito (Se me hizo mas ordenado mostrarlo como una tabla)

            const tabla = document.createElement("table");
            tabla.className = "table";
            const thead = document.createElement("thead");
            const trPrincipal = document.createElement("tr");
            //Nombres de los titulos
            const thNombre = document.createElement("th");
            thNombre.setAttribute("class","th-color");
            thNombre.innerHTML = "Productos";
            const thCategoria = document.createElement("th");
            thCategoria.innerHTML = "Categoria";
            const thPrecio = document.createElement("th");
            thPrecio.innerHTML = "Precio";
            const thCantidad = document.createElement("th");
            thCantidad.innerHTML = "Cantidad";

            trPrincipal.append(thNombre, thCategoria, thPrecio, thCantidad);
            thead.append(trPrincipal);
            tabla.append(thead);

            const tbody = document.createElement("tbody");

            // Se Harán listas por cada elemento agrado anteriormente a ProductosUnicos 
            productosUnicos.forEach((p) => {
                //Cantidad de productos iguales agregados (Los indetificamos por su id, si tienen el mismo id se aumenta en uno)
            const cantidad = carrito.filter(prod => prod.id === p.id).length;
            const tr = document.createElement("tr");

            const tdNombre = document.createElement("td");
            tdNombre.innerText = p.nombre;
            tr.append(tdNombre);

            const tdCategoria = document.createElement("td");
            tdCategoria.innerText = p.categoria;
            tr.append(tdCategoria);

            //Multiplicamos el precio por la cantidad
            const tdPrecio = document.createElement("td");
            tdPrecio.innerText = `$${p.precio * cantidad}`;
            tr.append(tdPrecio);

            const tdCantidad = document.createElement("td");
            tdCantidad.setAttribute("class","cantidad")
            const divContador = document.createElement("div");
            divContador.setAttribute("class", "input-group");


            const inputCantidad = document.createElement("input");
            inputCantidad.setAttribute("type", "number");
            inputCantidad.setAttribute("name", "Cantidad");
            inputCantidad.setAttribute("class", "form-control text-center p-0");
            inputCantidad.setAttribute("readonly", true);
            inputCantidad.value = cantidad;
            
            const btnMenos = document.createElement("button");
            btnMenos.className = "btn btn-outline-secondary btn-sm";
            btnMenos.innerText = "-";

            const btnBorrar = document.createElement("button");
            btnBorrar.setAttribute("class","btn btn-danger");
            btnBorrar.innerText ="x";
            btnBorrar.addEventListener("click", () => {
                    carrito = carrito.filter(prod => prod.id !== p.id);
                    actualizarCarrito();
            });

            btnMenos.addEventListener("click", () => {
                //Solo se borra la cantidad si es mayor a 1
                if (inputCantidad.value > 1) {
                    //Splice elemina un elemento de un array por la condicion que le pongas
                    //En este caso buscamos por index y el index selecionado se elemina
                    carrito.splice(carrito.findIndex(prod => prod.id === p.id), 1);
                    actualizarCarrito();
                //Si es menor a 1 se borra
                } else {
                    carrito = carrito.filter(prod => prod.id !== p.id);
                    actualizarCarrito();
                }
            });

            const btnSumar = document.createElement("button");
            btnSumar.innerText = "+";
            btnSumar.className = "btn btn-outline-secondary btn-sm";
            btnSumar.addEventListener("click", () => {
                carrito.push(p);
                actualizarCarrito();
            });

            divContador.append(btnMenos, inputCantidad, btnSumar, btnBorrar);
            tdCantidad.appendChild(divContador);
            tr.appendChild(tdCantidad);

            tbody.appendChild(tr);
            });

            tabla.appendChild(tbody);
            lista.appendChild(tabla);
        }
        actualizarCantidadIcono();
    };
});