import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as appSettings from '@nativescript/core/application-settings';

import { catchError, map } from 'rxjs/operators';
import { Toasty } from "@triniwiz/nativescript-toasty" ;

@Injectable()
export class Maps {
    private googleMapURL = "https://maps.googleapis.com/maps/api/directions/json?destination=18.56590882040967,73.77156914711868&mode=driving&origin=18.599386773377216, 73.75444592486868&key=AIzaSyB3ACtv6yW1pV4wnZmwCFs0EjofvuQuke0"
    constructor(private http: HttpClient) { }
    private createRequestOptions() {
        let headers = new HttpHeaders({
            "Content-Type": "application/json"
        });
        return headers;
    }
    //todo: purify this parameter with HTTP or any other link related txt.
    public getGoogleMapsDirections() {
        let options = this.createRequestOptions();
        return this.http.get(this.googleMapURL,{ headers: options }).pipe(
            map(response=>{
                return response;
            }),
            catchError(error => {
                console.log("Directional error:", error);
                throw error;
              })
        );
    }
}
