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

  $.ajax(`https://api.openweathermap.org/data/2.5/weather?units=imperial&q=${$("#searchText").val()}&appid=bd00823fc2267c54f521015bf4b94e3d`)
    .then(res => {
      displayWeather(res)
    })
    .catch(err => console.log(err))

  // Clears search input
  $("#searchText").val('')
})

function displayWeather(weatherData) {
  // Makes API call to get UVI information
  $.ajax(`https://api.openweathermap.org/data/2.5/onecall?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=bd00823fc2267c54f521015bf4b94e3d`)
    .then(res => {
      // Sets the currentWeather div to have the weather for the newly searched city
      $('#currentWeather').html(`
      <h1>${weatherData.name} (${moment().format('M/D/YYYY')})<img class="icon" src="http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png"></h1>
      <p>Temperature: ${weatherData.main.temp}</p>
      <p>Humidity: ${weatherData.main.humidity}%</p>
      <p>Wind Speed: ${weatherData.wind.speed}mph</p>
      <p>UV Index: <span id="uvIndex">${res.current.uvi}</span></p>
      `)

      if(parseInt($('#uvIndex')) <= 2) {
        $('#uvIndex').addClass("favorable")
      } else if (parseInt($('#uvIndex')) <= 6) {
        $('#uvIndex').addClass("moderate")
      } else {
        $('#uvIndex').addClass("severe")
      }
    })
    .catch(err => console.log(err))
}