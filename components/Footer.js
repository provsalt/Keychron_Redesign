import { utils } from "../js/utils.js";

const footer = `
    <footer class="flex flex-col p-4 md:p-8 md:px-16 shadow-md mt-4 gap-6" style="background: rgba(0, 0, 0, 0.05)">
        <div class="flex flex-col md:flex-row justify-between gap-6">
            <section class="flex flex-col gap-4 md:max-w-35dvw">
            <h2 class="text-2xl font-bold">Keychron</h2>
            <p class="text-wrap">Keychron designs and produces custom and wireless productive and premium computer peripherals.</p>
            <ul class="flex">
                <li>
                    <a href="#">
                        <img alt="YouTube" src="${utils.base_url}/icons/YouTube.svg" />
                    </a>
                </li>
                <li>
                    <a href="#">
                        <img alt="Instagram" src="${utils.base_url}/icons/Instagram.svg" />
                    </a>
                </li>
                <li>
                    <a href="#">
                        <img alt="X (formally Twitter)" src="${utils.base_url}/icons/X.svg" />
                    </a>
                </li>
                <li>
                    <a href="#">
                        <img alt="Discord" src="${utils.base_url}/icons/Discord.svg" />
                    </a>
                </li>
            </ul>
        </section>
        <section class="flex flex-col text-nowrap">
            <h2 class="text-xl font-bold mb-4">Quick Links</h2>
                <ul class="flex flex-col gap-6 md:gap-2">
                    <li>
                        <a class="underline" href="https://usevia.app/">Keychron Launcher</a>
                    </li>
                    <li>
                        <a class="underline" href="${utils.base_url}/about">About Us</a>
                    </li>
                    <li>
                        <a class="underline" href="${utils.base_url}/about#contact">Contact Us</a>
                    </li>
                    <li>
                        <a class="underline" href="${utils.base_url}/store/gift-card">Gift Cards</a>
                    </li>
                </ul>
        </section>
        <section class="flex flex-col text-nowrap">
            <h2 class="text-xl font-bold mb-4">Help & Support</h2>
            <ul class="flex flex-col gap-6 md:gap-2">
                <li>
                    <a class="underline" href="${utils.base_url}/manual">User Manual</a>
                </li>
                <li>
                    <a class="underline" href="${utils.base_url}/firmware">Firmwares</a>
                </li>
                <li>
                    <a class="underline" href="${utils.base_url}/help">Help Center</a>
                </li>
                <li>
                    <a class="underline" href="${utils.base_url}/policies#privacy">Privacy Policy</a>
                </li>
                <li>
                    <a class="underline" href="${utils.base_url}/policies#refund">Refund policy</a>
                </li>
                <li>
                    <a class="underline" href="${utils.base_url}/policies#terms">Terms of Service</a>
                </li>
            </ul>
        </section>
            <section class="flex flex-col gap-4">
                <h2 class="text-xl font-bold">Newsletter</h2>
                <p>Sign up for exclusive offers, original stories, events and more.</p>
                <form class="flex flex-col gap-2">
                    <label for="newsletter-email">Your email</label>
                    <div class="flex w-full border border-2 border-grey-900 text-gray-900"> 
                        <input type="email" id="newsletter-email" placeholder="eg: me@raymond.moe" class="w-full p-2" style="border: 0;" required />
                        <button type="submit" aria-label="Subscribe to newsletter" style="border: 0;">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 text-gray-900">
      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
    
    
                        </button>
                    </div>
                </form>
            </section>
        </div>
        <section>
            <hr style="display: block;height: 1px;border: 0;border-top: 1px solid #000000;margin: 0.5rem 0;padding: 0;"/>
            <p>© 2024 Keychron | Mechanical Keyboards for Mac, Windows and Android</p>
        </section>
    </footer>
`;

class Footer extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = footer;
  }
}

customElements.define("footer-component", Footer);
