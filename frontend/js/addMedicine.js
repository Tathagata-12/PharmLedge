const medicineForm =
document.getElementById("medicineForm");

const message =
document.getElementById("message");

medicineForm.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const medicineData = {

            medicine_name:
            document.getElementById("medicine_name").value,

            category:
            document.getElementById("category").value,

            description:
            document.getElementById("description").value,

            vendor_name:
            document.getElementById("vendor_name").value,

            phone:
            document.getElementById("phone").value,

            email:
            document.getElementById("email").value,

            address:
            document.getElementById("address").value,

            batch_no:
            document.getElementById("batch_no").value,

            stock:
            document.getElementById("stock").value,

            purchase_price:
            document.getElementById("purchase_price").value,

            selling_price:
            document.getElementById("selling_price").value,

            manufacture_date:
            document.getElementById("manufacture_date").value,

            expiry_date:
            document.getElementById("expiry_date").value

        };

        try{

            const response = await fetch(
                "http://127.0.0.1:8000/api/medicines/add",
                {

                    method:"POST",

                    headers:{
                        "Content-Type":"application/json"
                    },

                    body:JSON.stringify(medicineData)

                }
            );

            const data = await response.json();

            if(response.ok){

                message.style.color="#22c55e";

                message.innerText=data.message;

                medicineForm.reset();

            }else{

                message.style.color="#ef4444";

                message.innerText="Failed to save medicine";

            }

        }catch(error){

            message.style.color="#ef4444";

            message.innerText="Server Error";

        }

    }
);