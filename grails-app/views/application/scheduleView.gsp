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
    <link href="${request.contextPath}/Application/css/viewSchedule.css" rel="stylesheet">
    <script src="${request.contextPath}/Application/js/jquery.js"></script>
    %{--<script src="${request.contextPath}/Application/js/viewSchedule.js"></script>--}%
</head>

<body>
<div id="page-content-wrapper">

    <div class='row'>
        <div class='col-xs-12'>
            <div class='panel well' style='min-width:700px;'>
                <div class='panel-heading'>
                    Schedule
                </div>

                <div class='panel-body '>

                    <div class="modalLoad"><!-- Place at bottom of page --></div>

                    <div class='row' style='padding:5px; padding-top:0px;'>
                        <div class='col-xs-5'>
                            <div class="btn-group" role="group" aria-label="...">
                                <button type="button" id="dayViewButton" class="btn btn-default">Day</button>
                                <button type="button" id="weekViewButton" class="btn btn-default active">Week</button>
                                <button type="button" id="monthViewButton" class="btn btn-default">Month</button>
                                <button type="button" id="employeeViewButton" class="btn btn-default">Employee</button>
                            </div>
                        </div>

                        <div class='col-xs-2' id='monthHeader'>
                            <button type="button" class="btn btn-default" id='backCalendar'><</button>
                            <span id='monthHeaderMonth'>Month</span>
                            <button type="button" class="btn btn-default" id='forwardCalendar'>></button>
                        </div>

                        <div class='col-xs-5' style="float:right">

                            <div class="btn-group" role="group" aria-label="..." style="float:right">
                                <div style="float: left; padding-top: 7px; margin-right: 10px;">
                                    <g:each var="shiftType" in="${shiftTypes}">
                                        <label class="checkbox-inline" style="float:left">
                                            <input type="checkbox" id="${shiftType.split(" ")[0]}-Checkbox"
                                                   value="option1" checked> ${shiftType.split(" ")[0]}
                                        </label>
                                    </g:each>
                                </div>

                            </div>

                        </div>
                    </div>


                    <div class='panel panel-default'>
                        <div id="startTimeHourVariable" style="display:none">${startTimeHour}</div>

                        <div id="startTimeMinVariable" style="display:none">${startTimeMin}</div>

                        <div id="endTimeHourVariable" style="display:none">${endTimeHour}</div>

                        <div id="endTimeMinVariable" style="display:none">${endTimeMin}</div>

                        <div id="timeIntervalVariable" style="display:none">${calendarTimeInterval}</div>

                        <div id="shiftTypes" style="display:none"><g:each var="shiftType"
                                                                          in="${shiftTypes}">${shiftType},</g:each></div>

                        <div id="shiftEventsVariable" style="display:none"><g:each var="shiftEvent"
                                                                                   in="${shiftEvents}">${shiftEvent};</g:each></div>

                        <div id="scheduleEventsVariable" style="display:none"><g:each var="scheduleEvent"
                                                                                      in="${scheduleEvents}">${scheduleEvent};</g:each></div>

                        <div id="employeesListVariable" style="display:none"><g:each var="employee"
                                                                                     in="${employeeList}">${employee.id},${employee.lastName},${employee.firstName},${employee.email};</g:each></div>

                        <div class="viewType" id="weekView" style="">
                            <table class='table availabilityCalendar'>
                                <thead>
                                <tr>
                                    <td class="timeColumn "></td>
                                    <td class="dayLabel" id="SundayDayLabel"><span id="SundayDateLabel"></span><span
                                            id="hiddenDateSunday" style='display:none;'></span>Sunday</td>
                                    <td class="dayLabel" id="MondayDayLabel"><span id="MondayDateLabel"></span><span
                                            id="hiddenDateMonday" style='display:none;'></span>Monday</td>
                                    <td class="dayLabel" id="TuesdayDayLabel"><span id="TuesdayDateLabel"></span><span
                                            id="hiddenDateTuesday" style='display:none;'></span>Tuesday</td>
                                    <td class="dayLabel" id="WednesdayDayLabel"><span
                                            id="WednesdayDateLabel"></span><span
                                            id="hiddenDateWednesday" style='display:none;'></span>Wednesday</td>
                                    <td class="dayLabel" id="ThursdayDayLabel"><span id="ThursdayDateLabel"></span><span
                                            id="hiddenDateThursday" style='display:none;'></span>Thursday</td>
                                    <td class="dayLabel" id="FridayDayLabel"><span id="FridayDateLabel"></span><span
                                            id="hiddenDateFriday" style='display:none;'></span>Friday</td>
                                    <td class="dayLabel" id="SaturdayDayLabel"><span id="SaturdayDateLabel"></span><span
                                            id="hiddenDateSaturday" style='display:none;'></span>Saturday</td>
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
                                                <td class="timeColumn ${m == "00" ? "topOfHour" : ""} "
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
                                        <td class="monthViewDayLabel" ><span id="SundayDateLabelMonthView"></span></span>Sunday</td>
                                        <td class="monthViewDayLabel" ><span id="MondayDateLabelMonthView"></span></span>Monday</td>
                                        <td class="monthViewDayLabel" ><span id="TuesdayDateLabelMonthView"></span></span>Tuesday</td>
                                        <td class="monthViewDayLabel" ><span id="WednesdayDateLabelMonthView"></span></span>Wednesday</td>
                                        <td class="monthViewDayLabel" ><span id="ThursdayDateLabelMonthView"></span></span>Thursday</td>
                                        <td class="monthViewDayLabel" ><span id="FridayDateLabelMonthView"></span></span>Friday</td>
                                        <td class="monthViewDayLabel" ><span id="SaturdayDateLabelMonthView"></span></span>Saturday</td>

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
                                    <td class="dayViewTimeColumn "></td>
                                    <td class="dayViewDayLabel" id="DayLabel"><span id="dateLabelDayView">Sunday</span><span
                                            id="hiddenDateDayView" style='display:none;'>1</span></td>
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
                                                <td class="dayViewTD dayViewTimeColumn timeColumnDAYVIEW ${m == "00" ? "topOfHour" : ""} "
                                                    id="DAYtb${i}${m}"> <div class="dayViewTDDiv">${i > 12 ? (i == 24 ? i + ":" + m + " AM" : i - 12 + ":" + m + " PM") : (i == 12 ? i + ":" + m + " PM" : i + ":" + m + " AM")} </div></td>
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
                                    <td class="employeeViewNameColumn">Name</td>
                                    <td class="dayLabel" id="SundayDayLabel"><span id="SundayDateLabel"></span><span
                                            id="hiddenDateSunday" style='display:none;'></span>Sunday</td>
                                    <td class="dayLabel" id="MondayDayLabel"><span id="MondayDateLabel"></span><span
                                            id="hiddenDateMonday" style='display:none;'></span>Monday</td>
                                    <td class="dayLabel" id="TuesdayDayLabel"><span id="TuesdayDateLabel"></span><span
                                            id="hiddenDateTuesday" style='display:none;'></span>Tuesday</td>
                                    <td class="dayLabel" id="WednesdayDayLabel"><span
                                            id="WednesdayDateLabel"></span><span
                                            id="hiddenDateWednesday" style='display:none;'></span>Wednesday</td>
                                    <td class="dayLabel" id="ThursdayDayLabel"><span id="ThursdayDateLabel"></span><span
                                            id="hiddenDateThursday" style='display:none;'></span>Thursday</td>
                                    <td class="dayLabel" id="FridayDayLabel"><span id="FridayDateLabel"></span><span
                                            id="hiddenDateFriday" style='display:none;'></span>Friday</td>
                                    <td class="dayLabel" id="SaturdayDayLabel"><span id="SaturdayDateLabel"></span><span
                                            id="hiddenDateSaturday" style='display:none;'></span>Saturday</td>
                                </thead>
                                <tbody>

                                    <g:each var="employee" in="${employeeList}">
                                        <tr>
                                            <td class="employeeViewNameColumn employeeViewNameCell">

                                                <div class="employeeViewEmployeeAvatar">
                                                    <img class="monthViewAvatarPicture" src = "${grailsApplication.config?.grails?.serverURL}/application/showPicture?id=${employee.id}"/>


                                                </div>
                                                <div class="employeeViewEmployeeName">
                                                    ${employee.firstName} ${employee.lastName}
                                                </div>
                                            </td>
                                            <td class="employeeDayCell"></td>
                                            <td class="employeeDayCell"></td>
                                            <td class="employeeDayCell"></td>
                                            <td class="employeeDayCell"></td>
                                            <td class="employeeDayCell"></td>
                                            <td class="employeeDayCell"></td>
                                            <td class="employeeDayCell"></td>

                                        </tr>
                                    </g:each>

                                </tbody>
                            </table>
                        </div>

                    </div>


                </div>
            </div>
        </div>
    </div>
</div>
<!-- /#wrapper -->

</body>

</html>
