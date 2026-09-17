import { ChartFrame, Heatmap, sampleData } from "@bluesigns/ui";

const { weekdays, hours, ordersHeatmap } = sampleData;

export const OrdersByHourInFrame = () => (
  <div style={{ width: 820 }}>
    <ChartFrame
      title="Orders by weekday and hour"
      description="Sequential ramp with a scale legend; the grid is keyboard navigable"
      table={{ columns: ["Day", ...hours], rows: weekdays.map((d, i) => [d, ...ordersHeatmap[i]!.map(String)]) }}
    >
      <Heatmap rows={weekdays} columns={hours} values={ordersHeatmap} label="Orders by weekday and hour" />
    </ChartFrame>
  </div>
);

export const EveningHours = () => (
  <div style={{ width: 480 }}>
    <Heatmap
      rows={weekdays}
      columns={hours.slice(17)}
      values={ordersHeatmap.map((r) => r.slice(17))}
      columnLabelEvery={1}
      label="Orders by weekday, 5 PM to midnight"
    />
  </div>
);

const weeks = ["Wk 1", "Wk 2", "Wk 3", "Wk 4"];
const cities = ["Bengaluru", "Mumbai", "Delhi", "Pune", "Chennai"];

export const RevenueByCity = () => (
  <div style={{ width: 420 }}>
    <Heatmap
      rows={weeks}
      columns={cities.map((c) => c.slice(0, 3))}
      columnLabelEvery={1}
      format="inr-compact"
      values={[
        [412000, 388000, 301000, 142000, 128000],
        [436000, 372000, 318000, 151000, 133000],
        [468000, 401000, 296000, 166000, 141000],
        [512000, 428000, 334000, 172000, 150000],
      ]}
      label="Weekly revenue by city"
    />
  </div>
);
