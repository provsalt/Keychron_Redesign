import products from "/src/products.json";

const params = new URLSearchParams(document.location.search);

let keyboard;
for (const product of products) {
  if (product.id === params.get("keyboard")) {
    keyboard = product;
    break;
  }
}

if (!keyboard) {
  document.getElementById("main").innerHTML = `
        <div class="flex gap-4 flex-col">
            <h1 class="text-4xl font-bold">Error 418 I'm not a teapot </h1>
            <p>Sorry, you have to specify a keyboard that exists!</p>
        </div>
    `;
}

const templating = {
  "%KEYBOARD%": params.get("keyboard"),
};
