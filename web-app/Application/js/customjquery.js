var months = [ "January", "February", "March", "April", "May", "June", 
                   "July", "August", "September", "October", "November", "December" ];
var daysOfWeek = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
   
var today = new Date();
var month = today.getMonth()+1;
var date = today.getDate();
var year = today.getYear()+1900;


//variables needed for timeBlock dragging and resizing
var currentDragOrResizeXCoordinate;
var currentDragOrResizeYCoordinate;
var currentDragOrResizeBottomYCoordinate;
var resizeGridY = $(".timeBlock").outerHeight();
var shiftTypes;
var eventCSSClass;
var eventTypeDisplay;
var eventTypeColor;
var dragging = false;
var resizing = false;


//Constants from Organization Settings
var startTimeHour = $("#startTimeHourVariable" ).html();
var startTimeMin = $("#startTimeMinVariable" ).html();
var endTimeHour = $("#endTimeHourVariable" ).html();
var endTimeMin = $("#endTimeMinVariable" ).html();
var timeInterval = $("#timeIntervalVariable" ).html();
var availabilityEvents = $("#availabilityEventsVariable" ).html();
var shiftEvents = $("#shiftEventsVariable" ).html();

var dayLabelBlockYCoordinate = $("#Suntb"+ (startTimeHour.length<2 ? "0"+startTimeHour : startTimeHour) + startTimeMin).offset().top;
var timeBlockHeight = $("#Suntb"+ (startTimeHour.length<2 ? "0"+startTimeHour : startTimeHour) + startTimeMin).outerHeight();
var timeBlockWidth = $("#Suntb"+ (startTimeHour.length<2 ? "0"+startTimeHour : startTimeHour) + startTimeMin).outerWidth(); 
var eventCount =0; //count of events on calendar

