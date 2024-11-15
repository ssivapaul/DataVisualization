// Sample data with times in seconds
d3.json("cyclist-data.json").then((data) => {
  const svgWidth = 600;
  const svgHeight = 600;
  const padding = 50;

  // X Scale for year
  const xScale = d3
    .scaleLinear()
    .domain(
      d3.min(data, (d) => d.Year),
      d3.max(data, (d) => d.Year)
    )
    .range([padding, svgWidth - padding]);

  // Y Scale for time
  const yScale = d3
    .scaleTime()
    .domain([0, d3.max(data, (d) => d.Time)])
    .range([svgHeight - padding, padding]);

  // Select SVG
  const svg = d3.select("svg").attr("style", "border: 2px solid red");

  // X-axis with %M:%S format
  const xAxis = d3.axisBottom(xScale);

  // Append X-axis to SVG
  svg
    .append("g")
    .attr("transform", `translate(0, ${svgHeight - padding})`)
    .call(xAxis);

  // Y-axis
  const yAxis = d3.axisLeft(yScale);
  svg.append("g").attr("transform", `translate(${padding}, 0)`).call(yAxis);

  // Draw circles for data points
  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.Year))
    .attr("cy", (d) => yScale(d.Time))
    .attr("r", 5)
    .attr("fill", "blue");
});
