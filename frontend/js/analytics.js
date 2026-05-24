async function loadAnalytics(){

    try{

        const response =
        await fetch(
            "http://localhost:8000/api/sales"
        );

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