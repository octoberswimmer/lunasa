/* @flow strict */

import * as React from "react"
import "./Modal.css"

type Props = {
	children: React.Node,
	onRequestClose(): void
}

export default function Modal({ children, onRequestClose }: Props) {
	return (
		<div className="modal">
			<button onClick={onRequestClose}>[close]</button>
			<div className="modal-inner">{children}</div>
		</div>
	)
}
