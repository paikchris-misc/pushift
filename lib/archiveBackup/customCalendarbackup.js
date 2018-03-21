var monthsArray = ["", "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
var daysOfWeek = ["", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var daysOfWeekAbrev = ["", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var today = new Date();
var chosenDate = new Date();
var month = today.getMonth() + 1;
var date = today.getDate();
var year = today.getYear() + 1900;
var monthRows = 0;
var dayRows = 0;
var tdHeight = 0;

var mousePositionX;
var mousePositionY;
var mouseIsOverDiv;

//Hashmap of all Events in DB. Must Sync periodically.
var eventObjectHashMap = {};

//variables needed for timeBlock dragging and resizing
var currentDragOrResizeXCoordinate;
var currentDragOrResizeYCoordinate;
var currentDragOrResizeBottomYCoordinate;
var currentHeightOfEventBeingCreated;

var shiftTypes; //will be declared if in shift creation or generation page
var eventCSSClass; // variable for class name for event divs
var eventTypeDisplay;
var eventTypeColor;
var dragging = false;
var resizing = false;
var newEventInCreationProcess = false;
var whichPage; //identifies which page
var startClickBlockOffset;
var startClickBlockID; //variable for the ID of the where user started a Click
var mouseUpClickID;
var startClickYCoordinate;//variable for the Y coordinate of the where user started a Click
var startClickXCoordinate;//variable for the X coordinate of the where user started a Click
var eventDetailsAdded = false;
var eventDraggedToDifferentStartTime = false;
var minimumHeightWhenEventDetailsAreAdded = 30;
var defaultEventDivWidthSpace = 90;
var eventDivMarginBottom = 2;
var resizeGridY = $(".timeBlock").outerHeight();
//variables needed to Recreate and update event divs
var newDivHomeBlock;
var newDivID;
var newDivHeight;
var newResizableText;
var newNumOfEmployees;
var newDisplayText;
var newFormattedText;
var newShiftType;
var newBackgroundColor;
var newNotesDisplay;
var newSquishedEmployees;
var newEmployees;
var newWeeklyShift = "weekly";
var newEventDate = "blank";

//Constants from Organization Settings
var startTimeHour = $("#startTimeHourVariable").html();
var startTimeMin = $("#startTimeMinVariable").html();
var endTimeHour = $("#endTimeHourVariable").html();
var endTimeMin = $("#endTimeMinVariable").html();
var timeInterval = $("#timeIntervalVariable").html();
var availabilityEvents = $("#availabilityEventsVariable").html();
var savedShiftEvents = $("#shiftEventsVariable").html();
var savedScheduleEvents = $("#scheduleEventsVariable").html();
var fullEmployeeArray = $("#employeesListVariable").html(); //1,test,test,admin@test.com;

var dayLabelBlockYCoordinate;
var timeBlockHeight;
var timeBlockWidth;
updateDayLabelBlockYCoordinate();
updateTimeBlockHeightAndWidth();
var eventCount = 0; //count of events on calendar
var eventObject;

$body = $("body");

$(document).on({
    ajaxStart: function () {
        $body.addClass("loading");
    },
    ajaxStop: function () {
        $body.removeClass("loading");
    }
});

$(document).ready(function () {
    //if in the availability or createSchedule page
    if (window.location.pathname.indexOf("pickupmyshift/application/availability") >= 0 ||
        window.location.pathname.indexOf("pickupmyshift/application/createSchedule") >= 0 ||
        window.location.pathname.indexOf("pickupmyshift/application/employees") >= 0 ) {
        initialize();
        initializeViewButtons();
        var mousedown = false;

        $("#createScheduleWrapper").on('mousedown', '.timeBlock', function (e) {
            mouseDownFunction(e);
        });
        $("#createScheduleWrapper").on('mousemove', '.timeBlock', function (e) {
            mouseMoveFunction(e);
        });
        $("#createScheduleWrapper").on('mouseup', '.timeBlock', function (e) {
            mouseUpFunction(e);
        });

        // when the mouse leaves the calendar area
        mouseLeavingCalendarAreaFunction();

        windowResizeFunction();


    }

    else{
        initialize();
        var mousedown = false;
        mouseLeavingCalendarAreaFunction();

        windowResizeFunction()
    }
});

function mouseDownFunction(e){
    mousedown = true;
    startClickYCoordinate = e.pageY;
    startClickXCoordinate = e.pageX;
    //console.log("wow");
    //ensure all open quick inputs are closed
    $(".squishedNumEmployeesInput").css({'display': 'none'});
    $(".squishedNumEmployees").css({'display': ''});

    //IDENTIFY WHAT WAS CLICKED (EVENT OR TIMEBLOCK ONLY) and get proper timeBlock id
    if (e.target.id.indexOf("tb") >= 0) {
        startClickBlockID = e.target.id;
    }
    else if ($(e.target).hasClass('eventBlockInnerDiv')) {
        startClickBlockID = $(e.target).closest('[id^="event"]').attr("id");
    }
    else {
        startClickBlockID = $("#" + e.target.id).closest('[id^="event"]').attr("id");
    }


    //NEW EVENT CREATION START
    if ($(e.target).hasClass('timeBlock') && e.which == 1 && newEventInCreationProcess == false) {
        if($(e.target).hasClass('calendarCell')){
            //console.log("newCreation Start");
            newEventInCreationProcess = true;
            eventDetailsAdded = false;
            $("#wrapper").disableSelection();

            //consolelog(startClickBlockID.substring(5,7) + "/" + startClickBlockID.substring(7,9) + "/" + startClickBlockID.substring(9));
            newDivID = "event" + startClickBlockID.substring(0, 3) + eventCount;
            newEventDate = startClickBlockID.substring(5,7) + "/" + startClickBlockID.substring(7,9) + "/" + startClickBlockID.substring(9);
            //console.log("EVENT TYPE: " + eventTypeDisplay);
            eventObject = new event(newDivID, eventTypeDisplay, newEventDate, 1);
            //console.log(eventObject.eventID);

            createEventDivContainer(eventObject);


        }
        else {
            newEventInCreationProcess = true;
            eventDetailsAdded = false;
            $("#wrapper").disableSelection();

            //get the Y position coordinate of the top of Calendar
            updateDayLabelBlockYCoordinate();
            //update the height of all timeBlocks. This changes with window resize.
            updateTimeBlockHeightAndWidth();

            //Insert Event Div where Mouse is initially clicked, NO DETAILS YET
            newDivID = "event" + startClickBlockID.substring(0, 3) + eventCount;
            newEventDate = $("#" + startClickBlockID).closest('table').find('thead').find('tr').find('td').eq($("#" + startClickBlockID).index()).find(".hiddenDate").html();

            eventObject = new event(newDivID, eventTypeDisplay, newEventDate, 1);
            eventObject.topYPos = $("#" + startClickBlockID).offset().top;

            createEventDivContainer(eventObject);

            //Jquery UI Drag Code
            draggableFunction();

            //Jquery UI Resize Code
            resizableFunction();
        }
    }
}
function mouseMoveFunction(e){
    //console.log(e.pageY + "," + e.target.id);
    //console.log("mouseMOVE");
    //console.log(e.target);
    if($("#" + e.target.id).hasClass("calendarCell")){
        mouseIsOverDiv = e.target.id;
        //console.log(mouseIsOverDiv);
    }
    //pauseEvent(e);
    mousePositionX = e.pageX;
    mousePositionY = e.pageY;
    if (newEventInCreationProcess == true) {
        //console.log("Mouse Move")
        if ($("#weekViewButton").hasClass('active') || $("#dayViewButton").hasClass('active')) {

            $(".popover").hide();

            //get current Y position of bottom of Event Div
            eventObject.botYPos = e.pageY;
            //currentDragOrResizeBottomYCoordinate = e.pageY;
            //currentDragOrResizeXCoordinate = e.pageX;
            //Adjust top of event placement to start at top of clicked TimeBlock instead of actual mouse click
            //distanceBetweenClickAndTopOfTimeBlock = startClickYCoordinate - $("#" + startClickBlockID).offset().top;

            //Calculate the Current height of the div being created.
            eventObject.divHeight = (eventObject.botYPos - eventObject.topYPos) - 5;
            //console.log(eventObject.getTimeFromPosition(e.pageY));
            //adjust height of div as mouse is moving. without this div does not adjust height while mouse moves.

            $("#" + eventObject.eventID).height(eventObject.divHeight);

            //If event div has been created, it's height is greater than x pixels, and event detail spans and buttons have not been added.
            if (eventObject.divHeight > minimumHeightWhenEventDetailsAreAdded && eventDetailsAdded == false) {
                createEventDetails(eventObject);
                eventDetailsAdded = true;
            }

            //add event time and details.
            eventObject.updateEventTimeDivs();

        }
        else if($("#monthViewButton").hasClass('active')){

        }
    }


}

function mouseUpFunction(e){
    //console.log("MouseUP");
    //If event div was created and dragged up, delete it.
    if (newEventInCreationProcess == true && $(e.target).hasClass('timeBlock') && startClickYCoordinate > e.pageY) {
        $("#" + eventObject.eventID).remove();
        newEventInCreationProcess = false;
    }
    //if mouseup was on a timeBlock only, left click only. Does not apply to drag events since their class is not timeBlock OR when new event div creation is in progress
    else if (newEventInCreationProcess) {
        if($("#monthViewButton").hasClass('active')){
            //console.log('show modal create');
            //console.log(eventObject.eventID);
            $('#myModal').modal('show');
            fillInShiftDetailModalFields(eventObject);
            //createEventDetails(eventObject);
            eventObjectHashMap[eventObject.eventID] = eventObject;
            //console.log(eventObjectHashMap);
            eventCount++;
            //newEventInCreationProcess = false;

        }
        else {
            //if mouseup on timeBlock it'll know the timeblock ID, otherwise (when mouseup is over another event) it must calcualte from resizable text
            if ($(e.target).hasClass('timeBlock')) {
                //alert("timeblock");
                currentDragOrResizeBottomYCoordinate = ($("#" + e.target.id).offset().top + $("#" + e.target.id).outerHeight(true));
                eventObject.botYPos = currentDragOrResizeBottomYCoordinate - 1;
            }
            else {
                //alert($("#unformattedTime", "#event"+ startClickBlockID.substring(0,3) + eventCount).html().substring(11,15));
                //alert("else");
                //console.log("else: " +  startClickBlockID.substring(0, 3) + "tb" + $("#unformattedTime", "#event" + startClickBlockID.substring(0, 3) + eventCount).html().substring(11, 15));

                currentDragOrResizeBottomYCoordinate = $("#" + startClickBlockID.substring(0, 3) + "tb" + eventObject.getTimeFromPosition(e.pageY, false)).offset().top;
                eventObject.botYPos = currentDragOrResizeBottomYCoordinate - 1;
            }

            //adjust height to fit to the entire timeblock needed

            //If Event Details not added yet, usually when it's a immediate click down and up event, add event spans and buttons
            if (eventDetailsAdded == false) {
                createEventDetails(eventObject);
                eventDetailsAdded = true;
            }

            eventObject.divHeight = (eventObject.botYPos - eventObject.topYPos) - eventDivMarginBottom;
            $("#" + eventObject.eventID).height(eventObject.divHeight);
            //add event time and details to div
            eventObject.updateEventTimeDivs();
            eventObject.eventDBString = eventObject.eventID + "," + eventObject.dayOfEvent().substring(0,3) + " " + eventObject.startTime() +
                " - " + eventObject.endTime() + "," + eventObject.shiftType + "," + eventObject.numberOfShifts + "," +
                eventObject.notesString() + "," + eventObject.weeklyOrOneTime + "," + eventObject.formattedDate();
            eventObjectHashMap[eventObject.eventID] = eventObject;
            //console.log(eventObjectHashMap);
            eventCount++;
            newEventInCreationProcess = false;
            //consolelog("MOUSEUP");
            fixOverLappingEventDivs2();
            saveShiftsToServer();
        }
    }

    //if mouseup was on a draggable only. left click only.
    else if (dragging == true) {
        if ($("#weekViewButton").hasClass('active') || $("#dayViewButton").hasClass('active')) {
            //consolelog("drag stop " + startClickBlockID);
            eventObject = eventObjectHashMap[startClickBlockID];
            //consolelog("hello: " + eventObject);
            if (eventObject.endTime() == "" + endTimeHour + endTimeMin) {
                newDivEndBlock = $(".timeBlock.Sunday").last().attr("id");
                newDivHeight = ($("#" + newDivEndBlock).offset().top + $("#" + newDivEndBlock).outerHeight() - 2) - $("#" + newDivHomeBlock).offset().top;
            }
            else {
                //eventObject.divHeight = ($("#" + eventObject.getEndBlockID()).offset().top - 2) - $("#" + eventObject.getStartBlockID()).offset().top;
            }
            //eventObject.eventID = startClickBlockID;
            //newResizableText = $("#unformattedTime", "#" + startClickBlockID).html().substring(0, 3) + " " + calculateTimeFromPosition(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate);
            //eventObject.numberOfShifts = $("#numOfEmployees", "#" + startClickBlockID).html();
            //eventObject.shiftType = $("#shiftTypeDisplay", "#" + startClickBlockID).html();
            //newFormattedText = $("#formattedTimeDisplay", "#" + startClickBlockID).html();
            //newShiftType = $("#shiftType", "#" + startClickBlockID).html();
            //newSquishedEmployees = $(".squishedDisplay.employeesScheduled", "#" + startClickBlockID).html();
            //eventObject.employeesScheduled = $(".eventBlockInnerDiv.employeesScheduled", "#" + startClickBlockID).html();
            //eventObject.weeklyOrOneTime = $("div.weeklyShift", "#" + startClickBlockID).html();
            if (eventObject.weeklyOrOneTime == "oneTime") {

                //eventObject.dateObject = new Date(year, month - 1, date - (chosenDate.getDay() - (daysOfWeekAbrev.indexOf(dayTemp) - 1)));
                //eventObject.formattedDate = tempDate.getMonth() + 1 + "/" + tempDate.getDate() + "/" + (tempDate.getYear() + 1900);

            }
            else {

                //eventObject.dateObject  = new Date(year, month - 1, date - (chosenDate.getDay() - (daysOfWeekAbrev.indexOf(dayTemp) - 1)));
                //eventObject.formattedDate = tempDate.getMonth() + 1 + "/" + tempDate.getDate() + "/" + (tempDate.getYear() + 1900);
            }
            //console.log()
            //alert(newDivEndBlock);


            //eventObject.eventTypeColor= $("#" + startClickBlockID).css('background-color');

            //eventCount++;
            //console.log("New block: " + eventObject.getStartBlockID());
            $("#" + eventObject.eventID).remove();

            createEventDivContainer(eventObject);
            //console.log("dragged: " + eventObject.formattedDate());
            createEventDetails(eventObject);

            //$("#" + newDivID).css('background-color', "" + newBackgroundColor + "");
            draggableFunction();
            resizableFunction();

            dragging = false;
            fixOverLappingEventDivs2();
            saveShiftsToServer();
        }
        else if ($("#dayViewButton").hasClass('active')){

        }
        else if ($("#monthViewButton").hasClass('active')){
            eventObject = eventObjectHashMap[startClickBlockID];
            $("#" + eventObject.eventID).remove();
            createEventDivContainer(eventObject);
            createEventDetails(eventObject);
            draggableFunction();
            resizableFunction();
        }
    }
    else if (resizing == true) {
        eventObject = eventObjectHashMap[startClickBlockID];

        $("#" + eventObject.eventID).remove();
        createEventDivContainer(eventObject);
        createEventDetails(eventObject);
        //
        //$("#" + newDivID).css('background-color', "" + newBackgroundColor + "");
        draggableFunction();
        resizableFunction();

        resizing = false;
        fixOverLappingEventDivs2();
        saveShiftsToServer();
        document.body.style.cursor = "auto";
    }

    //single click on a event div, no drag
    else if (($(e.target).hasClass('draggable') || ($(e.target).hasClass('insideEventBlock')))
        && Math.abs(startClickYCoordinate - e.pageY) < 5 && Math.abs(startClickXCoordinate - e.pageX < 5) && e.which == 1 && dragging == false && resizing == false) {

        //console.log(e.target);
        //console.log('show modal edit ' + $(e.target).closest('.event').attr("id"));
        //console.log(eventObjectHashMap);
        eventObject = eventObjectHashMap[$(e.target).closest('.event').attr("id")];
        if ($(".squishedNumEmployeesInput").is(":visible")) {
            $(".squishedNumEmployeesInput").hide();
        }
        else {

        }
        $('#myModal').modal('show');
        //console.log("show modal: " + eventObject);
        fillInShiftDetailModalFields(eventObject);
    }
    //console.log("mouse up: " + $(e.target).closest(".event"));
    mousedown = false;
    $("#wrapper").enableSelection();
    $(document.documentElement).enableSelection();
}
function event(thisEventID, thisShiftType, thisDate, thisNumberShifts){
    this.eventID = thisEventID;
    this.eventDBString = ""; //EVENTID,DAY HHMM - HHMM,SERVER,1,NOTES,weekly/oneTime,01/01/2015;

    this.notesString = function(){

        if(this.eventDBString.length < 1 ){
            return "";
        }
        else{
            return this.eventDBString.split(",")[4];
        }
    }
    //DATE STUFF
    var dateObj = new Date(thisDate.substring(6,10), thisDate.substring(0,2)-1, thisDate.substring(3,5));
    this.dateObject = dateObj;
    this.formattedDate = function (){
        //console.log("BOOP");
        var tempMonth = dateObj.getMonth()+1;
        return (tempMonth <10 ? "0" + tempMonth: tempMonth) + "/" + (dateObj.getDate() <10 ? "0" + dateObj.getDate() : dateObj.getDate()) + "/" + (dateObj.getYear() + 1900);
    };
    this.formattedDateNoDelimit = function (){
        //console.log("BOOP");
        var tempMonth = dateObj.getMonth()+1;
        return "" + (tempMonth <10 ? "0" + tempMonth: tempMonth) + (dateObj.getDate() <10 ? "0" + dateObj.getDate() : dateObj.getDate())  + (dateObj.getYear() + 1900);
    };
    this.dayOfEvent = function () {
        return daysOfWeek[this.dateObject.getDay()+1];
    };
    this.setDateObject = function(newDateString){
        dateObj = new Date(newDateString.substring(6,10), newDateString.substring(0,2)-1, newDateString.substring(3,5));
        this.dateObject = dateObj;
    };


    this.shiftType = thisShiftType;
    this.eventTypeColor = function(){
        var shiftTypesArray = shiftTypes.split(",");
        for (var c = 0; c < shiftTypesArray.length; c++) {
            if (shiftTypesArray[c].split(" ")[0] == this.shiftType) {
                return shiftTypesArray[c].split(" ")[1];
            }
        }
    };
    this.numberOfShifts = thisNumberShifts;
    this.employeesScheduled = "";
    this.weeklyOrOneTime = "oneTime";
    this.defaultEventWidth = "90";
    this.CSSClass = eventCSSClass;
    this.divHeight = 0;
    this.updateDivHeight = function(){
        this.divHeight = $("#" + this.eventID).outerHeight(true);
    };
    this.topYPos = 0;
    this.leftXPos = 0;
    this.botYPos = 0;


    this.startTime = function () {
        var yStartPos;
        if($("#dayViewButton").hasClass('active') || $("#weekViewButton").hasClass('active')) {
            if ($("#" + this.eventID).length > 0) {
                yStartPos = this.topYPos;
                //alert(yStartPos);
            }
            else if (newEventInCreationProcess) {
                yStartPos = mousePositionY;

            }
            else if (dragging) {
                yStartPos = this.topYPos;

            }
            else {//Populating shifts from Server
                yStartPos = this.topYPos;
            }

            //console.log("Default: " + yStartPos);
            return (this.getTimeFromPosition(yStartPos, true));
        }
        else if ($("#monthViewButton").hasClass('active')){

            return this.eventDBString.split(",")[1].substring(4, 8);

        }
    };
    this.endTime = function () {
        var yEndPos;
        if($("#dayViewButton").hasClass('active') || $("#weekViewButton").hasClass('active')) {
            if ($("#" + this.eventID).length > 0) {
                yEndPos = this.botYPos;
            }
            else {
                yEndPos = this.botYPos;
            }

            return (this.getTimeFromPosition(yEndPos, false));
        }
        else if ($("#monthViewButton").hasClass('active')){

            return this.eventDBString.split(",")[1].substring(11);

        }
    };


    this.getStartBlockID = function () {
        if($("#dayViewButton").hasClass('active')){
            return ("DAYVIEW" + this.dayOfEvent().substring(0, 3) + "tb" + this.startTime());
        }
        else if($("#monthViewButton").hasClass('active')){
            return (this.dayOfEvent().substring(0, 3) + "tb" + this.formattedDate().replace(/\//g, ''));
        }
        else {
            return (this.dayOfEvent().substring(0, 3) + "tb" + this.startTime());
        }
    };
    this.getEndBlockID = function () {
        if($("#dayViewButton").hasClass('active')){
            return ("DAYVIEW" + this.dayOfEvent().substring(0, 3) + "tb" + this.endTime());
        }
        else {
            return (this.dayOfEvent().substring(0, 3) + "tb" + this.endTime());
        }
    };


    this.getTimeFromPosition = function (yPos, startOfTimeBlock) {
        var n = 0;
        if(startOfTimeBlock == true){
            n = 0;
        }
        else{
            n=1;
        }

        if (Math.floor((yPos - dayLabelBlockYCoordinate) / timeBlockHeight) + 1 >= $(".timeBlock.Sunday").length) {
            //var lastBlock = parseInt($(".Sunday").eq(Math.floor((yEndPos-dayLabelBlockYCoordinate)/timeBlockHeight)).attr('id').substring(5,9)) + parseInt(timeInterval);
            var lastBlock = parseInt(endTimeHour + endTimeMin);
            var tempString = lastBlock;
        }
        else{
            //console.log("Math: " + (Math.floor((yPos))));

            var tempString = $(".Sunday").eq(Math.floor((yPos - dayLabelBlockYCoordinate) / timeBlockHeight) + n).attr('id').substring(5, 9);

        }

        return (tempString);
    };
    this.getUnformattedTime = function () {
        var tempString = this.startTime() + " - " + this.endTime();
        //this.endTime = (tempString.substring(7));
        //console.log(tempString);

        return (this.dayOfEvent().substring(0,3) + " " + tempString);
    }

    this.getFormattedTime = function () {
        var tempString = this.startTime() + " - " + this.endTime();
        var startMinFormatted = parseInt(tempString.substring(2, 4)) == 0 ? "" : ":" + tempString.substring(2, 4);
        //console.log(parseInt(tempString.substring(2,4)));
        var endMinFormatted = parseInt(tempString.substring(9, 11)) == 0 ? "" : ":" + tempString.substring(9, 11);
        var stringReturn =
            ((parseInt(tempString.substring(0, 2)) < 12) ? (parseInt(tempString.substring(0, 2)) + startMinFormatted + "") : ((parseInt(tempString.substring(0, 2)) == 12) ? (parseInt(tempString.substring(0, 2)) + startMinFormatted + "p") : (parseInt(tempString.substring(0, 2)) - 12 + startMinFormatted + "p"))) +
            " - " +
            ((parseInt(tempString.substring(7, 9)) < 12) ? (parseInt(tempString.substring(7, 9)) + endMinFormatted + "") : ((parseInt(tempString.substring(7, 9)) == 12) ? (parseInt(tempString.substring(7, 9)) + endMinFormatted + "p") : (parseInt(tempString.substring(7, 9)) - 12 + endMinFormatted + "p")));

        return (stringReturn);
    }

    this.updateEventTimeDivs = function () {
        $("#unformattedTime", "#"+ this.eventID).html(this.getUnformattedTime());
        //$("#formattedTimeDisplay", eventObject.eventID).html(calculateTimeFromPositionFormatted(topX, topY, botY));
        $("#formattedTimeDisplay", "#" + this.eventID).html(this.getFormattedTime());
    }
    this.refreshDateDivs = function(){
        $(".eventDate", "#"+ this.eventID).html(this.formattedDate());
    };






}
function fillDatesWeek() {
    month = chosenDate.getMonth() + 1;
    date = chosenDate.getDate();
    year = chosenDate.getYear() + 1900;
    //alert(chosenDate);
    $(".today").removeClass("today");
    for (var i = 1; i < daysOfWeek.length; i++) {
        var tempDate = new Date(year, month - 1, date - (chosenDate.getDay() - (i - 1)));
        var tempMonth = tempDate.getMonth()+1;
        $("#" + daysOfWeek[i] + "DateLabel").html(tempDate.getDate() + " ");
        $("#weekViewHiddenDate" + daysOfWeek[i]).html((tempMonth <10 ? "0" + tempMonth: tempMonth) + "/" + (tempDate.getDate() <10 ? "0" + tempDate.getDate() : tempDate.getDate()) + "/" + (tempDate.getYear() + 1900));
        if(today.getMonth() == tempDate.getMonth() && today.getDate() == tempDate.getDate() && today.getYear() == tempDate.getYear()) {//if today
            //alert(today + "=" + tempDate);
            $("." + daysOfWeek[i]).addClass('today');
        }

    }

    var tempDate = new Date(year, month - 1, date - (chosenDate.getDay() - (1 - 1))); //Get the Date of Sunday
    $("#monthHeaderMonth").html(monthsArray[tempDate.getMonth() + 1]);
}
function fillDatesEmployee(){
    month = chosenDate.getMonth() + 1;
    date = chosenDate.getDate();
    year = chosenDate.getYear() + 1900;
    //alert(chosenDate);
    $(".today").removeClass("today");
    for (var i = 1; i < daysOfWeek.length; i++) {
        var tempDate = new Date(year, month - 1, date - (chosenDate.getDay() - (i - 1)));
        var tempMonth = tempDate.getMonth()+1;
        $("#employeeView" + daysOfWeek[i] + "DateLabel").html(tempDate.getDate() + " ");
        $("#employeeViewHiddenDate" + daysOfWeek[i]).html((tempMonth <10 ? "0" + tempMonth: tempMonth) + "/" + (tempDate.getDate() <10 ? "0" + tempDate.getDate() : tempDate.getDate()) + "/" + (tempDate.getYear() + 1900));
        if(today.getMonth() == tempDate.getMonth() && today.getDate() == tempDate.getDate() && today.getYear() == tempDate.getYear()) {//if today
            //alert(today + "=" + tempDate);
            $("." + daysOfWeek[i]).addClass('today');
        }

    }

    var tempDate = new Date(year, month - 1, date - (chosenDate.getDay() - (1 - 1))); //Get the Date of Sunday
    $("#monthHeaderMonth").html(monthsArray[tempDate.getMonth() + 1]);
}
function fillDatesDay(){
    month = chosenDate.getMonth() + 1;
    date = chosenDate.getDate();
    year = chosenDate.getYear() + 1900;

    initializeDayCalendar();
    $("#monthHeaderMonth").html(monthsArray[chosenDate.getMonth() + 1]);
}

function fillDatesMonth(){
    month = chosenDate.getMonth() + 1;
    date = chosenDate.getDate();
    year = chosenDate.getYear() + 1900;

    fillMonthlyCalendar();
    //alert(chosenDate);
    $("#monthHeaderMonth").html(monthsArray[chosenDate.getMonth() + 1]);
}
function initialize() {
    $(window).unload(function () {
        //alert("wait");
    });
    //console.log("INITAILZING");
    month = today.getMonth() + 1;
    date = today.getDate();
    year = today.getYear() + 1900;
    var dayStartTime = 0;
    var dayEndTime = 24;
    fillDatesWeek();
    fillDatesDay();
    fillDatesEmployee();

    //Differentiate between which calendarPage
    if (window.location.pathname.indexOf("pickupmyshift/application/availability") >= 0 ||
        window.location.pathname.indexOf("pickupmyshift/application/employees") >= 0) {
        whichPage = "availability";
        eventCSSClass = "event unavailableBlock";
        eventTypeDisplay = "Unavailable";
        eventTypecolor = "#f55454";
        if (availabilityEvents.trim().length > 0) {
            populateSavedAvailability();
        }
        initializePopover();
        initializeCreateShiftButtons();
    }
    else if (window.location.pathname.indexOf("pickupmyshift/application/createSchedule") >= 0 ||
        window.location.pathname.indexOf("pickupmyshift/application/generateSchedule") >= 0 ||
        window.location.pathname.indexOf("pickupmyshift/application/calendar") >= 0 ||
        window.location.pathname.indexOf("pickupmyshift/application/scheduleView") >= 0) {
        shiftTypes = $("#shiftTypes").html();
        whichPage = "schedule";
        eventCSSClass = "event shiftBlock";
        eventTypeDisplay = $("#shiftTypeDropdownText").html();
        eventTypeColor = $("#shiftTypeDropDownColorBox").css('background-color');

        initializePopover();

        initializeCreateShiftButtons();

        getScheduleForCurrentDatesAndFillCalendar();

        //LOAD SAVED SHIFTS
//	    if(savedScheduleEvents.trim().length > 1){
//		populateSavedShiftsWithSchedule();
//	    }
//	    else if(savedShiftEvents.trim().length > 1){
//		populateSavedShifts("week");
//	    }

    }
}
function initializePopover() {
    //initialize and setup popover
    //$('[data-toggle="popover"]').popover();
    $("#wrapper").popover({
        html: true,
        placement: 'top',
        trigger: "hover",
        title: function () {
            var content = "<b>" + $("#" + this.id).find("#shiftTypeDisplay").html() + " Shift</b> ";
            return content;
        },
        selector: ".event",
        template: '<div class="popover eventPopover" role="tooltip">' +
        '<div class="arrow">' +
        '</div>' +
        '<h3 class="popover-title"></h3><div class="popover-content"></div></div>',
        content: function () {
            var content = "<b>Day</b>: " + $("#" + this.id).find("#unformattedTime").html().split(" ")[0] + " <br>" +
                "<b>Time</b>: " + $("#" + this.id).find("#formattedTimeDisplay").html() + " <br>" +
                (whichPage == "schedule" ?
                "<b># of Shifts</b>: " + $("#" + this.id).find("#numOfEmployees").html().split(" ")[0] + "<br>"
                    : "") +

                "<b>Notes</b>: " + $("#" + this.id).find("#notesDisplay").html();
            return content;
        }
    });
}
function initializeViewButtons() {
    $(".viewType").css({'display': 'none'});
    $("#weekView").css({'display': ''});
    $("#wrapper").on('click', '#dayViewButton', function (e) {
        $(".event").remove();
        eventObjectHashMap = {};
        if($("#dayViewButton").hasClass('active')){

        }
        else{
            $(".viewType").css({'display': 'none'});
            $("#dayView").css({'display': ''});
            $("#monthViewButton").removeClass("active");
            $("#weekViewButton").removeClass("active");
            $("#employeeViewButton").removeClass("active");
            $("#dayViewButton").toggleClass("active");
            initializeDayCalendar();
            getScheduleForCurrentDatesAndFillCalendar();
        }

    });
    $("#wrapper").on('click', '#weekViewButton', function (e) {
        $(".event").remove();
        eventObjectHashMap = {};
        if($("#weekViewButton").hasClass('active')){

        }
        else {
            $(".viewType").css({'display': 'none'});
            $("#weekView").css({'display': ''});
            $("#monthViewButton").removeClass("active");
            $("#dayViewButton").removeClass("active");
            $("#employeeViewButton").removeClass("active");
            $("#weekViewButton").toggleClass("active");
            fillDatesWeek();
            getScheduleForCurrentDatesAndFillCalendar();
        }
    });
    $("#wrapper").on('click', '#monthViewButton', function (e) {
        $(".event").remove();
        eventObjectHashMap = {};
        if($("#monthViewButton").hasClass('active')){

        }
        else {
            $(".viewType").css({'display': 'none'});
            $("#monthView").css({'display': ''});
            $("#dayViewButton").removeClass("active");
            $("#weekViewButton").removeClass("active");
            $("#employeeViewButton").removeClass("active");
            $("#monthViewButton").toggleClass("active");

            fillDatesMonth();
            getScheduleForCurrentDatesAndFillCalendar();
        }
    });
    $("#wrapper").on('click', '#employeeViewButton', function (e) {
        if($("#employeeViewButton").hasClass('active')){

        }
        else {
            $(".viewType").css({'display': 'none'});
            $("#employeeView").css({'display': ''});
            $("#monthViewButton").removeClass("active");
            $("#weekViewButton").removeClass("active");
            $("#dayViewButton").removeClass("active");
            $("#employeeViewButton").toggleClass("active");
            fillDatesEmployee();
            initializeEmployeeCalendar();
        }
    });
}
function initializeCreateShiftButtons() {
    //Calendar Back Button
    $("#wrapper").on('click', '#backCalendar', function (e) {
        if($("#weekViewButton").hasClass("active")){
            chosenDate.setDate(chosenDate.getDate() - 7);
            fillDatesWeek();
        }
        else if($("#dayViewButton").hasClass("active")){
            chosenDate.setDate(chosenDate.getDate() - 1);
            fillDatesDay();
        }
        else if($("#monthViewButton").hasClass("active")){
            chosenDate.setMonth(chosenDate.getMonth()-1);
            fillDatesMonth();

        }
        else if($("#employeeViewButton").hasClass("active")){
            chosenDate.setDate(chosenDate.getDate()-1);
            fillDatesEmployee();
        }

        //change the dates on the calendar

        if (whichPage == "schedule") {
            getScheduleForCurrentDatesAndFillCalendar();
        }
        else if (whichPage == "availability") {

            getAvailabilityForCurrentDatesAndFillCalendar();
            if (availabilityEvents.trim().length > 0) {
                populateSavedAvailability();
            }
        }

        //replace hidden variable scheduleEventArray with new events for the new dates
        //populateSavedShiftwithSchedule
        //LOAD SAVED SHIFTS

    });
    //Calendar Forward Button
    $("#wrapper").on('click', '#forwardCalendar', function (e) {
        if($("#weekViewButton").hasClass("active")){
            chosenDate.setDate(chosenDate.getDate() + 7);
            fillDatesWeek();
        }
        else if($("#dayViewButton").hasClass("active")){
            chosenDate.setDate(chosenDate.getDate() + 1);
            fillDatesDay();
        }
        else if($("#monthViewButton").hasClass("active")){
            chosenDate.setMonth(chosenDate.getMonth()+1);
            fillDatesMonth();

        }
        else if($("#employeeViewButton").hasClass("active")){
            chosenDate.setDate(chosenDate.getDate()-1);
            fillDatesEmployee();
        }


        if (whichPage == "schedule") {
            getScheduleForCurrentDatesAndFillCalendar();
        }
        else if (whichPage == "availability") {
            getAvailabilityForCurrentDatesAndFillCalendar();
            if (availabilityEvents.trim().length > 0) {
                populateSavedAvailability();
            }
        }

        //populateSavedShiftsWithSchedule()
        //LOAD SAVED SHIFTS
    });
    //DropDown menu of shift Types on main page
    $("#wrapper").on('click', '.shiftType', function (e) {
        $("#shiftTypeDropdownText").html(e.target.id.split(" ")[0]);
        $("#shiftTypeDropDownColorBox").css('background-color', '' + e.target.id.split(" ")[1] + '')
        eventTypeDisplay = $("#shiftTypeDropdownText").html();
        eventTypeColor = $("#shiftTypeDropDownColorBox").css('background-color');
    });

    //Dropdown menu of shift types in Modal
    $("#wrapper").on('click', '.shiftTypeModal', function (e) {
        //eventCSSClass = eventCSSClass + " shiftType-" + e.target.id.split(" ")[0];
        //alert(e.target.id.split(" ")[1]);
        $("#shiftTypeDropdownTextModal").html(e.target.id.split(" ")[0]);
        $("#shiftTypeDropDownColorBoxModal").css('background-color', '' + e.target.id.split(" ")[1] + '')

    });
    $("#wrapper").on('change', '#startTimeModal', function (e) {
        //alert($("#startTimeModal").val());
        if($("#startTimeModal").val() == 'none'){
            $("#startTimeInputModalDiv").addClass("has-error");
        }
        else{
            $("#startTimeInputModalDiv").removeClass("has-error");
        }
    });
    $("#wrapper").on('change', '#endTimeModal', function (e) {
        if($("#endTimeModal").val() == 'none'){
            $("#endTimeInputModalDiv").addClass("has-error");
        }
        else{
            $("#endTimeInputModalDiv").removeClass("has-error");
        }
    });
    $("#wrapper").on('change', '#numOfEmployeesInputModal', function (e) {
        var stringTemp = "";
        for (var i = 0; i < $(".working").length; i++) {
            stringTemp = stringTemp + $(".working").get(i).id + ", ";
        }
        if (stringTemp.split(",").length > $("#numOfEmployeesInputModal").val()) {
            var employeeToRemoveDivID = $(".working").get(($(".working").length - 1)).id;
            $("a[id='" + employeeToRemoveDivID + "']").toggleClass("working");
            $(".glyphicon", "a[id='" + employeeToRemoveDivID + "']").css({'display': 'none'});
        }
        stringTemp = "";
        for (var i = 0; i < $(".working").length; i++) {
            stringTemp = stringTemp + $(".working").get(i).id + ", ";
        }
        //alert(stringTemp);
        $("#scheduledEmployeeDropdownTextModal").html(stringTemp);
    });
    //Dropdown of Employees in Modal
    $("#wrapper").on('click', '.scheduledEmployeeModal', function (e) {
        //eventCSSClass = eventCSSClass + " shiftType-" + e.target.id.split(" ")[0];
        //alert($("a[id='" + e.target.id + "']").html());
        $("a[id='" + e.target.id + "']").toggleClass("working");
        if ($("a[id='" + e.target.id + "']").hasClass("working")) {
            $(".glyphicon", "a[id='" + e.target.id + "']").css({'display': ''});
            var stringTemp = "";
            for (var i = 0; i < $(".working").length; i++) {
                stringTemp = stringTemp + $(".working").get(i).id + ", "
            }
            stringTemp = stringTemp.trim();
            if (stringTemp[stringTemp.length - 1] == ",") {
                stringTemp = stringTemp.substring(0, stringTemp.length - 1)
            }
            $("#scheduledEmployeeDropdownTextModal").html(stringTemp);
        }
        else {
            $(".glyphicon", "a[id='" + e.target.id + "']").css({'display': 'none'});
            var stringTemp = "";
            for (var i = 0; i < $(".working").length; i++) {
                stringTemp = stringTemp + $(".working").get(i).id + ", "
            }
            stringTemp = stringTemp.trim();
            if (stringTemp[stringTemp.length - 1] == ",") {
                stringTemp = stringTemp.substring(0, stringTemp.length - 1)
            }
            if (stringTemp.trim().length < 1) {
                stringTemp = "None";
            }
            $("#scheduledEmployeeDropdownTextModal").html(stringTemp);
        }

        //Check employees choseen don't exceed number of employees for shift.
        if (stringTemp.split(",").length > $("#numOfEmployeesInputModal").val()) {
            //alert("Number of employees selected exceed # of Shifts available.");
            $(".glyphicon", "a[id='" + e.target.id + "']").css({'display': 'none'});
            $("a[id='" + e.target.id + "']").toggleClass("working");
            stringTemp = "";
            for (var i = 0; i < $(".working").length; i++) {
                stringTemp = stringTemp + $(".working").get(i).id + ", ";
            }
            $("#scheduledEmployeeDropdownTextModal").html(stringTemp);

        }
    });

    //Save Button Details in Modal
    $("#wrapper").on('click', '#saveShiftDetailsModal', function (e) {
        saveShiftDetailModal();
    });

    //close Button Details in Modal
    $("#wrapper").on('click', '#closeShiftDetailsModal', function (e) {
        if(newEventInCreationProcess){
            $("#" + eventObject.eventID).remove();
            newEventInCreationProcess = false;
        }
    });

    //Modal weekly/one time radio buttons change
    $("#wrapper").on('change', 'input[name=weeklyRadioButton]', function (e) {
        //alert("Changed");
        if ($('input[name=weeklyRadioButton]:checked').val() == "oneTime") {
            $("#daySelectorGroup").hide();
            $("#startDateGroup").show();
        }
        else{
            $("#daySelectorGroup").show();
            $("#startDateGroup").hide();
        }


    });

    //Schedule Options Modal
    $("#wrapper").on('click', '#scheduleOptionsButton', function (e) {
        $('#scheduleOptionsModal').modal('show');
    });

    //Clear Shifts Button
    $("#wrapper").on('click', '#clearShiftsButton', function (e) {
        $('.event.shiftBlock').remove();
    });

    //Clear Employees Button
    $("#wrapper").on('click', '#clearEmployeesButton', function (e) {
        $('.employeesScheduled').empty();
    });

    //Clicking on number of shifts inside event div
    $("#wrapper").on('click', '.squishedDisplay.squishedNumEmployees, input.textInputNumEmployees', function (e) {
        var clickID = $(e.target).closest('[id^="event"]').attr("id");
        if ($(e.target).hasClass('squishedNumEmployees')) {
            //alert(clickID);
            $(".squishedNumEmployeesInput").hide();
            $(".squishedNumEmployees").show();
            $(".squishedNumEmployeesInput", "#" + clickID).css({'display': ''});

            $(".squishedNumEmployees", "#" + clickID).css({'display': 'none'});
            $('input.textInputNumEmployees', "#" + clickID).focus();
            //alert($('.squishedDisplay.squishedNumEmployees').html());
            $(".textInputNumEmployees", "#" + clickID).val($('.squishedDisplay.squishedNumEmployees', "#" + clickID).html());
            $(".textInputNumEmployees", "#" + clickID).select();
        }
        else {

        }
    });
    //when user changes the number of employees working for a shift
    $("#wrapper").on('change', 'input.textInputNumEmployees', function (e) {
        var clickID = $(e.target).closest('[id^="event"]').attr("id");
        //alert("change " +$(".textInputNumEmployees", "#"+clickID).val());
        $('.squishedDisplay.squishedNumEmployees', "#" + clickID).html($(".textInputNumEmployees", "#" + clickID).val());
        $('#numOfEmployees', "#" + clickID).html($(".textInputNumEmployees", "#" + clickID).val() + " Shifts");
    });

    //when user clicks away from number of employees working
    //also added a line to Mouse Press function
    $(document).on('click', function (e) {
        if ($(e.target).hasClass('squishedNumEmployees') || $(e.target).hasClass('squishedNumEmployeesInput') || $(e.target).hasClass('textInputNumEmployees')) {

        }
        else {
            //alert("other");

            $(".squishedNumEmployeesInput").css({'display': 'none'});
            $(".squishedNumEmployees").css({'display': ''});
        }

    });
    //when user presses enter to submit number of employees.
    $(document).keypress(function (e) {
        if (e.which == 13) {//Enter button pressed
            if ($(".textInputNumEmployees").is(":focus")) {
                var clickID = $(e.target).closest('[id^="event"]').attr("id");
                //alert(clickID);
                //alert("change " +$(".textInputNumEmployees", "#"+clickID).val());
                $('.squishedDisplay.squishedNumEmployees', "#" + clickID).html($(".textInputNumEmployees", "#" + clickID).val());
                $('#numOfEmployees', "#" + clickID).html($(".textInputNumEmployees", "#" + clickID).val() + " Shifts");
                $(".squishedNumEmployeesInput").css({'display': 'none'});
                $(".squishedNumEmployees").css({'display': ''});
            }
        }

    });

    //checkboxes for displaying and hiding shifts
    $("#wrapper").on('change', ':checkbox', function (e) {
        //alert(e.target.id);
        var checked = $("#" + e.target.id).is(":checked");
        var checkboxShiftType = e.target.id.split("-")[0];
        var eventDivArray = $(".event");

        for (var i = 0; i < eventDivArray.length; i++) {
            if (checked) {
                if ($("#shiftTypeDisplay", "#" + eventDivArray[i].id).html() === checkboxShiftType) {
                    $("#" + eventDivArray[i].id).css({'display': ''});
                }
            }
            else {
                if ($("#shiftTypeDisplay", "#" + eventDivArray[i].id).html() === checkboxShiftType) {
                    $("#" + eventDivArray[i].id).css({'display': 'none'});
                }
            }

        }
        fixOverLappingEventDivs2();

    });
    //console.log("button setup");
    //Function for deleting Event Divs
    $("#createScheduleWrapper").on('click', '.eventDelete', function (e) {
        $(".popover").hide();
        $(this).parent().remove();
        delete eventObjectHashMap[$(this).parent().attr("id")];
        //console.log("delete: " + $(this).parent().attr("id"));
        //console.log("map: " + eventObjectHashMap);
        //console.log("length: " + Object.keys(eventObjectHashMap).length);
        //eventCount--;
        saveShiftsToServer();


        fixOverLappingEventDivs2();
    });

    //Saving Availability
    $("#buttonSaveAvailability").on('click', function (e) {
        saveUnavailabilityToServer();
        //alert();
    });
    $("#buttonSaveShifts").on('click', function (e) {
        saveShiftsToServer();
        saveScheduleToServer();
    });

    //generate Schedule button
    $("#generateSchedule").on('click', function (e) {
        //Save All Shifts First
        //saveShiftsToServer();
        //alert($(".eventBlockInnerDiv.employeesScheduled:not(:empty)").length);
        var currentlyScheduledString = "";
        var tempfullEmployeeArray = fullEmployeeArray.split(";");
        for (var i = 0; i < $(".eventBlockInnerDiv.employeesScheduled:not(:empty)").length; i++) {
            var employeeNameStringArray = $(".eventBlockInnerDiv.employeesScheduled:not(:empty)").eq(i).html().split("<br>");
            var tempEmployeeID = "";
            for (var k = 0; k < employeeNameStringArray.length; k++) {
                if (employeeNameStringArray[k].replace("<br>", "").trim().length > 0) {
                    var employeeFirstName = employeeNameStringArray[k].split(" ")[0];
                    var employeeLastName = employeeNameStringArray[k].split(" ")[1];

                    for (var j = 0; j < tempfullEmployeeArray.length; j++) {//4,Kim,Annie,Annie@test.com;
                        if (employeeFirstName == tempfullEmployeeArray[j].split(",")[2] && employeeLastName == tempfullEmployeeArray[j].split(",")[1]) {
                            tempEmployeeID = tempEmployeeID + tempfullEmployeeArray[j].split(",")[0] + ",";
                        }
                    }
                }

            }

            currentlyScheduledString = currentlyScheduledString + $(".eventBlockInnerDiv.employeesScheduled:not(:empty)").eq(i).parent().attr("id") + ":" + tempEmployeeID + ";";

        }
        //alert(currentlyScheduledString);
        return;
        setTimeout(function () {


        }, 2000);
        //generate schedule

        var tempDate = new Date(year, month - 1, date - (chosenDate.getDay() - (1 - 1)));
        var beginDateString = (tempDate.getMonth() + 1) + "/" + tempDate.getDate() + "/" + (tempDate.getYear() + 1900);
        var tempDate = new Date(year, month - 1, date - (chosenDate.getDay() - (7 - 1)));
        var endDateString = (tempDate.getMonth() + 1) + "/" + tempDate.getDate() + "/" + (tempDate.getYear() + 1900);
        var beginEndDateString = beginDateString + ":" + endDateString;

        //Get Schedule Options
        var scheduleOptions = "";
        if($("#overwriteCurrentSchedule").is(":checked")){
            scheduleOptions = scheduleOptions + "overwriteCurrentSchedule, ";

        }
        if($("#moreThanOneShiftPerDayAllowed").is(":checked")){
            scheduleOptions = scheduleOptions + "moreThanOneShiftPerDayAllowed, ";

        }
        if($("#backToBackOvelapShiftsAllowed").is(":checked")){
            scheduleOptions = scheduleOptions + "backToBackOvelapShiftsAllowed, ";

        }
        //alert(scheduleOptions);

        $.ajax({
            method: "GET",
            url: "/pickupmyshift/application/getGenerateSchedule",
            data: {UserFilledShifts: currentlyScheduledString, beginEndDateString: beginEndDateString, scheduleOptions: scheduleOptions}
        })
            .done(function (msg) {
                //alert( "Data Saved: " + msg );
                var scheduleString = msg.split("***")[0];
                var employeeString = msg.split("***")[1];
                fillEventsWithScheduleFromServer(scheduleString, employeeString);
            });
    });
}

function fillEventsWithScheduleFromServer(schedule, employeeList) {

    $(".eventBlockInnerDiv.employeesScheduled").empty();
    $(".squishedDisplay.employeesScheduled").empty();

    //alert();
    //split schedule from HOST,Day Time;EmployeeID
    var scheduleArray = schedule.split(";");
    var employeeListArray = employeeList.split(";");
    var employeeListMap = {};
    for (var e = 0; e < employeeList.length; e++) {
        if (employeeListArray[e]) {
            //console.log(employeeListArray[e].split(",")[1]);
            employeeListMap[employeeListArray[e].split(",")[0]] = employeeListArray[e].split(",")[1] + "," + employeeListArray[e].split(",")[2];
        }
    }
    //iterate through all shifts to be filled
    for (var i = 0; i < scheduleArray.length; i++) {
        if (scheduleArray[i].length > 0) {
            //console.log(scheduleArray[i]);
            var shiftID = scheduleArray[i].split("=")[0].split(",")[3];
            //console.log($("#" + shiftID).html());
            //console.log(scheduleArray[i].split("=")[1]);
            var htmlString = ""
            var squishedHTML = ""
            for (var e = 0; e < scheduleArray[i].split("=")[1].split(",").length; e++) {
                if (scheduleArray[i].split("=")[1].split(",")[e].trim().length > 0) {
                    if (htmlString.length = 0) {
                        htmlString = employeeListMap[scheduleArray[i].split("=")[1].split(",")[e]].split(",")[0] + " " + employeeListMap[scheduleArray[i].split("=")[1].split(",")[e]].split(",")[1] + "<br>";
                        squishedHTML = employeeListMap[scheduleArray[i].split("=")[1].split(",")[e]].split(",")[0] + ". " + employeeListMap[scheduleArray[i].split("=")[1].split(",")[e]].split(",")[1] + "<br>";
                    }
                    else {
                        htmlString = htmlString + employeeListMap[scheduleArray[i].split("=")[1].split(",")[e]].split(",")[0] + " " + employeeListMap[scheduleArray[i].split("=")[1].split(",")[e]].split(",")[1] + "<br>";
                        squishedHTML = squishedHTML + employeeListMap[scheduleArray[i].split("=")[1].split(",")[e]].split(",")[0] + ". " + employeeListMap[scheduleArray[i].split("=")[1].split(",")[e]].split(",")[1] + "<br>";
                    }


                }

            }
            //console.log(squishedHTML);
            $(".eventBlockInnerDiv.employeesScheduled", "#" + shiftID).html(htmlString);
            $(".squishedDisplay.employeesScheduled", "#" + shiftID).html(squishedHTML);


        }

    }

}
function updateDayLabelBlockYCoordinate() {

    if($("#weekViewButton").hasClass('active')){
        dayLabelBlockYCoordinate = $("#Suntb" + (startTimeHour.length < 2 ? "0" + startTimeHour : startTimeHour) + startTimeMin).offset().top;

    }
    else if($("#dayViewButton").hasClass('active')){
        //consolelog($("#dayViewDateLabel").html().substring(0,3));
        var dayTemp = $("#dayViewDateLabel").html().substring(0,3);
        dayLabelBlockYCoordinate = $("#DAYVIEW" + dayTemp + "tb" + (startTimeHour.length < 2 ? "0" + startTimeHour : startTimeHour) + startTimeMin).offset().top;
    }
    //console.log(dayLabelBlockYCoordinate);
}
function updateTimeBlockHeightAndWidth() {
    if($("#weekViewButton").hasClass('active')){
        timeBlockHeight = $("#Suntb" + (startTimeHour.length < 2 ? "0" + startTimeHour : startTimeHour) + startTimeMin).outerHeight();
        timeBlockWidth = $("#Suntb" + (startTimeHour.length < 2 ? "0" + startTimeHour : startTimeHour) + startTimeMin).outerWidth();

    }
    else if($("#dayViewButton").hasClass('active')){
        var dayTemp = $("#dayViewDateLabel").html().substring(0,3);
        timeBlockHeight = $("#DAYVIEW" + dayTemp + "tb" + (startTimeHour.length < 2 ? "0" + startTimeHour : startTimeHour) + startTimeMin).outerHeight();
        timeBlockWidth = $("#DAYVIEW" + dayTemp + "tb" + (startTimeHour.length < 2 ? "0" + startTimeHour : startTimeHour) + startTimeMin).outerWidth();

    }
    //console.log(timeBlockHeight);
}
function createEventDivContainer(eventObject) {
    //$("#" + newDivHomeBlock).append("<div class='" + eventCSSClass + " draggable resizable' id='event" + startClickBlockID.substring(0,3) + eventCount + "' " +
    //"style= 'width:" + defaultEventDivWidthSpace + "%; height:" + 0 + "px; background-color:" + eventTypeColor + "'>" + "</div>");
    //console.log("create: " + eventObject);
    if($("#weekViewButton").hasClass('active')){
        $("#" + eventObject.getStartBlockID()).append("<div class='" + eventObject.CSSClass + " draggable resizable ' id='" + eventObject.eventID + "' " +
            "style= 'width:" + eventObject.defaultEventWidth + "%; height:" + eventObject.divHeight + "px; background-color:" + eventObject.eventTypeColor() + "'>" + "</div>");
    }
    else if($("#dayViewButton").hasClass('active')){
        $("#" + eventObject.getStartBlockID()).append("<div class='" + eventObject.CSSClass + " draggable resizable ' id='" + eventObject.eventID + "' " +
            "style= 'width:" + eventObject.defaultEventWidth + "%; height:" + eventObject.divHeight + "px; background-color:" + eventObject.eventTypeColor() + "'>" + "</div>");
    }
    else if($("#monthViewButton").hasClass('active')){
        $("#" + eventObject.getStartBlockID()).append("<div class='" + "event" + " shiftBlockMonthView draggable ' id='" + eventObject.eventID + "' " +
            "style= 'width:" + eventObject.defaultEventWidth + "%; height:" + "20" + "px; background-color:" + eventObject.eventTypeColor() + "'>" + "</div>");

    }



}

function createEventDetails(eventObject) {
    if ($("#weekViewButton").hasClass('active') || $("#dayViewButton").hasClass('active') ) {
        newEventDate = $("#" + eventObject.getStartBlockID()).closest('table').find('thead').find('tr').find('td').eq($("#" + eventObject.getStartBlockID()).index()).find(".hiddenDate").html();
        //consolelog("set details: " + eventObject.eventID);

        eventObject.setDateObject(newEventDate);

        $("#" + eventObject.eventID).append("" +
            "<div class='eventBlockInnerDiv'>" +
            "<span class='insideEventBlock'  id='shiftTypeDisplay' >" + eventObject.shiftType + "</span> " +
            "</div>" +
            "<div class='eventBlockInnerDiv'>" +
            "<small>" +
            "<span class='insideEventBlock' id='formattedTimeDisplay' >" + eventObject.getFormattedTime() + "</span> " +
            (whichPage == "schedule" ? "<br><span class='insideEventBlock' id='numOfEmployees'>" + eventObject.numberOfShifts + " </span> " : "") +
            "</small>" +
            "</div>" +
            "<span class='insideEventBlock eventBlockInnerDiv' id='notesDisplay'>" + eventObject.notesString() + "</span> " +
            "<div class='insideEventBlock eventBlockInnerDiv employeesScheduled'>" + eventObject.employeesScheduled + "</div> " +
            "<span class='unformattedTime' id='unformattedTime'  style='display:none'>" + eventObject.getUnformattedTime() + "</span> " +
            "<span class='eventDate'  style='display:'>" + eventObject.formattedDate() + "</span> " +
            "<span id='createdInTimeBlock' style='display:none'>" + eventObject.startBlockID + "</span> " +
            "<span class='eventShiftType' id='shiftType' style='display:none'>" + eventObject.shiftType + "</span> " +
            "<span id='weightOfDiv' style='display:none'>" + 0 + "</span> " +
            (whichPage == "schedule" ?
                ("<div class='squishedDisplay squishedShiftType' style='display:none'>" + eventObject.shiftType.substring(0, 1) + "</div> " +
                    "<div class='squishedNumEmployeesInput' style='display:none'> <input type='text' class='textInputNumEmployees ' name='numEmployeesInput' value='" + eventObject.numberOfShifts + "' style=' font-size:13px; width:30px;'> </div> " +
                    "<div class='squishedDisplay squishedNumEmployees' style='display:none'>" + eventObject.numberOfShifts + "</div> " +

                    "<div class='squishedDisplay employeesScheduled' style='display:none;'>" + eventObject.numberOfShifts + "</div> "
                ) : "") +
            "<div class='weeklyShift' style='display:'>" + eventObject.weeklyOrOneTime + "</div> " +
            "<button type='button' class='close eventDelete' aria-label='Close' style='position:absolute; top:0; right:0;'><span aria-hidden='true'>&times;</span></button>" +
            "<span id='startBlockNumber' style='display:none'>0</span> " +
            "<span id='endBlockNumber' style='display:none'>0</span> ");
    }
    else if ($("#monthViewButton").hasClass('active') ){
        $("#" + eventObject.eventID).append("" +
            "<div class='monthEventInnerWrapper insideEventBlock'>" +
            "<span class='monthViewEventInnerDiv insideEventBlock'  id='shiftTypeDisplay' >" + eventObject.numberOfShifts + " " + eventObject.shiftType + " " + eventObject.getFormattedTime()+ "</span> " +
            "</div>");

    }
}

function createEventDetailsMonthView(eventID) {

}

function updateEventTimeDivs(eventObject, botY) {
    //$("#unformattedTime", eventID).html(startClickBlockID.substring(0,3) + " " + calculateTimeFromPosition(currentDragOrResizeXCoordinate, startClickYCoordinate, currentDragOrResizeBottomYCoordinate));
    //$("#formattedTimeDisplay", eventID).html(calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, startClickYCoordinate, currentDragOrResizeBottomYCoordinate));
    //console.log("event Bottom: " + botY);
    //console.log(calculateTimeFromPosition(topX, topY, botY));

    //$("#unformattedTime", eventID).html(dayOfWeek + " " + calculateTimeFromPosition(topX, topY, botY));
    $("#unformattedTime", "#"+ eventObject.eventID).html(eventObject.getUnformattedTime(botY));
    //$("#formattedTimeDisplay", eventObject.eventID).html(calculateTimeFromPositionFormatted(topX, topY, botY));
    $("#formattedTimeDisplay", "#" + eventObject.eventID).html(eventObject.getFormattedTime(botY));

}
function mouseLeavingCalendarAreaFunction() {
    $("#wrapper").on('mouseleave', function (e) {
        $("#wrapper").disableSelection();
        $(document.documentElement).disableSelection();
    });
}
function windowResizeFunction() {
    //ON WINDOW RESIZE FUNCTION
    var resizeTimeout;
    $(window).on('resize', function (e) {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function () {
            if (e.target == window) {
                if(window.location.pathname.indexOf("pickupmyshift/application/scheduleView") >= 0){
                    tdHeight = $(window).height()/monthRows;
                    $('.calendarCell timeBlock').height(tdHeight);

                    dayRows = $(".timeColumnDAYVIEW").length;
                    tdHeight = $(window).height()/dayRows;
                    //console.log(tdHeight);
                    $('.dayViewTR').height(tdHeight);
                }
                $(".draggable").each(function () {

                    var resizeEndBlock = $("#unformattedTime", "#" + $(this).attr("id")).html().substring(0, 3) + "tb" + $("#unformattedTime", "#" + $(this).attr("id")).html().substring(11, 15)
                    var resizeStartBlock = $("#unformattedTime", "#" + $(this).attr("id")).html().substring(0, 3) + "tb" + $("#unformattedTime", "#" + $(this).attr("id")).html().substring(4, 8)
                    //console.log($("#" + resizeEndBlock).offset().top + ", " + resizeStartBlock);
                    $(this).height($("#" + resizeEndBlock).offset().top - $("#" + resizeStartBlock).offset().top);

                });
            }
        }, 0);


    });
}
function pauseEvent(e) {
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
    e.cancelBubble = true;
    e.returnValue = false;
    return false;
}
function saveUnavailabilityToServer() {
    var tempString = "";
    for (var i = 0; i < $(".event").length; i++) {
        tempString = tempString + $(".event").eq(i).find("#unformattedTime").html() + "," +
            $(".event").eq(i).find("#shiftType").html() + "," +
            $(".event").eq(i).find("#notesDisplay").html().replace(/,/g, "/comma/").replace(/;/g, "/apostrophe/") + "," +
            $(".event").eq(i).find("div.weeklyShift").html() + "," +
            ($(".event").eq(i).find("div.weeklyShift").html().indexOf("weekly") > -1 ? "weekly" : $(".event").eq(i).find("span.eventDate").html()) + ";"


    }

    //alert(tempString);
    $.ajax({
        method: "POST",
        url: "/pickupmyshift/application/saveAvailability",
        data: {Unavailability: tempString}
    })
        .done(function (msg) {
            //alert("Data Saved: " + msg);
            $("#saveSuccess").css("display", "inline");
            $('#saveSuccess').delay(5000).fadeOut(400)
        });
}
function saveShiftsToServer() {
    var tempDate = new Date(year, month - 1, date - (chosenDate.getDay() - (1 - 1)));
    var beginDateString = (tempDate.getMonth() + 1) + "/" + tempDate.getDate() + "/" + (tempDate.getYear() + 1900);
    var tempDate = new Date(year, month - 1, date - (chosenDate.getDay() - (7 - 1)));
    var endDateString = (tempDate.getMonth() + 1) + "/" + tempDate.getDate() + "/" + (tempDate.getYear() + 1900);
    var beginEndDateString = beginDateString + ":" + endDateString;

    var tempString = "";
    //for (var i = 0; i < $(".event").length; i++) {
    //  //console.log($(".event").get(i).id);
    //    //console.log(tempString);
    //    tempString = tempString +
    //        $(".event").get(i).id + "," +
    //        $(".event").eq(i).find("#unformattedTime").html() + "," +
    //        $(".event").eq(i).find("#shiftType").html() + "," +
    //        $(".event").eq(i).find("#numOfEmployees").html() + "," +
    //        $(".event").eq(i).find("#notesDisplay").html().replace(/,/g, "/comma/").replace(/;/g, "/apostrophe/") + "," +
    //        $(".event").eq(i).find("div.weeklyShift").html() + "," +
    //        //($(".event").eq(i).find("div.weeklyShift").html().indexOf("weekly") > -1 ? "weekly" : $(".event").eq(i).find("span.eventDate").html()) + ";"
    //    $(".event").eq(i).find("span.eventDate").html() + ";"
    //}


    var keys = [];
    for (var key in eventObjectHashMap) {

        tempString = tempString + eventObjectHashMap[key].eventDBString + ";";
        //console.log(eventObjectHashMap[key].eventDBString);
    }

    //console.log(eventObjectHashMap);
    //alert(tempString);
    $.ajax({
        method: "POST",
        url: "/pickupmyshift/application/saveShifts",
        data: {Shifts: tempString, beginEndDateString: beginEndDateString}
    })
        .done(function (msg) {
            //alert( "Data Saved: " + msg );
            //$("#saveSuccess").css("display", "inline");
            //$('#saveSuccess').delay(5000).fadeOut(400)
        });
}
function saveScheduleToServer() {
    var tempDate = new Date(year, month - 1, date - (chosenDate.getDay() - (1 - 1)));
    var beginDateString = (tempDate.getMonth() + 1) + "/" + tempDate.getDate() + "/" + (tempDate.getYear() + 1900);
    var tempDate = new Date(year, month - 1, date - (chosenDate.getDay() - (7 - 1)));
    var endDateString = (tempDate.getMonth() + 1) + "/" + tempDate.getDate() + "/" + (tempDate.getYear() + 1900);
    var beginEndDateString = beginDateString + ":" + endDateString;

    var tempString = "";
    for (var i = 0; i < $(".event").length; i++) {
        if ($(".event").eq(i).find(".eventBlockInnerDiv.employeesScheduled").is(':empty')) {

        }
        else {
            //console.log($(".event").get(i).id);
            tempString = tempString +
                $(".event").get(i).id + "," +
                $(".event").eq(i).find("#unformattedTime").html() + "," +
                $(".event").eq(i).find("#shiftType").html() + "," +
                $(".event").eq(i).find("#numOfEmployees").html() + "," +
                $(".event").eq(i).find(".eventBlockInnerDiv.employeesScheduled").html().replace(/<br ?\/?>/g, "-") + "," +
                $(".event").eq(i).find("#notesDisplay").html().replace(/,/g, "/comma/").replace(/;/g, "/apostrophe/") + "," +
                $(".event").eq(i).find("div.weeklyShift").html() + "," +
                $(".event").eq(i).find("span.eventDate").html() + ";"
        }


    }

    //alert(tempString);
    $.ajax({
        method: "POST",
        url: "/pickupmyshift/application/saveSchedule",
        data: {Schedule: tempString, beginEndDateString: beginEndDateString}
    })
        .done(function (msg) {
            //alert( "Data Saved: " + msg );
            $("#saveSuccess").css("display", "inline");
            $('#saveSuccess').delay(5000).fadeOut(400)
        });
}
function saveShiftDetailModalbackup() {
    //console.log($("#endTimeModal").val());
    if($("#endTimeModal").val() == "none" || $("#endTimeModal").val() == "none"){

    }
    else {

        var editingEventID = $("#currentlyEditingEventID").html();
        //console.log(editingEventID);
        //alert($("#shiftTypeDropDownColorBoxModal").css('background-color'));
        $("#" + editingEventID).css('background-color', $("#shiftTypeDropDownColorBoxModal").css('background-color'));
        //$("#currentlyEditingEventID").css('background-color', "" + newBackgroundColor + "");

        /////////////////////////////////////////////////
        //change day if different day
        newDivHomeBlock = $("#daySelector").val().substring(0, 3) + "tb" + ($("#startTimeModal").val().length != 4 ? "0" + $("#startTimeModal").val() : $("#startTimeModal").val());
        newDivEndBlock = $("#daySelector").val().substring(0, 3) + "tb" + ($("#endTimeModal").val().trim().length != 4 ? "0" + $("#endTimeModal").val().trim() : $("#endTimeModal").val().trim());
        //alert(editingEventID);
        //alert($("#endTimeModal").val().trim());
        newDivID = editingEventID;
        //alert($("#endTimeModal").val().trim() == ""+endTimeHour + endTimeMin);

        //If event is at the end of the day
        if ($("#endTimeModal").val().trim() == "" + endTimeHour + endTimeMin) {
            var tempEndNum = "" + endTimeHour + endTimeMin;
            tempEndNum = tempEndNum - timeInterval;
            //alert(tempEndNum);

            newDivEndBlock = $(".timeBlock.Sunday").last().attr("id");
            newDivHeight = ($("#" + newDivEndBlock).offset().top + $("#" + newDivEndBlock).outerHeight() - 2) - $("#" + newDivHomeBlock).offset().top;
        }
        else {
            newDivHeight = $("#" + newDivEndBlock).offset().top - $("#" + newDivHomeBlock).offset().top;
        }
        //////////////////////////////////////
        newResizableText = $("#unformattedTime", "#" + editingEventID).html();
        newNumOfEmployees = $("#numOfEmployeesInputModal").val() + " Shifts";
        newDisplayText = $("#shiftTypeDisplay", "#" + editingEventID).html();
        newFormattedText = $("#formattedTimeDisplay", "#" + editingEventID).html();
        newShiftType = $("#shiftType", "#" + editingEventID).html();
        newNotesDisplay = $("#shiftNotesModal").val();
        newSquishedEmployees = "";
        newEmployees = "";
        newWeeklyShift = $('input[name=weeklyRadioButton]:checked').val();

        if ($('input[name=weeklyRadioButton]:checked').val() == "oneTime") {
            var dayTemp = newResizableText.substring(0, 3);
            var tempDate = new Date(year, month - 1, date - (chosenDate.getDay() - (daysOfWeekAbrev.indexOf(dayTemp) - 1)));

            newEventDate = tempDate.getMonth() + 1 + "/" + tempDate.getDate() + "/" + (tempDate.getYear() + 1900);
        }
        else {
            var dayTemp = newResizableText.substring(0, 3);
            var tempDate = new Date(year, month - 1, date - (chosenDate.getDay() - (daysOfWeekAbrev.indexOf(dayTemp) - 1)));

            newEventDate = tempDate.getMonth() + 1 + "/" + tempDate.getDate() + "/" + (tempDate.getYear() + 1900);
        }


        newBackgroundColor = $("#" + editingEventID).css('background-color');
        $("#" + editingEventID).remove();
        //alert(newDivEndBlock);
//    $("#" + newDivHomeBlock ).append("<div class='" + eventCSSClass + " draggable resizable ' id='" + newDivID + "' " +
//	    "style= 'width:90%; height:" + newDivHeight + "px'>" + "</div>");
        createEventDivContainer(newDivHomeBlock);
        createEventDetails(newDivID);
//    $("#"+ newDivID).append("" +
//	    "<div class='eventBlockInnerDiv'>" +
//
//	    "<span class='insideEventBlock'  id='shiftTypeDisplay' >" + newDisplayText + "</span> " +
//	    "</div>" +
//	    "<div class='eventBlockInnerDiv'>" +
//	    	"<small>" +
//	    	"<span class='insideEventBlock' id='formattedTimeDisplay' >" +
//	    		newFormattedText +
//	    		"</span> " +
//	    		"<br><span class='insideEventBlock' id='numOfEmployees'>" + (newNumOfEmployees > 1 ? newNumOfEmployees + " Shifts" : newNumOfEmployees + " Shift") + "</span> " +
//	    	"</small>" +
//	    "</div>" +
//	    "<span class='insideEventBlock' id='notesDisplay'>" + newNotes + "</span> " +
//	    "<span id='unformattedTime'  style='display:none'>" + newResizableText.substring(0,3) + " " + ($("#startTimeModal").val().trim().length !=4 ? "0" + $("#startTimeModal").val().trim() : $("#startTimeModal").val().trim()) + " - "  +  ($("#endTimeModal").val().trim().length !=4 ? "0" + $("#endTimeModal").val().trim() : $("#endTimeModal").val().trim()) + "</span> " +
//	    "<span id='createdInTimeBlock' style='display:none'>" + newDivHomeBlock + "</span> " +
//	    "<span id='shiftType' style='display:none'>" + newShiftType + "</span> " +
//	    "<span id='weightOfDiv' style='display:none'>" + 0 + "</span> " +
//	    "<button type='button' class='close eventDelete' aria-label='Close' style='position:absolute; top:0; right:0;'><span aria-hidden='true'>&times;</span></button>" +
//	    "<span id='startBlockNumber' style='display:none'>0</span> " +
//    	    "<span id='endBlockNumber' style='display:none'>0</span> ");
        $("#" + newDivID).css('background-color', "" + newBackgroundColor + "");
        draggableFunction();
        resizableFunction();
        currentDragOrResizeXCoordinate = $("#" + newDivID).offset().left;
        currentDragOrResizeYCoordinate = $("#" + newDivHomeBlock).offset().top;
        currentDragOrResizeYCoordinate = currentDragOrResizeYCoordinate + (timeBlockHeight / 2);
        //If event is at the end of the day

        if ($("#endTimeModal").val().trim() == "" + endTimeHour + endTimeMin) {
            currentDragOrResizeBottomYCoordinate = ($("#" + newDivEndBlock).offset().top + $("#" + newDivEndBlock).outerHeight()) - 4;
        }
        else {
            currentDragOrResizeBottomYCoordinate = ($("#" + newDivEndBlock).offset().top) - 4;
        }
        //////////////////////////////////////

        $("#unformattedTime", "#" + newDivID).html($("#daySelector").val().substring(0, 3) + " " + calculateTimeFromPosition(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
        $("#formattedTimeDisplay", "#" + newDivID).html(calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
        //alert(calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
        ////////////////////////////////////////////////////////

        //Get employees change
        var stringTemp = "";
        for (var i = 0; i < $(".working").length; i++) {
            stringTemp = stringTemp + $(".working").get(i).id + "<br>"
        }
        $(".employeesScheduled", "#" + newDivID).html(stringTemp);
        ///////////////////////////////////////////////
        $('#myModal').modal('hide');
        fixOverLappingEventDivs2();
    }

}
function convertOneTimeShiftToWeekly(eventObject){
    for(var i = 0; i < 7; i++){
        var tempEventObject = jQuery.extend(true, {}, eventObject);

        tempEventObject.dateObject.setDate(tempEventObject.dateObject.getDate() + 7);
        tempEventObject.eventID = "weekly" + tempEventObject.formattedDateNoDelimit() +  eventObject.eventID;
        createEventDivContainer(tempEventObject);
        createEventDetails(tempEventObject);
        //if employees scheduled... save to db
    }
}
function saveShiftDetailModal() {
    if(validateShiftDetailModal()){


        eventObject.shiftType = $("#shiftTypeDropdownTextModal").html();
        //console.log($("#datePicker").val());
        eventObject.setDateObject($("#datePicker").val());
        var tempStart = $("#startTimeModal").val();
        if(tempStart.length < 4){
            tempStart = "0" + tempStart;
        }
        var tempEnd = $("#endTimeModal").val();
        if(tempEnd.length < 4){
            tempEnd = "0" + tempEnd;
        }
        eventObject.eventDBString = eventObject.eventID + "," + eventObject.dayOfEvent().substring(0,3) + " " + tempStart +
            " - " + tempEnd + "," + $("#shiftTypeDropdownTextModal").html() + "," + $("#numOfEmployeesInputModal").val() + "," +
            $("#shiftNotesModal").val() + "," + $('input[name=weeklyRadioButton]:checked').val() + "," + $("#datePicker").val();
        //console.log(eventObject.eventDBString);
        eventObject.numberOfShifts=$("#numOfEmployeesInputModal").val();
        eventObject.weeklyOrOneTime = $('input[name=weeklyRadioButton]:checked').val();
        var stringTemp = "";
        for (var i = 0; i < $(".working").length; i++) {
            stringTemp = stringTemp + $(".working").get(i).id + "<br>"
        }
        eventObject.employeesScheduled = stringTemp;


        $("#" + eventObject.eventID).remove();
        createEventDivContainer(eventObject);
        createEventDetails(eventObject);
        //console.log(eventObject.weeklyOrOneTime);
        if(eventObject.weeklyOrOneTime == "weekly" && $("#monthViewButton").hasClass('active')){
            convertOneTimeShiftToWeekly(eventObject);



        }
        $('#myModal').modal('hide');
        //console.log("Pass");
        saveShiftsToServer();
        if(newEventInCreationProcess){
            newEventInCreationProcess= false;
            eventObjectHashMap[eventObject.eventID] = eventObject;
            eventCount++;
        }

    }
    else{
        //alert("Did not pass");
    }

}
function validateShiftDetailModal(){
    //console.log(newEventInCreationProcess);
    var passValidation = true;
    var focusID = "";
    $(".has-error").each(function( index ) {
        $( this ).removeClass("has-error");
    });
    //in reverse order so focus will be on first iterm
    if(!$.isNumeric($("#numOfEmployeesInputModal").val())){
        $("#num0fEmployeesInputModal").addClass("has-error");
        passValidation = false;
        $("#num0fEmployeesInputModal").focus();
        focusID = "#num0fEmployeesInputModal";
    }
    if( $("#endTimeModal").val() == "none"){
        $("#endTimeInputModalDiv").addClass("has-error");
        passValidation = false;
        $("#endTimeModal").focus();
        focusID = "#endTimeModal";
    }
    if($("#startTimeModal").val() == "none"){
        $("#startTimeInputModalDiv").addClass("has-error");
        passValidation = false;
        $("#startTimeModal").focus();
        focusID = "#startTimeModal";
    }
    if(focusID.length > 0){
        setTimeout(function(){
            $(focusID).focus();
            //console.log("focused")
        }, 500);
    }




    return passValidation;
    //if(katween love chris,)
    //    $chris should make $$
    //then(katlen is :)
    //if katween is happy;
    //then chris is #happywifehappylife
    //

}
function fillInShiftDetailModalFields(eventObj) {
    //$('.modal-body').html("boo");
    //set shift and color
    //console.log(newEventInCreationProcess);
    //if(newEventInCreationProcess){
    //    $("#startEndTimeInputModal").toggleClass("has-error");
    //}
    //EVENTID,DAY HHMM - HHMM,SERVER,1,NOTES,weekly/oneTime,01/01/2015;
    $(".has-error").each(function( index ) {
        $( this ).removeClass("has-error");
    });
    $( "#datePicker" ).datepicker({
        showButtonPanel: true
    });
    //console.log(eventObj);
    $("#datePicker").val(eventObj.formattedDate());
    $("#currentlyEditingEventID").html(eventObj.eventID);
    $("#shiftTypeDropdownTextModal").html(eventObj.shiftType);
    //
    $("#shiftTypeDropDownColorBoxModal").css("background-color", eventObj.eventTypeColor());

    $("#daySelector").val(eventObj.dayOfEvent());

    if (eventObj.numberOfShifts > 0) {
        $("#numOfEmployeesInputModal").val(eventObj.numberOfShifts);
    }
    else {
        $("#numOfEmployeesInputModal").val("-");
    }

    //CHECKING EMPLOYEES THAT ARE WORKING////NEEEDS WORRRKK
    $(".scheduledEmployeeModal").removeClass("working");
    $(".glyphicon").css({'display': 'none'});
    $("#scheduledEmployeeDropdownTextModal").html("None");

    //if employees are scheduled check them and show them in modal
    if (eventObj.employeesScheduled.length > 0) {
        var employeeNameArray = eventObj.employeesScheduled.trim().split("<br>");
        var stringTemp = ""
        for (var i = 0; i < employeeNameArray.length; i++) {
            if (employeeNameArray[i].trim().length > 0) {
                stringTemp = stringTemp + employeeNameArray[i] + ", ";
                $("a[id='" + employeeNameArray[i] + "']").toggleClass("working");
                $(".glyphicon", "a[id='" + employeeNameArray[i] + "']").css({'display': ''});
            }
        }

        stringTemp = stringTemp.trim();
        if (stringTemp[stringTemp.length - 1] == ",") {
            stringTemp = stringTemp.substring(0, stringTemp.length - 1)
        }
        $("#scheduledEmployeeDropdownTextModal").html(stringTemp);
    }
    //////////////////////////////NEEEEDSS WORK

    $("#shiftNotesModal").val(eventObj.notesString());

    if (eventObj.weeklyOrOneTime == "weekly") {
        $("#weeklyRadioButton").prop("checked", true);
    }
    else {
        $("#oneTimeRadioButton").prop("checked", true);
    }
    //console.log(newEventInCreationProcess);
    if(newEventInCreationProcess) {
        //console.log("Set times to none");
        $("#startTimeModal").val('none');
        $("#endTimeModal").val('none');
    }
    else{
        //alert($("#formattedTimeDisplay", "#"+e.target.id).html().substring(0,4) + " " + $("#formattedTimeDisplay", "#"+e.target.id).html().substring(4,6));
        var stringFormatTime = eventObj.getUnformattedTime();
        //console.log("time: " + stringFormatTime);
        //DAY HHMM - HHMM
        //012345678901234
        var tempStringStart = (parseInt(stringFormatTime.substring(4, 6)) > 12 ? parseInt(stringFormatTime.substring(4, 6)) - 12 : parseInt(stringFormatTime.substring(4, 6))) + ":" +
            stringFormatTime.substring(6, 8) + " " + (parseInt(stringFormatTime.substring(4, 6)) >= 12 ? "PM" : "AM");
        var tempStringEnd = (parseInt(stringFormatTime.substring(11, 13)) > 12 ? parseInt(stringFormatTime.substring(11, 13)) - 12 : parseInt(stringFormatTime.substring(11, 13))) + ":" +
            stringFormatTime.substring(13, 15) + " " + (parseInt(stringFormatTime.substring(11, 13)) >= 12 ? "PM" : "AM");
        //alert(tempStringEnd);
        $('[id=startTimeModal]  option').filter(function () {
            return ($(this).text() == tempStringStart); //To select Blue
        }).prop('selected', true);

        $('[id=endTimeModal]  option').filter(function () {
            return ($(this).text() == tempStringEnd); //To select Blue
        }).prop('selected', true);
    }
    validateShiftDetailModal();
}
var startTimeTest = new Date().getTime();
var endTimeTest = new Date().getTime();
//console.log("duration: " + (endTimeTest - startTimeTest));
var initialWeight;
function fixOverLappingEventDivs2() {
    //console.log("fixing");

    var eventTimeMap = {}; //contains timeblock ids as keys and event div ids as values
    var timeBlockArray = $(".timeBlock.Sunday");
    //loop through all event divs and builds a log of timeblocks and the event divs in them
    var eventDivArray = $(".event:visible");
    //ensure eventDivArray is always ordered by event number.
    eventDivArray = eventDivArray.sort(function (a, b) {
        return parseInt(a.id.slice(8)) - parseInt(b.id.slice(8))
    });
    var weightOfDivsMap = {}; //holds weights for each div (divID -> weight)


    //console.log("Event Div Array: " + eventDivArray.toString());
    for (var i = 0; i < eventDivArray.length; i++) {

        //console.log("i = " + i);
        //console.log("eventDivArray[i].id = " + eventDivArray[i].id.substring(8));
        //console.log(shiftTypes);
        if (whichPage == "schedule") {
            for (var s = 0; s < shiftTypes.split(",").length; s++) {
                if (shiftTypes.split(",")[s].split(" ")[0] === $("#shiftType", "#" + eventDivArray[i].id).html()) {

                    initialWeight = 2400 - parseInt($(".unformattedTime", "#" + eventDivArray[i].id).html().substring(4, 8));
                    initialWeight = initialWeight + (shiftTypes.split(",").length - (s));
                    weightOfDivsMap[eventDivArray[i].id] = initialWeight;
                }
            }
        }

        if (eventDivArray[i].id && $("#" + eventDivArray[i].id).html().length > 0) {
            var eventTime = $("#unformattedTime", "#" + eventDivArray[i].id).html().substring(4, 15);
            var eventDay = $("#unformattedTime", "#" + eventDivArray[i].id).html().substring(0, 3);
        }
        else {
            continue;
        }
        //loop through all time blocks

        for (var t = 0; t < timeBlockArray.length; t++) {
            var currentTimeBlock = parseInt(timeBlockArray[t].id.substring(5, 9));
            if (currentTimeBlock >= eventTime.substring(0, 4) && currentTimeBlock < eventTime.substring(6, 11)) {
                var timeBlockIDString = (eventDay + timeBlockArray[t].id.substring(3, 9)).toString();
                if (timeBlockIDString in eventTimeMap) {
                    var tempString = eventTimeMap[timeBlockIDString];
                    eventTimeMap[timeBlockIDString] = tempString + "," + eventDivArray[i].id;
                }
                else {
                    eventTimeMap[timeBlockIDString] = eventDivArray[i].id;
                }

                //console.log("divs in " + eventDay + $(".timeBlock.Sunday").get(t).id.substring(3,9) + ": " + eventTime);
                //console.log(eventTimeMap[timeBlockIDString]);
            }
        }

    }
    //console.log(JSON.stringify(eventTimeMap));


    //width of div is determined by the max number of collisions
    //left position of div is determined by the weight of the div (height)
    var array_keys = new Array(); // array of timeblocks with event divs
    var array_values = new Array(); // array of event divs comma separated in timeblocks (eventSun0,eventSun1,eventSun2)
    for (var key in eventTimeMap) {
        array_keys.push(key);
        array_values.push(eventTimeMap[key]);
    }
    //console.log("Array of Values: " + JSON.stringify(array_values));
    //console.log("Array of Values: " + JSON.stringify(array_keys));

    //calculate the weight for each div (used for left position, determined by height of div)
    var weight = 1;
    for (var line = 0; line < array_values.length; line++) {
        for (var d = 0; d < array_values[line].split(",").length; d++) {
            if (array_values[line].split(",")[d] in weightOfDivsMap) {
                var tempWeight = weightOfDivsMap[array_values[line].split(",")[d]] + weight;

                /*
                 for(var s= 0; s<shiftTypes.split(",").length; s++){
                 if(shiftTypes.split(",")[s].split(" ")[0] === $("#shiftType", "#"+eventDivArray[array_values[line].split(",")[d]].id).html()    ){
                 tempWeight = tempWeight * ((shiftTypes.split(",").length-(s)) * 100);
                 //alert(tempWeight);
                 }
                 }*/

                weightOfDivsMap[array_values[line].split(",")[d]] = parseInt(tempWeight);
                //console.log("Arras: " + array_values[line].split(",")[d]);
            }
            else {//weightOfDivsMap doesn't have this div
                //alert(shiftTypes);
                /*
                 if(shiftTypes.length > 0){

                 for(var s= 0; s<shiftTypes.split(",").length; s++){
                 if(shiftTypes.split(",")[s].split(" ")[0] === $("#shiftType", "#"+eventDivArray[array_values[line].split(",")[d]].id).html()    ){
                 weightOfDivsMap[array_values[line].split(",")[d]] = (shiftTypes.split(",").length-(s)) * 100 ;
                 }
                 }
                 }*/


            }
        }
    }
    //console.log(JSON.stringify(weightOfDivsMap));
    for (var i = 0; i < eventDivArray.length; i++) {
    }

    //Calculate the collisions for each div
    var maxCollisionMap = {}; //holds  max collisions for each div Num (divNumber -> maxCollisions)
    var maxCollisionListMap = {} //holds list of divs for the max collision (divNumber -> list of divs during max collision (0,1,2))
    for (var line = 0; line < array_values.length; line++) {
        for (var d = 0; d < array_values[line].split(",").length; d++) {
            if (array_values[line].split(",")[d] in maxCollisionMap) {
                var tempMax = maxCollisionMap[array_values[line].split(",")[d]];
                if (array_values[line].split(",").length > tempMax) {
                    maxCollisionMap[array_values[line].split(",")[d]] = array_values[line].split(",").length;
                    maxCollisionListMap[array_values[line].split(",")[d]] = array_values[line];
                }


            }
            else {
                maxCollisionMap[array_values[line].split(",")[d]] = array_values[line].split(",").length;
                maxCollisionListMap[array_values[line].split(",")[d]] = array_values[line];
            }

        }
    }
    //console.log(JSON.stringify(maxCollisionMap));
    //console.log(JSON.stringify(maxCollisionListMap));

    //Adjust Widths
    var totalParentSpace = 90;
    var divWidthsMap = {}
    for (var key in maxCollisionMap) {
        var remainingParentSpace = totalParentSpace;
        var tempCollisions = maxCollisionMap[key];
        for (var z = 0; z < maxCollisionListMap[key].split(",").length; z++) {//loop through other collision divs to check if they collided with more elsewhere
            //console.log("z: " + z);
            var otherCollisionDiv = maxCollisionListMap[key].split(",")[z];
            if (maxCollisionMap[otherCollisionDiv] > maxCollisionMap[key]) { //if other div collided with more elsewhere, it will be smaller width than expected
                var otherDivWidth = totalParentSpace / maxCollisionMap[otherCollisionDiv];
                remainingParentSpace = remainingParentSpace - otherDivWidth;
                tempCollisions--;
            }
        }
        var divWidth = remainingParentSpace / tempCollisions;
        if($("#dayViewButton").hasClass('active') && maxCollisionListMap[key].split(",").length ==1){
            divWidth = 45;
        }
        else{

        }
        $("#" + key).css("width", divWidth + "%");

        divWidthsMap[key] = divWidth;
    }

    //Set initial Left Positions
    //console.log("maxCollisionListMap: " + JSON.stringify(maxCollisionListMap));
    var divLeftsMap = {}
    for (var key in maxCollisionListMap) {
        var tempCollisionArray = maxCollisionListMap[key].split(",");

        tempCollisionArray.sort(function (a, b) {
            return weightOfDivsMap[b] - weightOfDivsMap[a]
        });

        //console.log("Temp Collision: "  + tempCollisionArray.toString());
        var divLeft = 0;
        for (var tca = 0; tca < tempCollisionArray.length; tca++) {
            if (key != tempCollisionArray[tca]) {
                divLeft = divLeft + divWidthsMap[tempCollisionArray[tca]];
                //console.log ("left: " + divLeft);
            }
            else {
                break;
            }
        }
        $("#" + key).css("left", divLeft + "%");
        divLeftsMap[key] = divLeft;
        //console.log()
    }
    //console.log(JSON.stringify(divLeftsMap));
    //AdjustLeft Positions
    for (var key in maxCollisionListMap) {
        //console.log("key: " + key + " value: " + maxCollisionListMap[key]);
        var tempCollisionArray = maxCollisionListMap[key].split(",");
        tempCollisionArray.sort(function (a, b) {
            return parseFloat(weightOfDivsMap[b]) - parseFloat(weightOfDivsMap[a])
        });
        var filledPositionsMap = {};
        //Get Taken positions in max collisions time block
        for (var tca = 0; tca < tempCollisionArray.length; tca++) {
            if (key != tempCollisionArray[tca]) {
                for (var pcount = Math.round(divLeftsMap[tempCollisionArray[tca]]); pcount < ( divLeftsMap[tempCollisionArray[tca]] + divWidthsMap[tempCollisionArray[tca]]); pcount++) {
                    filledPositionsMap[pcount] = 1;
                }

                //filledPositionsArray.push(divLeftsMap[tempCollisionArray[tca]] + "+" + divWidthsMap[tempCollisionArray[tca]]);
            }
        }
        //console.log("FilledPositionMap : " + JSON.stringify(filledPositionsMap));
        //see if key div is overlapping another space

        for (var tca = 0; tca < tempCollisionArray.length; tca++) {
            //alert( $("#unformattedTime", "#"+$(".event").get(key).id).html() + " and " + $("#unformattedTime", "#"+$(".event").get(tempCollisionArray[tca]).id).html());
            //console.log(tempCollisionArray[tca]);
            if (collision($("#" + key), $("#" + tempCollisionArray[tca])) && key != tempCollisionArray[tca]) {
                //alert(tempCollisionArray.toString());
                //alert("collision: " + $("#unformattedTime", "#"+$(".event").get(key).id).html() + " and " + $("#unformattedTime", "#"+$(".event").get(tempCollisionArray[tca]).id).html());
                //if it is overlapping, find an empty space for the current width
                var space = 0;
                var largestAvailableSpace = 0;
                var largestAvailableLeft = 0;
                for (var fpa = 0; fpa < totalParentSpace; fpa++) {
                    //alert(filledPositionsArray[fpa+1]);
                    if (!(fpa in filledPositionsMap)) {
                        if (space == 0) {
                            largestAvailableLeft = fpa;
                        }
                        space++;
                        if (space > largestAvailableSpace) {
                            largestAvailableSpace = space;
                        }
                        if (space == divWidthsMap[key]) {

                            break;
                        }
                    }
                    else {
                        space = 0;
                    }
                    /*
                     var space = filledPositionsArray[fpa+1].split("+")[0] -  (filledPositionsArray[fpa].split("+")[0] + filledPositionsArray[fpa].split("+")[1]);

                     if(space > 0 && space <= divWidthsMap[key]){
                     $(".event").eq(key).css("left", filledPositionsArray[fpa].split("+")[0] + "%");
                     }
                     */
                }
                //alert("space " + space + " largestspace: " + largestAvailableSpace + " left: " + largestAvailableLeft);
                $("#" + key).css("left", largestAvailableLeft + "%");
                divLeftsMap[key] = largestAvailableLeft;
                $("#" + key.id).css("width", largestAvailableSpace + "%");
                divWidthsMap[key] = largestAvailableSpace;
            }
        }


    }


    /*
     var maxCollisionMap = {}; //holds event.eq numbers as keys and an array of the highest coll
     for (var w =0; w< $(".event").length; w++){
     //console.log("Event: " + w);
     var remainingParentSpace = 90;
     var totalParentSpace = 90;
     var divWidth = 0;
     var weight = 0;
     var maxCollisions = 0;
     for(var i =0; i< array_values.length; i++){
     //console.log("Array Values: " + array_values[i]);
     if(array_values[i].indexOf("" + w + "") > -1){
     weight++;
     //alert(collisionLog[z] + " " + j);
     $("#weightOfDiv", "#"+$(".event").get(w).id).html(weight);

     if(array_values[i].split(",").length > maxCollisions){
     maxCollisions = array_values[i].split(",").length;
     maxCollisionMap[w] = maxCollisions;
     divWidth = remainingParentSpace/maxCollisions;
     //if the other divs this one is colliding with has a width smaller than the calculated div Width, subtract it from the remaining space
     for(var z =0; z< array_values[i].split(",").length; z++){
     //console.log("\t" + array_values[i].split(",")[z]);
     if(maxCollisionMap[array_values[i].split(",")[z]] > maxCollisions){
     var currentOtherCollidingDivNumber = maxCollisionMap[array_values[i].split(",")[z]]
     var tempWidth = totalParentSpace/maxCollisionMap[array_values[i].split(",")[z]];
     remainingParentSpace = totalParentSpace - tempWidth;
     //alert(remainingParentSpace);
     var tempCollisions = maxCollisions -1;
     divWidth = remainingParentSpace/tempCollisions;
     }
     }

     $(".event").eq(w).css("width", divWidth + "%");

     //adjust left position after width is set

     /*
     var divLeft = remainingWidthSpace/collidingDivsInThisTimeBlock.length;
     if(100 * parseFloat($(".event").eq(i).css("left"))/parseFloat($(".event").eq(i).parent().css("width"))  < divLeft){
     $(".event").eq(i).css("left", divLeft*i + "%");
     //console.log("Adjusting left of " + $("#unformattedTime", "#"+$(".event").get(i).id).html() + ": " + divLeft);
     }

     }
     }
     }
     }*/

    checkFontSizeAndSpacing();


}

function checkFontSizeAndSpacing() {
    var countOfSquishedDivs = 0;
    var eventArray = $(".event");
    for (var i = 0; i < eventArray.length; i++) {
        var width = $("#" + eventArray[i].id).width();
        if ($("#shiftTypeDisplay", "#" + eventArray[i].id).width() - 8 > width ||
            $("#formattedTimeDisplay", "#" + eventArray[i].id).width() - 8 > width ||
            $("#notesDisplay", "#" + eventArray[i].id).width() - 8 > width
        ) {
            countOfSquishedDivs++;
            $(".eventBlockInnerDiv", "#" + eventArray[i].id).css({'display': 'none'});
            //$(".insideEventBlock", "#"+eventArray[i].id).css({'display':'none'});
            $(".squishedDisplay", "#" + eventArray[i].id).css({'display': ''});
        }
        else {
            $(".eventBlockInnerDiv", "#" + eventArray[i].id).css({'display': ''});
            $(".squishedDisplay", "#" + eventArray[i].id).css({'display': 'none'});
        }
    }
    //$(".eventBlockInnerDiv").css({'display':'none'});

}
function collision($div1, $div2) {
    var x1 = $div1.offset().left;
    var y1 = $div1.offset().top;
    var h1 = $div1.outerHeight(true);
    var w1 = $div1.outerWidth(true);
    var b1 = y1 + h1; //bottomedge
    var r1 = x1 + w1; //rightedge
    var x2 = $div2.offset().left;
    var y2 = $div2.offset().top;
    var h2 = $div2.outerHeight(true);
    var w2 = $div2.outerWidth(true);
    var b2 = y2 + h2; //bottomedge
    var r2 = x2 + w2; //rightedge

    if (b1 - 5 < y2 || y1 > b2 - 5 || r1 - 5 < x2 || x1 > r2 - 5) return false;
    return true;
}

function populateSavedAvailability() {
    //alert(availabilityEvents);
    var shiftEventArray = availabilityEvents.split(";");
    //DAY HHMM - HHMM,UNAVAILABLE,NOTES,weekly,weeklyordate;
    //0123456789012345
    for (var e = 0; e < shiftEventArray.length; e++) {
        if (shiftEventArray[e].length > 1) {
            //console.log("hello" + shiftEventArray[e]);
            var thisEvent = shiftEventArray[e].split(",");
            /////////////////////////////////////////////////
            newDivHomeBlock = thisEvent[0].substring(0, 3) + "tb" + thisEvent[0].substring(4, 8);
            newDivEndBlock = thisEvent[0].substring(0, 3) + "tb" + thisEvent[0].substring(11, 15);


            //////////////////////////////////////
            //alert($("#endTimeModal").val().trim());
            newDivID = "event" + thisEvent[0].substring(0, 3) + eventCount;
            //alert(newDivEndBlock + " " + newDivHomeBlock);
            //If event is at the end of the day
            if (thisEvent[0].substring(11, 15) == "" + endTimeHour + endTimeMin) {

                //alert(tempEndNum);
                //console.log("NewDivEndBlock: " + newDivEndBlock);
                newDivEndBlock = $(".timeBlock.Sunday").last().attr("id");
                //console.log("NewDivEndBlock: " + newDivEndBlock);
                newDivHeight = ($("#" + newDivEndBlock).offset().top + $("#" + newDivEndBlock).outerHeight() - 2) - $("#" + newDivHomeBlock).offset().top;
            }
            else {
                newDivHeight = $("#" + newDivEndBlock).offset().top - $("#" + newDivHomeBlock).offset().top;
            }
            newResizableText = "";
            newNumOfEmployees = 1;
            newDisplayText = thisEvent[1];
            newFormattedText = "";
            newShiftType = thisEvent[1];
            newNotes = thisEvent[2];
            newSquishedEmployees = "";
            newEmployees = "";
            newWeeklyShift = thisEvent[3];
            newEventDate = thisEvent[4];

            //alert(newDivEndBlock);
            createEventDivContainer(newDivHomeBlock);
            createEventDetails(newDivID);
            draggableFunction();
            resizableFunction();
            currentDragOrResizeXCoordinate = $("#" + newDivID).offset().left;
            currentDragOrResizeYCoordinate = $("#" + newDivID).offset().top;
            currentDragOrResizeYCoordinate = currentDragOrResizeYCoordinate + (timeBlockHeight / 2);

            //If event is at the end of the day
            if (thisEvent[0].substring(11, 15) == "" + endTimeHour + endTimeMin) {
                currentDragOrResizeBottomYCoordinate = ($("#" + newDivEndBlock).offset().top + $("#" + newDivEndBlock).outerHeight()) - 4;
            }
            else {
                currentDragOrResizeBottomYCoordinate = ($("#" + newDivEndBlock).offset().top) - 4;
            }
            //////////////////////////////////////
            $("#unformattedTime", "#" + newDivID).html(thisEvent[0].substring(0, 3) + " " + calculateTimeFromPosition(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
            $("#formattedTimeDisplay", "#" + newDivID).html(calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
            //alert(calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
            ////////////////////////////////////////////////////////
            eventCount++
        }
    }
    fixOverLappingEventDivs2();
}


function populateSavedShifts(calendarView) {
    var shiftEventArray = savedShiftEvents.trim().split(";");
    var shiftTypesArray = shiftTypes.split(",");
    var prefix = "";
    var timeColumnClass = "";
    //console.log(shiftEventArray);
    if(calendarView == "week" || calendarView == "day"){
        if(calendarView == "week"){
            prefix = "";
            timeColumnClass = ".weekViewTimeColumn";
        }
        else if(calendarView == "day") {
            prefix = "DAYVIEW";
            timeColumnClass = ".dayViewTimeColumn";

        }

        //EVENTID,DAY HHMM - HHMM,SERVER,1,NOTES,weekly/oneTime,01/01/2015;
        //0123456789012345
        //console.log("in function: " + savedShiftEvents);
        var largestEventIDNumber = 0;
        for (var e = 0; e < shiftEventArray.length; e++) {
            if (shiftEventArray[e].length > 1 ) {

                //consolelog("hello" + shiftEventArray[e]);
                var thisEvent = shiftEventArray[e].split(",");
                /////////////////////////////////////////////////
                if(calendarView == "day" && $("#dayViewHiddenDate").html() != thisEvent[6]){
                    continue;
                }
                eventObject = new event(thisEvent[0], thisEvent[2], thisEvent[6], thisEvent[3]);
                //console.log("#" + prefix + thisEvent[1].substring(0, 3) + "tb" + thisEvent[1].substring(4, 8));
                eventObject.topYPos = $("#" + prefix + thisEvent[1].substring(0, 3) + "tb" + thisEvent[1].substring(4, 8)).offset().top;
                eventObject.botYPos = $("#" + prefix + thisEvent[1].substring(0, 3) + "tb" + thisEvent[1].substring(11,15)).offset().top -2;
                eventObject.divHeight = $("#" + eventObject.getEndBlockID()).offset().top - $("#" + eventObject.getStartBlockID()).offset().top - 2;
                eventObject.weeklyOrOneTime = thisEvent[5];
                alert("#" + prefix + thisEvent[1].substring(0, 3) + "tb" + thisEvent[1].substring(4, 8));
                //alert(newDivHomeBlock);
                //console.log("end Time Saved: " + thisEvent[1].substring(11,15));
                //console.log("end Time : " + "#" + prefix + thisEvent[1].substring(0, 3) + "tb" + thisEvent[1].substring(11,15) + " " + $("#" + prefix + thisEvent[1].substring(0, 3) + "tb" + thisEvent[1].substring(11,15)).offset().top );

                //console.log("plus: " + "#" + thisEvent[1].substring(0, 3) + "tb" + thisEvent[1].substring(11,15) + " " + $("#" + thisEvent[1].substring(0, 3) + "tb" + thisEvent[1].substring(11,15)).height() );
                //console.log("endBlockID: " + eventObject.getEndBlockID());
                if($("#" + eventObject.getStartBlockID()).length > 0) {

                    if (parseInt(thisEvent[0].substring(8)) > parseInt(largestEventIDNumber)) {
                        largestEventIDNumber = thisEvent[0].substring(8);
                        //console.log("largest: " + largestEventIDNumber + ", " + thisEvent[0]);
                    }

                    createEventDivContainer(eventObject);
                    createEventDetails(eventObject);
                    draggableFunction();
                    resizableFunction();
                    //console.log(eventObject);
                    eventCount++
                    eventObjectHashMap[eventObject.eventID] = eventObject;
                    eventObject.eventDBString = eventObject.eventID + "," + eventObject.dayOfEvent().substring(0,3) + " " + eventObject.startTime() +
                        " - " + eventObject.endTime() + "," + eventObject.shiftType + "," + eventObject.numberOfShifts + "," +
                        eventObject.notesString() + "," + eventObject.weeklyOrOneTime + "," + eventObject.formattedDate();

                }
            }
        }
        eventCount = parseInt(largestEventIDNumber) + 1;

        fixOverLappingEventDivs2();

    }
    else if(calendarView == "month"){
        prefix = "MONTHVIEW";
        var timeOfShiftDisplay ="";

        var largestEventIDNumber = 0;
        for (var e = 0; e < shiftEventArray.length; e++) {
            if (shiftEventArray[e].length > 1) {
                //console.log("hello" + shiftEventArray[e]);

                var thisEvent = shiftEventArray[e].split(",");
                ////////////////////////////////////////////////
                //EVENTID,DAY HHMM - HHMM,SERVER,1,NOTES,weekly/oneTime,01/01/2015;
                //0123456789012345

                // newDivHomeBlock = prefix + thisEvent[1].substring(0, 3) + "tb" + thisEvent[1].substring(4, 8);
                if (parseInt(thisEvent[0].substring(8)) > parseInt(largestEventIDNumber)) {
                    largestEventIDNumber = thisEvent[0].substring(8);
                    //console.log("largest: " + largestEventIDNumber + ", " + thisEvent[0]);
                }
                eventObject = new event(thisEvent[0], thisEvent[2], thisEvent[6], thisEvent[3]);
                eventObject.eventDBString = shiftEventArray[e];
                eventObject.weeklyOrOneTime = thisEvent[5];
                if (eventObject.weeklyOrOneTime == "weekly") {
                    //console.log(eventObject.formattedDate().substring(0,2));
                    //console.log($(".calendarCell").first().attr("id").substring(5,13));
                    var firstDateOfMonth = $(".calendarCell").first().attr("id").substring(5,7) + "/" +  $(".calendarCell").first().attr("id").substring(7,9) + "/" +  $(".calendarCell").first().attr("id").substring(9,13);
                    //console.log(new Date(firstDateOfMonth));
                    //console.log(eventObject.dateObject);
                    //console.log("#" + eventObject.dayOfEvent().substring(0,3) + "tb" + eventObject.formattedDateNoDelimit());

                    //if current view has the date of when the weekly shift starts
                    if( $("#" + eventObject.dayOfEvent().substring(0,3) + "tb" + eventObject.formattedDateNoDelimit()).length > 0 ){

                        for(var i = 0; i < 7; i++){
                            var tempEventObject = jQuery.extend(true, {}, eventObject);


                            tempEventObject.eventID = "weekly" + tempEventObject.formattedDateNoDelimit() +  eventObject.eventID;
                            tempEventObject.employeesScheduled = "";
                            createEventDivContainer(tempEventObject);
                            createEventDetails(tempEventObject);
                            tempEventObject.dateObject.setDate(tempEventObject.dateObject.getDate() + 7);
                            eventObjectHashMap[tempEventObject.eventID] = tempEventObject;
                            //if employees scheduled... save to db
                        }
                    }
                    //if weekly Event is still occurring. Currently no end date on week events. So if week event started previously.. it must still be going on.
                    else if( eventObject.dateObject < new Date(firstDateOfMonth) ){

                        for(var i = 0; i < $("." + eventObject.dayOfEvent().substring(0,3)).length ; i++){
                            //console.log("WE IN DA MONTH: " + $("." + eventObject.dayOfEvent().substring(0,3)).eq(i).attr("id"));
                            var tempEventObject = jQuery.extend(true, {}, eventObject);
                            var tempDate = $("." + eventObject.dayOfEvent().substring(0,3)).eq(i).attr("id").substring(5,7) + "/" +
                                $("." + eventObject.dayOfEvent().substring(0,3)).eq(i).attr("id").substring(7,9) + "/" +
                                $("." + eventObject.dayOfEvent().substring(0,3)).eq(i).attr("id").substring(9,13);
                            //console.log(tempDate);
                            tempEventObject.setDateObject(tempDate);
                            tempEventObject.eventID = "weekly" + tempEventObject.formattedDateNoDelimit() +  eventObject.eventID;
                            createEventDivContainer(tempEventObject);
                            createEventDetails(tempEventObject);
                            eventObjectHashMap[tempEventObject.eventID] = tempEventObject;

                            //if employees scheduled... save to db
                        }
                    }

                }
                else{

                    createEventDivContainer(eventObject);
                    createEventDetails(eventObject);
                    if (eventObject.weeklyOrOneTime == "weekly") {
                        convertOneTimeShiftToWeekly(eventObject);
                    }
                    draggableFunction();
                    eventObjectHashMap[eventObject.eventID] = eventObject;
                    eventObject.eventDBString = eventObject.eventID + "," + eventObject.dayOfEvent().substring(0, 3) + " " + eventObject.startTime() +
                        " - " + eventObject.endTime() + "," + eventObject.shiftType + "," + eventObject.numberOfShifts + "," +
                        eventObject.notesString() + "," + eventObject.weeklyOrOneTime + "," + eventObject.formattedDate();
                    eventCount++
                }






            }
        }
        eventCount = parseInt(largestEventIDNumber) + 1;
        //console.log(eventObjectHashMap);

    }
}
function populateSavedShiftsWithSchedule() {
    if(savedScheduleEvents){
        alert();
        var scheduleEventArray = savedScheduleEvents.trim().split(";");
        //EVENTID,DAY HHMM - HHMM,SERVER,1 Shifts,Name Name-Name Name-,NOTES,weekly/oneTime,01/01/2015;
        //0123456789012345
        var largestEventIDNumber = 0;
        for (var e = 0; e < scheduleEventArray.length; e++) {
            if (scheduleEventArray[e].length > 1) {
                var thisEvent = scheduleEventArray[e].split(",");
                $(".employeesScheduled", "#" + thisEvent[0]).html(thisEvent[4].replace(/-/g, '<br>'));

            }
        }
    }

}
function populateSavedShiftsWithScheduleBACKUP() {
    var scheduleEventArray = savedScheduleEvents.trim().split(";");
    //EVENTID,DAY HHMM - HHMM,SERVER,1 Shifts,Name Name-Name Name-,NOTES,weekly/oneTime,01/01/2015;
    //0123456789012345
    var largestEventIDNumber = 0;
    for (var e = 0; e < scheduleEventArray.length; e++) {
        if (scheduleEventArray[e].length > 1) {
            //alert("hello" + scheduleEventArray[e]);
            var thisEvent = scheduleEventArray[e].split(",");
            /////////////////////////////////////////////////
            newDivHomeBlock = thisEvent[1].substring(0, 3) + "tb" + thisEvent[1].substring(4, 8);
            newDivEndBlock = thisEvent[1].substring(0, 3) + "tb" + thisEvent[1].substring(11, 15);


            //////////////////////////////////////
            //alert($("#endTimeModal").val().trim());
            newDivID = thisEvent[0];
            if (parseInt(thisEvent[0].substring(8)) > parseInt(largestEventIDNumber)) {
                largestEventIDNumber = thisEvent[0].substring(8);
                //console.log("largest: " + largestEventIDNumber + ", " + thisEvent[0]);
            }
            //alert(newDivEndBlock + " " + newDivHomeBlock);
            //If event is at the end of the day
            if (thisEvent[1].substring(11, 15) == "" + endTimeHour + endTimeMin) {

                //alert(tempEndNum);
                //console.log("NewDivEndBlock: " + newDivEndBlock);
                newDivEndBlock = $(".timeBlock.Sunday").last().attr("id");
                //console.log("NewDivEndBlock: " + newDivEndBlock);
                newDivHeight = ($("#" + newDivEndBlock).offset().top + $("#" + newDivEndBlock).outerHeight() - 2) - $("#" + newDivHomeBlock).offset().top;
            }
            else {
                newDivHeight = $("#" + newDivEndBlock).offset().top - $("#" + newDivHomeBlock).offset().top - 2;
            }
            newResizableText = "";
            newNumOfEmployees = thisEvent[3];
            newDisplayText = thisEvent[2];
            newFormattedText = "";
            newShiftType = thisEvent[2];
            newNotes = thisEvent[5];
            newSquishedEmployees = thisEvent[4].replace(/-/g, '<br>');
            newEmployees = thisEvent[4].replace(/-/g, '<br>');
            newWeeklyShift = thisEvent[6];
            newEventDate = thisEvent[7];

            newBackgroundColor;
            for (var c = 0; c < shiftTypes.split(",").length; c++) {
                if (shiftTypes.split(",")[c].split(" ")[0] == thisEvent[2]) {
                    newBackgroundColor = shiftTypes.split(",")[c].split(" ")[1];
                }
            }
            //alert(newDivEndBlock);
            eventTypecolor = newBackgroundColor;
            createEventDivContainer(newDivHomeBlock);
            createEventDetails(newDivID);
//	    $("#" + newDivHomeBlock ).append("<div class='" + eventCSSClass + " draggable resizable ' id='" + newDivID + "' " +
//		    "style= 'width:90%; height:" + newDivHeight + "px'>" + "</div>");
//
//	    $("#"+ newDivID).append("" +
//		    "<div class='eventBlockInnerDiv'>" +
//
//		    "<span class='insideEventBlock'  id='shiftTypeDisplay' >" + newDisplayText + "</span> " +
//		    "</div>" +
//		    "<div class='eventBlockInnerDiv'>" +
//		    	"<small>" +
//		    	"<span class='insideEventBlock' id='formattedTimeDisplay' >" +
//		    		newFormattedText +
//		    		"</span> " +
//		    		"<br><span class='insideEventBlock' id='numOfEmployees'>" + newNumOfEmployees + "</span> " +
//		    	"</small>" +
//		    "</div>" +
//		    "<span class='insideEventBlock' id='notesDisplay'>" + newNotes + "</span> " +
//		    "<span id='unformattedTime'  style='display:none'>" + "</span> " +
//		    "<span id='createdInTimeBlock' style='display:none'>" + newDivHomeBlock + "</span> " +
//		    "<span id='shiftType' style='display:none'>" + newShiftType + "</span> " +
//		    "<span id='weightOfDiv' style='display:none'>" + 0 + "</span> " +
//		    "<button type='button' class='close eventDelete' aria-label='Close' style='position:absolute; top:0; right:0;'><span aria-hidden='true'>&times;</span></button>" +
//		    "<span id='startBlockNumber' style='display:none'>0</span> " +
//	    	    "<span id='endBlockNumber' style='display:none'>0</span> ");
            $("#" + newDivID).css('background-color', "" + newBackgroundColor + "");
            draggableFunction();
            resizableFunction();
            currentDragOrResizeXCoordinate = $("#" + newDivID).offset().left;
            currentDragOrResizeYCoordinate = $("#" + newDivHomeBlock).offset().top;
            currentDragOrResizeYCoordinate = currentDragOrResizeYCoordinate + (timeBlockHeight / 2); //add timeblock/2 to make sure coordinate is in the timeblock
            //If event is at the end of the day
            if (thisEvent[1].substring(11, 15) == "" + endTimeHour + endTimeMin) {
                currentDragOrResizeBottomYCoordinate = ($("#" + newDivEndBlock).offset().top + $("#" + newDivEndBlock).outerHeight()) - 4;
            }
            else {
                currentDragOrResizeBottomYCoordinate = ($("#" + newDivEndBlock).offset().top) - 4;
            }
            //////////////////////////////////////
            $("#unformattedTime", "#" + newDivID).html(thisEvent[1].substring(0, 3) + " " + calculateTimeFromPosition(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
            $("#formattedTimeDisplay", "#" + newDivID).html(calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
            //alert(calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
            ////////////////////////////////////////////////////////


            eventCount++
        }
    }
    eventCount = parseInt(largestEventIDNumber) + 1;
    fixOverLappingEventDivs2();
}
function getAvailabilityForCurrentDatesAndFillCalendar() {
    var tempDate = new Date(year, month - 1, date - (chosenDate.getDay() - (1 - 1)));
    var beginDateString = (tempDate.getMonth() + 1) + "/" + tempDate.getDate() + "/" + (tempDate.getYear() + 1900);
    var tempDate = new Date(year, month - 1, date - (chosenDate.getDay() - (7 - 1)));
    var endDateString = (tempDate.getMonth() + 1) + "/" + tempDate.getDate() + "/" + (tempDate.getYear() + 1900);
    var beginEndDateString = beginDateString + ":" + endDateString;
    $body.addClass("loading");
    $.ajax({
        method: "GET",
        url: "/pickupmyshift/application/getAvailabilityForDates",
        data: {beginEndDateString: beginEndDateString}
    })
        .done(function (msg) {
            //alert( "Data: " + msg );
            $(".event").remove();
            $("#availabilityEventsVariable").html(msg);
            availabilityEvents = $("#availabilityEventsVariable").html();
            //savedShiftEvents = msg.split(":spaceForGetShiftAndScheduleForDates:")[0];
            //savedScheduleEvents = msg.split(":spaceForGetShiftAndScheduleForDates:")[1];
            //alert(savedScheduleEvents);

            //$("#shiftEventsVariable").html(savedShiftEvents);

            //$("#scheduleEventsVariable").html(savedScheduleEvents);
            //console.log ("before function: " + savedShiftEvents);

            //add newly created events that havn't been saved.
            //alert($(".weeklyShift:contains('oneTime')").html());
            //console.log($(".weeklyShift:contains('oneTime')").closest(".event"));

            populateSavedAvailability();

            $body.removeClass("loading");
        });

}
function getScheduleForCurrentDatesAndFillCalendar() {
    if(true){ //if on the view schedule page
        //console.log(chosenDate);
        var activeView = "week";
        if($("#weekViewButton").hasClass("active")){

            var tempDate = new Date(year, month - 1, date - (chosenDate.getDay() - (1 - 1)));
            var beginDateString = (tempDate.getMonth() + 1) + "/" + tempDate.getDate() + "/" + (tempDate.getYear() + 1900);
            var tempDate = new Date(year, month - 1, date - (chosenDate.getDay() - (7 - 1)));
            var endDateString = (tempDate.getMonth() + 1) + "/" + tempDate.getDate() + "/" + (tempDate.getYear() + 1900);
            var beginEndDateString = beginDateString + ":" + endDateString;
            activeView = "week";
        }
        else if($("#dayViewButton").hasClass("active")){
            var tempDate = chosenDate;
            var beginDateString = (tempDate.getMonth() + 1) + "/" + tempDate.getDate() + "/" + (tempDate.getYear() + 1900);
            var tempDate = chosenDate;
            var endDateString = (tempDate.getMonth() + 1) + "/" + tempDate.getDate() + "/" + (tempDate.getYear() + 1900);
            var beginEndDateString = beginDateString + ":" + endDateString;
            activeView = "day";
        }
        else if($("#monthViewButton").hasClass("active")){
            var firstDayOfMonth =  new Date(chosenDate.getYear()+1900, chosenDate.getMonth(), 1);
            var lastDayOfMonth =  new Date(chosenDate.getYear()+1900, chosenDate.getMonth()+1, 0);
            var tempDate = firstDayOfMonth;

            var beginDateString = (tempDate.getMonth() + 1) + "/" + tempDate.getDate() + "/" + (tempDate.getYear() + 1900);
            var tempDate = lastDayOfMonth;
            var endDateString = (tempDate.getMonth() + 1) + "/" + tempDate.getDate() + "/" + (tempDate.getYear() + 1900);
            var beginEndDateString = beginDateString + ":" + endDateString;
            activeView = "month";
            //console.log(beginEndDateString);
        }
    }
    else {
        //console.log("Date String: " + beginDateString);
        var tempDate = new Date(year, month - 1, date - (chosenDate.getDay() - (1 - 1)));
        var beginDateString = (tempDate.getMonth() + 1) + "/" + tempDate.getDate() + "/" + (tempDate.getYear() + 1900);
        var tempDate = new Date(year, month - 1, date - (chosenDate.getDay() - (7 - 1)));
        var endDateString = (tempDate.getMonth() + 1) + "/" + tempDate.getDate() + "/" + (tempDate.getYear() + 1900);
        var beginEndDateString = beginDateString + ":" + endDateString;
    }

    $body.addClass("loading");
    $.ajax({
        method: "GET",
        url: "/pickupmyshift/application/getShiftAndScheduleForDates",
        data: {beginEndDateString: beginEndDateString}
    })
        .done(function (msg) {
            //alert( "Data Received: " + msg );
            $(".event").remove();

            savedShiftEvents = msg.split(":spaceForGetShiftAndScheduleForDates:")[0];
            savedScheduleEvents = msg.split(":spaceForGetShiftAndScheduleForDates:")[1];
            //alert(savedScheduleEvents);

            $("#shiftEventsVariable").html(savedShiftEvents);

            $("#scheduleEventsVariable").html(savedScheduleEvents);
            //console.log ("before function: " + savedShiftEvents);

            //add newly created events that havn't been saved.
            //alert($(".weeklyShift:contains('oneTime')").html());
            //console.log($(".weeklyShift:contains('oneTime')").closest(".event"));

            populateSavedShifts(activeView);

            populateSavedShiftsWithSchedule();

            $body.removeClass("loading");
        });

}

function draggableFunction() {
    if ($('#createScheduleWrapper').length) { //ensure only draggable on createSchedule page

        $('.draggable').draggable({
            //axis: "y",
            //snapTolerance: 20,
            containment: $('.draggable').closest("tbody"),
            snap: "td.timeBlock",
            drag: function () {
                //console.log("dragging");
                $(".popover").hide();

                dragging = true;

                eventObject = eventObjectHashMap[$(this).attr('id')];
                startClickBlockID = eventObject.eventID;
                //console.log("startClickBlockID: " + startClickBlockID);
                //Get changing Coordinates as mouse is dragging event
                if ($("#weekViewButton").hasClass('active')  ) {
                    //console.log("dragging");
                    //consolelog($(this).attr('id'));
                    //alert(eventObject);
                    eventObject.leftXPos = $(this).offset().left;
                    eventObject.topYPos = $(this).offset().top;
                    eventObject.topYPos = eventObject.topYPos + (timeBlockHeight / 2);
                    eventObject.botYPos = eventObject.topYPos + $(this).outerHeight(true) - 4;
                    eventObject.botYPos = eventObject.botYPos - (timeBlockHeight / 2);
                    //alert("dragged");
                    //Change Day of Week if dragged into another day
                    if (eventObject.leftXPos > $("#weekViewSundayDayLabel").offset().left && eventObject.leftXPos < $("#weekViewSundayDayLabel").offset().left + $("#weekViewSundayDayLabel").outerWidth()) {
                        startBlockID = "Suntb" + eventObject.startTime();

                        eventDraggedToDifferentStartTime = true;
                    }
                    else if (eventObject.leftXPos > $("#weekViewMondayDayLabel").offset().left && eventObject.leftXPos < $("#weekViewMondayDayLabel").offset().left + $("#weekViewMondayDayLabel").outerWidth()) {
                        startBlockID = "Montb" + eventObject.startTime();
                    }
                    else if (eventObject.leftXPos > $("#weekViewTuesdayDayLabel").offset().left && eventObject.leftXPos < $("#weekViewTuesdayDayLabel").offset().left + $("#weekViewTuesdayDayLabel").outerWidth()) {
                        startBlockID = "Tuetb" + eventObject.startTime();
                    }
                    else if (eventObject.leftXPos > $("#weekViewWednesdayDayLabel").offset().left && eventObject.leftXPos < $("#weekViewWednesdayDayLabel").offset().left + $("#weekViewWednesdayDayLabel").outerWidth()) {
                        startBlockID = "Wedtb" + eventObject.startTime();
                    }
                    else if (eventObject.leftXPos > $("#weekViewThursdayDayLabel").offset().left && eventObject.leftXPos < $("#weekViewThursdayDayLabel").offset().left + $("#weekViewThursdayDayLabel").outerWidth()) {
                        startBlockID = "Thutb" + eventObject.startTime();
                    }
                    else if (eventObject.leftXPos > $("#weekViewFridayDayLabel").offset().left && eventObject.leftXPos < $("#weekViewFridayDayLabel").offset().left + $("#weekViewFridayDayLabel").outerWidth()) {
                        startBlockID = "Fritb" + eventObject.startTime();
                    }
                    else if (eventObject.leftXPos > $("#weekViewSaturdayDayLabel").offset().left && eventObject.leftXPos < $("#weekViewSaturdayDayLabel").offset().left + $("#weekViewSaturdayDayLabel").outerWidth()) {
                        startBlockID = "Sattb" + eventObject.startTime();
                    }
                    else {
                        startBlockID = this.id.substring(5, 8) + "tb" + eventObject.startTime();
                    }
                    newEventDate = $("#" + startBlockID).closest('table').find('thead').find('tr').find('td').eq($("#" + startBlockID).index()).find(".hiddenDate").html();
                    //console.log("New Date: " + newEventDate);
                    //console.log("startBlockID: " + startBlockID);

                    eventObject.setDateObject(newEventDate);
                    //console.log("dragging: "  + startBlockID + eventObject.dayOfEvent());
                    eventObject.updateEventTimeDivs();
                    eventObject.refreshDateDivs();
                }

                else if ($("#dayViewButton").hasClass('active')  ) {
                    eventObject.leftXPos = $(this).offset().left;
                    eventObject.topYPos = $(this).offset().top;
                    eventObject.topYPos = eventObject.topYPos + (timeBlockHeight / 2);
                    eventObject.botYPos = eventObject.topYPos + $(this).outerHeight(true) - 4;
                    eventObject.botYPos = eventObject.botYPos - (timeBlockHeight / 2);

                    //console.log("left: " + $("#" + eventObject.eventID).length);
                    eventObject.updateEventTimeDivs();
                    eventObject.refreshDateDivs();
                }
                else if ($("#monthViewButton").hasClass('active')  ) {
                    //console.log(eventObject);
                    newEventDate = mouseIsOverDiv.substring(5,7) + "/" + mouseIsOverDiv.substring(7,9) + "/" + mouseIsOverDiv.substring(9);
                    eventObject.setDateObject(newEventDate);


                }

            }
        });
    }
}

function resizableFunction() {
    if ($('#createScheduleWrapper').length) { //ensure only resizable on createSchedule page
        $(".resizable").resizable({
            handles: "n, s",
            containment: "tbody",
            grid: [10, resizeGridY],
            resize: function () {
                //console.log(this.id);
                startClickBlockID = this.id;
                resizing = true;
                //get changing coordinates as mouse is resizing event
                eventObject = eventObjectHashMap[$(this).attr('id')];
                //Get changing Coordinates as mouse is dragging event
                eventObject.leftXPos = $(this).offset().left;
                eventObject.topYPos = $(this).offset().top;
                eventObject.topYPos = eventObject.topYPos + (timeBlockHeight / 2);
                eventObject.botYPos = eventObject.topYPos + $(this).outerHeight(true) - 4;
                eventObject.botYPos = eventObject.botYPos - (timeBlockHeight / 2);
                //alert("dragged");
                //Change Day of Week if dragged into another day
                if (eventObject.leftXPos > $("#weekViewSundayDayLabel").offset().left && eventObject.leftXPos < $("#weekViewSundayDayLabel").offset().left + $("#weekViewSundayDayLabel").outerWidth()) {
                    startBlockID = "Suntb" + eventObject.startTime();

                    eventDraggedToDifferentStartTime = true;
                }
                else if (eventObject.leftXPos > $("#weekViewMondayDayLabel").offset().left && eventObject.leftXPos < $("#weekViewMondayDayLabel").offset().left + $("#weekViewMondayDayLabel").outerWidth()) {
                    startBlockID = "Montb" + eventObject.startTime();
                }
                else if (eventObject.leftXPos > $("#weekViewTuesdayDayLabel").offset().left && eventObject.leftXPos < $("#weekViewTuesdayDayLabel").offset().left + $("#weekViewTuesdayDayLabel").outerWidth()) {
                    startBlockID = "Tuetb" + eventObject.startTime();
                }
                else if (eventObject.leftXPos > $("#weekViewWednesdayDayLabel").offset().left && eventObject.leftXPos < $("#weekViewWednesdayDayLabel").offset().left + $("#weekViewWednesdayDayLabel").outerWidth()) {
                    startBlockID = "Wedtb" + eventObject.startTime();
                }
                else if (eventObject.leftXPos > $("#weekViewThursdayDayLabel").offset().left && eventObject.leftXPos < $("#weekViewThursdayDayLabel").offset().left + $("#weekViewThursdayDayLabel").outerWidth()) {
                    startBlockID = "Thutb" + eventObject.startTime();
                }
                else if (eventObject.leftXPos > $("#weekViewFridayDayLabel").offset().left && eventObject.leftXPos < $("#weekViewFridayDayLabel").offset().left + $("#weekViewFridayDayLabel").outerWidth()) {
                    startBlockID = "Fritb" + eventObject.startTime();
                }
                else if (eventObject.leftXPos > $("#weekViewSaturdayDayLabel").offset().left && eventObject.leftXPos < $("#weekViewSaturdayDayLabel").offset().left + $("#weekViewSaturdayDayLabel").outerWidth()) {
                    startBlockID = "Sattb" + eventObject.startTime();
                }
                else {
                    startBlockID = this.id.substring(5, 8) + "tb" + eventObject.startTime();
                }
                newEventDate = $("#" + startBlockID).closest('table').find('thead').find('tr').find('td').eq($("#" + startBlockID).index()).find(".hiddenDate").html();
                //console.log("Date: " + newEventDate);
                eventObject.setDateObject(newEventDate);
                //console.log(newEventDate);
                //console.log("dragging: "  + startBlockID + eventObject.dayOfEvent());
                eventObject.updateEventTimeDivs();
                eventObject.refreshDateDivs();
                eventObject.updateDivHeight();
            }
        });
    }
}
function calculateTimeFromPosition(xStartPos, yStartPos, yEndPos) {

    if (Math.floor((yEndPos - dayLabelBlockYCoordinate) / timeBlockHeight) + 1 >= $(".timeBlock.Sunday").length) {
        //var lastBlock = parseInt($(".Sunday").eq(Math.floor((yEndPos-dayLabelBlockYCoordinate)/timeBlockHeight)).attr('id').substring(5,9)) + parseInt(timeInterval);
        var lastBlock = parseInt(endTimeHour + endTimeMin);
        var tempString = $(".Sunday").eq(Math.floor((yStartPos - dayLabelBlockYCoordinate) / timeBlockHeight)).attr('id').substring(5, 9) + " - "
            + lastBlock;
        //console.log($(".Sunday").eq(Math.floor((yEndPos - dayLabelBlockYCoordinate) / timeBlockHeight) + 1).attr("id"));
    }
    else {
        //console.log(Math.floor((yEndPos - dayLabelBlockYCoordinate) / timeBlockHeight) + 1);
        //console.log($(".Sunday").eq(Math.floor((yEndPos - dayLabelBlockYCoordinate) / timeBlockHeight) + 1).attr("id"));
        var tempString = $(".Sunday").eq(Math.floor((yStartPos - dayLabelBlockYCoordinate) / timeBlockHeight)).attr('id').substring(5, 9) + " - "
            + $(".Sunday").eq(Math.floor((yEndPos - dayLabelBlockYCoordinate) / timeBlockHeight) + 1).attr('id').substring(5, 9);
    }
    return (tempString);
}

function calculateTimeFromPositionFormatted(xStartPos, yStartPos, yEndPos) {
    if (Math.floor((yEndPos - dayLabelBlockYCoordinate) / timeBlockHeight) + 1 >= $(".timeBlock.Sunday").length) {
        //var lastBlock = parseInt($(".Sunday").eq(Math.floor((yEndPos-dayLabelBlockYCoordinate)/timeBlockHeight)).attr('id').substring(5,9)) + parseInt(timeInterval);
        var lastBlock = parseInt(endTimeHour + endTimeMin);
        var tempString = $(".Sunday").eq(Math.floor((yStartPos - dayLabelBlockYCoordinate) / timeBlockHeight)).attr('id').substring(5, 9) + " - "
            + lastBlock;
    }
    else {
        var tempString = $(".Sunday").eq(Math.floor((yStartPos - dayLabelBlockYCoordinate) / timeBlockHeight)).attr('id').substring(5, 9) + " - "
            + $(".Sunday").eq(Math.floor((yEndPos - dayLabelBlockYCoordinate) / timeBlockHeight) + 1).attr('id').substring(5, 9);
    }

    var startMinFormatted = parseInt(tempString.substring(2, 4)) == 0 ? "" : ":" + tempString.substring(2, 4);
    //console.log(parseInt(tempString.substring(2,4)));
    var endMinFormatted = parseInt(tempString.substring(9, 11)) == 0 ? "" : ":" + tempString.substring(9, 11);
    var stringReturn =
        ((parseInt(tempString.substring(0, 2)) < 12) ? (parseInt(tempString.substring(0, 2)) + startMinFormatted + "") : ((parseInt(tempString.substring(0, 2)) == 12) ? (parseInt(tempString.substring(0, 2)) + startMinFormatted + "p") : (parseInt(tempString.substring(0, 2)) - 12 + startMinFormatted + "p"))) +
        " - " +
        ((parseInt(tempString.substring(7, 9)) < 12) ? (parseInt(tempString.substring(7, 9)) + endMinFormatted + "") : ((parseInt(tempString.substring(7, 9)) == 12) ? (parseInt(tempString.substring(7, 9)) + endMinFormatted + "p") : (parseInt(tempString.substring(7, 9)) - 12 + endMinFormatted + "p")));

    return (stringReturn);
}
function initializeMonthCalendar(){
    $("#monthHeaderMonth").html(monthsArray[chosenDate.getMonth() + 1]);
    fillDatesMonth();

}
function initializeDayCalendar(){
    month = chosenDate.getMonth() + 1;
    date = chosenDate.getDate();
    year = chosenDate.getYear() + 1900;





    for(var i=0; i< $(".dayViewTimeBlock").length; i++){
        //console.log($(".dayViewTimeBlock").get(i).id.substring(12,17));
        var oldID = $(".dayViewTimeBlock").get(i).id;
        var newID = "DAYVIEW" + daysOfWeekAbrev[chosenDate.getDay()+1] + "tb" + oldID.substring(12,17);
        $(".dayViewTimeBlock").eq(i).attr("id", newID);


    }

    var tempDate = chosenDate;
    var tempMonth = tempDate.getMonth()+1;
    //alert(today + "=" + tempDate);
    if(today.getMonth() == tempDate.getMonth() && today.getDate() == tempDate.getDate() && today.getYear() == tempDate.getYear()) {//if today

        $(".dayViewTimeBlock").addClass('today');
    }

    //Set Correct Day and Date
    $("#dayViewDateLabel").html(daysOfWeek[chosenDate.getDay()+1]);
    $("#dayViewHiddenDate").html((tempMonth <10 ? "0" + tempMonth: tempMonth) + "/" + (tempDate.getDate() <10 ? "0" + tempDate.getDate() : tempDate.getDate()) + "/" + (tempDate.getYear() + 1900));
    $("#dayViewHiddenDate").show();
    //Fill Shift and Schedule info


    //adjust height of rows
    dayRows = $(".timeColumnDAYVIEW").length;
    tdHeight = $(window).height()/dayRows;
    $('.dayViewTR').height(tdHeight);
}

function initializeEmployeeCalendar(){
    month = chosenDate.getMonth() + 1;
    date = chosenDate.getDate();
    year = chosenDate.getYear() + 1900;

    //Set Correct Day and Date
    $("#dayViewDateLabel").html(daysOfWeek[chosenDate.getDay()+1]);
    $("#dayViewHiddenDate").html(chosenDate.getDate());
    $("#dayViewHiddenDate").show();

    employeeRows = $(".employeeViewNameColumn").length;
    tdHeight = $(window).height()/employeeRows;
    $('.employeeDayCell').height(tdHeight);

}

function fillMonthlyCalendar() {
    month = chosenDate.getMonth() + 1;
    date = chosenDate.getDate();
    year = chosenDate.getYear() + 1900;

    //get day for Start of month
    var firstDayOfMonth =  new Date(year, month - 1, 1);
    var lastDayOfMonth =  new Date(year, month, 0);
    //alert(chosenDate.getMonth());

    var htmlString = "";
    monthRows = 0;


    for(var i = 1; i<= lastDayOfMonth.getDate(); i++){
        htmlString = htmlString + "<tr>";
        for(var d = 1; d<8; d++){
            var tempDate = new Date(year, month - 1, i);
            var tempMonth = tempDate.getMonth() +1;
            var idDateString = (daysOfWeekAbrev[(tempDate.getDay() +1)]) + "tb" + (tempMonth <10 ? "0" + tempMonth: tempMonth) + (tempDate.getDate() <10 ? "0" + tempDate.getDate() : tempDate.getDate()) + (tempDate.getYear() + 1900);
            var dayClass = tempDate.getDay();
            //console.log("month: " + idDateString);
            if(tempDate.getDay()+1 == d){
                if(tempDate.getMonth() == chosenDate.getMonth()){
                    if(today.getMonth() == tempDate.getMonth() && today.getDate() == tempDate.getDate() && today.getYear() == tempDate.getYear()){//if today
                        htmlString = htmlString + "<td class='calendarCell timeBlock " + daysOfWeekAbrev[(tempDate.getDay() +1)] + " " + monthsArray[tempDate.getMonth()+1] + " today' id='" + idDateString + "'>" + "<div class='calendarTDDate'>" + tempDate.getDate() + "</div>" + "</td>";

                    }
                    else {
                        htmlString = htmlString + "<td class='calendarCell timeBlock " + daysOfWeekAbrev[(tempDate.getDay() +1)] + " " + monthsArray[tempDate.getMonth()+1] +  "'  id='" + idDateString + "'>" + "<div class='calendarTDDate'>" + tempDate.getDate() + "</div>" + "</td>";
                    }
                }
                else{
                    htmlString = htmlString + "<td class='calendarCell timeBlock " + daysOfWeekAbrev[(tempDate.getDay() +1)] + " " + monthsArray[tempDate.getMonth()+1] +  " diffMonth'  id='" + idDateString + "'>" + "<div class='calendarTDDate'>" + tempDate.getDate() + "</div>" + "</td>";
                }
                if(d!=7){
                    i++;
                }
            }

            else{

                firstDayOfMonth = new Date(tempDate.getYear()+1900, tempDate.getMonth(), 1);
                //console.log("MONTH VIEW TESTING temp date: " + tempDate);
                //console.log("MONTH VIEW TESTING d date: " + firstDayOfMonth.getDay());
                var diffMonthDate = new Date( tempDate.setDate(tempDate.getDate() - (firstDayOfMonth.getDay()+1-d)) );
                //console.log("MONTH VIEW TESTING diffMonthDate date: " + firstDayOfMonth);
                var diffMonth = diffMonthDate.getMonth() + 1;
                idDateString = (daysOfWeekAbrev[(diffMonthDate.getDay() +1)]) + "tb" + (diffMonth <10 ? "0" + diffMonth : diffMonth) +  (diffMonthDate.getDate() <10 ? "0" + diffMonthDate.getDate() : diffMonthDate.getDate()) +  (diffMonthDate.getYear() + 1900);

                if(tempDate.getMonth() == diffMonthDate.getMonth()){
                    htmlString = htmlString + "<td class='calendarCell timeBlock " + daysOfWeekAbrev[(diffMonthDate.getDay() +1)] + " " + monthsArray[diffMonthDate.getMonth()+1] + " diffMonth'  id='" + idDateString + "'>" + "<div class='calendarTDDate'>" + diffMonthDate.getDate() + "</div>" + "</td>";
                }
                else{
                    htmlString = htmlString + "<td class='calendarCell timeBlock " + daysOfWeekAbrev[(diffMonthDate.getDay() +1)] + " " + monthsArray[diffMonthDate.getMonth()+1] + " diffMonth'  id='" + idDateString + "'>" + "<div class='calendarTDDate'>" + diffMonthDate.getDate() + "</div>" + "</td>";
                }

            }
        }
        htmlString = htmlString + "</tr>";

        monthRows++;
    }
    $("#monthViewTableBody").html(htmlString);

    tdHeight = $(window).height()/monthRows;
    $('.calendarCell').height(tdHeight);
    //alert(tdHeight);


    /*for (var i = 1; i < daysOfWeek.length; i++) {
     var tempDate = new Date(year, month - 1, date - (chosenDate.getDay() - (i - 1)));
     $("#" + daysOfWeek[i] + "DateLabel").html(tempDate.getDate() + " ");
     $("#hiddenDate" + daysOfWeek[i]).html(tempDate.getMonth + "/" + tempDate.getDate() + "/" + tempDate.getYear());
     }
     var tempDate = new Date(year, month - 1, date - (chosenDate.getDay() - (1 - 1))); //Get the Date of Sunday
     $("#monthHeaderMonth").html(monthsArray[tempDate.getMonth() + 1]);*/
}


