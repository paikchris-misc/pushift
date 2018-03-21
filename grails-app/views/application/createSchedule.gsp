
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
<div class="mainContentContainerAPP" style="padding:20px; margin-left: -30px; margin-right:-30px;">
	<div class="col-xs-12 customPage-header" style="padding:0">
		<div class="col-xs-4"></div>
		<div class="col-xs-4"><h2 style="">Scheduling</h2></div>
		<div class="col-xs-4" style="padding-right: 0; ">
			<div class="btn-group" role="group" aria-label="..." style="float:right;">
				<button type="button" id="dayViewButton" class="btn btn-default">Day</button>
				<button type="button" id="weekViewButton" class="btn btn-default active">Week</button>
				<button type="button" id="monthViewButton" class="btn btn-default">Month</button>
				<button type="button" id="employeeViewButton" class="btn btn-default">Employee</button>
			</div>
		</div>
	</div>
	<div id="createScheduleWrapper">
		<div class='row'  >
			<div class='col-xs-12'>
				<div class='createSchedulePanelBody'>
					<div class="modalLoad"><!-- Place at bottom of page --></div>
					<div class='row createScheduleButtonRow'>
						<div class='col-xs-5 '>
							<g:if test="${pageName=="Create Schedule"}">
								<div class="btn-group" role="group" aria-label="...">
									<div class="btn-group" id="shiftTypesDropdown" >
										<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
											<span class="glyphicon glyphicon-pencil"> </span>
											<span id="shiftTypeDropdownText">${shiftTypes[0].split(":color:")[0]}</span><div id="shiftTypeDropDownColorBox" style="background-color: ${shiftTypes[0].split(":color:")[1]}; height:15px; width:15px; float:right; margin-top:3px; margin-left:10px"></div>
										</button>
										<ul class="dropdown-menu" role="menu">
											<g:each var="shiftType" in="${shiftTypes}">
												<li><a class="shiftType" id="${shiftType }" href="javascript:return false;"><div style="background-color: ${shiftType.split(":color:")[1]}; height:15px; width:15px; float:right; margin-top:3px"></div>${shiftType.split(":color:")[0]}</a></li>
											</g:each>
											<li class="divider"></li>
											<li><a href="#">Edit Shifts</a></li>
										</ul>
									</div>
								</div>

								<div class="btn-group" role="group" aria-label="...">
									<button type="button" class="btn btn-default" id='scheduleOptionsButton'>Schedule Options</button>
									<button type="button" class="btn btn-primary" id='generateSchedule'>Generate Schedule</button>
								</div>
							</g:if>
							<g:elseif test="${pageName=="Schedule View"}">
								View Schedule
							</g:elseif>




						</div>
						<div class='col-xs-2' id='monthHeader'>
							<button type="button" class="btn btn-default" id='backCalendar'>
								<span class="glyphicon glyphicon-chevron-left"> </span>
							</button>
							<span id='monthHeaderMonth' >Month</span>
							<button type="button" class="btn btn-default" id='forwardCalendar'>
								<span class="glyphicon glyphicon-chevron-right"> </span>
							</button>
						</div>
						<div class='col-xs-5' style="float:right">
							<div class="btn-group" role="group" aria-label="..." style="float:right">
								<button type="button" class="btn btn-info" id='buttonSaveShifts' style="float:right">Save</button>
							</div>
							<div class="btn-group" role="group" aria-label="..." style="float:right">
								<div style="float: left; padding-top: 7px; margin-right: 10px;">
									<g:each var="shiftType" in="${shiftTypes}" >
										<label class="checkbox-inline" style="float:left">
											<input type="checkbox" class="viewShiftTypeCheckbox" id="${shiftType.split(":color:")[0]}-Checkbox" value="option1" checked> ${shiftType.split(":color:")[0]}
										</label>
									</g:each>
								</div>

							</div>


							<%--								<div class="alert alert-success alert-dismissible" id="saveSuccess" role="alert" style="display:none; padding:7px; font-size:80%">--%>
							<%--								  <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>--%>
							<%--								  <strong>Saved!</strong>--%>
							<%--								</div>--%>
						</div>
					</div>


					<div class='panel panel-default'>
						<div id="startTimeHourVariable" style="display:none">${startTimeHour }</div>
						<div id="startTimeMinVariable" style="display:none">${startTimeMin }</div>
						<div id="endTimeHourVariable" style="display:none">${endTimeHour }</div>
						<div id="endTimeMinVariable" style="display:none">${endTimeMin }</div>
						<div id="timeIntervalVariable" style="display:none">${calendarTimeInterval }</div>
						<div id="nextIDVariable" style="display:none">${nextID }</div>
						<div id="orgIDVariable" style="display:none">${orgID }</div>
						<div id="shiftTypes" style="display:none"><g:each var="shiftType" in="${shiftTypes}">${shiftType};</g:each></div>
						<div id="shiftEventsVariable" style="display:none"><g:each var="shiftEvent" in="${shiftEvents}">${shiftEvent};</g:each></div>
						<div id="scheduleEventsVariable" style="display:none"><g:each var="scheduleEvent" in="${scheduleEvents}">${scheduleEvent};</g:each></div>

						<div id="employeesListVariable" style="display:none"><g:each var="employee" in="${employeeList}">${employee.id},${employee.lastName},${employee.firstName},${employee.email};</g:each></div>

						<div class="viewType" id="weekView" style="">
							<table class='table availabilityCalendar'>
								<thead>
								<tr>
									<td class="timeColumn "></td>
									<td class="dayLabel weekViewDayLabel" id="weekViewSundayDayLabel"><span id="SundayDateLabel"></span><span
											class="hiddenDate" id="weekViewHiddenDateSunday" style='display:none;'></span>Sunday</td>
									<td class="dayLabel weekViewDayLabel" id="weekViewMondayDayLabel"><span id="MondayDateLabel"></span><span
											class="hiddenDate" id="weekViewHiddenDateMonday" style='display:none;'></span>Monday</td>
									<td class="dayLabel weekViewDayLabel" id="weekViewTuesdayDayLabel"><span id="TuesdayDateLabel"></span><span
											class="hiddenDate" id="weekViewHiddenDateTuesday" style='display:none;'></span>Tuesday</td>
									<td class="dayLabel weekViewDayLabel" id="weekViewWednesdayDayLabel"><span
											id="WednesdayDateLabel"></span><span
											class="hiddenDate" id="weekViewHiddenDateWednesday" style='display:none;'></span>Wednesday</td>
									<td class="dayLabel weekViewDayLabel" id="weekViewThursdayDayLabel"><span id="ThursdayDateLabel"></span><span
											class="hiddenDate" id="weekViewHiddenDateThursday" style='display:none;'></span>Thursday</td>
									<td class="dayLabel weekViewDayLabel" id="weekViewFridayDayLabel"><span id="FridayDateLabel"></span><span
											class="hiddenDate" id="weekViewHiddenDateFriday" style='display:none;'></span>Friday</td>
									<td class="dayLabel weekViewDayLabel" id="weekViewSaturdayDayLabel"><span id="SaturdayDateLabel"></span><span
											class="hiddenDate" id="weekViewHiddenDateSaturday" style='display:none;'></span>Saturday</td>
								</tr>
								</thead>
								<tbody>
								<g:each var="i" in="${(startTimeHour..<endTimeHour + 1)}">
									<g:each var="m"
											in="${calendarTimeInterval == 30 ? ["00", "30"] : (calendarTimeInterval == 15 ? ["00", "15", "30", "45"] : (calendarTimeInterval == 60 ? ["00"] : ["00"]))}">
										<g:if test="${i == startTimeHour && startTimeMin.toString() == "30" && m == "00"}">

										</g:if>
										<g:elseif
												test="${i == endTimeHour && endTimeMin.toString() == "00" && m == "30"}">
										</g:elseif>
										<g:elseif
												test="${i == endTimeHour && endTimeMin.toString() == "00" && m == "00"}">
										</g:elseif>
										<g:elseif
												test="${i == endTimeHour && endTimeMin.toString() == "30" && m == "30"}">
										</g:elseif>
										<g:else>
											<tr>
												<td class="timeColumn weekViewTimeColumn ${m == "00" ? "topOfHour" : ""} "
													id="TimeColumntb${i}${m}">${i > 12 ? (i == 24 ? i + ":" + m + " AM" : i - 12 + ":" + m + " PM") : (i == 12 ? i + ":" + m + " PM" : i + ":" + m + " AM")}</td>
												<td class="timeBlock Sunday  ${m == "00" ? "topOfHour" : ""}"
													id="Suntb${String.valueOf(i).length() < 2 ? "0" + i : i}${m}"></td>
												<td class="timeBlock Monday ${m == "00" ? "topOfHour" : ""}"
													id="Montb${String.valueOf(i).length() < 2 ? "0" + i : i}${m}"></td>
												<td class="timeBlock Tuesday ${m == "00" ? "topOfHour" : ""}"
													id="Tuetb${String.valueOf(i).length() < 2 ? "0" + i : i}${m}"></td>
												<td class="timeBlock Wednesday ${m == "00" ? "topOfHour" : ""}"
													id="Wedtb${String.valueOf(i).length() < 2 ? "0" + i : i}${m}"></td>
												<td class="timeBlock Thursday ${m == "00" ? "topOfHour" : ""} "
													id="Thutb${String.valueOf(i).length() < 2 ? "0" + i : i}${m}"></td>
												<td class="timeBlock Friday ${m == "00" ? "topOfHour" : ""} "
													id="Fritb${String.valueOf(i).length() < 2 ? "0" + i : i}${m}"></td>
												<td class="timeBlock Saturday ${m == "00" ? "topOfHour" : ""}"
													id="Sattb${String.valueOf(i).length() < 2 ? "0" + i : i}${m}"></td>
											</tr>
										</g:else>
									</g:each>
								</g:each>
								</tbody>
							</table>
						</div>

						<div class="viewType" id="monthView">
							<table class="table availabilityCalendar availabilityCalendarMonth">
								<thead>
								<tr>
									<td class="dayLabel monthViewDayLabel" ><span id="monthViewSundayDateLabel"></span></span>Sunday</td>
									<td class="dayLabel monthViewDayLabel" ><span id="monthViewMondayDateLabel"></span></span>Monday</td>
									<td class="dayLabel monthViewDayLabel" ><span id="monthViewTuesdayDateLabel"></span></span>Tuesday</td>
									<td class="dayLabel monthViewDayLabel" ><span id="monthViewWednesdayDateLabel"></span></span>Wednesday</td>
									<td class="dayLabel monthViewDayLabel" ><span id="monthViewThursdayDateLabel"></span></span>Thursday</td>
									<td class="dayLabel monthViewDayLabel" ><span id="monthViewFridayDateLabel"></span></span>Friday</td>
									<td class="dayLabel monthViewDayLabel" ><span id="monthViewSaturdayDateLabel"></span></span>Saturday</td>

								</tr>
								</thead>
								<tbody id = monthViewTableBody>

								</tbody>
							</table>
						</div>

						<div class="viewType" id="dayView">
							<table class="table availabilityCalendar availabilityCalendarDay">
								<thead>
								<tr>
									<td class="dayViewTimeColumn timeColumn"></td>
									<td class="dayLabel dayViewDayLabel" id="dayViewDayLabel"><span id="dayViewDateLabel">Sunday</span><span
											class='hiddenDate' id="dayViewHiddenDate" style='display:none;'>1</span></td>
								</tr>
								</thead>
								<tbody>
								<g:each var="i" in="${(startTimeHour..<endTimeHour + 1)}">
									<g:each var="m"
											in="${calendarTimeInterval == 30 ? ["00", "30"] : (calendarTimeInterval == 15 ? ["00", "15", "30", "45"] : (calendarTimeInterval == 60 ? ["00"] : ["00"]))}">
										<g:if test="${i == startTimeHour && startTimeMin.toString() == "30" && m == "00"}">

										</g:if>
										<g:elseif
												test="${i == endTimeHour && endTimeMin.toString() == "00" && m == "30"}">
										</g:elseif>
										<g:elseif
												test="${i == endTimeHour && endTimeMin.toString() == "00" && m == "00"}">
										</g:elseif>
										<g:elseif
												test="${i == endTimeHour && endTimeMin.toString() == "30" && m == "30"}">
										</g:elseif>
										<g:else>
											<tr>
												<td class="dayViewTD dayViewTimeColumn timeColumn  ${m == "00" ? "topOfHour" : ""} "
													id="DAYVIEWtb${i}${m}"> <div class="dayViewTDDiv">${i > 12 ? (i == 24 ? i + ":" + m + " AM" : i - 12 + ":" + m + " PM") : (i == 12 ? i + ":" + m + " PM" : i + ":" + m + " AM")} </div></td>
												<td class="dayViewTD dayViewTimeBlock timeBlock ${m == "00" ? "topOfHour" : ""}"
													id="DAYVIEWDaytb${String.valueOf(i).length() < 2 ? "0" + i : i}${m}"></td>
											</tr>
										</g:else>
									</g:each>
								</g:each>
								</tbody>
							</table>
						</div>

						<div class="viewType" id="employeeView">
							<table class="table availabilityCalendar availabilityCalendarEmployee">
								<thead>
								<td class="employeeViewNameColumn timeColumn">Name</td>
								<td class="dayLabel employeeViewDayLabel" id="employeeViewSundayDayLabel"><span id="employeeViewSundayDateLabel"></span><span
										id="employeeViewHiddenDateSunday" style='display:none;'></span>Sunday</td>
								<td class="dayLabel employeeViewDayLabel" id="employeeViewMondayDayLabel"><span id="employeeViewMondayDateLabel"></span><span
										id="employeeViewHiddenDateMonday" style='display:none;'></span>Monday</td>
								<td class="dayLabel employeeViewDayLabel" id="employeeViewTuesdayDayLabel"><span id="employeeViewTuesdayDateLabel"></span><span
										id="employeeViewHiddenDateTuesday" style='display:none;'></span>Tuesday</td>
								<td class="dayLabel employeeViewDayLabel" id="employeeViewWednesdayDayLabel"><span
										id="employeeViewWednesdayDateLabel"></span><span
										id="employeeViewHiddenDateWednesday" style='display:none;'></span>Wednesday</td>
								<td class="dayLabel employeeViewDayLabel" id="employeeViewThursdayDayLabel"><span id="employeeViewThursdayDateLabel"></span><span
										id="employeeViewHiddenDateThursday" style='display:none;'></span>Thursday</td>
								<td class="dayLabel employeeViewDayLabel" id="employeeViewFridayDayLabel"><span id="employeeViewFridayDateLabel"></span><span
										id="employeeViewHiddenDateFriday" style='display:none;'></span>Friday</td>
								<td class="dayLabel employeeViewDayLabel" id="employeeViewSaturdayDayLabel"><span id="employeeViewSaturdayDateLabel"></span><span
										id="employeeViewHiddenDateSaturday" style='display:none;'></span>Saturday</td>
								</thead>
								<tbody>

								<g:each var="employee" in="${employeeList}">
									<tr>
										<td class="employeeViewNameColumn employeeViewNameCell">

											<div class="employeeViewEmployeeAvatar">
												%{--<img class="monthViewAvatarPicture" src = "${grailsApplication.config?.grails?.serverURL}/application/showPicture?id=${employee.id}"/>--}%


											</div>
											<div class="employeeViewEmployeeName">
												${employee.firstName} ${employee.lastName}
											</div>
										</td>
										<td class="employeeDayCell timeblock SundayEmployeeTimeBlock" id="${employee.firstName}${employee.lastName}+Sun+"></td>
										<td class="employeeDayCell timeblock MondayEmployeeTimeBlock" id="${employee.firstName}${employee.lastName}+Mon+"></td>
										<td class="employeeDayCell timeblock TuesdayEmployeeTimeBlock" id="${employee.firstName}${employee.lastName}+Tue+"></td>
										<td class="employeeDayCell timeblock WednesdayEmployeeTimeBlock" id="${employee.firstName}${employee.lastName}+Wed+"></td>
										<td class="employeeDayCell timeblock ThursdayEmployeeTimeBlock" id="${employee.firstName}${employee.lastName}+Thu+"></td>
										<td class="employeeDayCell timeblock FridayEmployeeTimeBlock" id="${employee.firstName}${employee.lastName}+Fri+"></td>
										<td class="employeeDayCell timeblock SaturdayEmployeeTimeBlock" id="${employee.firstName}${employee.lastName}+Sat+"></td>

									</tr>
								</g:each>

								</tbody>
							</table>
						</div>
					</div>
					<button type="button" class="btn btn-default" id='clearShiftsButton' >Clear Shifts</button>
					<button type="button" class="btn btn-default" id='clearEmployeesButton' >Clear Employees</button>

				</div>

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
			      		<span id="shiftTypeDropdownTextModal">${shiftTypes[0].split(":color:")[0]}</span><div id="shiftTypeDropDownColorBoxModal" style="background-color: ${shiftTypes[0].split(":color:")[1]}; height:15px; width:15px; float:right; margin-top:3px; margin-left:10px"></div>
					</button>
					<ul class="dropdown-menu" role="menu">
						<g:each var="shiftType" in="${shiftTypes}">
							<li><a class="shiftTypeModal" id="${shiftType }" href="#"><div style="background-color: ${shiftType.split(":color:")[1]}; height:15px; width:15px; float:right; margin-top:3px"></div>${shiftType.split(":color:")[0]}</a></li>
						</g:each>
							<li class="divider"></li>
							<li><a href="#">Edit Shifts</a></li>
					</ul>
				</div>
			</div>
			<div class="form-group" id="startDateGroup">
				<label for="inputEmail3" class="col-sm-2 control-label" >Date</label>
				<div class ="col-sm-3">
					<div class ="">
						<input type="text" class="form-control" id="datePicker">
					</div>
				</div>
			</div>
			<div class="form-group" id="daySelectorGroup"style = "display:none">
			<label for="inputEmail3" class="col-sm-2 control-label">Day</label>
			<div class ="col-sm-3">
				<select class="form-control" id="daySelector" style="width: 120px">
					<g:each var="c" in="${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]}">
						<option value="${c}">${c}</option>
					</g:each>
				</select>
			</div>
		</div>
			<div class="form-group" id="startEndTimeInputModal">
				<label for="inputEmail3" class="col-sm-2 control-label">Time</label>
				<div class ="col-sm-3">
					<div class="" id="startTimeInputModalDiv">
						<select class="form-control" id="startTimeModal" style="width: 120px">
						<option value="none">-</option>
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
    			<label for="inputEmail3" class="col-sm-1 control-label">to</label>
    			<div class ="col-sm-3">
					<div class="" id="endTimeInputModalDiv">
						<select class="form-control" id="endTimeModal" style="width: 120px">
							<option value="none">-</option>
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
				<div class ="col-sm-1">
					<span class="glyphicon glyphicon-remove-circle" style="color:#ff0000;font-size:17px;line-height: 1.7"></span>
				</div>
			</div>
			<div class="form-group" id="repeatSelectorGroup">
				<label for="inputEmail3" class="col-sm-2 control-label">Repeat</label>
				<div class ="col-sm-3">
					<select class="form-control" id="repeatSelector" style="width: 120px">
						<g:each var="c" in="${["No", "Yes"]}">
							<option value="${c}">${c}</option>
						</g:each>
					</select>
				</div>
			</div>
			<div class="form-group" id="repeatCheckboxGroup" style="display:none">
				<label for="inputEmail3" class="col-sm-2 control-label">Repeat</label>
				<div class ="col-sm-10">
					<label class="checkbox-inline">
						<input type="checkbox" class="repeatDayCheckbox" id="repeatSunCheckbox" > Sun
					</label>
					<label class="checkbox-inline">
						<input type="checkbox" class="repeatDayCheckbox" id="repeatMonCheckbox" > Mon
					</label>
					<label class="checkbox-inline">
						<input type="checkbox" class="repeatDayCheckbox" id="repeatTueCheckbox" > Tue
					</label>
					<label class="checkbox-inline">
						<input type="checkbox" class="repeatDayCheckbox" id="repeatWedCheckbox" > Wed
					</label>
					<label class="checkbox-inline">
						<input type="checkbox" class="repeatDayCheckbox" id="repeatThuCheckbox" > Thu
					</label>
					<label class="checkbox-inline">
						<input type="checkbox" class="repeatDayCheckbox" id="repeatFriCheckbox" > Fri
					</label>
					<label class="checkbox-inline">
						<input type="checkbox" class="repeatDayCheckbox" id="repeatSatCheckbox" > Sat
					</label>
				</div>
			</div>
			<div class="form-group" id="repeatEndSelectorGroup">
				<label for="inputEmail3" class="col-sm-2 control-label" style="font-size:11px">Repeat End</label>
				<div class ="col-sm-3">
					<select class="form-control" id="repeatEndSelector" style="width: 120px">
						<g:each var="c" in="${["1 Year", "After", "On Date"]}">
							<option value="${c}">${c}</option>
						</g:each>
					</select>
				</div>
				<div class ="col-sm-3" id="repeatEndDatePickerDiv">
					<div class ="">
						<input type="text" class="form-control" id="endDatePicker">
					</div>
				</div>
				<div class ="col-sm-2 repeatEndAfterDiv">
					<div class ="">
						<input type="number" class="form-control" id="endAfterXTimes" min="0">
					</div>
				</div>
				<div class ="col-sm-2 repeatEndAfterDiv" style="padding-left:0px">
					<label class="col-sm-2 control-label" style="padding-left:0px">Occurrances</label>
				</div>
			</div>
			<div class="form-group">
				<label for="inputEmail3" class="col-sm-2 control-label" style="font-size:12px"># of Shifts</label>
				<div class ="col-sm-3">
					<div class ="">
						<input type="text" class="form-control" id="numOfEmployeesInputModal" placeholder="1">
					</div>
				</div>
			</div>
			<div class="form-group">
				<label for="inputEmail3" class="col-sm-2 control-label" style="font-size:12px;margin-top: -10px;">Employee(s) Scheduled</label>
				<div class ="col-sm-3">
	    			<div class ="">
						<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
				      		<span id="scheduledEmployeeDropdownTextModal">None</span>
						</button>
						<ul class="dropdown-menu" role="menu">
							<g:each var="employee" in="${employeeList}">
								<li><a class="scheduledEmployeeModal" id="${employee.firstName} ${employee.lastName}--${employee.id}" href="#">${employee.firstName} ${employee.lastName} <span class="glyphicon glyphicon-ok" style="margin-left:10px; display:none"> </span></a></li>
							</g:each>
						</ul>
					</div>
				</div>
			</div>
			<div class="form-group">
				<label for="inputEmail3" class="col-sm-2 control-label" style="">Notes</label>
				<div class ="col-sm-10">
					<textarea class="form-control" id="shiftNotesModal" rows="3"></textarea>
				</div>
			</div>
			%{--<div class="form-group">--}%
				%{--<label for="inputEmail3" class="col-sm-2 control-label" style=""></label>--}%
				%{--<div class ="col-sm-10">--}%

					%{--<label class="radio-inline"><input type="radio" name="weeklyRadioButton" id="oneTimeRadioButton" value="oneTime" checked="checked" >One Time Shift</label>--}%
					%{--<label class="radio-inline"><input type="radio" name="weeklyRadioButton" id="weeklyRadioButton" value="weekly" >Weekly Shift</label>--}%
				%{--</div>--}%
			%{--</div>--}%
      	</form>
      </div>
       
      <div class="modal-footer" id="oneTimeShiftFooter">
		<button type="button" class="btn btn-default" id="closeShiftDetailsModal" data-dismiss="modal">Close</button>
		<button type="button" class="btn btn-success" id="saveShiftDetailsModal">Save changes</button>
	  </div>
		<div class="modal-footer" id="weeklyShiftFooter" style="display:none">
			<button type="button" class="btn btn-default" id="closeWeeklyShiftDetailsModal" data-dismiss="modal">Close</button>
			<button type="button" class="btn btn-success" id="saveWeeklyThisEventShiftDetailsModal">Save This Event</button>
			<button type="button" class="btn btn-success" id="saveWeeklyAllEventsShiftDetailsModal">Save For All Events</button>
		</div>
    </div>
  </div>
