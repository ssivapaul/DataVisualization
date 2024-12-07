// Fetch data from a URL
const dataUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";
//" https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json"
//"https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"

//const dataUrl = "test1Data.json";
//fetch(dataUrl)
//.then((response) => response.json())
//.then((data) => {
d3.json(dataUrl).then((data) => {
  const formatter = d3.format(",.0f");
  // Set up dimensions
  const width = 960;
  const height = 570;
  const tooltip = d3.select("#tooltip");
  // Create a color scale
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Create a hierarchical structure
  const root = d3
    .hierarchy(data, (d) => d.children)
    .sum((d) => d.value)
    .sort((d1, d2) => d2.height - d1.height || d2.value - d1.value);
  console.log(data);
  console.log(root);
  console.log(root.leaves());
  console.log(root.children); //
  // Create a treemap layout
  const treemapLayout = d3.treemap().size([width, height]).padding(1);
  treemapLayout(root);

  // Append an SVG element
  const svg = d3.select("svg").attr("width", width).attr("height", height);

  // Add nodes
  const nodes = d3
    .select("#tree-map")
    .selectAll("g")
    .data(root.leaves())
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(${d.x0}, ${d.y0})`);

  // Add rectangles
  nodes
    .append("rect")
    .attr("class", "tile")
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.value)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("Areas", (d) => (d.x1 - d.x0) * (d.y1 - d.y0))
    .attr("fill", (d) => color(d.data.category))
    .on("mouseover", showTooltip)
    .on("mouseout", hideTooltip);

  function showTooltip(event, d) {
    tooltip
      .style("opacity", 1)
      .style("position", "absolute")
      .style("left", event.pageX + 20 + "px")
      .style("top", event.pageY - 10 + "px")
      .html(
        ` Category: ${d.data.category} <br/>
          Movie name: ${d.data.name} <br/>
          Data value: ${formatter(d.data.value)} <br/> 
          Area: ${formatter((d.x1 - d.x0) * (d.y1 - d.y0))}`
      )
      .attr("data-value", d.data.value);
  }

  function hideTooltip() {
    tooltip.style("opacity", 0);
  }

  // Add labels
  /*nodes
    .append("text")
    .attr("x", (d) => (d.x1 - d.x0) / 2)
    .attr("y", (d) => (d.y1 - d.y0) / 2)
    .attr("x", "1em")
    .text((d) => `${d.data.name}`)
    .attr("font-size", ".5rem")
    .attr("class", "node");*/

  nodes
    .append("text")
    .attr("class", "tile-text")
    .selectAll("tspan")
    .data((d) => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter()
    .append("tspan")
    .attr("x", 10)
    .attr("y", (d, i) => 10 + i * 10)
    .attr("font-size", ".5rem")
    .text((d) => d);

  // Legend
  const legend = d3.select("#legend").attr("width", width);

  //Add rect
  legend
    .append("g")
    .selectAll("rect")
    .data(data.children)
    .enter()
    .append("rect")
    .attr("class", "legend-item")
    .attr("stroke-width", 1)
    .attr("stroke", "black")
    .attr("y", 30)
    .attr("x", (d, i) => i * 150 + 160)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", (d) => color(d.name));

  //Add text
  legend
    .append("g")
    .selectAll("text")
    .data(data.children)
    .enter()
    .append("text")
    .attr("y", 40)
    .attr("x", (d, i) => i * 150 + 190)
    .text((d) => d.name)
    .attr("font-size", "12px") // Set font size
    .attr("font-weight", "800")
    .attr("font-family", "Roboto, Arial, sans-serif") // Set font family
    .attr("alignment-baseline", "middle"); // Legend data
});
