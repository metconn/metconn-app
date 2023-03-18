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
import { Image } from "@nativescript/core";
import { ImageSource } from "@nativescript/core";
import { Directions } from "@nativescript/directions";
import { UpdatePointersService } from "../shared/UpdatePointersService.service"
// Important - must register MapView plugin in order to use in Angular templates
registerElement("MapView", () => MapView);
@Component({
  selector: "Home",
  templateUrl: "./home.component.html",
})
export class HomeComponent implements OnInit {
  latitude = 18.566060795765072;
  longitude = 73.77133994999672;
  zoom = 13;
  minZoom = 0;
  maxZoom = 22;
  bearing = 0;
  tilt = 0;
  padding = [40, 40, 40, 40];
  mapView: MapView;
  lastCamera: String;
  iconOnScreen = new Image();

  constructor(private updatePointersService:UpdatePointersService) {}
  ngOnInit(): void {
    geolocation.isEnabled().then(function (isEnabled) {
      if (!isEnabled) {
        geolocation
          .enableLocationRequest()
          .then((x) => {
            geolocation
              .getCurrentLocation({ desiredAccuracy: 3 })
              .then((location) => {
                console.log(">>Loading location :",location);
                this.longitude = location.longitude;
                this.latitude = location.latitude;
              });
          })
          .catch((s) => {
            console.log("#Map error...", s);
          });
      }
    });
  }

/*   public onMapReady(event: MapReadyEvent) {
    const map: GoogleMap = event.map;
  } */

  public onMapReady(event) {
    console.log("#Map ready event...");
    this.mapView = event.object;
    var marker = new Marker();
    marker.position = Position.positionFromLatLng(
      this.latitude,
      this.longitude
    );
    marker.title = "User Destination";
    marker.snippet = "Baner, India";
    marker.userData = { index: 1 };
    marker.icon = this.iconOnScreen;
    this.mapView.addMarker(marker);
    this.updatePointersService.addFirstCabRoutePolylines(this.mapView);
    this.updatePointersService.addMetroPolylines(this.mapView);
    this.updatePointersService.addSecondCabRoutePolylines(this.mapView);
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
          // optional, default 'current location'
          lat: 18.6010917,
          lng: 73.7641233,
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
