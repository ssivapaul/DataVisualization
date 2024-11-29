const data = [5, 10, 15, 20];

// Process the dataset to create a new array with modified values
const processedData = [];
data.forEach((d, i) => {
  processedData.push(d * 2); // Double each value
});
console.log(processedData); // [10, 20, 30, 40]

// Use processedData in a D3 selection
const list = d3.select("body").append("ul");

list
  .selectAll("li")
  .data(processedData)
  .enter()
  .append("li")
  .text((d) => `Value: ${d}`);
