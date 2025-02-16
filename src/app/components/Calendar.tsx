import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "temporal-polyfill/global";
// Types
import type { Transaction } from "@/app/types/transaction"; // Assuming the type is exported from types.ts

interface Event {
  id: string;
  title?: string;
  runningBalance: number;
  description: string;
  time: {
    start: string;
    end: string;
  };
  color: string;
}

interface Day {
  date: Temporal.PlainDate;
  isCurrentMonth: boolean;
}

interface CalendarDateIndicatorProps {
  selectedDate: Temporal.PlainDate;
}

interface CalendarDateSelectorProps {
  currentDate: Temporal.PlainDate;
  selectedDate: Temporal.PlainDate;
  onDateSelected: (date: Temporal.PlainDate) => void;
}

interface CalendarMonthDayItemProps {
  day: Day;
  isToday: boolean;
  isCurrentMonth: boolean;
  events: Event[];
}

interface CalendarMonthProps {
  events: Event[];
}

interface CalendarProps {
  transactions: Transaction[];
}

// Constants
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Helper function
const generateUniqueId = (): string => Math.random().toString(36).substr(2, 9);

const CalendarDateIndicator: React.FC<CalendarDateIndicatorProps> = ({ selectedDate }) => {
  const month = selectedDate.toLocaleString("en-US", { month: "long" });
  const year = selectedDate.year;
  return <div className="text-2xl font-semibold text-gray-800">{`${month} ${year}`}</div>;
};

const CalendarDateSelector: React.FC<CalendarDateSelectorProps> = ({ currentDate, selectedDate, onDateSelected }) => {
  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => onDateSelected(selectedDate.subtract({ months: 1 }))}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={() => onDateSelected(currentDate)} className="px-3 py-1 hover:bg-gray-100 rounded-md">
        Today
      </button>
      <button
        onClick={() => onDateSelected(selectedDate.add({ months: 1 }))}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

const CalendarWeekdays: React.FC = () => {
  return (
    <div className="grid grid-cols-7 border-b border-gray-200">
      {WEEKDAYS.map((day) => (
        <div key={day} className="p-2 text-right text-gray-600">
          {day}
        </div>
      ))}
    </div>
  );
};

const CalendarMonthDayItem: React.FC<CalendarMonthDayItemProps> = ({ day, isToday, isCurrentMonth, events }) => {
  const dayEvents = events?.filter((event) => event.time.start === day.date.toString()) || [];

  const balance = dayEvents.length > 0 ? dayEvents[dayEvents.length - 1].runningBalance : 0;

  return (
    <div
      className={`
      min-h-32 p-2 border border-gray-200 
      ${!isCurrentMonth ? "bg-gray-50" : "bg-white"}
      ${isToday ? "font-bold" : ""}
    `}
    >
      <div
        className={`
        text-right mb-4
        ${isToday ? "h-6 w-6 rounded-full bg-gray-800 text-white flex items-center justify-center ml-auto" : ""}
      `}
      >
        {day.date.day}
      </div>
      <div className="text-sm">
        <div className="font-semibold mb-1">Balance: ${balance.toFixed(2)}</div>
        {dayEvents.map(
          (event) =>
            event.title && (
              <div key={event.id} className="mb-1">
                <div style={{ color: event.color }}>{event.title}</div>
                <div className="text-xs text-gray-600">{event.description}</div>
              </div>
            )
        )}
      </div>
    </div>
  );
};

const CalendarMonth: React.FC<CalendarMonthProps> = ({ events = [] }) => {
  const [selectedDate, setSelectedDate] = useState<Temporal.PlainDate>(Temporal.Now.plainDateISO());

  const today = Temporal.Now.plainDateISO();

  const getDaysInMonth = (): Day[] => {
    const firstOfMonth = selectedDate.with({ day: 1 });
    const daysInMonth = selectedDate.daysInMonth;

    return Array.from({ length: daysInMonth }, (_, i) => ({
      date: firstOfMonth.add({ days: i }),
      isCurrentMonth: true,
    }));
  };

  const getPreviousMonthDays = (): Day[] => {
    const firstOfMonth = selectedDate.with({ day: 1 });
    const dayOfWeek = firstOfMonth.dayOfWeek;
    const daysToAdd = dayOfWeek === 7 ? 6 : dayOfWeek - 1;

    return Array.from({ length: daysToAdd }, (_, i) => ({
      date: firstOfMonth.subtract({ days: daysToAdd - i }),
      isCurrentMonth: false,
    }));
  };

  const getNextMonthDays = (): Day[] => {
    const lastOfMonth = selectedDate.with({ day: selectedDate.daysInMonth });
    const dayOfWeek = lastOfMonth.dayOfWeek;
    const daysToAdd = dayOfWeek === 7 ? 0 : 7 - dayOfWeek;

    return Array.from({ length: daysToAdd }, (_, i) => ({
      date: lastOfMonth.add({ days: i + 1 }),
      isCurrentMonth: false,
    }));
  };

  const days = [...getPreviousMonthDays(), ...getDaysInMonth(), ...getNextMonthDays()];

  return (
    <div className="bg-white rounded-lg shadow p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <CalendarDateIndicator selectedDate={selectedDate} />
        <CalendarDateSelector currentDate={today} selectedDate={selectedDate} onDateSelected={setSelectedDate} />
      </div>

      <CalendarWeekdays />

      <div className="grid grid-cols-7 gap-px mt-1">
        {days.map((day) => (
          <CalendarMonthDayItem
            key={day.date.toString()}
            day={day}
            isToday={day.date.equals(today)}
            isCurrentMonth={day.isCurrentMonth}
            events={events}
          />
        ))}
      </div>
    </div>
  );
};

const Calendar: React.FC<CalendarProps> = ({ transactions }) => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const generateEvents = (): Event[] => {
      const sortedTransactions = [...transactions].sort((a, b) =>
        Temporal.PlainDate.compare(Temporal.PlainDate.from(a.date), Temporal.PlainDate.from(b.date))
      );

      const events: Event[] = [];
      const today = Temporal.Now.plainDateISO();
      const endOfYear = Temporal.PlainDate.from({
        year: today.year,
        month: 12,
        day: 31,
      });

      let initialBalance = 0;
      let currentDate = today;

      while (Temporal.PlainDate.compare(currentDate, endOfYear) <= 0) {
        const dateString = currentDate.toString();
        const matchingTransactions = sortedTransactions.filter((t) => t.date === dateString);

        if (matchingTransactions.length > 0) {
          matchingTransactions.forEach((transaction) => {
            events.push({
              title: transaction.title,
              runningBalance: initialBalance + transaction.amount,
              description: `${transaction.amount >= 0 ? "Income" : "Expense"}: $${Math.abs(transaction.amount).toFixed(
                2
              )}`,
              time: {
                start: dateString,
                end: dateString,
              },
              id: transaction.id?.toString() ?? generateUniqueId(),
              color: transaction.amount >= 0 ? "#22c55e" : "#ef4444",
            });
          });
          initialBalance += matchingTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
        } else {
          events.push({
            runningBalance: initialBalance,
            description: "Daily Balance",
            id: generateUniqueId(),
            time: {
              start: dateString,
              end: dateString,
            },
            color: "#3b82f6",
          });
        }

        currentDate = currentDate.add({ days: 1 });
      }

      return events;
    };

    setEvents(generateEvents());
  }, [transactions]);

  return (
    <div className="w-full overflow-x-auto">
      <CalendarMonth events={events} />
    </div>
  );
};

export default Calendar;
