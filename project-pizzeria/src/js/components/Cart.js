import {settings, select, classNames, templates} from './settings.js';
import {utils} from './utils.js';
import CartProduct from './CartProduct.js';

class Cart {
  constructor(element){
    const thisCart = this;

    thisCart.products = [];           //tu będą przechowywane produkty dodane do koszyka
    thisCart.getElements(element);
    thisCart.initActions();

    console.log('new Cart', thisCart);
  }

  getElements(element){
    const thisCart = this;
    thisCart.dom = {};
    thisCart.dom.wrapper = element;

    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    //thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.)
    thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
    thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelector(select.cart.totalPrice);
    thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);

    //tablica użyta w pętli w metodzie 'update'
    thisCart.totalSumUpdate = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];

  }

  initActions() {
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function(event) {
      event.preventDefault(); 
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);     //hanlder tego listenera toggluje klasę zapisaną w classNames.cart.wrapperActive
    });

    thisCart.dom.productList.addEventListener('updated', function() {     //dzięki własciwości bubbles event powstanie na tej liście
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function(event) {      //8.6: Zadanie: wychwycenie eventu
      thisCart.remove(event.detail.cartProduct);                          //handler eventu - wywołuje metodę thisCart.remove z argumentem o wartości event.detail.cartProduct
    });
  }

  add(menuProduct) {
    const thisCart = this
    console.log('adding product', menuProduct);


    const generatedHTML = templates.cartProduct(menuProduct);

    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
  
    thisCart.dom.productList.appendChild(generatedDOM);
    //console.log('adding product ', menuProduct);
  
 
    // /* find menu container */
    // const menuContainer = document.querySelector(select.containerOf.menu);
 
    // /* add element to menu */
    // menuContainer.appendChild(thisProduct.element);

    thisCart.products.push(new cartProduct(menuProduct, generateDOM));                  //ta i kolejna linia dodane z początku 8.5 (+ późniejsze zmiany: stworzenie nowej instancji klasy new CartProduct i dodanie jej do tablicy thisCart.products
    console.log('thisCart.products', thisCart.products);

    thisCart.update();
  }

  update() {
    const thisCart = this;

    const deliveryFee = settings.cart.defaultDeliveryFee;
    const totalNumber = 0;
    const subtotalPrice = 0;

    for (let product of thisCart.products) {
      thisCart.totalNumber += product.amount;
      console.log('totalNumber: ', thisCart.totalNumber);

      thisCart.subtotalPrice += product.price;
      console.log('subtotalPrice: ', thisCart.subtotalPrice);
      }

    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;    //tu nie ma stałej, bo byłaby dostepna tylko w metodzie 'update' - jest właściwość (dostępna w całej instancji), którą można użyć w innych metodach
    console.log('totalPrice: ', thisCart.totalPrice);

    //czy ta pętla będzie działać? (odnosi się do tablicy z getElements w tej klasie)
    for (let sum of thisCart.totalSumUpdate) {
      for (let elem of thisCart.dom[sum]) {
        elem.innerHTML = thisCart[sum];
      }
    }
  }

  remove(cartProduct) {
    const thisCart = this;
  
    const index = thisCart.products.indexOf(cartProduct);
    thisCart.products.splice(index, 1);
  
    cartProduct.dom.wrapper.remove();
  
    thisCart.update();
  }
}

export default Cart;