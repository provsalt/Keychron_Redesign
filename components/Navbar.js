import { utils } from "../js/utils.js";

const nav = `
  <style>
    #brand {
        font-size: 1.25rem;
        font-weight: bold;
    }
    nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .mid {
        display: flex;
        gap: 1.5rem;
    }
    
    #icons {
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }
    
    .icon {
        width: 2rem;
        height 2rem;
    }
    
    a {
        text-decoration: none;
        color: black;
    }
  </style>
  <nav>
    <p id="brand"><a href="${utils.base_url}">Keychron</a></p>
    <div class="mid">
        <a href="${utils.base_url}/products">Products</a>
        <a href="${utils.base_url}/about">About</a>
    </div>
    <div id="icons">
      <a class="icon" href="${utils.base_url}/cart">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
      </a>
      </a>
    </div>
  </nav>
`;
class Navbar extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    const template = document.createElement("template");
    template.innerHTML = nav;
    this.shadow.append(template.content.cloneNode(true));
  }
}

customElements.define("nav-bar", Navbar);
