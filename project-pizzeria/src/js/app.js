import { settings, select, classNames } from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';
import Home from './components/Home.js';

const app = {
  initPages: function () {
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;  //przechowywane są kontenery podstron, które musimy wyszukać w DOM
    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = thisApp.pages[0].id;
    for (let page of thisApp.pages) {
      if (page.id == idFromHash) {
        pageMatchingHash = page.id;
        break;    //jeśli pierwsza znaleziona strona ma id pasujące do #, to pętla kończy działanie
      }
    }

    thisApp.activatePage(pageMatchingHash);

    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function (event) {
        const clickedElement = this;
        event.preventDefault();

        /* get page id from href attribute */
        const id = clickedElement.getAttribute('href').replace('#', '');

        //run thisApp.activatedPage with that id
        thisApp.activatePage(id);

        //change URL hash
        window.location.hash = '#/' + id;
      });
    }
  },

  activatePage: function (pageId) {
    const thisApp = this;

    // add class "active" to maching pages, remove from non-matching

    for (let page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }

    // add class "active" to maching links, remove from non-matching
    for (let link of thisApp.navLinks) {
      link.classList.toggle(classNames.nav.active,link.getAttribute('href') == '#' + pageId);
    }
  },
  initHome: function () {
    const thisApp = this;

    const element = document.querySelector(select.containerOf.home);
    thisApp.Home = new Home(element);
  },

  initMenu: function () {       //metoda app.initMenu wywoływana po app.initData (korzysta z przygotowanej wcześniej referencji do danych -> thisApp.data)
    const thisApp = this;       //zadanie tej metody: przejście po wszystkich obiektach produktów i utworzenie dla każdego z nich instancji klasy Product [s.41]

    for (let productData in thisApp.data.products) {    //pętla wykonuje wszystkie akcje z getEleent dla każdego produktu z menu (powtarza to wszystko dla każdego produktu)
      new Product(thisApp.data.products[productData].id,thisApp.data.products[productData]);
    }
  },

  initData: function () {      //metoda app.initData (zadanie: przygotowanie łatwego dostępu do danych [s.41]
    const thisApp = this;
    thisApp.data = {};         //było = dataSource; przypisanie referencji do dataSource (znajduje się tam obiekt Products ze strukturą produktów)
    const url = settings.db.url + '/' + settings.db.product;

    fetch(url)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        //save parsedResponse as this.App.data.products
        thisApp.data.products = parsedResponse;

        //execute initMenu method
        thisApp.initMenu();
      });
  },

  initCart: function () {
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);        //instancja klasy Cart

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function (event) {      //kiedy mamy już listę produktów (productList), możemy dodać event, który jest customowy, jego hanlderem jest anonimowa funkcja przyjmująca event, który wykorzystamy aby koszykowi przekazać info jaki produkt został do niego dodany
      app.cart.add(event.detail.product);                                       //event (przekazuje info jaki produkt został dodany) posiada obiekt detail w którym znajduje się product (detail jest wbudowane) -> detail.product pochodzi z Product.js
    });
  },
  initBooking: function () {
    const thisApp = this;

    const element = document.querySelector(select.containerOf.booking);
    thisApp.Booking = new Booking(element);
  },
  init: function () {
    const thisApp = this;
    thisApp.initPages();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking();
    thisApp.initHome();
  },
};

app.init();
