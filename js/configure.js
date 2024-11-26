import products from "/src/products.json";
import { utils } from "./utils.js";

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

  const features = document.querySelector("#features");
}

document.querySelector("#colour-section");
