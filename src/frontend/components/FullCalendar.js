/* @flow strict */

import * as fullcalendar from "fullcalendar"
import "fullcalendar/dist/fullcalendar.css"
import jQuery from "jquery"
import * as React from "react"
import "./FullCalendar.css"

// Use the jQuery interface exported by fullcalendar, which adds the
// `$.fn.fullCalendar()` function. This is just a type-level distinction: in
// reality fullcalendar adds its method to the global JQuery object.
const $: fullcalendar.JQueryStatic = (jQuery: any)

export type Props = {
	defaultTimedEventDuration?: moment$MomentDuration,
	events?: fullcalendar.EventObjectInput[],
	language?: ?string,
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
		this.fixUpStyles()
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
		this.fixUpStyles()
	}

	componentWillUnmount() {
		this.destroyCalendar()
	}

	fixUpStyles() {
		const $root = $(this.getRootElement())
		$root.find(".fc-left h2").addClass("slds-text-heading--medium")
	}

	getRootElement(): HTMLDivElement {
		if (!this.root.current) {
			throw new Error("Unable to find DOM mount point for calendar")
		}
		return this.root.current
	}

	async initializeCalendar() {
		const options: fullcalendar.Options = { ...this.props.options }
		const locale =
			this.props.language && lookupFullcalendarLocale(this.props.language)
		if (locale) {
			// $FlowFixMe: do not type-check dynamically-computed module path.
			await import(`fullcalendar/dist/locale/${locale}`)
			options.locale = locale
		}
		// Do not call `new Calendar()` directly because there is some necessary
		// logic in `$.fn.fullCalendar()`.
		const $elem = $(this.getRootElement())

		$elem.fullCalendar(this.props.options || {})
		this.instance = $elem.fullCalendar("getCalendar")
		if (this.props.defaultTimedEventDuration) {
			this.instance.defaultTimedEventDuration = this.props.defaultTimedEventDuration
		}
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
		return (
			<div className="calendar">
				<div className="calendar-mount-point" ref={this.root} />
			</div>
		)
	}
}

// This list is based on file names in
// `node_modules/fullcalendar/dist/locale/`
const availableLanguages = [
	"af",
	"ar-dz",
	"ar",
	"ar-kw",
	"ar-ly",
	"ar-ma",
	"ar-sa",
	"ar-tn",
	"bg",
	"bs",
	"ca",
	"cs",
	"da",
	"de-at",
	"de-ch",
	"de",
	"el",
	"en-au",
	"en-ca",
	"en-gb",
	"en-ie",
	"en-nz",
	"es-do",
	"es",
	"es-us",
	"et",
	"eu",
	"fa",
	"fi",
	"fr-ca",
	"fr-ch",
	"fr",
	"gl",
	"he",
	"hi",
	"hr",
	"hu",
	"id",
	"is",
	"it",
	"ja",
	"ka",
	"kk",
	"ko",
	"lb",
	"lt",
	"lv",
	"mk",
	"ms",
	"ms-my",
	"nb",
	"nl-be",
	"nl",
	"nn",
	"pl",
	"pt-br",
	"pt",
	"ro",
	"ru",
	"sk",
	"sl",
	"sq",
	"sr-cyrl",
	"sr",
	"sv",
	"th",
	"tr",
	"uk",
	"vi",
	"zh-cn",
	"zh-tw"
]

export function lookupFullcalendarLocale(lang: string): ?string {
	const userLang = lang.toLowerCase().replace("_", "-")
	return (
		availableLanguages.find(l => userLang === l) ||
		availableLanguages.find(l => userLang.startsWith(l))
	)
}
