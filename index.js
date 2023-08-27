const downloadData = require('./downloadData');
const addDistancesAndDurationsToFile = require('./addDistance');

async function main() {
    const command = process.argv[2];
    const outputFile = './results/results.json';
    const distanceFile = './results/results_with_distance.json';

    switch (command) {
        case 'download':
            await downloadData(outputFile);
            break;
        case 'addDistance':
            await addDistancesAndDurationsToFile(outputFile, distanceFile);
            break;
        default:
            await downloadData(outputFile);
            await addDistancesAndDurationsToFile(outputFile, distanceFile);
    }
}


main();
