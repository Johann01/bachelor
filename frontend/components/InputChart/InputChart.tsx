import { ResponsiveLine } from "@nivo/line";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const MyResponsiveLine = ({ data }) => {
  data.splice(5, 1);
  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 20, right: 100, bottom: 20, left: 60 }}
      xScale={{ type: "time", format: "%Y-%m-%d", precision: "day" }}
      yScale={{
        type: "linear",
        stacked: false,
        min: "auto",
        max: "auto",
      }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendOffset: -40,
        legendPosition: "middle",
      }}
      axisBottom={{
        tickValues: 3,
        tickPadding: 5,
        tickRotation: 0,
        format: "%Y-%m-%d",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      colors={{ scheme: "nivo" }}
      pointSize={8}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointLabelYOffset={-12}
      enableSlices="x"
      enableGridX={false}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default MyResponsiveLine;
