// CHECK LOGIN

const token = localStorage.getItem("token");

if(!token){

    window.location.href = "./login.html";

}

// USER INFO

const user = JSON.parse(
    localStorage.getItem("user")
);

const welcomeText =
document.getElementById("welcomeText");

welcomeText.innerText =
`Welcome, ${user.shop_name}`;

// LOGOUT

const logoutBtn =
document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href =
    "./login.html";

});

// ELEMENTS

const medicineTableBody =
document.getElementById(
    "medicineTableBody"
);

const searchInput =
document.getElementById(
    "searchInput"
);

const categoryFilter =
document.getElementById(
    "categoryFilter"
);

const editModal =
document.getElementById(
    "editModal"
);

let allMedicines = [];

let currentMedicineId = null;

// LOAD MEDICINES

async function loadMedicines(){

    try{

        const response = await fetch(
            "http://127.0.0.1:8000/api/medicines"
        );

        const medicines =
        await response.json();

        allMedicines = medicines;

        populateCategories(medicines);

        displayMedicines(medicines);

        loadExpiryStats(medicines);

    }catch(error){

        console.log(error);

    }

}

// POPULATE CATEGORY FILTER

function populateCategories(medicines){

    const categories =
    [
        ...new Set(
            medicines.map(
                medicine =>
                medicine.category
            )
        )
    ];

    categoryFilter.innerHTML = `

        <option value="all">
            All Categories
        </option>

    `;

    categories.forEach((category) => {

        categoryFilter.innerHTML += `

            <option value="${category}">
                ${category}
            </option>

        `;

    });

}

// DISPLAY MEDICINES

function displayMedicines(medicines){

    medicineTableBody.innerHTML = "";

    medicines.forEach((medicine) => {

        const today =
        new Date();

        const expiryDate =
        new Date(medicine.expiry_date);

        const diffTime =
        expiryDate - today;

        const diffDays =
        Math.ceil(
            diffTime /
            (1000 * 60 * 60 * 24)
        );

        let expiryClass = "";

        if(diffDays < 0){

            expiryClass =
            "expired-stock";

        }else if(diffDays <= 30){

            expiryClass =
            "near-expiry";

        }

        const lowStockClass =
        medicine.stock < 20
        ? "low-stock"
        : "";

        const row = `

            <tr class="${lowStockClass} ${expiryClass}">

                <td>
                    ${medicine.medicine_name}
                </td>

                <td>
                    ${medicine.category}
                </td>

                <td>
                    ${medicine.vendor_name}
                </td>

                <td>
                    ${medicine.stock}
                </td>

                <td>
                    ₹${medicine.selling_price}
                </td>

                <td>
                    ${medicine.expiry_date
                        .split("T")[0]}
                </td>

                <td class="action-buttons">

                    <button
                        class="edit-btn"
                        onclick='openEditModal(
                            ${medicine.id},
                            "${medicine.medicine_name}",
                            "${medicine.category}",
                            ${medicine.stock},
                            ${medicine.selling_price}
                        )'
                    >
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteMedicine(${medicine.id})"
                    >
                        Delete
                    </button>

                </td>

            </tr>

        `;

        medicineTableBody.innerHTML += row;

    });

}

// EXPIRY STATS

function loadExpiryStats(medicines){

    const today =
    new Date();

    let nearExpiryCount = 0;

    medicines.forEach((medicine) => {

        const expiryDate =
        new Date(medicine.expiry_date);

        const diffTime =
        expiryDate - today;

        const diffDays =
        Math.ceil(
            diffTime /
            (1000 * 60 * 60 * 24)
        );

        if(diffDays <= 30){

            nearExpiryCount++;

        }

    });

    document.getElementById(
        "nearExpiry"
    ).innerText =
    nearExpiryCount;

}

// FILTER SYSTEM

function applyFilters(){

    const searchValue =
    searchInput.value.toLowerCase();

    const selectedCategory =
    categoryFilter.value;

    const filteredMedicines =
    allMedicines.filter((medicine) => {

        const matchesSearch =

            medicine.medicine_name
            .toLowerCase()
            .includes(searchValue)

            ||

            medicine.vendor_name
            .toLowerCase()
            .includes(searchValue)

            ||

            medicine.batch_no
            .toLowerCase()
            .includes(searchValue);

        const matchesCategory =

            selectedCategory === "all"

            ||

            medicine.category ===
            selectedCategory;

        return (
            matchesSearch
            &&
            matchesCategory
        );

    });

    displayMedicines(filteredMedicines);

}

// SEARCH

searchInput.addEventListener(
    "input",
    applyFilters
);

// CATEGORY FILTER

categoryFilter.addEventListener(
    "change",
    applyFilters
);

// LOAD DASHBOARD STATS

async function loadStats(){

    try{

        const response = await fetch(
            "http://127.0.0.1:8000/api/medicines/stats"
        );

        const stats =
        await response.json();

        document.getElementById(
            "totalMedicines"
        ).innerText =
        stats.total_medicines || 0;

        document.getElementById(
            "totalStock"
        ).innerText =
        stats.total_stock || 0;

        document.getElementById(
            "totalVendors"
        ).innerText =
        stats.total_vendors || 0;

        document.getElementById(
            "lowStock"
        ).innerText =
        stats.low_stock || 0;

    }catch(error){

        console.log(error);

    }

}

// DELETE MEDICINE

async function deleteMedicine(id){

    const confirmDelete =
    confirm(
        "Delete this medicine?"
    );

    if(!confirmDelete){

        return;

    }

    try{

        const response = await fetch(
            `http://127.0.0.1:8000/api/medicines/${id}`,
            {
                method: "DELETE"
            }
        );

        const data =
        await response.json();

        alert(data.message);

        loadMedicines();

        loadStats();

    }catch(error){

        console.log(error);

    }

}

// OPEN EDIT MODAL

function openEditModal(
    id,
    medicine_name,
    category,
    stock,
    selling_price
){

    currentMedicineId = id;

    editModal.style.display =
    "flex";

    document.getElementById(
        "editMedicineName"
    ).value = medicine_name;

    document.getElementById(
        "editCategory"
    ).value = category;

    document.getElementById(
        "editStock"
    ).value = stock;

    document.getElementById(
        "editPrice"
    ).value = selling_price;

}

// CLOSE MODAL

function closeModal(){

    editModal.style.display =
    "none";

}

// UPDATE MEDICINE

async function updateMedicine(){

    try{

        const response = await fetch(

            `http://127.0.0.1:8000/api/medicines/${currentMedicineId}`,

            {

                method:"PUT",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({

                    medicine_name:
                    document.getElementById(
                        "editMedicineName"
                    ).value,

                    category:
                    document.getElementById(
                        "editCategory"
                    ).value,

                    stock:
                    document.getElementById(
                        "editStock"
                    ).value,

                    selling_price:
                    document.getElementById(
                        "editPrice"
                    ).value

                })

            }

        );

        const data =
        await response.json();

        alert(data.message);

        closeModal();

        loadMedicines();

        loadStats();

    }catch(error){

        console.log(error);

    }

}

// INITIAL LOAD

loadMedicines();

loadStats();