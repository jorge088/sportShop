let products = []; //productos leidos desde el json
let cart = [];  //productos cargados en el carrito

const nav__menu = document.querySelector('.navBar__menu');
const btn__nav = document.querySelector('.btn__nav');

const navLogo = document.querySelector('.navBar__logo');

const btnNavProductos = document.querySelector('#btnNavProductos');
const btnNavSeleccionArgentina = document.querySelector('#btnNavSeleccionArgentina');
const btnNavLigaProfesional = document.querySelector('#btnNavLigaProfesional');
const btnNavPrimeraNacional = document.querySelector('#btnNavPrimeraNacional');
const btnNavTodosProductos = document.querySelector('#btnNavTodosProductos');

const searchForm = document.querySelector('#searchForm');
const searchInput = document.querySelector('#searchInput');
searchInput.value = '';
const productNotFoundedAlert = document.querySelector('#productNotFoundedAlert');

const mainInformation = document.querySelector('#mainInformation');

const productsInformationTitle = document.querySelector('.productsInformation__title');
const productsInformationResults = document.querySelector('.productsInformation__results');

const productsInformation = document.querySelector('#productsInformation');
const productsContainer = document.querySelector('.productsContainer'); //contenedor de productos 
const templateContainerProducts = document.getElementById("template-containerProducts").content; //template para cargar los items en contenedor
const fragmentProduct = document.createDocumentFragment();//fragmento para guardar cada item y luego insertarlo en el contenedor

const cartView = document.querySelector('.cart');
const cartList = document.getElementById('cart__items'); //contenedor de productos en el carrito
const templateCartProducts = document.getElementById("template-CartProducts").content; //template para cargar los items en el carrito
const fragmentCart = document.createDocumentFragment();//fragmento para guardar cada item y luego insertarlo en el carrito
const cartResumeTotal = document.querySelector('.cart__sideContainer__resume__total');
const btnFinishBuy = document.querySelector('.cart__sideContainer__resume__btnFinishBuy');
const productAddToast = document.querySelector('.productAddToast');
const cartProductsCounter = document.querySelector('.navBar__menu__btnCartMenu-counter');
const cartProductsCounterResponsive = document.querySelector('.navBar__btnCartResponsive-counter');


const btnFooterLigaProfesional = document.querySelector('#btnFooterLigaProfesional');
const btnFooterPrimeraNacional = document.querySelector('#btnFooterPrimeraNacional');
const btnFooterTodosProductos = document.querySelector('#btnFooterTodosProductos');
const btnFooterSeleccionArgentina = document.querySelector('#btnFooterSeleccionArgentina');




document.addEventListener('DOMContentLoaded', () => { //Despues de cargarse el DOM
        fetchData();
        checkCartLocalStorage();
        addEventShowCart();
});

//-----Carrito en localstorage
const checkCartLocalStorage = () => {
        const cartStorage = localStorage.getItem('cart');
        if (cartStorage) {
                cart = JSON.parse(cartStorage);
                updateCartProductView()
                let units = arrayLength(cart);
                cartProductsCounter.textContent = units;
                cartProductsCounterResponsive.textContent = units;
        }
};

//-----Leer datos de archivo JSON
const fetchData = async () => {
        try {
                const res = await fetch(`./assets/products.json`);
                const data = await res.json();
                products = data; //almaceno los datos del archivo en un array
                loadRandomProductsToContainer(products);
        } catch (error) {
                console.log(error)
        }
}


//-----Cargar contenedor de productos 
const loadRandomProductsToContainer = (data) => {
        let randomProducts = [];
        let randomNumbers = [];
        let i = 0;
        while (i < 12) {
                num = Math.floor(Math.random() * data.length);//numero random entre 0 y el tamaño del array 
                if (!randomNumbers.includes(num)) {
                        randomNumbers.push(num);
                        i++;
                        continue;
                }
        }
        randomNumbers.forEach(id => {
                randomProducts.push(data[id]);
        });
        loadContainerProducts(randomProducts);
}

const loadContainerProducts = (data) => {
        productsContainer.innerHTML = '';
        data.forEach(product => {
                templateContainerProducts.querySelectorAll('img')[0].setAttribute('src', `./assets/images/${product.imgFrontUrl}`);
                templateContainerProducts.querySelectorAll('img')[0].setAttribute('alt', `${product.name}`);
                templateContainerProducts.querySelectorAll('img')[1].setAttribute('src', `./assets/images/${product.imgBackUrl}`);
                templateContainerProducts.querySelectorAll('img')[1].setAttribute('alt', `${product.name}`);
                templateContainerProducts.querySelector('h3').textContent = `${product.name} ${product.year}`;
                templateContainerProducts.querySelector('p').textContent = `$${product.price}`;
                templateContainerProducts.querySelector('.productsContainer__item__button').dataset.id = product.id; //guardo en el button el id de ese producto

                const clone = templateContainerProducts.cloneNode(true);
                fragmentProduct.appendChild(clone);
        });
        productsContainer.appendChild(fragmentProduct);
}


