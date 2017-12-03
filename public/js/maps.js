function initMap() {
        var markers = [
          {
            name: "Playas de Tijuana",
            pos: {lat: 32.517202, lng: -117.119909},
            icon: "img/orange-pin.svg",
            cfuLabel: "Somewhat Polluted",
            cfuVal: "750 cfu/ml",
            date: "12/2/17",
          },
          {
            name: "Rosarito Beach",
            pos: {lat: 32.364263, lng:-117.063413},
            icon: "img/green-pin.svg",
            cfuLabel: "Clean",
            cfuVal: "223 cfu/ml",
            date: "12/2/17",
          },
          {
            name: "San Antonio del Mar",
            pos: {lat: 32.433887, lng:-117.099547},
            icon: "img/yellow-pin.svg",
            cfuLabel: "Fair",
            cfuVal: "552 cfu/ml",
            date: "12/2/17",
          },
        ];
        
        var mapOptions = {
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true
        };
        var tijuana = {lat: 32.441964, lng: -117.089977};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 11,
          center: tijuana, 
          mapTypeControl: false,
          scrollwheel: false,
          fullscreenControl: false
        });
        for (var marker in markers) {
          marker = markers[marker];
          console.log(marker.name);
          var html = '<div id="content">'+
              '<h1>' + marker.name + '</h1>'+
              '<div id="bodyContent">'+
              '<h3>' + marker.cfuLabel + '</h3>' +
              '<p>' + marker.cfuVal + '</p>' +
              '<p class="date">' + 'Last updated: ' + marker.date + '</p>' +
              '</div>'+
              '</div>';
          var infoWindow = new google.maps.InfoWindow();
          
          var _marker = new google.maps.Marker({
            position: marker.pos,
            map: map,
            title: marker.name,
            html: html,
            icon: marker.icon,
          });
          _marker.addListener('click', function() {
            infoWindow.setContent(this.html);
            infoWindow.open(map, this);
          });
          _marker.addListener('mouseover', function() {
            infoWindow.setContent(this.html);
            infoWindow.open(map, this);

          });
          _marker.addListener('mouseout', function() {
            infoWindow.close();
          });
        };
        var currCenter = map.getCenter();
        google.maps.event.addDomListener(window, 'resize', function() {
          map.setCenter(currCenter);
        });
      }