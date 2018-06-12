/* @flow strict */

import { type JQueryStatic, type Options, Calendar } from "fullcalendar"
import "fullcalendar/dist/fullcalendar.css"
import jQuery from "jquery"
import * as React from "react"

// Use the jQuery interface exported by fullcalendar, which adds the
// `$.fn.fullCalendar()` function. This is just a type-level distinction: in
// reality fullcalendar adds its method to the global JQuery object.
const $: JQueryStatic = (jQuery: any)

type Props = {
	options?: Options
}

export default class FullCalendar extends React.Component<Props> {
	instance: ?Calendar
	root: { current: null | React.ElementRef<"div"> }

	constructor(props: Props) {
		super(props)
		this.root = React.createRef()
	}

	componentDidMount() {
		this.initializeCalendar(this.props)
	}

	componentDidUpdate(prevProps: Props) {
		// Reinitialize calendar if root element was replaced.
		const calendar = $(this.getRootElement()).fullCalendar("getCalendar")
		const instance = this.instance
		if (!(calendar instanceof Calendar) || calendar !== instance) {
			this.destroyCalendar()
			this.initializeCalendar(this.props)
		} else if (instance && this.props.options) {
			instance.option(this.props.options)
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

	initializeCalendar(props: Props) {
		// Do not call `new Calendar()` directly because there is some necessary
		// logic in `$.fn.fullCalendar()`.
		const $elem = $(this.getRootElement())
		$elem.fullCalendar(props.options || {})
		this.instance = $elem.fullCalendar("getCalendar")
	}

	destroyCalendar() {
		if (this.instance) {
			this.instance.destroy()
			this.instance = null
		}
	}

	render() {
		return <div ref={this.root} />
	}
}
