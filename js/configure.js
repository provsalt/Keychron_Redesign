import products from "/src/products.json";
import { utils } from "./utils.js";

class KeyboardConfigurator {
  constructor() {
    this.state = {
      keyboard: null,
      selectedColor: null,
      selectedSwitch: null,
      selectedLayout: null,
      view: "2d",
    };

    // hard coded. sorry.
    this.layouts = [
      {
        name: "ANSI",
        image: "/layouts/ANSI.png",
        description: "Standard US layout",
      },
      {
        name: "ISO",
        image: "/layouts/ISO.png",
        description: "International Standard Layout",
      },
      {
        name: "JIS",
        image: "/layouts/ANSI.png",
        description: "Standard Japanese layout",
      },
    ];

    this.elements = {
      container: document.getElementById("container"),
      preview: document.getElementById("keyboard-preview"),
      keyboardName: document.getElementById("keyboard-name"),
      colorOptions: document.getElementById("color-options"),
      switchOptions: document.getElementById("switch-options"),
      layoutOptions: document.getElementById("layout-options"),
      configNav: document.querySelector(".config-nav"),
      addToCartButton: document.getElementById("add-to-cart"),
      viewControls: document.querySelector(".view-controls"),
    };

    this.init();
  }

  async init() {
    try {
      await this.loadKeyboardData();
      this.setupEventListeners();
      this.render();
    } catch (error) {
      console.error("Failed to initialize configurator:", error);
      this.showError("Failed to load keyboard configuration");
    }
  }

  async loadKeyboardData() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const keyboardId = urlParams.get("keyboard");

      const keyboard = products.find((p) => p.id === keyboardId);
      if (!keyboard) {
        throw new Error("Keyboard not found");
      }

      this.state.keyboard = keyboard;
      this.state.selectedColor = keyboard.colours?.[0]?.name || null;
      this.state.selectedSwitch = keyboard.switches?.[0]?.name || null;
      this.state.selectedLayout = this.layouts[0]?.name || null;

      // Set initial preview image
      this.updatePreviewImage();

