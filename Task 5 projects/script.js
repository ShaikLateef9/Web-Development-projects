// Sample product data
const products = [
  {
    id: 1,
    name: "Apple",
    price: 120,
    category: "Electronics",
    rating: 4.5,
    image: "https://m.media-amazon.com/images/I/71TwqIMg7YL._AC_UF1000,1000_QL80_.jpg"
    },
  {
    id: 2,
    name: "Cotton T-Shirt",
    price: 25,
    category: "Clothing",
    rating: 4.1,
    image: "https://assets.ajio.com/medias/sys_master/root/20231214/B6fn/657ad716afa4cf41f5cff1e6/-473Wx593H-463872857-white-MODEL.jpg"
  },
  {
    id: 3,
    name: "Electric Kettle",
    price: 40,
    category: "Home",
    rating: 4.3,
    image: "https://www.rasoishop.com/cdn/shop/files/8901309227735-9.jpg?v=1701447072"
  },
  {
    id: 4,
    name: "Bluetooth Speaker",
    price: 60,
    category: "Electronics",
    rating: 4.7,
    image: "https://pyxis.nymag.com/v1/imgs/b7e/35e/d2257113659f8ec67dccfadac2a4c0c001.rsquare.w600.jpg"
  },
  {
    id: 5,
    name: "Jeans",
    price: 55,
    category: "Clothing",
    rating: 4.2,
    image: "https://tigc.in/cdn/shop/files/compress_0222-fdnm03-1-azure__1.jpg?v=1720722743&width=1080-800.jpg"
  }
];

const productList = document.getElementById("productList");
const template = document.getElementById("productTemplate");
const searchInput = document.getElementById("searchInput");
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");
const sortSelect = document.getElementById("sortSelect");
const categoryFilters = document.querySelectorAll(".categoryFilter");
const cartCount = document.getElementById("cartCount");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderProducts(list) {
  productList.innerHTML = "";
  list.forEach(product => {
    const clone = template.content.cloneNode(true);
    clone.querySelector(".product-img").src = product.image;
    clone.querySelector(".product-name").textContent = product.name;
    clone.querySelector(".product-price").textContent = `$${product.price}`;
    clone.querySelector(".product-category").textContent = product.category;
    clone.querySelector(".add-to-cart").addEventListener("click", () => addToCart(product));
    productList.appendChild(clone);
  });
}

function addToCart(product) {
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  cartCount.textContent = cart.length;
}

function applyFilters() {
  let filtered = [...products];

  const searchTerm = searchInput.value.toLowerCase();
  if (searchTerm) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
  }

  const maxPrice = Number(priceRange.value);
  priceValue.textContent = maxPrice;
  filtered = filtered.filter(p => p.price <= maxPrice);

  const selectedCategories = Array.from(categoryFilters)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  if (selectedCategories.length) {
    filtered = filtered.filter(p => selectedCategories.includes(p.category));
  }

  switch (sortSelect.value) {
    case "priceLow":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "priceHigh":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "ratingHigh":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
  }

  renderProducts(filtered);
}

// Event listeners
searchInput.addEventListener("input", applyFilters);
priceRange.addEventListener("input", applyFilters);
categoryFilters.forEach(cb => cb.addEventListener("change", applyFilters));
sortSelect.addEventListener("change", applyFilters);

// Initial render
renderProducts(products);
updateCartCount();
priceValue.textContent = priceRange.value;
