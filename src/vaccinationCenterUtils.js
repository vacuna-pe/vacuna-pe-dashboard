

function getClosestVaccinationCenters(lat, lon, num, callback) {

    const data = JSON.stringify({
        CodDisa: 0,
        CodDist: "",
        CodDpto: "",
        CodProv: ""
    })

    const options = {
        hostname: 'gis.minsa.gob.pe',
        //port: 443,
        path: '/WebApiRep2/api/Establecimiento/ListarPuntosVacunacion',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
    }

    const response = await fetch(url, options);
    return response.json();
}
