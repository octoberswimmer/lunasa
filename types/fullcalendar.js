/**
 * Flow type definitions adapted from fullcalendar/dist/fullcalendar.d.ts
 */

declare type Global$JQueryStatic = JQueryStatic
declare type Global$JQuery = JQuery

declare module "fullcalendar" {
	declare type Duration = moment$MomentDuration
	declare type Locale = moment$LocaleData
	declare type Moment = moment$Moment

	declare export interface JQueryStatic extends Global$JQueryStatic {
		fullCalendar: Object;
		(selector: string, context?: Element | Global$JQuery): JQuery;
		(element: Element): JQuery;
	}

	declare export interface JQuery extends Global$JQuery {
		fullCalendar(options?: Object & $Shape<OptionsInput>): JQuery;
		fullCalendar(method: "getCalendar"): Calendar;
		fullCalendar(method: "getView"): View;
		fullCalendar(method: "destroy"): JQuery;
		fullCalendar(method: "option", name: string | Object, value?: any): any;
		fullCalendar(method: "isValidViewType", viewType: string): boolean;
		fullCalendar(
			method: "changeView",
			viewName: string,
			dateOrRange?: RangeInput | MomentInput
		): JQuery;
		fullCalendar(method: "zoomTo", newDate: Moment, viewType?: string): JQuery;
		fullCalendar(method: "prev"): JQuery;
		fullCalendar(method: "next"): JQuery;
		fullCalendar(method: "prevYear"): JQuery;
		fullCalendar(method: "nextYear"): JQuery;
		fullCalendar(method: "today"): JQuery;
		fullCalendar(method: "gotoDate", zonedDateInput: any): JQuery;
		fullCalendar(method: "incrementDate", delta: any): JQuery;
		fullCalendar(method: "getDate"): Moment;
		fullCalendar(method: "render"): JQuery;
		fullCalendar(
			method: "select",
			zonedStartInput: MomentInput,
			zonedEndInput?: MomentInput,
			resourceId?: string
		): JQuery;
		fullCalendar(method: "unselect"): JQuery;
		fullCalendar(method: "moment", ...args: any[]): Moment;
		fullCalendar(method: "getNow"): Moment;
		fullCalendar(method: "rerenderEvents"): JQuery;
		fullCalendar(method: "refetchEvents"): JQuery;
		fullCalendar(
			method: "renderEvents",
			eventInputs: EventObjectInput[],
			isSticky?: boolean
		): JQuery;
		fullCalendar(
			method: "renderEvent",
			eventInput: EventObjectInput,
			isSticky?: boolean
		): JQuery;
		fullCalendar(method: "removeEvents", legacyQuery?: any): JQuery;
		fullCalendar(method: "clientEvents", legacyQuery: any): any;
		fullCalendar(
			method: "updateEvents",
			eventPropsArray: EventObjectInput[]
		): JQuery;
		fullCalendar(method: "updateEvent", eventProps: EventObjectInput): JQuery;
		fullCalendar(method: "getEventSources"): EventSource;
		fullCalendar(method: "getEventSourceById", id: any): EventSource;
		fullCalendar(
			method: "addEventSource",
			sourceInput: EventSourceInput
		): JQuery;
		fullCalendar(method: "removeEventSources", sourceMultiQuery: any): JQuery;
		fullCalendar(method: "removeEventSource", sourceQuery: any): JQuery;
		fullCalendar(method: "refetchEventSources", sourceMultiQuery: any): JQuery;
	}

	declare export var version: string
	declare export var internalApiVersion: number

	// 'fullcalendar/src/util'
	declare export function getOuterRect(
		el: any,
		origin?: any
	): {
		left: number,
		right: any,
		top: number,
		bottom: any
	}
	declare export function getClientRect(
		el: any,
		origin?: any
	): {
		left: number,
		right: any,
		top: number,
		bottom: any
	}
	declare export function getContentRect(
		el: any,
		origin: any
	): {
		left: number,
		right: any,
		top: number,
		bottom: any
	}
	declare export function getScrollbarWidths(el: any): any
	declare export function preventDefault(ev: any): void
	declare export function parseFieldSpecs(input: any): any[]
	declare export function compareByFieldSpecs(
		obj1: any,
		obj2: any,
		fieldSpecs: any,
		obj1fallback?: any,
		obj2fallback?: any
	): any
	declare export function compareByFieldSpec(
		obj1: any,
		obj2: any,
		fieldSpec: any,
		obj1fallback: any,
		obj2fallback: any
	): any
	declare export function flexibleCompare(a: any, b: any): number
	declare export function computeGreatestUnit(start: any, end?: any): any
	declare export function divideRangeByDuration(
		start: any,
		end: any,
		dur: any
	): number
	declare export function divideDurationByDuration(dur1: any, dur2: any): number
	declare export function multiplyDuration(dur: any, n: any): Duration
	declare export function durationHasTime(dur: any): boolean
	declare export function log(...args: any[]): any
	declare export function warn(...args: any[]): any
	declare export function applyAll(functions: any, thisObj: any, args: any): any
	declare export function removeExact(array: any, exactVal: any): number
	declare export function htmlEscape(s: any): string
	declare export function cssToStr(cssProps: any): string
	declare export function capitaliseFirstLetter(str: any): any
	declare export function isInt(n: any): boolean
	declare export function proxy(obj: any, methodName: any): () => any
	declare export function debounce(
		func: any,
		wait: any,
		immediate?: boolean
	): () => any

	declare export class Mixin {
		static mixInto(destClass: any): void;
		static mixOver(destClass: any): void;
	}

	declare export interface EmitterInterface {
		on(types: any, handler: any): any;
		one(types: any, handler: any): any;
		off(types: any, handler: any): any;
		trigger(types: any, ...args: any[]): any;
		triggerWith(types: any, context: any, args: any): any;
		hasHandlers(type: any): any;
	}

	declare export class EmitterMixin extends Mixin implements EmitterInterface {
		_prepareIntercept(handler: any): (ev: any, extra: any) => any;
		on(types: any, handler: any): this;
		one(types: any, handler: any): this;
		off(types: any, handler: any): this;
		trigger(types: any, ...args: any[]): this;
		triggerWith(types: any, context: any, args: any): this;
		hasHandlers(type: any): boolean;
	}

	declare export class TaskQueue implements EmitterInterface {
		on(types: any, handler: any): this;
		one(types: any, handler: any): this;
		off(types: any, handler: any): this;
		trigger(types: any, ...args: any[]): this;
		triggerWith(types: any, context: any, args: any): this;
		hasHandlers(type: any): boolean;
		q: any;
		isPaused: boolean;
		isRunning: boolean;
		queue(...args: any[]): void;
		pause(): void;
		resume(): void;
		getIsIdle(): boolean;
		tryStart(): void;
		canRunNext(): any;
		runRemaining(): void;
		runTask(task: any): any;
	}

	declare export class RenderQueue extends TaskQueue {
		waitsByNamespace: any;
		waitNamespace: any;
		waitId: any;
		constructor(waitsByNamespace: any): this;
		queue(taskFunc: any, namespace: any, type: any): void;
		startWait(namespace: any, waitMs: any): void;
		delayWait(waitMs: any): void;
		spawnWait(waitMs: any): void;
		clearWait(): void;
		canRunNext(): boolean;
		runTask(task: any): void;
		compoundTask(newTask: any): boolean;
	}

	declare class Iterator {
		items: any;
		constructor(items: any): this;
		proxyCall(methodName: any, ...args: any[]): any[];
	}

	declare export interface ListenerInterface {
		listenTo(other: any, arg: any, callback?: any): any;
		stopListeningTo(other: any, eventName?: any): any;
	}

	declare export class ListenerMixin extends Mixin
		implements ListenerInterface {
		listenerId: any;
		listenTo(other: any, arg: any, callback?: any): this;
		stopListeningTo(other: any, eventName?: any): this;
		getListenerNamespace(): string;
	}

	declare class Toolbar {
		calendar: any;
		toolbarOptions: any;
		el: any;
		viewsWithButtons: any;
		constructor(calendar: any, toolbarOptions: any): this;
		setToolbarOptions(newToolbarOptions: any): void;
		render(): void;
		removeElement(): void;
		renderSection(position: any): JQuery;
		updateTitle(text: any): void;
		activateButton(buttonName: any): void;
		deactivateButton(buttonName: any): void;
		disableButton(buttonName: any): void;
		enableButton(buttonName: any): void;
		getViewsWithButtons(): any;
	}

	// 'fullcalendar/src/locale'
	declare export function datepickerLocale(
		localeCode: any,
		dpLocaleCode: any,
		dpOptions: any
	): void
	declare export function locale(localeCode: any, newFcOptions: any): void

	declare export class Class {
		static extend(members: any): any;
		static mixin(members: any): void;
	}

	declare export class Model extends Class
		implements EmitterInterface, ListenerInterface {
		_props: any;
		_watchers: any;
		_globalWatchArgs: any;
		constructor(): this;
		static watch(name: any, ...args: any[]): void;
		on(types: any, handler: any): this;
		one(types: any, handler: any): this;
		off(types: any, handler: any): this;
		trigger(types: any, ...args: any[]): this;
		triggerWith(types: any, context: any, args: any): this;
		hasHandlers(type: any): boolean;
		listenTo(other: any, arg: any, callback?: any): this;
		stopListeningTo(other: any, eventName?: any): this;
		constructed(): void;
		applyGlobalWatchers(): void;
		has(name: any): boolean;
		get(name: any): any;
		set(name: any, val: any): void;
		reset(newProps: any): void;
		unset(name: any): void;
		setProps(newProps: any): void;
		watch(name: any, depList: any, startFunc: any, stopFunc?: any): void;
		unwatch(name: any): void;
		_watchDeps(
			depList: any,
			startFunc: any,
			stopFunc: any
		): {
			teardown: () => void,
			flash: () => void
		};
		flash(name: any): void;
	}

