
<!DOCTYPE html>
<html lang="en">

<head>
	<meta name="layout" content="applicationMain"/>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
	
    <title>Simple Sidebar - Start Bootstrap Template</title>
</head>

<body>
		<div id="page-content-wrapper"> 
			<div class='col-xs-12 page-header'>
				<h2>My Availability</h2>
			</div>
			<div class='row'  >
				<div class='col-xs-12'>
				
				</div>
			</div>
			<div class='row'  >
				<div class='col-xs-12'>
					<div class='panel well' style='min-width:900px;'>
						<div class='panel-heading'>
							Availability Calendar
						</div>
						<div class='panel-body '>
						<div class="modalLoad"><!-- Place at bottom of page --></div>
						<div class='row' style='padding:5px; padding-top:0px;'>
							<div class='col-xs-5'>
								<button type="button" class="btn btn-danger active" id='buttonUnavailable'>Unavailable</button>
								<!-- <button type="button" class="btn btn-success" id='buttonAvailable'>Available</button>--> 
								<button type="button" class="btn btn-info" id='buttonSaveAvailability'>Save</button>
								<div class="alert alert-success alert-dismissible" id="saveSuccess" role="alert" style="display:none; padding:7px; font-size:80%">
							  		<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
							  		<strong>Saved!</strong> Availability has been saved.
								</div>
							</div>
							<div class='col-xs-2' id='monthHeader'>
								<button type="button" class="btn btn-default" id='backCalendar'><</button>
								<span id='monthHeaderMonth' >Month</span>
								<button type="button" class="btn btn-default" id='forwardCalendar'>></button>
							</div>
							<div class='col-xs-5'>
							</div>
							
						</div>
						
							<div class='panel panel-default'>
								<div id="startTimeHourVariable" style="display:none">${startTimeHour }</div>
								<div id="startTimeMinVariable" style="display:none">${startTimeMin }</div>
								<div id="endTimeHourVariable" style="display:none">${endTimeHour }</div>
								<div id="endTimeMinVariable" style="display:none">${endTimeMin }</div>
								<div id="timeIntervalVariable" style="display:none">${calendarTimeInterval }</div>
								<div id="availabilityEventsVariable" style="display:none">${availabilityEvents }</div>
								<table class='table availabilityCalendar' id = "availabilityCalendarWrapper">
									<thead>
										<tr>
											<td class="timeColumn "></td>
											<td class="dayLabel" id="SundayDayLabel"><span id="SundayDateLabel"></span><span id="hiddenDateSunday" style='display:none;'></span>Sunday</td>
											<td class="dayLabel" id="MondayDayLabel"><span id="MondayDateLabel"></span><span id="hiddenDateMonday" style='display:none;'></span>Monday</td>
											<td class="dayLabel" id="TuesdayDayLabel"><span id="TuesdayDateLabel"></span><span id="hiddenDateTuesday" style='display:none;'></span>Tuesday</td>
											<td class="dayLabel" id="WednesdayDayLabel"><span id="WednesdayDateLabel"></span><span id="hiddenDateWednesday" style='display:none;'></span>Wednesday</td>
											<td class="dayLabel" id="ThursdayDayLabel"><span id="ThursdayDateLabel"></span><span id="hiddenDateThursday" style='display:none;'></span>Thursday</td>
											<td class="dayLabel" id="FridayDayLabel"><span id="FridayDateLabel"></span><span id="hiddenDateFriday" style='display:none;'></span>Friday</td>
											<td class="dayLabel" id="SaturdayDayLabel"><span id="SaturdayDateLabel"></span><span id="hiddenDateSaturday" style='display:none;'></span>Saturday</td>
										
										</tr>
									</thead>
									<tbody>
										<g:each var="i" in="${ (startTimeHour..<endTimeHour+1) }">
											<g:each var="m" in="${ calendarTimeInterval == 30?["00","30"] : (calendarTimeInterval == 15? ["00","15","30", "45"] : (calendarTimeInterval==60?["00"]:["00"]))}">
												<g:if test="${i==startTimeHour && startTimeMin.toString() == "30" && m=="00"}">
												
												</g:if>
												<g:elseif test="${i==endTimeHour && endTimeMin.toString() == "00" && m=="30" }">
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
						</div>
					</div>
				</div>
			</div>
					<!-- 
						<div id="availabilityCalendarWrapper" style="overflow:hidden; ">
						<div id="dayLabels" style="overflow:hidden;">
							<div id="SundayLabel" style="float:left;border-right:solid; border-width: thin; width:200px; text-align: center">
								<strong>Sunday</strong>
							</div>
							<div id="MondayLabel" style="float:left;border:solid; border-width: thin; width:200px; text-align: center">
								<strong>Monday</strong>
							</div>
							<div id="TuesdayLabel" style="float:left;border:solid; border-width: thin; width:200px; text-align: center">
								<strong>Tuesday</strong>
							</div>
							<div id="WednesdayLabel" style="float:left;border:solid; border-width: thin; width:200px; text-align: center">
								<strong>Wednesday</strong>
							</div>
							<div id="ThursdayLabel" style="float:left;border:solid; border-width: thin; width:200px; text-align: center">
								<strong>Thursday</strong>
							</div>
							<div id="FridayLabel" style="float:left;border:solid; border-width: thin; width:200px; text-align: center">
								<strong>Friday</strong>
							</div>
							<div id="SaturdayLabel" style="float:left;border:solid; border-width: thin; width:200px; text-align: center">
								<strong>Saturday </strong>
							</div>
						</div>
							<div id="1dayCalendar" style="float:left;border:solid; border-width: thin; width:200px; position:relative">
								
							</div>
							<div id="2dayCalendar" style="float:left;border:solid; border-width: thin; width:200px; position:relative">
								
							</div>
							<div id="3dayCalendar" style="float:left;border:solid; border-width: thin; width:200px; position:relative">
								
							</div>
							<div id="4dayCalendar" style="float:left;border:solid; border-width: thin; width:200px; position:relative">
								
							</div>
							<div id="5dayCalendar" style="float:left;border:solid; border-width: thin; width:200px; position:relative">
								
							</div>
							<div id="6dayCalendar" style="float:left;border:solid; border-width: thin; width:200px; position:relative">
								
							</div>
							<div id="7dayCalendar" style="float:left;border:solid; border-width: thin; width:200px; position:relative">
								
							</div>
						</div>
					</div>
				</div>
				</div>
				 -->
	        
        </div>
    <!-- /#wrapper -->
    
    <!-- Shift Details Modal --> 
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="myModalLabel">Unavailability Detail</h4>
      </div>
      <div class="modal-body">
      	<div id="currentlyEditingEventID" style="display:none">ssd</div>
      	<form class="form-horizontal">
      		
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
				<label for="inputEmail3" class="col-sm-2 control-label" style="">Notes</label>
				<div class ="col-sm-10">
					<textarea class="form-control" id="shiftNotesModal" rows="3"></textarea>
				</div>
			</div>
			<div class="form-group">
				<label for="inputEmail3" class="col-sm-2 control-label" style=""></label>
				<div class ="col-sm-10">
					<label class="radio-inline"><input type="radio" name="weeklyRadioButton" id="weeklyRadioButton" value="weekly" checked="checked">Weekly Shift</label>
					<label class="radio-inline"><input type="radio" name="weeklyRadioButton" id="oneTimeRadioButton" value="oneTime" >One Time Shift</label>
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
