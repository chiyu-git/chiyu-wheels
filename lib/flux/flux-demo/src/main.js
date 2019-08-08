import store from './store/index.js'; 

import List from './components/list.js';
import Count from './components/count.js';
import Status from './components/status.js';

const listInstance = new List();
const countInstance = new Count();
const statusInstance = new Status();

countInstance.render();
listInstance.render();
statusInstance.render();

const formElement = document.querySelector('.js-form');
const inputElement = document.querySelector('#new-item-field');

formElement.addEventListener('submit', e => {
  e.preventDefault();

  let value = inputElement.value.trim();

  if(value.length) {
    store.dispatch('addItem', value);
    inputElement.value = '';
    inputElement.focus();
  }
});



