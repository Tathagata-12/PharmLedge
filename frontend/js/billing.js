const medicineList =
document.getElementById(
    "medicineList"
);

const medicineSearch =
document.getElementById(
    "medicineSearch"
);

const cartItems =
document.getElementById(
    "cartItems"
);

const grandTotal =
document.getElementById(
    "grandTotal"
);

const invoiceModal =
document.getElementById(
    "invoiceModal"
);

const invoiceContent =
document.getElementById(
    "invoiceContent"
);

let medicines = [];

let cart = [];

// LOAD MEDICINES

async function loadMedicines(){

    try{

        const response = await fetch(
            "http://127.0.0.1:8000/api/medicines"
        );

        const data =
        await response.json();

        medicines = data;

        displayMedicines(data);

    }catch(error){

        console.log(error);

    }

}

// DISPLAY MEDICINES

function displayMedicines(data){

    medicineList.innerHTML = "";

    data.forEach((medicine) => {

        const card = `

            <div class="medicine-card">

                <h3>
                    ${medicine.medicine_name}
                </h3>

                <p>
                    ₹${medicine.selling_price}
                </p>

                <p>
                    Stock:
                    ${medicine.stock}
                </p>

                <button
                    onclick='addToCart(
                        ${JSON.stringify(medicine)}
                    )'
                >
                    Add
                </button>

            </div>

        `;

        medicineList.innerHTML += card;

    });

}

// SEARCH

medicineSearch.addEventListener(
    "input",
    () => {

        const value =
        medicineSearch.value.toLowerCase();

        const filtered =
        medicines.filter((medicine) => {

            return medicine
            .medicine_name
            .toLowerCase()
            .includes(value);

        });

        displayMedicines(filtered);

    }
);

// ADD TO CART

function addToCart(medicine){

    const existing =
    cart.find(
        item =>
        item.id === medicine.id
    );

    if(existing){

        existing.quantity++;

    }else{

        cart.push({

            ...medicine,

            quantity:1

        });

    }

    renderCart();

}

// RENDER CART

function renderCart(){

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach((item) => {

        const itemTotal =
        item.quantity *
        item.selling_price;

        total += itemTotal;

        const cartItem = `

            <div class="cart-item">

                <div class="cart-item-left">

                    <strong>
                        ${item.medicine_name}
                    </strong>

                    <span>
                        ₹${item.selling_price}
                    </span>

                </div>

                <div
                    class="quantity-controls"
                >

                    <button
                        onclick="decreaseQuantity(${item.id})"
                    >
                        -
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="increaseQuantity(${item.id})"
                    >
                        +
                    </button>

                </div>

            </div>

        `;

        cartItems.innerHTML += cartItem;

    });

    grandTotal.innerText =
    `₹${total}`;

}

// INCREASE

function increaseQuantity(id){

    const item =
    cart.find(
        item => item.id === id
    );

    item.quantity++;

    renderCart();

}

// DECREASE

function decreaseQuantity(id){

    const item =
    cart.find(
        item => item.id === id
    );

    item.quantity--;

    if(item.quantity <= 0){

        cart =
        cart.filter(
            item => item.id !== id
        );

    }

    renderCart();

}

// CHECKOUT

async function checkout(){

    if(cart.length === 0){

        alert("Cart is empty");

        return;

    }

    const customer_name =
    prompt("Customer Name");

    const total_amount =
    cart.reduce(
        (acc, item) => {

            return acc +
            (
                item.quantity *
                item.selling_price
            );

        },
        0
    );

    try{

        const response = await fetch(

            "http://127.0.0.1:8000/api/medicines/checkout",

            {

                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({

                    customer_name,
                    cart,
                    total_amount

                })

            }

        );

        const data =
        await response.json();

        alert(data.message);

        generateInvoice(
            customer_name,
            total_amount
        );

        cart = [];

        renderCart();

        loadMedicines();

    }catch(error){

        console.log(error);

    }

}

// GENERATE INVOICE

function generateInvoice(
    customer_name,
    total_amount
){

    const date =
    new Date();

    let rows = "";

    cart.forEach((item) => {

        rows += `

            <tr>

                <td>
                    ${item.medicine_name}
                </td>

                <td>
                    ${item.quantity}
                </td>

                <td>
                    ₹${item.selling_price}
                </td>

                <td>
                    ₹${item.quantity *
                    item.selling_price}
                </td>

            </tr>

        `;

    });

    invoiceContent.innerHTML = `

        <h1>
            PharmLedge Invoice
        </h1>

        <p>
            Customer:
            ${customer_name}
        </p>

        <p>
            Date:
            ${date.toLocaleString()}
        </p>

        <table>

            <thead>

                <tr>

                    <th>
                        Medicine
                    </th>

                    <th>
                        Qty
                    </th>

                    <th>
                        Price
                    </th>

                    <th>
                        Total
                    </th>

                </tr>

            </thead>

            <tbody>

                ${rows}

            </tbody>

        </table>

        <h2 style="margin-top:20px;">

            Grand Total:
            ₹${total_amount}

        </h2>

    `;

    invoiceModal.style.display =
    "flex";

}

// PRINT INVOICE

function printInvoice(){

    window.print();

}

// CLOSE INVOICE

function closeInvoice(){

    invoiceModal.style.display =
    "none";

}

// INITIAL

loadMedicines();