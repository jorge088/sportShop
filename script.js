class Product{
        constructor (name,price){
                this.name=name;
                this.price=price;
                this.amount = 1;
        }
}

//Funcion calculo precio final
const finalPrice = (cart) => { 
        let price=0;
        cart.forEach(product =>{
                price+=product.price*product.amount;
        });
        return price;
}

//Ver si el producto ya está en el carrito
function isInCart(name,price){
        if(cart.some((product)=>product.name == name)){
                cart.forEach(element => {
                        if(element.name == name) //busco al producto en el array
                                element.amount++;//le aumento a la cantidad
                });
        }else{
                cart.push(new Product(name,price));
        }
}

//actualiza la lista de productos en el dom
function updateProductList(){
        cartList.innerHTML='<h2> Carrito de compras</h2>';
        cart.forEach(product=>{
                cartList.innerHTML += `
                <div class="cart__item">
                        <p class="cart__item__name">${product.name}</p>
                        <p class="cart__item__amount">${product.amount}</p>                
                        <p class="cart__item__price">$${product.price}</p>
                </div>
                `;
        });
}

var cart = []; //carrito
var totalDiscount=0;
var cartList = document.getElementById('cart');
cartList.innerHTML='<h2> Carrito de compras</h2>';

alert("¡Bienvenido a mi tienda de ropa!");

do{
        
    let option = prompt(`Elija entre los siguientes productos(ingrese numero de opción): 
                        \n 1_ Zapatillas Nike: $11.000
                        \n 2_ Campera de lluvia $8.000
                        \n 3_ Remera selección Argentina $12.000
                        \n 4_ Pelota de futbol Adidas $5.000
                        \n 5_ Pantalon deportivo $7.000
                        `);

    switch(parseInt(option)){
        case 1: isInCart("Zapatillas Nike",11000);
                break;
        case 2: isInCart("Campera de lluvia",8000);
                break;
        case 3: isInCart("Remera seleccion Argentina",12000);
                break;
        case 4: isInCart("Pelota de futbol Adidas",5000);
                break;
        case 5: isInCart("Pantalon deportivo",7000);
                break;
        default: alert("Opción inexistente, elija un numero de producto correcto");
                continue;
    };
    updateProductList();
    var answer = prompt("¿Quiere agregar otro producto? (Si-No)");
} while (answer.toLowerCase() != "no");

//aplica descuento
if(cart.find((product)=>product.price>8000)){ // Busca si está llevando un producto > $8000
        let discount = prompt(`¡Tenemos una oferta para usted! 
                                \nLlevando un producto mayor a $8000, le ofrecemos un descuento del %10 sobre el precio de ese producto pagando con efectivo. 
                                \n¿Paga de esta forma? (si/no)`);
        if(discount.toLowerCase()=="si"){
                cart.forEach(product => {
                        if(product.price>8000) // Solo aplica descuento a productos > $8000
                                totalDiscount+=product.price*0.1*product.amount;
                });
        }
}

//Genera mensaje final
var finalMessage=`COMPRA FINALIZADA \nUsted compró: \n`;
cart.forEach(product => {
        finalMessage+=`* ${product.name} - $${product.price} \n`;
});

alert(`${finalMessage}\nDescuento: $${totalDiscount} \n EL TOTAL A PAGAR ES: $ ${finalPrice(cart)-totalDiscount}`);
//Carga el precio final al dom
cartList.innerHTML+=`
        <div class="cart__total">
                <p>Total: $${finalPrice(cart)-totalDiscount} </p>
        </div>
`;

