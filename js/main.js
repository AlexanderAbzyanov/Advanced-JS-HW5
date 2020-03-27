const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

// Создание экземпляра Vue
const app = new Vue({
// Определение элемента разметки, где будут отображаться элементы созданного экземпляра app
  el: '#app',
// Определение основных данных app  
  data: {
    userSearch: '',
    showCart: false,
    products: [],
    cartItems: [],
    filtered: [],
    imgCatalog: 'https://placehold.it/200x150',
    imgCart: 'https://placehold.it/50x100',
  },
// Определение методов (функций) app
  methods: {
// Определение метода создания запроса данных на сервере    
    getJson(url){
      return fetch(url)
        .then(result => result.json())
        .catch(error => {
          console.log(error);
        })
    },
// Определение метода добавления продукта (товара) в корзину    
    addProduct(product){
      this.getJson(`${API}/addToBasket.json`)
                .then(data => {
                    if (data.result === 1) {
                        let find = this.cartItems.find(el => el.id_product === product.id_product);
                        if (find) {
                            find.quantity++;
                        } else {
                            let prod = Object.assign({
                                quantity: 1
                            }, product);
                            this.cartItems.push(prod)
                        }
                    } else {
                        alert('Error');
                    }
                })
    },
  // Определение метода удаления продукта (товара) из корзины
    remove(item) {
      this.getJson(`${API}/deleteFromBasket.json`)
          .then(data => {
              if (data.result === 1) {
                  if (item.quantity > 1) {
                      item.quantity--;
                  } else {
                      this.cartItems.splice(this.cartItems.indexOf(item), 1)
                  }
              }
          })
    },
// Определение метода поиска товара (фильтрации исходя из содержания поля поиска) 
    filter() {
      let regexp = new RegExp(this.userSearch, 'i');
      this.filtered = this.products.filter(el => regexp.test(el.product_name));
    },
  },
  // Определение методов, которые запускаются (вызываются) после построения страницы
  mounted(){
    // Здесь - описание метода запроса содержания корзины
    this.getJson(`${API}/getBasket.json`)
    .then(data => {
        for (let el of data.contents) {
            this.cartItems.push(el);
            this.filtered.push(el);
        }
    });
// Здесь - описание метода запроса содержания каталога 
    this.getJson(`${API}/catalogData.json`)
      .then(data => {
        for (let el of data) {
            this.products.push(el);
        }
    });
  }
});
