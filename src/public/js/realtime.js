const socket = io();

const productForm = document.getElementById("productForm");
const deleteForm = document.getElementById("deleteForm");
const productList = document.getElementById("product-list");

productForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(productForm);
    const data = Object.fromEntries(formData);

    data.price = parseFloat(data.price);
    data.stock = parseInt(data.stock);
    data.status = data.status === "true";
    if (data.thumbnails) {
        data.thumbnails = data.thumbnails.split(",").map(s => s.trim());
    } else {
        data.thumbnails = [];
    }

    socket.emit("newProduct", data);
    productForm.reset();
});

deleteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = parseInt(deleteForm.id.value);
    socket.emit("deleteProduct", id);
    deleteForm.reset();
});

socket.on("productsUpdated", (products) => {
    productList.innerHTML = "";
    products.forEach((p) => {
        const li = document.createElement("li");
        li.textContent = `${p.title} — $${p.price}`;
        productList.appendChild(li);
    });
});
