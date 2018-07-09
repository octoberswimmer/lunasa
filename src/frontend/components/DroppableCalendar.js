/*
 * Wrap FullCalendar to make it a React-DnD drop target. Provides logic to
 * determine which date a draggable was dropped on.
 *
 * The component defined here exposes the same API as the `FullCalendar`
 * component except that it requires one additional prop: `onDrop`
 *
 * @flow strict
 */

import classNames from "classnames"
import { type DragDropManager, type DragDropMonitor } from "dnd-core"
import $ from "jquery"
import moment from "moment"
import * as React from "react"
import * as dnd from "react-dnd"
import { Consumer as DragDropContextConsumer } from "react-dnd/lib/DragDropContext"
import FullCalendar, { type Props as CalendarProps } from "./FullCalendar"

type Offset = {| x: number, y: number |}

type DropEvent = { date: moment$Moment, accountUrl: string }

// Props required by `DroppableCalendar` in addition to props required by
// `FullCalendar`
type PublicDropProps = {
	className?: string | string[],
	onDrop(DropEvent): void
}

// Props injected by React-DnD
type InjectedProps = {
	connectDropTarget<T: React.Node>(elem: T): T
}

// Props injected by custom `DroppableCalendarWithManager` wrapper
type ManagerProps = { dragDropManager: DragDropManager<any> }

type Props = CalendarProps & PublicDropProps & InjectedProps & ManagerProps

function findDayElements(calendar: FullCalendar): NodeList<HTMLElement> {
	const elem = calendar.getRootElement()
	return elem.querySelectorAll(".fc-day[data-date]")
}

function findByBoundingRect(
	offset: Offset,
	elems: NodeList<HTMLElement>
): ?HTMLElement {
	for (const elem of elems) {
		if (isAtOffset(offset, elem)) {
			return elem
		}
	}
}

// Compare the bounding box of an element to client offset coordinates from a
// React-DnD draggable.
function isAtOffset({ x, y }: Offset, elem: HTMLElement): boolean {
	const { top, left, bottom, right } = elem.getBoundingClientRect()
	return x > left && x < right && y > top && y < bottom
}

// FullCalendar exposes date of each calendar box as a data attribute.
function getDate(elem: HTMLElement): ?moment$Moment {
	const d = elem.getAttribute("data-date")
	if (d) {
		return moment(d).local()
	}
}

export class DroppableCalendar extends React.Component<Props> {
	calendar: { current: null | React.ElementRef<*> }
	monitor: DragDropMonitor
	unsubscribeFromOffsetChange: () => void
	unsubscribeFromStateChange: () => void

	constructor(props: Props) {
		super(props)
		this.calendar = React.createRef()
	}

	componentDidMount() {
		this.monitor = this.props.dragDropManager.getMonitor()
		const onChange = this.onOffsetOrStateChange.bind(this)
		this.unsubscribeFromOffsetChange = this.monitor.subscribeToOffsetChange(
			onChange
		)
		this.unsubscribeFromStateChange = this.monitor.subscribeToStateChange(
			onChange
		)
	}

	componentWillUnmount() {
		this.unsubscribeFromOffsetChange()
		this.unsubscribeFromStateChange()
	}

	getDayElements(): ?NodeList<HTMLElement> {
		const calendar = this.calendar.current
		return calendar && findDayElements(calendar)
	}

	getMatchingDate(clientOffset: Offset): ?moment$Moment {
		const days = this.getDayElements()
		const match = days && findByBoundingRect(clientOffset, days)
		return match && getDate(match)
	}

	highlightMatchingDate(clientOffset: ?Offset) {
		const elems = this.getDayElements()
		for (const elem of elems || []) {
			const toggle = !!clientOffset && isAtOffset(clientOffset, elem)
			$(elem).toggleClass("fc-highlight", toggle)
		}
	}

	onDrop({ clientOffset, item }: { clientOffset: Offset, item: ?Object }) {
		const date = this.getMatchingDate(clientOffset)
		if (
			date &&
			item &&
			item.type === "Account" &&
			typeof item.url === "string"
		) {
			this.props.onDrop({ date, accountUrl: item.url })
		}
	}

	// Runs in response to changes to React-DnD state
	onOffsetOrStateChange() {
		const offset = this.monitor.isDragging()
			? this.monitor.getClientOffset()
			: null
		this.highlightMatchingDate(offset)
	}

	render() {
		const {
			className,
			connectDropTarget,
			dragDropManager,
			...calendarProps
		} = this.props
		return connectDropTarget(
			<div className={classNames(className)}>
				<FullCalendar {...calendarProps} ref={this.calendar} />
			</div>
		)
	}
}

// Define droppable behavior for calendar
const source = {
	drop(
		props: CalendarProps & PublicDropProps,
		monitor: dnd.DropTargetMonitor,
		component: DroppableCalendar
	) {
		component.onDrop({
			clientOffset: monitor.getClientOffset(),
			item: monitor.getItem()
		})
	}
}

// Connect data from React-DnD state to component props
function collect(connect, monitor): InjectedProps {
	return {
		// Wrap elements with `connectDropTarget()` to let React DnD handle the
		// drop events.
		connectDropTarget: connect.dropTarget()
	}
}

const ConnectedDroppableCalendar: React.ComponentType<
	CalendarProps & PublicDropProps & ManagerProps
> = dnd.DropTarget("DragDropable", source, collect)(DroppableCalendar)

// Wrap with a context consumer to get access to the React-DnD dragDropManager.
// We need client offset changes in real time to highlight calendar squares. The
// standard React-DnD API only provides the latest client offset when
// a draggable enters or leaves a drop target (which in our case is the entire
// calendar). The dragDropManager exposes a method to subscribe to every offset
// change.
export default function DroppableCalendarWithManager(
	props: CalendarProps & PublicDropProps
) {
	return (
		<DragDropContextConsumer>
			{({ dragDropManager }) => {
				const augmentedProps = { ...props, dragDropManager }
				return <ConnectedDroppableCalendar {...augmentedProps} />
			}}
		</DragDropContextConsumer>
	)
}
