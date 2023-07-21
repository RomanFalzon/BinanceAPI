const fs = require('fs');
const filePath = './db/db.json';

const candlesToCheck = 2;
let jsonData = [];

let consecutiveGreenCount = 0;
let consecutiveRedCount = 0;

let isInPosition = false;

let myBALANCE = 1000;
let percentage = 0.10;

let currentOpenPoisitionBalance = 0;

let valueAtEnterPosition = 0;
let valueAtExitPosition = 0;

function checkLoopData(data) {

    //Get open price and close price
    const openPrice = parseFloat(data[1]);
    const closePrice = parseFloat(data[4]);

    //Check candle
    if (openPrice > closePrice) {
        console.log('RED');
        consecutiveRedCount++;
        consecutiveGreenCount = 0;
     } else if (openPrice < closePrice) {
        console.log('GREEN');
        consecutiveGreenCount++;
        consecutiveRedCount = 0;
    } else {
        //console.log('EMPTY');
    }


    //Call positions based on check candle
    if (consecutiveGreenCount === candlesToCheck && !isInPosition) {
        //console.log('Enter signal');
        isInPosition = true;

        //ENTER SINGAL

        enterTrade(openPrice);

        consecutiveGreenCount = 0; //Reset Counter
    }

    if (consecutiveRedCount === candlesToCheck && isInPosition) {
        //console.log('Exit signal');
        isInPosition = false;

        //EXIT SINGAL
        exitTrade(closePrice);

        consecutiveRedCount = 0; //Reset Counter
    }
}



function enterTrade(valueAtEnter){
    const tradeAmount = myBALANCE * percentage;
    currentOpenPoisitionBalance = tradeAmount

    console.log('-----------------')
    console.log('ENTERING TRADE:')
    console.log('Current BTC value: ', valueAtEnter)

    valueAtEnterPosition = valueAtEnter;
}




function exitTrade(valueAtExit){
    console.log('-----------------')
    console.log('EXITING TRADE:')

    console.log('VALUE AT ENTER: ', valueAtEnterPosition)
    console.log('VALUE AT EXIT: ', valueAtExit)
    
    console.log('---')

    console.log('BALANCE AT ENTER ', myBALANCE)
    valueAtExitPosition = valueAtExit
  
    checkProfitLoss()

    console.log('BALANCE AT EXIT ', myBALANCE)

    console.log('---')
}

function checkProfitLoss(){
    const oldOpenPosition = valueAtEnterPosition;
    const newClosePosition = valueAtExitPosition;
    
    const myOldBal = currentOpenPoisitionBalance;
    const myNewBal = myOldBal * (newClosePosition / oldOpenPosition);
    
    const profitLoss = myNewBal - myOldBal;
    const percentageChange = ((newClosePosition - oldOpenPosition) / oldOpenPosition) * 100;
    
    if (profitLoss > 0) {
        myBALANCE += profitLoss;
        console.log('PROFIT:', profitLoss);
    } else if (profitLoss < 0) {
        myBALANCE += profitLoss;
        console.log('LOSS:', profitLoss);
    } else {
        console.log('No profit or loss');
    }
    
    console.log(`Percentage Change: ${percentageChange.toFixed(2)}%`);
}





async function main(data) {
    try {
        jsonData = data

        for (const data of jsonData) {
            checkLoopData(data);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function readJsonFile(filePath) {
    try {
        const fileContent = await fs.promises.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        throw new Error('Error reading JSON file:', error.message);
    }
}


module.exports = { main };

//main();