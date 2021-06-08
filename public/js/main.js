const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");
const apiKey = "4c28eeb1e61a6408b353b442f271e61c";

form.addEventListener("submit", e => {
  e.preventDefault();
  let inputVal = input.value;

  //check if there's already a city
  const listItems = list.querySelectorAll(".ajax-section .city");
  const listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter(el => {
      let content = "";
      //athens,gr
      if (inputVal.includes(",")) {
        //athens,grrrrrr->invalid country code, so we keep only the first part of inputVal
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];
          content = el
            .querySelector(".city-name span")
            .textContent.toLowerCase();
        } else {
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {
        //athens
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      }
      return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      msg.textContent = `You already know the weather for ${
        filteredArray[0].querySelector(".city-name span").textContent
      } ...otherwise be more specific by providing the country code as well 😉`;
      form.reset();
      input.focus();
      return;
    }
  }

  //ajax here
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric&`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const { main, name, sys, weather,wind,visibility,clouds} = data;
      

      const li = document.createElement("li");
      li.classList.add("city");

      const markup = `
        <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup id="degree"> &#8451;</sup></div>
        <figure>
          <i class="owf owf-${weather[0].id} owf-5x"></i>
          <figcaption>${weather[0].description}</figcaption>
        </figure>
        <br>
        <table style="width: 100%;">
            <tr>
              <td> <h6> Real Feel </h6><h4><i class="fas fa-thermometer-three-quarters"></i> ${Math.round(main.feels_like)}<sup id="degree"> &#8451;</sup></h4></td>
              <td><h6> Wind Speed </h6><h4> <i class="fas fa-wind"></i> ${(Math.round((wind.speed)*3.6))} km/h </h4></td>
            </tr>
            <tr>
               <td><h6> Humidity </h6><h4><i class="far fa-grin-beam-sweat"></i> ${main.humidity}% </h4> </td>
               <td> <h6> Pressure</h6> <h4><i class="fas fa-tachometer-alt"></i> ${main.pressure} hPa</h4></td>
            </tr>
            <tr>
               <td><h6> Visibility </h6> <h4> ${(visibility)/1000} km</h4>
               <td><h6> Cloudiness </h6> <h4> ${clouds.all}%</h4>
            </tr>
        </table>  
      `;
      li.innerHTML = markup;
      list.appendChild(li);
    })
    .catch(() => {
      msg.textContent = "Please search for a valid city 😩";
    });

  msg.textContent = "";
  form.reset();
  input.focus();
});