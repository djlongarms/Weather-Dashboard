let cities = []

// Listens for click of the search button
$("#searchBtn").click(event => {
  // Prevents default
  event.preventDefault()

  // Removes the class "active" from the currently selected element
  cities.forEach(element => {
    element.removeClass("active")
  })

  // Creates new "li" element or th searched city, then adds proper classes
  let city = $('<li>')
  city.addClass("list-group-item")
  city.addClass("active")

  // Gives city the name of the searched city, then resets input box to ''
  city.html($("#searchText").val())

  // Adds the newly created city element to the list on the page and adds it to the array of cities
  $('#cities').prepend(city, $('#cities').firstChild)
  cities.push(city)

  // Sets up request for weather data from OpenWeatherMap
  const settings = {
    "async": true,
    "crossDomain": true,
    //"url": `https://community-open-weather-map.p.rapidapi.com/forecast?q=${$("#searchText").val()}`,
    "url": `https://community-open-weather-map.p.rapidapi.com/weather?q=${$("#searchText").val()}`,
    "method": "GET",
    "headers": {
      "x-rapidapi-key": "61a01e5c3amsh6da52702734f46ep192513jsncae7f7ec5553",
      "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com"
    }
  };

  // Executes request for data
  $.ajax(settings)
    .done(res => {
      // Runs function to display weather data on page
      displayWeather(res)
    })
    .catch(err => console.log(err))

  // Clears search input
  $("#searchText").val('')
})

function displayWeather(weatherData) {

  $('#currentWeather').html(`
    <h1>${weatherData.name} (${moment().format('M/D/YYYY')})<img class="icon" src="http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png"></h1>
    `)
  console.log(weatherData)
}