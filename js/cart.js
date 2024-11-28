import { utils } from "./utils.js";
import products from "/src/products.json";

class Cart {
  constructor() {
    this.cartArray = utils.storage.get("cart") || [];
    this.groupedCart = this.groupCartItems(this.cartArray);

    this.elements = {
      cartItems: document.getElementById("cart-items"),
      price: {
        subTotal: document.getElementById("subtotal-price"),
        total: document.getElementById("total-price"),
        tax: document.getElementById("tax-price"),
      },
    };

    this.render();
    this.setupListeners();
  }

  createGroupKey(product) {
    return `${product.keyboardId}-${product.color}-${product.switch}-${product.layout}`;
  }

  groupCartItems(cartArray) {
    return cartArray.reduce((grouped, item) => {
      const groupKey = this.createGroupKey(item);
      if (!grouped[groupKey]) {
        grouped[groupKey] = {
          config: item,
          quantity: 1,
        };
      } else {
        grouped[groupKey].quantity++;
      }
      return grouped;
    }, {});
  }

  // TODO: Suggested products
  add(product) {
    this.cartArray.push(product);
    utils.storage.set("cart", this.cartArray);
    this.groupedCart = this.groupCartItems(this.cartArray);
    this.render();
  }

  remove(groupKey) {
    // Find index of first matching item to remove
    const itemToRemove = this.cartArray.find(
      (item) => this.createGroupKey(item) === groupKey,
    );

    if (itemToRemove) {
      const index = this.cartArray.findIndex(
        (item) => this.createGroupKey(item) === groupKey,
      );

      // Remove one instance from the array
      if (index !== -1) {
        this.cartArray.splice(index, 1);
        utils.storage.set("cart", this.cartArray);
        this.groupedCart = this.groupCartItems(this.cartArray);
        this.render();
      }
    }
  }

  removeAll(groupKey) {
    if (!confirm("Are you sure you want to remove all items?")) {
      return;
    }
    this.cartArray = this.cartArray.filter(
      (item) => this.createGroupKey(item) !== groupKey,
    );

    utils.storage.set("cart", this.cartArray);

    this.groupedCart = this.groupCartItems(this.cartArray);

    this.render();
  }

  updateQuantity(groupKey, newQuantity) {
    const currentQuantity = this.groupedCart[groupKey]?.quantity || 0;
    const difference = newQuantity - currentQuantity;

    if (difference > 0) {
      const itemTemplate = this.groupedCart[groupKey].config;
      for (let i = 0; i < difference; i++) {
        this.cartArray.push({ ...itemTemplate });
      }
    } else if (difference < 0) {
      let toRemove = -difference;
      let index = this.cartArray.length - 1;

      while (toRemove > 0 && index >= 0) {
        if (this.createGroupKey(this.cartArray[index]) === groupKey) {
          this.cartArray.splice(index, 1);
          toRemove--;
        }
        index--;
      }
    }

    utils.storage.set("cart", this.cartArray);
    this.groupedCart = this.groupCartItems(this.cartArray);
    this.render();
  }

  calculateTotals() {
    const subtotal = this.cartArray.reduce((acc, item) => {
      const productInfo = products.find((p) => p.id === item.keyboardId);
      return acc + (productInfo?.price || 0);
    }, 0);

    const tax = subtotal * 0.09;
    const total = subtotal + tax;

    return { subtotal, tax, total };
  }

  setupListeners() {
    this.elements.cartItems.addEventListener("click", (e) => {
      const cartItem = e.target.closest(".cart-item");
      if (!cartItem) return;

      const groupKey = cartItem.dataset.groupKey;

      if (e.target.classList.contains("remove")) {
        this.removeAll(groupKey);
      } else if (e.target.classList.contains("quantity-btn")) {
        const action = e.target.dataset.action;
        const currentQuantity = this.groupedCart[groupKey].quantity;

        if (action === "increase") {
          this.updateQuantity(groupKey, currentQuantity + 1);
        } else if (action === "decrease" && currentQuantity > 1) {
          this.updateQuantity(groupKey, currentQuantity - 1);
        }
      }
    });
  }

  renderCartItems() {
    if (this.cartArray.length === 0) {
      this.elements.cartItems.innerHTML = `
        <div class="empty-cart">
          <p>Your cart is empty</p>
          <a href="${utils.base_url}/products" class="button">Browse Products</a>
        </div>`;
      return;
    }

    this.elements.cartItems.innerHTML = Object.entries(this.groupedCart)
      .map(([groupKey, { config, quantity }]) => {
        const productInfo = products.find((p) => p.id === config.keyboardId);
        if (!productInfo) return "";

        return `
          <div class="cart-item gap-4 flex-col md:flex-row" data-group-key="${groupKey}">
            <img src="${config.image}" class="object-contain aspect-16-9" alt="${productInfo.name}">
            <div class="flex justify-between items-center w-full">
              <div class="flex flex-col gap-2">
                <h3 class="font-bold">${productInfo.name}</h3>
                <p>Color: ${config.color}</p>
                <p>Switch: ${config.switch}</p>
                <p>Layout: ${config.layout}</p>
                <p class="font-semibold">$${productInfo.price}</p>
              </div>
              <div class="flex flex-col items-end gap-2">
                <div class="quantity-controls flex items-center gap-2">
                  <button class="quantity-btn" data-action="decrease" 
                          ${quantity <= 1 ? "disabled" : ""}>-</button>
                  <span>${quantity}</span>
                  <button class="quantity-btn" data-action="increase">+</button>
                </div>
                <button class="remove text-red-500">Remove</button>
              </div>
            </div>
          </div>`;
      })
      .join("");
  }

  renderPrice() {
    const { subtotal, tax, total } = this.calculateTotals();

    this.elements.price.subTotal.textContent = `$${subtotal.toFixed(2)}`;
    this.elements.price.tax.textContent = `$${tax.toFixed(2)}`;
    this.elements.price.total.textContent = `$${total.toFixed(2)}`;
  }

  render() {
    this.renderCartItems();
    this.renderPrice();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Cart();
});
