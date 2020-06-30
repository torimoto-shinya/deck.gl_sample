import React from 'react';
import MapArea from './components/map/MapArea';
import Layer from './components/map/Layer';
import './App.css';

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
		// </div>
		<div className="App">
			<MapArea
				lat={49.254}
				lng={-123.13}
				zoom={11}
				onClick={latLng => {
					console.log(`latlng: ${latLng}`);
				}}
			>
				<Layer />
			</MapArea>

		</div>
  );
}

export default App;
