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
  Polyline,
  Position,
} from "nativescript-google-maps-sdk";
import { Color } from "@nativescript/core";

import { Image } from "@nativescript/core";
import { ImageSource } from "@nativescript/core";
import { Folder, path, knownFolders } from "tns-core-modules/file-system";

import { Directions } from "@nativescript/directions";
import { fromFile, fromResource } from "@nativescript/core/image-source";
import { mapConstants } from "./home.constants";
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
  cabColor = "#7976EC";
  metroColor = "#78FD02";
  iconOnScreen = new Image();

  constructor() {}
  ngOnInit(): void {
    console.log("location application");
/*     geolocation.isEnabled().then(function (isEnabled) {
      console.log("Enabled: Is Enabled :", isEnabled);
      if (!isEnabled) {
        geolocation
          .enableLocationRequest()
          .then((x) => {
            geolocation
              .getCurrentLocation({ desiredAccuracy: 3 })
              .then((location) => {
                console.log("location:", JSON.stringify(location));
                this.longitude = location.longitude;
                this.latitude = location.latitude;
              });
          })
          .catch((s) => {
            console.log("Map Error:", s);
          });
      }
    }); */
  }

/*   public onMapReady(event: MapReadyEvent) {
    const map: GoogleMap = event.map;
  } */

  public onMapReady(event) {
    console.log("Map Ready");
    this.mapView = event.object;
    console.log("Setting a marker. ..");

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
    this.addFirstCabRoutePolylines();
    this.addMetroPolylines();
    this.addSecondCabRoutePolylines();
  }

  public addFirstCabRoutePolylines() {
    this.mapView.removeAllShapes();
    let firstCabPolyLine = new Polyline();
    mapConstants.firstCabRoute.map((coordinates) => {
      firstCabPolyLine.addPoint(
        Position.positionFromLatLng(coordinates.latitude, coordinates.longitude)
      );
    });
    firstCabPolyLine.visible = true;
    firstCabPolyLine.geodesic = true;
    firstCabPolyLine.width = 13;
    firstCabPolyLine.color = new Color(this.cabColor);
    this.mapView.addPolyline(firstCabPolyLine);
  }

  public addMetroPolylines() {
    // this.routeCordinates = decodePolyline(encodedPolylinePoints);
    let testPolyLine = new Polyline();
    mapConstants.metroRoute.map((coordinates) => {
      testPolyLine.addPoint(
        Position.positionFromLatLng(coordinates.latitude, coordinates.longitude)
      );
    });
    testPolyLine.visible = true;
    testPolyLine.geodesic = true;
    testPolyLine.width = 13;
    testPolyLine.color = new Color(this.metroColor);
    this.mapView.addPolyline(testPolyLine);
  }

  public addSecondCabRoutePolylines() {
    let secondCabPolyLine = new Polyline();
    mapConstants.secondCabRoute.map((coordinates) => {
      secondCabPolyLine.addPoint(
        Position.positionFromLatLng(coordinates.latitude, coordinates.longitude)
      );
    });
    secondCabPolyLine.visible = true;
    secondCabPolyLine.geodesic = true;
    secondCabPolyLine.width = 13;
    secondCabPolyLine.color = new Color(this.cabColor);
    this.mapView.addPolyline(secondCabPolyLine);
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
          console.log(error);
        }
      );
  }
}
