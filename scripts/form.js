let cart=[];
const btnLogo = document.querySelector('.header-form__logo');
const btnBackHome = document.querySelector('.btnBackHome');
const inputEmail = document.querySelector('#input-email');
const inputName = document.querySelector('#input-name');
const inputSurname = document.querySelector('#input-surname');
const inputDni = document.querySelector('#input-dni');
const inputPhone = document.querySelector('#input-phone');
const btnSubmit = document.querySelector('.form-submit');
const hasNumber = /\d/;

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

inputEmail.addEventListener('focus',()=>{
    inputEmail.classList.add('focus');
});
inputName.addEventListener('focus',()=>{
    inputName.classList.add('focus');
});
inputSurname.addEventListener('focus',()=>{
    inputSurname.classList.add('focus');
});
inputDni.addEventListener('focus',()=>{
    inputDni.classList.add('focus');
});
inputPhone.addEventListener('focus',()=>{
    inputPhone.classList.add('focus');
});

inputEmail.addEventListener('blur',()=>{
    if(inputEmail.value =='' || !validateEmail(inputEmail.value)){
        inputEmail.classList.add('invalid');
    }else{
        if(inputEmail.classList.contains('invalid'))
            inputEmail.classList.toggle('invalid');
    }
});
inputName.addEventListener('blur',()=>{
    if(inputName.value =='' || hasNumber.test(inputName.value)){
        inputName.classList.add('invalid');
    }else{
        if(inputName.classList.contains('invalid'))
            inputName.classList.toggle('invalid');
    }
});
inputSurname.addEventListener('blur',()=>{
    if(inputSurname.value =='' || hasNumber.test(inputSurname.value)){
        inputSurname.classList.add('invalid');
    }else{
        if(inputSurname.classList.contains('invalid'))
            inputSurname.classList.toggle('invalid');
    }
});
inputDni.addEventListener('blur',()=>{
    if(inputDni.value ==''){
        inputDni.classList.add('invalid');
    }else{
        if(inputDni.classList.contains('invalid'))
            inputDni.classList.toggle('invalid');
    }
});
inputPhone.addEventListener('blur',()=>{
    if(inputPhone.value ==''){
        inputPhone.classList.add('invalid');
    }else{
        if(inputPhone.classList.contains('invalid'))
            inputPhone.classList.toggle('invalid');
    }
});

btnSubmit.addEventListener('click',(e)=>{
    e.preventDefault();
    let inputs = document.comprarForm.input;
    let validToBuy= true;
    inputs.forEach(input =>{
        if(input.value==''){
            input.classList.add('invalid');
            validToBuy=false;
        }else{
            if(input.classList.contains('invalid'))
                validToBuy=false;
        }      
    })
    if(validToBuy){
        cart=[];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartContent();
        alert('compra Completa');
        resetForm();
    }else{
        alert('Hay valores incorrectos');
    }
})
document.addEventListener('DOMContentLoaded',()=>{
    checkCartLocalStorage();
    console.log(cart);
    updateCartContent();
    resetForm();

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
const resetForm = ()=>{
    inputEmail.value = '';
    inputName.value = '';
    inputSurname.value = '';
    inputDni.value = '';
    inputPhone.value = '';
}
const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };