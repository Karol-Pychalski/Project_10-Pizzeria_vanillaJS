import {select} from '../settings.js';
import utils from '../utils.js';

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
      thisWidget.announce();            //czy to jest właściwe miejsce i konstrukcja?
    }

    thisWidget.value = newValue;
    thisWidget.input.value = newValue;
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
    const event = new CustomEvent('updated', {
      bubbles: true                                 //bąblekowanie (po kliknięciu przekazuje ten event wyżej w hierarchi DOM)
    });

    thisWidget.element.dispatchEvent(event);
  }
}

export default AmountWidget;