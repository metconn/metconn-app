import { Injectable } from '@angular/core'
import { Polyline, Position } from 'nativescript-google-maps-sdk';
import { Color } from "@nativescript/core";
import { mapConstants } from "../home/home.constants";
import { ImageSource, Image } from "@nativescript/core";
import { decode, encode } from "@googlemaps/polyline-codec";
export interface DataItem {
  id: number
  name: string
  description: string
}

@Injectable({
  providedIn: 'root',
})
export class UpdatePointersService {
  cabColor = "#7976EC";
  metroColor = "#78FD02";
  
  public getTemporaryLocationForDevelopment(){
    /* Wakad location */
    return {"latitude":18.566060795765072,"longitude":73.77133994999672}
  }

  public drawSamplePolylineGotFromGoogleMap(googleMapRouteResponseData,mapView){
    let samplePolyLine = new Polyline();
    var polylineData = decode(googleMapRouteResponseData[0].overview_polyline.points, 5);
    polylineData.map((coordinates) => {
      samplePolyLine.addPoint(
        Position.positionFromLatLng(coordinates[0], coordinates[1])
      );
    });
    samplePolyLine.visible = true;
    samplePolyLine.geodesic = true;
    samplePolyLine.width = 13;
    samplePolyLine.color = new Color(this.cabColor);
    mapView.addPolyline(samplePolyLine);
  }
  
  public addFirstCabRoutePolylines(mapView) {
    mapView.removeAllShapes();
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
    mapView.addPolyline(firstCabPolyLine);
  }

  public addMetroPolylines(mapView) {
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
    mapView.addPolyline(testPolyLine);
  }

  public addSecondCabRoutePolylines(mapView) {
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
    mapView.addPolyline(secondCabPolyLine);
  }

  public setMapMarkerIcon(iconName:string){
    let imgSrc = ImageSource.fromResourceSync(iconName);
    let image = new Image();
    image.imageSource = imgSrc;
    image.width=100;
    image.height = 100;
    return image;
  }
}
