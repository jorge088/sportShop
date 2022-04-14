let cart=[];
const btnLogo = document.querySelector('.header-form__logo');
const btnBackHome = document.querySelector('.btnBackHome');

const cartContent = document.querySelector('.buyInformation__cartContent__products');
const templateCartContent = document.querySelector('#template-CartContent').content;
const fragmentCartContent = document.createDocumentFragment();
const cartTotal= document.querySelector('.buyInformation__cartContent__resume__total');

btnLogo.addEventListener('click',()=>{
    location.href='./index.html';
})
btnBackHome.addEventListener('click', ()=>{
    location.href='./index.html';
});

document.addEventListener('DOMContentLoaded',()=>{
    checkCartLocalStorage();
    console.log(cart);
    updateCartContent();

})
const checkCartLocalStorage = () => {
    const cartStorage = localStorage.getItem('cart');
    if (cartStorage) {
            cart = JSON.parse(cartStorage);
    }
};
const updateCartContent = ()=>{
    cartContent.innerHTML='';
    let totalPrice=0;
    cart.forEach(product =>{
        if(product){
            templateCartContent.querySelector('img').setAttribute('src',`${product.img}`);
            templateCartContent.querySelector('.buyInformation__cartContent__products__item__description__name').textContent = product.name;
            templateCartContent.querySelector('.buyInformation__cartContent__products__item__description__units').textContent = `x ${product.units}`;
            templateCartContent.querySelector('.buyInformation__cartContent__products__item__price').textContent = `$${Number(product.price.slice(1)) * product.units}`;
            totalPrice += Number(product.price.slice(1)) * product.units;
            const clone = templateCartContent.cloneNode(true);
            fragmentCartContent.appendChild(clone);
        }   
    });
    cartContent.appendChild(fragmentCartContent);
    cartTotal.textContent = `Total $${totalPrice}`;
}