$(document).ready(function(){
    //$( "#sidebar-wrapper" ).load( "/pickupmyshift/Application/applicationSidebar.gsp" );
    //$( "#calendar-content" ).load( "/pickupmyshift/Application/calendarMonth.gsp" );
    
    
    $('#monthButton').on('click', function() {
	calendarMonthSetup();
	$("#monthButton").addClass("active")
	$("#weekButton").removeClass("active")
	$("#dayButton").removeClass("active")
    });
    $('#weekButton').on('click', function() {
	calendarWeekSetup();
	$("#monthButton").removeClass("active")
	$("#weekButton").addClass("active")
	$("#dayButton").removeClass("active")
    });
    $('#dayButton').on('click', function() {
	calendarDaySetup();
	$("#monthButton").removeClass("active")
	$("#weekButton").removeClass("active")
	$("#dayButton").addClass("active")
    }); 
    
    //if in the availability or createSchedule page
    if (window.location.pathname.indexOf("pickupmyshift/application/availability") >= 0 || 
	    window.location.pathname.indexOf("pickupmyshift/application/createSchedule") >= 0 || 
	    window.location.pathname.indexOf("pickupmyshift/application/employees") >= 0 ||
	    window.location.pathname.indexOf("pickupmyshift/application/generateSchedule") >= 0){
	var whichPage;
	//$(".panel").disableSelection();
	//Differentiate between which calendarPage
	if(window.location.pathname.indexOf("pickupmyshift/application/availability") >= 0 || 
		window.location.pathname.indexOf("pickupmyshift/application/employees") >= 0){
	    whichPage = "availability";
	    eventCSSClass = "event unavailableBlock";
	    eventTypeDisplay = "Unavailable";
	    eventTypecolor = "#f55454";
	     
	}
	else if(window.location.pathname.indexOf("pickupmyshift/application/createSchedule") >= 0 ||
		window.location.pathname.indexOf("pickupmyshift/application/generateSchedule") >= 0){
	    shiftTypes = $("#shiftTypes" ).html(); 
	    //alert(shiftTypes);
	    whichPage = "createSchedule";
	    eventCSSClass = "event shiftBlock";
	    
	    eventTypeDisplay = $("#shiftTypeDropdownText").html();
	    eventTypeColor = $("#shiftTypeDropDownColorBox").css('background-color');
	    
	    //initialize and setup popover
	    //$('[data-toggle="popover"]').popover();
	    $("#wrapper").popover({ 
		html: true,
		placement: 'top',
		trigger: "hover", 
		title: function() {
		           var content = "<b>" + $("#" + this.id).find("#shiftTypeDisplay").html() + " Shift</b> ";
		             return content;
		}, 
		selector: ".event", 
		template: '<div class="popover eventPopover" role="tooltip">' +
		    		'<div class="arrow">' +
		    		'</div>' + 
		    		'<h3 class="popover-title"></h3><div class="popover-content"></div></div>',
		content: function() {
		           var content = "<b>Day</b>: " + $("#" + this.id).find("#resizable-text").html().split(" ")[0] + " <br>" +
		               "<b>Time</b>: " + $("#" + this.id).find("#formattedTimeDisplay").html() + " <br>" +
		           "<b># of Shifts</b>: " + $("#" + this.id).find("#numOfEmployees").html().split(" ")[0] + "<br>" +
		           	"<b>Notes</b>: " + $("#" + this.id).find("#notesDisplay").html() ;
		             return content;
		}
		}); 
		
		
	    $("#wrapper" ).on('click', '.shiftType', function(e) {
		
		//eventCSSClass = eventCSSClass + " shiftType-" + e.target.id.split(" ")[0];
		//alert(e.target.id.split(" ")[1]);
		$("#shiftTypeDropdownText").html(e.target.id.split(" ")[0]);
		$("#shiftTypeDropDownColorBox").css('background-color' , '' + e.target.id.split(" ")[1] + '' )
		eventTypeDisplay = $("#shiftTypeDropdownText").html();
		eventTypeColor = $("#shiftTypeDropDownColorBox").css('background-color');
	    });
	    $("#wrapper" ).on('click', '.shiftTypeModal', function(e) {
		
		//eventCSSClass = eventCSSClass + " shiftType-" + e.target.id.split(" ")[0];
		//alert(e.target.id.split(" ")[1]);
		$("#shiftTypeDropdownTextModal").html(e.target.id.split(" ")[0]);
		$("#shiftTypeDropDownColorBoxModal").css('background-color' , '' + e.target.id.split(" ")[1] + '' )
		
	    });
	    $("#wrapper" ).on('click', '#saveShiftDetailsModal', function(e) {
		saveShiftDetailModal(); 
	    });
	    
	    $("#wrapper" ).on('change', ':checkbox', function(e) {
		//alert(e.target.id);
		var checked = $("#" + e.target.id).is(":checked");
		var checkboxShiftType = e.target.id.split("-")[0];
		var eventDivArray = $(".event");
		
		for (var i =0; i< $(".event").length; i++){
		    console.log($(".event").eq(i).find("#shiftTypeDisplay").html());
		    if(checked){
			if($("#shiftTypeDisplay", "#" + eventDivArray[i].id).html() === checkboxShiftType){
				$(".event").eq(i).show();
			}
		    }
		    else{
			if($("#shiftTypeDisplay", "#" + eventDivArray[i].id).html() === checkboxShiftType){
				$(".event").eq(i).hide();
			}
		    }
		    
		}
		fixOverLappingEventDivs2();
		
	    });
	    //alert("up: " + shiftEvents.trim().length + "|");
	    if(shiftEvents.trim().length > 0){
		populateSavedShifts();
	    }
	    
	}
	var mousedown = false;
	
	//CLICKING ON ANY TIMEBLOCK IN CALENDAR
	var startClickBlockOffset;
	var startClickBlockID;
	var startClickYCoordinate;
	var startClickXCoordinate;
	var eventTimeAdded = false;
	var eventDraggedToDifferentStartTime = false;
	var newEventInCreationProcess = false;
	
	//Populate events based on page
	if(window.location.pathname.indexOf("pickupmyshift/application/availability") >= 0){
	    populateSavedAvailability();
	}
	
	$("#wrapper" ).on('mousedown', '.timeBlock', function(e) {
	    
	    mousedown = true;
	    //pauseEvent(e);
	    startClickYCoordinate = e.pageY;
	    startClickXCoordinate = e.pageX;
	   // startClickBlockID = $("#" + e.target.id).closest('div[id^="event"]');
	   // startClickBlockID = e.target.id;
	    //console.log(e.target + ", " + e.target.id);
	    
	    if (e.target.id.indexOf("tb") >= 0){
		startClickBlockID = e.target.id;
	    }
	    else if ($(e.target).hasClass('eventBlockInnerDiv')){
		console.log("HELLO");
		startClickBlockID = $(e.target).closest('[id^="event"]').attr("id");
	    }
	    else{
		startClickBlockID = $("#" + e.target.id).closest('[id^="event"]').attr("id");
	    }
	    
	    if($(e.target).hasClass('timeBlock') && e.which == 1 && newEventInCreationProcess == false){
		
		newEventInCreationProcess = true;
		eventTimeAdded = false;
		$("#wrapper").disableSelection(); 
		    
		//get the Y position coordinate of the top of Calendar
		dayLabelBlockYCoordinate = $("#Suntb"+ (startTimeHour.length<2 ? "0"+startTimeHour : startTimeHour) + startTimeMin).offset().top;
		//update the height of all timeBlocks. This changes with window resize.
		timeBlockHeight = $("#Suntb"+ (startTimeHour.length<2 ? "0"+startTimeHour : startTimeHour) + startTimeMin).outerHeight();
		
		//get the ID of the mousedown target and Y coordinate
		
		
		//Insert Event Div where Mouse is initially clicked
		$("#" + startClickBlockID).append("<div class='" + eventCSSClass + " draggable resizable' id='event" + startClickBlockID.substring(0,3) + eventCount + "' " +
			"style= 'width:90%; height:" + 0 + "px; background-color:" + eventTypeColor + "'>" + "</div>");
		
		
		draggableFunction();
		//Jquery UI Drag Code
		
		    
		//Jquery UI Resize Code
		resizableFunction();
	    }
	}); 
	var diff =0;
	$("#wrapper" ).on('mousemove', '.timeBlock', function(e) {
	    
	    //pauseEvent(e);
	    if(newEventInCreationProcess==true){
		$(".popover").hide();
		//get current Y position of bottom of Event Div
		currentDragOrResizeBottomYCoordinate = e.pageY;
		
		//Adjust vertical div placement to start at top of clicked TimeBlock instead of actual mouse click
		distanceBetweenClickAndTopOfTimeBlock = startClickYCoordinate - $("#"+startClickBlockID).offset().top;
		
		//adjust height of div as mouse is moving. without this line div does not adjust height while mouse moves.
		$("#event"+ startClickBlockID.substring(0,3)+eventCount).height( (e.pageY + distanceBetweenClickAndTopOfTimeBlock - (startClickYCoordinate)) -5);
		
		
		console.log((e.pageY + distanceBetweenClickAndTopOfTimeBlock - (startClickYCoordinate)) -5);
		//If event div has been created, it's height is greater than x pixels, and event detail spans and buttons have not been added.
		if((e.pageY + distanceBetweenClickAndTopOfTimeBlock - (startClickYCoordinate)) -5 >30 && eventTimeAdded == false){
		    
		    var tempTimeCalc = calculateTimeFromPosition(currentDragOrResizeXCoordinate, startClickYCoordinate, currentDragOrResizeBottomYCoordinate);
		    //console.log("new event: " + tempTimeCalc);
		    $("#event"+ startClickBlockID.substring(0,3) + eventCount).append("" + 
			    	"<div class='eventBlockInnerDiv'>" +
    			   	     "<span class='insideEventBlock'  id='shiftTypeDisplay' >" + 
    			   	      eventTypeDisplay +
    			   	     "</span> " +
    			   	"</div>" +
    			   	"<div class='eventBlockInnerDiv'>" +
    			   	     "<small>" + 
        			     "<span class='insideEventBlock' id='formattedTimeDisplay' >" +
        			     calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, startClickYCoordinate, currentDragOrResizeBottomYCoordinate) + 
        			     "</span> " +
        			     (whichPage == "createSchedule" ? "<br><span class='insideEventBlock' id='numOfEmployees'>" + "1 Shift" + "</span> " : "") +
        			     "</small>" +
    			   	"</div>" +
    			   	"<span class='insideEventBlock' id='notesDisplay'>" + "dumb" + "</span> " +
		    		"<span id='resizable-text'  style='display:none'>" + startClickBlockID.substring(0,3) + " " + calculateTimeFromPosition(currentDragOrResizeXCoordinate, startClickYCoordinate, currentDragOrResizeBottomYCoordinate) + "</span> " +
			    	"<span id='createdInTimeBlock' style='display:none'>" + startClickBlockID + "</span> " +
			    	"<span id='shiftType' style='display:none'>" + eventTypeDisplay + "</span> " +
			    	"<span id='weightOfDiv' style='display:none'>" + 0 + "</span> " +
			    	"<button type='button' class='close eventDelete' aria-label='Close' style='position:absolute; top:0; right:0;'><span aria-hidden='true'>&times;</span></button>" +
		    		"<span id='startBlockNumber' style='display:none'>0</span> " +
		    		"<span id='endBlockNumber' style='display:none'>0</span> ");
		    eventTimeAdded = true;
		}
		//add event time and details.
		
		$("#resizable-text", "#event"+ startClickBlockID.substring(0,3)+eventCount).html(startClickBlockID.substring(0,3) + " " + calculateTimeFromPosition(currentDragOrResizeXCoordinate, startClickYCoordinate, currentDragOrResizeBottomYCoordinate));
		$("#formattedTimeDisplay", "#event"+ startClickBlockID.substring(0,3)+eventCount).html(calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, startClickYCoordinate, currentDragOrResizeBottomYCoordinate));
		
		//fixOverlappingEventDivs();
	    }
	    
	    
	});
	$("#wrapper" ).on('mouseup', '.timeBlock', function(e) {
	    //If event div was created and dragged up, delete it.
	    if(newEventInCreationProcess==true && $(e.target).hasClass('timeBlock') && startClickYCoordinate>e.pageY){
		$("#event"+ startClickBlockID.substring(0,3)+eventCount).remove();
		newEventInCreationProcess=false;
	    }
	    //if mouseup was on a timeBlock only, left click only. Does not apply to drag events since their class is not timeBlock OR when new event div creation is in progress
	    else if(newEventInCreationProcess){ //added because mousedown triggered also when clicking on any element inside timeBlock
		
		console.log(e.target.id);
		//Calculate coordinates and final height of event div
		currentDragOrResizeXCoordinate = $(this).offset().left;
	        currentDragOrResizeYCoordinate = $(this).offset().top;
	        //if mouseup on blank space it'll know the timeblock ID, otherwise it must calcualte from resizable text
	        if($(e.target).hasClass('timeBlock')){
	            currentDragOrResizeBottomYCoordinate = ($("#" + e.target.id).offset().top + $("#" + e.target.id).outerHeight(true)) -2 ;
	            console.log ("here: " + currentDragOrResizeBottomYCoordinate);
	        }
	        else{
	            //alert($("#resizable-text", "#event"+ startClickBlockID.substring(0,3) + eventCount).html().substring(11,15));
	            
	            currentDragOrResizeBottomYCoordinate = $("#" + startClickBlockID.substring(0,3) + "tb" + $("#resizable-text", "#event"+ startClickBlockID.substring(0,3) + eventCount).html().substring(11,15)).offset().top;
	            
	        }
	        
	        
	        //If Event Details not added yet, usually when it's a immediate click down and up event, add event spans and buttons
	    	if(eventTimeAdded == false){
	    	    $("#event"+ startClickBlockID.substring(0,3) + eventCount).append("" +
	    		"<div class='eventBlockInnerDiv'>" +
		   	     "<span class='insideEventBlock'  id='shiftTypeDisplay' >" + 
		   	       eventTypeDisplay +
		   	     "</span> " +
		   	  "</div>" +
		   	"<div class='eventBlockInnerDiv'>" +
		   	     "<small>" + 
			     "<span class='insideEventBlock' id='formattedTimeDisplay' >" +
			     calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, startClickYCoordinate, currentDragOrResizeBottomYCoordinate) + 
			     "</span> " +
			     (whichPage == "createSchedule" ? "<br><span class='insideEventBlock' id='numOfEmployees'>" + "1 Shift" + "</span> " : "") +
			     "</small>" +
		   	"</div>" +
		   	"<span class='insideEventBlock' id='notesDisplay'>" + "dumb" + "</span> " +
	    	    	"<span id='resizable-text'  style='display:none'>" + startClickBlockID.substring(0,3) + " " +  calculateTimeFromPosition(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate) + "</span> " +
	    		"<span id='createdInTimeBlock' style='display:none'>" + startClickBlockID + "</span> " +
	    		"<span id='shiftType' style='display:none'>" + eventTypeDisplay + "</span> " +
	    		"<span id='weightOfDiv' style='display:none'>" + 0 + "</span> " +
	    		"<button type='button' class='close eventDelete' aria-label='Close' style='position:absolute; top:0; right:0;'><span aria-hidden='true'>&times;</span></button>" +
	    		"<span id='startBlockNumber' style='display:none'>0</span> " +
	    		"<span id='endBlockNumber' style='display:none'>0</span> ");
	    	    eventTimeAdded = true;
	    	}
	    	
	    	console.log("#event"+ startClickBlockID.substring(0,3)+eventCount);
	    	//adjust height to fit to the entire timeblock needed
	    	$("#event"+ startClickBlockID.substring(0,3)+eventCount).height(currentDragOrResizeBottomYCoordinate - $("#event"+ startClickBlockID.substring(0,3)+eventCount).offset().top); 
	    	//add event time and details to div
	    	$("#resizable-text", "#event"+eventCount).html(startClickBlockID.substring(0,3) + " " + calculateTimeFromPosition(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
	    	$("#formattedTimeDisplay", "#event"+ startClickBlockID.substring(0,3)+eventCount).html(calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, startClickYCoordinate, currentDragOrResizeBottomYCoordinate));
	    		
	    	
	    	//fixOverlappingEventDivs();
	    	eventCount++;
	    	newEventInCreationProcess = false;
	    	fixOverLappingEventDivs2();
	    }
	    
	    //if mouseup was on a draggable only. left click only.
	    else if(dragging == true){
		
		
		//alert(e.target.id);
		//alert($("#resizable-text", "#"+e.target.id).html().substring(0,3) + "tb" + $("#resizable-text", "#"+e.target.id).html().substring(4,8));
		console.log("#"+startClickBlockID);
		var newDivHomeBlock = $("#resizable-text", "#"+startClickBlockID).html().substring(0,3) + "tb" + $("#resizable-text", "#"+startClickBlockID).html().substring(4,8);
		var newDivID = startClickBlockID;
		var newDivHeight = $("#" + startClickBlockID).outerHeight(true);
		var newResizableText = $("#resizable-text", "#"+startClickBlockID).html();
		var newNumOfEmployees = $("#numOfEmployees", "#"+startClickBlockID).html();
		var newDisplayText = $("#shiftTypeDisplay", "#"+startClickBlockID).html();
		var newFormattedText = $("#formattedTimeDisplay", "#"+startClickBlockID).html();
		var newShiftType = $("#shiftType", "#"+startClickBlockID).html();
		
		var bcolor = $("#" + startClickBlockID).css('background-color');
		$("#" + startClickBlockID).remove();
		//eventCount++;
		$("#" + newDivHomeBlock ).append("<div class='" + eventCSSClass + " draggable resizable ' id='" + newDivID + "' " +
			"style= 'width:90%; height:" + newDivHeight + "px'>" + "</div>");
		$("#"+ newDivID).append("" +
			"<div class='eventBlockInnerDiv'>" +
		   	     "<span class='insideEventBlock'  id='shiftTypeDisplay' >" + newDisplayText + "</span> " +
		   	  "</div>" +
		   	"<div class='eventBlockInnerDiv'>" +
		   	     "<small>" + 
			     "<span class='insideEventBlock' id='formattedTimeDisplay' >" +
			     newFormattedText +
			     "</span> " +
			     (whichPage == "createSchedule" ? "<br><span class='insideEventBlock' id='numOfEmployees'>" + newNumOfEmployees + "</span> " : "") +
			     "</small>" +
		   	"</div>" +
		   	"<span class='insideEventBlock' id='notesDisplay'>" + "dummbbb" + "</span> " +
			"<span id='resizable-text'  style='display:none'>" + newResizableText.substring(0,3) + " " +  calculateTimeFromPosition(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate) + "</span> " +
	    		"<span id='createdInTimeBlock' style='display:none'>" + newDivHomeBlock + "</span> " +
	    		"<span id='shiftType' style='display:none'>" + newShiftType + "</span> " +
	    		"<span id='weightOfDiv' style='display:none'>" + 0 + "</span> " +
	    		"<button type='button' class='close eventDelete' aria-label='Close' style='position:absolute; top:0; right:0;'><span aria-hidden='true'>&times;</span></button>" +
	    		"<span id='startBlockNumber' style='display:none'>0</span> " +
	    		"<span id='endBlockNumber' style='display:none'>0</span> ");
		$("#"+ newDivID).css('background-color', "" + bcolor + "");
		//alert(bcolor);
		draggableFunction();
		resizableFunction();

		dragging = false;
		fixOverLappingEventDivs2();
	    }
	    
	    //single click on a event div, no drag
	    else if(($(e.target).hasClass('draggable') || ($(e.target).hasClass('insideEventBlock')))
		    && Math.abs(startClickYCoordinate-e.pageY) <5 && Math.abs(startClickXCoordinate-e.pageX<5) && e.which == 1 && dragging==false && resizing == false ){
		
		//alert(startClickYCoordinate + "," + e.pageY);
		$('#myModal').modal('show');
		//Fill in Modal with Shift Details
		//$('#myModalLabel').html($("#shiftType", "#"+e.target.id).html());
		
		//$('.modal-body').html("boo");
		fillInShiftDetailModalFields(e);
		//alert(e.target.id);
		fixOverLappingEventDivs2();
	    }
	    
	    mousedown= false;
	    //alert(e.which == 1);
	    
	    if(startClickYCoordinate!=e.pageY && e.which == 1){
	    
	    }
	    $("#wrapper").enableSelection();
	    $(document.documentElement).enableSelection();
	    
	});
	
	// when the mouse leaves the calendar area
	$("#wrapper").on('mouseleave', function(e) {
	    $("#wrapper").disableSelection();
	    $(document.documentElement).disableSelection();
	    //$(e.target).mouseup();
	});
	$("#wrapper").on('mouseenter', function(e) {
	    //alert(newEventInCreationProcess);
	    //$(e.target).mouseup();
	    
	    
	});
	$(window).on('mouseup', function(e){
	    //mousedown= false; 
	    //$("#wrapper").mouseup();
	     //alert("mouseup");
	 });
	      
	//ON WINDOW RESIZE FUNCTION
	var resizeTimeout;
	$(window).on('resize', function(e){
	    clearTimeout(resizeTimeout);
	    resizeTimeout = setTimeout(function(){    
		if(e.target == window){
			$(".draggable").each(function(){
			    	
			    var resizeEndBlock = $("#resizable-text", "#" + $(this).attr("id")).html().substring(0,3) + "tb" + $("#resizable-text", "#" + $(this).attr("id")).html().substring(11,15)
			    var resizeStartBlock = $("#resizable-text", "#" + $(this).attr("id")).html().substring(0,3) + "tb" + $("#resizable-text", "#" + $(this).attr("id")).html().substring(4,8)
			    
			    $(this).height($("#" + resizeEndBlock).offset().top - $("#" + resizeStartBlock).offset().top);
			});
		    }
	    }, 0);
	    
	    
	});
	
	//Function for deleting Event Divs
	$("#wrapper" ).on('click', '.eventDelete', function(e) {
	    $(".popover").hide(); 
	    $(this).parent().remove();
	    //eventCount--;
	    fixOverLappingEventDivs2();
	    //console.log("delete fix");
	});
	
	
	//Saving Availability
	$("#buttonSaveAvailability" ).on('click', function(e) {
	    saveUnavailabilityToServer();
	    alert();
	});
	$("#buttonSaveShifts" ).on('click', function(e) {
	    saveShiftsToServer();
	});
	
	
        
    }
    
    else if(false ){

    }
});
function pauseEvent(e){
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    e.cancelBubble=true;
    e.returnValue=false;
    return false;
}
function saveUnavailabilityToServer(){
    var tempString ="";
    for(var i=0; i< $(".event").length; i++){
	tempString = tempString + $(".event").eq(i).find("#resizable-text").html() + "," + 
		$(".event").eq(i).find("#shiftType").html() + "," +
		$(".event").eq(i).find("#notesDisplay").html().replace(/,/g , "/comma/").replace(/;/g , "/apostrophe/") + ";"
	
    }
    
    alert(tempString);
    $.ajax({
	method: "POST",
	url: "/pickupmyshift/application/saveAvailability",
	data: { Unavailability: tempString}
    })
    .done(function( msg ) {
	alert( "Data Saved: " + msg );
	$("#saveSuccess").css("display", "inline");
	$('#saveSuccess').delay(5000).fadeOut(400)
    });
}
function saveShiftsToServer(){
    var tempString ="";
    for(var i=0; i< $(".event").length; i++){
	tempString = tempString + 
		$(".event").eq(i).find("#resizable-text").html() + "," + 
		$(".event").eq(i).find("#shiftType").html() + "," + 
		$(".event").eq(i).find("#numOfEmployees").html() + "," +
		$(".event").eq(i).find("#notesDisplay").html().replace(/,/g , "/comma/").replace(/;/g , "/apostrophe/") + ";"
	
    }
    
    //alert(Sunday);
    $.ajax({
	  method: "POST",
	  url: "/pickupmyshift/application/saveShifts",
	  data: { Shifts: tempString}
    })
    .done(function( msg ) {
	alert( "Data Saved: " + msg );
	$("#saveSuccess").css("display", "inline");
	$('#saveSuccess').delay(5000).fadeOut(400)
    });
}
function saveShiftDetailModal(){
    
    var editingEventID =  $("#currentlyEditingEventID").html();
    console.log(editingEventID);
    //alert($("#shiftTypeDropDownColorBoxModal").css('background-color')); 
    $("#" + editingEventID).css('background-color', $("#shiftTypeDropDownColorBoxModal").css('background-color')); 
    //$("#currentlyEditingEventID").css('background-color', "" + bcolor + "");
    
    /////////////////////////////////////////////////
    //change day if different day
    var newDivHomeBlock = $("#daySelector").val().substring(0,3) + "tb" + ($("#startTimeModal").val().length !=4 ? "0" + $("#startTimeModal").val() : $("#startTimeModal").val());
    var newDivEndBlock = $("#daySelector").val().substring(0,3) + "tb" + ($("#endTimeModal").val().trim().length !=4 ? "0" + $("#endTimeModal").val().trim() : $("#endTimeModal").val().trim());
    alert(editingEventID);
    //alert($("#endTimeModal").val().trim());
    var newDivID = editingEventID;
    //alert($("#endTimeModal").val().trim() == ""+endTimeHour + endTimeMin);
    
    //If event is at the end of the day
    if($("#endTimeModal").val().trim() == ""+endTimeHour + endTimeMin){
	var tempEndNum = ""+endTimeHour + endTimeMin;
	tempEndNum = tempEndNum - timeInterval;
	//alert(tempEndNum);

	newDivEndBlock = $(".timeBlock.Sunday").last().attr("id");
	var newDivHeight = ($("#" + newDivEndBlock).offset().top + $("#" + newDivEndBlock).outerHeight()-4) - $("#" + newDivHomeBlock).offset().top;
    }
    else{
	var newDivHeight = $("#" + newDivEndBlock).offset().top - $("#" + newDivHomeBlock).offset().top;
    }
    //////////////////////////////////////
    var newResizableText = $("#resizable-text", "#"+editingEventID).html();
    var newNumOfEmployees = $("#numOfEmployeesInputModal").val();
    var newDisplayText = $("#shiftTypeDisplay", "#"+editingEventID).html();
    var newFormattedText = $("#formattedTimeDisplay", "#"+editingEventID).html();
    var newShiftType = $("#shiftType", "#"+editingEventID).html();
    var newNotes = $("#shiftNotesModal").val();
    
    var bcolor = $("#" + editingEventID).css('background-color');  
    $("#" + editingEventID).remove();
    //alert(newDivEndBlock); 
    $("#" + newDivHomeBlock ).append("<div class='" + eventCSSClass + " draggable resizable ' id='" + newDivID + "' " +
	    "style= 'width:90%; height:" + newDivHeight + "px'>" + "</div>");
    
    $("#"+ newDivID).append("" +
	    "<div class='eventBlockInnerDiv'>" + 
	    
	    "<span class='insideEventBlock'  id='shiftTypeDisplay' >" + newDisplayText + "</span> " +
	    "</div>" +
	    "<div class='eventBlockInnerDiv'>" +
	    	"<small>" + 
	    	"<span class='insideEventBlock' id='formattedTimeDisplay' >" +
	    		newFormattedText +
	    		"</span> " +
	    		"<br><span class='insideEventBlock' id='numOfEmployees'>" + (newNumOfEmployees > 1 ? newNumOfEmployees + " Shifts" : newNumOfEmployees + " Shift") + "</span> " +
	    	"</small>" +
	    "</div>" +
	    "<span class='insideEventBlock' id='notesDisplay'>" + newNotes + "</span> " +
	    "<span id='resizable-text'  style='display:none'>" + newResizableText.substring(0,3) + " " + ($("#startTimeModal").val().trim().length !=4 ? "0" + $("#startTimeModal").val().trim() : $("#startTimeModal").val().trim()) + " - "  +  ($("#endTimeModal").val().trim().length !=4 ? "0" + $("#endTimeModal").val().trim() : $("#endTimeModal").val().trim()) + "</span> " +
	    "<span id='createdInTimeBlock' style='display:none'>" + newDivHomeBlock + "</span> " +
	    "<span id='shiftType' style='display:none'>" + newShiftType + "</span> " +
	    "<span id='weightOfDiv' style='display:none'>" + 0 + "</span> " +
	    "<button type='button' class='close eventDelete' aria-label='Close' style='position:absolute; top:0; right:0;'><span aria-hidden='true'>&times;</span></button>" +
	    "<span id='startBlockNumber' style='display:none'>0</span> " +
    	    "<span id='endBlockNumber' style='display:none'>0</span> ");
    $("#"+ newDivID).css('background-color', "" + bcolor + "");
    draggableFunction();
    resizableFunction();
    currentDragOrResizeXCoordinate = $("#" + newDivID).offset().left;
    currentDragOrResizeYCoordinate = $("#" + newDivHomeBlock).offset().top+2;
  //If event is at the end of the day
    
    if($("#endTimeModal").val().trim() == ""+endTimeHour + endTimeMin){
	currentDragOrResizeBottomYCoordinate = ($("#" + newDivEndBlock).offset().top + $("#" + newDivEndBlock).outerHeight()) -4 ;
    }
    else{
	currentDragOrResizeBottomYCoordinate = ($("#" + newDivEndBlock).offset().top) -4 ;
    }
    //////////////////////////////////////
    
    $("#resizable-text", "#" + newDivID).html($("#daySelector").val().substring(0,3) + " " + calculateTimeFromPosition(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
    $("#formattedTimeDisplay", "#" + newDivID).html(calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
    //alert(calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
    ////////////////////////////////////////////////////////
     
    ///////////////////////////////////////////////
    $('#myModal').modal('hide');
    fixOverLappingEventDivs2();
    
}
function fillInShiftDetailModalFields(e){
  //$('.modal-body').html("boo");
    //set shift and color
    
    $("#currentlyEditingEventID").html(e.target.id);
    $("#shiftTypeDropdownTextModal").html($("#shiftType", "#"+e.target.id).html());
    $("#shiftTypeDropDownColorBoxModal").css('background-color' , $("#" + e.target.id).css('background-color') );
    
    var shortDay = $("#resizable-text", "#"+e.target.id).html().substring(0,3);
    if(shortDay == "Sun"){
	$("#daySelector").val("Sunday");
    }
    else if(shortDay == "Mon"){
	$("#daySelector").val("Monday");
    }
    else if(shortDay == "Tue"){
	$("#daySelector").val("Tuesday");
    }
    else if(shortDay == "Wed"){
	$("#daySelector").val("Wednesday");
    }
    else if(shortDay == "Thur"){
	$("#daySelector").val("Thursday");
    }
    else if(shortDay == "Fri"){
	$("#daySelector").val("Friday");
    }
    else if(shortDay == "Sat"){ 
	$("#daySelector").val("Saturday");
    }
    //alert($("#numOfEmployees", "#"+e.target.id).html());
    $("#numOfEmployeesInputModal").val($("#numOfEmployees", "#"+e.target.id).html().split(" ")[0]);
    $("#shiftNotesModal").val($("#notesDisplay", "#"+e.target.id).html());
    
    //alert($("#formattedTimeDisplay", "#"+e.target.id).html().substring(0,4) + " " + $("#formattedTimeDisplay", "#"+e.target.id).html().substring(4,6));
    var stringFormatTime = $("#resizable-text", "#"+e.target.id).html();
    //alert(stringFormatTime[1].trim().indexOf(":"));
    //DAY HHMM - HHMM
    //012345678901234
    var tempStringStart = (parseInt(stringFormatTime.substring(4,6)) > 12 ? parseInt(stringFormatTime.substring(4,6))-12 : parseInt(stringFormatTime.substring(4,6))) + ":" + 
    stringFormatTime.substring(6,8) + " " + (parseInt(stringFormatTime.substring(4,6)) >= 12 ? "PM" : "AM");
    var tempStringEnd = (parseInt(stringFormatTime.substring(11,13)) > 12 ? parseInt(stringFormatTime.substring(11,13))-12 : parseInt(stringFormatTime.substring(11,13))) + ":" + 
    stringFormatTime.substring(13,15) + " " + (parseInt(stringFormatTime.substring(11,13)) >= 12 ? "PM" : "AM");
    //alert(tempStringEnd);
    $('[id=startTimeModal]  option').filter(function() { 
	return ($(this).text() == tempStringStart); //To select Blue
    }).prop('selected', true);
    
    $('[id=endTimeModal]  option').filter(function() { 
	return ($(this).text() == tempStringEnd); //To select Blue
    }).prop('selected', true);
    
    
    
}
var startTimeTest = new Date().getTime();
var endTimeTest = new Date().getTime();
console.log("duration: " + (endTimeTest - startTimeTest));
function fixOverLappingEventDivs2(){
    //console.log("fixing");
    
    var eventTimeMap = {}; //contains timeblock ids as keys and event div ids as values
    var timeBlockArray = $(".timeBlock.Sunday");
    //loop through all event divs and builds a log of timeblocks and the event divs in them
    var eventDivArray = $(".event:visible");
    //console.log("Event Div Array: " + eventDivArray.toString());
    for (var i =0; i< eventDivArray.length; i++){
	
	//console.log("i = " + i);
	//console.log("eventDivArray[i].id = " + eventDivArray[i].id);
	if(eventDivArray[i].id){
	    var eventTime = $("#resizable-text", "#"+eventDivArray[i].id).html().substring(4,15);
	    var eventDay = $("#resizable-text", "#"+eventDivArray[i].id).html().substring(0,3);
	}
	else{
	    continue;
	}
	//loop through all time blocks
	
	for(var t = 0; t<timeBlockArray.length; t++){
	    var currentTimeBlock = parseInt(timeBlockArray[t].id.substring(5,9));
	    if(currentTimeBlock >= eventTime.substring(0,4) && currentTimeBlock < eventTime.substring(6,11)){
		var timeBlockIDString = (eventDay + timeBlockArray[t].id.substring(3,9)).toString();
		if(timeBlockIDString in eventTimeMap){ 
		    var tempString = eventTimeMap[timeBlockIDString];
		    eventTimeMap[timeBlockIDString] = tempString + "," + i
		}
		else{
		    eventTimeMap[timeBlockIDString] = i.toString();
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
    var array_values = new Array(); // array of event divs comma separated in timeblocks (0,1,2)
    for (var key in eventTimeMap) {
        array_keys.push(key);
        array_values.push(eventTimeMap[key]);
    }
    //console.log(JSON.stringify(array_values));
    var weightOfDivsMap = {}; //holds weights for each div (divNumber -> weight)
    //calculate the weight for each div (used for left position, determined by height of div)
    for (var line=0; line<array_values.length; line++){
	for (var d=0;d<array_values[line].split(",").length; d++){
	    if(array_values[line].split(",")[d] in weightOfDivsMap){
		var tempWeight = weightOfDivsMap[array_values[line].split(",")[d]] +1;
		
		/*
		for(var s= 0; s<shiftTypes.split(",").length; s++){
		    if(shiftTypes.split(",")[s].split(" ")[0] === $("#shiftType", "#"+eventDivArray[array_values[line].split(",")[d]].id).html()    ){
			tempWeight = tempWeight * ((shiftTypes.split(",").length-(s)) * 100);
			alert(tempWeight);
		    } 
		}*/
		
		weightOfDivsMap[array_values[line].split(",")[d]] = parseInt(tempWeight);
		
	    }
	    else{//weightOfDivsMap doesn't have this div
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
    
    //Calculate the collisions for each div
    var maxCollisionMap = {}; //holds  max collisions for each div Num (divNumber -> maxCollisions)
    var maxCollisionListMap ={} //holds list of divs for the max collision (divNumber -> list of divs during max collision (0,1,2))
    for (var line=0; line<array_values.length; line++){
	for (var d=0;d<array_values[line].split(",").length; d++){
	    if(array_values[line].split(",")[d] in maxCollisionMap){
		var tempMax = maxCollisionMap[array_values[line].split(",")[d]];
		if(array_values[line].split(",").length > tempMax){
		    maxCollisionMap[array_values[line].split(",")[d]] = array_values[line].split(",").length;
		    maxCollisionListMap[array_values[line].split(",")[d]] = array_values[line];
		}
		
		
	    }
	    else{
		maxCollisionMap[array_values[line].split(",")[d]] = array_values[line].split(",").length;
		maxCollisionListMap[array_values[line].split(",")[d]] = array_values[line];
	    }
	    
	}
    }
   //console.log(JSON.stringify(maxCollisionMap));
    
    //Adjust Widths
    var totalParentSpace = 90;
    var divWidthsMap = {}
    for (var key in maxCollisionMap) {
	var remainingParentSpace = totalParentSpace;
	var tempCollisions = maxCollisionMap[key];
	for(var z =0; z< maxCollisionListMap[key].split(",").length; z++){//loop through other collision divs to check if they collided with more elsewhere
		var otherCollisionDiv = maxCollisionListMap[key].split(",")[z];
		if(maxCollisionMap[otherCollisionDiv] > maxCollisionMap[key]){ //if other div collided with more elsewhere, it will be smaller width than expected
		    var otherDivWidth = totalParentSpace/maxCollisionMap[otherCollisionDiv];
		    remainingParentSpace = remainingParentSpace - otherDivWidth; 
		    tempCollisions--;
		}
	}
	var divWidth = remainingParentSpace/tempCollisions;
	$("#"+eventDivArray[key].id).css("width", divWidth + "%");
	
	divWidthsMap[key] = divWidth;
    }
    
    //Set initial Left Positions
    //console.log("maxCollisionListMap: " + JSON.stringify(maxCollisionListMap));
    var divLeftsMap = {}
    for (var key in maxCollisionListMap) {
	var tempCollisionArray = maxCollisionListMap[key].split(",");
	
	tempCollisionArray.sort(function(a,b) { return parseFloat(weightOfDivsMap[b]) - parseFloat(weightOfDivsMap[a]) } );
	
	//console.log(tempCollisionArray.toString());
	var divLeft = 0;
	for(var tca=0; tca<tempCollisionArray.length; tca ++){
	    if(key!=tempCollisionArray[tca]){
		divLeft = divLeft + divWidthsMap[tempCollisionArray[tca]];
		//console.log ("left: " + divLeft);
	    }
	    else{
		break; 
	    }
	}
	$("#"+eventDivArray[key].id).css("left", divLeft + "%");
	divLeftsMap[key] = divLeft;
    }
    //AdjustLeft Positions
    for (var key in maxCollisionListMap) {
	//console.log("key: " + key + " value: " + maxCollisionListMap[key]);
	var tempCollisionArray = maxCollisionListMap[key].split(",");
	tempCollisionArray.sort(function(a,b) { return parseFloat(weightOfDivsMap[b]) - parseFloat(weightOfDivsMap[a]) } );
	var filledPositionsMap = {};
	//Get Taken positions in max collisions time block
	for(var tca=0; tca<tempCollisionArray.length; tca ++){
	    if(key!=tempCollisionArray[tca]){
		for(var pcount=Math.round(divLeftsMap[tempCollisionArray[tca]]); pcount<( divLeftsMap[tempCollisionArray[tca]] + divWidthsMap[tempCollisionArray[tca]]) ;pcount++){
		    filledPositionsMap[pcount] = 1;
		}
		    
		//filledPositionsArray.push(divLeftsMap[tempCollisionArray[tca]] + "+" + divWidthsMap[tempCollisionArray[tca]]);
	    }
	}
	//console.log("FilledPositionMap : " + JSON.stringify(filledPositionsMap));
	//see if key div is overlapping another space
	
	for(var tca=0; tca<tempCollisionArray.length; tca ++){
	    //alert( $("#resizable-text", "#"+$(".event").get(key).id).html() + " and " + $("#resizable-text", "#"+$(".event").get(tempCollisionArray[tca]).id).html());
	    if(collision($("#"+eventDivArray[key].id), $("#"+eventDivArray[tempCollisionArray[tca]].id) ) && key!=tempCollisionArray[tca]){
		//alert(tempCollisionArray.toString());
		//alert("collision: " + $("#resizable-text", "#"+$(".event").get(key).id).html() + " and " + $("#resizable-text", "#"+$(".event").get(tempCollisionArray[tca]).id).html());
		//if it is overlapping, find an empty space for the current width
		var space = 0;
		var largestAvailableSpace = 0;
		var largestAvailableLeft = 0; 
		for(var fpa=0; fpa<totalParentSpace; fpa ++){
		    //alert(filledPositionsArray[fpa+1]);
		    if(!(fpa in filledPositionsMap)){
			if(space == 0){
			    largestAvailableLeft = fpa;
			}
			space++;
			if(space > largestAvailableSpace){
			    largestAvailableSpace = space;
			}
			if(space == divWidthsMap[key]){
			    
			    break;
			}
		    }
		    else{
			space = 0;
		    }
		    /*
		    var space = filledPositionsArray[fpa+1].split("+")[0] -  (filledPositionsArray[fpa].split("+")[0] + filledPositionsArray[fpa].split("+")[1]);
			 
		    if(space > 0 && space <= divWidthsMap[key]){
			$(".event").eq(key).css("left", filledPositionsArray[fpa].split("+")[0] + "%");
		    }
		    */
		}
		alert("space " + space + " largestspace: " + largestAvailableSpace + " left: " + largestAvailableLeft);
		$("#"+eventDivArray[key].id).css("left", largestAvailableLeft + "%");
		divLeftsMap[key] = largestAvailableLeft;
		$("#"+eventDivArray[key].id).css("width", largestAvailableSpace + "%");
		divWidthsMap[key] = largestAvailableSpace;
	    }
	}
	
	
	
    }
    
    
    
    
    /*
    var maxCollisionMap = {}; //holds event.eq numbers as keys and an array of the highest coll
    for (var w =0; w< $(".event").length; w++){
	console.log("Event: " + w);
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
			console.log("\t" + array_values[i].split(",")[z]);
			if(maxCollisionMap[array_values[i].split(",")[z]] > maxCollisions){
			    var currentOtherCollidingDivNumber = maxCollisionMap[array_values[i].split(",")[z]]
			    var tempWidth = totalParentSpace/maxCollisionMap[array_values[i].split(",")[z]];
			    remainingParentSpace = totalParentSpace - tempWidth;
			    alert(remainingParentSpace);
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
			console.log("Adjusting left of " + $("#resizable-text", "#"+$(".event").get(i).id).html() + ": " + divLeft);
		    }
		    
		}
	    }
	}
    }*/
    
    checkFontSizeAndSpacing();
    
    
}

function checkFontSizeAndSpacing(){
    /*
    for(var i=0; i<$(".event").length; i++){
	
	if($("#shiftTypeDisplay", "#"+$(".event").get(i).id).outerWidth(true) > $("#"+$(".event").get(i).id).outerWidth(true) ||
		$("#formattedTimeDisplay", "#"+$(".event").get(i).id).outerWidth(true) > $("#"+$(".event").get(i).id).outerWidth(true) ||
		$("#notesDisplay", "#"+$(".event").get(i).id).outerWidth(true) > $("#"+$(".event").get(i).id).outerWidth(true)
		){
	    $("#shiftTypeDisplay", "#"+$(".event").get(i).id).hide();
	    $("#formattedTimeDisplay", "#"+$(".event").get(i).id).hide();
	    $("#notesDisplay", "#"+$(".event").get(i).id).hide();
	 }
	else{
	    $("#shiftTypeDisplay", "#"+$(".event").get(i).id).show();
	    $("#formattedTimeDisplay", "#"+$(".event").get(i).id).show();
	    $("#notesDisplay", "#"+$(".event").get(i).id).show();
	}
	
    } 
    */
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
      
    if (b1-5 < y2 || y1 > b2-5 || r1-5 < x2 || x1 > r2-5) return false;
    return true;
  }
function populateSavedAvailabilitybackup(){
    alert(availabilityEvents);
    var availabilityArray = availabilityEvents.split(";");
    //alert(availabilityArray[1].substring(11,15));
    
    for(var i =0; i<=availabilityArray.length;i++){
	if(availabilityArray[i]){
	    var availabilityTime = availabilityArray[i].split(",")[0];
	    var availabilityType = availabilityArray[i].split(",")[1];
	    var availabilityNotes = availabilityArray[i].split(",")[2];
	    //alert(availabilityArray[i].length)
	    var newDivHomeBlock = availabilityTime.substring(0,3) + "tb" + availabilityTime.substring(4,8);
	    var newDivEndBlock = availabilityTime.substring(0,3) + "tb" + availabilityTime.substring(11,15)
	    var newDivID = "event" + availabilityTime.substring(0,3) + eventCount;
	
	    //calculate div height
	    var newDivHeight = $("#" + newDivEndBlock).offset().top - $("#" + newDivHomeBlock).offset().top;
	
	
	    var newResizableText = availabilityTime;
	    eventCount++;
	    $("#" + newDivHomeBlock ).append("<div class='" + eventCSSClass + " draggable resizable ' id='" + newDivID + "' " +
		"style= 'width:90%; height:" + newDivHeight + "px'>" + "</div>");
	    $("#"+ newDivID).append("" +
		"<span class='insideEventBlock'  id='shiftTypeDisplay' >" + 
	    	 eventTypeDisplay + "<br>" + "<small>" + calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, startClickYCoordinate, currentDragOrResizeBottomYCoordinate) + "</small>" +
	    	"</span> " +    
	    	"<span id='resizable-text'  style='display:none'>" + newResizableText + "</span> " +
    		"<span id='createdInTimeBlock' style='display:none'>" + newDivHomeBlock + "</span> " +
    		
    		"<span id='weightOfDiv' style='display:none'>" + 0 + "</span> " +
    		"<button type='button' class='close eventDelete' aria-label='Close' style='position:absolute; top:0; right:0;'><span aria-hidden='true'>&times;</span></button>" +
    		"<span id='startBlockNumber' style='display:none'>0</span> " +
    		"<span id='endBlockNumber' style='display:none'>0</span> ");
	    draggableFunction();
	    resizableFunction();
	}  
	
    }
}

function populateSavedAvailability(){
    var shiftEventArray = availabilityEvents.split(";");
    //DAY HHMM - HHMM,UNAVAILABLE,NOTES;
    //0123456789012345
    for(var e=0; e<shiftEventArray.length;e++){
	if(shiftEventArray[e].length > 1){
	    //alert("hello" + shiftEventArray[e]);
	    var thisEvent = shiftEventArray[e].split(",");
	    /////////////////////////////////////////////////
	    var newDivHomeBlock = thisEvent[0].substring(0,3) + "tb" + thisEvent[0].substring(4,8);
	    var newDivEndBlock = thisEvent[0].substring(0,3) + "tb" + thisEvent[0].substring(11,15);
	    
	  
	    //////////////////////////////////////
	    //alert($("#endTimeModal").val().trim());
	    var newDivID = "event" + thisEvent[0].substring(0,3) + eventCount;
	    //alert(newDivEndBlock + " " + newDivHomeBlock);
	  //If event is at the end of the day
	    if( thisEvent[0].substring(11,15) == ""+endTimeHour + endTimeMin){
		
		//alert(tempEndNum);
		//console.log("NewDivEndBlock: " + newDivEndBlock);
		newDivEndBlock = $(".timeBlock.Sunday").last().attr("id");
		//console.log("NewDivEndBlock: " + newDivEndBlock);
		var newDivHeight = ($("#" + newDivEndBlock).offset().top + $("#" + newDivEndBlock).outerHeight()-2) - $("#" + newDivHomeBlock).offset().top;
	    }
	    else{
		var newDivHeight = $("#" + newDivEndBlock).offset().top - $("#" + newDivHomeBlock).offset().top;
	    }
	    var newResizableText = "";
	    var newNumOfEmployees = 1;
	    var newDisplayText =  thisEvent[1];
	    var newFormattedText = "";
	    var newShiftType = thisEvent[1];
	    var newNotes = thisEvent[2];
		
	    
	    //alert(newDivEndBlock); 
	    $("#" + newDivHomeBlock ).append("<div class='" + eventCSSClass + " draggable resizable ' id='" + newDivID + "' " +
		    "style= 'width:90%; height:" + newDivHeight + "px'>" + "</div>");
	    $("#"+ newDivID).append("" +
		    "<div class='eventBlockInnerDiv'>" + 
		    
		    "<span class='insideEventBlock'  id='shiftTypeDisplay' >" + newDisplayText + "</span> " +
		    "</div>" +
		    "<div class='eventBlockInnerDiv'>" +
		    	"<small>" + 
		    	"<span class='insideEventBlock' id='formattedTimeDisplay' >" +
		    		newFormattedText +
		    		"</span> " +
		    	"</small>" +
		    "</div>" +
		    "<span class='insideEventBlock' id='notesDisplay'>" + newNotes + "</span> " +
		    "<span id='resizable-text'  style='display:none'>" + "</span> " +
		    "<span id='createdInTimeBlock' style='display:none'>" + newDivHomeBlock + "</span> " +
		    "<span id='shiftType' style='display:none'>" + newShiftType + "</span> " +
		    "<span id='weightOfDiv' style='display:none'>" + 0 + "</span> " +
		    "<button type='button' class='close eventDelete' aria-label='Close' style='position:absolute; top:0; right:0;'><span aria-hidden='true'>&times;</span></button>" +
		    "<span id='startBlockNumber' style='display:none'>0</span> " +
	    	    "<span id='endBlockNumber' style='display:none'>0</span> ");
	    draggableFunction();
	    resizableFunction();
	    currentDragOrResizeXCoordinate = $("#" + newDivID).offset().left;
	    currentDragOrResizeYCoordinate = $("#" + newDivID).offset().top+2;
	    
	  //If event is at the end of the day
	    if(thisEvent[0].substring(11,15) == ""+endTimeHour + endTimeMin){
		currentDragOrResizeBottomYCoordinate = ($("#" + newDivEndBlock).offset().top + $("#" + newDivEndBlock).outerHeight()) -4 ;
	    }
	    else{
		currentDragOrResizeBottomYCoordinate = ($("#" + newDivEndBlock).offset().top) -4 ;
	    }
	    //////////////////////////////////////
	    $("#resizable-text", "#" + newDivID).html(thisEvent[0].substring(0,3) + " " + calculateTimeFromPosition(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
	    $("#formattedTimeDisplay", "#" + newDivID).html(calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
	    //alert(calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
	    ////////////////////////////////////////////////////////
	    eventCount++
	}
    }
    fixOverLappingEventDivs2();
}

function populateSavedShifts(){
    var shiftEventArray = shiftEvents.trim().split(";");
    //DAY HHMM - HHMM,SERVER,1,NOTES;
    //0123456789012345
    for(var e=0; e<shiftEventArray.length;e++){
	if(shiftEventArray[e].length > 1){
	    //alert("hello" + shiftEventArray[e]);
	    var thisEvent = shiftEventArray[e].split(",");
	    /////////////////////////////////////////////////
	    var newDivHomeBlock = thisEvent[0].substring(0,3) + "tb" + thisEvent[0].substring(4,8);
	    var newDivEndBlock = thisEvent[0].substring(0,3) + "tb" + thisEvent[0].substring(11,15);
	    
	    
	    //////////////////////////////////////
	    //alert($("#endTimeModal").val().trim());
	    var newDivID = "event" + thisEvent[0].substring(0,3) + eventCount;
	    //alert(newDivEndBlock + " " + newDivHomeBlock);
	  //If event is at the end of the day
	    if( thisEvent[0].substring(11,15) == ""+endTimeHour + endTimeMin){
		
		//alert(tempEndNum);
		//console.log("NewDivEndBlock: " + newDivEndBlock);
		newDivEndBlock = $(".timeBlock.Sunday").last().attr("id");
		//console.log("NewDivEndBlock: " + newDivEndBlock);
		var newDivHeight = ($("#" + newDivEndBlock).offset().top + $("#" + newDivEndBlock).outerHeight()-2) - $("#" + newDivHomeBlock).offset().top;
	    }
	    else{
		var newDivHeight = $("#" + newDivEndBlock).offset().top - $("#" + newDivHomeBlock).offset().top -2;
	    }
	    var newResizableText = "";
	    var newNumOfEmployees = thisEvent[2];
	    var newDisplayText =  thisEvent[1];
	    var newFormattedText = "";
	    var newShiftType = thisEvent[1];
	    var newNotes = thisEvent[3];
		
	    var bcolor; 
	    for(var c =0; c< shiftTypes.split(",").length; c++){
		if(shiftTypes.split(",")[c].split(" ")[0] == thisEvent[1] ){
		    bcolor = shiftTypes.split(",")[c].split(" ")[1];
		}
	    } 
	    //alert(newDivEndBlock); 
	    $("#" + newDivHomeBlock ).append("<div class='" + eventCSSClass + " draggable resizable ' id='" + newDivID + "' " +
		    "style= 'width:90%; height:" + newDivHeight + "px'>" + "</div>");
	    
	    $("#"+ newDivID).append("" +
		    "<div class='eventBlockInnerDiv'>" + 
		    
		    "<span class='insideEventBlock'  id='shiftTypeDisplay' >" + newDisplayText + "</span> " +
		    "</div>" +
		    "<div class='eventBlockInnerDiv'>" +
		    	"<small>" + 
		    	"<span class='insideEventBlock' id='formattedTimeDisplay' >" +
		    		newFormattedText +
		    		"</span> " +
		    		"<br><span class='insideEventBlock' id='numOfEmployees'>" + newNumOfEmployees + "</span> " +
		    	"</small>" +
		    "</div>" +
		    "<span class='insideEventBlock' id='notesDisplay'>" + newNotes + "</span> " +
		    "<span id='resizable-text'  style='display:none'>" + "</span> " +
		    "<span id='createdInTimeBlock' style='display:none'>" + newDivHomeBlock + "</span> " +
		    "<span id='shiftType' style='display:none'>" + newShiftType + "</span> " +
		    "<span id='weightOfDiv' style='display:none'>" + 0 + "</span> " +
		    "<button type='button' class='close eventDelete' aria-label='Close' style='position:absolute; top:0; right:0;'><span aria-hidden='true'>&times;</span></button>" +
		    "<span id='startBlockNumber' style='display:none'>0</span> " +
	    	    "<span id='endBlockNumber' style='display:none'>0</span> ");
	    $("#"+ newDivID).css('background-color', "" + bcolor + "");
	    draggableFunction();
	    resizableFunction();
	    currentDragOrResizeXCoordinate = $("#" + newDivID).offset().left;
	    currentDragOrResizeYCoordinate = $("#" + newDivHomeBlock).offset().top;
	    //alert(newDivHomeBlock);
	  //If event is at the end of the day
	    if(thisEvent[0].substring(11,15) == ""+endTimeHour + endTimeMin){
		currentDragOrResizeBottomYCoordinate = ($("#" + newDivEndBlock).offset().top + $("#" + newDivEndBlock).outerHeight()) -4 ;
	    }
	    else{
		currentDragOrResizeBottomYCoordinate = ($("#" + newDivEndBlock).offset().top) -4 ;
	    }
	    //////////////////////////////////////
	    $("#resizable-text", "#" + newDivID).html(thisEvent[0].substring(0,3) + " " + calculateTimeFromPosition(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
	    $("#formattedTimeDisplay", "#" + newDivID).html(calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
	    //alert(calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
	    ////////////////////////////////////////////////////////
	    eventCount++
	}
    }
    fixOverLappingEventDivs2();
}

function draggableFunction(){
    $('.draggable').draggable({ 
	    //axis: "y",
	    //snapTolerance: 20,
	    containment: "tbody",
	    snap: "td.timeBlock",
	    drag: function(){
		$(".popover").hide();
		dragging = true;
		//Get changing Coordinates as mouse is dragging event
		currentDragOrResizeXCoordinate = $(this).offset().left;
		currentDragOrResizeYCoordinate = $(this).offset().top+2; 
		currentDragOrResizeBottomYCoordinate = currentDragOrResizeYCoordinate+$(this).outerHeight(true)-4;
		//alert("dragged");
		//Change Day of Week if dragged into another day
		if (currentDragOrResizeXCoordinate > $("#SundayDayLabel").offset().left && currentDragOrResizeXCoordinate < $("#SundayDayLabel").offset().left + $("#SundayDayLabel").outerWidth()){
		    $("#resizable-text", this).html("Sun" + " "+ calculateTimeFromPosition(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
		    $("#formattedTimeDisplay", this).html(calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
			
		    eventDraggedToDifferentStartTime = true;
		}
		else if (currentDragOrResizeXCoordinate > $("#MondayDayLabel").offset().left && currentDragOrResizeXCoordinate < $("#MondayDayLabel").offset().left + $("#MondayDayLabel").outerWidth()){
		    $("#resizable-text", this).html("Mon" + " "+ calculateTimeFromPosition(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
		    $("#formattedTimeDisplay", this).html(calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
		}
		else if (currentDragOrResizeXCoordinate > $("#TuesdayDayLabel").offset().left && currentDragOrResizeXCoordinate < $("#TuesdayDayLabel").offset().left + $("#TuesdayDayLabel").outerWidth()){
		    $("#resizable-text", this).html("Tue" + " "+ calculateTimeFromPosition(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
		    $("#formattedTimeDisplay", this).html(calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
		}
		else if (currentDragOrResizeXCoordinate > $("#WednesdayDayLabel").offset().left && currentDragOrResizeXCoordinate < $("#WednesdayDayLabel").offset().left + $("#WednesdayDayLabel").outerWidth()){
		    $("#resizable-text", this).html("Wed" + " "+ calculateTimeFromPosition(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
		    $("#formattedTimeDisplay", this).html(calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
		}
		else if (currentDragOrResizeXCoordinate > $("#ThursdayDayLabel").offset().left && currentDragOrResizeXCoordinate < $("#ThursdayDayLabel").offset().left + $("#ThursdayDayLabel").outerWidth()){
		    $("#resizable-text", this).html("Thu" + " "+ calculateTimeFromPosition(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
		    $("#formattedTimeDisplay", this).html(calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
		}
		else if (currentDragOrResizeXCoordinate > $("#FridayDayLabel").offset().left && currentDragOrResizeXCoordinate < $("#FridayDayLabel").offset().left + $("#FridayDayLabel").outerWidth()){
		    $("#resizable-text", this).html("Fri" + " "+ calculateTimeFromPosition(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
		    $("#formattedTimeDisplay", this).html(calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
		}
		else if (currentDragOrResizeXCoordinate > $("#SaturdayDayLabel").offset().left && currentDragOrResizeXCoordinate < $("#SaturdayDayLabel").offset().left + $("#SaturdayDayLabel").outerWidth()){
		    $("#resizable-text", this).html("Sat" + " "+ calculateTimeFromPosition(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
		    $("#formattedTimeDisplay", this).html(calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
		}
		else{
		    $("#resizable-text", this).html(this.id.substring(5,8) + " "+ calculateTimeFromPosition(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
		    $("#formattedTimeDisplay", this).html(calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
		}
	    }
	});
}

function resizableFunction(){
    $( ".resizable" ).resizable({
	    handles: "n, s",
	    containment: "tbody",
	    grid: [ 10, resizeGridY ],
	    resize: function(){
		//get changing coordinates as mouse is resizing event
	        currentDragOrResizeXCoordinate = $(this).offset().left;
	        currentDragOrResizeYCoordinate = $(this).offset().top+2;
	        currentDragOrResizeBottomYCoordinate = currentDragOrResizeYCoordinate+$(this).outerHeight(true)-4;
	        
	        $("#endBlockNumber", this).html(((currentDragOrResizeBottomYCoordinate-dayLabelBlockYCoordinate)/timeBlockHeight));
	        $("#startBlockNumber", this).html(((currentDragOrResizeYCoordinate-dayLabelBlockYCoordinate)/timeBlockHeight)+1);
	        
	        //Change Day of Week if Necessary
	        if (currentDragOrResizeXCoordinate > $("#SundayDayLabel").offset().left && currentDragOrResizeXCoordinate < $("#SundayDayLabel").offset().left + $("#SundayDayLabel").outerWidth()){
		    $("#resizable-text", this).html("Sun" + " "+ calculateTimeFromPosition(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
		    $("#formattedTimeDisplay", this).html(calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
			
		    eventDraggedToDifferentStartTime = true;
		}
		else if (currentDragOrResizeXCoordinate > $("#MondayDayLabel").offset().left && currentDragOrResizeXCoordinate < $("#MondayDayLabel").offset().left + $("#MondayDayLabel").outerWidth()){
		    $("#resizable-text", this).html("Mon" + " "+ calculateTimeFromPosition(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
		    $("#formattedTimeDisplay", this).html(calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
		}
		else if (currentDragOrResizeXCoordinate > $("#TuesdayDayLabel").offset().left && currentDragOrResizeXCoordinate < $("#TuesdayDayLabel").offset().left + $("#TuesdayDayLabel").outerWidth()){
		    $("#resizable-text", this).html("Tue" + " "+ calculateTimeFromPosition(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
		    $("#formattedTimeDisplay", this).html(calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
		}
		else if (currentDragOrResizeXCoordinate > $("#WednesdayDayLabel").offset().left && currentDragOrResizeXCoordinate < $("#WednesdayDayLabel").offset().left + $("#WednesdayDayLabel").outerWidth()){
		    $("#resizable-text", this).html("Wed" + " "+ calculateTimeFromPosition(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
		    $("#formattedTimeDisplay", this).html(calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
		}
		else if (currentDragOrResizeXCoordinate > $("#ThursdayDayLabel").offset().left && currentDragOrResizeXCoordinate < $("#ThursdayDayLabel").offset().left + $("#ThursdayDayLabel").outerWidth()){
		    $("#resizable-text", this).html("Thu" + " "+ calculateTimeFromPosition(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
		    $("#formattedTimeDisplay", this).html(calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
		}
		else if (currentDragOrResizeXCoordinate > $("#FridayDayLabel").offset().left && currentDragOrResizeXCoordinate < $("#FridayDayLabel").offset().left + $("#FridayDayLabel").outerWidth()){
		    $("#resizable-text", this).html("Fri" + " "+ calculateTimeFromPosition(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
		    $("#formattedTimeDisplay", this).html(calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
		}
		else if (currentDragOrResizeXCoordinate > $("#SaturdayDayLabel").offset().left && currentDragOrResizeXCoordinate < $("#SaturdayDayLabel").offset().left + $("#SaturdayDayLabel").outerWidth()){
		    $("#resizable-text", this).html("Sat" + " "+ calculateTimeFromPosition(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
		    $("#formattedTimeDisplay", this).html(calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
		}
		else{
		    $("#resizable-text", this).html(this.id.substring(5,8) + " "+ calculateTimeFromPosition(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
		    $("#formattedTimeDisplay", this).html(calculateTimeFromPositionFormatted(currentDragOrResizeXCoordinate, currentDragOrResizeYCoordinate, currentDragOrResizeBottomYCoordinate));
		}
	               
	    }
	});
}
function calculateTimeFromPosition(xStartPos, yStartPos, yEndPos){ 
    //alert((yPos-dayLabelBlockYCoordinate)/timeBlockHeight);
    //alert($(this).attr('id'));
    //console.log((yEndPos-dayLabelBlockYCoordinate)/timeBlockHeight);
    //console.log( $(".timeBlock.Sunday").length);
    if( Math.floor((yEndPos-dayLabelBlockYCoordinate)/timeBlockHeight)+1 == $(".timeBlock.Sunday").length ){
	//var lastBlock = parseInt($(".Sunday").eq(Math.floor((yEndPos-dayLabelBlockYCoordinate)/timeBlockHeight)).attr('id').substring(5,9)) + parseInt(timeInterval);
	var lastBlock = parseInt(endTimeHour + endTimeMin);
	var tempString = $(".Sunday").eq(Math.floor((yStartPos-dayLabelBlockYCoordinate)/timeBlockHeight)).attr('id').substring(5,9) + " - " 
	    + lastBlock;
	//console.log ("HERE:" + lastBlock + " " + endTimeHour + endTimeMin);
    }
    else{
        var tempString = $(".Sunday").eq(Math.floor((yStartPos-dayLabelBlockYCoordinate)/timeBlockHeight)).attr('id').substring(5,9) + " - " 
        + $(".Sunday").eq(Math.floor((yEndPos-dayLabelBlockYCoordinate)/timeBlockHeight)+1).attr('id').substring(5,9); 
    }
    return (tempString);
}

function calculateTimeFromPositionFormatted(xStartPos, yStartPos, yEndPos){
    if( Math.floor((yEndPos-dayLabelBlockYCoordinate)/timeBlockHeight)+1 == $(".timeBlock.Sunday").length ){
	//var lastBlock = parseInt($(".Sunday").eq(Math.floor((yEndPos-dayLabelBlockYCoordinate)/timeBlockHeight)).attr('id').substring(5,9)) + parseInt(timeInterval);
	var lastBlock = parseInt(endTimeHour + endTimeMin);
	var tempString = $(".Sunday").eq(Math.floor((yStartPos-dayLabelBlockYCoordinate)/timeBlockHeight)).attr('id').substring(5,9) + " - " 
	    + lastBlock;
    }
    else{
        var tempString = $(".Sunday").eq(Math.floor((yStartPos-dayLabelBlockYCoordinate)/timeBlockHeight)).attr('id').substring(5,9) + " - " 
        + $(".Sunday").eq(Math.floor((yEndPos-dayLabelBlockYCoordinate)/timeBlockHeight)+1).attr('id').substring(5,9); 
    }
    
    var startMinFormatted = parseInt(tempString.substring(2,4)) == 0 ? "" : ":" + tempString.substring(2,4);
    //console.log(parseInt(tempString.substring(2,4)));
    var endMinFormatted = parseInt(tempString.substring(9,11)) == 0 ? "" : ":" + tempString.substring(9,11);
    var stringReturn = 
	((parseInt(tempString.substring(0,2)) < 12) ? (parseInt(tempString.substring(0,2)) + startMinFormatted +"") :  ((parseInt(tempString.substring(0,2))==12) ? (parseInt(tempString.substring(0,2)) + startMinFormatted +"p") : (parseInt(tempString.substring(0,2)) -12 + startMinFormatted +"p")))  +
	" - " + 
	((parseInt(tempString.substring(7,9)) < 12) ? (parseInt(tempString.substring(7,9)) + endMinFormatted +"") : ((parseInt(tempString.substring(7,9))==12) ? (parseInt(tempString.substring(7,9)) + endMinFormatted +"p") : (parseInt(tempString.substring(7,9)) -12 + endMinFormatted +"p")));
	
    return (stringReturn);
}
 

function checkCalendarAndCallSetupFunction(){
    if ($( ".styled-select option:selected" ).text().toLowerCase() == "monthly"){
	calendarMonthSetup();
    }
    else if (($( ".styled-select option:selected" ).text().toLowerCase() == "weekly")){
	//alert($( ".styled-select option:selected" ).text().toLowerCase());
	calendarWeekSetup();
    }
    else if (($( ".styled-select option:selected" ).text().toLowerCase() == "daily")){
	calendarDaySetup(); 
    }
    alert($( ".styled-select option:selected" ).text());
}

function prevMonth(){
    var thisMonth = this.getMonth();
    this.setMonth(thisMonth-1);
    if(this.getMonth() != thisMonth-1 && (this.getMonth() != 11 || (thisMonth == 11 && this.getDate() == 1)))
    this.setDate(0);
}
function nextMonth(){
    var thisMonth = this.getMonth();
    this.setMonth(thisMonth+1);
    if(this.getMonth() != thisMonth+1 && this.getMonth() != 0)
    this.setDate(0);
}
Date.prototype.nextMonth = nextMonth;
Date.prototype.prevMonth = prevMonth;


function backButtonPressed(){
    if ($( ".active" ).attr('id') == "monthButton"){
	today.prevMonth();
	calendarMonthSetup();
    }
    else if ($( ".active" ).attr('id') == "weekButton"){
	alert($( ".active" ).attr('id'));
	today.setDate(today.getDate() - 7);
	calendarWeekSetup();
    }
    else if ($( ".active" ).attr('id') == "dayButton"){
	today.setDate(today.getDate() - 1);
	calendarDaySetup(); 
    }
    //checkCalendarAndCallSetupFunction();
}
function forwardButtonPressed(){
    if ($( ".active" ).attr('id') == "monthButton"){
	today.nextMonth();
	calendarMonthSetup();
    }  
    else if ($( ".active" ).attr('id') == "weekButton"){
	//alert($( ".styled-select option:selected" ).text().toLowerCase());
	today.setDate(today.getDate() + 7);
	calendarWeekSetup();
    }
    else if ($( ".active" ).attr('id') == "dayButton"){
	today.setDate(today.getDate() + 1);
	calendarDaySetup(); 
    }
    
    //checkCalendarAndCallSetupFunction();
}

function calendarMonthSetup() {
    month = today.getMonth()+1;
    date = today.getDate();
    year = today.getYear()+1900;
    var date = 1;
    var days = new Date(year,month,1,-1).getDate(); //total days in month
    today = new Date(year, month-1)
    var startDay = 0;
    var dayMonthStarted = new Date(today.getDate() - (7 + today.getDay() - startDay) % 7).getDay(); //number from 0 to 6 where 0 stands for Sunday 
    dayMonthStarted = today.getDay();
    var dayMonthEnded = new Date(today.getDate() + (7 - today.getDay() - startDay) % 7); //number from 0 to 6 where 0 stands for Sunday 
    
   
    
    $("#calendar-content").empty();
    $("#calendar-content").append("<div id='nameOfMonth' style='text-align:center; font-size:25px; '>" 
	    + "<button type='button' onclick='backButtonPressed()''><</button>" 
	    + months[today.getMonth()] 
	    + "<button type='button' onclick='forwardButtonPressed()''>></button>"
	    + "</div>");
    for(var i=0; i<7; i++){
	//alert(today.getDay()-i);
	var tempDate = new Date(year,month,date-(today.getDay()-i));
	$("#calendar-content").append("<div id='dayCellLabel' style='float:left;text-align:center; font-size:13px;  width:14.28%; border-style: solid; border-width: thin;'>" 
		+ daysOfWeek[i] + "</div>")

    }
    var weeksInMonth = 0;
    weeksInMonth = Math.floor( ((days-(7-dayMonthStarted))/7) )
    //alert(days);
    if(dayMonthStarted>0){
	weeksInMonth++;
    }
    if((days-(7-dayMonthStarted)%7 >0)){
	weeksInMonth++;
    }
    //alert(weeksInMonth);
    var dayNum = 1;
    for(var i=1; i<=(weeksInMonth*7); i++){
	//alert(dayNum + " " + days);
	if(i<=dayMonthStarted || dayNum > days){
		$("#calendar-content").append("<div id='' style='float:left;text-align:center; font-size:25px;  width:14.28%; height:200px; border-style: solid; border-width: thin; -moz-border-radius: 0px; border-radius: 0px;'></div>")

	}
	else{
	    
    		$("#calendar-content").append("<div class='dayCell' id='dayCell" + dayNum + "' style='float:left;text-align:center; font-size:25px;  width:14.28%; height:200px; border-style: solid; border-width: thin; '>" 
    			+ "<div id='dateLabel' style='text-align:left; font-size:15px;' >" + dayNum + "</div>" 
    			+"</div>")
    		dayNum++
	}
	}
};

function calendarWeekSetup(){
    $("#calendar-content").empty();
    //today = new Date();
    
    month = today.getMonth()+1;
    date = today.getDate();
    year = today.getYear()+1900;
    
    var dayStartTime = 0;
    var dayEndTime = 24;
    var timeBlock = 30; //in minutes
    var numOfTimeBlocks = (dayEndTime - dayStartTime) * (60/30);
    var dayCellDivHeight = 800;
    
    $("#calendar-content").append("<div id='nameOfMonth' style='text-align:center; font-size:25px; '>"
	    + "<button type='button' onclick='backButtonPressed()''><</button>"
	    + months[today.getMonth()] 
	    + "<button type='button' onclick='forwardButtonPressed()''>></button>"
	    + "</div>")
    for(var i=0; i<7; i++){
	//alert(today.getDay()-i);
	
	var tempDate = new Date(year,month-1,date-(today.getDay()-i));
	//alert(tempDate);
	$("#calendar-content").append("<div id='dayCellLabel' style='float:left;text-align:center; font-size:13px;  width:14.28%; border-style: solid; border-width: thin;'>" 
		+ ((tempDate.getMonth())+1) + "/" + tempADate.getDate() + "<br>" + daysOfWeek[i] + "</div>")

    }
    var htmlStr = "";
    for(var i=0; i<7; i++){
	htmlStr = htmlStr + "<div class='dayCell' id='dayCell" + (i+1) + "' style='float:left;text-align:center; font-size:13px;  width:14.28%; height:" + dayCellDivHeight + "px; border-style: solid; border-width: thin; '>";
	for(var t = 1; t<=numOfTimeBlocks; t++){
	    htmlStr = htmlStr + "<div class='timeBlock' id = 'tb" + t + "' style='height:" + dayCellDivHeight/numOfTimeBlocks + "px; border-style: dotted; border-width: thin; position: relative'>" + "</div>";
	}
	htmlStr = htmlStr + "</div>"
	
	
    }
    $("#calendar-content").append(htmlStr);  
    
}

function calendarDaySetup(){
    $("#calendar-content").empty();
    
    var dayStartTime = 0;
    var dayEndTime = 24;
    var timeBlock = 30; //in minutes
    var numOfTimeBlocks = (dayEndTime - dayStartTime) * (60/30);
    var dayCellDivHeight = 800;
    
    var htmlStr = "";
    
    $("#calendar-content").append("<div id='dayCellLabel' style='float:left;text-align:center; font-size:13px;  width:100%; border-style: solid; border-width: thin;'>" 
	    + today.getMonth() + "/" + today.getDate() + "<br>" 
	    + "<button type='button' onclick='backButtonPressed()''><</button>"
	    + daysOfWeek[today.getDay()]
	    + "<button type='button' onclick='forwardButtonPressed()''>></button>"
	    + "</div>");
    
    htmlStr = htmlStr + "<div class='dayCell' id='dayCell' style='float:left;text-align:center; font-size:13px;  width:100%; height:" + dayCellDivHeight + "px; border-style: solid; border-width: thin; '>";
	
		for(var t = 1; t<=numOfTimeBlocks; t++){
		    htmlStr = htmlStr + "<div id = 'timeBlock' style='height:" + dayCellDivHeight/numOfTimeBlocks + "px; border-style: dotted; border-width: thin;'>" + "</div>";
		}
		htmlStr = htmlStr + "</div>"
		$("#calendar-content").append(htmlStr)
}



