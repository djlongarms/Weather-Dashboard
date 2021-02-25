let cities = localStorage.getItem('cities') || []

// Boolean to keep track of whether or not the new search is already present in the list
let inList = false;

// An index to keep track of where in the list an already searched city is
let index = 0;

// Listens for click of the search button
$("#searchBtn").click(event => {
  // Prevents default
  event.preventDefault()

  // Checks to make sure the input is not blank
  if ($("#searchText").val() !== '') {
    $.ajax(`https://api.openweathermap.org/data/2.5/weather?units=imperial&q=${$("#searchText").val()}&appid=bd00823fc2267c54f521015bf4b94e3d`)
      .then(res => {
        // Resets "inList" to false and index to 0
        inList = false;
        index = 0;

        // Checks cities array to see if the searched city is present
        for(let i = 0; i < cities.length; i++) {
          if(cities[i].html() === res.name) {
            inList = true
            index = i
          }
        }
        console.log(inList)
        console.log(index)

        // Removes the class "active" from the currently selected element
        cities.forEach(element => {
          element.removeClass("active")
        })

        // Checks if searched city was found earlier
        if (inList) {
          // Gives the newly re-searched list item the "active" class, then moves it to the top
          cities[index].addClass('active')
          let tempCity = cities.splice(index, 1)[0]
          cities.unshift(tempCity)
          $('#cities').prepend(tempCity, $('#cities').firstChild)
          $('#cities').remove($('#cities').children()[index])
          console.log(cities)
        } else {
          // Creates new "li" element or th searched city, then adds proper classes
          let city = $('<li>')
          city.addClass("list-group-item")
          city.addClass("active")

          // Gives city the name of the searched city, then resets input box to ''
          city.html(res.name)

          // Adds the newly created city element to the list on the page and adds it to the array of cities
          $('#cities').prepend(city, $('#cities').firstChild)
          cities.unshift(city)

          displayWeather(res)
        }
      })
      .catch(err => {
        alert('Invalid City Name!')
        console.log(err)
      })

    // Clears search input
    $("#searchText").val('')
  }
})

function displayWeather(weatherData) {
  // Makes API call to get UVI information
  $.ajax(`https://api.openweathermap.org/data/2.5/onecall?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&units=imperial&appid=bd00823fc2267c54f521015bf4b94e3d`)
    .then(res1 => {
      // Sets the currentWeather row to have the weather for the newly searched city
      $('#currentWeather').html(`
      <div class="card">
        <div class="card-body">
          <h1>${weatherData.name} (${moment().format('M/D/YYYY')})<img class="currentIcon" src="http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png"></h1>
          <p>Temperature: ${weatherData.main.temp}</p>
          <p>Humidity: ${weatherData.main.humidity}%</p>
          <p>Wind Speed: ${weatherData.wind.speed}mph</p>
          <p>UV Index: <span id="uvIndex">${res1.current.uvi}</span></p>
        </div>
      </div>
      `)

      // Checks the UVI and sets the background color using the proper class
      if (parseInt($('#uvIndex').text()) <= 2) {
        $('#uvIndex').addClass("favorable")
      } else if (parseInt($('#uvIndex').text()) <= 6) {
        $('#uvIndex').addClass("moderate")
      } else {
        $('#uvIndex').addClass("severe")
      }

      // Clears futureWeather of any previous HTML
      $('#futureWeather').html('')

      // Creates cards for each of the next five days and appends them to futureWeather
      for (let i = 0; i < 5; i++) {
        let forecast = $('<div>')
        forecast.addClass('card col-sm-2 forecast')
        forecast.html(`
        <div class="card-body">
          <h6>${moment().add(i + 1, 'days').format('M/D/YYYY')}<img class="futureIcon" src="http://openweathermap.org/img/wn/${res1.daily[i + 1].weather[0].icon}@2x.png"></h6>
          <p class="futureStats">Temperature: ${res1.daily[i + 1].temp.day}</p>
          <p class="futureStats">Humidity: ${res1.daily[i + 1].humidity}%</p>
        </div>
        `)
        $('#futureWeather').append(forecast)
      }
    })
    .catch(err => console.log(err))
}

// Listens for clicks on previously searched city names
$(document).click(event => {
  // Checks to make sure the clicked item is in the list
  if($(event.target).hasClass('list-group-item')) {
    // Removes the "active" class from all list items
    cities.forEach(element => {
      element.removeClass('active')
    })

    // Adds "active" class to the clicked item
    $(event.target).addClass('active')

    // Makes API call to update screen
    $.ajax(`https://api.openweathermap.org/data/2.5/weather?units=imperial&q=${$(event.target).text()}&appid=bd00823fc2267c54f521015bf4b94e3d`)
      .then(res2 => {
        displayWeather(res2)
      })
      .catch(err => console.log(err))
  }
})