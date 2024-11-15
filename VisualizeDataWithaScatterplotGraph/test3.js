// Sample data with time strings in mm:ss format
const data = [
  { time: "00:10", value: 5 },
  { time: "01:15", value: 10 },
  { time: "02:30", value: 15 },
  { time: "03:45", value: 20 },
  { time: "04:10", value: 5 },
  { time: "05:15", value: 10 },
  { time: "06:30", value: 15 },
  { time: "07:45", value: 20 },
];

/* // Convert mm:ss strings to seconds
function parseTimeToSeconds(timeString) {
  const [minutes, seconds] = timeString.split(":").map(Number);
  return minutes * 60 + seconds;
}

// Convert seconds back to mm:ss format for display
function formatSecondsToMMSS(seconds) {
  const minutes = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

// Parse data to seconds
const parsedData = data.map((d) => ({
  ...d,
  timeInSeconds: parseTimeToSeconds(d.time),
})); */

// Set dimensions and margins
const width = 1000;
const height = 500;
const margin = { top: 70, right: 70, bottom: 70, left: 70 };

// Create an SVG element
const svg = d3
  .select("body")
  .attr("position", "relative")
  .attr("style", "border: 2px solid red")
  .append("svg")
  .attr("style", "border: 2px solid green")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Define xScale (xAxis scale)
/* const xScale = d3
  .scaleLinear()
  .domain([0, d3.max(parsedData, (d) => d.timeInSeconds)])
  .range([0, width]); */

// Define the parseTime function for "mm:ss" format
const parseTime = d3.timeParse("%M:%S");

// Convert time strings to Date objects
data.forEach((d) => {
  d.date = parseTime(d.time);
  console.log(d.date);
});
// Define the xScale using d3.scaleTime()
const xScale = d3
  .scaleTime()
  .domain(d3.extent(data, (d) => d.date)) // Set domain based on the parsed dates
  .range([0, width]); // Define the range

// Define yScale (yAxis scale)
const yScale = d3
  .scaleLinear()
  .domain([d3.min(data, (d) => d.value), d3.max(data, (d) => d.value)])
  .range([height, 0]); // Define the range

// Set up the x-axis with custom tick format
const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%M:%S"));

// Define y-axis
const yAxis = d3.axisLeft(yScale);

// Append the x-axis to the SVG
svg
  .append("g")
  .attr("transform", `translate(0,${height})`)
  .call(xAxis)
  .append("text")
  .attr("fill", "red")
  .attr("x", width / 2)
  .attr("y", 40)
  .attr("text-anchor", "middle")
  .text("Time (mm:ss)")
  .attr("font-size", "1rem");

// Append y-axis to the SVG
svg
  .append("g")
  .call(yAxis)
  .append("text")
  .attr("fill", "green")
  .attr("y", -30)
  .attr("x", -height / 2)
  .attr("transform", "rotate(-90)")
  .attr("text-anchor", "middle")
  .text("Value")
  .attr("font-size", "1rem");

// Plotting the data (for example, as circles)
svg
  .selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", (d) => xScale(d.date))
  .attr("cy", (d) => yScale(d.value)) // Adjusting value scaling for example purposes
  .attr("r", 5)
  .attr("fill", "steelblue");
