d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
).then((data) => {
  const dataset = data["monthlyVariance"];
  const width = 1700;
  const height = 600;
  const margin = { top: 70, right: 300, bottom: 70, left: 100 };

  const len = dataset.length - 1;

  const tooltip = d3.select("body").append("div").attr("id", "tooltip");

  const svg = d3
    .select("body")
    .attr("style", "border: 5px solid blue; border-radius: 50px;")
    .append("svg")
    .attr("style", "border: 2px solid green; margin-bottom: 150px")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Time scale for months and years
  const startDate = d3.min(dataset, (d) => new Date(d["year"], d["month"] - 1));
  const endDate = d3.max(dataset, (d) => new Date(d["year"], d["month"] - 1));

  // Axis scale for years
  const yearScale = d3
    .scaleTime()
    .domain([startDate, endDate])
    .range([0, width]);

  // Axis scale for months
  const monthScale = d3
    .scaleTime()
    .domain([new Date(0, 0, 0), new Date(0, 12, 0)])
    .range([0, height]);

  // Construct Axis for years
  const yearsAxis = d3
    .axisBottom(yearScale)
    .ticks(d3.timeYear.every(10)) // 10 ticks
    .tickFormat(d3.timeFormat("%Y")); // Year format (2020, 2021, etc.)

  // Construct Axis for months
  const monthsAxis = d3
    .axisLeft(monthScale)
    .ticks(d3.timeMonth.every(1)) // 12 ticks
    .tickFormat(d3.timeFormat("%B")); // Month format (January, February, etc.)

  // Draw year axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(yearsAxis)
    .attr("id", "x-axis")
    .attr("font-size", "1rem")
    .append("text")
    .attr("font-size", "1.9rem")
    .attr("fill", "blue")
    .attr("x", width / 2)
    .attr("y", 55)
    .attr("text-anchor", "middle")
    .text("Year");

  // Draw month axis
  svg
    .append("g")
    .call(monthsAxis)
    .attr("id", "y-axis")
    .attr("font-size", "1rem");

  svg
    .append("g")
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("height", height / 12)
    .attr("y", (d) => monthScale(new Date(0, d["month"] - 1)).toFixed(3))
    .attr(
      "width",
      (width / (dataset[len]["year"] - dataset[0]["year"])).toFixed(3)
    )
    .attr("x", (d) => yearScale(new Date(d["year"], 0)).toFixed(3))
    .attr("data-year", (d) => d.year)
    .attr("data-month", (d) => d.month - 1)
    .attr("data-temp", (d) => (8.66 + d.variance).toFixed(2))
    .attr("fill", (dataset) => {
      variance = dataset["variance"];
      return variance <= -2.66 // <= 6 deg. C --> Pink
        ? "pink"
        : variance <= -1.66 // 6 < temp <= 7 deg. C --> Blue
        ? "blue"
        : variance <= -0.66 // 7 < temp <= 8 deg. C --> lightblue
        ? "lightblue"
        : variance <= 0.34 // 8 < temp <= 9 deg. C --> Green
        ? "green"
        : variance <= 1.34 // 9 < temp <= 10 deg. C --> Grey
        ? "grey"
        : "red"; // 10 deg.C < temp --> Red
    });

  // Tooltip on hover
  svg.selectAll("rect").on("mouseover", function (event, d) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    d3.select(this)
      .attr("stroke", "black") // Add border color
      .attr("stroke-width", 2); // Set border thickness

    tooltip
      .style("display", "block")
      .style("left", event.pageX - 10 + "px")
      .style("top", event.pageY - 10 + "px")
      .html(
        `Year: ${d.year} <br> Month: ${monthNames[d.month]}<br> Temperature: ${(
          8.66 + d.variance
        ).toFixed(2)} deg.C`
      )
      .attr("data-year", d.year);
  });

  svg.selectAll("rect").on("mouseout", function (event, d) {
    tooltip.style("display", "none");
    d3.select(this).attr("stroke", "none"); // Remove border
  });

  // Legend data
  const legendData = [
    { text: "temp < 6 deg.C", color: "pink" },
    { text: "temp = 6 to 7 deg.C ", color: "blue" },
    { text: "temp = 7 to 8 deg.C ", color: "lightblue" },
    { text: "temp = 8 to 9 deg.C ", color: "green" },
    { text: "temp = 9 to 10 deg.C", color: "grey" },
    { text: "temp > 10 deg.C", color: "red" },
  ];

  // Legend
  const legend = svg
    .append("g")
    .attr("class", "legend")
    .attr("id", "legend")
    .attr("transform", `translate(${width + 50}, 0)`);

  legend
    .selectAll("rect")
    .data(legendData)
    .enter()
    .append("rect")
    .attr("stroke-width", 1)
    .attr("stroke", "black")
    .attr("x", 0)
    .attr("y", (d, i) => i * 50)
    .attr("width", 20)
    .attr("height", 50)
    .attr("fill", (d) => d.color);

  legend
    .selectAll("text")
    .data(legendData)
    .enter()
    .append("text")
    .attr("x", 40)
    .attr("y", (d, i) => i * 50 + 25)
    .text((d) => d.text)
    .attr("font-size", "20px") // Set font size
    .attr("font-family", "Roboto, Arial, sans-serif") // Set font family
    //.attr("font-weight", "bold") // Set boldness
    .attr("alignment-baseline", "middle"); // Legend data
});
