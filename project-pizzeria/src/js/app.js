import {settings, select} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
 
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
 
      thisApp.data = {};              //było = dataSource; przypisanie referencji do dataSource (znajduje się tam obiekt Products ze strukturą produktów)

      const url = settings.db.url + '/' + settings.db.product;

      fetch(url)
        .then(function(rawResponse){ 
          return rawResponse.json();
        })
        .then(function(parsedResponse){
            console.log('parsedResponse', parsedResponse);

            /*save parsedResponse as thisApp.data.products*/
            thisApp.data.products = parsedResponse;

            /* execute initMenu method */
            thisApp.initMenu();
        });

      console.log('thisApp.data', JSON.stringify(thisApp.data));
    },

    initCart: function(){
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);      //instancja klasy Cart

      thisApp.productList = document.querySelector(select.containerOf.menu);

      thisApp.productList.addEventListener('add-to-cart', function(event){      //kiedy mamy już listę produktów (productList), możemy dodać event, który jest customowy, jego hanlderem jest anonimowa funkcja przyjmująca event, który wykorzystamy aby koszykowi przekazać info jaki produkt został do niego dodany
        app.cart.add(event.detail.product);                                     //event (przekazuje info jaki produkt został dodany) posiada obiekt detail w którym znajduje się product (detail jest wbudowane) -> detail.product pochodzi z Product.js
      })
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
