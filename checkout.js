
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartValue() {
  let totalQuantity = cart.reduce((sum, item) => sum + Number(item.quantity), 0);
  const cartValueEl = document.querySelector('.js-cart-value');
  if (cartValueEl) cartValueEl.innerHTML = totalQuantity;
}

updateCartValue();

            /*ADD TO CART*/

document.querySelectorAll('.add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const productName = button.dataset.productName;

    let matchingItem = cart.find(item => item.productName === productName);

    if (matchingItem) {
      matchingItem.quantity++;
    } else {
      let product = window.allProducts.find(p => p.name === productName);
      if (product) {
        cart.push({
          id: Date.now() + Math.random(), 
          productName: product.name,
          price: product.money || product.price, 
          img: product.img,
          delivery: product.delivery,
          quantity: 1
        });
      }
    }

    saveToStorage();
    updateCartValue();
    renderCartSummary();
  });
});

                  /* CART SUMMARY */
function renderCartSummary() {
  let html = '';

  cart.forEach((item) => {
    html += `
      <div class="cart-item-container" data-id="${item.id}">
        <div class="delivery-date">Delivery date: ${item.delivery || 'N/A'}</div>
        <div class="cart-item-details-grid">
          <img class="product-image" src="${item.img}">
          <div class="cart-item-details">
            <div class="product-name">${item.productName}</div>
            <div class="product-price">₹${item.price || 0}</div>
            <div class="product-quantity">
              <span>Quantity: <span class="quantity-label">${item.quantity}</span></span>
              <span class="update-quantity-link link-primary" data-id="${item.id}">Update</span>
              <span class="delete-quantity-link link-primary" data-id="${item.id}">Delete</span>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  if (cart.length > 0) {
    html += `
      <div class="cart-reset-container">
        <button class="reset-cart-button">Reset Cart</button>
      </div>
    `;
  }

  const summaryEl = document.querySelector('.js-order-summary');
  if (summaryEl) summaryEl.innerHTML = html;

  renderCartTotals();
  attachCartListeners();
}

                 /* TOTALS CALCULATION💖😒*/
function renderCartTotals() {
  let subtotal = 0;

  cart.forEach((item) => {
    let price = parseInt((item.price + "").replace(/[^\d]/g, "")) || 0;
    subtotal += price * item.quantity;
  });

  let tax = subtotal * 0.10;       
  let shipping = subtotal > 500 ? 0 : 50;
  let total = subtotal + tax + shipping;

  const totalsEl = document.querySelector('.js-cart-totals');
  if (totalsEl) {
    totalsEl.innerHTML = `
      <div class="cart-totals-row">Subtotal: ₹${subtotal.toLocaleString()}</div>
      <div class="cart-totals-row">Tax (10%): ₹${tax.toLocaleString()}</div>
      <div class="cart-totals-row">Shipping: ₹${shipping.toLocaleString()}</div>
      <div class="cart-totals-row cart-total">Total: ₹${total.toLocaleString()}</div>
    `;
  }
}

              /*DELETE, UPDATE, RESET*/
function attachCartListeners() {
                    /*delete 🤦‍♂️🤦‍♂️*/
  document.querySelectorAll('.delete-quantity-link').forEach((link) => {
    link.addEventListener('click', () => {
      const id = link.dataset.id;
      cart = cart.filter(item => item.id != id);
      saveToStorage();
      updateCartValue();
      renderCartSummary();
    });
  });

  /*update👍👍*/
  document.querySelectorAll('.update-quantity-link').forEach((link) => {
    link.addEventListener('click', () => {
      const id = link.dataset.id;
      let newQuantity = parseInt(prompt("Enter new quantity:", "1"));
      if (!isNaN(newQuantity) && newQuantity > 0) {
        cart.forEach((item) => {
          if (item.id == id) item.quantity = newQuantity;
        });
        saveToStorage();
        updateCartValue();
        renderCartSummary();
      }
    });
  });

  /*reset🤷‍♂️🤷‍♂️*/
  const resetBtn = document.querySelector('.reset-cart-button');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm("Are you sure you want to clear the entire cart?")) {
        cart = [];
        saveToStorage();
        updateCartValue();
        renderCartSummary();
      }
    });
  }
}

/*INIT ✌️✌️*/
renderCartSummary();
