const countyURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
const educationURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
let countyData;
let educationData;
const svg = d3.select("#svg");

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
    });
};

d3.json(countyURL).then((data) => {
  countyData = topojson.feature(data, data.objects.counties).features;
  d3.json(educationURL).then((data) => {
    educationData = data;
    drawMap();
  });
});
