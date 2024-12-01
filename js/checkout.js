import { utils } from "./utils.js";
import products from "../src/products.json";

class CheckoutForm {
  constructor() {
    this.form = document.getElementById("checkout-form");
    this.sections = document.querySelectorAll(".checkout-section");
    this.summaryEl = document.querySelector(".order-summary");
    // this is not a ctf. do not break this 😭
    this.cart = utils.storage.get("cart");

    this.state = {
      deliveryMethod: "deliver",
      shippingOption: "standard",
      paymentMethod: "card",
      loading: false,
    };

    this.init();
  }

  init() {
    if (!this.cart || this.cart.length === 0) {
      window.location = utils.base_url + "/cart";
    }
    this.setupDeliveryOptions();
    this.setupShippingOptions();
    this.setupPaymentOptions();
    this.setupFormValidation();
    this.setupPromoCode();
    this.handleFormSubmit();
    this.updateOrderSummary();
  }

  setupDeliveryOptions() {
    const deliveryOptions = document.querySelectorAll(".delivery-option");
    const shippingOptionsContainer =
      document.getElementById("shipping-options");
    const deliveryForm = document.querySelector(".delivery-form");

    deliveryOptions.forEach((option) => {
      option.addEventListener("click", () => {
        deliveryOptions.forEach((opt) => opt.classList.remove("active"));

        option.classList.add("active");

        const method = option.dataset.delivery;
        this.state.deliveryMethod = method;

        if (method === "deliver") {
          shippingOptionsContainer.style.display = "flex";
          deliveryForm.style.display = "block";
        } else {
          shippingOptionsContainer.style.display = "none";
          deliveryForm.style.display = "none";
        }

        this.updateOrderSummary();
      });
    });
  }

  setupShippingOptions() {
    const shippingOptions = document.querySelectorAll(".shipping-option");

    shippingOptions.forEach((option) => {
      option.addEventListener("click", () => {
        shippingOptions.forEach((opt) => opt.classList.remove("active"));
        option.classList.add("active");

        const price = option.querySelector(".option-price").textContent;
        this.updateOrderSummary({
          shipping: parseFloat(price.replace("$", "")),
        });
      });
    });
  }

  setupPaymentOptions() {
    const paymentOptions = document.querySelectorAll(".payment-option");
    const cardForm = document.getElementById("card-payment-form");

    paymentOptions.forEach((option) => {
      option.addEventListener("click", () => {
        paymentOptions.forEach((opt) => opt.classList.remove("active"));
        option.classList.add("active");

        const method = option.dataset.payment;
        this.state.paymentMethod = method;

        cardForm.style.display = method === "card" ? "block" : "none";
      });
    });
  }

