d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
).then((data) => {
  const dataset = data.data;

  // Dimensions for the chart
  const margin = { top: 50, right: 70, bottom: 50, left: 70 };
  const width = 1700 - margin.left - margin.right;
  const height = 850 - margin.top - margin.bottom;

  // Create the SVG canvas
  const svg = d3
    .select("#chart")
    .attr("style", "border: 5px solid red")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // create tool tip
  const tooltip = d3.select("body").append("div").attr("id", "tooltip");

  // Define Scales for x and y axes
  const xScale = d3
    .scaleTime()
    .domain([
      new Date(d3.min(dataset, (d) => d[0])),
      new Date(d3.max(dataset, (d) => d[0])),
    ])
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([height, 0]);

  // Add x-axis
  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("class", "tick")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

  // Add y-axis
  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("class", "tick")
    .call(d3.axisLeft(yScale));

  // Add bars
  svg
    .selectAll(".bar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .attr("x", (d) => xScale(new Date(d[0])))
    .attr("y", (d) => yScale(d[1]))
    .attr("width", width / dataset.length)
    .attr("height", (d) => height - yScale(d[1]))
    .on("mouseover", showTooltip)
    .on("mouseout", hideTooltip);

  function showTooltip(event, d) {
    tooltip
      .style("display", "block")
      .style("left", event.pageX + 20 + "px")
      .style("top", event.pageY + 0 + "px")
      .html(`${d[0]}<br>${d[1]} Bn US$`)
      .attr("data-date", d[0]);
  }

  function hideTooltip() {
    tooltip.style("display", "none");
  }
});