	declare class OptionsManager extends Model {
		_calendar: any;
		dirDefaults: any;
		localeDefaults: any;
		overrides: any;
		dynamicOverrides: any;
		constructor(_calendar: any, overrides: any): this;
		add(newOptionHash: any): void;
		compute(): void;
		recordOverrides(newOptionHash: any): void;
	}

	// 'fullcalendar/ViewRegistry'
	declare export function defineView(viewName: any, viewConfig: any): void
	declare export function getViewConfig(viewName: any): any

	declare class ViewSpecManager {
		_calendar: any;
		optionsManager: any;
		viewSpecCache: any;
		constructor(optionsManager: any, _calendar: any): this;
		clearCache(): void;
		getViewSpec(viewType: any): any;
		getUnitViewSpec(unit: any): any;
		buildViewSpec(requestedViewType: any): any;
		buildViewSpecOptions(spec: any): void;
		buildViewSpecButtonText(spec: any, requestedViewType: any): void;
	}

	declare export class Theme {
		optionsManager: any;
		classes: any;
		iconClasses: any;
		baseIconClass: string;
		iconOverrideOption: any;
		iconOverrideCustomButtonOption: any;
		iconOverridePrefix: string;
		constructor(optionsManager: any): this;
		processIconOverride(): void;
		setIconOverride(iconOverrideHash: any): void;
		applyIconOverridePrefix(className: any): any;
		getClass(key: any): any;
		getIconClass(buttonName: any): string;
		getCustomButtonIconClass(customButtonProps: any): string;
	}

	// 'fullcalendar/src/moment-ext'
	declare export var moment: Function

	declare export class UnzonedRange {
		startMs: number;
		endMs: number;
		isStart: boolean;
		isEnd: boolean;
		constructor(startInput?: any, endInput?: any): this;
		static invertRanges(ranges: any, constraintRange: any): any[];
		intersect(otherRange: any): any;
		intersectsWith(otherRange: any): boolean;
		containsRange(innerRange: any): boolean;
		containsDate(date: any): boolean;
		constrainDate(date: any): any;
		equals(otherRange: any): boolean;
		clone(): this;
		getStart(): any;
		getEnd(): any;
		as(unit: any): number;
	}

	declare export class ComponentFootprint {
		unzonedRange: any;
		isAllDay: boolean;
		constructor(unzonedRange: any, isAllDay: any): this;
		toLegacy(
			calendar: any
		): {
			start: any,
			end: any
		};
	}

	declare export class EventFootprint {
		componentFootprint: any;
		eventDef: any;
		eventInstance: any;
		constructor(
			componentFootprint: any,
			eventDef: any,
			eventInstance: any
		): this;
		getEventLegacy(): any;
	}

	declare interface ParsableModelInterface {
		applyProps(rawProps: any): any;
		applyManualStandardProps(rawProps: any): any;
		applyMiscProps(rawProps: any): any;
		isStandardProp(propName: any): any;
	}

	declare class ParsableModelMixin extends Mixin
		implements ParsableModelInterface {
		standardPropMap: any;
		static defineStandardProps(propDefs: any): void;
		static copyVerbatimStandardProps(src: any, dest: any): void;
		applyProps(rawProps: any): boolean;
		applyManualStandardProps(rawProps: any): boolean;
		applyMiscProps(rawProps: any): void;
		isStandardProp(propName: any): boolean;
	}

	declare export class EventDef implements ParsableModelInterface {
		static uuid: number;
		static defineStandardProps: typeof ParsableModelMixin.defineStandardProps;
		static copyVerbatimStandardProps: typeof ParsableModelMixin.copyVerbatimStandardProps;
		source: any;
		id: any;
		rawId: any;
		uid: any;
		title: any;
		url: any;
		rendering: any;
		constraint: any;
		overlap: any;
		editable: any;
		startEditable: any;
		durationEditable: any;
		color: any;
		backgroundColor: any;
		borderColor: any;
		textColor: any;
		className: any;
		miscProps: any;
		constructor(source: any): this;
		static parse(rawInput: any, source: any): any;
		static normalizeId(id: any): string;
		static generateId(): string;
		applyProps(rawProps: any): boolean;
		applyManualStandardProps(rawProps: any): boolean;
		applyMiscProps(rawProps: any): void;
		isStandardProp(propName: any): boolean;
		isAllDay(): any;
		buildInstances(unzonedRange: any): any;
		clone(): any;
		hasInverseRendering(): boolean;
		hasBgRendering(): boolean;
		getRendering(): any;
		getConstraint(): any;
		getOverlap(): any;
		isStartExplicitlyEditable(): any;
		isDurationExplicitlyEditable(): any;
		isExplicitlyEditable(): any;
		toLegacy(): any;
		applyManualStandardProps(rawProps: any): boolean;
		applyMiscProps(rawProps: any): void;
	}

	declare class EventInstance {
		def: any;
		dateProfile: any;
		constructor(def: any, dateProfile: any): this;
		toLegacy(): any;
	}

	declare class EventDateProfile {
		start: any;
		end: any;
		unzonedRange: any;
		constructor(start: any, end: any, calendar: any): this;
		static parse(rawProps: any, source: any): false | EventDateProfile;
		static isStandardProp(propName: any): boolean;
		isAllDay(): boolean;
		buildUnzonedRange(calendar: any): UnzonedRange;
		getEnd(calendar: any): any;
	}

	declare export class EventSource extends Class
		implements ParsableModelInterface {
		static uuid: number;
		static defineStandardProps: typeof ParsableModelMixin.defineStandardProps;
		static copyVerbatimStandardProps: typeof ParsableModelMixin.copyVerbatimStandardProps;
		calendar: Calendar;
		id: string;
		uid: string;
		color: string;
		backgroundColor: string;
		borderColor: string;
		textColor: string;
		className: string[];
		editable: boolean;
		startEditable: boolean;
		durationEditable: boolean;
		rendering: string | null;
		overlap: boolean;
		constraint: any;
		allDayDefault: boolean;
		eventDataTransform: any;
		constructor(calendar: any): this;
		static parse(rawInput: any, calendar: any): false | EventSource;
		static normalizeId(id: any): string;
		fetch(start: any, end: any, timezone: any): JQueryPromise<any>;
		removeEventDefsById(eventDefId: any): number | void;
		removeAllEventDefs(): void;
		getPrimitive(otherSource: any): void;
		parseEventDefs(rawEventDefs: any): any[];
		parseEventDef(rawInput: any): any;
		applyProps(rawProps: any): boolean;
		applyManualStandardProps(rawProps: any): boolean;
		applyMiscProps(rawProps: any): void;
		isStandardProp(propName: any): boolean;
	}

	declare class EventRange {
		unzonedRange: any;
		eventDef: any;
		eventInstance: any;
		constructor(unzonedRange: any, eventDef: any, eventInstance?: any): this;
	}

	declare export class Constraints {
		eventManager: any;
		_calendar: any;
		constructor(eventManager: any, _calendar: any): this;
		opt(name: any): any;
		isEventInstanceGroupAllowed(eventInstanceGroup: any): boolean;
		getPeerEventInstances(eventDef: any): any;
		isSelectionFootprintAllowed(componentFootprint: any): boolean;
		isFootprintAllowed(
			componentFootprint: any,
			peerEventFootprints: any,
			constraintVal: any,
			overlapVal: any,
			subjectEventInstance?: any
		): boolean;
		isFootprintWithinConstraints(
			componentFootprint: any,
			constraintFootprints: any
		): boolean;
		constraintValToFootprints(constraintVal: any, isAllDay: any): any[];
		buildCurrentBusinessFootprints(isAllDay: any): any[];
		eventInstancesToFootprints(eventInstances: any): any[];
		collectOverlapEventFootprints(
			peerEventFootprints: any,
			targetFootprint: any
		): any[];
		parseEventDefToInstances(eventInput: any): any;
		eventRangesToEventFootprints(eventRanges: any): any[];
		eventRangeToEventFootprints(eventRange: any): EventFootprint[];
		parseFootprints(rawInput: any): ComponentFootprint[];
		footprintContainsFootprint(outerFootprint: any, innerFootprint: any): any;
		footprintsIntersect(footprint0: any, footprint1: any): any;
	}

	declare export var Promise: {
		construct: (executor: any) => JQueryPromise<{}>,
		resolve: (val: any) => JQueryPromise<{}>,
		reject: () => JQueryPromise<{}>
	}

	declare export class EventInstanceGroup {
		eventInstances: any;
		explicitEventDef: any;
		constructor(eventInstances?: any): this;
		getAllEventRanges(constraintRange: any): any;
		sliceRenderRanges(constraintRange: any): any;
		sliceNormalRenderRanges(constraintRange: any): any[];
		sliceInverseRenderRanges(constraintRange: any): any;
		isInverse(): any;
		getEventDef(): any;
	}

