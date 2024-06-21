import EditHabitView from "@/route/EditHabitView";
import HabitsView from "@/route/HabitsView";
import NewHabitView from "@/route/NewHabitView";
import TodayView from "@/route/TodayView";
import AuthForm from "@/components/AuthForm";
import ViewSpecificHabit from "@/route/ViewSpecificHabit";
import {BrowserRouter, Route, Routes} from "react-router-dom";

import './styles.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route id={'root'}>
          <Route path={'/'} element={<TodayView />} />
          <Route path={'/habits'} element={<HabitsView />} />
          <Route path={'/habit'} element={<NewHabitView />} />
          <Route path={'/habit/:id'} element={<ViewSpecificHabit />} />
          <Route path={'/habit/edit/:id'} element={<EditHabitView />} />
          <Route path={'/auth'} element={<AuthForm/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
