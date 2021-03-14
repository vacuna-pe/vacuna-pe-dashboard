import React, { useRef, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { useUsers } from './dbUtils';
// import Marker from './Marker';
import { ExportToCsv } from 'export-to-csv';

import './map.css';
import useSupercluster from "use-supercluster";


const Marker = ({ children }) => children;

export default function App() {
  const mapRef = useRef();
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(10);

  const users = useUsers();

  const usersList = users ? Object.values(users) : [];

  const points = usersList.map(user => {
    const longitude = parseFloat(user.position[1]);
    const latitude = parseFloat(user.position[0]);

    // console.log(latitude, longitude);
    return ({
    type: "Feature",
    properties: { cluster: false, userId: 'fuahfwoauf', category: 'some category' },
    geometry: {
      type: "Point",
      coordinates: [longitude, latitude]
    }
  });
});

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 }
  });



  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyAhZras7mdgGSrDTCrMsz3PhRHxyI_JNWk' }}
        defaultCenter={{ lat: -12.060521, lng: -77.047550 }}
        defaultZoom={10}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map }) => {
          mapRef.current = map;
        }}
        onChange={({ zoom, bounds }) => {
          setZoom(zoom);
          setBounds([
            bounds.nw.lng,
            bounds.se.lat,
            bounds.se.lng,
            bounds.nw.lat
          ]);
        }}
      >
        {clusters.map(cluster => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const {
            cluster: isCluster,
            point_count: pointCount
          } = cluster.properties;

          if (isCluster) {
            return (
              <Marker
                key={`cluster-${cluster.id}`}
                lat={latitude}
                lng={longitude}
              >
                <div
                  className="cluster-marker"
                  style={{
                    width: `${10 + (pointCount / points.length) * 50}px`,
                    height: `${10 + (pointCount / points.length) * 50}px`,
                    color: 'white',
                    borderRadius: '100%',
                    backgroundColor: '#1A73E8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                  }}
                  onClick={() => {
                    const expansionZoom = Math.min(
                      supercluster.getClusterExpansionZoom(cluster.id),
                      20
                    );
                    mapRef.current.setZoom(expansionZoom);
                    mapRef.current.panTo({ lat: latitude, lng: longitude });
                  }}
                >
                  {pointCount}
                </div>
              </Marker>
            );
          }

          return (
            <Marker
              key={`user-${cluster.properties.phoneNumber}`}
              lat={latitude}
              lng={longitude}
            >
              <div style={{
                width: '10px',
                height: '10px',
                background: '#1A73E8',
                borderRadius: '100%',
                // boxShadow: `2px 2px 15px 2px rgba(0, 0, 0, 0.18)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}></div>
            </Marker>
          );
        })}
      </GoogleMapReact>
      <div class="sidepanel">
        <div style={{ padding: 20 }}>
          <div style={{ fontSize: 24, paddingBottom: 12}}>Vacuna pe</div>
          <div style={{ paddingBottom: 16 }}>personas registradas:  {usersList.length}</div>
          <button onClick={() => {
            const options = {
              fieldSeparator: ',',
              quoteStrings: '"',
              decimalSeparator: '.',
              showLabels: true,
              showTitle: true,
              title: 'vacunatepedata',
              useTextFile: false,
              useBom: true,
              useKeysAsHeaders: true,
            };

            const csvExporter = new ExportToCsv(options);

            csvExporter.generateCsv(usersList);

          }}>descargar como csv</button>
        </div>
      </div>
    </div>
  );
}