	declare export class ArrayEventSource extends EventSource {
		rawEventDefs: any;
		eventDefs: any;
		currentTimezone: any;
		constructor(calendar: any): this;
		static parse(rawInput: any, calendar: any): any;
		setRawEventDefs(rawEventDefs: any): void;
		fetch(start: any, end: any, timezone: any): JQueryPromise<{}>;
		addEventDef(eventDef: any): void;
		removeEventDefsById(eventDefId: any): number;
		removeAllEventDefs(): void;
		getPrimitive(): any;
		applyManualStandardProps(rawProps: any): boolean;
	}

	declare export var EventSourceParser: {
		sourceClasses: any[],
		registerClass: (EventSourceClass: any) => void,
		parse: (rawInput: any, calendar: any) => any
	}

	declare class EventManager implements EmitterInterface, ListenerInterface {
		on(types: any, handler: any): this;
		one(types: any, handler: any): this;
		off(types: any, handler: any): this;
		trigger(types: any, ...args: any[]): this;
		triggerWith(types: any, context: any, args: any): this;
		hasHandlers(type: any): boolean;
		listenTo(other: any, arg: any, callback?: any): this;
		stopListeningTo(other: any, eventName?: any): this;
		currentPeriod: any;
		calendar: any;
		stickySource: any;
		otherSources: any;
		constructor(calendar: any): this;
		requestEvents(start: any, end: any, timezone: any, force: any): any;
		addSource(eventSource: any): void;
		removeSource(doomedSource: any): void;
		removeAllSources(): void;
		refetchSource(eventSource: any): void;
		refetchAllSources(): void;
		getSources(): any[];
		multiQuerySources(matchInputs: any): any[];
		querySources(matchInput: any): any[];
		getSourceById(id: any): any;
		setPeriod(eventPeriod: any): void;
		bindPeriod(eventPeriod: any): void;
		unbindPeriod(eventPeriod: any): void;
		getEventDefByUid(uid: any): any;
		addEventDef(eventDef: any, isSticky: any): void;
		removeEventDefsById(eventId: any): void;
		removeAllEventDefs(): void;
		mutateEventsWithId(eventDefId: any, eventDefMutation: any): () => void;
		buildMutatedEventInstanceGroup(
			eventDefId: any,
			eventDefMutation: any
		): EventInstanceGroup;
		freeze(): void;
		thaw(): void;
		getEventDefsById(eventDefId: any): any;
		getEventInstances(): any;
		getEventInstancesWithId(eventDefId: any): any;
		getEventInstancesWithoutId(eventDefId: any): any;
	}

	declare export class BusinessHourGenerator {
		rawComplexDef: any;
		calendar: any;
		constructor(rawComplexDef: any, calendar: any): this;
		buildEventInstanceGroup(isAllDay: any, unzonedRange: any): any;
		buildEventDefs(isAllDay: any): any[];
		buildEventDef(isAllDay: any, rawDef: any): any;
	}

	declare export class EventDefMutation {
		dateMutation: any;
		eventDefId: any;
		className: any;
		verbatimStandardProps: any;
		miscProps: any;
		static createFromRawProps(
			eventInstance: any,
			rawProps: any,
			largeUnit: any
		): any;
		mutateSingle(eventDef: any): () => void;
		setDateMutation(dateMutation: any): void;
		isEmpty(): boolean;
	}

	// 'fullcalendar/ThemeRegistry'
	declare export function defineThemeSystem(
		themeName: any,
		themeClass: any
	): void

	declare export class Calendar implements EmitterInterface, ListenerInterface {
		static defaults: any;
		static englishDefaults: any;
		static rtlDefaults: any;
		on(types: any, handler: any): this;
		one(types: any, handler: any): this;
		off(types: any, handler: any): this;
		trigger(types: any, ...args: any[]): this;
		triggerWith(types: any, context: any, args: any): this;
		hasHandlers(type: any): boolean;
		listenTo(other: any, arg: any, callback?: any): this;
		stopListeningTo(other: any, eventName?: any): this;
		view: View;
		viewsByType: {
			[viewName: string]: View
		};
		currentDate: Moment;
		theme: Theme;
		eventManager: EventManager;
		constraints: Constraints;
		optionsManager: OptionsManager;
		viewSpecManager: ViewSpecManager;
		businessHourGenerator: BusinessHourGenerator;
		loadingLevel: number;
		defaultAllDayEventDuration: Duration;
		defaultTimedEventDuration: Duration;
		localeData: Object;
		el: JQuery;
		contentEl: JQuery;
		suggestedViewHeight: number;
		ignoreUpdateViewSize: number;
		freezeContentHeightDepth: number;
		windowResizeProxy: any;
		header: Toolbar;
		footer: Toolbar;
		toolbarsManager: Iterator;
		constructor(el: Global$JQuery, overrides: $Shape<OptionsInput>): this;
		constructed(): void;
		getView(): View;
		publiclyTrigger(name: string, triggerInfo: any): any;
		hasPublicHandlers(name: string): boolean;
		option(name: string | Object, value?: any): any;
		opt(name: string): any;
		instantiateView(viewType: string): View;
		isValidViewType(viewType: string): boolean;
		changeView(viewName: string, dateOrRange: RangeInput | MomentInput): void;
		zoomTo(newDate: Moment, viewType?: string): void;
		initCurrentDate(): void;
		prev(): void;
		next(): void;
		prevYear(): void;
		nextYear(): void;
		today(): void;
		gotoDate(zonedDateInput: any): void;
		incrementDate(delta: any): void;
		getDate(): Moment;
		pushLoading(): void;
		popLoading(): void;
		render(): void;
		initialRender(): void;
		destroy(): void;
		elementVisible(): boolean;
		bindViewHandlers(view: any): void;
		unbindViewHandlers(view: any): void;
		renderView(viewType?: string): void;
		clearView(): void;
		reinitView(): void;
		getSuggestedViewHeight(): number;
		isHeightAuto(): boolean;
		updateViewSize(isResize?: boolean): boolean;
		calcSize(): void;
		_calcSize(): void;
		windowResize(ev: JQueryEventObject): void;
		freezeContentHeight(): void;
		forceFreezeContentHeight(): void;
		thawContentHeight(): void;
		initToolbars(): void;
		computeHeaderOptions(): {
			extraClasses: string,
			layout: any
		};
		computeFooterOptions(): {
			extraClasses: string,
			layout: any
		};
		renderHeader(): void;
		renderFooter(): void;
		setToolbarsTitle(title: string): void;
		updateToolbarButtons(dateProfile: any): void;
		queryToolbarsHeight(): any;
		select(zonedStartInput: MomentInput, zonedEndInput?: MomentInput): void;
		unselect(): void;
		buildSelectFootprint(
			zonedStartInput: MomentInput,
			zonedEndInput?: MomentInput
		): ComponentFootprint;
		initMomentInternals(): void;
		moment(...args: any[]): Moment;
		msToMoment(ms: number, forceAllDay: boolean): Moment;
		msToUtcMoment(ms: number, forceAllDay: boolean): Moment;
		localizeMoment(mom: any): void;
		getIsAmbigTimezone(): boolean;
		applyTimezone(date: Moment): Moment;
		footprintToDateProfile(
			componentFootprint: any,
			ignoreEnd?: boolean
		): EventDateProfile;
		getNow(): Moment;
		humanizeDuration(duration: Duration): string;
		parseUnzonedRange(rangeInput: RangeInput): UnzonedRange;
		initEventManager(): void;
		requestEvents(start: Moment, end: Moment): any;
		getEventEnd(event: any): Moment;
		getDefaultEventEnd(allDay: boolean, zonedStart: Moment): Moment;
		rerenderEvents(): void;
		refetchEvents(): void;
		renderEvents(eventInputs: EventObjectInput[], isSticky?: boolean): void;
		renderEvent(eventInput: EventObjectInput, isSticky?: boolean): void;
		removeEvents(legacyQuery: any): void;
		clientEvents(legacyQuery: any): any;
		updateEvents(eventPropsArray: EventObjectInput[]): void;
		updateEvent(eventProps: EventObjectInput): void;
		getEventSources(): EventSource;
		getEventSourceById(id: any): EventSource;
		addEventSource(sourceInput: EventSourceInput): void;
		removeEventSources(sourceMultiQuery: any): void;
		removeEventSource(sourceQuery: any): void;
		refetchEventSources(sourceMultiQuery: any): void;
	}

