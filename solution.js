const cluster = require('cluster');
const os = require('os');
const fs = require('fs');
const {promisify} = require('util');
const appendFile = promisify(fs.appendFile);
const readFile = promisify(fs.readFile);


process.on('unhandledRejection', (err) => {
    console.error(err);
});

if (cluster.isMaster) {

    const cityGrouped = {};
    const workers = [];


    dataSet.forEach((product) => {

        let cityInGroup = cityGrouped[product.cityId];
        if (!cityInGroup) {
            cityGrouped[product.cityId] = {'HOTEL': [], 'FLIGHT': []};
            cityGrouped[product.cityId][product.type].push(product);
        } else {
            cityInGroup[product.type].push(product);
        }

    });
    let c = 0;
    let ans = 0;
    for (let i = 0; i < os.cpus().length; i++) {
        const w = cluster.fork();

        w.on('message', (message) => {
            //console.log("Reiceiving from worker:");


            if (message.type === 'CITY_PROCESSED') {
                ans++;
                if (ans === c) {
                    process.exit(0);
                }
            } else {
                const hotel = message.hotel;
                const flight = message.flight;
                appendFile('solution.csv', hotel.id + ',' + flight.id + os.EOL);
            }

        });
        workers.push(w);
    }

    Object.keys(cityGrouped).forEach((cityKey) => {
        const cityData = cityGrouped[cityKey];
        workers[c % os.cpus().length].send({data: cityData});
        c++;
    });


}


if (cluster.isWorker) {

    process.on('message', function (msg) {
        //console.log("Worker: " + cluster.worker.id + " Received from master");
        //console.log("Sending to master!");
        // process.send({isWorker: cluster.isWorker});
        processCity(msg.data);
    });
}

function processCity(cityData) {
    const hotels = cityData.HOTEL;
    const flights = cityData.FLIGHT;

    hotels.forEach((hotel) => {
        flights.forEach((f) => {
            if (hotel.cost + f.cost === 30000) {

                process.send({
                    hotel: {id: hotel.id, cost: hotel.cost},
                    flight: {id: f.id, cost: f.cost}
                });


            }
        });
    });
    process.send({type: 'CITY_PROCESSED'});

}