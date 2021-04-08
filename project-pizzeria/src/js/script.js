/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars
 
{
  'use strict';
 
  const select = {                                  //obiekt
    templateOf: {                                   //drugi obiekt
      menuProduct: '#template-menu-product',        //właściwość i selektor
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
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };
 
  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };
 
  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };
 
  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };
 
  class Product {
    constructor(id, data) {                           //constructor to funkcja?
      const thisProduct = this;                      //aby jakaś metoda uruchamiała się przy utworzeniu instancji, to trzeba ją wywołać w konstruktorze
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
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);        //element to węzeł elementu?
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);    //form to węzeł atrybutu?
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);  //?? (dodane z 7.7) [s.59]
    }
 
 
    initAccordion() {
      const thisProduct = this;
      console.log(thisProduct);

      /* find the clickable trigger (the element that should react to clicking) */
      const accordionTrigger = document.querySelector(select.menuProduct.clickable); //?  element.select.menuProduct.clickable('.product__header');
      console.log('clickable trigger:', accordionTrigger);

      //const accordionContent = documment.querySelectorAll('.product__wrapper')
 
      /* START: add event listener to clickable trigger on event click */
      //const createAccordion = document.getElementsByClassName('product_header');
      
      
      /*---------------------------------sposób 1 -----------------------------------*/
      //const i;

      //for (i = 0; i < createAccordion; i++) {
      // accordionTrigger.addEventListener('click', function(event) { //było: clickableTrigger.addEventListener('click', function(event){ -> zmiana w 7.6
      //   thisProduct.classList.toggle('active');
      //   const product_name = thisProduct.nextElementSibling;
      //   if (product_name.style.display === 'block') {
      //     product_name.style.display = 'none';
      //   } else {
      //     product_name.style.display = 'block';
      //   }
      //   /* prevent default action for event */
      //   event.preventDefault();
      //   const clickedElement = this;      // czy to tu ma być?
        
      // });
      // //}
    }
 

    /*--------------------------------------------------------------------------------*/
 
    /* find active product (product that has active class) */
    //const activeProduct = document.querySelector(select.menuProduct.wrapperActive);   //było ('active')
    //console.log('product with active class:', activeProduct);

    /*-------------------------------- sposób 2---------------------------------------*/
    //const createAccordion = document.getElementsByClassName("product_header");
    //const i;

 
    /* if there is active product and it's not thisProduct.element, remove class active from it */
    //const removeActive = thisProduct.element.remove(classNames.menuProduct.wrapperActive);
    //const removeActive = thisProduct.element.add(classNames.menuProduct.wrapperActive).siblings.remove(classNames.menuProduct.wrapperActive);
    //thisProduct.classList.add('active').siblings.remove('active');
    //console.log('remove active class from active product:');
 
    /* toggle active class on thisProduct.element */
    //clickedElement.classList.toggle('active');      //z tym kodem dodaje się klasa active do klikniętego nagłówka - czy mimo to jest on dobry?
    //thisProduct.element.toggle(select.menuProduct.clickable);
    //thisProduct.element.toggle(classNames.menuProduct.wrapperActive);    -> s.44

      
        
      
 
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
      console.log('formData', formData);
 
      // //set price to default price (w tej zmiennej przechowywana jest początkowa cena - zmieniana wraz ze sprawdzaniem kolejnych opcji)
      // let price = thisProduct.data.price;
 
      // //for every category (param) - pętla dla wszystkich kategorii z data.js (breakfast, pizza itp)
      //     for (let paramId in thisProduct.data.params) {

      //   // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
      //   const param = thisProduct.data.params[paramId];     //ta zmienna daje dostęp do całego obiektu (nie tylko do nazwy właściwości)
      //   console.log(paramId, param);
 
      //   // for every option in this category - pętla dla wszystkich opcji w każdej z kategorii z data.js
      //   for (let optionId in param.options) {
      //     // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
      //     const option = param.options[optionId];          //ta zmienna daje dostęp do całego obiektu (nie tylko do nazwy właściwości)
      //     console.log(optionId, option);
 
      //     //sprawdź czy dana opcja (optionId) danej kategorii (paramId) jest wybrana w formularzu (formData) - to jest mój problem
      //     //spawdzam czy formData zwierający kategorię (paramId) posiada wybraną opcję (optionId) - konstrukcja odpowiedzi an problem
      //     //check if there is param with a name of paramId in formData and if it includes optionId

 
      //     if (formData[paramId] && formData[paramId].includes(optionId)) {
      //       //check if the option is not default
      //       if (!option.default) {
      //         //add option price to price variable
 
      //       }
      //     } else {
      //       //check if the option is default
      //       // if(???) {
      //       //   //reduce price variable
      //       // }
      //     }
 
      //     //find a correct image to class .paramId-optionId in div with images (s.61)
      //     const optionImage = thisProduct.imageWrapper.querySelector('.paramId-optionId');
      //     if (optionImage) {
      //       //co tu ma być?
      //     }
 
      //     //check if an option is selected (if yes - show a proper image, if not - hide image)
 
 
      //     //add or remove class active form image
      //     for (let activeClass of optionImage) {
      //       activeClass.classList.add(classNames.menuProduct.imageVisible);
      //     }
 
      //   }
 
      //   //update calculated price in the HTML (wpisanie przeliczonej ceny do elementu w HTML)
      //   thisProduct.priceElem.innerHTML = price;
 
      // }
 
    }
 
  }
 
  const app = {
    initMenu: function(){                      //metoda app.initMenu wywoływana po app.initData (korzysta z przygotowanej wcześniej referencji do danych -> thisApp.data)
      const thisApp = this;                    //zadanie tej metody: przejście po wszystkich obiektach produktów i utworzenie dla każdego z nich instancji klasy Product [s.41]
      console.log('thisApp.data:', thisApp.data);
 
      for(let productData in thisApp.data.products){
        new Product(productData, thisApp.data.products[productData]);   //nowa instancja z 2 argumentami
      }
    },
 
    initData: function(){                     //metoda app.initData (zadanie: przygotowanie łatwego dostępu do danych [s.41]
      const thisApp = this;
 
      thisApp.data = dataSource;              //przypisanie referencji do dataSource (znajduje się tam obiekt Products ze strukturą produktów)
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
    },
  };
 
  app.init();
}