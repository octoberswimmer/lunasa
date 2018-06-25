/* @flow strict */

import * as React from "react"
import * as dnd from "react-dnd"

type BaseProps = {
	children({| isDragging: boolean |}): React.Node,
	item: Object // used to identify the thing that is being dragged and dropped
}

type InjectedProps = {
	connectDragSource<T: React.Node>(elem: T): T,
	isDragging: boolean
}

export function Draggable(props: BaseProps & InjectedProps) {
	const { children, connectDragSource, isDragging } = props
	return connectDragSource(children({ isDragging }))
}

const source = {
	beginDrag(props: BaseProps) {
		return props.item
	}
}

function collect(connect, monitor): InjectedProps {
	return {
		// Wrap elements with `connectDragSource()` to let React DnD handle the
		// drag events.
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging()
	}
}

const ConnectedDraggable: React.ComponentType<BaseProps> = dnd.DragSource(
	"DragDropable",
	source,
	collect
)(Draggable)

export default ConnectedDraggable
