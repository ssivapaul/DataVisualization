d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
).then((data) => {
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

  // Convert time strings to Date objects
  // Define the parseTime function for "mm:ss" format
  const parseTime = d3.timeParse("%M:%S");
  data.forEach((d) => {
    d.date = parseTime(d.Time);
    console.log(d.date);
    console.log(d.Time);
  });

  // Define the xScale using d3.scaleTime()
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.date)) // Set domain based on the parsed dates
    .range([0, width]); // Define the range

  // Define yScale (yAxis scale)
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.Year)])
    .range([height, 0]);

  // Set up the x-axis with custom tick format
  const xAxis = d3.axisBottom(xScale);

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
    .text("Year")
    .attr("font-size", "1rem");

  // Plotting the data (for example, as circles)
  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.date))
    .attr("cy", (d) => height - d.Year) // Adjusting value scaling for example purposes
    .attr("r", 5)
    .attr("fill", "steelblue");
});
