// Sample data with dates and values
const data = [
  { date: new Date("2024-01-01T00:00:00"), value: 100 },
  { date: new Date("2024-02-01T00:00:00"), value: 200 },
  { date: new Date("2024-03-01T00:00:00"), value: 300 },
];

// Set dimensions and margins
const margin = { top: 20, right: 30, bottom: 30, left: 40 };
const width = 800 - margin.left - margin.right; //
const height = 400 - margin.top - margin.bottom; //

// Create SVG
const svg = d3
  .select("svg")
  .attr("width", width + margin.left + margin.right) //
  .attr("height", height + margin.top + margin.bottom) //
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`)
  .attr("border", "10px solid red")
  .attr("margin-left", "20");

// Define the x scale (date scale)
const x = d3
  .scaleTime()
  .domain(d3.extent(data, (d) => d.date)) // Use extent to get min and max date
  .range([0, width]);

// Define the y scale (linear scale for values)
const y = d3
  .scaleLinear()
  .domain([0, d3.max(data, (d) => d.value)]) // Adjust as needed
  .range([height, 0]);

// Add x-axis
svg
  .append("g")
  .attr("transform", `translate(0,${height})`) // Position at the bottom
  .call(d3.axisBottom(x));

// Add y-axis
svg.append("g").call(d3.axisLeft(y));
