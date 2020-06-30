import React, { ReactNode } from 'react';
import { googleMapsHOC, GoogleMapsProps } from '../hoc/GoogleMapsHOC';
import { connect, DispatchProp } from 'react-redux';

interface MapAreaProps {
	lat: number;
	lng: number;
	zoom: number;
	onClick: (latLng: google.maps.LatLngLiteral) => void;
	children: ReactNode;
}

interface MapAreaState {}

class MapArea extends React.Component<MapAreaProps & GoogleMapsProps & DispatchProp, MapAreaState> {
	ref: HTMLDivElement | null = null;
	debounceTimeoutId = -1;

	componentWillUnmount() {
		this.props.map.destroy();
		window.clearTimeout(this.debounceTimeoutId);
	}

	componentDidMount() {
		if (this.ref) {
			this.props.map.mountTo(this.ref);
		}
		const { lat, lng, zoom } = this.props;

		this.props.map.setCenter({ lat, lng });
		this.props.map.setZoom(zoom);
	}

	debounce = (timeout: number, callback: () => void) => {
		window.clearTimeout(this.debounceTimeoutId);
		this.debounceTimeoutId = window.setTimeout(callback, timeout);
	};

	getBounds = (): [number, number, number, number] | null => {
		const bounds = this.props.map.getBounds();
		if (!bounds) {
			return null;
		}
		const north = bounds.getNorthEast().lat();
		const east = bounds.getNorthEast().lng();
		const south = bounds.getSouthWest().lat();
		const west = bounds.getSouthWest().lng();
		/**
		 * Bounds tuple
		 *  +----[1]----+
		 *  |           |
		 * [0]         [2]
		 *  |           |
		 *  +----[3]----+
		 */
		return [west, north, east, south];
	};

	onClick = (event: google.maps.MouseEvent) => {
		this.props.onClick(event.latLng.toJSON());
	};

	render() {
		return (
			<>
				<div
					style={{
						width: '100%',
						height: '100%',
					}}
					ref={(ref) => (this.ref = ref)}
				/>
				{this.props.children}
			</>
		);
	}
}

export default connect()(googleMapsHOC<MapAreaProps & DispatchProp>(MapArea));
