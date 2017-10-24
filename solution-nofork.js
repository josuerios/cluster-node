const cluster = require('cluster');
const os = require('os');


if (cluster.isMaster) {

	const dataSet = require('./dataset-sm.json');
	const cityGrouped = {};


	dataSet.forEach((product) => {

		let cityInGroup = cityGrouped[product.cityId];
		if (!cityInGroup) {
			cityGrouped[product.cityId] = {'HOTEL': [], 'FLIGHT': []};
			cityGrouped[product.cityId][product.type].push(product);
		} else {
			cityInGroup[product.type].push(product);
		}

	});


	console.time('algo');
	Object.keys(cityGrouped).forEach((cityKey) => {
		const cityData = cityGrouped[cityKey];
		processCity(cityData);
	});
	console.timeEnd('algo');


}


function processCity(cityData) {
	const hotels = cityData.HOTEL;
	const flights = cityData.FLIGHT;

	hotels.forEach((hotel) => {
		flights.forEach((f) => {
			if (hotel.cost + f.cost > 15000) {
				//console.log({
				//    hotel: {id: hotel.id, cost: hotel.cost},
				//    flight: {id: f.id, cost: f.cost}
				//});
			}
		});
	});

}