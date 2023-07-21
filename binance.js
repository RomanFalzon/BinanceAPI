const axios = require('axios');

let startTimeStamp = 1672531200000; // Unix GMT UTC JAN 1 2023
let myNewDate = 0;

let mySymbolData = '';
let myIntervalData = '';

let myData = []

async function fetchData() {
  try {
    let url = `https://api.binance.com/api/v3/klines?symbol=${mySymbolData}&interval=${myIntervalData}&startTime=${startTimeStamp}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    return null;
  }
}

function convertDateToUnix(dateString) {
    const [datePart, timePart] = dateString.split(' ');
    const [month, day, year] = datePart.split('-');
    const [hours, minutes, seconds] = timePart.split(':');
  
    const dateObj = new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
  
    const unixTimestampMilliseconds = dateObj.getTime();
  
    return unixTimestampMilliseconds;
}

async function looper(){
    let keepLooping = true

    while(keepLooping){
        myNewData = await fetchData(); //get the response
        
            if(myNewData.length !== 0){
                myData = [...myData, ...myNewData]

                myNewDate = myData[myData.length-1][6]
                startTimeStamp = myNewDate

                //console.log('CLOSE PRICE: ', myData[myData.length-1][4]);
                console.log('ARRAY COUNT: ', myData.length);

            }

            if(myNewData.length === 0){
                keepLooping = false
            }
        }
        
    return myData;
}




async function getCandles(symbol, interval, startTime){

    mySymbolData = symbol += 'USDT';
    myIntervalData = interval;


    if (startTime && typeof startTime === 'string') {
        startTimeStamp = convertDateToUnix(startTime);
    } else if (startTime && typeof startTime === 'number') {
        startTimeStamp = startTime;
    } else {
        startTimeStamp = 0;
    }
    

    //console.log('The Time Frame: ', startTimeStamp)

    let myOutput = await looper();
    return myOutput
}

async function clearCandles(){
    startTimeStamp = 1672531200000; // Unix GMT UTC JAN 1 2023
    myNewDate = 0;

    mySymbolData = '';
    myIntervalData = '';

    myData = []
}

module.exports = { getCandles, clearCandles };