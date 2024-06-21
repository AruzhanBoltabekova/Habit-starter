import {WEEKDAYS} from "@/utils";
import React from "react";

function PlanPreview(props: {
  planedDates: Date[],
}) {
  const {planedDates} = props;
  const repeatings = planedDates.length;

  return (
    <div id={'preview'} className={'br p-4 py-5 md:px-10 md:py-10'}>
      <header className={'fflexer'}>
        <div>
          <h2 className={'text-lg font-bold'}>Preview your plan</h2>
          <p className={'p'}>
            {repeatings} repetitions plan
          </p>
        </div>
      </header>
      <ul className={'divide-gray-300 py-3 divide-dashed divide-y'}>
        {planedDates.map((date, index) => {
          return (
            <li key={'day_' + date.toString()} className={'py-2 space-x-4 text-sm md:py-3 justify-between flex'}>
              <span className={'font-normal flex-grow text-blue-500'}>#{++index}</span>{` `}
              <span className={'font-medium inline-block'}>{date.toLocaleDateString()}</span> {` `}
              <span className={'text-gray-600 text-right opacity-45'}>({WEEKDAYS[date.getDay()]['short']})</span>
              {index < planedDates.length && <hr/>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PlanPreview;