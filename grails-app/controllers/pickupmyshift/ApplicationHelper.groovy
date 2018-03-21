package pickupmyshift

import java.text.SimpleDateFormat
import groovy.time.TimeCategory
import groovy.time.TimeDuration

class ApplicationHelper {

    def userLevels = ["Manager", "Employee"];
    def daysOfWeek = ["", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    def daysOfWeekAbrev = ["", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    SimpleDateFormat eventDayAbbrev = new SimpleDateFormat("E");
    SimpleDateFormat eventTimeFormat = new SimpleDateFormat("HHmm");
    SimpleDateFormat eventDateFormatted = new SimpleDateFormat("MM/dd/yyyy");

    //Gets Start hour in Correct format just in case of 24 hour time
    def getStartHourOfOrganization(record){
        def startTimeHour
        if(record.startTimeOfWorkDay.split("\\s+")[2] == "AM"){
            startTimeHour = record.startTimeOfWorkDay.split("\\s+")[0].toInteger();
        }
        else if (record.startTimeOfWorkDay.split("\\s+")[2] == "PM"){
            startTimeHour = record.startTimeOfWorkDay.split("\\s+")[0].toInteger() + 12;
        }

        return startTimeHour
    }

    def getEndHourOfOrganization(record){
        def endTimeHour
        if(record.endTimeOfWorkDay.split("\\s+")[2] == "AM"){
            endTimeHour = record.endTimeOfWorkDay.split("\\s+")[0].toInteger();
        }
        else if (record.endTimeOfWorkDay.split("\\s+")[2] == "PM"){
            endTimeHour = record.endTimeOfWorkDay.split("\\s+")[0].toInteger() + 12;
        }

        return endTimeHour
    }

    def getDateInterval(intervalBeginDate, intervalEndDate){
        def  intervalBeginDateString = formatDateString(intervalBeginDate)
        def intervalEndDateString = formatDateString(intervalEndDate)
        Date intervalBeginDate1 = new SimpleDateFormat("MM/dd/yyyy").parse(intervalBeginDateString)
        Date intervalEndDate1 = new SimpleDateFormat("MM/dd/yyyy").parse(intervalEndDateString)
        def dateInterval = intervalBeginDate1..intervalEndDate1

        println "Date Interval: " + intervalBeginDate1 + " - " + intervalEndDate1

        return dateInterval
    }

    def formatDateString(def dateString){

        def month = dateString.split("/")[0];
        def date = dateString.split("/")[1];
        def year = dateString.split("/")[2];

        if(month.length() ==1){
            month = "0" + month;
        }
        if(date.length() ==1){
            date = "0" + date;
        }
        return "" + month + "/" + date + "/" + year
    }


    // SCHEDULE GENERATION HELPER METHODS
    /////////////////////////////////////
    def getShiftsInDateInterval(record, dateInterval){
        //Variables to be filled
        def shiftEventArray = "";
        def updatedShiftEventArrayString = ""
        def currentEventMonth = "";
        def currentEventDate = "";
        def currentEventYear = "";


        //Filter out events not in Date Interval
        //Rebuilds shift list, removing oneTime shifts that are not in the Date Interval
        if(record.shifts!=null){
            shiftEventArray = record.shifts.split(";");
            println "Shifts in Database: " + shiftEventArray;

            Date currentDateString
            for (def i=0; i<shiftEventArray.length; i++){
                if(shiftEventArray[i].split(",")[6].equals("weekly")){
                    currentEventMonth = "weekly";
                    currentEventDate = "weekly";
                    currentEventYear = "weekly";
                }
                else{
                    currentDateString = new SimpleDateFormat("MM/dd/yyyy").parse(shiftEventArray[i].split(",")[6])
                }

                if((shiftEventArray[i].split(",")[5].equals("weekly") ) ||
                        (currentDateString in dateInterval)){

                    updatedShiftEventArrayString = updatedShiftEventArrayString + shiftEventArray[i] + ";";
                }
                else{
                    println "Filtered out Shift: " + shiftEventArray[i]
                }
            }
        }

        return updatedShiftEventArrayString.split(";")
    }

    //Analyze employees which employees are available for which shifts.
    //Returns return [availableEmployeesForShifts, employeeUsabilityMap]
    //availableEmployeesForShifts = [:] //Shift Details : List of Employees available to work
    //employeeUsabilityMap = [:] //EmployeeID : Number of Shifts they are Available for
    //////////////////////////////////////////////////

    def getMapOfEmployeesAvailableForAllShifts(shiftEventArray, employeeList, orgID, intervalBeginDate, intervalEndDate){
        //Quick Generate Schedule
        def dayOfShift;
        def startTimeOfShift;
        def endTimeOfShift;
        def typeOfShift;
        def numberOfEmployees;
        def shiftEventID;
        def userFilledShiftEventID;
        def availableEmployeesForShifts = [:] //Shift Details : List of Employees available to work
        def employeeUsabilityMap = [:] //EmployeeID : Number of Shifts they are Available for

        //Initialize Employee Usability Map
        for(int e=0; e<employeeList.size(); e++){
            employeeUsabilityMap.put(employeeList[e].id.toString(), 0)
        }

        //Initialize Shift Map
        def shiftKey
        for(int s=0; s<shiftEventArray.size(); s++){
            //set variables of shift we're filling
            shiftEventID = shiftEventArray[s].eventID;
            dayOfShift = shiftEventArray[s].dayOfWeek.substring(0,3);
            startTimeOfShift = eventTimeFormat.format(shiftEventArray[s].startTime);
            endTimeOfShift = eventTimeFormat.format(shiftEventArray[s].endTime);
            typeOfShift = shiftEventArray[s].shiftType;
            numberOfEmployees = shiftEventArray[s].numberOfShifts;

            //start iterating over all employees for possible matches
            shiftKey = typeOfShift + "," + numberOfEmployees + "," + dayOfShift + ":" + startTimeOfShift + "-" + endTimeOfShift +"," + shiftEventID
            availableEmployeesForShifts.put(shiftKey, "")
        }

        println "Analyzing Availability for Shifts"
        //Analyze employees which employees are available for which shifts.
        //////////////////////////////////////////////////
        //Iterate by Employee
        def employeeAvailabilityEvents;
        for(int e=0; e<employeeList.size(); e++){
            employeeAvailabilityEvents = AvailabilityEvent.findAllByOrgIDAndEmployeesScheduledAndDateOfEventBetween(orgID, employeeList[e].id, intervalBeginDate, intervalEndDate)
            println "Employee ${employeeList[e]} Unavailability Events For This TIME PERIOD"
            println employeeAvailabilityEvents;
            for(int s=0; s<shiftEventArray.size(); s++){
                println "Analyzing Availability for Shift: " + shiftEventArray[s]
                def employeeIsAvailable = true;

                shiftEventID = shiftEventArray[s].eventID;
                dayOfShift = shiftEventArray[s].dayOfWeek.substring(0,3);
                startTimeOfShift = eventTimeFormat.format(shiftEventArray[s].startTime);
                endTimeOfShift = eventTimeFormat.format(shiftEventArray[s].endTime);
                typeOfShift = shiftEventArray[s].shiftType;
                numberOfEmployees = shiftEventArray[s].numberOfShifts;

                //start iterating over all employees for possible matches
                shiftKey = typeOfShift + "," + numberOfEmployees + "," + dayOfShift + ":" + startTimeOfShift + "-" + endTimeOfShift +"," + shiftEventID

                def shiftStartTime = shiftEventArray[s].startTime
                def shiftEndTime = shiftEventArray[s].endTime
                def shiftTimeInterval = shiftStartTime..shiftEndTime;
                employeeAvailabilityEvents.each{ availabilityEvent ->
                    //Possibly Unavailable for Shift
                    if(availabilityEvent.dateOfEvent == shiftEventArray[s].dateOfEvent){
                        //employeeAvailabilityEventsForThisShift  << availabilityEvent
                        def unavailableStartTime = availabilityEvent.startTime
                        def unavailableEndTime = availabilityEvent.endTime
                        def unavailableTimeInterval = unavailableStartTime..unavailableEndTime

                        //IF START TIME OR END TIME OF UNAVAILABILITY FALLS IN SHIFT TIME INTERVAL THAN UNAVAILABLE
                        if(unavailableStartTime in shiftTimeInterval || unavailableEndTime in shiftTimeInterval){
                            println "Employee ${employeeList[e]} is UNAVAILABLE"
                            employeeIsAvailable = false;
                        }
                        else if(shiftStartTime in unavailableTimeInterval || shiftEndTime in unavailableTimeInterval){
                            println "Employee ${employeeList[e]} is UNAVAILABLE"
                            employeeIsAvailable = false;
                        }
                        //IF SHIFT TIME INTERVAL FALLS IN UNAVAILABLE INTERVAL THEN UNAVAILABLE
                    }
                    else{//THIS UNAVAILABLE EVENT DOES NOT ELIMINATE EMPLOYEE FROM THIS SHIFT

                    }
                }
                if(employeeIsAvailable){
                    println "Employee ${employeeList[e]} is AVAILABLE"
                    def tempVal = availableEmployeesForShifts.get(shiftKey)
                    tempVal = tempVal + employeeList[e].id + ","
                    //Put employee ID into string for this Shift
                    availableEmployeesForShifts.put(shiftKey, tempVal)
                    def tempNum = employeeUsabilityMap.get(employeeList[e].id.toString())
                    tempNum ++;
                    //increment employee usability
                    employeeUsabilityMap.put(employeeList[e].id.toString(), tempNum)
                }
            }
        }
        return [availableEmployeesForShifts, employeeUsabilityMap]
    }

    def getMapOfEmployeesAvailableForAllShiftsBackup(shiftEventArray, employeeList){
        //Quick Generate Schedule
        def dayOfShift;
        def startTimeOfShift;
        def endTimeOfShift;
        def typeOfShift;
        def numberOfEmployees;
        def shiftEventID;
        def userFilledShiftEventID;
        def availableEmployeesForShifts = [:] //Shift Details : List of Employees available to work
        def employeeUsabilityMap = [:] //EmployeeID : Number of Shifts they are Available for

        //Initialize Employee Usability Map
        for(int e=0; e<employeeList.size(); e++){
            employeeUsabilityMap.put(employeeList[e].id.toString(), 0)
        }

        println "Analyzing Availability for Shifts"
        //Analyze employees which employees are available for which shifts.
        //////////////////////////////////////////////////
        for(int s=0; s<shiftEventArray.size(); s++){
            println "Analyzing Availability for Shift: " + shiftEventArray[s]

            //set variables of shift we're filling
            shiftEventID = shiftEventArray[s].eventID;
            dayOfShift = shiftEventArray[s].dayOfWeek.substring(0,3);
            startTimeOfShift = eventTimeFormat.format(shiftEventArray[s].startTime);
            endTimeOfShift = eventTimeFormat.format(shiftEventArray[s].endTime);
            typeOfShift = shiftEventArray[s].shiftType;
            numberOfEmployees = shiftEventArray[s].numberOfShifts;

            //start iterating over all employees for possible matches
            def shiftKey = typeOfShift + "," + numberOfEmployees + "," + dayOfShift + ":" + startTimeOfShift + "-" + endTimeOfShift +"," + shiftEventID
            availableEmployeesForShifts.put(shiftKey, "")
            for(int e=0; e<employeeList.size(); e++){
                //if employee is the correct role for shift. (server, bartender etc.)
                //println employeeList[e];
                if(employeeList[e].employeeRole.indexOf(typeOfShift) >-1){
                    //println employeeList[e];

//                    def employeeAvailabilityArray = employeeList[e].availability.split(" ") //Sun:0800 Sun:0830 Sun:0900
//                    //find index of start of shift in employee availability. If it does not end with U they are available. Will return -1 if it ends with U
//                    def indexOfStartTime = java.util.Arrays.asList(employeeAvailabilityArray).indexOf("" + dayOfShift + ":" + startTimeOfShift)
//
//                    //does not matter if employee is available for the end time. we need the index of the 1 before the actual end time.
//                    def indexOfEndTime = java.util.Arrays.asList(employeeAvailabilityArray).indexOf("" + dayOfShift + ":" + endTimeOfShift)
//                    if (indexOfEndTime == -1){
//                        indexOfEndTime = java.util.Arrays.asList(employeeAvailabilityArray).indexOf("" + dayOfShift + ":" + endTimeOfShift + "U")
//                    }
//                    indexOfEndTime= indexOfEndTime-1;
//
//
//                    //build array of available employees for this shift.
//                    println "TESTING: " + indexOfStartTime + "," + indexOfEndTime;
//                    if(indexOfStartTime != -1 && indexOfEndTime != -1){
//                        for(int t = indexOfStartTime; t<=indexOfEndTime; t++){
//                            println employeeAvailabilityArray[t]
//                            if(employeeAvailabilityArray[t].indexOf("U") > -1){
//                                break;
//                            }
//                            if( t == indexOfEndTime){
//                                def tempVal = availableEmployeesForShifts.get(shiftKey)
//                                tempVal = tempVal + employeeList[e].id + ","
//                                //Put employee ID into string for this Shift
//                                availableEmployeesForShifts.put(shiftKey, tempVal)
//                                def tempNum = employeeUsabilityMap.get(employeeList[e].id.toString())
//                                tempNum ++;
//                                //increment employee usability
//                                employeeUsabilityMap.put(employeeList[e].id.toString(), tempNum)
//                            }
//                        }
//                    }
                }
            }
        }
        //Done.
        //////////////////////////////////////////////////
        return [availableEmployeesForShifts, employeeUsabilityMap]
    }
    def createSchedule(availableEmployeesForShifts, employeeUsabilityMap, userFilledShiftsArray, employeeList, scheduleOptions){
        Random random = new Random()
        def finalSchedule = [:]
        def optionOverwriteCurrentSchedule = (scheduleOptions.indexOf("overwriteCurrentSchedule") > -1)
        def optionMoreThanOneShiftPerDayAllowed = (scheduleOptions.indexOf("moreThanOneShiftPerDayAllowed") > -1)
        def optionBackToBackOvelapShiftsAllowed = (scheduleOptions.indexOf("backToBackOvelapShiftsAllowed") > -1)
        println "OverWrite Current Schedule = " + optionOverwriteCurrentSchedule
        println "MoreThanOneShiftPerDayAllowed = " + optionMoreThanOneShiftPerDayAllowed
        println "BackToBackOvelapShiftsAllowed = " + optionBackToBackOvelapShiftsAllowed

        //Loop over Shifts -> Available Employees for Shifts
        //EX: Shift: Host,2,Sun:1100-1700,eventSun0 -> Available Employees: 9,13,
        availableEmployeesForShifts.each { shiftEntry ->
            def doubleShiftCandidates =[]
            def skippedEmployeeForRandomness = []
            def employeesAvailableForThisShift = shiftEntry.value.split(",")
            def employeeCountForThisShift = 0
            def employeeUsabilityMapKeySet = employeeUsabilityMap.keySet() //Get keys for map that looks like this => EmployeeID: 4 Num: 9 //ordered from least to greatest
            def tempEmpInsertString = ""
            def alreadyScheduled
            def finalScheduleKeySet

            println "Filling Shift: " + shiftEntry.key
            println "Available Employees for this shift: " + employeesAvailableForThisShift

            //Check for user filled employees If the Option to overwrite current schedule is NOT checked
            if (optionOverwriteCurrentSchedule== false) {
                println "Checking User Filled Shifts"
                (userFilledShiftsArray, employeeList, finalSchedule, employeeCountForThisShift, shiftEntry) = checkUserFilledShiftsAndFillFinalSchedule(userFilledShiftsArray, employeeList, finalSchedule, employeeCountForThisShift, shiftEntry)
            }
            println employeeCountForThisShift + " out of " + shiftEntry.key.split(",")[1].toInteger() + " employees filled for this shift"

            //Loop Over Employees available for this shift


            if(employeeCountForThisShift < shiftEntry.key.split(",")[1].toInteger()) {

                //while( i< < employeeUsabilityMapKeySet.size()){

                for (int i = 0; i < employeeUsabilityMapKeySet.size(); i++) {
                    alreadyScheduled = false;
                    finalScheduleKeySet = finalSchedule.keySet()
                    //fill from least available to most available employee
                    //check to see if employee has been scheduled during schedule creation for a overlapping shift
                    //if overlap is in grace period, put employee in separate list for last consideration. Avoid too many double shifts
                    //Random number from 0-100. if number is greater than 50 fill with employee, if not skip. higher the threshold number the less random.
                    //this loop should loop until shift count is satisfied or no more employeesleft to consider. 1. least available. 2.double shift candidates.

                    //if Employee is available for this shift.
                    if(employeesAvailableForThisShift.contains(employeeUsabilityMapKeySet[i])){
                        if(employeeCountForThisShift >= shiftEntry.key.split(",")[1].toInteger()){
                            println "Filled " + employeeCountForThisShift + " Employees"
                            break;
                        }

                        println "Considering Employee " + employeeUsabilityMapKeySet[i]
                        //check if employee has been scheduled during schedule generation
                        for (def f = 0; f < finalScheduleKeySet.size(); f++) {
                            def dayOfFinalScheduleShift = finalScheduleKeySet[f].split(",")[2].substring(0, 3)
                            def dayOfThisShift = shiftEntry.key.split(",")[2].substring(0, 3)
                            def thisEmployeeID = employeeUsabilityMapKeySet[i]


                            //search for other shifts this employee has been scheduled for
                            for(def g = 0; g < finalSchedule.get(finalScheduleKeySet[f]).split(",").length ; g++){
                                def finalScheduleEmployeeID = finalSchedule.get(finalScheduleKeySet[f]).split(",")[g]
                                if(thisEmployeeID == finalScheduleEmployeeID){
                                    //check the day and time of the shift to see if there is a conflict.

                                    if(dayOfThisShift == dayOfFinalScheduleShift){

                                        //If employees are not allowed to work more than one shift per day
                                        if (optionMoreThanOneShiftPerDayAllowed == false) {
                                            println "This Employee, " + finalScheduleEmployeeID + " is ALREADY SCHEDULED ON THE SAME DAY ********"
                                            alreadyScheduled = true;
                                            break;
                                        }

                                        println finalScheduleKeySet[f] + ", " + finalSchedule.get(finalScheduleKeySet[f]).split(",")[g]
                                        def beginFinalScheduleShiftTime = finalScheduleKeySet[f].split(",")[2].split(":")[1].substring(0, 4)
                                        def beginFinalScheduleShiftTimeFormatted = Date.parse("yyyy-MM-dd hh:mm:ss", "2015-10-10 " + beginFinalScheduleShiftTime.substring(0, 2) + ":" + beginFinalScheduleShiftTime.substring(2, 4) + ":00")
                                        def endFinalScheduleShiftTime = finalScheduleKeySet[f].split(",")[2].split(":")[1].substring(5, 9)
                                        def endFinalScheduleShiftTimeFormatted = Date.parse("yyyy-MM-dd hh:mm:ss", "2015-10-10 " + endFinalScheduleShiftTime.substring(0, 2) + ":" + endFinalScheduleShiftTime.substring(2, 4) + ":00")
                                        def beginThisShiftTime = shiftEntry.key.split(",")[2].split(":")[1].substring(0, 4)
                                        def beginThisShiftTimeFormatted = Date.parse("yyyy-MM-dd hh:mm:ss", "2015-10-10 " + beginThisShiftTime.substring(0, 2) + ":" + beginThisShiftTime.substring(2, 4) + ":00")
                                        def endThisShiftTime = shiftEntry.key.split(",")[2].split(":")[1].substring(5, 9)
                                        def endThisShiftTimeFormatted = Date.parse("yyyy-MM-dd hh:mm:ss", "2015-10-10 " + endThisShiftTime.substring(0, 2) + ":" + endThisShiftTime.substring(2, 4) + ":00")

                                        //if final schedule shift start during this shift
                                        //if final schedule shift ends during this shift
                                        //if entire final schedule shift starts before and ends after this shift
                                        if ((beginFinalScheduleShiftTime > beginThisShiftTime && beginFinalScheduleShiftTime < endThisShiftTime) ||
                                                (endFinalScheduleShiftTime > beginFinalScheduleShiftTime && endFinalScheduleShiftTime < endThisShiftTime) ||
                                                (beginFinalScheduleShiftTime < beginThisShiftTime && endFinalScheduleShiftTime > endThisShiftTime)
                                        ) {
                                            println "OVERLAPS"

                                            //if grace period option is allowed put employee in separate list for last consideration
                                            if(optionBackToBackOvelapShiftsAllowed== true){
                                                if ((TimeCategory.minus(endFinalScheduleShiftTimeFormatted, beginThisShiftTimeFormatted).minutes.abs() <= 30) ||
                                                        (TimeCategory.minus(beginFinalScheduleShiftTimeFormatted, endThisShiftTimeFormatted).minutes.abs()) <= 30) {
                                                    println "Overlap is within Grace Period"
                                                    println "Employee " + finalScheduleEmployeeID + " is eligible for double will be considered last"
                                                    doubleShiftCandidates.push(finalScheduleEmployeeID)
                                                    alreadyScheduled = true;
                                                    break;
                                                }
                                                else{
                                                    println "Overlap is NOT within Grace Period"
                                                    println thisEmployeeID + "," + finalScheduleEmployeeID + " ALREADY SCHEDULED IN OVERLAPPING SHIFT. SKIP EMPLOYEE ********"
                                                    alreadyScheduled = true;
                                                    break;
                                                }
                                            }
                                            else{
                                                println thisEmployeeID + "," + finalScheduleEmployeeID + " ALREADY SCHEDULED IN OVERLAPPING SHIFT. SKIP EMPLOYEE ********"
                                                alreadyScheduled = true;
                                                break;
                                            }
                                        }
                                        //the shifts don't overlap
                                        else {
                                            println "NO OVERLAP"
                                        }

                                    }

                                }
                            }

                        }
                        if(alreadyScheduled){
                            continue;
                        }
                        //Randomizer
                        int randomNumber = random.nextInt(100)
                        def scheduleRandomness = 50
                        if(randomNumber < scheduleRandomness){
                            //skip employee
                            skippedEmployeeForRandomness.push(employeeUsabilityMapKeySet[i])
                            continue
                        }

                        if(finalSchedule.get(shiftEntry.key) == null){
                            println"Inserting: " + employeeUsabilityMapKeySet[i]
                            finalSchedule.put(shiftEntry.key, employeeUsabilityMapKeySet[i])
                            tempEmpInsertString = "" + employeeUsabilityMapKeySet[i]
                            employeeCountForThisShift++
                        }
                        else{

                            tempEmpInsertString = tempEmpInsertString + "," + employeeUsabilityMapKeySet[i]
                            println"Inserting: " + tempEmpInsertString
                            finalSchedule.put(shiftEntry.key, tempEmpInsertString)
                            employeeCountForThisShift++
                        }

                        def tempVal = employeeUsabilityMap.get(employeeUsabilityMapKeySet[i])
                        tempVal--
                        employeeUsabilityMap.put(employeeUsabilityMapKeySet[i], tempVal)


                    }
                }
                println "Employees Scheduled: " + finalSchedule.get(shiftEntry.key)

                //if no employees get scheduled or not enough employees scheduled
                if(finalSchedule.get(shiftEntry.key) == null  || shiftEntry.key.split(",")[1].toInteger() < finalSchedule.get(shiftEntry.key).split(",").length){
                    //check skipped employees to fill remaining shifts
                    println "skippedEmployeeForRandomness CANDIDATES: " + skippedEmployeeForRandomness.toListString()
                    println "DOUBLE SHIFT CANDIDATES: " + doubleShiftCandidates.toListString()
                    if(skippedEmployeeForRandomness != null){
                        for (def s = 0; s < skippedEmployeeForRandomness.size(); s++) {
                            //break out of loop if enough employees are filled
                            if(employeeCountForThisShift >= shiftEntry.key.split(",")[1].toInteger()){
                                println "Filled " + employeeCountForThisShift + " Employees"
                                break;
                            }
                            println "Inserting skippedEmployeeForRandomness: " + skippedEmployeeForRandomness[s]
                            if(finalSchedule.get(shiftEntry.key) == null){
                                println"Inserting: " + skippedEmployeeForRandomness[s]
                                finalSchedule.put(shiftEntry.key, skippedEmployeeForRandomness[s])
                                tempEmpInsertString = "" + skippedEmployeeForRandomness[s]
                                employeeCountForThisShift++
                            }
                            else{

                                tempEmpInsertString = tempEmpInsertString + "," + skippedEmployeeForRandomness[s]
                                println"Inserting: " + tempEmpInsertString
                                finalSchedule.put(shiftEntry.key, tempEmpInsertString)
                                employeeCountForThisShift++
                            }
                        }
                    }
                    //check doublshift candidates (only if double shifts are allowed)
                    if (doubleShiftCandidates != null){

                        for (def d = 0; d < doubleShiftCandidates.size(); d++) {
                            //break out of loop if enough employees are filled
                            if(employeeCountForThisShift >= shiftEntry.key.split(",")[1].toInteger()){
                                println "Filled " + employeeCountForThisShift + " Employees"
                                break;
                            }
                            println "Inserting Double Shift: " + doubleShiftCandidates[d]
                            if(finalSchedule.get(shiftEntry.key) == null){
                                println"Inserting: " + doubleShiftCandidates[d]
                                finalSchedule.put(shiftEntry.key, doubleShiftCandidates[d])
                                tempEmpInsertString = "" + doubleShiftCandidates[d]
                                employeeCountForThisShift++
                            }
                            else{

                                tempEmpInsertString = tempEmpInsertString + "," + doubleShiftCandidates[d]
                                println"Inserting: " + tempEmpInsertString
                                finalSchedule.put(shiftEntry.key, tempEmpInsertString)
                                employeeCountForThisShift++
                            }
                        }
                    }



                    //check again if no employees are scheduled
                    if(finalSchedule.get(shiftEntry.key) == null){
                        println "SCHEDULING PROBLEM ******************** No employees scheduled"
                        println shiftEntry.key.split(",")[1].toInteger() + " - " + finalSchedule.get(shiftEntry.key)
                    }
                    else if(shiftEntry.key.split(",")[1].toInteger() < finalSchedule.get(shiftEntry.key).split(",").length){
                        println "SCHEDULING PROBLEM ******************** Not Enough employees scheduled"
                        println shiftEntry.key.split(",")[1].toInteger() + " - " + finalSchedule.get(shiftEntry.key).split(",").length
                    }

                }
                else if(shiftEntry.key.split(",")[1].toInteger() != finalSchedule.get(shiftEntry.key).split(",").length){
                    println "SCHEDULING PROBLEM ******************** Incorrect number of employees scheduled"
                    println shiftEntry.key.split(",")[1].toInteger() + " - " + finalSchedule.get(shiftEntry.key).split(",").length
                }
            }
        }
        return [finalSchedule, employeeUsabilityMap]
    }

    def checkUserFilledShiftsAndFillFinalSchedule(userFilledShiftsArray, employeeList, finalSchedule, employeeCountForThisShift, shiftEntry){
        def userFilledShiftEventID
        def tempEmpInsertString
        def thisShiftID = shiftEntry.key.split(",")[3]
        //Check if this shift was already filled by the User.
        for (int j = 0; j < userFilledShiftsArray.length; j++) {
            userFilledShiftEventID = userFilledShiftsArray[j].split(":")[0]
            if (thisShiftID.equals(userFilledShiftEventID)) {
                println "Shift ID " + userFilledShiftEventID + " was filled by User"
                def userFilledEmployeesShiftEventIDArray = userFilledShiftsArray[j].split(":")[1].split(",")
                for (int k = 0; k < userFilledEmployeesShiftEventIDArray.length; k++) {
                    if (userFilledEmployeesShiftEventIDArray[k].trim().length() > 0) {
                        //find users id
                        //fill schedule with this id
                        println "User Scheduled Employee : " + employeeList.id.find {
                            it == Integer.parseInt(userFilledEmployeesShiftEventIDArray[k])
                        }
                        def userIDTemp = userFilledEmployeesShiftEventIDArray[k]
                        if (finalSchedule.get(shiftEntry.key) == null) {
                            println "Inserting: " + userIDTemp
                            finalSchedule.put(shiftEntry.key, userIDTemp)
                            tempEmpInsertString = "" + userIDTemp
                            employeeCountForThisShift++
                        } else {

                            tempEmpInsertString = tempEmpInsertString + "," + userIDTemp
                            println "Inserting: " + tempEmpInsertString
                            finalSchedule.put(shiftEntry.key, tempEmpInsertString)
                            employeeCountForThisShift++
                        }
                    }
                }
            }
        }
        return [userFilledShiftsArray, employeeList, finalSchedule, employeeCountForThisShift, shiftEntry]
    }

    def createSchedulebackup(availableEmployeesForShifts, employeeUsabilityMap, userFilledShiftsArray, employeeList, scheduleOptions){
        def finalSchedule = [:]
        def userFilledShiftEventID
        def optionOverwriteCurrentSchedule = (scheduleOptions.indexOf("overwriteCurrentSchedule") > -1)
        def optionMoreThanOneShiftPerDayAllowed = (scheduleOptions.indexOf("moreThanOneShiftPerDayAllowed") > -1)
        def optionBackToBackOvelapShiftsAllowed = (scheduleOptions.indexOf("backToBackOvelapShiftsAllowed") > -1)
        println "OverWrite Current Schedule = " + optionOverwriteCurrentSchedule
        println "MoreThanOneShiftPerDayAllowed = " + optionMoreThanOneShiftPerDayAllowed
        println "BackToBackOvelapShiftsAllowed = " + optionBackToBackOvelapShiftsAllowed
        //Loop over Shifts -> Available Employees for Shifts
        //EX: Shift: Host,2,Sun:1100-1700,eventSun0 -> Available Employees: 9,13,
        availableEmployeesForShifts.each { shiftEntry ->
            def doubleShiftCandidates = [:]
            println "Filling Shift: " + shiftEntry.key
            def thisShiftID = shiftEntry.key.split(",")[3]
            def employeesAvailableForThisShift = shiftEntry.value.split(",")
            println "Available Employees for this shift: " + employeesAvailableForThisShift
            def employeeCountForThisShift = 0
            //Get keys for map that looks like this => EmployeeID: 4 Num: 9
            //ordered from least to greatest
            def employeeUsabilityMapKeySet = employeeUsabilityMap.keySet()
            //loop over keys
            def tempEmpInsertString = ""
            def alreadyScheduled

            //If the Option to overwrite current schedule is NOT checked

            if (optionOverwriteCurrentSchedule== false) {
                println "Checking User Filled Shifts"
                //Check if this shift was already filled by the User.
                for (int j = 0; j < userFilledShiftsArray.length; j++) {
                    userFilledShiftEventID = userFilledShiftsArray[j].split(":")[0]
                    if (thisShiftID.equals(userFilledShiftEventID)) {
                        println "Shift ID " + userFilledShiftEventID + " was filled by User"
                        def userFilledEmployeesShiftEventIDArray = userFilledShiftsArray[j].split(":")[1].split(",")
                        for (int k = 0; k < userFilledEmployeesShiftEventIDArray.length; k++) {
                            if (userFilledEmployeesShiftEventIDArray[k].trim().length() > 0) {
                                //find users id
                                //fill schedule with this id
                                println "User Scheduled Employee : " + employeeList.id.find {
                                    it == Integer.parseInt(userFilledEmployeesShiftEventIDArray[k])
                                }
                                def userIDTemp = userFilledEmployeesShiftEventIDArray[k]
                                if (finalSchedule.get(shiftEntry.key) == null) {
                                    println "Inserting: " + userIDTemp
                                    finalSchedule.put(shiftEntry.key, userIDTemp)
                                    tempEmpInsertString = "" + userIDTemp
                                    employeeCountForThisShift++
                                } else {

                                    tempEmpInsertString = tempEmpInsertString + "," + userIDTemp
                                    println "Inserting: " + tempEmpInsertString
                                    finalSchedule.put(shiftEntry.key, tempEmpInsertString)
                                    employeeCountForThisShift++
                                }
                            }
                        }
                    }
                }
            }

            //Check if there are more employees needed for this shift.

            println employeeCountForThisShift + " out of " + shiftEntry.key.split(",")[1].toInteger() + " employees filled for this shift"
            if(employeeCountForThisShift < shiftEntry.key.split(",")[1].toInteger()){
                for(int i=0; i<employeeUsabilityMapKeySet.size(); i++){
                    alreadyScheduled = false;
                    //if an employee is available for this shift
                    if(employeesAvailableForThisShift.contains(employeeUsabilityMapKeySet[i])){
                        if(employeeCountForThisShift >= shiftEntry.key.split(",")[1].toInteger()){
                            println "Filled " + employeeCountForThisShift + " Employees"
                            break;
                        }
                        println "Considering Employee #" + employeeUsabilityMapKeySet[i]
                        def finalScheduleKeySet = finalSchedule.keySet()


                        if (optionMoreThanOneShiftPerDayAllowed == false) {
                            println "Checking if Employee is already scheduled on Same Day"
                            /////////////////////////////////////////////////
                            //if employee is already scheduled for today skip
                            //loop through shifts on same day in final schedule
                            for(def f =0; f < finalScheduleKeySet.size() ; f++){
                                def dayOfFinalScheduleShift = finalScheduleKeySet[f].split(",")[2].substring(0,3)
                                def dayOfThisShift = shiftEntry.key.split(",")[2].substring(0,3)
                                def thisEmployeeID = employeeUsabilityMapKeySet[i]
                                if(dayOfFinalScheduleShift == dayOfThisShift){

                                    def employeesWorkingThisFinalScheduleShift = finalSchedule.get(finalScheduleKeySet[f]).split(",")
                                    for(def g =0; g< employeesWorkingThisFinalScheduleShift.length ; g++){
                                        def finalScheduleEmployeeID = finalSchedule.get(finalScheduleKeySet[f]).split(",")[g]
                                        if(thisEmployeeID == finalScheduleEmployeeID){
                                            println "This Employee, " + finalScheduleEmployeeID + " is ALREADY SCHEDULED ON THE SAME DAY ********"
                                            alreadyScheduled = true;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        // Check if employee is scheduled for another shift overlapping in time this one
                        //option to allow grace period if working two shifts overlapping by x minutes
                        //loop through shifts on same day in final schedule
                        if(optionBackToBackOvelapShiftsAllowed== true) {

                            println "Checking if Employee is scheduled for another shift at the same time. (Grace period 30 minutes)"
                            //loop through all shifts
                            for (def f = 0; f < finalScheduleKeySet.size(); f++) {
                                def dayOfFinalScheduleShift = finalScheduleKeySet[f].split(",")[2].substring(0, 3)
                                def dayOfThisShift = shiftEntry.key.split(",")[2].substring(0, 3)
                                def thisEmployeeID = employeeUsabilityMapKeySet[i]

                                if (dayOfFinalScheduleShift == dayOfThisShift) {
                                    def beginFinalScheduleShiftTime = finalScheduleKeySet[f].split(",")[2].split(":")[1].substring(0, 4)
                                    def beginFinalScheduleShiftTimeFormatted = Date.parse("yyyy-MM-dd hh:mm:ss", "2015-10-10 " + beginFinalScheduleShiftTime.substring(0, 2) + ":" + beginFinalScheduleShiftTime.substring(2, 4) + ":00")
                                    def endFinalScheduleShiftTime = finalScheduleKeySet[f].split(",")[2].split(":")[1].substring(5, 9)
                                    def endFinalScheduleShiftTimeFormatted = Date.parse("yyyy-MM-dd hh:mm:ss", "2015-10-10 " + endFinalScheduleShiftTime.substring(0, 2) + ":" + endFinalScheduleShiftTime.substring(2, 4) + ":00")
                                    def beginThisShiftTime = shiftEntry.key.split(",")[2].split(":")[1].substring(0, 4)
                                    def beginThisShiftTimeFormatted = Date.parse("yyyy-MM-dd hh:mm:ss", "2015-10-10 " + beginThisShiftTime.substring(0, 2) + ":" + beginThisShiftTime.substring(2, 4) + ":00")
                                    def endThisShiftTime = shiftEntry.key.split(",")[2].split(":")[1].substring(5, 9)
                                    def endThisShiftTimeFormatted = Date.parse("yyyy-MM-dd hh:mm:ss", "2015-10-10 " + endThisShiftTime.substring(0, 2) + ":" + endThisShiftTime.substring(2, 4) + ":00")

                                    //if final schedule shift start during this shift
                                    //if final schedule shift ends during this shift
                                    //if entire final schedule shift starts before and ends after this shift
                                    if ((beginFinalScheduleShiftTime > beginThisShiftTime && beginFinalScheduleShiftTime < endThisShiftTime) ||
                                            (endFinalScheduleShiftTime > beginFinalScheduleShiftTime && endFinalScheduleShiftTime < endThisShiftTime) ||
                                            (beginFinalScheduleShiftTime < beginThisShiftTime && endFinalScheduleShiftTime > endThisShiftTime)
                                    ) {

                                        /*println "TIME Testing begin final============= " + beginFinalScheduleShiftTimeFormatted
                                        println "TIME Testing end final============= " + endFinalScheduleShiftTimeFormatted
                                        println "TIME Testing begin this============= " + beginThisShiftTimeFormatted
                                        println "TIME Testing end this============= " + endThisShiftTimeFormatted
                                        println "TIME Testing end this============= " + endThisShiftTimeFormatted
                                        println "TIME Testing begin diff============= " + TimeCategory.minus(endFinalScheduleShiftTimeFormatted, beginThisShiftTimeFormatted).minutes
                                        println "TIME Testing begin diff============= " + TimeCategory.minus(beginThisShiftTimeFormatted, endFinalScheduleShiftTimeFormatted).minutes.abs()
                                        println "TIME Testing end diff============= " + (beginFinalScheduleShiftTime.toInteger() - endThisShiftTime.toInteger()).abs()
                                        */
                                        if ((TimeCategory.minus(endFinalScheduleShiftTimeFormatted, beginThisShiftTimeFormatted).minutes.abs() <= 30) ||
                                                (TimeCategory.minus(beginFinalScheduleShiftTimeFormatted, endThisShiftTimeFormatted).minutes.abs()) <= 30) {


                                            def employeesWorkingThisFinalScheduleShift = finalSchedule.get(finalScheduleKeySet[f]).split(",")
                                            for (def g = 0; g < employeesWorkingThisFinalScheduleShift.length; g++) {
                                                def finalScheduleEmployeeID = finalSchedule.get(finalScheduleKeySet[f]).split(",")[g]
                                                if (thisEmployeeID == finalScheduleEmployeeID) {
                                                    println finalScheduleKeySet[f] + " OVERLAPS IN TIME WITH " + shiftEntry.key
                                                    println "Overlap is within Grace Period"
                                                    println "Employee " + finalScheduleEmployeeID + " is eligible for double will be considered last"
                                                    doubleShiftCandidates.push(finalScheduleEmployeeID)
                                                }
                                            }
                                        }
                                        else {

                                            def employeesWorkingThisFinalScheduleShift = finalSchedule.get(finalScheduleKeySet[f]).split(",")
                                            for (def g = 0; g < employeesWorkingThisFinalScheduleShift.length; g++) {
                                                def finalScheduleEmployeeID = finalSchedule.get(finalScheduleKeySet[f]).split(",")[g]
                                                if (thisEmployeeID == finalScheduleEmployeeID) {
                                                    println finalScheduleKeySet[f] + " OVERLAPS IN TIME WITH " + shiftEntry.key
                                                    println "Overlap is NOT within Grace Period"
                                                    println thisEmployeeID + "," + finalScheduleEmployeeID + " ALREADY SCHEDULED IN OVERLAPPING SHIFT. SKIP EMPLOYEE ********"
                                                    alreadyScheduled = true;
                                                    break;
                                                }
                                            }
                                        }

                                    }
                                    //the shifts don't overlap
                                    else {

                                    }
                                }
                            }
                        }

                        if(alreadyScheduled){
                            continue;
                        }


                        if(finalSchedule.get(shiftEntry.key) == null){
                            println"Inserting: " + employeeUsabilityMapKeySet[i]
                            finalSchedule.put(shiftEntry.key, employeeUsabilityMapKeySet[i])
                            tempEmpInsertString = "" + employeeUsabilityMapKeySet[i]
                            employeeCountForThisShift++
                        }
                        else{

                            tempEmpInsertString = tempEmpInsertString + "," + employeeUsabilityMapKeySet[i]
                            println"Inserting: " + tempEmpInsertString
                            finalSchedule.put(shiftEntry.key, tempEmpInsertString)
                            employeeCountForThisShift++
                        }

                        def tempVal = employeeUsabilityMap.get(employeeUsabilityMapKeySet[i])
                        tempVal--
                        employeeUsabilityMap.put(employeeUsabilityMapKeySet[i], tempVal)

                    }
                }
                println "Employees Scheduled: " + finalSchedule.get(shiftEntry.key)
                if(finalSchedule.get(shiftEntry.key) == null){
                    println "SCHEDULING PROBLEM ******************** No employees scheduled"
                    println shiftEntry.key.split(",")[1].toInteger() + " - " + finalSchedule.get(shiftEntry.key)
                }
                else if(shiftEntry.key.split(",")[1].toInteger() != finalSchedule.get(shiftEntry.key).split(",").length){
                    println "SCHEDULING PROBLEM ******************** Incorrect number of employees scheduled"
                    println shiftEntry.key.split(",")[1].toInteger() + " - " + finalSchedule.get(shiftEntry.key).split(",").length
                }
            }
        }

        return [finalSchedule, employeeUsabilityMap]
    }

    def createRepeatingShifts(eventDate, v, timeZone, orgID, dayOfWeekChange){
        println "CREATING ADDITIONAL REPEATING SHIFTS : " + eventDate
        Date repeatingEventDate = eventDate
        Calendar c = Calendar.getInstance();
        //Max number of shifts to be created will be 1 year for all cases
        Date endRepeatDate = null;
        c.setTime(repeatingEventDate);
        c.add(Calendar.DATE, 365);
        endRepeatDate = c.getTime();
        def occurrancesEnd = 365;
        def f = 1;
        if(v.repeatEnd == "1 Year"){}
        else if(v.repeatEnd == "After"){
            occurrancesEnd = v.repeatEndAfter.toInteger();
            def line = v.eventRepeat.split(";")[1]
            f = line.length() - line.replace(",", "").length();
            println "MATCHES" + f;
            occurrancesEnd  = occurrancesEnd * f;
        }
        else if(v.repeatEnd == "On Date"){
            endRepeatDate = new SimpleDateFormat("MM/dd/yyyy").parse(v.repeatEndDate);
        }

        c.setTime(repeatingEventDate);
        c.add(Calendar.DATE, 1);
        repeatingEventDate = c.getTime();
        //increment one week before loop
        def lastIDQuery
        def nextID
        lastIDQuery = Event.executeQuery("from Event where orgID = '${orgID}' order by id desc", [offset:0, max:1]);
        if(lastIDQuery[0] != null){
            nextID = lastIDQuery[0].id.toInteger()
            nextID++;
        }
        else{
            nextID = 1;
        }
        def count = 1;
        def startTime;
        def endTime;
        while(repeatingEventDate.before(endRepeatDate) && count < occurrancesEnd) {
            println v.eventRepeat + ";" + daysOfWeekAbrev[repeatingEventDate.getDay()+1] + ";" + repeatingEventDate.getDay()
            if(dayOfWeekChange.substring(0,3) == (daysOfWeekAbrev[repeatingEventDate.getDay()+1])) {
                nextID++;
                def newFormattedDate = eventDateFormatted.format(repeatingEventDate);
                startTime = new SimpleDateFormat("MM/dd/yyyy HHmm z").parse(newFormattedDate + " " + v.startTimeString + " " + timeZone);
                endTime = new SimpleDateFormat("MM/dd/yyyy HHmm z").parse(newFormattedDate + " " + v.endTimeString + " " + timeZone);

                def newRecord = new Event(orgID: orgID,
                        eventID: v.eventID.split("--")[0].replace("Temp", "") + "--" + orgID + "--" + nextID,
                        dateOfEvent: repeatingEventDate,
                        notes: v.notesString,
                        formattedDate: newFormattedDate,
                        shiftType: v.shiftType,
                        numberOfShifts: v.numberOfShifts,
                        employeesScheduled: v.employeesScheduled,
                        weeklyOrOneTime: v.weeklyOrOneTime,
                        startTime: startTime,
                        endTime: endTime,
                        unformattedTime: new SimpleDateFormat("EEEE").format(repeatingEventDate).substring(0, 3) + " " + v.unformattedTime.substring(4),
                        dayOfWeek: new SimpleDateFormat("EEEE").format(repeatingEventDate),
                        isParent: "N",
                        seriesStartDate: v.seriesStartDate,
                        seriesEndDate: v.seriesEndDate,
                        eventRepeat: v.eventRepeat,
                        repeatEnd: v.repeatEnd,
                        repeatEndAfter: v.repeatEndAfter,
                        repeatEndDate: v.repeatEndDate,
                        parentShiftID: v.eventID
                ).save();
                count++;
                println count + " " + occurrancesEnd
            }
            c.add(Calendar.DATE, 1);
            repeatingEventDate = c.getTime();

        }
    }

}
