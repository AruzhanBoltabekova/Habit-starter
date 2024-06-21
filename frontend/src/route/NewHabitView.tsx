import HabitForm from "@/components/HabitForm";
import Layout from "@/components/Layout";
import {Link} from "react-router-dom";

export default function NewHabitView() {
  return (
    <Layout
      NavEl={<Link to={'/habits'}>back</Link>}
      heading={{title: 'New Habit'}}
    >
      <HabitForm />
    </Layout>
  );
}