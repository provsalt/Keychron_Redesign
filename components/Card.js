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

customElements.define("card-component", Card);