</div> 
<!-- END Shift Details Modal -->


<!-- Schedule Options Modal --> 
<div class="modal fade" id="scheduleOptionsModal" tabindex="-1" role="dialog" aria-labelledby="scheduleOptionsModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="myModalLabel">Scheduling Options</h4>
      </div>
      <div class="modal-body">
      	<form class="form-horizontal">

			<div class="form-group">
    			<div class ="col-sm-12">
					<label class="checkbox-inline">
						<input type="checkbox" id="overwriteCurrentSchedule" > Overwrite currently scheduled employees
					</label>
				</div>
			</div>

			<div class="form-group" style="margin-bottom: 0px;">
				<div class ="col-sm-12">
					<label class="checkbox-inline">
						<input type="checkbox" id="moreThanOneShiftPerDayAllowed" > Allow employees to work more than one shift per day (Allow Double Shifts)
					</label>
				</div>
			</div>

			<div class="form-group" style="margin-left: -45px;">
				<div class ="col-sm-1">
				</div>
				<div class ="col-sm-11">
					<label class="checkbox-inline">
						<input type="checkbox" id="backToBackOvelapShiftsAllowed" > Allow employees to work back to back shifts that overlap by less than 30 min
					</label>
				</div>
			</div>

      	</form>
      </div>
       
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-success" id="saveScheduleOptionsModal" >Save changes</button>
        
      </div>
    </div>
  </div>
