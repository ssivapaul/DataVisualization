d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
).then((data) => {
  // Set dimensions and margins
  const width = 600;
  const height = 500;
  const margin = { top: 70, right: 500, bottom: 70, left: 100 };
  // create tool tip
  const tooltip = d3.select("body").append("div").attr("id", "tooltip");
  // Create an SVG element
  const svg = d3
    .select("body")
    .append("svg")
    .attr("style", "border: 2px solid green")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Convert time strings to Date objects
  const parseTime = d3.timeParse("%M:%S"); // Define parseTime fn for "mm:ss" format
  data.forEach((d) => {
    d.date = parseTime(d.Time);
    d.Year = parseInt(d.Year);
  });

  // Define the xScale using d3.scaleTime()
  const yScale = d3
    .scaleTime()
    .domain([d3.min(data, (d) => d.date), d3.max(data, (d) => d.date)])
    //.domain(d3.extent(data, (d) => d.date)) // Set domain based on the parsed dates
    .range([height, 0]); // Define the range

  // Define yScale (yAxis scale)
  const xScale = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => d.Year) - 1, d3.max(data, (d) => d.Year) + 1])
    .range([0, width]);

  // Set up the x-axis with custom tick format
  const xAxis = d3.axisBottom(xScale).tickFormat((d) => d);
  // Define y-axis
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));
  // Append the x-axis to the SVG
  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis)
    .append("text")
    .attr("fill", "blue")
    .attr("x", width / 2)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .text("Year")
    .attr("font-size", "1rem");

  // Append y-axis to the SVG
  svg
    .append("g")
    .attr("id", "y-axis")
    .call(yAxis)
    .append("text")
    .attr("fill", "blue")
    .attr("y", -50)
    .attr("x", -height / 2)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text("Time (mm:ss)")
    .attr("font-size", "1rem");

  const timeFormat = d3.timeFormat("%Mm:%Ss");

  // Plotting the data (for example, as circles)
  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => xScale(d.Year))
    .attr("cy", (d) => yScale(d.date))
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => d.date)
    .attr("r", 5)
    .attr("fill", (d) => (d.Doping ? "red" : "green"))
    .on("mouseover", showTooltip)
    .on("mouseout", hideTooltip);

  function showTooltip(event, d) {
    tooltip
      .style("opacity", 1)
      .style("position", "absolute")
      .style("left", event.pageX + 20 + "px")
      .style("top", event.pageY - 10 + "px")
      .html(
        ` Name: ${d.Name} <br/> 
            Nationality: ${d.Nationality} <br/>
            Year: ${d.Year}, 
            Time: ${timeFormat(d.date)} <br/> <br/>
            Doping alegations: 
            <span style="color: ${d.Doping ? "red" : "green"}"><b>${
          d.Doping ? d.Doping : "None"
        }</b></span>`
      )
      .attr("data-year", d.Year);
  }

  function hideTooltip() {
    tooltip.style("opacity", 0);
  }

  // Legend data
  const legendData = [
    { description: "No doping allegations", color: "green" },
    { description: "Riders with doping allegations", color: "red" },
  ];

  // Legend
  const legend = svg
    .append("g")
    .attr("class", "legend")
    .attr("id", "legend")
    .attr("transform", `translate(${width + 50}, ${margin.top + 50})`);

  legend
    .selectAll("rect")
    .data(legendData)
    .enter()
    .append("rect")
    .attr("stroke-width", 1)
    .attr("stroke", "black")
    .attr("x", 0)
    .attr("y", (d, i) => i * 40)
    .attr("width", 25)
    .attr("height", 25)
    .attr("fill", (d) => d.color);

  legend
    .selectAll("text")
    .data(legendData)
    .enter()
    .append("text")
    .attr("x", 40)
    .attr("y", (d, i) => i * 40 + 12)
    .text((d) => d.description)
    .style("font-size", "20px")
    .attr("alignment-baseline", "middle"); // Legend data
});