	declare class DateProfileGenerator {
		_view: any;
		constructor(_view: any): this;
		opt(name: any): any;
		trimHiddenDays(unzonedRange: any): any;
		msToUtcMoment(ms: any, forceAllDay: any): any;
		buildPrev(
			currentDateProfile: any
		): {
			validUnzonedRange: any,
			currentUnzonedRange: any,
			currentRangeUnit: any,
			isRangeAllDay: any,
			activeUnzonedRange: any,
			renderUnzonedRange: any,
			minTime: any,
			maxTime: any,
			isValid: any,
			date: any,
			dateIncrement: any
		};
		buildNext(
			currentDateProfile: any
		): {
			validUnzonedRange: any,
			currentUnzonedRange: any,
			currentRangeUnit: any,
			isRangeAllDay: any,
			activeUnzonedRange: any,
			renderUnzonedRange: any,
			minTime: any,
			maxTime: any,
			isValid: any,
			date: any,
			dateIncrement: any
		};
		build(
			date: any,
			direction: any,
			forceToValid?: boolean
		): {
			validUnzonedRange: any,
			currentUnzonedRange: any,
			currentRangeUnit: any,
			isRangeAllDay: any,
			activeUnzonedRange: any,
			renderUnzonedRange: any,
			minTime: any,
			maxTime: any,
			isValid: any,
			date: any,
			dateIncrement: any
		};
		buildValidRange(): any;
		buildCurrentRangeInfo(
			date: any,
			direction: any
		): {
			duration: any,
			unit: any,
			unzonedRange: any
		};
		getFallbackDuration(): Duration;
		adjustActiveRange(
			unzonedRange: any,
			minTime: any,
			maxTime: any
		): UnzonedRange;
		buildRangeFromDuration(
			date: any,
			direction: any,
			duration: any,
			unit: any
		): any;
		buildRangeFromDayCount(
			date: any,
			direction: any,
			dayCount: any
		): UnzonedRange;
		buildCustomVisibleRange(date: any): any;
		buildRenderRange(
			currentUnzonedRange: any,
			currentRangeUnit: any,
			isRangeAllDay: any
		): any;
		buildDateIncrement(fallback: any): any;
	}

	// 'fullcalendar/src/date-formatting'
	declare export function formatDate(date: any, formatStr: any): any
	declare export function formatRange(
		date1: any,
		date2: any,
		formatStr: any,
		separator: any,
		isRTL: any
	): any
	declare export function queryMostGranularFormatUnit(formatStr: any): any

	declare class Component extends Model {
		el: any;
		setElement(el: any): void;
		removeElement(): void;
		bindGlobalHandlers(): void;
		unbindGlobalHandlers(): void;
		renderSkeleton(): void;
		unrenderSkeleton(): void;
	}

	declare export class DateComponent extends Component {
		static guid: number;
		eventRendererClass: any;
		helperRendererClass: any;
		businessHourRendererClass: any;
		fillRendererClass: any;
		uid: any;
		childrenByUid: any;
		isRTL: boolean;
		nextDayThreshold: any;
		dateProfile: any;
		eventRenderer: any;
		helperRenderer: any;
		businessHourRenderer: any;
		fillRenderer: any;
		hitsNeededDepth: number;
		hasAllDayBusinessHours: boolean;
		isDatesRendered: boolean;
		constructor(_view?: any, _options?: any): this;
		addChild(child: any): boolean;
		removeChild(child: any): boolean;
		updateSize(totalHeight: any, isAuto: any, isResize: any): void;
		opt(name: any): any;
		publiclyTrigger(...args: any[]): any;
		hasPublicHandlers(...args: any[]): any;
		executeDateRender(dateProfile: any): void;
		executeDateUnrender(): void;
		renderDates(dateProfile: any): void;
		unrenderDates(): void;
		getNowIndicatorUnit(): string;
		renderNowIndicator(date: any): void;
		unrenderNowIndicator(): void;
		renderBusinessHours(businessHourGenerator: any): void;
		unrenderBusinessHours(): void;
		executeEventRender(eventsPayload: any): void;
		executeEventUnrender(): void;
		getBusinessHourSegs(): any;
		getOwnBusinessHourSegs(): any;
		getEventSegs(): any;
		getOwnEventSegs(): any;
		triggerAfterEventsRendered(): void;
		triggerAfterEventSegsRendered(segs: any): void;
		triggerBeforeEventsDestroyed(): void;
		triggerBeforeEventSegsDestroyed(segs: any): void;
		showEventsWithId(eventDefId: any): void;
		hideEventsWithId(eventDefId: any): void;
		renderDrag(eventFootprints: any, seg: any, isTouch: any): boolean;
		unrenderDrag(): void;
		renderEventResize(eventFootprints: any, seg: any, isTouch: any): void;
		unrenderEventResize(): void;
		renderSelectionFootprint(componentFootprint: any): void;
		unrenderSelection(): void;
		renderHighlight(componentFootprint: any): void;
		unrenderHighlight(): void;
		hitsNeeded(): void;
		hitsNotNeeded(): void;
		prepareHits(): void;
		releaseHits(): void;
		queryHit(leftOffset: any, topOffset: any): any;
		getSafeHitFootprint(hit: any): any;
		getHitFootprint(hit: any): any;
		getHitEl(hit: any): any;
		eventRangesToEventFootprints(eventRanges: any): any[];
		eventRangeToEventFootprints(eventRange: any): EventFootprint[];
		eventFootprintsToSegs(eventFootprints: any): any[];
		eventFootprintToSegs(eventFootprint: any): any;
		componentFootprintToSegs(componentFootprint: any): any[];
		callChildren(methodName: any, args: any): void;
		iterChildren(func: any): void;
		_getCalendar(): any;
		_getView(): any;
		_getDateProfile(): any;
		buildGotoAnchorHtml(gotoOptions: any, attrs: any, innerHtml: any): string;
		getAllDayHtml(): any;
		getDayClasses(date: any, noThemeHighlight?: any): any[];
		formatRange(range: any, isAllDay: any, formatStr: any, separator: any): any;
		currentRangeAs(unit: any): any;
		computeDayRange(
			unzonedRange: any
		): {
			start: any,
			end: any
		};
		isMultiDayRange(unzonedRange: any): boolean;
	}

	declare export class InteractiveDateComponent extends DateComponent {
		dateClickingClass: any;
		dateSelectingClass: any;
		eventPointingClass: any;
		eventDraggingClass: any;
		eventResizingClass: any;
		externalDroppingClass: any;
		dateClicking: any;
		dateSelecting: any;
		eventPointing: any;
		eventDragging: any;
		eventResizing: any;
		externalDropping: any;
		segSelector: string;
		largeUnit: any;
		constructor(_view?: any, _options?: any): this;
		setElement(el: any): void;
		removeElement(): void;
		executeEventUnrender(): void;
		bindGlobalHandlers(): void;
		unbindGlobalHandlers(): void;
		bindDateHandlerToEl(el: any, name: any, handler: any): void;
		bindAllSegHandlersToEl(el: any): void;
		bindSegHandlerToEl(el: any, name: any, handler: any): void;
		shouldIgnoreMouse(): any;
		shouldIgnoreTouch(): any;
		shouldIgnoreEventPointing(): any;
		canStartSelection(seg: any, ev: any): any;
		canStartDrag(seg: any, ev: any): any;
		canStartResize(seg: any, ev: any): boolean;
		endInteractions(): void;
		isEventDefDraggable(eventDef: any): any;
		isEventDefStartEditable(eventDef: any): any;
		isEventDefGenerallyEditable(eventDef: any): any;
		isEventDefResizableFromStart(eventDef: any): any;
		isEventDefResizableFromEnd(eventDef: any): any;
		isEventDefResizable(eventDef: any): any;
		diffDates(a: any, b: any): Duration;
		isEventInstanceGroupAllowed(eventInstanceGroup: any): any;
		isExternalInstanceGroupAllowed(eventInstanceGroup: any): boolean;
	}

	declare export class View extends InteractiveDateComponent {
		type: string;
		name: string;
		title: string;
		calendar: Calendar;
		viewSpec: any;
		options: any;
		renderQueue: RenderQueue;
		batchRenderDepth: number;
		queuedScroll: Object;
		isSelected: boolean;
		selectedEventInstance: EventInstance;
		eventOrderSpecs: any;
		isHiddenDayHash: boolean[];
		isNowIndicatorRendered: boolean;
		initialNowDate: Moment;
		initialNowQueriedMs: number;
		nowIndicatorTimeoutID: any;
		nowIndicatorIntervalID: any;
		dateProfileGeneratorClass: any;
		dateProfileGenerator: any;
		usesMinMaxTime: boolean;
		start: Moment;
		end: Moment;
		intervalStart: Moment;
		intervalEnd: Moment;
		constructor(calendar: any, viewSpec: any): this;
		_getView(): this;
		opt(name: any): any;
		initRenderQueue(): void;
		onRenderQueueStart(): void;
		onRenderQueueStop(): void;
		startBatchRender(): void;
		stopBatchRender(): void;
		requestRender(func: any, namespace: any, actionType: any): void;
		whenSizeUpdated(func: any): void;
		computeTitle(dateProfile: any): any;
		computeTitleFormat(dateProfile: any): any;
		setDate(date: any): void;
		unsetDate(): void;
		fetchInitialEvents(dateProfile: any): any;
		bindEventChanges(): void;
		unbindEventChanges(): void;
		setEvents(eventsPayload: any): void;
		unsetEvents(): void;
		resetEvents(eventsPayload: any): void;
		requestDateRender(dateProfile: any): void;
		requestDateUnrender(): void;
		executeDateRender(dateProfile: any): void;
		executeDateUnrender(): void;
		bindBaseRenderHandlers(): void;
		triggerViewRender(): void;
		triggerViewDestroy(): void;
		requestEventsRender(eventsPayload: any): void;
		requestEventsUnrender(): void;
		requestBusinessHoursRender(businessHourGenerator: any): void;
		requestBusinessHoursUnrender(): void;
		bindGlobalHandlers(): void;
		unbindGlobalHandlers(): void;
		startNowIndicator(): void;
		updateNowIndicator(): void;
		stopNowIndicator(): void;
		updateSize(totalHeight: any, isAuto: any, isResize: any): void;
		addScroll(scroll: any): void;
		popScroll(): void;
		applyQueuedScroll(): void;
		queryScroll(): {};
		applyScroll(scroll: any): void;
		computeInitialDateScroll(): {};
		queryDateScroll(): {};
		applyDateScroll(scroll: any): void;
		reportEventDrop(
			eventInstance: any,
			eventMutation: any,
			el: any,
			ev: any
		): void;
		triggerEventDrop(
			eventInstance: any,
			dateDelta: any,
			undoFunc: any,
			el: any,
			ev: any
		): void;
		reportExternalDrop(
			singleEventDef: any,
			isEvent: any,
			isSticky: any,
			el: any,
			ev: any,
			ui: any
		): void;
		triggerExternalDrop(
			singleEventDef: any,
			isEvent: any,
			el: any,
			ev: any,
			ui: any
		): void;
		reportEventResize(
			eventInstance: any,
			eventMutation: any,
			el: any,
			ev: any
		): void;
		triggerEventResize(
			eventInstance: any,
			durationDelta: any,
			undoFunc: any,
			el: any,
			ev: any
		): void;
		select(footprint: any, ev?: any): void;
		renderSelectionFootprint(footprint: any): void;
		reportSelection(footprint: any, ev?: any): void;
		triggerSelect(footprint: any, ev?: any): void;
		unselect(ev?: any): void;
		selectEventInstance(eventInstance: any): void;
		unselectEventInstance(): void;
		isEventDefSelected(eventDef: any): boolean;
		handleDocumentMousedown(ev: any): void;
		processUnselect(ev: any): void;
		processRangeUnselect(ev: any): void;
		processEventUnselect(ev: any): void;
		triggerBaseRendered(): void;
		triggerBaseUnrendered(): void;
		triggerDayClick(footprint: any, dayEl: any, ev: any): void;
		isDateInOtherMonth(date: any, dateProfile: any): boolean;
		getUnzonedRangeOption(name: any): UnzonedRange;
		initHiddenDays(): void;
		trimHiddenDays(inputUnzonedRange: any): UnzonedRange;
		isHiddenDay(day: any): boolean;
		skipHiddenDays(date: any, inc?: number, isExclusive?: boolean): any;
	}

