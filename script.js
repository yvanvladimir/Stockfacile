const modal = document.getElementById("productModal");
const addButton = document.querySelector(".add-button");
const closeButton = document.getElementById("closeModal");
const cancelButton = document.getElementById("cancelButton");
const alertsButton = document.getElementById("alertsButton");
const alertsSection = document.getElementById("alertsSection");
const alertsList = document.getElementById("alertsList");
const productsSection = document.querySelector(".products-section");
const dashboardButton = document.getElementById("dashboardButton");
const sidebarAddButton = document.getElementById("sidebarAddButton");
const productsButton = document.getElementById("productsButton");
const searchProduct = document.getElementById("searchProduct");
const categoryFilter = document.getElementById("categoryFilter");
const statusFilter = document.getElementById("statusFilter");
const sortFilter = document.getElementById("sortFilter");
const noProductMessage = document.getElementById("noProductMessage");

const productName = document.getElementById("productName");
const productCategory = document.getElementById("productCategory");
const productQuantity = document.getElementById("productQuantity");
const productPrice = document.getElementById("productPrice");

let productBeingEdited = null;

function setActiveMenu(activeButton) {
    dashboardButton.classList.remove("active");
    productsButton.classList.remove("active");
    sidebarAddButton.classList.remove("active");
    alertsButton.classList.remove("active");

    activeButton.classList.add("active");
}

addButton.addEventListener("click", function () {
    modal.style.display = "flex";
});

sidebarAddButton.addEventListener("click", function (event) {
    event.preventDefault();

    setActiveMenu(sidebarAddButton);

    editingRow = null;

    productForm.reset();

    document.querySelector(".modal-header h2").textContent =
        "Ajouter un produit";

    document.querySelector(".save-button").textContent =
        "Ajouter le produit";

    modal.style.display = "flex";
});

closeButton.addEventListener("click", function () {
    modal.style.display = "none";
});

cancelButton.addEventListener("click", function () {
    modal.style.display = "none";
});

const productForm = document.getElementById("productForm");
const productTableBody = document.getElementById("productTableBody");
let editingRow = null;

productForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("productName").value;
    const category = document.getElementById("productCategory").value;
    const quantity = Number(document.getElementById("productQuantity").value);
    const price = Number(document.getElementById("productPrice").value);

    let statusText;
    let statusClass;

    if (quantity === 0) {
        statusText = "Rupture";
        statusClass = "out";
    } else if (quantity <= 5) {
        statusText = "Stock faible";
        statusClass = "low";
    } else {
        statusText = "En stock";
        statusClass = "available";
    }

    if (editingRow) {

    editingRow.innerHTML = `
        <td>${name}</td>
        <td>${category}</td>
        <td>${quantity}</td>
        <td>${price.toLocaleString("fr-FR")} FCFA</td>
        <td>
            <span class="status ${statusClass}">
                ${statusText}
            </span>
        </td>
        <td class="action-buttons">
            <button class="edit-button">✏️ Modifier</button>
            <button class="delete-button">🗑️ Supprimer</button>
        </td>
    `;

    editingRow = null;

} else {

    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td>${name}</td>
        <td>${category}</td>
        <td>${quantity}</td>
        <td>${price.toLocaleString("fr-FR")} FCFA</td>
        <td>
            <span class="status ${statusClass}">
                ${statusText}
            </span>
        </td>
        <td class="action-buttons">
            <button class="edit-button">✏️ Modifier</button>
            <button class="delete-button">🗑️ Supprimer</button>
        </td>
    `;

    productTableBody.appendChild(newRow);
}

updateDashboard();
saveProducts();

    productForm.reset();

    modal.style.display = "none";
    document.querySelector(".modal-header h2").textContent =
    "Ajouter un produit";

document.querySelector(".save-button").textContent =
    "Ajouter le produit";
});

function updateDashboard() {

    const rows = productTableBody.querySelectorAll("tr");

    let totalProducts = rows.length;
    let lowStock = 0;
    let outOfStock = 0;
    let stockValue = 0;

    rows.forEach(function (row) {

        const cells = row.querySelectorAll("td");

        const quantity = Number(cells[2].textContent);

        const priceText = cells[3].textContent
            .replace("FCFA", "")
            .replace(/\s/g, "");

        const price = Number(priceText);

        stockValue += quantity * price;

        if (quantity === 0) {
            outOfStock++;
        } else if (quantity <= 5) {
            lowStock++;
        }

    });

    document.getElementById("totalProducts").textContent = totalProducts;
    document.getElementById("lowStock").textContent = lowStock;
    document.getElementById("outOfStock").textContent = outOfStock;

    document.getElementById("stockValue").textContent =
        stockValue.toLocaleString("fr-FR") + " FCFA";
}

updateDashboard();

function saveProducts() {

    const rows = productTableBody.querySelectorAll("tr");
    const products = [];

    rows.forEach(function (row) {

        const cells = row.querySelectorAll("td");

        const product = {
            name: cells[0].textContent,
            category: cells[1].textContent,
            quantity: Number(cells[2].textContent),
            price: Number(
                cells[3].textContent
                    .replace("FCFA", "")
                    .replace(/\s/g, "")
            )
        };

        products.push(product);
    });

    localStorage.setItem("stockFacileProducts", JSON.stringify(products));
}

function loadProducts() {

    const savedProducts = localStorage.getItem("stockFacileProducts");

    if (!savedProducts) {
        return;
    }

    const products = JSON.parse(savedProducts);

    productTableBody.innerHTML = "";

    products.forEach(function (product) {

        let statusText;
        let statusClass;

        if (product.quantity === 0) {
            statusText = "Rupture";
            statusClass = "out";
        } else if (product.quantity <= 5) {
            statusText = "Stock faible";
            statusClass = "low";
        } else {
            statusText = "En stock";
            statusClass = "available";
        }

        const row = document.createElement("tr");

       row.innerHTML = `
    <td>${product.name}</td>
    <td>${product.category}</td>
    <td>${product.quantity}</td>
    <td>${product.price.toLocaleString("fr-FR")} FCFA</td>
    <td>
        <span class="status ${statusClass}">
            ${statusText}
        </span>
    </td>
   <td class="action-buttons">
       <button class="edit-button">✏️ Modifier</button>
       <button class="delete-button">🗑️ Supprimer</button>
   </td>
`;

        productTableBody.appendChild(row);
    });

    updateDashboard();
}

loadProducts();

productTableBody.addEventListener("click", function (event) {

    if (event.target.classList.contains("edit-button")) {

    editingRow = event.target.closest("tr");

    const cells = editingRow.querySelectorAll("td");

    const name = cells[0].textContent;
    const category = cells[1].textContent;
    const quantity = cells[2].textContent;

    const price = cells[3].textContent
        .replace("FCFA", "")
        .replace(/\s/g, "");

    document.getElementById("productName").value = name;
    document.getElementById("productCategory").value = category;
    document.getElementById("productQuantity").value = quantity;
    document.getElementById("productPrice").value = price;

    document.querySelector(".modal-header h2").textContent =
        "Modifier le produit";

    document.querySelector(".save-button").textContent =
        "Enregistrer les modifications";

    modal.style.display = "flex";
}

    if (event.target.classList.contains("delete-button")) {

        const row = event.target.closest("tr");
        const productName = row.querySelector("td").textContent;

        const confirmation = confirm(
            `Voulez-vous vraiment supprimer "${productName}" ?`
        );

        if (confirmation) {

            row.remove();

            updateDashboard();
            saveProducts();
        }
    }

});

alertsButton.addEventListener("click", function (event) {

    event.preventDefault();

    setActiveMenu(alertsButton);

    // Cacher la liste normale des produits
    productsSection.style.display = "none";

    // Afficher la section des alertes
    alertsSection.style.display = "block";

    // Vider les anciennes alertes
    alertsList.innerHTML = "";

    const rows = productTableBody.querySelectorAll("tr");

    rows.forEach(function (row) {

        const cells = row.querySelectorAll("td");

        const name = cells[0].textContent;
        const quantity = Number(cells[2].textContent);

        // Produit en rupture
        if (quantity === 0) {

            alertsList.innerHTML += `
                <div class="alert-item alert-danger">
                    <div>
                        <div class="alert-product">🔴 ${name}</div>
                        <div>Rupture de stock</div>
                    </div>

                    <strong>Quantité : ${quantity}</strong>
                </div>
            `;

        // Produit en stock faible
        } else if (quantity <= 5) {

            alertsList.innerHTML += `
                <div class="alert-item alert-warning">
                    <div>
                        <div class="alert-product">⚠️ ${name}</div>
                        <div>Stock faible</div>
                    </div>

                    <strong>Quantité : ${quantity}</strong>
                </div>
            `;
        }

    });

});

dashboardButton.addEventListener("click", function (event) {

    event.preventDefault();

    setActiveMenu(dashboardButton);

    productsSection.style.display = "block";
    alertsSection.style.display = "none";
});

productsButton.addEventListener("click", function (event) {

    event.preventDefault();

    setActiveMenu(productsButton);

    productsSection.style.display = "block";
    alertsSection.style.display = "none";

    productsSection.scrollIntoView({
        behavior: "smooth"
    });
});

// Recherche d'un produit
function filterProducts() {

    const searchValue = searchProduct.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    const selectedStatus = statusFilter.value;

    const rows = productTableBody.querySelectorAll("tr");

    let visibleProducts = 0;

    rows.forEach(function (row) {

        const cells = row.querySelectorAll("td");

        const productName = cells[0].textContent.toLowerCase();
        const productCategory = cells[1].textContent.trim();
        const productStatus = cells[4].textContent.trim();

        const matchesSearch =
            productName.includes(searchValue);

        const matchesCategory =
            selectedCategory === "all" ||
            productCategory === selectedCategory;

        const matchesStatus =
            selectedStatus === "all" ||
            productStatus === selectedStatus;

        if (
            matchesSearch &&
            matchesCategory &&
            matchesStatus
        ) {
            row.style.display = "";
            visibleProducts++;
        } else {
            row.style.display = "none";
        }

    });

    if (visibleProducts === 0) {
        noProductMessage.style.display = "block";
    } else {
        noProductMessage.style.display = "none";
    }
}
searchProduct.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);
statusFilter.addEventListener("change", filterProducts);

// Tri des produits
sortFilter.addEventListener("change", function () {

    const sortValue = sortFilter.value;

    const rows = Array.from(
        productTableBody.querySelectorAll("tr")
    );

    rows.sort(function (rowA, rowB) {

        const cellsA = rowA.querySelectorAll("td");
        const cellsB = rowB.querySelectorAll("td");

        const nameA = cellsA[0].textContent.trim().toLowerCase();
        const nameB = cellsB[0].textContent.trim().toLowerCase();

        const quantityA = Number(cellsA[2].textContent);
        const quantityB = Number(cellsB[2].textContent);

        const priceA = Number(
            cellsA[3].textContent
                .replace("FCFA", "")
                .replace(/\s/g, "")
        );

        const priceB = Number(
            cellsB[3].textContent
                .replace("FCFA", "")
                .replace(/\s/g, "")
        );

        if (sortValue === "name-asc") {
            return nameA.localeCompare(nameB);
        }

        if (sortValue === "name-desc") {
            return nameB.localeCompare(nameA);
        }

        if (sortValue === "price-asc") {
            return priceA - priceB;
        }

        if (sortValue === "price-desc") {
            return priceB - priceA;
        }

        if (sortValue === "quantity-asc") {
            return quantityA - quantityB;
        }

        if (sortValue === "quantity-desc") {
            return quantityB - quantityA;
        }

        return 0;
    });

    rows.forEach(function (row) {
        productTableBody.appendChild(row);
    });

});

// Modification d'un produit
productTableBody.addEventListener("click", function (event) {

    const editButton = event.target.closest(".edit-button");

    if (!editButton) {
        return;
    }

    const row = editButton.closest("tr");
    const cells = row.querySelectorAll("td");

    productBeingEdited = row;

    productName.value = cells[0].textContent.trim();
    productCategory.value = cells[1].textContent.trim();
    productQuantity.value = Number(cells[2].textContent.trim());

    const priceText = cells[3].textContent
        .replace("FCFA", "")
        .replace(/\s/g, "");

    productPrice.value = Number(priceText);

    productModal.style.display = "flex";
});