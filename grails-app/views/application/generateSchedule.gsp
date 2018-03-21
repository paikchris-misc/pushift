
<!DOCTYPE html>
<html lang="en">

<head>
	<meta name="layout" content="applicationMain"/>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
	<link href="${request.contextPath}/Application/css/generateSchedule.css" rel="stylesheet">
	<script src="${request.contextPath}/Application/js/jquery.js"></script>
	<script src="${request.contextPath}/Application/js/generateSchedule.js"></script>
    <title>Simple Sidebar - Start Bootstrap Template</title>
</head>

<body>
		<div id="page-content-wrapper">
			<div class='col-xs-12 page-header'>
				<h2>Create Schedule</h2>
			</div>
			<div class='row'  >
				<div class='col-xs-12'>
				
				</div>
			</div>
			<div class='row'  >
				<div class='col-xs-12'>
					<div class='panel well' style='min-width:700px;'>
						<div class='panel-heading'>
							Schedule
						</div>
						<div class='panel-body '>
						<div style='padding:5px; padding-top:0px;'>
						<button type="button" class="btn btn-primary" id='generateSchedule'>Generate Schedule</button>
							<div class="btn-group" id="shiftTypesDropdown"> 
							  <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
							  <span class="glyphicon glyphicon-pencil"> </span>
							    <span id="shiftTypeDropdownText">${shiftTypes[0].split(" ")[0]}</span><div id="shiftTypeDropDownColorBox" style="background-color: ${shiftTypes[0].split(" ")[1]}; height:15px; width:15px; float:right; margin-top:3px; margin-left:10px"></div>
							  </button>
							  <ul class="dropdown-menu" role="menu"> 
							  	<g:each var="shiftType" in="${shiftTypes}">
							  		<li><a class="shiftType" id="${shiftType }" href="javascript:return false;"><div style="background-color: ${shiftType.split(" ")[1]}; height:15px; width:15px; float:right; margin-top:3px"></div>${shiftType.split(" ")[0]}</a></li>
							    	 
							  	</g:each>
							  	<li class="divider"></li>
							    <li><a href="#">Edit Shifts</a></li>
							    
							  </ul>
							</div>
							<div style="float:right">
							<g:each var="shiftType" in="${shiftTypes}">
								<label class="checkbox-inline">
								  <input type="checkbox" id="${shiftType.split(" ")[0]}-Checkbox" value="option1" checked> ${shiftType.split(" ")[0]}
								</label>
							</g:each>
							</div>
							
							<button type="button" class="btn btn-info" id='buttonSaveShifts'>Save</button>
							<div class="alert alert-success alert-dismissible" id="saveSuccess" role="alert" style="display:none; padding:7px; font-size:80%">
							  <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
							  <strong>Saved!</strong> Availability has been saved.
							</div>
							
							
						</div> 
						
							<div class='panel panel-default'>
								<div id="startTimeHourVariable" style="display:none">${startTimeHour }</div>
								<div id="startTimeMinVariable" style="display:none">${startTimeMin }</div>
								<div id="endTimeHourVariable" style="display:none">${endTimeHour }</div>
								<div id="endTimeMinVariable" style="display:none">${endTimeMin }</div>
								<div id="timeIntervalVariable" style="display:none">${calendarTimeInterval }</div>
								<div id="shiftTypes" style="display:none"><g:each var="shiftType" in="${shiftTypes}">${shiftType},</g:each></div>
								<div id="shiftEventsVariable" style="display:none"><g:each var="shiftEvent" in="${shiftEvents}">${shiftEvent};</g:each></div>
								<table class='table availabilityCalendar'>
									<thead>
										<tr>
											<td class="timeColumn "></td>
											<td class="dayLabel" id="SundayDayLabel">Sunday</td>
											<td class="dayLabel" id="MondayDayLabel">Monday</td>
											<td class="dayLabel" id="TuesdayDayLabel">Tuesday</td>
											<td class="dayLabel" id="WednesdayDayLabel">Wednesday</td>
											<td class="dayLabel" id="ThursdayDayLabel">Thursday</td>
											<td class="dayLabel" id="FridayDayLabel">Friday</td>
											<td class="dayLabel" id="SaturdayDayLabel">Saturday</td>
										</tr>
									</thead>
									<tbody>
										<g:each var="i" in="${ (startTimeHour..<endTimeHour+1) }">
											<g:each var="m" in="${ calendarTimeInterval == 30?["00","30"] : (calendarTimeInterval == 15? ["00","15","30", "45"] : (calendarTimeInterval==60?["00"]:["00"]))}">
												<g:if test="${i==startTimeHour && startTimeMin.toString() == "30" && m=="00"}">
												
												</g:if>
												<g:elseif test="${i==endTimeHour && endTimeMin.toString() == "00" && m=="30" }">
												</g:elseif>
												<g:elseif test="${i==endTimeHour && endTimeMin.toString() == "00" && m=="00" }">
												</g:elseif>
												<g:elseif test="${i==endTimeHour && endTimeMin.toString() == "30" && m=="30" }">
												</g:elseif>
												<g:else> 
													<tr>
														<td class="timeColumn ${ m=="00" ? "topOfHour": ""} " id="TimeColumntb${i}${m}">${i>12? (i==24? i+":" + m + " AM": i-12 +":" + m + " PM") : (i==12? i+":" + m + " PM": i+":" + m +" AM")}</td>
														<td class="timeBlock Sunday  ${ m=="00" ? "topOfHour": ""}" id="Suntb${String.valueOf(i).length() < 2 ? "0"+i: i}${m}" ></td>
														<td class="timeBlock Monday ${ m=="00" ? "topOfHour": ""}" id="Montb${String.valueOf(i).length() < 2 ? "0"+i: i}${m}"></td> 
														<td class="timeBlock Tuesday ${ m=="00" ? "topOfHour": ""}" id="Tuetb${String.valueOf(i).length() < 2 ? "0"+i: i}${m}"></td>
														<td class="timeBlock Wednesday ${ m=="00" ? "topOfHour": ""}" id="Wedtb${String.valueOf(i).length() < 2 ? "0"+i: i}${m}"></td>
														<td class="timeBlock Thursday ${ m=="00" ? "topOfHour": ""} " id="Thutb${String.valueOf(i).length() < 2 ? "0"+i: i}${m}"></td>
														<td class="timeBlock Friday ${ m=="00" ? "topOfHour": ""} " id="Fritb${String.valueOf(i).length() < 2 ? "0"+i: i}${m}"></td>
														<td class="timeBlock Saturday ${ m=="00" ? "topOfHour": ""}" id="Sattb${String.valueOf(i).length() < 2 ? "0"+i: i}${m}"></td>
													</tr>
												</g:else>
											</g:each>
										</g:each>
									</tbody>
								</table>
							</div> 
							<button type="button" class="btn btn-info">Save</button> 
							<button type="button" class="btn btn-default" data-toggle="tooltip" data-placement="left" title="Tooltip on left">Tooltip on left</button>
						</div>
					</div>
				</div>
			</div>
        </div>
    <!-- /#wrapper -->
    
