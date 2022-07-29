async function main() {

    const timeChartCanvas = document.querySelector('#time-chart');
    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');
    const averagePriceChartCanvas = document.querySelector('#average-price-chart');

    let response = await fetch(
        'https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=1day&apikey=fceca6ee67d64529a77916994d3e2650'
    )
    let jsonRepsonse = await response.json()    
    const {GME, MSFT, DIS, BNTX} = jsonRepsonse;
    const stocks = [GME, MSFT, DIS, BNTX]

    stocks.forEach(stock => stock.values.reverse())

    function getColor(stock){
        if(stock === "GME"){
            return 'rgba(61, 161, 61, 0.7)'
        }
        if(stock === "MSFT"){
            return 'rgba(209, 4, 25, 0.7)'
        }
        if(stock === "DIS"){
            return 'rgba(18, 4, 209, 0.7)'
        }
        if(stock === "BNTX"){
            return 'rgba(166, 43, 158, 0.7)'
        }
    }


    function getHighest(stock){
        let newInfo = stock.values;
        let highValue = 0;

        for(let i = 0; i < newInfo.length; i++){
            let newValue = parseFloat(stock.values[i].high);
            if(newValue > highValue){
                highValue = newValue;
            }
        }
        return highValue
    }

    function getAverage(stock){
        let newInfo = stock.values;
        let valueSum = 0;

        for(let i = 0; i < newInfo.length; i++){
            let newValue = parseFloat(stock.values[i].high);
            valueSum += newValue;
        }
        return valueSum/newInfo.length
    }

    


    new Chart(timeChartCanvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: stocks[0].values.map( value => value.datetime),
            datasets: stocks.map( stock => ({
                label: stock.meta.symbol,
                data: stock.values.map(value => parseFloat(value.high)),
                backgroundColor: getColor(stock.meta.symbol),
                borderColor: getColor(stock.meta.symbol),
            }))
        }
    });

    new Chart(highestPriceChartCanvas.getContext('2d'),{
        type: 'bar',
        data: {
            labels: stocks.map(stock => stock.meta.symbol),
            datasets:[{
                label: "Highest",
                backgroundColor: stocks.map(stock => getColor(stock.meta.symbol)),
                borderColor: stocks.map(stock => getColor(stock.meta.symbol)),
                data: stocks.map(stock => getHighest(stock)),
            }]
        }
    })

    new Chart(averagePriceChartCanvas.getContext('2d'),{
        type: 'pie',
        data: {
            labels: stocks.map(stock => stock.meta.symbol),
            datasets:[{
                backgroundColor: stocks.map(stock => getColor(stock.meta.symbol)),
                borderColor: stocks.map(stock => getColor(stock.meta.symbol)),
                data: stocks.map(stock => getAverage(stock)),
            }]
        }
    })

}

main()