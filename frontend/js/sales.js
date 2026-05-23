});

    invoiceContent.innerHTML = `

        <h1>
            PharmLedge Invoice
        </h1>

        <p>
            Customer:
            ${data[0].customer_name}
        </p>

        <p>
            Date:
            ${new Date(
                data[0].created_at
            ).toLocaleString()}
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
            ₹${data[0].total_amount}

        </h2>

    `;

    invoiceModal.style.display =
    "flex";

}


// CLOSE

function closeInvoice(){

    invoiceModal.style.display =
    "none";

}


// INITIAL

loadAnalytics();

loadSales();