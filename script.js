let cart = [];
let cartList = document.getElementById('cart__items');

const products = document.getElementById('products'); //contenedor de productos
const templateProducts = document.getElementById("template-carouselProducts").content; //template para cada producto item
const fragment = document.createDocumentFragment(); //fragmento para guardar cada item y luego insertarlo en el contenedor
const cart__resume = document.querySelector('.cart__sideContainer__resume'); //div con resumen del carrito
const carousel = document.querySelector('.productsCarousel__container__elements');


document.addEventListener('DOMContentLoaded', () => { //Despues de cargarse el DOM
        showNavResponsive();
        addBtnShowCart();
        fetchData();



});
//Mostrar el menu en navbar para dispositivos mobiles
const showNavResponsive = () => {
        const btn__nav = document.querySelector('.btn__nav');
        if (btn__nav) {
                btn__nav.addEventListener('click', () => {
                        const nav__menu = document.querySelector('.navBar__menu');
                        nav__menu.classList.toggle('show');
                        btn__nav.classList.toggle('active');
                })
        }
}

const addBtnShowCart = () => {
        const btnCart = document.getElementById('btnCartView');
        const cartView = document.querySelector('.cart');
        const btnCloseCartView = document.querySelector('.cart__sideContainer__title__exit');
        const btnCartViewResponsive = document.querySelector('#btnCartViewResponsive');
        const btnCartViewMenu = document.querySelector('.navBar__menu__btnCartMenu');
        btnCart.addEventListener('click', () => {
                cartView.classList.toggle('show');
        });
        cartView.addEventListener('click', (e) => {
                if (e.target.classList.contains('cart')) {
                        cartView.classList.toggle('show');
                }
        });
        btnCloseCartView.addEventListener('click', () => {
                cartView.classList.toggle('show');
        });
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

//Carga los productos del json en la pantalla
const loadProducts = (data) => {

        data.forEach(product => {
                const img = document.createElement('img'); //agrego la img y sus eventos por separado
                img.setAttribute("src", `./assets/images/${product.imgFrontUrl}`);
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
        //products.appendChild(fragment); //luego de agregar todos los items al fragment, lo inserta en el DOM

        carousel.appendChild(fragment);

        new Glider(document.querySelector('.productsCarousel__container__elements'), {
                exactWidth:true,
                itemWidth:180,
                slidesToShow:5,
                slidesToScroll: 1,
                duration: 2.5,
                rewind:true,
                dots:'.carousel__indicadores',
                arrows: {
                        prev: '.carousel__before',
                        next: '.carousel__next'
                      },
                
        });


}

//captura los clicks para agregar un producto al carrito
carousel.addEventListener("click", (e) => {
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

//Agrega los datos del producto al carrito
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
        updateProductList()
}

//actualiza la lista de productos del carrito en el dom
function updateProductList() {
        let totalPrice = 0;
        cartList.innerHTML = '';
        cart.forEach(product => {
                cartList.innerHTML += `
                <div class="cart__sideContainer__items__item">
                        <p class="cart__sideContainer__items__item__name">${product.name}</p>
                        <p class="cart__sideContainer__items__item__amount">${product.units}</p>                
                        <p class="cart__sideContainer__items__item__price">${product.price}</p>
                </div>
                `;
                totalPrice += Number(product.price.slice(1)) * product.units; //quita el $ de product.price y lo transforma a number
        });
        cart__resume.innerHTML = `
        <div class="cart__sideContainer__resume__total">
                <p>Total: $${totalPrice} </p>
        </div>
`;
}
