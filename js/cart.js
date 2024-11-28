import { utils } from "./utils.js";
import products from "/src/products.json";

class Cart {
  cart = [];
  elements = {
    cartItems: document.getElementById("cart-items"),
    price: {
      subTotal: document.getElementById("subtotal-price"),
      total: document.getElementById("total-price"),
      tax: document.getElementById("tax-price"),
    },
  };
  constructor() {
    this.cart = utils.storage.get("cart") || [];
    this.render();
  }

  add(product) {
    this.cart.push(product);
    this.render();
  }

  remove(product) {
    this.cart = this.cart.filter((p) => p.id !== product.id);
    this.render();
  }

  get total() {
    return this.cart.reduce((acc, p) => acc + p.price, 0);
  }

  render() {
    this.renderCartItems();
    this.renderPrice();
  }

  renderCartItems() {
    if (this.cart.length === 0) {
      this.elements.cartItems.innerHTML = "<p>Your cart is empty</p>";
      return;
    }
    this.elements.cartItems.innerHTML = this.cart
      .map((product) => {
        const productInfo = products.find((p) => p.id === product.keyboardId);
        console.log(productInfo);
        if (!productInfo) return "";
        return `
                <div class="cart-item gap-4">
                    <img src="${utils.base_url}/${productInfo.image}" alt="${productInfo.name}">
                    <div class="flex justify-between items-center w-full">
                        <div>
                            <h3>${productInfo.name}</h3>
                            <p>${product.color}</p>
                            <p>${product.switch}</p>
                            <p>${product.layout}</p>
                            <p>$${productInfo.price}</p>
                        </div>
                        <div>
                            <button class="remove border-none">Remove</button>
                        </div>
                    </div>
                </div>
            `;
      })
      .join("");
  }

  renderPrice() {}
}

document.addEventListener("DOMContentLoaded", () => {
  new Cart();
});
