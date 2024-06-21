import PlanPreview from "@/components/PlanPreview";
import {API_URL, CATEGORIES, type Category, planDates, type Habit, randomString, WEEKDAYS, habitRemapSchedule} from "@/utils";
import {Field, Input, Label, Legend, Select, Textarea} from "@headlessui/react";
import axios from "axios";
import React, {useEffect, useState} from "react";

export default function HabitForm(props: {
  habit?: Omit<Habit, 'id'>
}) {
  const [name, setName] = useState<string>( props.habit?.name || randomString());
  const [description, setDescription] = useState<string | undefined>(props.habit?.description || undefined);
  const [repeatings, setRepeatings] = useState<number>(props.habit?.repeatings || 10);
  const [start, setStart] = useState<Date>(props.habit?.start || new Date());
  const [Category, setCategory] = useState<Category | undefined>(props.habit?.Category || undefined);
  const [schedule, setSchedule] = useState<boolean[]>(props.habit?.schedule || [
    true,
    true,
    false,
    true,
    true,
    false,
    true
  ]);
  const [planedDates, setPlannedDates] = useState<Date[]>(planDates(repeatings, schedule, start));

  const formattedDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  useEffect(() => {
    setPlannedDates(planDates(repeatings, schedule, start))
  }, [start, repeatings, schedule]);

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);

      const reqUrl = `${API_URL}/api/habit`;

      const reqData: {
        name: string,
        repeatings: number,
        start: Date,
        schedule: boolean[],
        Category?: Category
        description?: string
      } = {
        schedule: habitRemapSchedule(schedule),
        name,
        repeatings,
        start,
        Category,
        description
      };

      console.log(reqData);

      axios.put(reqUrl, reqData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      }).then(response => {
        console.log(response.data);
      }).catch(error => {
        console.error(error);
      });

    }}>
      <Field>
        <Label>Name</Label>
        <Input required type="text" name={'name'} value={name} onChange={(e) => setName(e.target.value)}/>
      </Field>
      <Field>
        <Label>Description</Label>
        <Textarea name={'description'} value={description || ''} onChange={(e) => {
          setDescription(e.target.value);
        }}/>
      </Field>

      <Field>
        <Label>Category</Label>
        <Select name={'Category'} onChange={(e) => {
          const category = e.target.value === 'NULL' ? undefined : e.target.value as Category;
          setCategory(category);
        }}>
          <option value={"NULL"}>No Category</option>
          {CATEGORIES.map(({value, text}, index) => (
            <option key={`category-${index}`} value={value}>{text}</option>
          ))}
        </Select>
      </Field>

      <Field>
        <Label>Start Date</Label>
        <input type="date" name={'start'} defaultValue={formattedDate(start)}/>
      </Field>

      <Field>
        <Label>Repetitions</Label>
        <input type="number" name={'repeatings'} min={1} value={repeatings} onChange={(event)   => {
          // @ts-expect-error - value is a number
          setRepeatings(event.target.value as number)
        } }/>
      </Field>

      <Field>
        <Legend><h2>Week Schedule</h2></Legend>
        {WEEKDAYS.map(({value, text}, index) => {
          return (
            <div key={'day_' + value}>
              <input type={'checkbox'} defaultChecked={schedule[index]} onChange={Change => {
                const newSchedule = schedule;
                newSchedule[index] = Change.target.checked;
                setSchedule([...newSchedule]);
              }}/>
              <label>{text}</label>
            </div>
          );
        })}
      </Field>

      <PlanPreview planedDates={planedDates}/>

      <button type="submit">Save</button>

    </form>
  );
}