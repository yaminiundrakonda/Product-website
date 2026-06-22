const grid = document.getElementById("grid");
const search = document.getElementById("search");
const sort = document.getElementById("sort");
const cartCount = document.getElementById("cartCount");
const modal = document.getElementById("modal");

let products = [];
let cart = 0;

/* Notification Permission */

if ("Notification" in window) {
    Notification.requestPermission();
}

/* Load Products */

async function loadProducts() {

    try {

        const res = await fetch(
            "https://dummyjson.com/products?limit=100"
        );

        if (!res.ok) {
            throw new Error("Failed to fetch");
        }

        const data = await res.json();

        products = data.products.map(p => ({
            id: p.id,
            name: p.title,
            category: p.category,
            price: p.price,
            rating: p.rating,
            image: p.thumbnail,
            description: p.description
        }));

        render(products);

    } catch (err) {

        grid.innerHTML = `
            <h2 style="text-align:center">
                Failed to load products.
            </h2>
        `;

        console.error(err);

    } finally {

        document
            .getElementById("loader")
            .classList.add("hide");
    }
}

/* Render Products */

function render(data) {

    grid.innerHTML = "";

    data.forEach(product => {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">

            <div class="card-content">

                <h3>${product.name}</h3>

                <p>${product.category}</p>

                <p class="price">$${product.price}</p>

                <button class="buy">
                    Buy Now
                </button>

                <button class="add">
                    Add To Cart
                </button>

            </div>
        `;

        card.querySelector(".buy").onclick = () =>
            openModal(product);

        card.querySelector(".add").onclick = () => {

            cart++;

            cartCount.textContent = cart;
        };

        grid.appendChild(card);
    });
}

/* Modal */

function openModal(product) {

    modal.style.display = "flex";

    document.getElementById("mImg").src =
        product.image;

    document.getElementById("mTitle").textContent =
        product.name;

    document.getElementById("mCat").textContent =
        product.category;

    document.getElementById("mDesc").textContent =
        product.description;

    document.getElementById("mPrice").textContent =
        "$" + product.price;

    document.getElementById("mRate").textContent =
        "⭐ " + product.rating;

    document.getElementById("buyNowModal").onclick =
        () => {

            if (
                "Notification" in window &&
                Notification.permission === "granted"
            ) {
                new Notification("Order Placed", {
                    body: `${product.name} purchased`
                });
            }

            alert("Purchase Successful!");
        };
}

/* Close Modal */

document.getElementById("close").onclick = () => {
    modal.style.display = "none";
};

modal.addEventListener("click", e => {

    if (e.target === modal) {
        modal.style.display = "none";
    }
});

/* Search */

search.addEventListener("input", () => {

    const value =
        search.value.toLowerCase();

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(value) ||
        p.category.toLowerCase().includes(value)
    );

    render(filtered);
});

/* Sort */

sort.addEventListener("change", () => {

    let arr = [...products];

    switch (sort.value) {

        case "name-asc":
            arr.sort((a,b)=>
                a.name.localeCompare(b.name));
            break;

        case "name-desc":
            arr.sort((a,b)=>
                b.name.localeCompare(a.name));
            break;

        case "price-low":
            arr.sort((a,b)=>
                a.price-b.price);
            break;

        case "price-high":
            arr.sort((a,b)=>
                b.price-a.price);
            break;

        case "rating":
            arr.sort((a,b)=>
                b.rating-a.rating);
            break;

        default:
            arr=[...products];
    }

    render(arr);
});

/* Start */

loadProducts();