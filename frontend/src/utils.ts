import React, {createContext} from "react";

export const WEEKDAYS = [
  {text: "Neděle", short: "Ne", value: "SU"},
  {text: "Pondělí", short: "Po", value: "MO"},
  {text: "Úterý", short: "Út", value: "TU"},
  {text: "Středa", short: "St", value: "WE"},
  {text: "Čtvrtek", short: "Čt", value: "TH"},
  {text: "Pátek", short: "Pá", value: "FR"},
  {text: "Sobota", short: "So", value: "SA"},
] as const;
// Convert string to integer
export const toInt = (str: string) => parseInt(str, 10);

// Generate random index
export const randomIndex = (max: number) => Math.floor(Math.random() * max);

// Generate random name
export const randomString = (dictionary = [
  [
    'Healthy',
    'Happy',
    'Productive',
    'Creative',
    'Active',
    'Mindful',
    'Relaxing',
    'Social'
  ],
  [
    'morning',
    'evening',
    'day',
    'night',
    'week',
    'month',
    'year',
    'life'
  ],
  [
    '🌞',
    '🌜',
    '🌟',
    '🌈',
    '🌺',
    '🌳',
    '🌊',
    '🌍'
  ]
]) => dictionary.map(word => word[randomIndex(word.length)]).join(' ');

export const authContext = createContext({
  isAuthenticated: false,
});

export const API_URL = 'http://localhost:3000';

export function useAuth() {
  return React.useContext(authContext);
}

export type Category = 'HEALTH' | 'CAREER';

export const CATEGORIES : {
  value: Category,
  text: string
}[] = [
  {
    value: 'HEALTH',
    text: 'Health ⛑️',
  },
  {
    value: 'CAREER',
    text: 'Career 🚀',
  }
]

export type RawHabit = {
  id: number
  Category: Category
  description?: string
  name: string
  repeatings: number
  schedule: boolean[]
  start: string
  records: {
    date: string
  }[]
}

export type Habit = {
  id: number
  Category: Category
  description?: string
  name: string
  repeatings: number
  schedule: boolean[]
  start: Date
}

export type HabitWithRecords = Habit & {
  records: Date[]
  _count?: {
    records: number
  }
}

export function planDates(repeatings: number, schedule: boolean[], start: Date) {
  const plannedDates: Date[] = [];

  for (let i = 0; i < repeatings; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    if (schedule[date.getDay()]) {
      plannedDates.push(date);
    }
  }

  return plannedDates;
}

export function habitRemapUtils(habit: RawHabit) {
  const {records, schedule, start, ...rest} = habit;
  return {
    ...rest,
    schedule: [
      schedule[6],
      schedule[0],
      schedule[1],
      schedule[2],
      schedule[3],
      schedule[4],
      schedule[5],
    ],
    start: new Date(start),
    records: records.map((record: { date: string }) => new Date(record.date))
  }
}

// Remap back schedule before sending to the server
// Sunday is the first day of the week, should be the last
export function habitRemapSchedule(schedule: Habit['schedule']) {
  return [
    schedule[1],
    schedule[2],
    schedule[3],
    schedule[4],
    schedule[5],
    schedule[6],
    schedule[0],
  ]
}

export function habitsRemap(habits: RawHabit[]) {
  return habits.map(habitRemapUtils);
}