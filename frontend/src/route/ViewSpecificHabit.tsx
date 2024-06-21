import Layout from "@/components/Layout";
import PlanPreview from "@/components/PlanPreview";
import {API_URL, planDates, CATEGORIES, WEEKDAYS, type HabitWithRecords, habitRemapUtils} from "@/utils";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";

export default function ViewSpecificHabit() {
  const params = useParams();
  const [habit, setHabit] = useState<HabitWithRecords>();
  const [planedDates, setPlannedDates] = useState<Date[]>([]);
  const {id} = params;

  const deleteHandler = (e) => {
    e.preventDefault();
    axios.delete(`${API_URL}/api/habit/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      }
    }).then(response => {
      console.log(response.data)
    });
  }

  useEffect(() => {
    axios.get(`${API_URL}/api/habit/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      }
    }).then(response => {
      const habit : HabitWithRecords = habitRemapUtils(response.data)
      const {repeatings, schedule, start} = habit;
      const plan = planDates(repeatings, schedule, start);
      setPlannedDates(plan);
      setHabit(habit);
    });
  }, [id]);

  return (
    <Layout
      heading={{
        title: habit?.name as string,
      }}
      NavEl={<Link to={`/habit/edit/${id}`}>Edit</Link>}
    >
      <>
        {habit?.description && <p>{habit?.description}</p>}
        <p>Repeatings: {habit?.repeatings}</p>
        <p>Start: {habit?.start.toLocaleDateString()}</p>
        <p>Category: {CATEGORIES.find(cat => cat.value === habit?.Category)?.text || 'no category'}</p>
        <p>
          <strong>
            Schedule
          </strong>
        </p>
        <ul>
          {habit?.schedule.map((day, index) => (
            <li key={`day-${index}`}>{WEEKDAYS[index].text}: {day ? '✅' : '❌'}</li>
          ))}
        </ul>
        <hr/>
        <h2>Records {habit?.records.length}</h2>
          {habit?.records.map((record, index) => (
            <div key={`record-${index}`}>
              <p>{record.toLocaleDateString()}</p>
            </div>
          ))}
        <hr/>
        <PlanPreview planedDates={planedDates} />
        <button className={'btn'} onClick={deleteHandler}>Delete</button>
      </>
    </Layout>
  );
}