//-----Eventos en btn Sumar al carrito-->
productsContainer.addEventListener("click", (e) => {
        addCart(e);
});

const addCart = e => {
        if (e.target.classList.contains('fa-cart-plus')) { //click en el icono
                setCart(e.target.parentElement.parentElement);
        } else {
                if (e.target.classList.contains('productsContainer__item__button')) { //click en el boton
                        setCart(e.target.parentElement);
                }
        }
        e.stopPropagation();
}

//Crea un objeto con los datos y lo agrega al array cart
const setCart = (object) => {
        const product = {
                id: object.querySelector('button').dataset.id,
                name: object.querySelector('h3').textContent,
                price: object.querySelector('p').textContent,
                img: object.querySelector('img').getAttribute('src'),
                units: 1
        }
        if (cart[product.id]) { //producto cargado, le aumento una unidad
                product.units = cart[product.id].units + 1;
        }
        cart[product.id] = { ...product }
        localStorage.setItem('cart', JSON.stringify(cart)); //actualiza localstorage
        updateCartProductView();
        cartProductsCounter.textContent = arrayLength(cart);
        cartProductsCounterResponsive.textContent = arrayLength(cart);
        if (!productAddToast.classList.contains('show')) {
                productAddToast.classList.toggle('show');
                setTimeout(() => {
                        productAddToast.classList.toggle('show');
                }, 1500)
        }



}


//----Actualiza la vista de productos en el carrito
function updateCartProductView() {
        let totalPrice = 0;
        cartList.innerHTML = '';
        cart.forEach(product => {
                if (product) {//si no es null
                        templateCartProducts.querySelector(".cart__sideContainer__items__item__main__name").textContent = product.name;
                        templateCartProducts.querySelector("img").setAttribute("src", `${product.img}`);
                        templateCartProducts.querySelector(".cart__sideContainer__items__item__description__units__number").textContent = product.units;
                        templateCartProducts.querySelector(".cart__sideContainer__items__item__description__price").textContent = `$${Number(product.price.slice(1)) * product.units}`;
                        templateCartProducts.querySelector(".cart__sideContainer__items__item__main__btnDelete").dataset.id = product.id;
                        templateCartProducts.querySelector(".cart__sideContainer__items__item__description__units__btn__add").dataset.id = product.id;
                        templateCartProducts.querySelector(".cart__sideContainer__items__item__description__units__btn__rest").dataset.id = product.id;

                        totalPrice += Number(product.price.slice(1)) * product.units; //quita el $ de product.price y lo transforma a number
                        const clone = templateCartProducts.cloneNode(true);
                        fragmentCart.appendChild(clone);
                }
        });
        cartList.appendChild(fragmentCart);
        if(totalPrice==0){
                cartResumeTotal.textContent = 'Carrito vacio';
        }else {
                if(!btnFinishBuy.classList.contains('show'))
                        btnFinishBuy.classList.toggle('show');
                cartResumeTotal.textContent = `Total a pagar: $${totalPrice}`;
        }
        if(arrayLength(cart)==0){
                if(btnFinishBuy.classList.contains('show'))
                        btnFinishBuy.classList.toggle('show');
        }
        
}

//-----Modificar productos en carrito
cartList.addEventListener('click', (e) => {
        cartProductsModify(e);
});

const cartProductsModify = (e) => {
        //Aumentar unidades
        if (e.target.classList.contains('fa-plus')) { //click en icono
                plusProductCart(e.target.parentElement.dataset.id);
        } else {
                if (e.target.classList.contains('cart__sideContainer__items__item__description__units__btn__add')) { //click en boton
                        plusProductCart(e.target.dataset.id);
                }
        }

        //Disminuir unidades
        if (e.target.classList.contains('fa-minus')) { //click en icono
                minusProductCart(e.target.parentElement.dataset.id);
        } else {
                if (e.target.classList.contains('cart__sideContainer__items__item__description__units__btn__rest')) {//click en boton
                        minusProductCart(e.target.dataset.id);
                }
        }

        //Eliminar producto 
        if (e.target.classList.contains('fa-trash')) {//click en icono
                deleteProductCart(e.target.parentElement.dataset.id);
        } else {
                if (e.target.classList.contains('cart__sideContainer__items__item__main__btnDelete')) {//click en boton
                        deleteProductCart(e.target.dataset.id);
                }
        }
        cartProductsCounter.textContent = arrayLength(cart);
        cartProductsCounterResponsive.textContent = arrayLength(cart);
        e.stopPropagation();
};

