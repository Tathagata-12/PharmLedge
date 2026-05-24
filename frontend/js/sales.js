const API_URL =
"https://pharmledge-backend.onrender.com/api/sales";

const salesTable =
document.getElementById("salesTable");


// LOAD SALES

async function loadSales(){

    try{

        const response =
        await fetch(API_URL);

        const data =
        await response.json();

        console.log(data);

        renderSales(data);

    }

    catch(error){

        console.log(
            "Sales Error:",
            error
        );

    }

}


// RENDER TABLE

function renderSales(data){

    salesTable.innerHTML = "";

    data.forEach((sale) => {

        salesTable.innerHTML += `

            <tr>

                <td>
                    ${sale.customer_name}
                </td>

                <td>
                    ₹${sale.total_amount}
                </td>

                <td>
                    ${new Date(
                        sale.created_at
                    ).toLocaleDateString()}
                </td>

                <td>

                    <button
                        class="invoice-btn"
                        onclick="viewInvoice(${sale.id})"
                    >

                        View

                    </button>

                </td>

            </tr>

        `;

    });

}


// VIEW INVOICE

async function viewInvoice(id){

    try{

        const response =
        await fetch(
            `${API_URL}/${id}`
        );

        const data =
        await response.json();

        document.getElementById(
            "invoiceContent"
        ).innerHTML = `

            <h2>
                Invoice
            </h2>

            <p>
                Customer:
                ${data.customer_name}
            </p>

            <p>
                Total:
                ₹${data.total_amount}
            </p>

            <p>
                Date:
                ${new Date(
                    data.created_at
                ).toLocaleString()}
            </p>

        `;

        document.getElementById(
            "invoiceModal"
        ).style.display = "flex";

    }

    catch(error){

        console.log(error);

    }

}


// CLOSE MODAL

function closeInvoice(){

    document.getElementById(
        "invoiceModal"
    ).style.display = "none";

}


// INITIAL LOAD

loadSales();
