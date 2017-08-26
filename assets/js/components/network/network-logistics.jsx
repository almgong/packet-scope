import React, { Component } from 'react';

/**
 * Controlled component that displays the network logistics (IP address, interface name, etc.).
**/

class NetworkLogistics extends Component {
	constructor() {
		super();

		this._ip = '192.168.0.1';
	}

	render() {
		return (
			<div className="my-1">
				<h4>Network Logistics:</h4>
				<div>
					network: {this._ip} 
				</div>
			</div>
		);
	}
}

export default NetworkLogistics;