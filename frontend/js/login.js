const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const loginData = {

        email: document.getElementById("email").value,
        password: document.getElementById("password").value

    };

    try{

        const response = await fetch(
            "http://127.0.0.1:8000/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(loginData)
            }
        );

        const data = await response.json();

        if(response.ok){

            // SAVE TOKEN
            localStorage.setItem("token", data.token);

            // SAVE USER
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            message.style.color = "#22c55e";
            message.innerText = data.message;

            // REDIRECT
            setTimeout(() => {

                window.location.href = "./dashboard.html";

            }, 1000);

        }else{

            message.style.color = "#ef4444";
            message.innerText = data.message;

        }

    }catch(error){

        message.style.color = "#ef4444";
        message.innerText = "Server Error";

    }

});