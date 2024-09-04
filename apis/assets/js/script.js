let chart;

const handleClick = async () => {
    const select = document.querySelector("#currency");
    const money = document.querySelector("#money");

    if (!select.value || !money.value) {
        alert("Por favor, complete todos los campos antes de continuar");
        return;
    }

    const url = "https://mindicador.cl/api/" + select.value;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Error: ${res.statusText}`);
        }

        const data = await res.json();

        const info = data.serie.slice(0, 10).reverse();
        const etiquetas = info.map((day) => {
            const fecha = new Date(day.fecha);
            const dia = String(fecha.getDate()).padStart(2, '0');
            const mes = String(fecha.getMonth() + 1).padStart(2, '0');
            const anio = fecha.getFullYear();
            return `${dia}/${mes}/${anio}`;
        });

        const valores = info.map((day) => day.valor);
        const conversion = money.value / valores[valores.length - 1];
        document.querySelector("h3").innerText = "Resultado: $" + conversion.toFixed(2);

        const ctx = document.getElementById('myChart').getContext('2d');

        if (chart) {
            chart.destroy();
        }

        const dataChart = {
            labels: etiquetas,
            datasets: [{
                label: 'Variaciones de moneda',
                data: valores,
                borderColor: 'rgb(75, 192, 192)',
            }]
        };

        chart = new Chart(ctx, {
            type: 'line',
            data: dataChart,
        });

    } catch (error) {
        document.querySelector("h3").innerText = `Error: ${error.message}`;
    }
}

const searchButton = document.querySelector("#search");
searchButton.addEventListener("click", handleClick);