      return keyboard;
    } catch (error) {
      console.error("Error loading keyboard data:", error);
      this.elements.container.innerHTML = `
        <div class="flex flex-col min-w-screen gap-2 items-center justify-center text-center">
            <h1 class="text-3xl font-black">418</h1>
            <p class="text-xl">I'm a teapot</p>
            <p>The requested keyboard is not in my domain of knowledge. See <a class="underline" href="https://www.rfc-editor.org/rfc/rfc2324#section-2.3.2">this</a></p>
        </div>
      `;
      throw error;
    }
  }

  setupEventListeners() {
    this.elements.configNav.addEventListener("click", (e) => {
      const button = e.target.closest(".config-nav-item");
      if (!button) return;

      const section = button.dataset.section;
      this.switchConfigSection(section);
    });

    this.elements.viewControls?.addEventListener("click", (e) => {
      const button = e.target.closest(".view-control");
      if (!button) return;

      const view = button.dataset.view;
      this.switchView(view);
    });

    this.elements.colorOptions.addEventListener("click", (e) => {
      const button = e.target.closest(".color-button");
      if (!button) return;

      const colorName = button.dataset.colorName;
      this.selectColor(colorName);
    });

    this.elements.switchOptions.addEventListener("click", (e) => {
      const button = e.target.closest(".switch-button");
      if (!button) return;

      const switchName = button.dataset.switchName;
      this.selectSwitch(switchName);
    });

    this.elements.layoutOptions.addEventListener("click", (e) => {
      const button = e.target.closest(".layout-button");
      if (!button) return;

      const layoutName = button.dataset.switchName;
      this.selectLayout(layoutName);
    });

    this.elements.addToCartButton.addEventListener("click", () => {
      this.addToCart().then();
    });
  }

  switchConfigSection(section) {
    // update navigation buttons
    const buttons =
      this.elements.configNav.querySelectorAll(".config-nav-item");
    buttons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.section === section);
    });

    // update panels
    const panels = document.querySelectorAll(".config-panel");
    panels.forEach((panel) => {
      panel.classList.toggle("active", panel.id === `${section}-panel`);
    });
  }

  switchView(view) {
    this.state.view = view;

    const buttons =
      this.elements.viewControls.querySelectorAll(".view-control");
    buttons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === view);
    });
    // TODO: Implement 3D view

    this.updatePreviewImage();
  }

  selectColor(colorName) {
    this.state.selectedColor = colorName;

    const buttons =
      this.elements.colorOptions.querySelectorAll(".color-button");
    buttons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.colorName === colorName);
    });

    this.updatePreviewImage();
  }

  selectSwitch(switchName) {
    this.state.selectedSwitch = switchName;

    const buttons =
      this.elements.switchOptions.querySelectorAll(".switch-button");
    buttons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.switchName === switchName);
    });
  }

  selectLayout(layoutNam) {
    this.state.selectedLayout = layoutNam;

    const buttons =
      this.elements.layoutOptions.querySelectorAll(".layout-button");
    buttons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.switchName === layoutNam);
    });
  }

  updatePreviewImage() {
    if (!this.state.keyboard) return;

    let imagePath = this.state.keyboard.image;
    if (this.state.selectedColor) {
      const colorOption = this.state.keyboard.colours?.find(
        (c) => c.name === this.state.selectedColor,
      );
      if (colorOption) {
        imagePath = colorOption.image;
      }
    }

    this.elements.preview.src = utils.base_url + imagePath;
  }

  async addToCart() {
    if (!this.validateConfiguration()) {
      return;
    }

    const cartItem = {
      keyboardId: this.state.keyboard.id,
      name: this.state.keyboard.name,
      color: this.state.selectedColor,
      switch: this.state.selectedSwitch,
      layout: this.state.selectedLayout,
      price: this.calculatePrice(),
    };

    try {
      const cart = JSON.parse(utils.storage.getItem("cart") || "[]");
      cart.push(cartItem);
      utils.storage.setItem("cart", JSON.stringify(cart));

      this.showSuccess("Added to cart successfully");
    } catch (error) {
      console.error("Error adding to cart:", error);
      this.showError("Failed to add to cart");
    }
  }

  validateConfiguration() {
    const requiredOptions = [
      { value: this.state.selectedColor, name: "color" },
      { value: this.state.selectedSwitch, name: "switch" },
    ];

    const missing = requiredOptions.filter((option) => !option.value);
    if (missing.length > 0) {
      this.showError(
        `Please select a ${missing[0].name} before adding to cart`,
      );
      return false;
    }

    return true;
  }

  calculatePrice() {
    let basePrice = this.state.keyboard.price || 0;

    // TODO: Future: Calculate price based on selected options
    return basePrice;
  }

  render() {
    if (!this.state.keyboard) return;

    this.elements.keyboardName.textContent = this.state.keyboard.name;

    if (this.state.keyboard.colours) {
      this.elements.colorOptions.innerHTML = this.state.keyboard.colours
        .map(
          (color) => `
                    <div class="color-option">
                        <button class="color-button ${this.state.selectedColor === color.name ? "active" : ""}" 
                                data-color-name="${color.name}">
                            <img class="color-preview" src="${utils.base_url}${color.image}" alt="${color.name}">
                            <span class="color-name">${color.name}</span>
                        </button>
                    </div>
                `,
        )
        .join("");
    }

    if (this.state.keyboard.switches) {
      this.elements.switchOptions.innerHTML = this.state.keyboard.switches
        .map(
          (switchOption) => `
            <div class="switch-option">
              <button class="switch-button ${this.state.selectedSwitch === switchOption.name ? "active" : ""}"
                data-switch-name="${switchOption.name}">
                <img class="switch-preview" src="${utils.base_url}${switchOption.image}" alt="${switchOption.name}">
                <div class="flex-1">
                    <span class="block mb-1">${switchOption.name}</span>
                    <span class="text-base text-sm">${switchOption.description || ""}</span>
                </div>
              </button>
            </div>
                `,
        )
        .join("");
    }

    this.elements.layoutOptions.innerHTML = this.layouts
      .map(
        (layout) => `
        <div class="layout-option">
          <button class="layout-button ${this.state.selectedLayout === layout.name ? "active" : ""}"
                                data-switch-name="${layout.name}">
            <img class="layout-preview" src="${utils.base_url}${layout.image}" alt="${layout.name}">
            <div class="flex-1">
              <span class="layout-name block mb-1">${layout.name}</span>
              <span class="text-base block text-sm">${layout.description}</span>
            </div>
          </button>
        </div>
    `,
      )
      .join("");
  }

  showError(message) {
    // TODO: Implementation of error toast/notification
    console.error(message);
  }

  showSuccess(message) {
    // TODO: Implementation of success toast/notification and redirect
    console.log(message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new KeyboardConfigurator();
});
