document.addEventListener('DOMContentLoaded', () => {
    const currencySelect = document.getElementById('currency');
    const chartCanvas = document.getElementById('currencyChart').getContext('2d');

    fetch('https://api.frankfurter.app/currencies')
        .then(response => response.json())
        .then(data => {
          
            for (const currencyCode in data) {
                const option = document.createElement('option');
                option.value = currencyCode;
                option.textContent = `${currencyCode} - ${data[currencyCode]}`;
                currencySelect.appendChild(option);
            }
        });

  
    currencySelect.addEventListener('change', () => {
        const selectedCurrency = currencySelect.value;
        fetch(`https://api.frankfurter.app/latest?from=${selectedCurrency}`)
            .then(response => response.json())
            .then(data => {
              
                const dates = Object.keys(data.rates);
                const exchangeRates = Object.values(data.rates);

             
                createChart(dates, exchangeRates);
            });
    });

    
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