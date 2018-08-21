import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from 'angular-calendar';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime'
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap/modal/modal.module';

import { CreateMeetingComponent } from './create-meeting/create-meeting.component';
import { DeleteMeetingComponent } from './delete-meeting/delete-meeting.component';
import { UpdateMeetingComponent } from './update-meeting/update-meeting.component';
//import 'flatpickr/dist/flatpickr.css';

@NgModule({
  imports: [
    CommonModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    FormsModule,
    BrowserAnimationsModule,
    NgbModalModule.forRoot(),
    CalendarModule.forRoot(),
    RouterModule.forChild([
      { path: 'create', component: CreateMeetingComponent },
      { path: 'update/:meetingId', component: UpdateMeetingComponent },
      { path: 'delete/:meetingId', component: DeleteMeetingComponent }
    ])
  ],
  declarations: [CreateMeetingComponent, DeleteMeetingComponent, UpdateMeetingComponent]
})
export class MeetingModule { }
