import {select, classNames, templates} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';

class Product {
  constructor(id, data) {             //aby jakaś metoda uruchamiała się przy utworzeniu instancji, to trzeba ją wywołać w konstruktorze
    const thisProduct = this;
    thisProduct.id = id;
    thisProduct.data = data;
    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
  }

  renderInMenu() {
    const thisProduct = this;

    /* generate HTML base on templemate */
    const generatedHTML = templates.menuProduct(thisProduct.data);

    /* create element using utils.createElementFromHTML */
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);
    /* find menu container */
    const menuContainer = document.querySelector(select.containerOf.menu);

    /* add element to menu */
    menuContainer.appendChild(thisProduct.element);
  }

  getElements() {               //metoda z referencjami dostępnymi dla wszystkich innych metod
    const thisProduct = this;
    thisProduct.dom = {};

    thisProduct.dom.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);       //element to węzeł elementu
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);                            //form to węzeł atrybutu
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.dom.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.dom.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);         //(dodane z 7.7) [s.59]
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    //console.log(thisProduct.dom);
  }

  initAccordion() {
    const thisProduct = this;

    /* find element */
    thisProduct.dom.accordionTrigger.addEventListener('click', function (event) {
      //const allProducts = document.querySelectorAll('.product');
      event.preventDefault();

      /* find active product (product that has active class) */
      const activeProduct = document.querySelector(select.all.menuProductsActive);

      /* if there is active product and it's not thisProduct.element, remove class active from it */
      if (activeProduct !== null && activeProduct !== thisProduct.element) {
        activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
      }
      /* toggle active class on thisProduct.element */
      thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);

      // allProducts.forEach(function(product){
      //   product.classList.remove('active');
      // });

      // thisProduct.element.classList.toggle('active');
    });
  }

  initOrderForm() {
    const thisProduct = this;
    // console.log("initOrderForm", thisProduct);
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
      thisProduct.addToCart();
    });
  }

  initAmountWidget() {
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('updated', function () {
      thisProduct.processOrder();
    });
  }

  processOrder() {
    const thisProduct = this;

    // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
    const formData = utils.serializeFormToObject(thisProduct.form);   //daje dostęp do formularza w postaci JS-owego obiektu
    // console.log('formData', formData);

    // set price to default price (w tej zmiennej przechowywana jest początkowa cena - zmieniana wraz ze sprawdzaniem kolejnych opcji)
    let price = thisProduct.data.price;

    // for every category (param)  - pętla dla wszystkich kategorii z data.js (breakfast, pizza itp)
    for (let paramId in thisProduct.data.params) {
      // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
      const param = thisProduct.data.params[paramId];   //ta zmienna daje dostęp do całego obiektu (nie tylko do nazwy właściwości)
      // console.log(paramId, param); 

      // for every option in this category - pętla dla wszystkich opcji w każdej z kategorii z data.js
      for (let optionId in param.options) {
        // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
        const option = param.options[optionId];         //ta zmienna daje dostęp do całego obiektu (nie tylko do nazwy właściwości)
        // console.log(optionId, option);

        //sprawdź czy dana opcja (optionId) danej kategorii (paramId) jest wybrana w formularzu (formData) - to jest mój problem
        //spawdzam czy formData zwierający kategorię (paramId) posiada wybraną opcję (optionId) - konstrukcja odpowiedzi na problem
        //check if there is param with a name of paramId in formData and if it includes optionId
        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);     //ten krok weryfikuje czy są zaznaczone opcje w formularzu (bez default)

        //check if the option is not default
        if (optionSelected && !option.default) {      
          //add option price to price variable (zwiększyć cenę produktu)
          price += option.price;
          //thisProduct.priceElem.add(paramId.option.price);

        } else if (option.default && !optionSelected){
          //reduce price variable (zmniejszyć cenę produktu)
          price -= option.price;
        }

        const optionImage = thisProduct.dom.imageWrapper.querySelector('.' + paramId + '-' + optionId);
        if (optionImage) {
          if (optionSelected) {
            optionImage.classList.add(classNames.menuProduct.imageVisible);
          }
          else {    //(!optionSelected)
            optionImage.classList.remove(classNames.menuProduct.imageVisible);
          }
        }
      }
    }

    //update calculated price in the HTML (wpisanie przeliczonej ceny do elementu w HTML)
    price *= thisProduct.amountWidget.value;      //pomnożenie ceny przez ilość sztuk
    // update calculated price in the HTML
    thisProduct.priceSingle = price;
    thisProduct.dom.priceElem.innerHTML = price;  //wyświetlenie finałowej ceny (suma = wybrane dodatki i ilość sztuk)
  }

  addToCart() {                                   //metoda przekazuje całą instancję jako argument metody app.cart.add (w app.cart jest zapisania instancja klasy Cart)
    const thisProduct = this;

    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;
    thisProduct.price = thisProduct.data.price;

    //app.cart.add(thisProduct);      //add otrzymuje tylko odwołanie (referencję) do tej instancji (zakomentowane w module 9 filmik 1, 15:35)

    const event = new CustomEvent('add-to-cart', {    //CustomEvent to klasa która już istnieje w JS i jest wbudowana w przeglądarkę; argument konstruktora to nazwa eventu 'add-to-cart'
      bubbles: true,                                  //drugim argumentem konstruktora jest obiekt z zółtymi nawiasami {}, zawierający ustawienia tego eventu - chcmey aby bąbelkował i zawierał informację o produkcie dodanym do koszyka (pod kluczem product)
      detail: {
        product: thisProduct,                         //product to klucz, thisProduct to produkt, który został dodany do koszyka
      },
    });
    thisProduct.element.dispatchEvent(event);   //wywołanie eventu - dispatch(owanie), wybieramy element na którym ten event chcemy wywołać, czyli thisProduct.element (ponieważ jest to element DOM, możemy skorzystać z metod dostępnych dla wszystkich elementów DOM - dispatchEvenet) - jako argument ten metody podajemy event. Aby ten event cokolwiek spowodował, trzeba go nasłuchiwać w app.js : thisApp.productList.addEventListener('add-to-cart', function(event))
  }

  prepareCartProduct() {
    const thisProduct = this;
    const productSummary = {
      id: thisProduct.id,
      name: thisProduct.data.name,
      amount: thisProduct.amountWidget.value,
      priceSingle: thisProduct.priceSingle,
      price: thisProduct.priceSingle * thisProduct.amountWidget.value,
      params: thisProduct.prepareCartProductParams()
    };
    return productSummary;
  }

  prepareCartProductParams() {            //z modułu 8.4 (Opcje produktu)
    const thisProduct = this;
    const params = {};
    const formData = utils.serializeFormToObject(thisProduct.form);

    // for very category (param)
    for (let paramId in thisProduct.data.params) {
      const param = thisProduct.data.params[paramId];

      // create category param in params const eg. params = { ingredients: { name: 'Ingredients', options: {}}}
      params[paramId] = {
        label: param.label,
        options: {}
      };

      // for every option in this category
      for (let optionId in param.options) {
        const option = param.options[optionId];

        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
        if (optionSelected) {
          params[paramId].options[optionId] = option.label;
        }
      }
    }
    return params;
    // console.log(params);

  }
}

export default Product;
