async function loadVendors(){

    try{

        const response = await fetch(
            "http://127.0.0.1:8000/api/medicines"
        );

        const medicines =
        await response.json();

        const vendorMap = {};

        medicines.forEach((medicine) => {

            if(vendorMap[medicine.vendor_name]){

                vendorMap[medicine.vendor_name]++;

            }else{

                vendorMap[medicine.vendor_name] = 1;

            }

        });

        const tableBody =
        document.getElementById(
            "vendorTableBody"
        );

        tableBody.innerHTML = "";

        Object.keys(vendorMap).forEach((vendor) => {

            tableBody.innerHTML += `

                <tr>

                    <td>${vendor}</td>

                    <td>
                        ${vendorMap[vendor]}
                    </td>

                </tr>

            `;

        });

    }catch(error){

        console.log(error);

    }

}

loadVendors();