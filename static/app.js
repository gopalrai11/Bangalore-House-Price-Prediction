const BASE_URL = "http://127.0.0.1:5000/api";

function getBathValue() {
    const uiBathrooms = document.getElementsByName("uiBathrooms");
    for (let i = 0; i < uiBathrooms.length; i++) {
        if (uiBathrooms[i].checked) {
            return i + 1;  // Return the selected bathroom value
        }
    }
    return -1; // Invalid value if no option is selected
}

function getBHKValue() {
    const uiBHK = document.getElementsByName("uiBHK");
    for (let i = 0; i < uiBHK.length; i++) {
        if (uiBHK[i].checked) {
            return i + 1;  // Return the selected BHK value
        }
    }
    return -1; // Invalid value if no option is selected
}
async function getLocationNames() {
  const url = "http://127.0.0.1:5000/get_location_names"; // API endpoint

  try {
      const response = await fetch(url, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          }
      });

      if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
      }

      const data = await response.json(); // Parse JSON response
      const locations = data.locations; // Get the locations array

      // Populate the dropdown with the fetched locations
      const uiLocations = document.getElementById("uiLocations");
      uiLocations.innerHTML = ''; // Clear existing options

      // Add a default option
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Choose a Location';
      defaultOption.disabled = true;
      defaultOption.selected = true;
      uiLocations.appendChild(defaultOption);

      // Add options for each location
      locations.forEach(location => {
          const option = document.createElement('option');
          option.value = location; // Set the value
          option.textContent = location; // Set the display text
          uiLocations.appendChild(option); // Add the option to the dropdown
      });
  } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
  }
}
function onClickedEstimatePrice() {
  console.log("Estimate price button clicked");

  const sqft = document.getElementById("uiSqft").value;
  const bhk = getBHKValue();
  const bathrooms = getBathValue();
  const location = document.getElementById("uiLocations").value;
  const estPrice = document.getElementById("uiEstimatedPrice");

  if (!sqft || bhk < 1 || bathrooms < 1 || !location) {
      alert("Please fill in all fields correctly.");
      return;
  }

  const url = "http://127.0.0.1:5000/predict_home_price"; // Updated endpoint

  // Send a POST request with JSON data
  fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          total_sqft: parseFloat(sqft),
          bhk: bhk,
          bath: bathrooms,
          location: location
      })
  })
  .then(response => response.json())
  .then(data => {
    estPrice.innerHTML = `<h2>Price of the property would be around ₹${data.message}</h2>`;
    // Display the custom message
  })
  .catch(error => {
      console.error('Error estimating price:', error);
      estPrice.innerHTML = "<h2>Could not estimate price. Please try again.</h2>";
  });
}

// Call the function to populate the locations dropdown on page load
window.onload = function() {
  getLocationNames();
};
