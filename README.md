# MeetingClient
Following are the hosted link for Meeting Planner App-

1) [Meeting Planner App](http://meetingplannerapp.hanumantpatil.co)
2) [Meeting Planner App API](http://api.meetingplannerapp.hanumantpatil.co)
3) [Meeting Planner App APIDoc](http://apidoc.meetingplannerapp.hanumantpatil.co)
4) [Meeting Planner App EventDoc](http://eventdoc.meetingplannerapp.hanumantpatil.co)
5) [Meeting Planner App Readme.txt](http://readme.meetingplannerapp.hanumantpatil.co)


# MeetingClient

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Login Page
![alt loginPage](https://github.com/HanumantChidrawar/meetingPlannerFrontend/blob/master/pageLook/meetingPlannerLogin.png)

## SignUp Page
![alt signupPage](https://github.com/HanumantChidrawar/meetingPlannerFrontend/blob/master/pageLook/meetingPlannerSigUp.png)

## General Dashboard
![alt generalDashboard](https://github.com/HanumantChidrawar/meetingPlannerFrontend/blob/master/pageLook/generalDashboard.png)

## Admin Dashboard
![alt adminDashboard](https://github.com/HanumantChidrawar/meetingPlannerFrontend/blob/master/pageLook/adminDashboard.png)

## Admin Dashboard User Selected
![alt adminDashboard1](https://github.com/HanumantChidrawar/meetingPlannerFrontend/blob/master/pageLook/adminDashboardSelected.png)

# Login Page

    -- This is the first page to be loaded .
    -- If you are new to application you can redirect to signup page by choosing signup option.
    -- To get in to the MeetingPlannerApp use your registered EmailId and Password to login.
    
# SignUp Page

    -- This page will have the form to sign up to the MeetingPlanner App.(Two types of user Admin/Normal slect as per requirement)
    -- You need to fill all the feilds and then click SignUp button which will then redirect you to Login page if Succesfull.(password should have first character as 		capital)
    -- After succesful signup to the MeetingPlanner app an verify email address link will be sent to you emailId.
    -- Click on that link and verify yourself to the MeetingPlanner app only after which you can login to Meeting Planner App.

# VerifyEmail

    -- This page will display the taost message showing the status of user verification and will also have link to redirect to login page.

# ForgotPassword Page

    -- This page will be displayed when you click on the forgot password option on login page.
    -- Enter you registered email address so that an password reset link can be send to you for resetting the password.

# ResetPassword Page

    -- This page will displayed when you click on the reset link sent to your email.
    -- Enter the new password fand confirm the password and hit enter which will reset the password and redirect you to login page.

# AdminDashboard Page

    -- This page will show all the normal users in the Application as list. As admin you can select(drag) the user with whom you want to schedule a meeting and 
       drop it in a drop area.
    -- This Will that user and will show admin his calendar with all the meeting scheduled for selected user.
    -- As Admin you can then schedule /re-schedule / cancel a meeting with the selected user.
    -- All the meetings of Selected user or if no user is selected yet then of Admin are displayed at the bottom in table format.
    -- The table will contain the button to re-schedule / cancel the particular meeting.
    -- The app will also sent the email as well as toast message to the user for updating him about the schedule/ reschedule / cancel of meeting.
    -- The app will also send an reminder email to bothe Admin as well the normal user of their meeting before a minute of meeting start time.
    -- The Admin can aslo de-select the selected user by using the deselect button.
    -- On clicking on particular date on calendar you will see all the meeting scheduled dor the selected user on that day.
    
# NormalUserDashboard Page

    -- This page show the calendar with all the meeting scheduled for the user.
    -- Noraml user can only view his Meeting.
    -- To see the details click on meeting.
    -- User can click on Month/ Week / Day view button located on top right above the calendar.
    -- Different will be displayed in different color marked on calendar.

# Problem Statement

[MeetingPlannerStatement](https://github.com/HanumantChidrawar/meetingPlannerFrontend/blob/master/Web030102%2B-%2BMeeting%2BPlanner.pdf)
