/* @flow strict */

import * as fullcalendar from "fullcalendar"
import "fullcalendar/dist/fullcalendar.css"
import jQuery from "jquery"
import * as React from "react"

// Use the jQuery interface exported by fullcalendar, which adds the
// `$.fn.fullCalendar()` function. This is just a type-level distinction: in
// reality fullcalendar adds its method to the global JQuery object.
const $: fullcalendar.JQueryStatic = (jQuery: any)

type Props = {
	className?: string,
	events?: fullcalendar.EventObjectInput[],
	options?: fullcalendar.Options
}

export default class FullCalendar extends React.Component<Props> {
	instance: ?fullcalendar.Calendar
	root: { current: null | React.ElementRef<"div"> }

	constructor(props: Props) {
		super(props)
		this.root = React.createRef()
	}

	componentDidMount() {
		this.initializeCalendar()
		this.displayEvents()
	}

	componentDidUpdate(prevProps: Props) {
		// Reinitialize calendar if root element was replaced.
		const calendar = $(this.getRootElement()).fullCalendar("getCalendar")
		const instance = this.instance
		if (!(calendar instanceof fullcalendar.Calendar) || calendar !== instance) {
			this.destroyCalendar()
			this.initializeCalendar()
		} else if (instance) {
			instance.option(this.props.options || {})
			this.displayEvents()
		}
	}

	componentWillUnmount() {
		this.destroyCalendar()
	}

	getRootElement(): HTMLDivElement {
		if (!this.root.current) {
			throw new Error("Unable to find DOM mount point for calendar")
		}
		return this.root.current
	}

	initializeCalendar() {
		// Do not call `new Calendar()` directly because there is some necessary
		// logic in `$.fn.fullCalendar()`.
		const $elem = $(this.getRootElement())
		$elem.fullCalendar(this.props.options || {})
		this.instance = $elem.fullCalendar("getCalendar")
	}

	destroyCalendar() {
		if (this.instance) {
			this.instance.destroy()
			this.instance = null
		}
	}

	displayEvents() {
		const events: fullcalendar.EventObjectInput[] = this.props.events || []
		const instance = this.instance
		if (instance) {
			instance.removeEventSources()
			instance.addEventSource(events)
		}
	}

	render() {
		return <div className={this.props.className || ""} ref={this.root} />
	}
}