const plusProductCart = (id) => {
        const product = cart[id];
        product.units++;
        cart[id] = { ...product };
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartProductView();
};

const minusProductCart = (id) => {
        const product = cart[id];
        product.units--;
        if (product.units === 0) {
                delete cart[id];
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartProductView();
};

const deleteProductCart = (id) => {
        delete cart[id];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartProductView();
}

//-----Buscar producto
searchInput.addEventListener('keyup', (e) => {
        

        if (searchInput.value == 0) {
                if (productNotFoundedAlert.classList.contains('show'))//si el input está vacio, quita el cartel no encontrado
                        productNotFoundedAlert.classList.toggle('show');
                productsContainer.innerHTML = '';
                productsInformationTitle.textContent=`Descubrí nuestros productos`;
                productsInformationResults.textContent=``;
                        loadRandomProductsToContainer(products);
                        e.preventDefault();//evita recarga de pagina
                        scrollTo(0,productsInformation.offsetTop - 50);


        }
});

searchForm.addEventListener('submit', (e) => {
        searchProduct(searchInput);
        e.preventDefault();//evita recarga de pagina
}, false);

const searchProduct = (searchInput) => {
        result = filterProducts(searchInput.value);

        if (result.length == 0) {
                if (!productNotFoundedAlert.classList.contains('show'))
                        productNotFoundedAlert.classList.toggle('show');//muestra cartel de no encontrado
        } else {
                if (nav__menu.classList.contains('show')) { //En dispositivo movil, cierra el menu del nav
                        nav__menu.classList.toggle('show');
                        btn__nav.classList.toggle('active');
                }
                if (productNotFoundedAlert.classList.contains('show'))//oculta el cartel de no encontrado, si estaba visible
                        productNotFoundedAlert.classList.toggle('show');
                
                productsInformationTitle.textContent=`Busqueda: ${searchInput.value}`;
                productsInformationResults.textContent=`${ result.length} Resultados`
                scrollTo(0,productsInformation.offsetTop - 50);
                setTimeout(() => {
                        loadContainerProducts(resul);
                }, 400);
        }
}
//Filtrar productos
const filterProducts = (parameter) => {
        resul = products.filter(product =>
                product.category.toLowerCase().includes(parameter.toLowerCase())
        )
        return resul;
}

//------Evento para Logo de la pagina
navLogo.addEventListener('click', (e) => {
        e.preventDefault();
        if (nav__menu.classList.contains('show')) {
                nav__menu.classList.toggle('show');
                btn__nav.classList.toggle('active');
        }
        if(cartView.classList.contains('show'))
                cartView.classList.toggle('show')
        scrollTo(0,mainInformation.offsetTop - 50);
})

//-----Eventos para btn de productos en NAV y FOOTER
btnNavProductos.addEventListener('click',(e)=>{
        e.preventDefault();
        productsContainer.innerHTML = '';
        productsInformationTitle.textContent=`Descubrí nuestros productos`;
        productsInformationResults.textContent=``;
        loadRandomProductsToContainer(products);
        scrollTo(0,productsInformation.offsetTop - 50);
});
btnNavSeleccionArgentina.addEventListener('click',(e)=>{
        e.preventDefault();
        let filter = filterProducts('Seleccion Argentina');
        if (nav__menu.classList.contains('show')) {
                nav__menu.classList.toggle('show');
                btn__nav.classList.toggle('active');
        }
        productsInformationTitle.textContent=`Categoria: Selección Argentina`;
        productsInformationResults.textContent=`${ filter.length} Resultados`;
        scrollTo(0,productsInformation.offsetTop - 50);
        setTimeout(() => {
                loadContainerProducts(filter);
        }, 400)
});
btnNavLigaProfesional.addEventListener('click', (e) => {
        e.preventDefault();
        let filter = filterProducts('Liga Profesional');
        if (nav__menu.classList.contains('show')) {
                nav__menu.classList.toggle('show');
                btn__nav.classList.toggle('active');
        }
        productsInformationTitle.textContent=`Categoria: Liga Profesional`;
        productsInformationResults.textContent=`${ filter.length} Resultados`
        scrollTo(0,productsInformation.offsetTop - 50);
        setTimeout(() => {
                loadContainerProducts(filter);
        }, 400)
});

btnNavPrimeraNacional.addEventListener('click', (e) => {
        e.preventDefault();
        let filter = filterProducts('Primera Nacional');
        if (nav__menu.classList.contains('show')) {
                nav__menu.classList.toggle('show');
                btn__nav.classList.toggle('active');
        }
        productsInformationTitle.textContent=`Categoria: Primera Nacional`;
        productsInformationResults.textContent=`${ filter.length} Resultados`
        scrollTo(0,productsInformation.offsetTop - 50);
        setTimeout(() => {
                loadContainerProducts(filter);
        }, 400)
});

btnNavTodosProductos.addEventListener('click', (e) => {
        e.preventDefault();
        if (nav__menu.classList.contains('show')) {
                nav__menu.classList.toggle('show');
                btn__nav.classList.toggle('active');
        }
        productsInformationTitle.textContent=`Todos los productos`;
        productsInformationResults.textContent=`${ products.length} Resultados`
        scrollTo(0,productsInformation.offsetTop - 50);
        setTimeout(() => {
                loadContainerProducts(products);
        }, 400)
});
btnFooterSeleccionArgentina.addEventListener("click",(e)=>{
        e.preventDefault();
        let filter = filterProducts('Seleccion Argentina');
        if (nav__menu.classList.contains('show')) {
                nav__menu.classList.toggle('show');
                btn__nav.classList.toggle('active');
        }
        productsInformationTitle.textContent=`Categoria: Seleccion Argentina`;
        productsInformationResults.textContent=`${ filter.length} Resultados`
        scrollTo(0,productsInformation.offsetTop - 50);
        setTimeout(() => {
                loadContainerProducts(filter);
        }, 400)
});
btnFooterLigaProfesional.addEventListener('click', (e)=>{
        e.preventDefault();
        let filter = filterProducts('Liga Profesional');
        if (nav__menu.classList.contains('show')) {
                nav__menu.classList.toggle('show');
                btn__nav.classList.toggle('active');
        }
        productsInformationTitle.textContent=`Categoria: Liga Profesional`;
        productsInformationResults.textContent=`${ filter.length} Resultados`
        scrollTo(0,productsInformation.offsetTop - 50);
        setTimeout(() => {
                loadContainerProducts(filter);
        }, 400)
});
btnFooterPrimeraNacional.addEventListener('click', (e) => {
        e.preventDefault();
        let filter = filterProducts('Primera Nacional');
        if (nav__menu.classList.contains('show')) {
                nav__menu.classList.toggle('show');
                btn__nav.classList.toggle('active');
        }
        productsInformationTitle.textContent=`Categoria: Primera Nacional`;
        productsInformationResults.textContent=`${ filter.length} Resultados`
        scrollTo(0,productsInformation.offsetTop - 50);
        setTimeout(() => {
                loadContainerProducts(filter);
        }, 400)
});
btnFooterTodosProductos.addEventListener('click', (e) => {
        e.preventDefault();
        if (nav__menu.classList.contains('show')) {
                nav__menu.classList.toggle('show');
                btn__nav.classList.toggle('active');
        }
        productsInformationTitle.textContent=`Todos los productos`;
        productsInformationResults.textContent=`${ products.length} Resultados`
        scrollTo(0,productsInformation.offsetTop - 50);
        setTimeout(() => {
                loadContainerProducts(products);
        }, 400)
});

const arrayLength = (array) => {
        let count = 0;
        array.forEach(product => {

                if (product)
                        count += product.units;
        });
        return count;
}

//-----Muestra el menu del nav en dispositivos moviles
btn__nav.addEventListener('click', () => {
        nav__menu.classList.toggle('show');
        btn__nav.classList.toggle('active');
})

//-----Agrega eventos a los botones para mostrar y ocultar la vista del carrito
const addEventShowCart = () => {
        //click en btn carrito abre o cierra la vista del carrito.
        const btnCart = document.getElementById('btnCartView');
        btnCart.addEventListener('click', () => {
                cartView.classList.toggle('show');
        });

        //click en sector opaco cierra vista del carrito
        cartView.addEventListener('click', (e) => {
                if (e.target.classList.contains('cart')) {
                        cartView.classList.toggle('show');
                }
        });

        //click en cabecera de la vista del carrito cierra la vista
        const btnCloseCartView = document.querySelector('.cart__sideContainer__title');
        btnCloseCartView.addEventListener('click', () => {
                cartView.classList.toggle('show');
        });

        //click en btn carrito de nav responsive abre vista del carrito
        const btnCartViewResponsive = document.querySelector('#btnCartViewResponsive');
        btnCartViewResponsive.addEventListener('click', () => {
                cartView.classList.toggle('show');
        });
}

btnFinishBuy.addEventListener('click', ()=>{
        location.href='./form.html';
})