	// 'fullcalendar/src/types/input-types'
	declare export type MomentInput = Moment | Date | Object | string | number
	declare type DurationInput = Duration | Object | string | number
	declare interface RangeInput {
		start?: MomentInput;
		end?: MomentInput;
	}
	declare type ConstraintInput =
		| RangeInput
		| BusinessHoursInput
		| "businessHours"
	declare export interface EventOptionsBase {
		className?: string | string[];
		editable?: boolean;
		startEditable?: boolean;
		durationEditable?: boolean;
		rendering?: string;
		overlap?: boolean;
		constraint?: ConstraintInput;
		color?: string;
		backgroundColor?: string;
		borderColor?: string;
		textColor?: string;
	}
	declare export interface EventObjectInput
		extends EventOptionsBase, RangeInput {
		_id?: string;
		id?: string | number;
		title: string;
		allDay?: boolean;
		url?: string;
		source?: EventSource;
	}
	declare type EventSourceFunction = (
		start: Moment,
		end: Moment,
		timezone: string,
		callback: (events: EventObjectInput[]) => void
	) => void
	declare type EventSourceSimpleInput =
		| EventObjectInput[]
		| EventSourceFunction
		| string
	declare interface EventSourceExtendedInput
		extends EventOptionsBase, JQueryAjaxSettings {
		url?: string;
		events?: EventSourceSimpleInput;
		allDayDefault?: boolean;
		startParam?: string;
		endParam?: string;
		eventDataTransform?: (eventData: any) => EventObjectInput;
	}
	declare type EventSourceInput =
		| EventSourceSimpleInput
		| EventSourceExtendedInput
	declare interface ToolbarInput {
		left?: string;
		center?: string;
		right?: string;
	}
	declare interface CustomButtonInput {
		text: string;
		icon?: string;
		themeIcon?: string;
		bootstrapGlyphicon?: string;
		bootstrapFontAwesome?: string;
		click(element: Global$JQuery): void;
	}
	declare interface ButtonIconsInput {
		prev?: string;
		next?: string;
		prevYear?: string;
		nextYear?: string;
	}
	declare interface ButtonTextCompoundInput {
		prev?: string;
		next?: string;
		prevYear?: string;
		nextYear?: string;
		today?: string;
		month?: string;
		week?: string;
		day?: string;
		[viewId: string]: string | void;
	}
	declare export interface BusinessHoursInput {
		start?: MomentInput;
		end?: MomentInput;
		dow?: number[];
	}
	declare interface EventSegment {
		event: EventObjectInput;
		start: Moment;
		end: Moment;
		isStart: boolean;
		isEnd: boolean;
	}
	declare interface CellInfo {
		date: Moment;
		dayEl: JQuery;
		moreEl: JQuery;
		segs: EventSegment[];
		hiddenSegs: EventSegment[];
	}
	declare interface DropInfo {
		start: Moment;
		end: Moment;
	}
	declare interface OptionsInputBase {
		header: boolean | ToolbarInput;
		footer: boolean | ToolbarInput;
		customButtons: {
			[name: string]: CustomButtonInput
		};
		buttonIcons: boolean | ButtonIconsInput;
		themeSystem: "standard" | "bootstrap3" | "bootstrap4" | "jquery-ui";
		themeButtonIcons: boolean | ButtonIconsInput;
		bootstrapGlyphicons: boolean | ButtonIconsInput;
		bootstrapFontAwesome: boolean | ButtonIconsInput;
		firstDay: number;
		isRTL: boolean;
		weekends: boolean;
		hiddenDays: number[];
		fixedWeekCount: boolean;
		weekNumbers: boolean;
		weekNumbersWithinDays: boolean;
		weekNumberCalculation: "local" | "ISO" | ((m: Moment) => number);
		businessHours: boolean | BusinessHoursInput | BusinessHoursInput[];
		showNonCurrentDates: boolean;
		height: number | "auto" | "parent" | (() => number);
		contentHeight: number | "auto" | (() => number);
		aspectRatio: number;
		handleWindowResize: boolean;
		windowResizeDelay: number;
		eventLimit: boolean | number;
		eventLimitClick:
			| "popover"
			| "week"
			| "day"
			| string
			| ((cellinfo: CellInfo, jsevent: Event) => void);
		timezone: string | boolean;
		now: MomentInput | (() => MomentInput);
		defaultView: string;
		allDaySlot: boolean;
		allDayText: string;
		slotDuration: DurationInput;
		slotLabelFormat: string;
		slotLabelInterval: DurationInput;
		snapDuration: DurationInput;
		scrollTime: DurationInput;
		minTime: DurationInput;
		maxTime: DurationInput;
		slotEventOverlap: boolean;
		listDayFormat: string | boolean;
		listDayAltFormat: string | boolean;
		noEventsMessage: string;
		defaultDate: MomentInput;
		nowIndicator: boolean;
		visibleRange: ((currentDate: Moment) => RangeInput) | RangeInput;
		validRange: RangeInput;
		dateIncrement: DurationInput;
		dateAlignment: string;
		duration: DurationInput;
		dayCount: number;
		locale: string;
		timeFormat: string;
		columnHeader: boolean;
		columnHeaderFormat: string;
		columnHeaderText: string | ((date: MomentInput) => string);
		columnHeaderHtml: string | ((date: MomentInput) => string);
		titleFormat: string;
		monthNames: string[];
		monthNamesShort: string[];
		dayNames: string[];
		dayNamesShort: string[];
		weekNumberTitle: string;
		displayEventTime: boolean;
		displayEventEnd: boolean;
		eventLimitText: string | ((eventCnt: number) => string);
		dayPopoverFormat: string;
		navLinks: boolean;
		navLinkDayClick: string | ((date: Moment, jsEvent: Event) => void);
		navLinkWeekClick: string | ((weekStart: any, jsEvent: Event) => void);
		selectable: boolean;
		selectHelper: boolean;
		unselectAuto: boolean;
		unselectCancel: string;
		selectOverlap: boolean | ((event: EventObjectInput) => boolean);
		selectConstraint: ConstraintInput;
		events: EventSourceInput;
		eventSources: EventSourceInput[];
		allDayDefault: boolean;
		startParam: string;
		endParam: string;
		lazyFetching: boolean;
		eventColor: string;
		eventBackgroundColor: string;
		eventBorderColor: string;
		eventTextColor: string;
		nextDayThreshold: DurationInput;
		eventOrder:
			| string
			| Array<
					| ((a: EventObjectInput, b: EventObjectInput) => number)
					| (string | ((a: EventObjectInput, b: EventObjectInput) => number))
			  >;
		eventRenderWait: number | null;
		editable: boolean;
		eventStartEditable: boolean;
		eventDurationEditable: boolean;
		dragRevertDuration: number;
		dragOpacity: number;
		dragScroll: boolean;
		eventOverlap:
			| boolean
			| ((
					stillEvent: EventObjectInput,
					movingEvent: EventObjectInput
			  ) => boolean);
		eventConstraint: ConstraintInput;
		eventAllow: (dropInfo: DropInfo, draggedEvent: Event) => boolean;
		longPressDelay: number;
		eventLongPressDelay: number;
		droppable: boolean;
		dropAccept: string | ((draggable: any) => boolean);
		viewRender: (view: View, element: Global$JQuery) => void;
		viewDestroy: (view: View, element: Global$JQuery) => void;
		dayRender: (date: Moment, cell: Global$JQuery) => void;
		windowResize: (view: View) => void;
		dayClick: (
			date: Moment,
			jsEvent: MouseEvent,
			view: View,
			resourceObj?: any
		) => void;
		eventClick: (
			event: EventObjectInput,
			jsEvent: MouseEvent,
			view: View
		) => boolean | void;
		eventMouseover: (
			event: EventObjectInput,
			jsEvent: MouseEvent,
			view: View
		) => void;
		eventMouseout: (
			event: EventObjectInput,
			jsEvent: MouseEvent,
			view: View
		) => void;
		select: (
			start: Moment,
			end: Moment,
			jsEvent: MouseEvent,
			view: View,
			resource?: any
		) => void;
		unselect: (view: View, jsEvent: Event) => void;
		eventDataTransform: (eventData: any) => EventObjectInput;
		loading: (isLoading: boolean, view: View) => void;
		eventRender: (
			event: EventObjectInput,
			element: Global$JQuery,
			view: View
		) => void;
		eventAfterRender: (
			event: EventObjectInput,
			element: Global$JQuery,
			view: View
		) => void;
		eventAfterAllRender: (view: View) => void;
		eventDestroy: (
			event: EventObjectInput,
			element: Global$JQuery,
			view: View
		) => void;
		eventDragStart: (
			event: EventObjectInput,
			jsEvent: MouseEvent,
			ui: any,
			view: View
		) => void;
		eventDragStop: (
			event: EventObjectInput,
			jsEvent: MouseEvent,
			ui: any,
			view: View
		) => void;
		eventDrop: (
			event: EventObjectInput,
			delta: Duration,
			revertFunc: Function,
			jsEvent: Event,
			ui: any,
			view: View
		) => void;
		eventResizeStart: (
			event: EventObjectInput,
			jsEvent: MouseEvent,
			ui: any,
			view: View
		) => void;
		eventResizeStop: (
			event: EventObjectInput,
			jsEvent: MouseEvent,
			ui: any,
			view: View
		) => void;
		eventResize: (
			event: EventObjectInput,
			delta: Duration,
			revertFunc: Function,
			jsEvent: Event,
			ui: any,
			view: View
		) => void;
		drop: (date: Moment, jsEvent: MouseEvent, ui: any) => void;
		eventReceive: (event: EventObjectInput) => void;
	}
	declare interface ViewOptionsInput extends OptionsInputBase {
		type: string;
		buttonText: string;
	}
	declare export interface OptionsInput extends OptionsInputBase {
		buttonText: ButtonTextCompoundInput;
		views: {
			[viewId: string]: ViewOptionsInput
		};
	}
	declare export type Options = $Shape<OptionsInput>

