import HabitListing from "@/components/HabitListing";
import Layout from "@/components/Layout";
import {API_URL, habitsRemap, type HabitWithRecords} from "@/utils";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";

export default function HabitsView() {
  const [habits, setHabits] = useState<HabitWithRecords[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(API_URL + '/api/habit', {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      }
    }).then(response => {
      setHabits(habitsRemap(response.data));
    });
  }, []);

  return (
    <Layout
      heading={{title: 'Habits'}}
      NavEl={<NavLink to={'/habit'}>New</NavLink>}
    >
      <hr/>
      <ul className={'divide-y-2 divide-gray-500 space-y-2 py-2'}>
        {habits.map(habit => <HabitListing key={habit.id} {...habit} actionEl={<button className={'btn'} onClick={() => {navigate({pathname: `/habit/${habit.id}`})}}>View</button>}/>)}
      </ul>
    </Layout>
  );
}