// Fetch data from a URL
const dataUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"; // Replace with your URL
//const dataUrl = "test1Data.json";
fetch(dataUrl)
  .then((response) => response.json())
  .then((data) => {
    //data.forEach((d) => console.log(d));
    //console.log(data);
    // Set up dimensions
    const width = 1000;
    const height = 600;

    // Create a color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Create a hierarchical structure
    const root = d3
      .hierarchy(data, (d) => d.children)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);
    console.log(root.leaves()); //
    // Create a treemap layout
    const treemapLayout = d3.treemap().size([width, height]).padding(2);
    treemapLayout(root);

    // Append an SVG element
    const svg = d3
      .select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Add nodes
    const nodes = svg
      .selectAll("g")
      .data(root.leaves())
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

    // Add rectangles
    nodes
      .append("rect")
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("fill", (d) => {
        console.log(d.value);
        return color(d);
      });
    //.attr("stroke", "white");

    // Add labels
    nodes
      .append("text")
      .attr("x", (d) => (d.x1 - d.x0) / 2)
      .attr("y", (d) => (d.y1 - d.y0) / 2)
      .attr("dy", ".1em")
      .attr("x", "2em")
      .text((d) => `${d.data.name}`)
      .attr("font-size", ".5rem")
      .attr("class", "node");
  })
  .catch((error) => console.error("Error loading data:", error));
