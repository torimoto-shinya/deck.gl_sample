import React from 'react';

export interface GoogleMapsProps {
	map: GoogleMap;
}

interface GoogleMapsHOCProps {}

interface GoogleMapsHOCState {
	map: GoogleMap | null;
}

const GOOGLE_API_KEY = 'YOUR_API_KEY_HERE';
const URL = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${GOOGLE_API_KEY}`;

class GoogleMap {
	private _map: google.maps.Map | null = null;

	constructor() {
		this._createMap();
	}

	mountTo(parent: HTMLElement) {
		if (!this._map) {
			this._createMap();
		}
		parent.appendChild(this._map!.getDiv());
	}

	getRawInstance() {
		if (!this._map) {
			this._createMap();
		}
		return this._map!;
	}

	setCenter(latlng: google.maps.LatLng | google.maps.LatLngLiteral) {
		if (!this._map) {
			this._createMap();
		}
		return this._map!.setCenter(latlng);
	}

	getCenter() {
		if (!this._map) {
			this._createMap();
		}
		return this._map!.getCenter();
	}

	setZoom(zoom: number) {
		if (!this._map) {
			this._createMap();
		}
		return this._map!.setZoom(zoom);
	}

	getZoom() {
		if (!this._map) {
			this._createMap();
		}
		return this._map!.getZoom();
	}

	getBounds() {
		if (!this._map) {
			this._createMap();
		}
		return this._map!.getBounds();
	}

	setOptions(options: google.maps.MapOptions) {
		if (!this._map) {
			this._createMap();
		}
		return this._map!.setOptions(options);
	}

	addListener(eventName: string, handler: (...args: any[]) => void) {
		if (!this._map) {
			this._createMap();
		}
		return this._map!.addListener(eventName, handler);
	}

	addEventListenerToContainerElement<K extends keyof HTMLElementEventMap>(
		type: K,
		listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
		options?: boolean | AddEventListenerOptions,
	) {
		if (!this._map) {
			this._createMap();
		}
		(this._map!.getDiv() as HTMLElement).addEventListener(type, listener, options);
	}

	removeEventListenerFromContainerElement<K extends keyof HTMLElementEventMap>(
		type: K,
		listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
		options?: boolean | EventListenerOptions,
	) {
		if (!this._map) {
			this._createMap();
		}
		(this._map!.getDiv() as HTMLElement).removeEventListener(type, listener, options);
	}

	get data() {
		if (!this._map) {
			this._createMap();
		}
		return this._map!.data;
	}

	destroy() {
		if (!this._map) {
			return;
		}
		const div = this._map.getDiv();
		const parent = div.parentElement;
		if (parent) {
			parent.removeChild(div);
		}
		google.maps.event.clearListeners(this._map, 'zoom_changed');
		google.maps.event.clearListeners(this._map, 'center_changed');
		google.maps.event.clearListeners(this._map, 'bounds_changed');
		google.maps.event.clearListeners(this._map, 'idle');
		google.maps.event.clearListeners(this._map, 'click');
		this._map.unbindAll();
		this._map = null;
	}

	private _createMap() {
		const mapDiv = document.createElement('div');
		mapDiv.style.width = '100%';
		mapDiv.style.height = '100%';
		this._map = new google.maps.Map(mapDiv, {
			clickableIcons: false,
			disableDefaultUI: false,
			disableDoubleClickZoom: true,
			fullscreenControl: false,
			panControl: false,
			rotateControl: false,
			scaleControl: false,
			streetViewControl: true,
			zoomControl: true,
		});
	}
}

let mapSingleton: GoogleMap | null = null;

export function googleMapsHOC<OriginalProps extends {}>(
	WrappedComponent: React.ComponentType<OriginalProps & GoogleMapsProps>,
) {
	type ResultProps = OriginalProps & GoogleMapsHOCProps;
	return class GoogleMapsHOC extends React.Component<ResultProps, GoogleMapsHOCState> {
		public state: GoogleMapsHOCState = { map: null };

		public componentDidMount() {
			getMap().then(map => this.setState({ map }));
		}

		public render() {
			return this.state.map ? (
				<WrappedComponent {...this.props} map={this.state.map} />
			) : null;
		}
	};
}

export function googleMapsHOCWithRef<OriginalProps extends {}>(
	WrappedComponent: React.ComponentClass<OriginalProps & GoogleMapsProps>,
) {
	type WrappedComponentInstanceType = InstanceType<typeof WrappedComponent>;
	type ResultProps = OriginalProps &
		GoogleMapsHOCProps & { forwardedRef: React.Ref<WrappedComponentInstanceType> };
	class GoogleMapsHOC extends React.Component<ResultProps, GoogleMapsHOCState> {
		public state: GoogleMapsHOCState = { map: null };

		public componentDidMount() {
			getMap().then(map => this.setState({ map }));
		}

		public render() {
			return this.state.map ? (
				<WrappedComponent
					{...this.props as OriginalProps}
					map={this.state.map}
					ref={this.props.forwardedRef}
				/>
			) : null;
		}
	}

	return React.forwardRef<WrappedComponentInstanceType, OriginalProps>((props, ref) => {
		return <GoogleMapsHOC {...props} forwardedRef={ref} />;
	});
}

async function getMap() {
	if (mapSingleton) {
		return mapSingleton;
	}

	if (document.querySelector(`script[src="${URL}"]`)) {
		return mapSingleton!;
	}
	const script = document.createElement('script');
	script.async = true;
	script.src = URL;
	const body = document.body;
	body.appendChild(script);

	while (!('google' in window)) {
		await wait(30);
	}

	mapSingleton = new GoogleMap();

	return mapSingleton;
}

function wait(time: number) {
	return new Promise<void>(r => setTimeout(() => r(), time));
}
