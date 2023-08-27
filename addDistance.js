const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const ORIGIN_ADDRESS = process.env.ORIGIN_ADDRESS;

async function getDistanceAndDurationFromDirectionsAPI(address, mode) {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
            params: {
                origin: ORIGIN_ADDRESS,
                destination: address,
                mode: mode,
                key: GOOGLE_MAPS_API_KEY
            }
        });
        
        if (response.data && response.data.routes && response.data.routes[0] && response.data.routes[0].legs && response.data.routes[0].legs[0]) {
            return {
                distance: response.data.routes[0].legs[0].distance.value,
                duration: response.data.routes[0].legs[0].duration.value / 60  // Convert to minutes
            };
        } else {
            console.error(`Unexpected response structure for address ${address}:`, response.data);
            return {
                distance: null,
                duration: null
            };
        }
    } catch (error) {
        console.error(`Error fetching data for address ${address}:`, error);
        return {
            distance: null,
            duration: null
        };
    }
}

async function addDistancesAndDurationsToFile(inputFilePath, outputFilePath) {
    const data = JSON.parse(fs.readFileSync(inputFilePath, 'utf-8'));
    const totalEntries = data.length;
    
    for (let i = 0; i < totalEntries; i++) {
        console.log(`Calculating distance ${i + 1} out of ${totalEntries}`);
        
        const bikeData = await getDistanceAndDurationFromDirectionsAPI(data[i].address, 'bicycling');
        const carData = await getDistanceAndDurationFromDirectionsAPI(data[i].address, 'driving');
        
        data[i].distanceBike = bikeData.distance;
        data[i].minutesBike = bikeData.duration;
        
        data[i].distanceCar = carData.distance;
        data[i].minutesCar = carData.duration;
    }
    
    fs.writeFileSync(outputFilePath, JSON.stringify(data, null, 4));

    console.log(`Written data in ${outputFilePath}`)
}

module.exports = addDistancesAndDurationsToFile;