/* @flow strict */

import "fullcalendar" // installs itself as a jquery plugin
import "fullcalendar/dist/fullcalendar.css"
import $ from "jquery"
import * as React from "react"

// TODO: declare fullcalendar initialization options
interface Props {
	weekends?: boolean;
}

export default class FullCalendar extends React.Component<Props> {
	instance: ?Object
	jq: typeof $
	root: React.Ref<"div">

	constructor(props: Props) {
		super(props)
		this.jq = $.noConflict()
		this.root = React.createRef()
	}

	componentDidMount() {
		this.initializeCalendar(this.props)
	}

	// TODO: If the root `div` was not replaced, we could update calendar
	// settings based on changes to props instead of destroying and
	// reinitializing.
	componentDidUpdate(prevProps: Props) {
		this.destroyCalendar()
		this.initializeCalendar(this.props)
	}

	getRootElement(): typeof $ {
		if (this.root.current) {
			return this.jq(this.root.current)
		}
	}

	initializeCalendar(props: Props) {
		const settings = { ...props } // defensive copy of props
		this.instance = this.getRootElement().fullCalendar(settings)
	}

	destroyCalendar() {
		this.getRootElement().fullCalendar("destroy")
		this.instance = null
	}

	render() {
		return <div ref={this.root} />
	}
}
