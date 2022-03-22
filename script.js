let cart = [];

const cartList = document.getElementById('cart__items'); //contenedor de productos en el carrito

const carouselProducts = document.querySelector('.productsCarousel__container__elements'); //carrusel de productos

const templateProducts = document.getElementById("template-carouselProducts").content; //template para cada producto item
const fragment = document.createDocumentFragment(); //fragmento para guardar cada item y luego insertarlo en el carrusel

const cart__resume = document.querySelector('.cart__sideContainer__resume'); //div con resumen del carrito

document.addEventListener('DOMContentLoaded', () => { //Despues de cargarse el DOM
        showNavResponsive();
        addEventShowCart();
        fetchData();
        checkCartLocalStorage();
});

//Verifica si hay productos cargados en el carrito y los actualiza en la vista
const checkCartLocalStorage = () => {
        const cartStorage = localStorage.getItem('cart');
        if (cartStorage) {
                cart = JSON.parse(cartStorage);
                updateCartProductView()
                console.log(cart);
        }
};

//Mostrar el menu en navbar para dispositivos mobiles
const showNavResponsive = () => {
        const btn__nav = document.querySelector('.btn__nav');
        btn__nav.addEventListener('click', () => {
                const nav__menu = document.querySelector('.navBar__menu');
                nav__menu.classList.toggle('show');
                btn__nav.classList.toggle('active');
        })
}

//Agrega eventos a los botones para mostrar y ocultar la vista del carrito
const addEventShowCart = () => {
        //evento para boton carrito en el nav bar.
        const btnCart = document.getElementById('btnCartView');
        btnCart.addEventListener('click', () => {
                cartView.classList.toggle('show');
        });

        //evento para cuando se haga click en el sector opaco se cierre la vista
        const cartView = document.querySelector('.cart');
        cartView.addEventListener('click', (e) => {
                if (e.target.classList.contains('cart')) {
                        cartView.classList.toggle('show');
                }
        });

        //evento para el boton cerrar, dentro de la vista del carrito
        const btnCloseCartView = document.querySelector('.cart__sideContainer__title__exit');
        btnCloseCartView.addEventListener('click', () => {
                cartView.classList.toggle('show');
        });

        //evento para boton carrito responsive del nav bar
        const btnCartViewResponsive = document.querySelector('#btnCartViewResponsive');
        btnCartViewResponsive.addEventListener('click', () => {
                cartView.classList.toggle('show');
        });
}

//Trae y lee los datos del archivo json
const fetchData = async () => {
        try {
                const res = await fetch('./assets/products.json');
                const data = await res.json();
                loadProducts(data);
        } catch (error) {
                console.log(error)
        }
}

//Carga los productos del json en el fragment y luego los carga en el carrusel
const loadProducts = (data) => {
        data.forEach(product => {
                const img = document.createElement('img'); //agrego la img y sus eventos por separado
                img.setAttribute("src", `./assets/images/${product.imgFrontUrl}`);
                img.setAttribute("alt", `${product.name}`);
                //eventos de cambio de imagen
                img.addEventListener('mouseover', () => {
                        img.setAttribute("src", `./assets/images/${product.imgBackUrl}`);
                });
                img.addEventListener('mouseout', () => {
                        img.setAttribute("src", `./assets/images/${product.imgFrontUrl}`);
                });

                templateProducts.querySelector('h3').textContent = `${product.name} ${product.year}`;
                templateProducts.querySelector('p').textContent = `$${product.price}`;
                templateProducts.querySelector('.productsCarousel__container__elements__item__button').dataset.id = product.id; //guardo en el button el id de ese producto

                const clone = templateProducts.cloneNode(true);

                clone.firstElementChild.insertBefore(img, clone.firstElementChild.firstElementChild); //agrego la imagen dentro del template, para que quede antes de la información del producto

                fragment.appendChild(clone);//agrega ese item al fragment
        })

        carouselProducts.appendChild(fragment);

        //Crea el carrusel usando la libreria glider.js
        new Glider(document.querySelector('.productsCarousel__container__elements'), {
                exactWidth: true,
                itemWidth: 180,
                slidesToShow: 1,
                slidesToScroll: 1,
                duration: 2.5,
                rewind: true,   //llega al final y vuelva al principio
                arrows: {
                        prev: '.carousel__before',
                        next: '.carousel__next'
                },
                responsive: [
                        {
                                breakpoint: 575, //>=575px
                                settings: {
                                        itemWidth: 180,
                                        slidesToShow: 3,
                                        dots: '.carousel__indicadores'
                                }
                        }, {
                                breakpoint: 800,
                                settings: {
                                        itemWidth: 200,
                                        slidesToShow: 6,
                                        dots: '.carousel__indicadores'
                                }
                        }
                ]
        });
}

//captura los clicks para agregar un producto al carrito
carouselProducts.addEventListener("click", (e) => {
        addCart(e);
});

//filtra el producto seleccionado.
const addCart = e => {
        //verifica que se hizo click en el boton
        if (e.target.classList.contains('fa-cart-plus')) { //si hace click en el icono
                setCart(e.target.parentElement.parentElement);
        } else {
                if (e.target.classList.contains('productsCarousel__container__elements__item__button')) {
                        setCart(e.target.parentElement); //Envia el item completo
                }
        }

        e.stopPropagation();
}

//Agrega los datos del producto a un objeto y lo agrega al array cart,luego actualiza en localstorage
const setCart = (object) => {
        const product = {
                id: object.querySelector('.productsCarousel__container__elements__item__button').dataset.id,
                name: object.querySelector('h3').textContent,
                price: object.querySelector('p').textContent,
                units: 1
        }
        //si ya existe ese id, le aumento la cantidad
        if (cart.hasOwnProperty(product.id)) {
                product.units = cart[product.id].units + 1;
        }
        cart[product.id] = { ...product }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartProductView()
}

//actualiza la vista de los productos en el carrito
function updateCartProductView() {
        let totalPrice = 0;
        console.log(cart)
        cartList.innerHTML = '';
        cart.forEach(product => {
                if (product) {//si no es null
                        cartList.innerHTML += `
                        <div class="cart__sideContainer__items__item">
                                <p class="cart__sideContainer__items__item__name">${product.name}</p>
                                <p class="cart__sideContainer__items__item__amount">${product.units}</p>                
                        <p class="cart__sideContainer__items__item__price">${product.price}</p>
                        </div>
                        `;
                        totalPrice += Number(product.price.slice(1)) * product.units; //quita el $ de product.price y lo transforma a number
                }

        });
        cart__resume.innerHTML = `
        <div class="cart__sideContainer__resume__total">
                <p>Total: $${totalPrice} </p>
        </div>
`;
}
