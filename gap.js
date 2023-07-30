function sta_epi_angle(station, epicenter) {
	const angle = Math.atan2(epicenter[1] - station[1], epicenter[0] - station[0]);
	let degrees = angle * (180 / Math.PI);
	if (degrees < 0) degrees += 360;
	return degrees;
}

const stations = [];

axios.get("https://exptech.com.tw/api/v1/file/resource/station.json")
	.then(station => {
		station = station.data;
		axios.get("https://exptech.com.tw/api/v1/earthquake/trem-info/643")
			.then(ans => {
				ans = ans.data;
				for (let i = 0; i < ans.station.length; i++) {
					if (!station[ans.station[i].uuid]) continue;
					const angle = sta_epi_angle([Number(station[ans.station[i].uuid].Long.toFixed(2)), Number(station[ans.station[i].uuid].Lat.toFixed(2))], [ans.eq.lon, ans.eq.lat]);
					stations.push(angle);
				}

				stations.sort((a, b) => a - b);
				stations.push(stations[0] + 360);

				let max_angle = 0;
				for (let i = 0; i < stations.length; i++) {
					const angle = stations[i + 1] - stations[i];
					if (angle > max_angle) max_angle = angle;
				}
				console.log(max_angle.toFixed(2));
			});
	});
