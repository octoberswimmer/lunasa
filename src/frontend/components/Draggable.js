/* @flow strict */

import $ from "jquery"
import "jquery-ui/ui/widgets/draggable"
import "jquery-ui/themes/base/draggable.css"
import { defaultTimedEventDuration } from "../models/Event"

import * as React from "react"

// `Identifier` data identifies the item being dragged to a drop target.
export type Identifier = {
	type: string,
	url: string
}

type Props = {
	children: React.Node,
	duration?: moment$MomentDuration, // Event duration to show when hovering over Fullcalendar
	identifier?: Identifier, // data to attach to draggable that can be read by a droppable handler
	options?: Object // for options see http://api.jqueryui.com/draggable/
}

export default class Draggable extends React.Component<Props> {
	ref = React.createRef()

	componentDidMount() {
		this.initDraggable()
	}

	componentDidUpdate() {
		this.initDraggable()
	}

	initDraggable() {
		const elem = this.ref.current
		if (elem) {
			const $elem = $(elem)
			$elem.draggable(this.props.options || {})
			if (this.props.identifier) {
				$elem.data({ identifier: this.props.identifier })
			}
			$elem.data({ duration: this.props.duration || defaultTimedEventDuration })
		}
	}

	render() {
		return (
			<div className="draggable" ref={this.ref}>
				{this.props.children}
			</div>
		)
	}
}

export function getIdentifierFromDraggable(
	elem: EventTarget | HTMLElement | JQuery
): ?Identifier {
	return $(elem).data("identifier")
}
