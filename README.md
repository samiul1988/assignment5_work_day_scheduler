## Assignment 5: Work Day Scheduler (using third party Client Side APIs)
---

### User Story (Obtained from the assignment description)

```
AS AN employee with a busy schedule
I WANT to add important events to a daily planner
SO THAT I can manage my time effectively
```

### Acceptance Criteria (Obtained from the assignment description)

```
GIVEN I am using a daily planner to create a schedule
WHEN I open the planner
THEN the current day is displayed at the top of the calendar
WHEN I scroll down
THEN I am presented with time blocks for standard business hours
WHEN I view the time blocks for that day
THEN each time block is color-coded to indicate whether it is in the past, present, or future
WHEN I click into a time block
THEN I can enter an event
WHEN I click the save button for that time block
THEN the text for that event is saved in local storage
WHEN I refresh the page
THEN the saved events persist
```

### Expected Final Outcome (Obtained from assignment instruction)
![Workday scheduler demo](./assets/images/05-third-party-apis-homework-demo.gif)

## My Actions and Notes

* Obtained base file from Assignment Description Page (link).
* Basic considerations were as follows:
    * Used css and html base file codes wherever possible.
    * The time range is from 9 am to 5 pm (standard business hours).
    * Used moment js for date and time related calculations.
    * I designed the logic in a way that the user cannot enter text for the past time blocks. He/she can enter text only for present/future time blocks. Therefore, to test the app, the user should open the app within standard business hours for best experience. 
    * The localStorage item is reset if the app is opened the next day.
    * The staus colors get updated in every 30 minutes (I chose 30 mins as a reasonable period, can be changed to other period depending on the usage of the app).

### Repository URL
[Click here to see the final outcome](https://samiul1988.github.io/assignment5_work_day_scheduler/)