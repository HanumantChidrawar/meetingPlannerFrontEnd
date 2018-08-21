import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
//for using cookies
import { Cookie } from 'ng2-cookies/ng2-cookies';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  public baseUrl = "http://api.meetingplannerapp.hanumantpatil.co/api/v1";
  constructor(private _http: HttpClient) { }

  public getCountryNames(): Observable<any> {

    return this._http.get("../assets/countryList.json");

  }//end getCountryNames

  public getCountryNumbers(): Observable<any> {

    return this._http.get("../assets/countryCodes.json");
    
  }//end getCountryNumbers

  public signUp(data): Observable<any>{

    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('mobileNumber', data.mobileNumber)
      .set('email', data.email)
      .set('password', data.password)
      .set('userName',data.userName)
      .set('country',data.country)
      .set('isAdmin',data.isAdmin);

    return this._http.post(`${this.baseUrl}/users/signup`, params);
  }//end signUp

  public signInFunction(data): Observable<any> {
    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);

    return this._http.post(`${this.baseUrl}/users/login`, params);
  }//end of signInFunction

  public setUserInfoInLocalStorage = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
  }//end of setlocalstorage Function

  public getUserInfoFromLocalStorage: any = () => {
    return JSON.parse(localStorage.getItem('userInfo'));
  }//end getlocalstorage function

  public setSelectedUserInfoInLocalStorage = (data) => {
    localStorage.setItem('selectedUserInfo', JSON.stringify(data));
  }//end of setlocalstorage Function

  public getSelectedUserInfoFromLocalStorage: any = () => {
    return JSON.parse(localStorage.getItem('selectedUserInfo'));
  }//end getlocalstorage function

  public logout(): Observable<any> {

    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'));

    let userdetails = this.getUserInfoFromLocalStorage();

    return this._http.post(`${this.baseUrl}/users/${userdetails.userId}/logout`, params);
  }//end of logout function

  public sendResetLinkFunction(email: string): Observable<any> {
    return this._http.get(`${this.baseUrl}/users/${email}/forgotPassword`);
  }//end sendResetLink function

  public verifyUser(id:string): Observable<any> {
    
    return this._http.get(`${this.baseUrl}/users/${id}/verifyUser`);
  }//end sendResetLink function

  public getUser(email:string): Observable<any> {
    
    return this._http.get(`${this.baseUrl}/users/${email}/getUser`);
  }//end getUser function
  
  public getUsers(): Observable<any> {
    
    return this._http.get(`${this.baseUrl}/users/getUsers`);
  }//end getUsers function

  public resetPassword(data: any): Observable<any> {
    const params = new HttpParams()
      .set('userId', data.userId)
      .set('password', data.password);
    return this._http.post(`${this.baseUrl}/users/resetPassword`, params);

  }//end resetPassword Function

  //meetings related API's

  public getMeetings(id:string): Observable<any> {
    
    return this._http.get(`${this.baseUrl}/meetings/${id}/getMeetings`);
  }//end getMeetings function


  public getMeeting(id:string): Observable<any> {
    
    return this._http.get(`${this.baseUrl}/meetings/${id}/meetingDetails`);
  }//end getMeeting function

  public deleteMeeting(id:string): Observable<any> {
    
    return this._http.get(`${this.baseUrl}/meetings/${id}/deleteMeeting`);
  }//end deleteMeeting function

  public arrangeMeeting(data): Observable<any>{

    const params = new HttpParams()
      .set('hostId', data.hostId)
      .set('hostName', data.hostName)
      .set('startDate', data.startDate)
      .set('endDate', data.endDate)
      .set('title', data.title)
      .set('venue',data.venue)
      .set('meetingWithId',data.meetingWithId)
      .set('meetingWithName',data.meetingWithName)
      .set('purpose', data.purpose);

    return this._http.post(`${this.baseUrl}/meetings/createMeeting`, params);
  }//end arrangeMeeting

  public updateMeeting(data): Observable<any>{

    const params = new HttpParams()
      .set('hostId', data.hostId)
      .set('hostName', data.hostName)
      .set('startDate', data.startDate)
      .set('endDate', data.endDate)
      .set('title', data.title)
      .set('venue',data.venue)
      .set('meetingWithId',data.meetingWithId)
      .set('meetingWithName',data.meetingWithName)
      .set('purpose', data.purpose);

    return this._http.post(`${this.baseUrl}/meetings/${data.meetingId}/updateMeeting`, params);
  }//end updateMeeting



}
