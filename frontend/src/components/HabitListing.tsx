import type {HabitWithRecords} from "@/utils";
import React from "react";
import {useNavigate} from "react-router-dom";

export default function HabitListing(props: React.PropsWithoutRef<HabitWithRecords & {
  actionEl?: React.ReactNode
}>) {
  const {description, name, repeatings, id, records, actionEl } = props;
  const navigate = useNavigate();
  return (
    <li className={'flex items-center justify-between'}>
      <header>
        <h2 className={'font-bold mt-2 font-sans'}>{name}</h2>
        {description && <p>{description}</p>}
      </header>
      <div className={'flex justify-between'}>
        {records.length}/{repeatings}
      </div>
      {actionEl}
    </li>
  );
}