  setupFormValidation() {
    const inputs = this.form.querySelectorAll("input[required]");

    inputs.forEach((input) => {
      input.addEventListener("blur", () => {
        this.validateInput(input);
      });
    });

    const cardNumber = document.getElementById("cardNumber");
    const expiration = document.getElementById("expiration");
    const cvv = document.getElementById("cvv");

    if (cardNumber) {
      cardNumber.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");
        // add spaces in between for 🔥 ui
        value = value.match(/.{1,4}/g)?.join(" ") || "";
        e.target.value = value.substring(0, 19);
      });
    }

    if (expiration) {
      expiration.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length >= 2) {
          // add /
          value = value.substring(0, 2) + "/" + value.substring(2);
        }
        e.target.value = value.substring(0, 5);
      });
    }

    if (cvv) {
      cvv.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/\D/g, "").substring(0, 3);
      });
    }
  }

  validateInput(input) {
    // TODO: backend validation if I had time but I don't it's currently 7pm
    const errorClass = "error";
    const errorMessage = input.nextElementSibling;

    if (!input.value.trim()) {
      input.classList.add(errorClass);
      if (!errorMessage?.classList.contains("error-message")) {
        const message = document.createElement("div");
        message.className = "error-message";
        message.textContent = "This field is required";
        input.parentNode.insertBefore(message, input.nextSibling);
      }
      return false;
    } else {
      input.classList.remove(errorClass);
      if (errorMessage?.classList.contains("error-message")) {
        errorMessage.remove();
      }
      return true;
    }
  }

  setupPromoCode() {
    const promoInput = document.querySelector(".promo-input");
    const promoButton = document.querySelector(".promo-button");

    promoButton?.addEventListener("click", () => {
      const code = promoInput.value.trim();
      if (code) {
        this.applyPromoCode(code);
      }
    });
  }

  async applyPromoCode(code) {
    try {
      this.setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 200));

      if (code.toUpperCase() === "BF10OFF") {
        this.updateOrderSummary({ discount: 10 });
        alert("Promo code applied successfully!");
      } else {
        alert("Invalid promo code");
      }
    } catch (error) {
      console.error("Error applying promo code:", error);
      alert("Failed to apply promo code. Please try again.");
    } finally {
      this.setLoading(false);
    }
  }

  updateOrderSummary({ shipping = 5.99, discount = 0 } = {}) {
    const subtotal = this.cart.reduce((acc, item) => {
      const productInfo = products.find((p) => p.id === item.keyboardId);
      return acc + (productInfo?.price || 0);
    }, 0);

    const tax = (subtotal - discount) * 0.09;
    const total = subtotal + shipping + tax - discount;

    const elements = {
      subtotal: document.querySelector('[data-summary="subtotal"]'),
      shipping: document.querySelector('[data-summary="shipping"]'),
      tax: document.querySelector('[data-summary="tax"]'),
      discount: document.querySelector('[data-summary="discount"]'),
      total: document.querySelector('[data-summary="total"]'),
    };

    if (elements.subtotal)
      elements.subtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (elements.shipping)
      elements.shipping.textContent = `$${shipping.toFixed(2)}`;
    if (elements.tax) elements.tax.textContent = `$${tax.toFixed(2)}`;
    if (elements.total) elements.total.textContent = `$${total.toFixed(2)}`;

    if (discount > 0) {
      if (!elements.discount) {
        const discountLine = document.createElement("div");
        discountLine.className = "summary-line";
        discountLine.innerHTML = `
                    <span>Discount</span>
                    <span class="amount" data-summary="discount">-$${discount.toFixed(2)}</span>
                `;
        this.summaryEl
          .querySelector(".summary-content")
          .insertBefore(discountLine, this.summaryEl.querySelector(".total"));
      } else {
        elements.discount.textContent = `-$${discount.toFixed(2)}`;
      }
    }
  }

  setLoading(loading) {
    this.state.loading = loading;
    const button = document.querySelector(".place-order-button");

    if (loading) {
      this.form.classList.add("loading");
      button.disabled = true;
      button.innerHTML = '<span class="loading-spinner"></span> Processing...';
    } else {
      this.form.classList.remove("loading");
      button.disabled = false;
      button.textContent = "Place order";
    }
  }

  handleFormSubmit() {
    this.form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const requiredInputs = this.form.querySelectorAll("input[required]");
      let isValid = true;

      requiredInputs.forEach((input) => {
        if (!this.validateInput(input)) {
          isValid = false;
        }
      });

      if (!isValid) {
        alert("Please fill in all required fields");
        return;
      }

      const formData = new FormData(this.form);
      const orderData = {
        contact: {
          email: formData.get("email"),
          phone: formData.get("phone"),
          receiveUpdates: formData.get("receiveUpdates") === "on",
        },
        delivery: {
          method: this.state.deliveryMethod,
          option: this.state.shippingOption,
          address: {
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            address1: formData.get("address1"),
            address2: formData.get("address2"),
            city: formData.get("city"),
            state: formData.get("state"),
            zipCode: formData.get("zipCode"),
          },
        },
        payment: {
          method: this.state.paymentMethod,
          card:
            this.state.paymentMethod === "card"
              ? {
                  number: formData.get("cardNumber")?.replace(/\s/g, ""),
                  expiration: formData.get("expiration"),
                  cvv: formData.get("cvv"),
                }
              : null,
        },
      };

      try {
        this.setLoading(true);

        const status = await this.processOrder(orderData);

        if (status.success) {
          this.cart = [];
          utils.storage.set("cart", this.cart);
          document.querySelector(".checkout-container").innerHTML = `
                        <div class="flex flex-col">
                            <h2 class="text-2xl font-bold">Order placed #${status.orderId}</h2>
                            <p>We have received your order, you should have received an email regarding your order.</p>
                        </div>
                    `;
        }
      } catch (error) {
        console.error("Error processing order:", error);
        alert("Failed to process order. Please try again.");
      } finally {
        this.setLoading(false);
      }
    });
  }

  async processOrder(orderData) {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // simulate api call to backend

    if (!this.validateOrderData(orderData)) {
      throw new Error("Invalid order data");
    }

    return {
      success: true,
      orderId: "ORD" + Math.floor(Math.random() * (1000 + 1)).toString(),
    };
  }

  validateOrderData(orderData) {
    if (!orderData.contact.email || !orderData.contact.phone) {
      return false;
    }

    if (orderData.delivery.method === "deliver") {
      const { address } = orderData.delivery;
      if (
        !address.firstName ||
        !address.lastName ||
        !address.address1 ||
        !address.city ||
        !address.state ||
        !address.zipCode
      ) {
        return false;
      }
    }

    if (orderData.payment.method === "card") {
      const { card } = orderData.payment;
      if (!card.number || !card.expiration || !card.cvv) {
        return false;
      }

      if (
        card.number.length !== 16 ||
        !card.expiration.match(/^\d{2}\/\d{2}$/) ||
        !card.cvv.match(/^\d{3}$/)
      ) {
        return false;
      }
    }

    return true;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new CheckoutForm();
});
