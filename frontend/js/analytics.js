async function loadAnalytics(){

    try{

        const API_URL = "https://YOUR-RENDER-URL.onrender.com/api/analytics";

        const sales =
        await response.json();

        let revenue = 0;

        sales.forEach(sale => {

            revenue += Number(
                sale.total_amount
            );

        });

        document.getElementById(
            "totalRevenue"
        ).innerText =
        "₹" + revenue;

        document.getElementById(
            "totalOrders"
        ).innerText =
        sales.length;

    }

    catch(error){

        console.log(error);

    }

}

loadAnalytics();
