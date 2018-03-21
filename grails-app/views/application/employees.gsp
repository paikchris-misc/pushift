
<!DOCTYPE html>
<html lang="en">

<head>
	<meta name="layout" content="applicationMain"/>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
	%{--<link href="${request.contextPath}/Application/css/employee.css" rel="stylesheet">--}%
	<script src="${request.contextPath}/Application/js/jquery.js"></script>
	<script src="${request.contextPath}/Application/js/employee.js"></script>
    <title>Simple Sidebar - Start Bootstrap Template</title>
</head>

<body>
		<div class="mainContentContainerAPP" style="padding:30px;">
				<div class='col-xs-12 customPage-header'>
					<h2 style="">Employees</h2>
				</div>
			<div class='row'>
				<div class='col-xs-12'>
					
					<button type="button" class="btn btn-default" 
					data-toggle="collapse" data-target="#addCustomerCollapse" 
					aria-expanded="false" aria-controls="addCustomerCollapse">Add Employee</button>
					<button type="button" class="btn btn-default">Remove Employee</button>
				</div>
			</div>
			<div class='row collapse' id="addCustomerCollapse" >
				<div class='col-xs-12'>
				<div class='customPanel well' style=''>
					<div class='panel-body'>
						<form class="form-inline">
							<div class="form-group">
								<label for="addEmployeeFirstName">First Name</label> <input type="text"
									class="form-control" id="addEmployeeFirstName"
									placeholder="John">
							</div>
							<div class="form-group">
								<label for="addEmployeeLastName">Last Name</label> <input type="text"
									class="form-control" id="addEmployeeLastName"
									placeholder="John">
							</div>
							<div class="form-group">
								<label for="exampleInputEmail2">Email</label> <input type="email"
									class="form-control" id="exampleInputEmail2"
									placeholder="jane.doe@example.com">
							</div>
							<button type="submit" class="btn btn-default" style="margin-top:25px">Send
								invitation</button>
						</form>
					</div>
				</div>
			</div>
			</div>
			<div class='row' style="margin-top:6px">
				<div class='col-xs-5'>
					<div class='customPanel'>
					<div class='panel-heading'>
	       				Employees
	       			</div>
						<table class='table  table-hover'>
							<thead>
							<tr>
							 	<g:sortableColumn property="userID" title="${message(code: 'user.ID.label', default: 'User ID')}" />
								<g:sortableColumn property="userEmail" title="${message(code: 'user.email.label', default: 'User Email')}" />
								<g:sortableColumn property="userFirstName" title="${message(code: 'user.label', default: 'First Name')}" />
								<g:sortableColumn property="userLastName" title="${message(code: 'user.label', default: 'Last Name')}" />
								<g:sortableColumn property="userRole" title="${message(code: 'user.label', default: 'Role')}" />
								<g:sortableColumn property="userLevel" title="${message(code: 'user.label', default: 'Level')}" />
							</tr>
						</thead>
						<tbody id= "">
						<g:each in="${users}" var="user" status="i">
							<tr id="${i}" class="${(i % 2) == 0 ? 'even' : 'odd'}">
								<td class="IDTD">${i+1}</td>
								<td class="emailTD">
									<g:if test="${user.tempUser == "Y"}">
										<span class='glyphicon glyphicon-warning-sign' style='color:rgb(255, 168, 10); font-size:17px;'
											  data-toggle="tooltip" title="${user.firstName} has not completed registration"> </span>
									</g:if>
										${user.email}
								</td>
								<td class="firstNameTD">${user.firstName}</td>
								<td class="lastNameTD">${user.lastName}</td>
								<td class="roleTD">${user.employeeRole}</td>
								<td class="levelTD">${user.level}</td>
							</tr>
						</g:each>
						</tbody>
						</table>
					</div>
				</div>
				<div class='col-xs-7'>
					<div class='customPanel'>
						<div class='panel-heading'>
							Employee Availability
						</div>

						<div class='panel-body createSchedulePanelBody'>
							<button type="button" id="weekViewButton" class="btn btn-default active" style="display:none">Week</button>
							<div class="modalLoad"><!-- Place at bottom of page --></div>
							<div class='row createScheduleButtonRow'>
								<div class='col-xs-4 '>
									<button type="button" class="btn btn-default" id="heatMapButton">HeatMap</button>
								</div>
								<div class='col-xs-4' id='monthHeader'>
									<button type="button" class="btn btn-default" id='backCalendar'><</button>
									<span id='monthHeaderMonth' >Month</span>
									<button type="button" class="btn btn-default" id='forwardCalendar'>></button>
								</div>
								<div class='col-xs-4' style="float:right">

								</div>
							</div>


							<div class='customPanel panel-default'>
								<div id="startTimeHourVariable" style="display:none">${startTimeHour }</div>
								<div id="startTimeMinVariable" style="display:none">${startTimeMin }</div>
								<div id="endTimeHourVariable" style="display:none">${endTimeHour }</div>
								<div id="endTimeMinVariable" style="display:none">${endTimeMin }</div>
								<div id="userIDVariable" style="display:none">${userID }</div>
								<div id="timeIntervalVariable" style="display:none">${calendarTimeInterval }</div>
								<div id="nextIDVariable" style="display:none">${nextID }</div>
								<div id="orgIDVariable" style="display:none">${orgID }</div>
								<div id="shiftTypes" style="display:none"><g:each var="shiftType" in="${shiftTypes}">${shiftType},</g:each></div>
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

							</div>

						</div>

					</div>
				</div>

			</div>	

			<!-- EMPLOYEE AVAILABILITY PANEL -->
	       	<div class ='row'>
			<div class='col-xs-4'>
				<div class='customPanel'>
					<div class='panel-heading'>
						Edit Employee Info
					</div>
					<div class='panel-body'>
						<form class="form-horizontal">
							<div class="form-group" style="display:none">
								<label for="userIDHidden" class="col-sm-2 control-label">id</label>
								<div class="col-sm-10">
									<input type="email" class="form-control" id="userIDHidden" placeholder="id">
								</div>
							</div>
							<div class="form-group">
								<label for="inputEmail" class="col-sm-2 control-label">Email</label>
								<div class="col-sm-10">
									<input type="email" class="form-control" id="inputEmail" placeholder="" readonly>
								</div>
							</div>
							<div class="form-group">
								<label for="inputFirstName" class="col-sm-2 control-label">First Name</label>
								<div class="col-sm-10">
									<input type="text" class="form-control" id="inputFirstName" placeholder="First Name">
								</div>
							</div>
							<div class="form-group">
								<label for="inputLastName" class="col-sm-2 control-label">Last Name</label>
								<div class="col-sm-10">
									<input type="text" class="form-control" id="inputLastName" placeholder="Last Name">
								</div>
							</div>
							<div class="form-group">
								<label for="inputGroup" class="col-sm-2 control-label">Employee Role</label>
								<div class ="col-sm-10 employeeRolesCheckboxes">
									<g:each var="i" in="${employeeRoles}">
										<label class="checkbox-inline">
											<input type="checkbox" id="${i}-Checkbox" value=""> ${i}
										</label>
									</g:each>
								</div>
							</div>
							<div class="form-group">
								<label for="inputRole" class="col-sm-2 control-label">Level</label>
								<div class ="col-sm-3">
									<select class="form-control" id="inputLevel" style="width: 120px">
										<g:each var="i" in="${userLevels}">

											<option value="${i}">${i}</option>

										</g:each>
									</select>
								</div>
							</div>

							<div class="form-group">
								<div class="col-sm-offset-2 col-sm-10">
									<button  class="btn btn-default" id="employeeInfoSaveButton">Save</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
	       	</div>
			<!-- EMPLOYEE AVAILABILITY PANEL -->


        </div>
    <!-- /#wrapper -->
</body>

</html>
