const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const userData = {

        shop_name: document.getElementById("shop_name").value,
        owner_name: document.getElementById("owner_name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        phone: document.getElementById("phone").value

    };

    try{

        const response = await fetch(
            "http://127.0.0.1:8000/api/auth/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(userData)
            }
        );

        const data = await response.json();

        message.innerText = data.message;

        if(response.ok){

            message.style.color = "#22c55e";

            registerForm.reset();

        }else{

            message.style.color = "#ef4444";

        }

    }catch(error){

        message.innerText = "Server Error";
        message.style.color = "#ef4444";

    }

});