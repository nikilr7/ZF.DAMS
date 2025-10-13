import {
  Calendar,
  luxonLocalizer,
  Views,
  ToolbarProps,
  EventProps,
  Navigate,
  NavigateAction,
  DateLocalizer,
  EventPropGetter,
  Event,
} from "react-big-calendar";
import {
  Button,
  ButtonGroup,
  Text,
  HStack,
  IconButton,
  Box,
  Tooltip,
} from "@chakra-ui/react";
// @ts-expect-error: Unchecked type import
import MonthView from "react-big-calendar/lib/Month";
// @ts-expect-error: Unchecked type import
import * as dates from "react-big-calendar/lib/utils/dates";
import { DateTime } from "luxon";
import _ from "lodash";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./_css/Calendar.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IPartialDocument, IDocument } from "../../../hooks/defs";
import { useDocumentContext } from "../../../context/DocumentConfigurationContext";
import { IPeriod } from "../../datetime";

interface IProps<T> {
  documents: T[];
  onSelected(document: IPartialDocument): void;
  onRenderTitle?: (document: IPartialDocument | IDocument) => React.ReactNode;
  onRenderTooltip?: (document: IPartialDocument | IDocument) => React.ReactNode;
  onPeriodChange: (period: IPeriod) => void;
  type: string;
}

export default function Calender<T>(props: IProps<T>) {
  const {
    documents,
    onSelected,
    onRenderTitle,
    onRenderTooltip,
    type,
    onPeriodChange,
  } = props;

  const configuration = useDocumentContext().get(type);

  const start = configuration?.calendarView?.start;
  const end = configuration?.calendarView?.end;

  const events: Event[] = documents.map((d: any) => {
    let eventStart, eventEnd;

    eventStart = start ? d.fields?.[start] ?? d.createdOn : d.createdOn;
    eventEnd = end ? d.fields?.[end] ?? d.createdOn : d.createdOn;

    return {
      allDay: true,
      title: d.uniqueNumber,
      start: DateTime.fromJSDate(
        eventStart ? new Date(eventStart) : new Date(Date.now()),
      ).toJSDate(),
      end: DateTime.fromJSDate(
        eventEnd ? new Date(eventEnd) : new Date(Date.now()),
      )
        .plus({ minutes: 15 })
        .toJSDate(),
      resource: d,
    };
  });

  const onGetEventProp: EventPropGetter<Event> = (_event): any => {
    const isInFuture = true;

    return {
      draggable: false,
      className: "event-pill" + (isInFuture ? " future" : ""),
    } as any;
  };

  const handleRangeChange = (range: any) => {
    const period: IPeriod = {
      name: "range",
      start: DateTime.fromJSDate(range.start),
      end: DateTime.fromJSDate(range.end),
    };

    onPeriodChange(period);
  };

  return (
    <Box w="full" h="full">
      <Calendar
        defaultDate={new Date(Date.now())}
        defaultView={Views.MONTH}
        views={{ month: true, week: WeeklyOverview as any }}
        events={events}
        localizer={luxonLocalizer(DateTime)}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={(event): any => {
          const document = event.resource as IDocument | IPartialDocument;
          onSelected(document);
        }}
        drilldownView={null}
        components={{
          toolbar: Toolbar,
          event: (props): any => (
            <CalendarEvent
              {...props}
              onRenderTitle={onRenderTitle}
              onRenderTooltip={onRenderTooltip}
            />
          ),
        }}
        onRangeChange={handleRangeChange}
        eventPropGetter={onGetEventProp}
        popup
      />
    </Box>
  );
}

type CalendarEventProps = EventProps<Event> & {
  onRenderTitle?: (document: IPartialDocument | IDocument) => React.ReactNode;
  onRenderTooltip?: (document: IPartialDocument | IDocument) => React.ReactNode;
};

function CalendarEvent(props: CalendarEventProps) {
  const { title, event, onRenderTooltip, onRenderTitle } = props;
  const document = event.resource;

  return (
    <HStack alignItems={"center"} w="full">
      {onRenderTooltip ? (
        <Tooltip
          label={onRenderTooltip(document)}
          backgroundColor={"white"}
          placement="right"
          minWidth={"320px"}
          maxWidth={"720px"}
        >
          {onRenderTitle?.(document) ?? title}
        </Tooltip>
      ) : (
        <>{onRenderTitle?.(document) ?? title}</>
      )}
    </HStack>
  );
}

class WeeklyOverview extends MonthView {
  public static navigate = (date: Date, action: NavigateAction) => {
    switch (action) {
      case "PREV":
        return dates.add(date, -1, "week");
      case "NEXT":
        return dates.add(date, 1, "week");
      default:
        return date;
    }
  };

  public static title = (date: Date) => {
    const datetime = DateTime.fromJSDate(date);
    return datetime.toFormat("MMMM yyyy '| Week '") + datetime.weekNumber;
  };

  protected _weekCount: number = 0;

  public render() {
    const { date } = (this as any).props;

    const range = this.renderRange(
      date ? new Date(date) : new Date(),
      (this as any).props,
    );

    const days = dates.range(range.start, range.end);
    const weeks = _.chunk(days, 7);

    this._weekCount = weeks.length;

    return (
      <div className={"rbc-month-view"}>
        <div className="rbc-row rbc-month-header">
          {(this as any).renderHeaders(weeks[0])}
        </div>
        {weeks.map((this as any).renderWeek)}
        {(this as any).props.popup && (this as any).renderOverlay()}
      </div>
    );
  }

  private renderRange(date: Date, { localizer }: { localizer: DateLocalizer }) {
    const firstOfWeek = localizer.startOfWeek("");

    const start = dates.startOf(date, "week", firstOfWeek);
    const end = dates.endOf(date, "week", firstOfWeek);

    return { start, end };
  }
}

function Toolbar(props: ToolbarProps) {
  const { view, label, onView, onNavigate } = props;

  return (
    <HStack mb={"4"} w="100%" justifyContent={"space-between"}>
      <ButtonGroup w="160px" spacing={"0"}>
        <Button
          variant={view === "week" ? "solid" : "outline"}
          borderTopRightRadius={0}
          borderBottomRightRadius={0}
          onClick={() => onView("week")}
        >
          Week
        </Button>
        <Button
          variant={view === "month" ? "solid" : "outline"}
          borderTopLeftRadius={0}
          borderBottomLeftRadius={0}
          onClick={() => onView("month")}
        >
          Month
        </Button>
      </ButtonGroup>
      <HStack>
        <IconButton
          icon={
            <ChevronLeft size={"16px"} color="#42526E" strokeWidth="1.33" />
          }
          variant="ghost"
          onClick={() => onNavigate(Navigate.PREVIOUS)}
          aria-label={""}
        />
        <Text fontSize="2xl" fontWeight={"medium"}>
          {label}
        </Text>
        <IconButton
          icon={
            <ChevronRight size={"16px"} color="#42526E" strokeWidth="1.33" />
          }
          variant="ghost"
          onClick={() => onNavigate(Navigate.NEXT)}
          aria-label={""}
        />
      </HStack>
      <HStack w="160px" justifyContent={"flex-end"}>
        <Button variant={"outline"} onClick={() => onNavigate(Navigate.TODAY)}>
          Today
        </Button>
      </HStack>
    </HStack>
  );
}