	declare export class FuncEventSource extends EventSource {
		func: any;
		static parse(rawInput: any, calendar: any): any;
		fetch(start: any, end: any, timezone: any): JQueryPromise<{}>;
		getPrimitive(): any;
		applyManualStandardProps(rawProps: any): boolean;
	}

	declare export class JsonFeedEventSource extends EventSource {
		static AJAX_DEFAULTS: {
			dataType: string,
			cache: boolean
		};
		url: any;
		startParam: any;
		endParam: any;
		timezoneParam: any;
		ajaxSettings: any;
		static parse(rawInput: any, calendar: any): any;
		fetch(start: any, end: any, timezone: any): JQueryPromise<{}>;
		buildRequestParams(start: any, end: any, timezone: any): {};
		getPrimitive(): any;
		applyMiscProps(rawProps: any): void;
	}

	declare export class CoordCache {
		els: any;
		forcedOffsetParentEl: any;
		origin: any;
		boundingRect: any;
		isHorizontal: boolean;
		isVertical: boolean;
		lefts: any;
		rights: any;
		tops: any;
		bottoms: any;
		constructor(options: any): this;
		build(): void;
		clear(): void;
		ensureBuilt(): void;
		buildElHorizontals(): void;
		buildElVerticals(): void;
		getHorizontalIndex(leftOffset: any): any;
		getVerticalIndex(topOffset: any): any;
		getLeftOffset(leftIndex: any): any;
		getLeftPosition(leftIndex: any): number;
		getRightOffset(leftIndex: any): any;
		getRightPosition(leftIndex: any): number;
		getWidth(leftIndex: any): number;
		getTopOffset(topIndex: any): any;
		getTopPosition(topIndex: any): number;
		getBottomOffset(topIndex: any): any;
		getBottomPosition(topIndex: any): number;
		getHeight(topIndex: any): number;
		queryBoundingRect(): {
			left: number,
			right: any,
			top: number,
			bottom: any
		};
		isPointInBounds(leftOffset: any, topOffset: any): boolean;
		isLeftInBounds(leftOffset: any): boolean;
		isTopInBounds(topOffset: any): boolean;
	}

	declare export class DragListener implements ListenerInterface {
		listenTo(other: any, arg: any, callback?: any): this;
		stopListeningTo(other: any, eventName?: any): this;
		options: any;
		subjectEl: any;
		originX: any;
		originY: any;
		scrollEl: any;
		isInteracting: boolean;
		isDistanceSurpassed: boolean;
		isDelayEnded: boolean;
		isDragging: boolean;
		isTouch: boolean;
		isGeneric: boolean;
		delay: any;
		delayTimeoutId: any;
		minDistance: any;
		shouldCancelTouchScroll: boolean;
		scrollAlwaysKills: boolean;
		isAutoScroll: boolean;
		scrollBounds: any;
		scrollTopVel: any;
		scrollLeftVel: any;
		scrollIntervalId: any;
		scrollSensitivity: number;
		scrollSpeed: number;
		scrollIntervalMs: number;
		constructor(options: any): this;
		startInteraction(ev: any, extraOptions?: any): void;
		handleInteractionStart(ev: any): void;
		endInteraction(ev: any, isCancelled: any): void;
		handleInteractionEnd(ev: any, isCancelled: any): void;
		bindHandlers(): void;
		unbindHandlers(): void;
		startDrag(ev: any, extraOptions?: any): void;
		handleDragStart(ev: any): void;
		handleMove(ev: any): void;
		handleDrag(dx: any, dy: any, ev: any): void;
		endDrag(ev: any): void;
		handleDragEnd(ev: any): void;
		startDelay(initialEv: any): void;
		handleDelayEnd(initialEv: any): void;
		handleDistanceSurpassed(ev: any): void;
		handleTouchMove(ev: any): void;
		handleMouseMove(ev: any): void;
		handleTouchScroll(ev: any): void;
		trigger(name: any, ...args: any[]): void;
		initAutoScroll(): void;
		destroyAutoScroll(): void;
		computeScrollBounds(): void;
		updateAutoScroll(ev: any): void;
		setScrollVel(topVel: any, leftVel: any): void;
		constrainScrollVel(): void;
		scrollIntervalFunc(): void;
		endAutoScroll(): void;
		handleDebouncedScroll(): void;
		handleScrollEnd(): void;
	}

	declare export class Scroller extends Class {
		el: any;
		scrollEl: any;
		overflowX: any;
		overflowY: any;
		constructor(options?: any): this;
		render(): void;
		renderEl(): JQuery;
		clear(): void;
		destroy(): void;
		applyOverflow(): void;
		lockOverflow(scrollbarWidths: any): void;
		setHeight(height: any): void;
		getScrollTop(): any;
		setScrollTop(top: any): void;
		getClientWidth(): any;
		getClientHeight(): any;
		getScrollbarWidths(): any;
	}

	declare interface DayTableInterface {
		dayDates: any;
		daysPerRow: any;
		rowCnt: any;
		colCnt: any;
		updateDayTable(): any;
		renderHeadHtml(): any;
		renderBgTrHtml(row: any): any;
		bookendCells(trEl: any): any;
		getCellDate(row: any, col: any): any;
		getCellRange(row: any, col: any): any;
		sliceRangeByDay(unzonedRange: any): any;
		sliceRangeByRow(unzonedRange: any): any;
		renderIntroHtml(): any;
	}
	declare export class DayTableMixin extends Mixin
		implements DayTableInterface {
		breakOnWeeks: boolean;
		dayDates: any;
		dayIndices: any;
		daysPerRow: any;
		rowCnt: any;
		colCnt: any;
		colHeadFormat: any;
		updateDayTable(): void;
		updateDayTableCols(): void;
		computeColCnt(): any;
		getCellDate(row: any, col: any): any;
		getCellRange(
			row: any,
			col: any
		): {
			start: any,
			end: any
		};
		getCellDayIndex(row: any, col: any): any;
		getColDayIndex(col: any): any;
		getDateDayIndex(date: any): any;
		computeColHeadFormat(): any;
		sliceRangeByRow(unzonedRange: any): any[];
		sliceRangeByDay(unzonedRange: any): any[];
		renderHeadHtml(): string;
		renderHeadIntroHtml(): void;
		renderHeadTrHtml(): string;
		renderHeadDateCellsHtml(): string;
		renderHeadDateCellHtml(date: any, colspan: any, otherAttrs: any): string;
		renderBgTrHtml(row: any): string;
		renderBgIntroHtml(row: any): void;
		renderBgCellsHtml(row: any): string;
		renderBgCellHtml(date: any, otherAttrs: any): string;
		renderIntroHtml(): void;
		bookendCells(trEl: any): void;
	}

