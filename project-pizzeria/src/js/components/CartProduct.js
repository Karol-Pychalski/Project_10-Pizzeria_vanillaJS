import {select} from './settings.js';
import AmountWidget from './components/AmountWidget.js';

class cartProduct {
  constructor(menuProduct, element){
    const thisCartProduct = this;

    thisCartProduct.id = menuProduct.id;
    thisCartProduct.name = menuProduct.name;
    thisCartProduct.price = menuProduct.price;
    thisCartProduct.priceSingle = menuProduct.priceSingle;
    thisCartProduct.amount = menuProduct.amount;

    thisCartProduct.getElements(element);     //tu konstruktor wynokuje metodę getElements przekazując jej argument element
    //console.log('thisCartProduct', thisCartProduct);
    thisCartProduct.initAmountWidget();       //tu konstruktor uruchamia metodę initAmountWidget
    thisCartProduct.initActions();

  }

  getElements(element){
    thisCartProduct = this;

    thisCartProduct.dom = {};

    thisCartProduct.dom.wrapper = element;      //właściwość thisCardProduct.dom.wrapper z przypisanym argumentem element (referencja do oryginalnego elementu DOM)

    // czy te właściwości poniżej mają dobrą kosntrukcję ???
    thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
    thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);      //czy thisCartProduct.dom.priceElem ?
    thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
    thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);
  }

  initAmountWidget() {
    const thisCartProduct = this;
  
    thisCartProduct.amountWidgetElement = new AmountWidget(thisCartProduct.amountWidget);
  
    thisCartProduct.amountWidgetElement.element.addEventListener('updated', function() {
      thisCartProduct.amount = thisCartProduct.amountWidgetElement.value;
      thisCartProduct.price = thisCartProduct.priceSingle * thisCartProduct.amount;
      thisCartProduct.priceElem.innerHTML = thisCartProduct.price;
    });
  }

    //skopiowane z klasy Product (wyżej)
    // initAmountWidget(){
    //   const thisProduct = this;
    //   thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);

    //   thisProduct.amountWidgetElem.addEventListener('updated', function() {     //na tym elemencie (thisProduct.amountWidgetElem) emitujemy event, dlatego tu jest nasłuchiwanie. Funkcja uruchamia poniższą metodę
    //     thisProduct.processOrder();
    //   });
    // }

    // remove(){
    //   const thisCartProduct = this;

    //   const event = new CustomEvent('remove', {
    //     bubbles: true,
    //     detail: {
    //       cartProduct: thisCartProduct,
    //     },
    //   }),

    //   thisCartProduct.dom.wrapper.dispatchEvent(event);
    // }

  initActions() {
    const thisCartProduct = this;
  
    thisCartProduct.dom.edit.addEventListener('click', function(event) {      //czy event to dobry parametr dla tej funckji?
      event.preventDefault();
      console.log('edit clicked');
    });
  
    thisCartProduct.dom.remove.addEventListener('click', function(event) {
      event.preventDefault();
      thisCartProduct.remove();
    });
  }
}

export default CartProduct;