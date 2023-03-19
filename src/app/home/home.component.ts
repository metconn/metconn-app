import { Component, OnInit } from "@angular/core";
import * as geolocation from "@nativescript/geolocation";
import { GoogleMap, MapReadyEvent } from "@nativescript/google-maps";
/* import { CoreTypes } from '@nativescript/core' */
import { Accuracy } from "tns-core-modules/ui/enums";
/* import { Mapbox, MapboxViewApi } from 'nativescript-mapbox';  */
/* import { registerElement } from 'nativescript-angular/element-registry'; */
/* import { registerElement } from '@nativescript/angular'; */
/* CoreTypes.Accuracy */ // used to describe at what accuracy the location should be get

/* registerElement("Mapbox", () => require("nativescript-mapbox").MapboxView);
 */

import { registerElement } from "@nativescript/angular";
import {
  MapView,
  Marker,
  Position,
} from "nativescript-google-maps-sdk";
import { Directions } from "@nativescript/directions";
import { UpdatePointersService } from "../shared/UpdatePointersService.service"
import { Maps } from "../services/maps.service";
import { catchError } from "rxjs";
import { Toasty } from "@triniwiz/nativescript-toasty";
// Important - must register MapView plugin in order to use in Angular templates
registerElement("MapView", () => MapView);
@Component({
  selector: "Home",
  templateUrl: "./home.component.html",
})
export class HomeComponent implements OnInit {
  locations = [];
  watchIds = [];
  zoom = 13;
  minZoom = 0;
  maxZoom = 22;
  bearing = 0;
  tilt = 0;
  padding = [40, 40, 40, 40];
  mapView: MapView;
  lastCamera: String;

  constructor(private updatePointersService:UpdatePointersService, private googleMaps:Maps) {}
  ngOnInit(): void {
  }

  public enableLocationTap() {
    geolocation.isEnabled().then(function (isEnabled) {
        if (!isEnabled) {
            geolocation.enableLocationRequest(true, true).then(() => {
                console.log("User Enabled Location Service");
            }, (e) => {
                console.log("Error: " ,(e.message || e));
            }).catch(ex => {
                console.log("Unable to Enable Location", ex);
            });
        }
    }, function (e) {
        console.log("Error: " + (e.message || e));
    });
}

public buttonGetLocationTap() {
  let that = this;
  geolocation.getCurrentLocation({
      desiredAccuracy: 3,
      maximumAge: 5000,
      timeout: 10000
  }).then(function (loc) {
      if (loc) {
          /* Todo:This line is for dev purpose, get the actual location with the commented line below this line i.e, that.locations.push(loc);*/
          that.locations.push(that.updatePointersService.getTemporaryLocationForDevelopment());
          /* that.locations.push(loc); */
      }
  }, function (e) {
      console.log("Error: " + (e.message || e));
  });
}

public buttonStartTap() {
  try {
      let that = this;
      this.watchIds.push(geolocation.watchLocation(
          function (loc) {
              if (loc) {
                  that.locations.push(loc);
              }
          },
          function (e) {
              console.log("Error: " + e.message);
          },
          {
              desiredAccuracy: 3,
              updateDistance: 1,
              updateTime: 3000,
              minimumUpdateTime: 100
          }));
  } catch (ex) {
      console.log("Error: " + ex.message);
  }
}

public buttonStopTap() {
  let watchId = this.watchIds.pop();
  while (watchId != null) {
      geolocation.clearWatch(watchId);
      watchId = this.watchIds.pop();
  }
}

public buttonClearTap() {
  this.locations.splice(0, this.locations.length);
}

public onCameraMove($event){
  console.log(">>Camera move called..")
}

public onCameraChanged($event){
  console.log(">>Camera Changed event..")
}
/*   public onMapReady(event: MapReadyEvent) {
    const map: GoogleMap = event.map;
  } */

  public onMapReady(event) {
    console.log("#Map ready event...");
    this.mapView = event.object;
    var marker = new Marker();
    let { latitude, longitude } = this.updatePointersService.getTemporaryLocationForDevelopment();
    marker.position = Position.positionFromLatLng(
      latitude,
      longitude
    );
    marker.title = "User Destination";
    marker.snippet = "Baner, India";
    marker.userData = { index: 1 };
    marker.icon = this.updatePointersService.setMapMarkerIcon("metrosmall");
    this.mapView.addMarker(marker);
/*     this.updatePointersService.addFirstCabRoutePolylines(this.mapView);
    this.updatePointersService.addMetroPolylines(this.mapView);
    this.updatePointersService.addSecondCabRoutePolylines(this.mapView); */
  }

  public getDirectionFromGoogleMaps(){
    this.googleMaps.getGoogleMapsDirections().subscribe((googleMapResponse)=>{
      console.log("Got Google Map Response:",googleMapResponse)
      this.updatePointersService.drawSamplePolylineGotFromGoogleMap(googleMapResponse['routes'],this.mapView);
    },catchError(error=>{
      console.log("Direction Error:",error);
      new Toasty({ text: error}).show();
      return error;
    }))
  }


  public addDirections() {
    // instantiate the plugin
    let directions = new Directions();

    directions.available().then((avail) => {
      console.log("Direction Available:", avail ? "Yes" : "No");
    });

    directions
      .navigate({
        from: {
          lat: this.updatePointersService.getTemporaryLocationForDevelopment().latitude,
          lng: this.updatePointersService.getTemporaryLocationForDevelopment().longitude,
        },
        to: [
          {
            // if an Array is passed (as in this example), the last item is the destination, the addresses in between are 'waypoints'.
            address: "Aundh",
          },
          {
            address: "Baner",
          },
        ],
        type: "walking", // optional, can be: driving, transit, bicycling or walking
        android: {
          newTask: true, // Start as new task. This means it will start a new history stack instead of using the current app. Default true.
        },
      })
      .then(
        () => {
          console.log("Maps app launched.");
        },
        (error) => {
          console.log("Final Error:",error);
        }
      );
  }
}