	declare export class BusinessHourRenderer {
		component: any;
		fillRenderer: any;
		segs: any;
		constructor(component: any, fillRenderer: any): this;
		render(businessHourGenerator: any): void;
		renderEventFootprints(eventFootprints: any): void;
		renderSegs(segs: any): void;
		unrender(): void;
		getSegs(): any;
	}

	declare export class EventRenderer {
		view: any;
		component: any;
		fillRenderer: any;
		fgSegs: any;
		bgSegs: any;
		eventTimeFormat: any;
		displayEventTime: any;
		displayEventEnd: any;
		constructor(component: any, fillRenderer: any): this;
		opt(name: any): any;
		rangeUpdated(): void;
		render(eventsPayload: any): void;
		unrender(): void;
		renderFgRanges(eventRanges: any): void;
		unrenderFgRanges(): void;
		renderBgRanges(eventRanges: any): void;
		unrenderBgRanges(): void;
		getSegs(): any;
		renderFgSegs(segs: any): boolean | void;
		unrenderFgSegs(segs: any): void;
		renderBgSegs(segs: any): boolean;
		unrenderBgSegs(): void;
		renderFgSegEls(segs: any, disableResizing?: boolean): any[];
		beforeFgSegHtml(seg: any): void;
		fgSegHtml(seg: any, disableResizing: any): string;
		getSegClasses(seg: any, isDraggable: any, isResizable: any): string[];
		filterEventRenderEl(eventFootprint: any, el: any): any;
		getTimeText(eventFootprint: any, formatStr?: any, displayEnd?: any): any;
		_getTimeText(
			start: any,
			end: any,
			isAllDay: any,
			formatStr?: any,
			displayEnd?: any
		): any;
		computeEventTimeFormat(): any;
		computeDisplayEventTime(): boolean;
		computeDisplayEventEnd(): boolean;
		getBgClasses(eventDef: any): any[];
		getClasses(eventDef: any): any[];
		getSkinCss(
			eventDef: any
		): {
			"background-color": any,
			"border-color": any,
			color: any
		};
		getBgColor(eventDef: any): any;
		getBorderColor(eventDef: any): any;
		getTextColor(eventDef: any): any;
		getStylingObjs(eventDef: any): any[];
		getFallbackStylingObjs(eventDef: any): any[];
		sortEventSegs(segs: any): void;
		compareEventSegs(seg1: any, seg2: any): any;
	}

	declare export class FillRenderer {
		fillSegTag: string;
		component: any;
		elsByFill: any;
		constructor(component: any): this;
		renderFootprint(type: any, componentFootprint: any, props: any): void;
		renderSegs(type: any, segs: any, props: any): any;
		unrender(type: any): void;
		buildSegEls(type: any, segs: any, props: any): any[];
		buildSegHtml(type: any, seg: any, props: any): string;
		attachSegEls(type: any, segs: any): void;
		reportEls(type: any, nodes: any): void;
	}

	declare export class HelperRenderer {
		view: any;
		component: any;
		eventRenderer: any;
		helperEls: any;
		constructor(component: any, eventRenderer: any): this;
		renderComponentFootprint(componentFootprint: any): void;
		renderEventDraggingFootprints(
			eventFootprints: any,
			sourceSeg: any,
			isTouch: any
		): void;
		renderEventResizingFootprints(
			eventFootprints: any,
			sourceSeg: any,
			isTouch: any
		): void;
		renderEventFootprints(
			eventFootprints: any,
			sourceSeg?: any,
			extraClassNames?: any,
			opacity?: any
		): void;
		renderSegs(segs: any, sourceSeg?: any): JQuery;
		unrender(): void;
		fabricateEventFootprint(componentFootprint: any): EventFootprint;
	}

	declare class HitDragListener extends DragListener {
		component: any;
		origHit: any;
		hit: any;
		coordAdjust: any;
		constructor(component: any, options: any): this;
		handleInteractionStart(ev: any): void;
		handleDragStart(ev: any): void;
		handleDrag(dx: any, dy: any, ev: any): void;
		handleDragEnd(ev: any): void;
		handleHitOver(hit: any): void;
		handleHitOut(): void;
		handleHitDone(): void;
		handleInteractionEnd(ev: any, isCancelled: any): void;
		handleScrollEnd(): void;
		queryHit(left: any, top: any): any;
	}

	declare class Interaction {
		view: any;
		component: any;
		constructor(component: any): this;
		opt(name: any): any;
		end(): void;
	}

	declare export class ExternalDropping extends Interaction
		implements ListenerInterface {
		listenTo(other: any, arg: any, callback?: any): this;
		stopListeningTo(other: any, eventName?: any): this;
		dragListener: any;
		isDragging: boolean;
		end(): void;
		bindToDocument(): void;
		unbindFromDocument(): void;
		handleDragStart(ev: any, ui: any): void;
		listenToExternalDrag(el: any, ev: any, ui: any): void;
		computeExternalDrop(componentFootprint: any, meta: any): any;
	}

	declare export class EventResizing extends Interaction {
		eventPointing: any;
		dragListener: any;
		isResizing: boolean;
		constructor(component: any, eventPointing: any): this;
		end(): void;
		bindToEl(el: any): void;
		handleMouseDown(seg: any, ev: any): void;
		handleTouchStart(seg: any, ev: any): void;
		buildDragListener(seg: any, isStart: any): HitDragListener;
		segResizeStart(seg: any, ev: any): void;
		segResizeStop(seg: any, ev: any): void;
		computeEventStartResizeMutation(
			startFootprint: any,
			endFootprint: any,
			origEventFootprint: any
		): any;
		computeEventEndResizeMutation(
			startFootprint: any,
			endFootprint: any,
			origEventFootprint: any
		): any;
	}

	declare export class EventPointing extends Interaction {
		mousedOverSeg: any;
		bindToEl(el: any): void;
		handleClick(seg: any, ev: any): void;
		handleMouseover(seg: any, ev: any): void;
		handleMouseout(seg: any, ev?: any): void;
		end(): void;
	}

	declare class MouseFollower implements ListenerInterface {
		listenTo(other: any, arg: any, callback?: any): this;
		stopListeningTo(other: any, eventName?: any): this;
		options: any;
		sourceEl: any;
		el: any;
		parentEl: any;
		top0: any;
		left0: any;
		y0: any;
		x0: any;
		topDelta: any;
		leftDelta: any;
		isFollowing: boolean;
		isHidden: boolean;
		isAnimating: boolean;
		constructor(sourceEl: any, options: any): this;
		start(ev: any): void;
		stop(shouldRevert: any, callback: any): void;
		getEl(): any;
		removeElement(): void;
		updatePosition(): void;
		handleMove(ev: any): void;
		hide(): void;
		show(): void;
	}

	declare export class EventDragging extends Interaction {
		eventPointing: any;
		dragListener: any;
		isDragging: boolean;
		constructor(component: any, eventPointing: any): this;
		end(): void;
		getSelectionDelay(): any;
		bindToEl(el: any): void;
		handleMousedown(seg: any, ev: any): void;
		handleTouchStart(seg: any, ev: any): void;
		buildSelectListener(seg: any): any;
		buildDragListener(seg: any): any;
		segDragStart(seg: any, ev: any): void;
		segDragStop(seg: any, ev: any): void;
		computeEventDropMutation(
			startFootprint: any,
			endFootprint: any,
			eventDef: any
		): EventDefMutation;
		computeEventDateMutation(startFootprint: any, endFootprint: any): any;
	}

	declare export class DateSelecting extends Interaction {
		dragListener: any;
		constructor(component: any): this;
		end(): void;
		getDelay(): any;
		bindToEl(el: any): void;
		buildDragListener(): HitDragListener;
		computeSelection(
			footprint0: any,
			footprint1: any
		): false | ComponentFootprint;
		computeSelectionFootprint(
			footprint0: any,
			footprint1: any
		): ComponentFootprint;
		isSelectionFootprintAllowed(componentFootprint: any): any;
	}

	declare class DateClicking extends Interaction {
		dragListener: any;
		constructor(component: any): this;
		end(): void;
		bindToEl(el: any): void;
		buildDragListener(): HitDragListener;
	}

	declare export class StandardInteractionsMixin extends Mixin {}

	declare class TimeGridEventRenderer extends EventRenderer {
		timeGrid: any;
		constructor(timeGrid: any, fillRenderer: any): this;
		renderFgSegs(segs: any): void;
		renderFgSegsIntoContainers(segs: any, containerEls: any): void;
		unrenderFgSegs(): void;
		computeEventTimeFormat(): any;
		computeDisplayEventEnd(): boolean;
		fgSegHtml(seg: any, disableResizing: any): string;
		updateFgSegCoords(segs: any): void;
		computeFgSegHorizontals(segs: any): void;
		computeFgSegForwardBack(
			seg: any,
			seriesBackwardPressure: any,
			seriesBackwardCoord: any
		): void;
		sortForwardSegs(forwardSegs: any): void;
		compareForwardSegs(seg1: any, seg2: any): any;
		assignFgSegHorizontals(segs: any): void;
		generateFgSegHorizontalCss(seg: any): any;
	}

	declare class TimeGridHelperRenderer extends HelperRenderer {
		renderSegs(segs: any, sourceSeg: any): JQuery;
	}

	declare class TimeGridFillRenderer extends FillRenderer {
		attachSegEls(type: any, segs: any): any;
	}

