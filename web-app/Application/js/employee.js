
$( document ).ready(function() {
    
    //Fill in Employee info if user clicks on row
    $("tbody tr").on('click', function(event) {
		//alert($(event.target).parent('tr').attr('id'));
		$("#userIDHidden").val($(event.target).parent('tr').children(".IDTD").html());
		$("#inputEmail").val($(event.target).parent('tr').children(".emailTD").html());
		$("#inputFirstName").val($(event.target).parent('tr').children(".firstNameTD").html());
		$("#inputLastName").val($(event.target).parent('tr').children(".lastNameTD").html());
		$("#inputLevel").val($(event.target).parent('tr').children(".levelTD").html());

		$(".employeeRolesCheckboxes input:checkbox").prop('checked', false);
		for(var i=0; i< $(".employeeRolesCheckboxes input:checkbox").length; i++){
			console.log(event.target);
			for(var j=0; j<$(event.target).parent('tr').children(".roleTD").html().split(",").length; j++){
			if($(event.target).parent('tr').children(".roleTD").html().split(",")[j] == $(".employeeRolesCheckboxes input:checkbox").get(i).id.split("-")[0]){
				$(".employeeRolesCheckboxes input:checkbox").eq(i).prop('checked', true);
			}
			}
		}

		$.ajax({
			method: "GET",
			url: "/pickupmyshift/application/employeesGetEmployeeAvailability",
			data: { EmployeeID: $("#userIDHidden").val()}
		})
		.done(function( msg ) {
			$(".event").remove();
			//alert( "Data Saved: " + msg );
			populateSavedAvailabilityEmployeeView(msg);
			$(".event").css("pointer-events", "none");
			$(".availabilityCalendar").css("pointer-events", "none");
		});
    });
    
    $("#wrapper" ).on('click', '#employeeInfoSaveButton', function(e) {
		var tempString ="";
		tempString = tempString +
			$("#userIDHidden").val()+ "," +
			$("#inputEmail").val() + "," +
			$("#inputFirstName").val() + "," +
			$("#inputLastName").val() + "," +
			$("#inputLevel").val() + ",";
		for(var i=0; i< $(".employeeRolesCheckboxes input:checkbox").length; i++){
			if(i>0){
			}
			if($(".employeeRolesCheckboxes input:checkbox").eq(i).is(":checked")){
			tempString = tempString + $(".employeeRolesCheckboxes input:checkbox").get(i).id.split("-")[0] + "-"
			}
		}
		tempString = tempString + ";"



		alert(tempString);
		$.ajax({
			method: "POST",
			url: "/pickupmyshift/application/employeesQuickEditSave",
			data: { EmployeeEditInfo: tempString}
		})
		.done(function( msg ) {
			//alert( "Data Saved: " + msg );
		});
		location.reload(true);
    });

	$("#wrapper" ).on('click', '#heatMapButton', function(e) {
		$("#heatMapButton").toggleClass("active");
		if($("#heatMapButton").hasClass("active")){
			drawHeatMap();
		}
		else{

		}
	});
});

function drawHeatMap(){
	$(".event").remove();

	var tempDate = new Date(year, month - 1, date - (chosenDate.getDay() - (1 - 1)));
	var beginDateString = (tempDate.getMonth() + 1) + "/" + tempDate.getDate() + "/" + (tempDate.getYear() + 1900);
	var tempDate = new Date(year, month - 1, date - (chosenDate.getDay() - (7 - 1)));
	var endDateString = (tempDate.getMonth() + 1) + "/" + tempDate.getDate() + "/" + (tempDate.getYear() + 1900);
	var beginEndDateString = beginDateString + ":" + endDateString;



	$.ajax({
		method: "POST",
		url: "/pickupmyshift/application/employeesGetHeatMap",
		data: {beginEndDateString: beginEndDateString}
	})
		.done(function( msg ) {
			alert( "Data Saved: " + msg );
			var heatMapArray = msg.split("--");
			var tempID = "";
			var tempGradientString = "";
			var tempGradientStringArray;
			for (var i =0; i<heatMapArray.length; i++){
				tempID = heatMapArray[i].split("++")[0]
				tempGradientString = heatMapArray[i].split("++")[1]
				if(tempGradientString){
					tempGradientStringArray = tempGradientString.split(";");
					for(var e =0; e<tempGradientStringArray.length; e++){
						//console.log(tempGradientStringArray[e].split(":")[0].trim());
						if(tempGradientStringArray[e].split(":")[0].trim().length > 0){
							$("#" + tempID).css("" + tempGradientStringArray[e].split(":")[0].trim(), tempGradientStringArray[e].split(":")[1].trim());

						}
					}
				}


			}
		});

}


function populateSavedAvailabilityEmployeeView(msg){
    var shiftEventArray = msg.split(";");
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