<!-- Shift Details Modal --> 
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="myModalLabel">Shift Detail</h4>
      </div>
      <div class="modal-body">
      	<div id="currentlyEditingEventID" style="display:none">ssd</div>
      	<form class="form-horizontal">
      		<div class="form-group" id="shiftTypesDropdownModal">
    			<label for="inputEmail3" class="col-sm-2 control-label">Type</label>
    			<div class ="col-sm-10">
					<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
				  		<span class="glyphicon glyphicon-pencil"> </span>
			      		<span id="shiftTypeDropdownTextModal">${shiftTypes[0].split(" ")[0]}</span><div id="shiftTypeDropDownColorBoxModal" style="background-color: ${shiftTypes[0].split(" ")[1]}; height:15px; width:15px; float:right; margin-top:3px; margin-left:10px"></div>
					</button>
					<ul class="dropdown-menu" role="menu">
						<g:each var="shiftType" in="${shiftTypes}">
							<li><a class="shiftTypeModal" id="${shiftType }" href="#"><div style="background-color: ${shiftType.split(" ")[1]}; height:15px; width:15px; float:right; margin-top:3px"></div>${shiftType.split(" ")[0]}</a></li>
						</g:each>
							<li class="divider"></li>
							<li><a href="#">Edit Shifts</a></li>
					</ul>
				</div>
			</div>
			<div class="form-group">
				<label for="inputEmail3" class="col-sm-2 control-label">Day</label>
    			<div class ="col-sm-3">
    				<select class="form-control" id="daySelector" style="width: 120px">
						<g:each var="c" in="${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]}">
		    				<option value="${c}">${c}</option>
						</g:each>
					</select>
				</div>
			</div>
			<div class="form-group">
				<label for="inputEmail3" class="col-sm-2 control-label">Time</label>
				<div class ="col-sm-3">
					<select class="form-control" id="startTimeModal" style="width: 120px">
						<g:each var="i" in="${ (startTimeHour..<endTimeHour+1) }">
							<g:each var="m" in="${ calendarTimeInterval == 30?["00","30"] : (calendarTimeInterval == 15? ["00","15","30", "45"] : (calendarTimeInterval==60?["00"]:["00"]))}">
								<g:if test="${i==startTimeHour && startTimeMin.toString() == "30" && m=="00"}">
								
								</g:if>
								<g:elseif test="${i==endTimeHour && endTimeMin.toString() == "00" && m=="30" }">
								</g:elseif>
								<g:else> 
									<option value="${i}${m}">${i>12? (i==24? i+":" + m + " AM": i-12 +":" + m + " PM") : (i==12? i+":" + m + " PM": i+":" + m +" AM")}</option>
								</g:else>
							</g:each>
						</g:each>
					</select>
    			</div>
    			<label for="inputEmail3" class="col-sm-1 control-label">to</label>
    			<div class ="col-sm-3">
					<select class="form-control" id="endTimeModal" style="width: 120px">
					<g:each var="i" in="${ (startTimeHour..<endTimeHour+1) }">
						<g:each var="m" in="${ calendarTimeInterval == 30?["00","30"] : (calendarTimeInterval == 15? ["00","15","30", "45"] : (calendarTimeInterval==60?["00"]:["00"]))}">
							<g:if test="${i==startTimeHour && startTimeMin.toString() == "30" && m=="00"}">
									
							</g:if>
							<g:elseif test="${i==endTimeHour && endTimeMin.toString() == "00" && m=="30" }">
							</g:elseif>
							<g:else> 
								<option value="${i}${m}">${i>12? (i==24? i+":" + m + " AM": i-12 +":" + m + " PM") : (i==12? i+":" + m + " PM": i+":" + m +" AM")}</option>
							</g:else>
						</g:each>
					</g:each>
					</select> 
    			</div>
			</div>
			<div class="form-group">
				<label for="inputEmail3" class="col-sm-2 control-label" style="font-size:10px"># of Shifts</label>
				<div class ="col-sm-2">
					<input type="text" class="form-control" id="numOfEmployeesInputModal" placeholder="1">
				</div>
			</div>
			<div class="form-group">
				<label for="inputEmail3" class="col-sm-2 control-label" style="">Notes</label>
				<div class ="col-sm-10">
					<textarea class="form-control" id="shiftNotesModal" rows="3"></textarea>
				</div>
			</div>
      	</form>
      </div>
       
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-success" id="saveShiftDetailsModal" >Save changes</button>
        
      </div>
    </div>
  </div>
</div> 
</body>

</html>