	declare export class TimeGrid extends InteractiveDateComponent
		implements DayTableInterface {
		dayDates: any;
		daysPerRow: any;
		rowCnt: any;
		colCnt: any;
		updateDayTable(): any;
		renderHeadHtml(): any;
		renderBgTrHtml(row: any): any;
		bookendCells(trEl: any): any;
		getCellDate(row: any, col: any): any;
		getCellRange(row: any, col: any): any;
		sliceRangeByDay(unzonedRange: any): any;
		sliceRangeByRow(unzonedRange: any): any;
		renderIntroHtml(): any;
		view: any;
		helperRenderer: any;
		dayRanges: any;
		slotDuration: any;
		snapDuration: any;
		snapsPerSlot: any;
		labelFormat: any;
		labelInterval: any;
		headContainerEl: any;
		colEls: any;
		slatContainerEl: any;
		slatEls: any;
		nowIndicatorEls: any;
		colCoordCache: any;
		slatCoordCache: any;
		bottomRuleEl: any;
		contentSkeletonEl: any;
		colContainerEls: any;
		fgContainerEls: any;
		bgContainerEls: any;
		helperContainerEls: any;
		highlightContainerEls: any;
		businessContainerEls: any;
		helperSegs: any;
		highlightSegs: any;
		businessSegs: any;
		constructor(view: any): this;
		componentFootprintToSegs(componentFootprint: any): any[];
		sliceRangeByTimes(unzonedRange: any): any[];
		processOptions(): void;
		computeLabelInterval(slotDuration: any): any;
		renderDates(dateProfile: any): void;
		unrenderDates(): void;
		renderSkeleton(): void;
		renderSlats(): void;
		renderSlatRowHtml(): string;
		renderColumns(): void;
		unrenderColumns(): void;
		renderContentSkeleton(): void;
		unrenderContentSkeleton(): void;
		groupSegsByCol(segs: any): any[];
		attachSegsByCol(segsByCol: any, containerEls: any): void;
		getNowIndicatorUnit(): string;
		renderNowIndicator(date: any): void;
		unrenderNowIndicator(): void;
		updateSize(totalHeight: any, isAuto: any, isResize: any): void;
		getTotalSlatHeight(): any;
		computeDateTop(ms: any, startOfDayDate: any): any;
		computeTimeTop(time: any): any;
		updateSegVerticals(segs: any): void;
		computeSegVerticals(segs: any): void;
		assignSegVerticals(segs: any): void;
		generateSegVerticalCss(
			seg: any
		): {
			top: any,
			bottom: number
		};
		prepareHits(): void;
		releaseHits(): void;
		queryHit(leftOffset: any, topOffset: any): any;
		getHitFootprint(hit: any): ComponentFootprint;
		computeSnapTime(snapIndex: any): Duration;
		getHitEl(hit: any): any;
		renderDrag(eventFootprints: any, seg: any, isTouch: any): boolean;
		unrenderDrag(): void;
		renderEventResize(eventFootprints: any, seg: any, isTouch: any): void;
		unrenderEventResize(): void;
		renderSelectionFootprint(componentFootprint: any): void;
		unrenderSelection(): void;
	}

	declare class Popover implements ListenerInterface {
		listenTo(other: any, arg: any, callback?: any): this;
		stopListeningTo(other: any, eventName?: any): this;
		isHidden: boolean;
		options: any;
		el: any;
		margin: number;
		constructor(options: any): this;
		show(): void;
		hide(): void;
		render(): void;
		documentMousedown(ev: any): void;
		removeElement(): void;
		position(): void;
		trigger(name: any): void;
	}

	declare export class DayGrid extends InteractiveDateComponent
		implements DayTableInterface {
		dayDates: any;
		daysPerRow: any;
		rowCnt: any;
		colCnt: any;
		updateDayTable(): any;
		renderHeadHtml(): any;
		renderBgTrHtml(row: any): any;
		bookendCells(trEl: any): any;
		getCellDate(row: any, col: any): any;
		getCellRange(row: any, col: any): any;
		sliceRangeByDay(unzonedRange: any): any;
		sliceRangeByRow(unzonedRange: any): any;
		renderIntroHtml(): any;
		view: any;
		helperRenderer: any;
		cellWeekNumbersVisible: boolean;
		bottomCoordPadding: number;
		headContainerEl: any;
		rowEls: any;
		cellEls: any;
		rowCoordCache: any;
		colCoordCache: any;
		isRigid: boolean;
		hasAllDayBusinessHours: boolean;
		segPopover: any;
		popoverSegs: any;
		constructor(view: any): this;
		componentFootprintToSegs(componentFootprint: any): any;
		renderDates(dateProfile: any): void;
		unrenderDates(): void;
		renderGrid(): void;
		renderDayRowHtml(row: any, isRigid: any): string;
		getIsNumbersVisible(): boolean;
		getIsDayNumbersVisible(): boolean;
		renderNumberTrHtml(row: any): string;
		renderNumberIntroHtml(row: any): any;
		renderNumberCellsHtml(row: any): string;
		renderNumberCellHtml(date: any): string;
		prepareHits(): void;
		releaseHits(): void;
		queryHit(leftOffset: any, topOffset: any): any;
		getHitFootprint(hit: any): ComponentFootprint;
		getHitEl(hit: any): any;
		getCellHit(row: any, col: any): any;
		getCellEl(row: any, col: any): any;
		executeEventUnrender(): void;
		getOwnEventSegs(): any;
		renderDrag(eventFootprints: any, seg: any, isTouch: any): boolean;
		unrenderDrag(): void;
		renderEventResize(eventFootprints: any, seg: any, isTouch: any): void;
		unrenderEventResize(): void;
		removeSegPopover(): void;
		limitRows(levelLimit: any): void;
		computeRowLevelLimit(row: any): number | false;
		limitRow(row: any, levelLimit: any): void;
		unlimitRow(row: any): void;
		renderMoreLink(row: any, col: any, hiddenSegs: any): JQuery;
		showSegPopover(row: any, col: any, moreLink: any, segs: any): void;
		renderSegPopoverContent(row: any, col: any, segs: any): JQuery;
		resliceDaySegs(segs: any, dayDate: any): any[];
		getMoreLinkText(num: any): any;
		getCellSegs(row: any, col: any, startLevel?: any): any[];
	}

	declare export class AgendaView extends View {
		timeGridClass: any;
		dayGridClass: any;
		timeGrid: any;
		dayGrid: any;
		scroller: any;
		axisWidth: any;
		usesMinMaxTime: boolean;
		constructor(calendar: any, viewSpec: any): this;
		instantiateTimeGrid(): any;
		instantiateDayGrid(): any;
		renderSkeleton(): void;
		unrenderSkeleton(): void;
		renderSkeletonHtml(): string;
		axisStyleAttr(): string;
		getNowIndicatorUnit(): string;
		updateSize(totalHeight: any, isAuto: any, isResize: any): void;
		computeScrollerHeight(totalHeight: any): number;
		computeInitialDateScroll(): {
			top: any
		};
		queryDateScroll(): {
			top: any
		};
		applyDateScroll(scroll: any): void;
		getHitFootprint(hit: any): any;
		getHitEl(hit: any): any;
		executeEventRender(eventsPayload: any): void;
		renderDrag(eventFootprints: any, seg: any, isTouch: any): boolean;
		renderEventResize(eventFootprints: any, seg: any, isTouch: any): void;
		renderSelectionFootprint(componentFootprint: any): void;
	}

	declare class BasicViewDateProfileGenerator extends DateProfileGenerator {
		buildRenderRange(
			currentUnzonedRange: any,
			currentRangeUnit: any,
			isRangeAllDay: any
		): UnzonedRange;
	}

	declare export class BasicView extends View {
		dateProfileGeneratorClass: any;
		dayGridClass: any;
		scroller: any;
		dayGrid: any;
		weekNumberWidth: any;
		constructor(calendar: any, viewSpec: any): this;
		instantiateDayGrid(): any;
		executeDateRender(dateProfile: any): void;
		renderSkeleton(): void;
		unrenderSkeleton(): void;
		renderSkeletonHtml(): string;
		weekNumberStyleAttr(): string;
		hasRigidRows(): boolean;
		updateSize(totalHeight: any, isAuto: any, isResize: any): void;
		computeScrollerHeight(totalHeight: any): number;
		setGridHeight(height: any, isAuto: any): void;
		computeInitialDateScroll(): {
			top: number
		};
		queryDateScroll(): {
			top: any
		};
		applyDateScroll(scroll: any): void;
	}

	declare export class MonthView extends BasicView {
		setGridHeight(height: any, isAuto: any): void;
		isDateInOtherMonth(date: any, dateProfile: any): boolean;
	}

	declare export class ListView extends View {
		eventRendererClass: any;
		eventPointingClass: any;
		segSelector: any;
		scroller: any;
		contentEl: any;
		dayDates: any;
		dayRanges: any;
		constructor(calendar: any, viewSpec: any): this;
		renderSkeleton(): void;
		unrenderSkeleton(): void;
		updateSize(totalHeight: any, isAuto: any, isResize: any): void;
		computeScrollerHeight(totalHeight: any): number;
		renderDates(dateProfile: any): void;
		componentFootprintToSegs(footprint: any): any[];
		renderEmptyMessage(): void;
		renderSegList(allSegs: any): void;
		groupSegsByDay(segs: any): any[];
		dayHeaderHtml(dayDate: any): string;
	}
}