</div> 
<!-- END Schedule Options Modal -->


<!-- Weekly Shift Confirmation Modal -->
<div class="modal fade" id="weeklyShiftModal" tabindex="-1" role="dialog" aria-labelledby="weeklyShiftModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="">Weekly Event</h4>
			</div>
			<div class="modal-body">
				<form class="form-horizontal">
					Do you want to change only this occurrence of the event, or this and all future occurrences?
					<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
					<button type="button" class="btn btn-default" id="onlyThisEventButton" >Only This Event</button>
					<button type="button" class="btn btn-default" id="allEventButton" >All Events</button>

				</form>
			</div>

			<div class="modal-footer">

			</div>
		</div>
	</div>
</div>
<!-- END Schedule Options Modal -->

<!-- Weekly Shift Confirmation Modal -->
<div class="modal fade" id="deleteRepeatingShiftModal" tabindex="-1" role="dialog" aria-labelledby="weeklyShiftModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="">Weekly Event</h4>
			</div>
			<div class="modal-body">
				<form class="form-horizontal">
					Do you want to delete only this occurrence of the event, or this and all future occurrences?
					<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
					<button type="button" class="btn btn-default" id="deleteOnlyThisEventButton" >Only This Event</button>
					<button type="button" class="btn btn-default" id="deleteAllEventButton" >All Events</button>

				</form>
			</div>

			<div class="modal-footer">

			</div>
		</div>
	</div>
</div>
<!-- END Schedule Options Modal -->

</body>

</html>
