let products = document.querySelectorAll('.product')
let cart = document.querySelector('.cart__products')
let menuCart = document.querySelector('.cart')
let cloneNode
let isAdding = false;
let showListBtns = document.querySelectorAll('.products__list-btn')
let favorites = document.querySelectorAll('.product-favorite')
let imgProducts = document.querySelectorAll('.product__image')
let cartData
let addToCartButtons = document.querySelectorAll('.product__add');
const cartImg = document.querySelector('.cart__img')
let cartClean = document.querySelector('.cart__allClean')
let cartSum = document.querySelector('.cart__sum')
let productPrices = document.querySelectorAll('.product-price')


favorites.forEach(favorite => {
    favorite.addEventListener('click', () => {
        favorite.classList.toggle('red')
    })

})

imgProducts.forEach(imgProduct => {
    imgProduct = imgProduct.addEventListener('click', () => console.log('модальное окно с картинкой'))

})

showListBtns.forEach(btn => {
    btn.addEventListener('click', showList);

    function showList(event) {
        let target = event.currentTarget;
        let productList = target.nextElementSibling;

        productList.classList.toggle('show');
        btn.classList.toggle('icon');
    }
});

cartImg.addEventListener('click', () => {
    console.log('переход на страницу оплаты')
})

products.forEach(product => {
    const decBtn = product.querySelector('.product__quantity-control_dec')
    const incBtn = product.querySelector('.product__quantity-control_inc')
    const quantity = product.querySelector('.product__quantity-value')
    const addButton = product.querySelector('.product__add')

    decBtn.addEventListener('click', () => {
        let currentQuantity = parseInt(quantity.textContent);
        if (currentQuantity > 1) {
            currentQuantity--
            quantity.textContent = currentQuantity
        }
    })

    incBtn.addEventListener('click', () => {
        let currentQuantity = parseInt(quantity.textContent)
        if (currentQuantity > 0) {
            currentQuantity++
            quantity.textContent = currentQuantity
        }
    })

    function saveCartData() {
        const cartProducts = Array.from(cart.querySelectorAll('.cart__product'));
        const cartData = {
            products: cartProducts.map(cartProduct => {
                const productId = cartProduct.dataset.id;
                const productCount = cartProduct.querySelector('.cart__product-count').textContent;
                return { id: productId, count: productCount };
            })
        };
        localStorage.setItem('cart', JSON.stringify(cartData));
        calculateCartSum()
    }

    function showCartData() {
        const cartData = JSON.parse(localStorage.getItem('cart')) || { products: [] };
        cart.innerHTML = ''; // Очищаем содержимое корзины

        menuCart.classList.toggle('display-none', cartData.products.length < 1);

        cartData.products.forEach(cartProduct => {
            const { id, count } = cartProduct;
            const product = document.querySelector(`.product[data-id="${id}"]`);

            if (product) {
                const productImage = product.querySelector('.product__image');

                const cartProductElement = document.createElement('div');
                cartProductElement.classList.add('cart__product');
                cartProductElement.dataset.id = id;
                cartProductElement.dataset.price = product.dataset.price;


                cartProductElement.innerHTML = `
                    <img class="cart__product-image" src="${productImage.src}">
                    <div class="cart__product-count">${count}</div>
                    <div class="cart__product-remove">&#10006;</div>
                    <div class="cart__product-control">
                        <div class="cart__product-control-inc">&#43;</div>
                        <div class="cart__product-control-dec">&#8722;</div>
                    </div>
                `;

                cart.appendChild(cartProductElement);
            }
            calculateCartSum()
        });


        const incButtons = cart.querySelectorAll('.cart__product-control-inc');
        const decButtons = cart.querySelectorAll('.cart__product-control-dec');
        const removeButtons = cart.querySelectorAll('.cart__product-remove');

        incButtons.forEach(incButton => {
            incButton.addEventListener('click', () => {
                const productCountElement = incButton.parentElement.parentElement.querySelector('.cart__product-count');
                const currentCount = parseInt(productCountElement.textContent);
                productCountElement.textContent = currentCount + 1;
                saveCartData();
                calculateCartSum();
            });
        });

        decButtons.forEach(decButton => {
            decButton.addEventListener('click', () => {
                const productCountElement = decButton.parentElement.parentElement.querySelector('.cart__product-count');
                const currentCount = parseInt(productCountElement.textContent);
                if (currentCount > 1) {
                    productCountElement.textContent = currentCount - 1;
                    saveCartData();
                    calculateCartSum();
                }
            });
        });

        removeButtons.forEach(removeButton => {
            removeButton.addEventListener('click', () => {
                const cartProduct = removeButton.parentElement;
                cartProduct.remove();
                saveCartData();
                showCartData(); // Обновляем корзину после удаления элемента
                calculateCartSum();
            });
        });
    }

    showCartData();


    addButton.addEventListener('mousedown', () => {
        if (!isAdding) {
            isAdding = true
            let currentQuantity = parseInt(quantity.textContent)
            cloneNode = product.cloneNode(true)
            let productImage = cloneNode.querySelector('.product__image')
            let productCount = cloneNode.querySelector('.product__quantity-value').textContent
            let cartProduct = document.createElement('div')
            cartProduct.classList.add('cart__product')
            cartProduct.dataset.id = product.dataset.id
            cartProduct.dataset.price = product.dataset.price
            cartProduct.innerHTML = `
            <img class="cart__product-image" src="${productImage.src}">
            <div class="cart__product-count">${productCount}</div>
            <div class="cart__product-remove">&#10006;</div>
            <div class="cart__product-control">
                <div class="cart__product-control-inc">&#43;</div>
                <div class="cart__product-control-dec">&#8722;</div>
            </div>
        `

            let cartProductExists = cart.querySelector(`[data-id="${product.dataset.id}"]`)
            if (cartProductExists) {
                let cartProductCount = cartProductExists.querySelector('.cart__product-count')
                let currentCount = parseInt(cartProductCount.textContent)
                cartProductCount.textContent = currentCount + currentQuantity
            }
            else {
                setTimeout(() => {
                    cart.appendChild(cartProduct)
                    saveCartData()
                    calculateCartSum()
                }, 300);
                calculateCartSum()
            }

            setTimeout(() => {
                if (cart.querySelectorAll('.cart__product').length > 0) {
                    menuCart.classList.remove('display-none')
                }
                saveCartData();
                calculateCartSum();
            }, 500);

            let btnRemove = cartProduct.querySelector('.cart__product-remove')

            btnRemove.addEventListener('click', () => {
                cart.removeChild(cartProduct);
                if (menuCart) {
                    if (cart.querySelectorAll('.cart__product').length > 0) {
                        menuCart.classList.remove('display-none');
                    } else {
                        menuCart.classList.add('display-none');
                    }
                }
                saveCartData()
                calculateCartSum()
            });


            let cartProductDec = cartProduct.querySelector('.cart__product-control-dec')
            let cartProductInc = cartProduct.querySelector('.cart__product-control-inc')
            let currentCount = cartProduct.querySelector('.cart__product-count')

            cartProductInc.addEventListener('click', () => {
                currentCount.textContent++
                saveCartData()
                calculateCartSum()
            })

            cartProductDec.addEventListener('click', () => {
                if (currentCount.textContent > 1) {
                    currentCount.textContent--
                    saveCartData()
                    calculateCartSum()
                }
            })

            const image = product.querySelector('.product__image')
            const startingPointProduct = image.getBoundingClientRect()
            const finishPointCartImage = cartImg.getBoundingClientRect()


            // добавить смещение страницы к координатам начальной точки
            const startingPoint = {
                top: startingPointProduct.top + window.pageYOffset,
                left: startingPointProduct.left
            }

            // добавить смещение страницы к координатам конечной точки
            const finishPoint = {
                top: finishPointCartImage.top + window.pageYOffset,
                left: finishPointCartImage.left
            }

            const deltaX = finishPoint.left - startingPoint.left
            const deltaY = finishPoint.top - startingPoint.top
            const steps = 30
            const stepX = deltaX / steps
            const stepY = deltaY / steps

            cloneNode = image.cloneNode(true)
            cloneNode.style.position = 'absolute'
            cloneNode.style.top = startingPoint.top + 'px'
            cloneNode.style.left = startingPoint.left + 'px'
            cart.appendChild(cloneNode)

            let currentStep = 0
            const intervalId = setInterval(() => {
                if (currentStep < steps) {
                    currentStep++
                    const newX = startingPoint.left + (currentStep * stepX)
                    const newY = startingPoint.top + (currentStep * stepY)
                    cloneNode.style.top = newY + 'px'
                    cloneNode.style.left = newX + 'px'
                } else {
                    clearInterval(intervalId)
                    cloneNode.remove()
                }
            }, 20)


            setTimeout(() => {
                isAdding = false;
                saveCartData()
                calculateCartSum();
            }, 700); //необходимо, чтобы при быстром нажатии товар не добавлялся 2 раза в корзину и картинка не зависала по пути
        }

    })

    function calculateCartSum() {
        let totalSum = 0;
        const cartProducts = cart.querySelectorAll('.cart__product');

        cartProducts.forEach(cartProduct => {
            const count = parseInt(cartProduct.querySelector('.cart__product-count').textContent);
            const price = parseFloat(cartProduct.dataset.price);
            totalSum += count * price;
        });

        cartSum.textContent = totalSum.toFixed(2); // Округляем до двух знаков после запятой
    }
    calculateCartSum()

    cartClean.addEventListener('click', () => {
        // Очистка корзины
        cart.innerHTML = '';
        // Очистка локального хранилища
        localStorage.removeItem('cart');
        // Скрытие корзины
        menuCart.classList.add('display-none');
        calculateCartSum();
    });
})
