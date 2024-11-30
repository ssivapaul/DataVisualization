const countyURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
const educationURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
let countyData;
let educationData;
const svg = d3.select("#svg");
const tooltip = d3.select("body").append("div").attr("id", "tooltip");
const drawMap = () => {
  svg
    .selectAll("path")
    .data(countyData)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("class", "county")
    .attr("fill", (d) => {
      let id = d["id"];
      let county = educationData.find((e) => e.fips === id);
      let percent = county["bachelorsOrHigher"];
      return percent <= 10
        ? "rgba(0, 0, 255, 0.1)"
        : percent <= 15
        ? "rgba(0, 0, 255, 0.2)"
        : percent <= 20
        ? "rgba(0, 0, 255, 0.3)"
        : percent <= 25
        ? "rgba(0, 0, 255, 0.4)"
        : percent <= 30
        ? "rgba(0, 0, 255, 0.5)"
        : percent <= 35
        ? "rgba(0, 0, 255, 0.6)"
        : percent <= 40
        ? "rgba(0, 0, 255, 0.7)"
        : percent <= 45
        ? "rgba(0, 0, 255, 0.8)"
        : percent <= 50
        ? "rgba(0, 0, 255, 0.9)"
        : "rgba(0, 0, 255)";
    })
    .attr("data-fips", (d) => d.id)
    .attr(
      "data-education",
      (d) => educationData.find((e) => e.fips === d["id"])["bachelorsOrHigher"]
    )
    .on("mouseover", showTooltip)
    .on("mouseout", hideTooltip);

  const legendData = [
    { description: "0 --> 10%", color: "rgba(0, 0, 255, 0.1)" },
    { description: "10% --> 15%", color: "rgba(0, 0, 255, 0.2)" },
    { description: "15% --> 20%", color: "rgba(0, 0, 255, 0.3)" },
    { description: "20% --> 25%", color: "rgba(0, 0, 255, 0.4)" },
    { description: "25% --> 30%", color: "rgba(0, 0, 255, 0.5)" },
    { description: "30% --> 35%", color: "rgba(0, 0, 255, 0.6)" },
    { description: "35% --> 40%", color: "rgba(0, 0, 255, 0.7)" },
    { description: "40% --> 45%", color: "rgba(0, 0, 255, 0.8)" },
    { description: "45% --> 50%", color: "rgba(0, 0, 255, 0.9)" },
    { description: "50% --> 100%", color: "rgba(0, 0, 255, 1)" },
  ];

  const legend = svg
    .append("g")
    .attr("class", "legend")
    .attr("id", "legend")
    .attr("transform", `translate(950, 300)`);
  legend
    .selectAll("rect")
    .data(legendData)
    .enter()
    .append("rect")
    .attr("stroke-width", 1)
    .attr("stroke", "black")
    .attr("x", 0)
    .attr("y", (d, i) => i * 25)
    .attr("width", 15)
    .attr("height", 25)
    .attr("fill", (d) => d.color)
    .on("mouseover", showRelaventDetail)
    .on("mouseout", rerenderdMap);

  legend
    .selectAll("text")
    .data(legendData)
    .enter()
    .append("text")
    .attr("x", 25)
    .attr("y", (d, i) => i * 25 + 12)
    .text((d) => d.description)
    .style("font-size", "12px")
    .attr("alignment-baseline", "middle"); // Legend data

  function showTooltip(event, d) {
    tooltip
      .style("opacity", 1)
      .style("position", "absolute")
      .style("left", event.pageX + 20 + "px")
      .style("top", event.pageY - 10 + "px")
      .html(
        ` Fips_id: ${d.id}  
             <br/> Area: ${
               educationData.find((e) => e.fips === d["id"])["area_name"]
             } <br/> State: ${
          educationData.find((e) => e.fips === d["id"])["state"]
        } <br/> Bachelor or higher: ${
          educationData.find((e) => e.fips === d["id"])["bachelorsOrHigher"]
        } %`
      )
      .attr(
        "data-education",
        educationData.find((e) => e.fips === d["id"])["bachelorsOrHigher"]
      );
  }

  function hideTooltip() {
    tooltip.style("opacity", 0);
  }

  function showRelaventDetail(event, d) {}

  function rerenderdMap(event, d) {}
};

d3.json(countyURL).then((data) => {
  countyData = topojson.feature(data, data.objects.counties).features;
  d3.json(educationURL).then((data) => {
    educationData = data;
    drawMap();
  });
});
