d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
).then((data) => {
  //const data1 = JSON.parse(data);

  // Function to display JSON data in the HTML
  function displayData(data) {
    const cyclistData = document.getElementById("cyclist-data");

    // Clear any existing content
    cyclistData.innerHTML = "";

    // Loop through each item and create HTML for each person
    data.forEach((data) => {
      // Create a container div for each person
      const cyclistDiv = document.createElement("div");
      cyclistDiv.className = "cyclist";

      // Add Time
      const time = document.createElement("h4");
      time.textContent = `Time: ${data["Time"]}`;
      cyclistDiv.appendChild(time);

      // Add year
      const year = document.createElement("p");
      year.textContent = `Year: ${data["Year"]}`;
      cyclistDiv.appendChild(year);

      // Append each personDiv to the main personList container
      cyclistData.appendChild(cyclistDiv);
    });
  }
  // Display the JSON data
  displayData(data);
});
