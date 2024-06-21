import HabitListing from "@/components/HabitListing";
import Layout from "@/components/Layout";
import {API_URL, type HabitWithRecords, planDates} from "@/utils";
import axios from "axios";
import React, {useEffect} from "react";
import {NavLink} from "react-router-dom";

type RawRecord = HabitWithRecords & {
  records: {
    date: string
    id: number
  }[]
};
export default function TodayView() {
  const [habits, setHabits] = React.useState<RawRecord[]>([]);

  useEffect(() => {
    axios.get(API_URL + '/api/habit', {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      }
    }).then(response => {
      const habits = response.data.map(habit => {
        const start = new Date(habit.start);
        const plan = planDates(habit.repeatings, habit.schedule, start);
        const isToday = plan.some(date => {
          const today = new Date();
          return date.toDateString() === today.toDateString();
        });

        return {isToday, ...habit, start}
      })

      const todayHabits = habits.filter(habit => habit.isToday);
      setHabits(todayHabits);
      // filter habits that have a planed date today
      console.log('all habits', habits);
      console.log('today habits', todayHabits);
    });
  }, []);

  return (
    <Layout NavEl={<NavLink to={'/habits'}>Show all</NavLink>} heading={{
      title: 'Today',
      subtitle: `You have ${habits.length} habits to complete today`
    }}>
      <ul className={'divide-y-2 divide-gray-500 space-y-2 py-2'}>
        {habits.map(habit => {
          let isRecordedToday = false;
          let records = [];
          let recordId = 0;
          if (habit.records.length > 0) {
            isRecordedToday = habit.records.some(record => {
              const today = new Date();
              // @ts-expect-error no time to fix this
              const recordDate = new Date(record.date);
              return recordDate.toDateString() === today.toDateString();
            });
            //
            if (isRecordedToday) {
              recordId = habit.records.map(record => {
                const today = new Date();
                // @ts-expect-error no time to fix this
                const recordDate = new Date(record.date);
                const isToday = recordDate.toDateString() === today.toDateString();
                if (isToday) {
                  // @ts-expect-error no time to fix this
                  return record.id;
                }
              })[0];
            }
            // @ts-expect-error no time to fix this
            records = habit.records.map(record => record.date);
            console.log(recordId)
          }
          // @ts-expect-error no time to fix this
          return (<HabitListing records={records as Date[]} key={habit.id} {...habit} actionEl={
            <button
              onClick={() => {
                if (isRecordedToday) {
                  axios.delete(`${API_URL}/api/record/${recordId}`, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem('jwt')}`
                    }
                  }).then(response => {
                    console.log(response.data)
                  });
                } else {
                  axios.put(`${API_URL}/api/record/habit/${habit.id}`, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem('jwt')}`
                    }
                  }).then(response => {
                    console.log(response.data)
                  });
                }
              }}
              className={'btn'}
            >{isRecordedToday ? 'Uncheck' : 'Check'}</button>}/>)
        })}
      </ul>
    </Layout>
  );
}