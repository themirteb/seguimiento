document.addEventListener('DOMContentLoaded', () => {
    const currencySelect = document.getElementById('currency');
    const chartCanvas = document.getElementById('currencyChart').getContext('2d');

    // Obtener lista de monedas desde la API Frankfurter
    fetch('https://api.frankfurter.app/currencies')
        .then(response => response.json())
        .then(data => {
            // Llenar el dropdown con las monedas disponibles
            for (const currencyCode in data) {
                const option = document.createElement('option');
                option.value = currencyCode;
                option.textContent = `${currencyCode} - ${data[currencyCode]}`;
                currencySelect.appendChild(option);
            }
        });

    // Manejar el cambio en la selección de moneda
    currencySelect.addEventListener('change', () => {
        const selectedCurrency = currencySelect.value;
        fetch(`https://api.frankfurter.app/latest?from=${selectedCurrency}`)
            .then(response => response.json())
            .then(data => {
                // Obtener las fechas y tasas de cambio
                const dates = Object.keys(data.rates);
                const exchangeRates = Object.values(data.rates);

                // Crear el gráfico utilizando Chart.js
                createChart(dates, exchangeRates);
            });
    });

    // Función para crear el gráfico
    function createChart(dates, rates) {
        new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: `Tasa de Cambio`,
                    borderColor: '#3498db',
                    data: rates,
                    fill: false,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                        },
                        title: {
                            display: true,
                            text: 'Fechas',
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Tasa de Cambio',
                        },
                    },
                },
            },
        });
    }
});