import HabitForm from "@/components/HabitForm";
import Layout from "@/components/Layout";
import {API_URL, type Habit} from "@/utils";
import axios from "axios";
import {useEffect, useState} from "react";
import {NavLink, useParams} from "react-router-dom";

export default function EditHabitView() {
  const params = useParams();
  const [habit, setHabit] = useState<Habit>();
  const {id} = params;

  useEffect(() => {
    axios.get(`${API_URL}/api/habit/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      }
    }).then(response => {
      console.log(response.data);
      setHabit(response.data);
    });
  }, [id]);

  return (
    <Layout NavEl={<NavLink to={'/habits'}>back</NavLink>} heading={{
      title: 'Edit Habit',
    }}>
      <HabitForm habit={habit} />
    </Layout>
  );
}
