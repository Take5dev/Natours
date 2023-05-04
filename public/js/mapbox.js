/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiY2FnbGlvc3Ryb2l6IiwiYSI6ImNsaDY3ZzR1bzAzZ2Mza25zajR3YTF4b2YifQ.tm4WNDKcf-ZhtdBPLmVGhg';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/cagliostroiz/clh67zy2j00sc01pg7tcoa8wl',
    //   center: [-118, 34],
    //   zoom: 6,
    //   interactive: false,
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 200,
      right: 200,
    },
  });
};
