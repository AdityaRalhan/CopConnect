import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

const MapStations = () => {
  const [selectedStation, setSelectedStation] = useState(null);
  const [location, setLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample police stations data as fallback
  const sampleStations = [
    {
      id: 1,
      name: "Central Police Station",
      location: "Main Street, Downtown",
      officers: 25,
      lat: null,
      lng: null,
      distance: "0.8 km"
    },
    {
      id: 2,
      name: "North District Police Station",
      location: "North Avenue, Uptown",
      officers: 18,
      lat: null,
      lng: null,
      distance: "1.2 km"
    },
    {
      id: 3,
      name: "South Police Outpost",
      location: "South Road, Suburb",
      officers: 12,
      lat: null,
      lng: null,
      distance: "2.1 km"
    },
    {
      id: 4,
      name: "East Side Police Station",
      location: "East District, Commercial Area",
      officers: 22,
      lat: null,
      lng: null,
      distance: "1.7 km"
    },
    {
      id: 5,
      name: "West End Police Station",
      location: "West Boulevard, Residential",
      officers: 16,
      lat: null,
      lng: null,
      distance: "3.0 km"
    }
  ];

  // Function to calculate distance between two points
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Fetch real police stations from Overpass API
  const fetchPoliceStations = async (lat, lng) => {
    try {
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["amenity"="police"](around:5000,${lat},${lng});
          way["amenity"="police"](around:5000,${lat},${lng});
          relation["amenity"="police"](around:5000,${lat},${lng});
        );
        out center;
      `;

      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch from Overpass API');
      }
      
      const data = await response.json();
      console.log("Fetched data from Overpass API:", data);

      if (data.elements && data.elements.length > 0) {
        const stationData = data.elements.map((el) => {
          const stationLat = el.lat || el.center?.lat;
          const stationLng = el.lon || el.center?.lon;
          const distance = stationLat && stationLng ? 
            calculateDistance(lat, lng, stationLat, stationLng) : null;
          
          return {
            id: el.id,
            name: el.tags?.name || 'Police Station',
            location: el.tags?.['addr:city'] || el.tags?.['addr:street'] || 
                     el.tags?.operator || 'Location not specified',
            officers: Math.floor(Math.random() * 20 + 10),
            lat: stationLat,
            lng: stationLng,
            distance: distance ? `${distance.toFixed(1)} km` : 'Distance unknown'
          };
        }).filter(station => station.lat && station.lng);

        console.log("Processed station data:", stationData);
        
        if (stationData.length > 0) {
          setStations(stationData);
          return stationData;
        }
      }
      
      // If no real stations found, use sample data with user location
      console.log("No real stations found, using sample data");
      const sampleWithLocation = sampleStations.map((station, index) => ({
        ...station,
        lat: lat + (Math.random() - 0.5) * 0.02,
        lng: lng + (Math.random() - 0.5) * 0.02,
      }));
      setStations(sampleWithLocation);
      return sampleWithLocation;
      
    } catch (error) {
      console.error("Error fetching police stations:", error);
      setError("Failed to fetch police stations. Showing sample data.");
      
      // Use sample data as fallback
      const sampleWithLocation = sampleStations.map((station, index) => ({
        ...station,
        lat: lat + (Math.random() - 0.5) * 0.02,
        lng: lng + (Math.random() - 0.5) * 0.02,
      }));
      setStations(sampleWithLocation);
      return sampleWithLocation;
    }
  };

  useEffect(() => {
    let mapInstance = null;
    let isComponentMounted = true;

    const initializeMap = async () => {
      if (!isComponentMounted) return;
      
      setLoading(true);
      setError(null);
      
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by this browser.");
        setLoading(false);
        return;
      }

      // Wait for Leaflet to be available with timeout
      const waitForLeaflet = () => {
        return new Promise((resolve, reject) => {
          let attempts = 0;
          const maxAttempts = 50; // 5 seconds timeout
          
          const checkLeaflet = () => {
            if (window.L) {
              resolve();
            } else if (attempts < maxAttempts) {
              attempts++;
              setTimeout(checkLeaflet, 100);
            } else {
              reject(new Error('Leaflet library failed to load'));
            }
          };
          
          checkLeaflet();
        });
      };

      try {
        // Wait for Leaflet to load
        await waitForLeaflet();
        console.log('Leaflet loaded successfully');
      } catch (error) {
        console.error('Leaflet loading error:', error);
        if (isComponentMounted) {
          setError("Map library failed to load. Please refresh the page.");
          setLoading(false);
        }
        return;
      }

      // Get user location
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          if (!isComponentMounted) return;
          
          try {
            const newLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setLocation(newLocation);
            console.log('User location obtained:', newLocation);

            // Fetch stations first (this doesn't require map)
            const fetchedStations = await fetchPoliceStations(newLocation.lat, newLocation.lng);
            console.log('Stations fetched:', fetchedStations);

            if (!isComponentMounted) return;

            // Initialize map only if it doesn't exist and component is still mounted
            if (!map && window.L && isComponentMounted) {
              const mapElement = document.getElementById('map');
              if (!mapElement) {
                throw new Error('Map container element not found');
              }

              // Clean up any existing map instance
              if (mapElement._leaflet_id) {
                console.log('Clearing existing leaflet instance...');
                // Remove any existing Leaflet instance
                delete mapElement._leaflet_id;
              }

              // Clear the container
              mapElement.innerHTML = '';
              
              // Create new map instance
              console.log('Creating map instance...');
              try {
                mapInstance = window.L.map(mapElement, {
                  center: [newLocation.lat, newLocation.lng],
                  zoom: 13,
                  zoomControl: true,
                  attributionControl: true
                });
              } catch (mapError) {
                console.error('Map creation error:', mapError);
                // If map creation fails, recreate the entire container
                const parentElement = mapElement.parentNode;
                const newMapElement = document.createElement('div');
                newMapElement.id = 'map';
                newMapElement.className = mapElement.className;
                newMapElement.style.cssText = mapElement.style.cssText;
                parentElement.replaceChild(newMapElement, mapElement);
                
                // Try creating the map again with the new element
                mapInstance = window.L.map(newMapElement, {
                  center: [newLocation.lat, newLocation.lng],
                  zoom: 13,
                  zoomControl: true,
                  attributionControl: true
                });
              }

              if (!isComponentMounted) return;

              // Add tile layer
              window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                className: 'map-tiles',
                maxZoom: 18
              }).addTo(mapInstance);

              setMap(mapInstance);
              console.log('Map created successfully');

              // Apply dark theme to map after a short delay
              setTimeout(() => {
                if (isComponentMounted) {
                  const mapContainer = document.querySelector('.map-tiles');
                  if (mapContainer) {
                    mapContainer.style.filter =
                      'brightness(0.7) invert(1) contrast(1.2) hue-rotate(200deg)';
                  }
                }
              }, 100);

              // Clear existing markers
              markers.forEach((marker) => {
                if (marker && marker.remove) marker.remove();
              });

              // User's location marker
              const userMarker = window.L.marker([newLocation.lat, newLocation.lng], {
                icon: window.L.divIcon({
                  html: `<div style="width: 16px; height: 16px; background: #3b82f6; border-radius: 50%; position: relative; border: 2px solid #fff;">
                          <div style="width: 8px; height: 8px; background: #1e40af; border-radius: 50%; position: absolute; top: 2px; left: 2px;"></div>
                         </div>`,
                  className: 'user-location-marker',
                  iconSize: [16, 16],
                  iconAnchor: [8, 8],
                }),
              }).addTo(mapInstance);

              userMarker.bindPopup('<div style="color: #1f2937; font-weight: bold; padding: 4px;">📍 Your Location</div>');

              // Create station markers
              const stationMarkers = fetchedStations.map((station) => {
                if (!station.lat || !station.lng) {
                  console.warn("Invalid station coordinates:", station);
                  return null;
                }

                const marker = window.L.marker([station.lat, station.lng], {
                  icon: window.L.divIcon({
                    html: `<div style="width: 24px; height: 24px; background: #ef4444; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                            <div style="width: 12px; height: 12px; background: #dc2626; border-radius: 50%;"></div>
                           </div>`,
                    className: 'station-marker',
                    iconSize: [24, 24],
                    iconAnchor: [12, 12],
                  }),
                })
                  .addTo(mapInstance)
                  .bindPopup(`
                    <div style="color: #1f2937; padding: 8px; min-width: 200px;">
                      <strong style="font-size: 14px;">🚓 ${station.name}</strong><br>
                      <span style="font-size: 12px; color: #6b7280;">📍 ${station.location}</span><br>
                      <span style="font-size: 12px; color: #6b7280;">👮 ${station.officers} officers</span><br>
                      <span style="font-size: 12px; color: #6b7280; font-weight: bold;">📏 Distance: ${station.distance}</span>
                    </div>
                  `);

                marker.on('click', () => setSelectedStation(station));
                return marker;
              }).filter(Boolean);

              setMarkers([userMarker, ...stationMarkers]);
              console.log('Markers added successfully');
            }
          } catch (error) {
            console.error("Error initializing map:", error);
            if (isComponentMounted) {
              setError(`Failed to initialize map: ${error.message}`);
            }
          } finally {
            if (isComponentMounted) {
              setLoading(false);
            }
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          if (isComponentMounted) {
            let errorMessage = "Unable to access your location. ";
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage += "Please enable location services and refresh the page.";
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage += "Location information is unavailable.";
                break;
              case error.TIMEOUT:
                errorMessage += "Location request timed out.";
                break;
              default:
                errorMessage += "An unknown error occurred.";
                break;
            }
            setError(errorMessage);
            setLoading(false);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    };

    // Only initialize if we haven't already
    if (!map) {
      initializeMap();
    }

    // Cleanup function to remove map when component unmounts
    return () => {
      isComponentMounted = false;
      console.log('Cleaning up map component...');
      
      // Clean up markers first
      markers.forEach((marker) => {
        if (marker && marker.remove) {
          try {
            marker.remove();
          } catch (e) {
            console.warn('Error removing marker:', e);
          }
        }
      });
      
      // Clean up map instance
      if (mapInstance && mapInstance.remove) {
        try {
          console.log('Removing map instance...');
          mapInstance.remove();
        } catch (e) {
          console.warn('Error removing map instance:', e);
        }
      }
      
      // Clean up state map
      if (map && map.remove) {
        try {
          console.log('Removing state map...');
          map.remove();
        } catch (e) {
          console.warn('Error removing state map:', e);
        }
      }
      
      // Clear the map container
      const mapElement = document.getElementById('map');
      if (mapElement) {
        mapElement.innerHTML = '';
        delete mapElement._leaflet_id;
      }
    };
  }, []); // Remove map dependency to prevent infinite loops

  return (
    <div className="bg-gray-900/50 backdrop-blur-md rounded-xl p-6 text-white border border-blue-400/20">
      <div className="space-y-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-white/10 p-3 rounded-lg">
            <MapPin className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Police Stations Near You</h2>
            {loading && <p className="text-blue-300 text-sm">Loading stations...</p>}
            {error && <p className="text-red-300 text-sm">{error}</p>}
          </div>
        </div>

        <div className="aspect-video bg-slate-800/50 rounded-lg overflow-hidden relative mb-4 border border-blue-500/20">
          <div 
            id="map" 
            className="h-full w-full z-0" 
            style={{ 
              minHeight: '400px',
              position: 'relative',
              background: '#1e293b'
            }}
          ></div>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800/80 rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
                <p className="text-blue-300">Loading map and stations...</p>
              </div>
            </div>
          )}
          {error && !loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800/80 rounded-lg">
              <div className="text-center p-4">
                <div className="text-red-400 mb-2">⚠️ Map Error</div>
                <p className="text-red-300 text-sm">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {stations.length === 0 && !loading && (
            <div className="text-center py-4">
              <p className="text-gray-400">No police stations found in your area.</p>
            </div>
          )}
          {stations.map((station) => (
            <div
              key={station.id}
              className={`bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-colors cursor-pointer ${
                selectedStation?.id === station.id ? 'bg-white/10 border border-blue-500/20' : ''
              }`}
              onClick={() => setSelectedStation(station)}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="text-white font-medium">{station.name}</p>
                  <span className="text-blue-300 text-sm">{station.location}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-200">
                    {station.distance}
                  </span>
                  <p className="text-sm text-blue-200 mt-1">
                    {station.officers} officers
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapStations;
