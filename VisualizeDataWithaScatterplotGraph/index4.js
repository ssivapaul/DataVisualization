// Make sure D3 is properly imported (for example, in HTML you can use this):
// <script src="https://d3js.org/d3.v7.min.js"></script>

// Define the parseTime function for "mm:ss" format
const parseTime = d3.timeParse("%M:%S");

// Sample data in "mm:ss" format
const data = [
  { time: "00:10" },
  { time: "00:20" },
  { time: "00:30" },
  { time: "01:00" },
  { time: "01:30" },
];

// Convert time strings to Date objects
data.forEach((d) => (d.date = parseTime(d.time)));
console.log(data);
// Define the width of the chart (replace with your own width)
const width = 500;
const height = 500;
// Define the xScale using d3.scaleTime()
const xScale = d3
  .scaleTime()
  .domain(d3.extent(data, (d) => d.date)) // Set domain based on the parsed dates
  .range([0, width]); // Define the range in pixels

console.log(data[0].timeInSeconds); // Test the scale with a parsed time

// Define yScale (yAxis scale)
const yScale = d3
  .scaleLinear()
  .domain([0, d3.max(data, (d) => d.timeInSeconds)]) // Set domain based on the maximum time in seconds
  .range([height, 0]);
console.log(yScale(data[0].timeInSeconds)); // Test the scale with a time in seconds
