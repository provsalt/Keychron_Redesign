import { utils } from "./utils.js";
import products from "/src/products.json";

class ProductsPage {
  constructor() {
    this.products = [];
    this.filters = {
      layout: "all",
      price: {
        min: 0,
        max: Infinity,
      },
      features: [],
    };
    this.sortBy = "featured";

    // hack to bind to the correct this
    this.removeFilter = this.removeFilter.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
  }

  async init() {
    await this.fetchProducts();
    this.setupEventListeners();
    this.render();
  }

  async fetchProducts() {
    try {
      await new Promise((r) => setTimeout(r, 150));
      this.products = products;
      this.products.map((product) => {
        // easier maintainability
        product.image = utils.base_url + product.image;
      });
      this.render();
    } catch (error) {
      console.error("Error fetching products:", error);
      const productsGrid = document.getElementById("products-grid");
      if (productsGrid) {
        productsGrid.innerHTML = `
          <div class="error-state">
            <p>Failed to load products. Please try again later.</p>
            <button class="retry-button">Retry</button>
          </div>
        `;
        productsGrid
          .querySelector(".retry-button")
          ?.addEventListener("click", () => this.init());
      }
    }
  }

  setupEventListeners() {
    // filter
    document.querySelectorAll("[data-filter]").forEach((filter) => {
      filter.addEventListener("change", (e) => {
        const { filter: filterType } = e.target.dataset;

        if (filterType === "price") {
          const priceType = e.target.dataset.priceType;
          const value =
            e.target.value === ""
              ? priceType === "min"
                ? 0
                : Infinity
              : parseFloat(e.target.value);

          this.filters.price[priceType] = value;
        } else if (filterType === "features") {
          const feature = e.target.value;
          if (e.target.checked) {
            if (!this.filters.features.includes(feature)) {
              this.filters.features.push(feature);
            }
          } else {
            this.filters.features = this.filters.features.filter(
              (f) => f !== feature,
            );
          }
        } else {
          this.filters[filterType] = e.target.value;
        }

        this.render();
      });
    });

    // sorting
    document.getElementById("sort-select")?.addEventListener("change", (e) => {
      this.sortBy = e.target.value;
      this.render();
    });

    document
      .getElementById("active-filters")
      ?.addEventListener("click", (e) => {
        const filterTag = e.target.closest(".filter-tag");
        const removeButton = e.target.closest("button");
        if (filterTag && removeButton) {
          const filterType = filterTag.dataset.filterType;
          const filterValue = filterTag.dataset.filterValue;
          this.removeFilter(filterType, filterValue);
        }
      });
  }

  getFilteredProducts() {
    return this.products
      .filter((product) => {
        const layoutMatch =
          this.filters.layout === "all" ||
          product.layout === this.filters.layout;

        const minPrice = this.filters.price.min || 0;
        const maxPrice = this.filters.price.max || Infinity;
        const priceMatch =
          product.price >= minPrice && product.price <= maxPrice;

        // does the product have all the selected features?
        const featuresMatch =
          !this.filters.features.length ||
          this.filters.features.every((filtered) => {
            return product.features.some((feat) => {
              return feat.toLowerCase().includes(filtered.toLowerCase());
            });
          });

        return layoutMatch && priceMatch && featuresMatch;
      })
      .sort((a, b) => {
        switch (this.sortBy) {
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          case "name":
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
  }

  render() {
    const productsGrid = document.getElementById("products-grid");
    if (!productsGrid) return;

    const filteredProducts = this.getFilteredProducts();

    productsGrid.innerHTML = filteredProducts.length
      ? filteredProducts
          .map(
            (product) => `
        <product-card
          data-product-id="${product.id}"
          name="${product.name}"
          price="${product.price}"
          image="${product.image}"
          layout="${product.layout}"
          features='${JSON.stringify(product.features)}'
        ></product-card>
      `,
          )
          .join("")
      : `<div class="no-results">
        <p>No products match your filters.</p>
        <button class="reset-filters-button">Reset Filters</button>
      </div>`;

    document.getElementById("showing-count").innerHTML =
      filteredProducts.length;
    document.getElementById("total-count").innerHTML =
      this.products.length.toString();

    productsGrid
      .querySelector(".reset-filters-button")
      ?.addEventListener("click", () => {
        this.resetFilters();
      });

    this.renderActiveFilters();
  }

  renderActiveFilters() {
    const activeFiltersContainer = document.getElementById("active-filters");
    if (!activeFiltersContainer) return;

    const activeFilters = [];

    if (this.filters.layout !== "all") {
      activeFilters.push({
        type: "layout",
        value: this.filters.layout,
        label: `Layout: ${this.filters.layout}`,
      });
    }

    if (this.filters.price.min > 0 || this.filters.price.max < Infinity) {
      activeFilters.push({
        type: "price",
        value: "price",
        label: `Price: $${this.filters.price.min} - $${this.filters.price.max === Infinity ? "∞" : this.filters.price.max}`,
      });
    }

    this.filters.features.forEach((feature) => {
      activeFilters.push({
        type: "feature",
        value: feature,
        label: feature,
      });
    });

    activeFiltersContainer.innerHTML = activeFilters.length
      ? activeFilters
          .map(
            (filter) => `
        <span class="filter-tag" data-filter-type="${filter.type}" data-filter-value="${filter.value}">
          ${filter.label}
          <button type="button" aria-label="Remove ${filter.label} filter">&times;</button>
        </span>
      `,
          )
          .join("")
      : "";
  }

  removeFilter(type, value) {
    switch (type) {
      case "layout": {
        this.filters.layout = "all";
        const layoutSelect = document.querySelector('[data-filter="layout"]');
        if (layoutSelect) layoutSelect.value = "all";
        break;
      }
      case "price":
        this.filters.price = { min: 0, max: Infinity };
        document.querySelectorAll('[data-filter="price"]').forEach((input) => {
          input.value = "";
        });
        break;
      case "feature": {
        this.filters.features = this.filters.features.filter(
          (f) => f !== value,
        );
        const featureCheckbox = document.querySelector(
          `[data-filter="features"][value="${value}"]`,
        );
        if (featureCheckbox) featureCheckbox.checked = false;
        break;
      }
    }
    this.render();
  }

  resetFilters() {
    this.filters = {
      layout: "all",
      price: { min: 0, max: Infinity },
      features: [],
    };
    this.sortBy = "featured";

    document.querySelectorAll('[data-filter="layout"]').forEach((filter) => {
      filter.value = "all";
    });
    document.querySelectorAll('[data-filter="price"]').forEach((input) => {
      input.value = "";
    });
    document
      .querySelectorAll('[data-filter="features"]')
      .forEach((checkbox) => {
        checkbox.checked = false;
      });

    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) sortSelect.value = "featured";

    this.render();
  }
}

const productsPage = new ProductsPage();
export default productsPage;
