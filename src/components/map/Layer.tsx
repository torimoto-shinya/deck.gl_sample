import React from 'react';
import { googleMapsHOC, GoogleMapsProps } from '../hoc/GoogleMapsHOC';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { GeoJsonLayer } from '@deck.gl/layers';
import { RGBAColor } from 'deck.gl';

interface Props {

}

interface EarthquekeProps {
	properties: {
		mag: number;
		valuePerSqm: number;
		growth: number;
	}
}

class Layer extends React.Component<Props & GoogleMapsProps> {
	componentDidMount() {
    const COLOR_SCALE: RGBAColor[] = [
      // negative
      [65, 182, 196],
      [127, 205, 187],
      [199, 233, 180],
      [237, 248, 177],

      // positive
      [255, 255, 204],
      [255, 237, 160],
      [254, 217, 118],
      [254, 178, 76],
      [253, 141, 60],
      [252, 78, 42],
      [227, 26, 28],
      [189, 0, 38],
      [128, 0, 38]
		];
		const colorScale = (x: number): RGBAColor => {
      const i = Math.round(x * 7) + 4;
      if (x < 0) {
        return COLOR_SCALE[i] || COLOR_SCALE[0];
      }
      return COLOR_SCALE[i] || COLOR_SCALE[COLOR_SCALE.length - 1];
		}
		
		const map = this.props.map.getRawInstance();
		const overlay = new GoogleMapsOverlay({
			layers: [
				new GeoJsonLayer({
					id: 'test',
					data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/geojson/vancouver-blocks.json',
					opacity: 0.8,
					stroked: false,
					filled: true,
					extruded: true,
					wireframe: true,
		
					getElevation: (f: EarthquekeProps) => Math.sqrt(f.properties.valuePerSqm) * 10,
					getFillColor: (f: EarthquekeProps) => colorScale(f.properties.growth),
					getLineColor: [255, 255, 255],
		
					pickable: true,
					onClick: e => {
						console.log(e);
					},
					onDataLoad: val => {
						console.log('data load!');
						console.log(val);
					}
				}),
				new GeoJsonLayer({
					id: 'google',
					data: 'https://storage.googleapis.com/mapsdevsite/json/google.json',
					filled: true,
					opacity: 0.5,
					stroked: true,
					getLineColor: [255, 255, 255],
					extruded: true,
					wireframe: true,
					pickable: true,

					onDataLoad: val => {
						console.log('data load!');
						console.log(val);
					},
					onClick: e => {
						console.log(e);
					},
					
				})
			],
		});
		overlay.setMap(map);
	}
	public render() {
		return null;
	}
}

export default googleMapsHOC(Layer);
