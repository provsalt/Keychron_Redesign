import products from "/src/products.json";
import { utils } from "./utils.js";
import * as Handlebars from "handlebars";

const params = new URLSearchParams(document.location.search);

let keyboard;
for (const product of products) {
  if (product.id === params.get("keyboard")) {
    keyboard = product;
    break;
  }
}

if (!keyboard) {
  document.querySelector("#main").innerHTML = `
        <div class="flex gap-4 flex-col">
            <h1 class="text-4xl font-bold">Error 418 I'm not a teapot </h1>
            <p>Sorry, you have to specify a keyboard that exists!</p>
        </div>
    `;
} else {
  const templating = {
    "%KEYBOARD%": keyboard.name,
  };

  document.title = `Keychron - Configure ${keyboard.name}`;

  for (const key in templating) {
    document.body.innerHTML = document.body.innerHTML.replace(
      new RegExp(key, "g"),
      templating[key],
    );
  }
  document.querySelector("#keyboard-image").src =
    utils.base_url + keyboard.image;

  const templateColour = Handlebars.compile(`
    <div class="flex gap-2 flex-col">
        <h1 class="text-2xl font-bold">Colour</h1>
        <div class="flex flex-col md:flex-row gap-4">
            
            {{#each keyboard.colours}}
                <div class="md:max-w-1/2">
                    <button class="colour-button feat-card mb-4" data-val="{{name}}">
                        <img src="${utils.base_url}{{image}}" alt="{{name}}">
                    </button>
                    
                    <p class="text-xl font-semibold">{{name}}</p>
                </div>
            {{/each}}
        </div>
    </div>
`);
  const templateSwitch = Handlebars.compile(`
    <div class="flex gap-2 flex-col">
        <h1 class="text-2xl font-bold">Switch</h1>
        <div class="flex flex-col md:flex-row gap-2">
            
            {{#each keyboard.switches}}
                    <button class="flex colour-button feat-card data-val="{{name}}">
                        <img class="md:max-w-1/2" src="${utils.base_url}{{image}}" alt="{{name}}">
                        <p class="text-xl flex-1 font-semibold">{{name}}</p>
                    </button>
            {{/each}}
        </div>
    </div>
`);

  document.querySelector("#colour-section").innerHTML = templateColour({
    keyboard: keyboard,
  });
  document.querySelector("#switch-section").innerHTML = templateSwitch({
    keyboard: keyboard,
  });
}
