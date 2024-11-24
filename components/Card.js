class Card extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const template = `
            <style>
                .card {
                    border: 1px solid #ccc;
                    border-radius: var(--radius-lg);
                    padding: 1rem;
                }
            </style>
            <slot name="styles"></slot>
            <div class="card">
                <slot></slot>
            </div>
        `;
    const templating = document.createElement("template");
    templating.innerHTML = template;
    this.shadowRoot.appendChild(templating.content.cloneNode(true));
  }
}

class ProductCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  // allow them to be updated
  static get observedAttributes() {
    return ["name", "price", "image", "features", "layout"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  get template() {
    const name = this.getAttribute("name");
    const price = this.getAttribute("price");
    const image = this.getAttribute("image");
    const features = JSON.parse(this.getAttribute("features") || "[]");
    const layout = this.getAttribute("layout");

    return `
      <style>
        :host {
          display: block;
          font-family: var(--font-primary);
        }
        .card {
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: var(--transition-normal);
          background: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .image-container {
          position: relative;
          padding-top: 56.25%; /* 16:9 Aspect Ratio */
          background: #f5f5f5;
          overflow: hidden;
        }
        .image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-normal);
        }
        .card:hover .image {
          transform: scale(1.05);
        }
        .content {
          padding: 1.5rem;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        .title {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
        }
        .price {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--primary);
        }
        .features {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .feature {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: #f5f5f5;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
        }
        .feature svg {
          width: 1rem;
          height: 1rem;
        }
        .actions {
          display: flex;
          gap: 1rem;
        }
        .button {
          flex: 1;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .primary {
          background: var(--primary);
          color: white;
        }
        .primary:hover {
          filter: brightness(1.1);
        }
        .secondary {
          background: #f5f5f5;
        }
        .secondary:hover {
          background: #ececec;
        }
        .layout-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 0.5rem;
          background: rgba(0, 0, 0, 0.75);
          color: white;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
        }
      </style>
      
      <div class="card">
        <div class="image-container">
          <img class="image" src="${image}" alt="${name}" loading="lazy">
          ${layout ? `<div class="layout-badge">${layout}</div>` : ""}
        </div>
        <div class="content">
          <div class="header">
            <h3 class="title">${name}</h3>
            <div class="price">$${price}</div>
          </div>
          <div class="features">
            ${features
              .map(
                (feature) => `
              <div class="feature">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                </svg>
                ${feature}
              </div>
            `,
              )
              .join("")}
          </div>
          <div class="actions">
            <button class="button secondary" onclick="this.getRootNode().host.dispatchEvent(new CustomEvent('learn-more'))">
              Learn More
            </button>
            <button class="button primary" onclick="this.getRootNode().host.dispatchEvent(new CustomEvent('configure'))">
              Configure
            </button>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    this.shadowRoot.innerHTML = this.template;
  }
}

customElements.define("card-component", Card);
customElements.define("product-card", ProductCard);
