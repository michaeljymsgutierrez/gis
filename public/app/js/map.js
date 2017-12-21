function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 13.9419, lng: 121.1644},
      zoom: 11
    });
    var card = document.getElementById('pac-card');
    var input = document.getElementById('pac-input');
    var countries = document.getElementById('country-selector');

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

    var autocomplete = new google.maps.places.Autocomplete(input);

    // Set initial restrict to the greater list of countries.
    autocomplete.setComponentRestrictions(
        {'country': ['ph']});

    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById('infowindow-content');
    infowindow.setContent(infowindowContent);
    
    var image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGkSURBVDhPldRJKEVhGMbxY47EwlQUkSlFWbASCkVKWdhYiY1kTDayskBRspIobCTKQspUNqwslMSCZMpUCiVDxv9zukfn4rr3PvXr3O+M73e+91zDi/igAbt4wQn6EAyvMgDdYBbrmMY91uAPj5KHDwwjGiGIRC3eUAO3CcQ2NpGtHbakYAuq7t/ovYxAT22CH+xJhm40Y45cJAsreEc/0vAzubhBjzmyRRWUYhl6J1fQysQjCHGwonPb8Iki7bBSgh3owBFGkQ9fKFN4Rbo5MoxUzOMS31NuhyrYd/zWSXqiPc3YQIQ5MowqqB06zRHR0qqKSWjOnjRYIlTNNUK1Q1nAMXKgEruwhEZYCXBsFU21A1qEOu2wcopxqMnUYKrOUgY98REJULXl0HtZhNP0nzAEtXkv7DdqgZIBXVSIA5whFk7ZwxxioAvuoJtcwFpuVaslXoWOZ+JXuqGDFQhDFHRROBR9ItU4h84rwJ/RxSpXHdqKJCjaFmMCt1BrWD3kMlpOfZTqpUPo29H/zgOeMQirQrfRslZiDGoJrWQ9NFU3MYwvoLZeYPTQcOUAAAAASUVORK5CYII=';
    var marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29),
      icon: image
    });

    autocomplete.addListener('place_changed', function() {
      infowindow.close();
      marker.setVisible(false);
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(13);  // Why 17? Because it looks good.
      }
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }
      infowindowContent.children['place-name'].textContent = place.name;
      infowindowContent.children['place-address'].textContent = address;
      infowindow.open(map, marker);
    });

    // Sets a listener on a given radio button. The radio buttons specify
    // the countries used to restrict the autocomplete search.
    function setupClickListener(id, countries) {
      var radioButton = document.getElementById(id);
      radioButton.addEventListener('click', function() {
        autocomplete.setComponentRestrictions({'country': countries});
      });
    }

    setupClickListener('changecountry-ph', 'ph');
    setupClickListener(
        'changecountry-ph-and-uot', ['ph']);
  }