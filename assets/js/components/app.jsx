import React from 'react';
import ReactDOM from 'react-dom';

// components
import NetworkLogistics from './network/network-logistics';
import PacketIndex from './packet/packet-index';

/** 
 * Top-level, main application component for our single page app. All components on the page will be 
 * rendered through this entry point.
**/

let ROOT_SELECTOR_ID = 'react-root';

class View extends React.Component {
	constructor() {
		super();
	}

	render() {
		return(
			<div>
				<NetworkLogistics />
				<hr />
				<PacketIndex />
			</div>
		);
	}
}

ReactDOM.render(
	<View />,
	document.getElementById(ROOT_SELECTOR_ID)
);
