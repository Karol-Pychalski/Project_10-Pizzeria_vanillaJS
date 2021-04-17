/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars
 
{
  'use strict';
 
  const select = {                                  //obiekt
    templateOf: {                                   //drugi obiekt
      menuProduct: '#template-menu-product',        //właściwość i selektor
      cartProduct: '#template-cart-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
  };
 
  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    cart: {
      wrapperActive: 'active',
    },
  };
 
  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    },
    cart: {
      defaultDeliveryFee: 20,
    },
  };
 
  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
  };
 
  class Product {
    constructor(id, data) {                           //constructor to funkcja?
      const thisProduct = this;                       //aby jakaś metoda uruchamiała się przy utworzeniu instancji, to trzeba ją wywołać w konstruktorze
      thisProduct.id = id;
      thisProduct.data = data;
 
      thisProduct.renderInMenu();
      console.log('new Product:', thisProduct);
 
      thisProduct.getElements();
      console.log('getElements:', thisProduct);
 
      thisProduct.initAccordion();
      console.log('initAccordion:', thisProduct);
 
      thisProduct.initOrderForm();
      console.log('initOrderForm:', thisProduct);

      thisProduct.initAmountWidget();
      console.log('initAmountWidget:', thisProduct);
 
      thisProduct.processOrder();
      console.log('processOrder:', thisProduct);
 
    }
 
 
    renderInMenu() {
      const thisProduct = this;
 
      /* generate HTML based on template */
      const generateHTML = templates.menuProduct(thisProduct.data);
 
      /* create element using utlis.createElementFromHTML */
      thisProduct.element = utils.createDOMFromHTML(generateHTML);
 
      /* find menu container */
      const menuContainer = document.querySelector(select.containerOf.menu);
 
      /* add element to menu */
      menuContainer.appendChild(thisProduct.element);
    }
 
 
    getElements() {                    //metoda z referencjami dostępnymi dla wszystkich innych metod
      const thisProduct = this;
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);        //element to węzeł elementu
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);    //form to węzeł atrybutu
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);  //?? (dodane z 7.7) [s.59]
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }
 
 
    initAccordion() {
      const thisProduct = this;
      console.log(thisProduct);
      
      thisProduct.accordionTrigger.addEventListener('click',function(){   //czy w nawiasie ma być event?
        const allProducts = document.querySelectorAll('.product');
  
        allProducts.forEach(function(product){        //czy (element) ?
          product.classList.remove('active');
        });

        thisProduct.element.classList.toggle('active');

      });
    }
 
    
    initOrderForm() {
      const thisProduct = this;
      console.log('initOrderForm:', thisProduct);
 
      thisProduct.form.addEventListener('submit', function (event) {
        event.preventDefault();
        thisProduct.processOrder();
      });
 
      for (let input of thisProduct.formInputs) {
        input.addEventListener('change', function () {
          thisProduct.processOrder();
        });
      }
 
      thisProduct.cartButton.addEventListener('click', function (event) {
        event.preventDefault();
        thisProduct.processOrder();
      });
    }

 
    processOrder() {
      const thisProduct = this;
      console.log('processOrder:', thisProduct);
 
      //covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
      const formData = utils.serializeFormToObject(thisProduct.form);       //daje dostęp do formularza w postaci JS-owego obiektu
      console.log('formData:', formData);
 
      //set price to default price (w tej zmiennej przechowywana jest początkowa cena - zmieniana wraz ze sprawdzaniem kolejnych opcji)
      let price = thisProduct.data.price;
 
      //for every category (param) - pętla dla wszystkich kategorii z data.js (breakfast, pizza itp)
      for (let paramId in thisProduct.data.params) {

        // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
        const param = thisProduct.data.params[paramId];     //ta zmienna daje dostęp do całego obiektu (nie tylko do nazwy właściwości)
        console.log(paramId, param);
 
        // for every option in this category - pętla dla wszystkich opcji w każdej z kategorii z data.js
        for (let optionId in param.options) {
          // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
          const option = param.options[optionId];          //ta zmienna daje dostęp do całego obiektu (nie tylko do nazwy właściwości)
          console.log(optionId, option);
 
          //sprawdź czy dana opcja (optionId) danej kategorii (paramId) jest wybrana w formularzu (formData) - to jest mój problem
          //spawdzam czy formData zwierający kategorię (paramId) posiada wybraną opcję (optionId) - konstrukcja odpowiedzi an problem
          //check if there is param with a name of paramId in formData and if it includes optionId
          const optionSelected = formData[paramId] && formData[paramId].includes(optionId);   //ten krok weryfikuje czy są zaznaczone opcje w formularzu (bez default)
          
          //check if the option is not default
          if (optionSelected && !option.default) {      
            //add option price to price variable (zwiększyć cenę produktu)
            price += option.price;
            //thisProduct.priceElem.add(paramId.option.price);

          } else if (option.default && !optionSelected){
            //reduce price variable (zmniejszyć cenę produktu)
            price -= option.price;
            // }
          }
 
          //find a correct image to class .paramId-optionId in div with images (s.61)
          //const optionImages = thisProduct.imageWrapper.querySelectorAll('.' + paramId + '-' + optionId);
          // if (optionImage) {
          //co tu ma być?
 
          //check if an option is selected (if yes - show a proper image, if not - hide image)
 
 
          //add or remove class active form image
          
        }
 
        //update calculated price in the HTML (wpisanie przeliczonej ceny do elementu w HTML)
        price *= thisProduct.amountWidget.value;        //pomnożenie ceny przez ilość sztuk
        thisProduct.priceElem.innerHTML = price;        //wyświetlenie finałowej ceny (suma = wybrane dodatki i ilość sztuk)
 
      }
    }

    initAmountWidget(){
      const thisProduct = this;
      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);

      thisProduct.amountWidgetElem.addEventListener('updated', function() {     //na tym elemencie (thisProduct.amountWidgetElem) emitujemy event, dlatego tu jest nasłuchiwanie. Funkcja uruchamia poniższą metodę
        thisProduct.processOrder();
      });
    }
  }


  class AmountWidget{
    constructor(element){
      const thisWidget = this;

      thisWidget.getElements(element);
      console.log('getElements:', element);

      thisWidget.setValue(thisWidget.input.value);
      console.log('setValue:', thisWidget);           //?? czy tu dobrze wywołałem widget?

      thisWidget.setListeners();
      console.log('AmountWidget:', thisWidget);
      console.log('constructor arguments', element);
    }

    getElements(element){
      const thisWidget = this;

      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }


    setValue(value){
      const thisWidget = this;
      //const newValue = parseInt(value);
      const newValue = utils.validateQuantityInput(value, thisWidget.value);

      /*TODO: add validation*/

      if(thisWidget.value !== newValue && !isNaN(newValue)){
        thisWidget.value = newValue;
        //this.announce();                  //czy to jest właściwe miejsce i konstrukcja?
        //thisWidget.announce();            //czy to jest właściwe miejsce i konstrukcja?
      }

      thisWidget.value = newValue;
      thisWidget.input.value = newValue;
      thisWidget.announce();                //czy to jest poprawna konstrukcja wywołania i właściwe miejsce?
    }

    setListeners(){
      const thisWidget = this;

      thisWidget.linkIncrease.addEventListener('click', function(){
        thisWidget.setValue(thisWidget.value + 1);
      });

      /* inny sposób na zakodowanie powyższej linijki:
      thisWidget.linkIncrease.addEventListener('click', function()
        const currentValue = thisWidget.value;
        const newValue = currentValue + 1;
        thisWidget.setValue(newValue);
      */

      /*inna możliwość dodania ograniczenia do 9 zamiast w functions.js:
        if(newValue <= 9){
          thisWidget.setValue(newValue);
          }
      */

      //dodać ograniczenie =>1

      thisWidget.linkDecrease.addEventListener('click', function(){
        thisWidget.setValue(thisWidget.value - 1);
      });

      
      thisWidget.input.addEventListener('input', function(event){
        thisWidget.setValue(event.currentTarget.value);
      });

      /* inny sposób na zakodowanie powyższej linijki:
      thisWidget.input.addEventListener('input', function(event)
        const newValue = event.currentTarget.value;
        thisWidget.setValue(newValue);
      */

      //dodać walidację wprowadzanej liczby w input (zakres)

    }

    announce(){
      const thisWidget = this;
      const event = new Event('updated');
      thisWidget.element.dispatchEvent(event);
    }
  }

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
    }

    initActions() {
      const thisCart = this;

      thisCart.dom.toggleTrigger.addEventListener('click', function() {
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);     //hanlder tego listenera toggluje klasę zapisaną w classNames.cart.wrapperActive
      });
      
    }
  }

 
  const app = {
    initMenu: function(){                      //metoda app.initMenu wywoływana po app.initData (korzysta z przygotowanej wcześniej referencji do danych -> thisApp.data)
      const thisApp = this;                    //zadanie tej metody: przejście po wszystkich obiektach produktów i utworzenie dla każdego z nich instancji klasy Product [s.41]
      console.log('thisApp.data:', thisApp.data);
 
      for(let productData in thisApp.data.products){                    //pętla wykonuje wszystkie akcje z getEleent dla każdego produktu z menu (powtarza to wszystko dla każdego produktu)
        new Product(productData, thisApp.data.products[productData]);   //nowa instancja z 2 argumentami
      }
    },
 
    initData: function(){                     //metoda app.initData (zadanie: przygotowanie łatwego dostępu do danych [s.41]
      const thisApp = this;
 
      thisApp.data = dataSource;              //przypisanie referencji do dataSource (znajduje się tam obiekt Products ze strukturą produktów)
    },

    initCart: function(){
      const thisApp = this;
      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);      //instancja klasy Cart
    },
 
    init: function(){                         //to jest metoda: app.init
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);
 
      thisApp.initData();                    //wywołanie metody initData
      thisApp.initMenu();                    //wywołanie metody initMenu
      thisApp.initCart();
    },
  };
 
  app.init();
}