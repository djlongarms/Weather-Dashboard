// API Key: bd00823fc2267c54f521015bf4b94e3d

// Listens for click of the search button
$("#searchBtn").click(event => {
  // Prevents default
  event.preventDefault()

  // Creates new "li" element or th searched city, then adds proper class
  let city = $('<li>')
  city.addClass("list-group-item")

  // Gives city the name of the searched city, then resets input box to ''
  city.html($("#searchText").val())
  $("#searchText").val('')

  // Adds the newly created city element to the list on the page
  $('#cities').append(city)
})