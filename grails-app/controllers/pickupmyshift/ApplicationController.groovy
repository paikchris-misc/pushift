package pickupmyshift


import java.text.SimpleDateFormat
import org.codehaus.groovy.grails.web.mapping.LinkGenerator
import groovy.json.JsonBuilder
import groovy.json.JsonSlurper
import grails.converters.JSON


class ApplicationController {
    LinkGenerator grailsLinkGenerator
    ApplicationHelper aHelper = new ApplicationHelper()
    def slurper = new JsonSlurper()
    def userLevels = ["Manager", "Employee"];
    def daysOfWeek = ["", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    def daysOfWeekAbrev = ["", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    SimpleDateFormat eventDayAbbrev = new SimpleDateFormat("E");
    SimpleDateFormat eventTimeFormat = new SimpleDateFormat("HHmm");
    SimpleDateFormat eventDateFormatted = new SimpleDateFormat("MM/dd/yyyy");

    def beforeInterceptor = [action: this.&checkUser, except:'getShiftAndScheduleForDatesMobile']

    def index() {

    }

    def register(){
        println "REGISTER"
    }



    def checkUser() {
        println "CHECK USER"
        println params
        AuthController ac = new AuthController()
        def test = ac.check()

        //println "TEST WASSSSS " + session.user;

    }

    def profile(){
        println "MY PROFILE"
        println params
        def orgRecord = Organization.get(session.user.organizationID)

        def imagePath = "http://" + request.getServerName() + ":" + request.getServerPort() +
                "/" + grailsApplication.metadata['app.name'] + "/" + session.user.imagePath

        [pageName: "Profile", userRecord: session.user, orgRecord: orgRecord, imagePath:imagePath]
    }

    def calendar() {
        log.warn "In Calendar "
        def record = Organization.get(session.user.organizationID)

        def startTimeHour = aHelper.getStartHourOfOrganization(record)
        def startTimeMin = record.startTimeOfWorkDay.split("\\s+")[1]
        def endTimeHour = aHelper.getEndHourOfOrganization(record)
        def endTimeMin = record.endTimeOfWorkDay.split("\\s+")[1]



        def shiftTypeArray = record.shiftTypes.split(",");
        def query = User.where { organizationID == session.user.organizationID }

        def employeeList = query.list();

        def shiftEventArray = "";
        if (record.oneTimeShifts != null) {
            shiftEventArray = record.oneTimeShifts.split(";");
            println shiftEventArray;
        }
        def scheduleArray = "";
        if (record.schedule != null && record.schedule != "null") {
            scheduleArray = record.schedule.split(";");
            println scheduleArray;
        }

        [pageName: "Calendar", startTimeHour: startTimeHour, startTimeMin: startTimeMin, endTimeHour: endTimeHour, endTimeMin: endTimeMin,
         calendarTimeInterval: record.calendarTimeInterval, shiftTypes: shiftTypeArray, shiftEvents: shiftEventArray, scheduleEvents: scheduleArray, employeeList: employeeList]
    }

    def scheduleView() {
        log.warn "In Schedule View "
        def record = Organization.get(session.user.organizationID)

        def startTimeHour = aHelper.getStartHourOfOrganization(record)
        def startTimeMin = record.startTimeOfWorkDay.split("\\s+")[1]
        def endTimeHour = aHelper.getEndHourOfOrganization(record)
        def endTimeMin = record.endTimeOfWorkDay.split("\\s+")[1]



        def shiftTypeArray = record.shiftTypes.split(",");
        def query = User.where { organizationID == session.user.organizationID }

        def employeeList = query.list();

        def shiftEventArray = "";
        if (record.oneTimeShifts != null) {
            shiftEventArray = record.oneTimeShifts.split(";");
            println shiftEventArray;
        }
        def scheduleArray = "";
        if (record.schedule != null && record.schedule != "null") {
            scheduleArray = record.schedule.split(";");
            println scheduleArray;
        }
        render(view: 'createSchedule', model: [pageName            : "Schedule View", startTimeHour: startTimeHour, startTimeMin: startTimeMin, endTimeHour: endTimeHour, endTimeMin: endTimeMin,
                                               calendarTimeInterval: record.calendarTimeInterval, shiftTypes: shiftTypeArray, shiftEvents: shiftEventArray, scheduleEvents: scheduleArray, employeeList: employeeList])
    }

    def dashboard() {
        println "In Dashboard"
    }

    def reports(){
        println "In Reports"
        println session.user.level


        def query = User.where { organizationID == session.user.organizationID }

        def employeeList = query.list();

        def record = Organization.get(session.user.organizationID)

        def startTimeHour = aHelper.getStartHourOfOrganization(record)
        def startTimeMin = record.startTimeOfWorkDay.split("\\s+")[1]
        def endTimeHour = aHelper.getEndHourOfOrganization(record)
        def endTimeMin = record.endTimeOfWorkDay.split("\\s+")[1]

        def userRecord = User.get(session.user.id)



        [pageName            : "Availability", users: employeeList, userLevels: userLevels, employeeRoles: record.employeeGroups.split(","), startTimeHour: startTimeHour, startTimeMin: startTimeMin, endTimeHour: endTimeHour, endTimeMin: endTimeMin,
         calendarTimeInterval: record.calendarTimeInterval, availabilityEvents: userRecord.availabilityEvents]

    }

    def employees() {
        println "In Employees"
        println session.user.level


        def query = User.where { organizationID == session.user.organizationID }

        def employeeList = query.list();

        def record = Organization.get(session.user.organizationID)

        def startTimeHour = aHelper.getStartHourOfOrganization(record)
        def startTimeMin = record.startTimeOfWorkDay.split("\\s+")[1]
        def endTimeHour = aHelper.getEndHourOfOrganization(record)
        def endTimeMin = record.endTimeOfWorkDay.split("\\s+")[1]

        def userRecord = User.get(session.user.id)



        [pageName            : "Availability", users: employeeList, userLevels: userLevels, employeeRoles: record.employeeGroups.split(","), startTimeHour: startTimeHour, startTimeMin: startTimeMin, endTimeHour: endTimeHour, endTimeMin: endTimeMin,
         calendarTimeInterval: record.calendarTimeInterval, availabilityEvents: userRecord.availabilityEvents]
    }

    def employeesGetEmployeeAvailability() {
        println "Getting Availability for Employee " + params.EmployeeID
        def userRecord = User.get(params.EmployeeID)
        println userRecord.availabilityEvents
        render userRecord.availabilityEvents

        [availabilityEvents: userRecord.availabilityEvents]


    }

    def employeesQuickEditSave() {
        println "IN QUICK SAVE"
        println params.EmployeeEditInfo
        //id,email,first,last,Level,Role-Role-
        def userRecord = User.get(params.EmployeeEditInfo.split(",")[0])

        userRecord.email = params.EmployeeEditInfo.split(",")[1];
        userRecord.save(flush: true, failOnError: true)

    }

    def employeesGetHeatMap(){
        println "GETTING HEAT MAP"

        def intervalBeginDateString = params.beginEndDateString.split(":")[0];
        intervalBeginDateString = formatDateString(intervalBeginDateString)
        def intervalEndDateString = params.beginEndDateString.split(":")[1];
        intervalEndDateString = formatDateString(intervalEndDateString)
        Date intervalBeginDate1 = new SimpleDateFormat("MM/dd/yyyy").parse(intervalBeginDateString)
        Date intervalEndDate1 = new SimpleDateFormat("MM/dd/yyyy").parse(intervalEndDateString)
        def dateInterval = intervalBeginDate1..intervalEndDate1
        println "formatted " + intervalBeginDate1
        println "formatted " + intervalEndDate1

        def record = Organization.get(session.user.organizationID)
        def startTimeHour = aHelper.getStartHourOfOrganization(record)
        def startTimeMin = record.startTimeOfWorkDay.split("\\s+")[1]
        def endTimeHour = aHelper.getEndHourOfOrganization(record)
        def endTimeMin = record.endTimeOfWorkDay.split("\\s+")[1]

        Calendar cal = Calendar.getInstance();
        println record.timezone.split(",")[0]
        cal.setTimeZone((TimeZone.getTimeZone(record.timezone.split(",")[0])))
        cal.setTime(intervalBeginDate1);
        cal.set(Calendar.HOUR_OF_DAY,startTimeHour.toInteger());
        cal.set(Calendar.MINUTE,startTimeMin.toInteger());

        intervalBeginDate1 = cal.getTime();

        cal.setTimeZone((TimeZone.getTimeZone(record.timezone.split(",")[0])))
        cal.setTime(intervalEndDate1);
        cal.set(Calendar.HOUR_OF_DAY,endTimeHour.toInteger());
        cal.set(Calendar.MINUTE,endTimeMin.toInteger());

        intervalEndDate1 = cal.getTime();

        //TIMES WILL BE IN UTC. -5 FOR EST.
        println intervalBeginDate1
        println intervalEndDate1


        //get records the start or end during the time interval. Then combine the results to get the full list.
        def allAvailabilityRecordsForTimePeriod = AvailabilityEvent.findAllByOrgIDAndStartTimeBetween(session.user.organizationID, intervalBeginDate1, intervalEndDate1)
        def records =  AvailabilityEvent.findAllByOrgIDAndEndTimeBetween(session.user.organizationID, intervalBeginDate1, intervalEndDate1);
        records.each { r ->
            if(r in allAvailabilityRecordsForTimePeriod){
            }
            else{
                allAvailabilityRecordsForTimePeriod << r
            }
        }
        println allAvailabilityRecordsForTimePeriod


        //START ITERATING THROUGH ALL BUSINESS HOURS ANALYZING AVAILABILITY OF EMPLOYEES
        Date tempIntervalStart = intervalBeginDate1;
        Date tempIntervalEnd;
        def countUnavailable
        def countEmployees = User.executeQuery(
                "select count(*) from User where organizationID = '${session.user.organizationID}'")
        def maxEmployees =countEmployees[0]
        maxEmployees = maxEmployees/2;
        def renderString = "";
        def backgroundColor = "";
        def prevColor = "";
        def gradientString ="";
        while(tempIntervalStart.before(intervalEndDate1) || tempIntervalStart.equals(intervalEndDate1) ){
            countUnavailable = 0

            cal.setTime(tempIntervalStart);
            cal.add(Calendar.MINUTE, record.calendarTimeInterval)
            tempIntervalEnd = cal.getTime();

            println "${tempIntervalStart}  to  ${tempIntervalEnd}"

            //iterate through records and find if any of them fall in this interval
            records.each { r ->
                if(tempIntervalStart.before(r.endTime) && (tempIntervalEnd.after(r.startTime) || tempIntervalEnd.equals(r.startTime))){
                    countUnavailable ++;
                }
            }
            println countUnavailable;

//            /* fallback */
//            background-color: #1a82f7;
//
//            /* Safari 4-5, Chrome 1-9 */
//            background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#1a82f7), to(#2F2727));
//
//            /* Safari 5.1, Chrome 10+ */
//            background: -webkit-linear-gradient(top, #2F2727, #1a82f7);
//
//            /* Firefox 3.6+ */
//            background: -moz-linear-gradient(top, #2F2727, #1a82f7);
//
//            /* IE 10 */
//            background: -ms-linear-gradient(top, #2F2727, #1a82f7);
//
//            /* Opera 11.10+ */
//            background: -o-linear-gradient(top, #2F2727, #1a82f7);
            prevColor = backgroundColor;
            if( countUnavailable <= (maxEmployees/3) ){
                backgroundColor = "rgba(68, 171, 95, 0.62)";
            }
            else if( countUnavailable <= ((maxEmployees/3)*2) ){
                backgroundColor = "yellow";
            }
            else if( countUnavailable <= ((maxEmployees/3)*3) ){
                backgroundColor = "rgb(175, 33, 33)";
            }

            gradientString = "background-color: ${backgroundColor};\n" +
                    "\n" +
//                    "            /* Safari 4-5, Chrome 1-9 */\n" +
                    "            background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(${prevColor}), to(${backgroundColor}));\n" +
                    "\n" +
//                    "            /* Safari 5.1, Chrome 10+ */\n" +
                    "            background: -webkit-linear-gradient(top, ${prevColor}, ${backgroundColor});\n" +
                    "\n" +
//                    "            /* Firefox 3.6+ */\n" +
                    "            background: -moz-linear-gradient(top, ${prevColor}, ${backgroundColor});\n" +
                    "\n" +
//                    "            /* IE 10 */\n" +
                    "            background: -ms-linear-gradient(top, ${prevColor}, ${backgroundColor});\n" +
                    "\n" +
//                    "            /* Opera 11.10+ */\n" +
                    "            background: -o-linear-gradient(top, ${prevColor}, ${backgroundColor});";


            //BUILD RENDER STRING
            cal.setTime(tempIntervalStart);
            println cal.DAY_OF_WEEK
            eventDayAbbrev.setTimeZone(TimeZone.getTimeZone(record.timezone.split(",")[0]))
            eventTimeFormat.setTimeZone(TimeZone.getTimeZone(record.timezone.split(",")[0]))
            renderString = renderString + eventDayAbbrev.format(tempIntervalStart) + "tb" + eventTimeFormat.format(tempIntervalStart) + "++" + gradientString + "--"

            cal.setTime(tempIntervalStart);
            cal.add(Calendar.MINUTE, record.calendarTimeInterval)
            tempIntervalStart = cal.getTime();

            cal.setTime(tempIntervalEnd);
            cal.add(Calendar.MINUTE, record.calendarTimeInterval)
            tempIntervalEnd = cal.getTime();




        }



        render renderString
    }

    def availability()
    {
        println "In availability"
        def record = Organization.get(session.user.organizationID)

        def startTimeHour = aHelper.getStartHourOfOrganization(record)
        def startTimeMin = record.startTimeOfWorkDay.split("\\s+")[1]
        def endTimeHour = aHelper.getEndHourOfOrganization(record)
        def endTimeMin = record.endTimeOfWorkDay.split("\\s+")[1]

        def userRecord = User.get(session.user.id)

        def shiftTypeArray = record.shiftTypes.split(",");
        def query = User.where { organizationID == session.user.organizationID }

        def employeeList = query.list();

        def shiftEventArray = "";
        if (record.oneTimeShifts != null) {
            shiftEventArray = record.oneTimeShifts.split(";");
            println shiftEventArray;
        }
        def scheduleArray = "";
        if (record.schedule != null && record.schedule != "null") {
            scheduleArray = record.schedule.split(";");
            println scheduleArray;
        }

        def lastIDQuery;
        def nextID
        lastIDQuery = AvailabilityEvent.executeQuery("from AvailabilityEvent where orgID = '${session.user.organizationID}' order by id desc", [offset:0, max:1]);
        if(lastIDQuery[0] != null){
            nextID = lastIDQuery[0].id.toInteger()
            nextID++;
        }
        else{
            nextID = 1;
        }


        [pageName            : "Availability", startTimeHour: startTimeHour, startTimeMin: startTimeMin, endTimeHour: endTimeHour, endTimeMin: endTimeMin,
         calendarTimeInterval: record.calendarTimeInterval, shiftTypes: shiftTypeArray, shiftEvents: shiftEventArray, scheduleEvents: scheduleArray,
         availabilityEvents: userRecord.availabilityEvents, employeeList: employeeList, userID: session.user.id, nextID:nextID, orgID:session.user.organizationID]
    }
    def saveAvailability(){

        println "Saving Shifts"

        def lastIDQuery
        def nextID
        def renderString = ""
        def eventID
        def thisShift
        def thisShiftID
        def orgID = session.user.organizationID;
        def orgRecord = Organization.get(session.user.organizationID);
        def timeZone = orgRecord.timezone.split(",")[0];
        def saveShiftParameter = params.parameter; //parameter = thisEvent, allEvents, oneTime

        def map = slurper.parseText(params.Shifts);
        map.each { k, v ->
            println "${k}:${v}"

            thisShiftID = v.eventID.split("-")[0].replaceAll("[^\\d.]", "");
            println "THIS SHIFT: " + thisShiftID

            Date eventDate = new SimpleDateFormat("MM/dd/yyyy").parse(v.formattedDate);
            Date startTime = new SimpleDateFormat("MM/dd/yyyy HHmm z").parse(v.formattedDate + " " + v.startTimeString + " " + timeZone);
            Date endTime = new SimpleDateFormat("MM/dd/yyyy HHmm z").parse(v.formattedDate + " " + v.endTimeString + " " + timeZone);
            println "TEST;;;;"+ v.shiftType

            ////////////////////
            //IF ONE TIME SHIFT
            ////////////////////
            if (true) {
                lastIDQuery = AvailabilityEvent.executeQuery("from AvailabilityEvent where orgID = '${orgID}' order by id desc", [offset:0, max:1]);
                if(lastIDQuery[0] != null){
                    nextID = lastIDQuery[0].id.toInteger()
                    nextID++;
                }
                else{
                    nextID = 1;
                }
                //IF EVENT DOES NOT EXIST, CREATE NEW DB ROW
                if (AvailabilityEvent.findAllByEventID(v.eventID).size() == 0) {
                    println "CREATING NEW SHIFT"
                    def newRecord = new AvailabilityEvent(orgID: orgID,
                            eventID: v.eventID.split("--")[0].replace("Temp", "") + "--" + orgID + "--" + nextID,
                            dateOfEvent: eventDate,
                            notes: v.notesString,
                            formattedDate: v.formattedDate,
                            shiftType: v.shiftType,
                            numberOfShifts: v.numberOfShifts,
                            employeesScheduled: v.employeesScheduled,
                            weeklyOrOneTime: v.weeklyOrOneTime,
                            startTime: startTime,
                            endTime: endTime,
                            unformattedTime: v.unformattedTime,
                            dayOfWeek: new SimpleDateFormat("EEEE").format(eventDate),
                            isParent: "Y",
                            parentShiftID: v.parentShiftID,
                            seriesStartDate: eventDate,
                            seriesEndDate: v.seriesEndDate,
                            eventRepeat: v.eventRepeat,
                            repeatEnd: v.repeatEnd,
                            repeatEndAfter: v.repeatEndAfter,
                            repeatEndDate: v.repeatEndDate
                    ).save();

                    //New Events from the View will have incorrect ID numbers.
                    // Get latest ID number from DB and replace the records eventID and add to render string to return to View
                    if (v.eventID.indexOf("Temp") > -1) {
                        println "Return " + eventID
                        renderString = renderString + v.eventID + "," + newRecord.eventID + ";"
                        //newRecord.eventID = v.eventID.substring(0, 8) + newRecord.id;
                        println newRecord.eventID
                        //newRecord.save(flush: true);
                    }
                    if(v.eventRepeat.indexOf("Yes") > -1 && v.isParent == "Y" ){//ONLY HANDLES EVENT REPEAT CHANGES FROM A SINGLE "ONETIME" SHIFT
                        println "Creating Repeating Shifts Every Day for One Year"
                        Date repeatingEventDate = eventDate
                        Calendar c = Calendar.getInstance();
                        //Max number of shifts to be created will be 1 year for all cases
                        Date endRepeatDate = null;
                        c.setTime(repeatingEventDate);
                        c.add(Calendar.DATE, 365);
                        endRepeatDate = c.getTime();
                        def occurrancesEnd = 365;
                        def f = 1;
                        if(v.repeatEnd == "1 Year"){

                        }

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
                        lastIDQuery = AvailabilityEvent.executeQuery("from AvailabilityEvent  where orgID = '${orgID}' order by id desc", [offset:0, max:1])
                        nextID = lastIDQuery[0].id.toInteger()
                        def count = 1;

                        while(repeatingEventDate.before(endRepeatDate) && count < occurrancesEnd) {
                            println v.eventRepeat + ";" + daysOfWeekAbrev[repeatingEventDate.getDay()+1] + ";" + repeatingEventDate.getDay()
                            if(v.eventRepeat.indexOf(daysOfWeekAbrev[repeatingEventDate.getDay()+1]) > -1) {
                                nextID++;
                                def newFormattedDate = eventDateFormatted.format(repeatingEventDate);
                                startTime = new SimpleDateFormat("MM/dd/yyyy HHmm z").parse(newFormattedDate + " " + v.startTimeString + " " + timeZone);
                                endTime = new SimpleDateFormat("MM/dd/yyyy HHmm z").parse(newFormattedDate + " " + v.endTimeString + " " + timeZone);

                                def newRecord1 = new AvailabilityEvent(orgID: orgID,
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
                                        seriesStartDate: eventDate,
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
                        c.add(Calendar.DATE, -1);
                        repeatingEventDate = c.getTime();
                        AvailabilityEvent.executeUpdate("update AvailabilityEvent e set e.seriesEndDate = :seriesEndDateChange, e.repeatEndDate = :repeatEndDateChange where e.parentShiftID = :parentEventID" , [seriesEndDateChange: repeatingEventDate, repeatEndDateChange: eventDateFormatted.format(repeatingEventDate), parentEventID: v.eventID]);
                        AvailabilityEvent.executeUpdate("update AvailabilityEvent e set e.seriesEndDate = :seriesEndDateChange, e.repeatEndDate = :repeatEndDateChange where e.eventID = :parentEventID" , [seriesEndDateChange: repeatingEventDate, repeatEndDateChange: eventDateFormatted.format(repeatingEventDate), parentEventID: v.eventID]);

                    }

                }
                //IF EVENT ALREADY EXISTS, UPDATE
                else {
                    //IF EVENT REPEAT HAS CHANGED NEED TO DELETE SHIFTS AND CREATE NECESSARY NEW SHIFTS
                    def parentRecord
                    if(v.isParent == "N"){
                        parentRecord = AvailabilityEvent.findAllByOrgIDAndEventID(session.user.organizationID, v.parentShiftID)
                    }
                    else if (v.isParent == "Y"){
                        parentRecord = AvailabilityEvent.findAllByOrgIDAndEventID(session.user.organizationID, v.eventID)
                    }
                    println "parentRecord = " + parentRecord.repeatEndAfter[0];
                    println "V Record = " + v.repeatEndAfter;
                    println "condition = " + parentRecord.repeatEndAfter[0].equals(v.repeatEndAfter)
                    if(!parentRecord.eventRepeat[0].equals(v.eventRepeat) || !parentRecord.repeatEnd[0].equals(v.repeatEnd) ||
                            !parentRecord.repeatEndAfter[0].equals(v.repeatEndAfter) || !parentRecord.repeatEndDate[0].equals(v.repeatEndDate)){
                        println "A EVENT REPEAT SETTING HAS CHANGED............"
                        if(!parentRecord.eventRepeat[0].equals(v.eventRepeat)){
                            println "EVENT REPEAT CHANGED FROM " + parentRecord.eventRepeat[0] + " TO " + v.eventRepeat
                            if(parentRecord.eventRepeat[0].indexOf("Yes") > -1 && v.eventRepeat.indexOf("No") > -1){
                                println "REMOVING ALL REPEATING SHIFTS"
                                AvailabilityEvent.executeUpdate("delete AvailabilityEvent e where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo", [parentEventID: parentRecord.eventID, yesOrNo: "N"]);
                            }
                            else if(parentRecord.eventRepeat[0].indexOf("Yes") >-1 && v.eventRepeat.indexOf("Yes") > -1){
                                println "TEEEEEEEEEEEEEESSSSSSSTTTT"
                                def updateEventRepeatInDatabaseAllShifts = false;
                                if(parentRecord.eventRepeat[0].indexOf("Sun") >-1 && v.eventRepeat.indexOf("Sun") == -1){
                                    println "SHIFTS NO LONGER REPEAT ON SUNDAYS, REMOVING SUNDAY SHIFTS"
                                    AvailabilityEvent.executeUpdate("delete AvailabilityEvent e where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo AND e.dayOfWeek = :DOW", [parentEventID: parentRecord.eventID, yesOrNo: "N", DOW: "Sunday"]);
                                    updateEventRepeatInDatabaseAllShifts = true;
                                }
                                if(parentRecord.eventRepeat[0].indexOf("Sun") == -1 && v.eventRepeat.indexOf("Sun") > -1){
                                    println "SHIFTS NOW REPEAT ON SUNDAYS, REMOVING SUNDAY SHIFTS"
                                    AvailabilityEvent.executeUpdate("delete AvailabilityEvent e where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo AND e.dayOfWeek = :DOW", [parentEventID: parentRecord.eventID, yesOrNo: "N", DOW: "Sunday"]);
                                    updateEventRepeatInDatabaseAllShifts = true;

                                    //CREATE ADDITIONAL SHIFTS
                                    aHelper.createRepeatingShifts(eventDate, v, timeZone, orgID, "Sunday");
                                }

                                if(parentRecord.eventRepeat[0].indexOf("Mon") >-1 && v.eventRepeat.indexOf("Mon") == -1){
                                    println "SHIFTS NO LONGER REPEAT ON MONDAYS, REMOVING MONDAY SHIFTS"
                                    AvailabilityEvent.executeUpdate("delete AvailabilityEvent e where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo AND e.dayOfWeek = :DOW", [parentEventID: parentRecord.eventID, yesOrNo: "N", DOW: "Monday"]);
                                    updateEventRepeatInDatabaseAllShifts = true;
                                }
                                if(parentRecord.eventRepeat[0].indexOf("Mon") == -1 && v.eventRepeat.indexOf("Mon") > -1){
                                    println "SHIFTS NOW REPEAT ON MONDAYS, REMOVING MONDAY SHIFTS"
                                    AvailabilityEvent.executeUpdate("delete AvailabilityEvent e where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo AND e.dayOfWeek = :DOW", [parentEventID: parentRecord.eventID, yesOrNo: "N", DOW: "Monday"]);
                                    updateEventRepeatInDatabaseAllShifts = true;

                                    //CREATE ADDITIONAL SHIFTS
                                    aHelper.createRepeatingShifts(eventDate, v, timeZone, orgID, "Monday");
                                }

                                if(parentRecord.eventRepeat[0].indexOf("Tue") >-1 && v.eventRepeat.indexOf("Tue") == -1){
                                    println "SHIFTS NO LONGER REPEAT ON TUESDAY, REMOVING TUESDAY SHIFTS"
                                    AvailabilityEvent.executeUpdate("delete AvailabilityEvent e where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo AND e.dayOfWeek = :DOW", [parentEventID: parentRecord.eventID, yesOrNo: "N", DOW: "Tuesday"]);
                                    updateEventRepeatInDatabaseAllShifts = true;
                                }
                                if(parentRecord.eventRepeat[0].indexOf("Tue") == -1 && v.eventRepeat.indexOf("Tue") > -1){
                                    println "SHIFTS NOW REPEAT ON TUESDAY, REMOVING TUESDAY SHIFTS"
                                    AvailabilityEvent.executeUpdate("delete AvailabilityEvent e where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo AND e.dayOfWeek = :DOW", [parentEventID: parentRecord.eventID, yesOrNo: "N", DOW: "Tuesday"]);
                                    updateEventRepeatInDatabaseAllShifts = true;

                                    //CREATE ADDITIONAL SHIFTS
                                    aHelper.createRepeatingShifts(eventDate, v, timeZone, orgID, "Tuesday");
                                }

                                if(parentRecord.eventRepeat[0].indexOf("Wed") >-1 && v.eventRepeat.indexOf("Wed") == -1){
                                    println "SHIFTS NO LONGER REPEAT ON WEDNESDAY, REMOVING WEDNESDAY SHIFTS"
                                    AvailabilityEvent.executeUpdate("delete AvailabilityEvent e where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo AND e.dayOfWeek = :DOW", [parentEventID: parentRecord.eventID, yesOrNo: "N", DOW: "Wednesday"]);
                                    updateEventRepeatInDatabaseAllShifts = true;
                                }
                                if(parentRecord.eventRepeat[0].indexOf("Wed") == -1 && v.eventRepeat.indexOf("Wed") > -1){
                                    println "SHIFTS NOW REPEAT ON WEDNESDAY, REMOVING WEDNESDAY SHIFTS"
                                    AvailabilityEvent.executeUpdate("delete AvailabilityEvent e where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo AND e.dayOfWeek = :DOW", [parentEventID: parentRecord.eventID, yesOrNo: "N", DOW: "Wednesday"]);
                                    updateEventRepeatInDatabaseAllShifts = true;

                                    //CREATE ADDITIONAL SHIFTS
                                    aHelper.createRepeatingShifts(eventDate, v, timeZone, orgID, "Wednesday");
                                }

                                if(parentRecord.eventRepeat[0].indexOf("Thu") >-1 && v.eventRepeat.indexOf("Thu") == -1){
                                    println "SHIFTS NO LONGER REPEAT ON THURSDAY, REMOVING THURSDAY SHIFTS"
                                    AvailabilityEvent.executeUpdate("delete AvailabilityEvent e where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo AND e.dayOfWeek = :DOW", [parentEventID: parentRecord.eventID, yesOrNo: "N", DOW: "Thursday"]);
                                    updateEventRepeatInDatabaseAllShifts = true;
                                }
                                if(parentRecord.eventRepeat[0].indexOf("Thu") == -1 && v.eventRepeat.indexOf("Thu") > -1){
                                    println "SHIFTS NOW REPEAT ON THURSDAY, REMOVING THURSDAY SHIFTS"
                                    AvailabilityEvent.executeUpdate("delete AvailabilityEvent e where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo AND e.dayOfWeek = :DOW", [parentEventID: parentRecord.eventID, yesOrNo: "N", DOW: "Thursday"]);
                                    updateEventRepeatInDatabaseAllShifts = true;

                                    //CREATE ADDITIONAL SHIFTS
                                    aHelper.createRepeatingShifts(eventDate, v, timeZone, orgID, "Thursday");
                                }

                                if(parentRecord.eventRepeat[0].indexOf("Fri") >-1 && v.eventRepeat.indexOf("Fri") == -1){
                                    println "SHIFTS NO LONGER REPEAT ON FRIDAY, REMOVING FRIDAY SHIFTS"
                                    AvailabilityEvent.executeUpdate("delete AvailabilityEvent e where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo AND e.dayOfWeek = :DOW", [parentEventID: parentRecord.eventID, yesOrNo: "N", DOW: "Friday"]);
                                    updateEventRepeatInDatabaseAllShifts = true;
                                }
                                if(parentRecord.eventRepeat[0].indexOf("Fri") == -1 && v.eventRepeat.indexOf("Fri") > -1){
                                    println "SHIFTS NOW REPEAT ON FRIDAY, REMOVING FRIDAY SHIFTS"
                                    AvailabilityEvent.executeUpdate("delete AvailabilityEvent e where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo AND e.dayOfWeek = :DOW", [parentEventID: parentRecord.eventID, yesOrNo: "N", DOW: "Friday"]);
                                    updateEventRepeatInDatabaseAllShifts = true;

                                    //CREATE ADDITIONAL SHIFTS
                                    aHelper.createRepeatingShifts(eventDate, v, timeZone, orgID, "Friday");
                                }

                                if(parentRecord.eventRepeat[0].indexOf("Sat") >-1 && v.eventRepeat.indexOf("Sat") == -1){
                                    println "SHIFTS NO LONGER REPEAT ON SATURDAY, REMOVING SATURDAY SHIFTS"
                                    AvailabilityEvent.executeUpdate("delete AvailabilityEvent e where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo AND e.dayOfWeek = :DOW", [parentEventID: parentRecord.eventID, yesOrNo: "N", DOW: "Saturday"]);
                                    updateEventRepeatInDatabaseAllShifts = true;
                                }
                                if(parentRecord.eventRepeat[0].indexOf("Sat") == -1 && v.eventRepeat.indexOf("Sat") > -1){
                                    println "SHIFTS NOW REPEAT ON SATURDAY, REMOVING SATURDAY SHIFTS"
                                    AvailabilityEvent.executeUpdate("delete AvailabilityEvent e where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo AND e.dayOfWeek = :DOW", [parentEventID: parentRecord.eventID, yesOrNo: "N", DOW: "Saturday"]);
                                    updateEventRepeatInDatabaseAllShifts = true;

                                    //CREATE ADDITIONAL SHIFTS
                                    aHelper.createRepeatingShifts(eventDate, v, timeZone, orgID, "Saturday");
                                }

                                if(updateEventRepeatInDatabaseAllShifts == true){
                                    println "TESTTPHASDLFSKDFLASKDJF;LSDKJFSDJKFL;SDJKF;LJKASD;FLJS;DLFJSLD = " + parentRecord.eventID + " " + v.eventRepeat.getClass()
                                    AvailabilityEvent.executeUpdate("update AvailabilityEvent e set e.eventRepeat = :eventRepeatChange where e.parentShiftID = :parentEventID" , [eventRepeatChange: v.eventRepeat, parentEventID: parentRecord.eventID]);
                                    //AvailabilityEvent.executeUpdate("update AvailabilityEvent e set e.eventRepeat = :eventRepeatChange where e.eventID = :eventIDCon " , [eventRepeatChange: v.eventRepeat, eventIDCon: parentRecord.eventID[0]]);
                                    def eventU = AvailabilityEvent.findAllByOrgIDAndEventID(session.user.organizationID, parentRecord.eventID);
                                    println eventU.eventRepeat.getClass()
                                    try {
                                        eventU[0].eventRepeat = v.eventRepeat;
                                        eventU[0].save(failOnError: true);
                                    }
                                    catch (Exception e) {
                                        println e;
                                    }

                                }

                            }
                            //AvailabilityEvent.executeUpdate("delete AvailabilityEvent e where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo", [parentEventID: parentRecord.eventID, yesOrNo: "N"]);
                        }
                        else if(!parentRecord.repeatEnd[0].equals(v.repeatEnd)){
                            println "EVENT REPEAT END CHANGED FROM " + parentRecord.repeatEnd[0] + " TO " + v.repeatEnd
                        }
                        else if(!parentRecord.repeatEndAfter[0].equals(v.repeatEndAfter)){
                            println "EVENT REPEAT AFTER CHANGED FROM " + parentRecord.repeatEndAfter[0] + " TO " + v.repeatEndAfter
                        }
                        else if(!parentRecord.repeatEndDate[0].equals(v.repeatEndDate)){
                            println "EVENT REPEAT END DATE CHANGED FROM " + parentRecord.repeatEndDate[0] + " TO " + v.repeatEndDate
                        }


                    }



                    if(saveShiftParameter == "allEvents"){
                        println "UPDATING PARENT SHIFT AND ALL CHILD SHIFTS"

                        def events
                        def results
                        if(v.isParent == "Y"){
                            events = AvailabilityEvent.where {
                                (orgID == session.user.organizationID && parentShiftID == v.eventID) || (orgID == session.user.organizationID && eventID == v.eventID)
                            }
                            results = events.list()
                            println results
                        }
                        else if(v.isParent == "N"){
                            events = AvailabilityEvent.where {
                                (orgID == session.user.organizationID && parentShiftID == v.parentShiftID) || (orgID == session.user.organizationID && eventID == v.parentShiftID)
                            }
                            results = events.list()
                            println results
                        }

                        //THIS UPDATE QUERY NEEDS OPTIMIZATION
                        results.each{ result ->
                            //result.eventID = result.eventID;
                            //result.dateOfEvent = result.dateOfEvent; //TODO:CONSTRAIN IN VIEW FROM BEING ABLE TO CHANGE DATES IF UPDATING ALL EVENTS
                            result.notes = result.notes + " " + v.notesString;
                            //result.formattedDate = result.formattedDate;
                            result.shiftType = v.shiftType;
                            result.numberOfShifts = v.numberOfShifts;
                            result.employeesScheduled = v.employeesScheduled;
                            //result.weeklyOrOneTime = result.weeklyOrOneTime;
                            //result.startTime = result.startTime;
                            //result.endTime = result.endTime;
                            //result.unformattedTime = result.unformattedTime;
                            //result.dayOfWeek = new SimpleDateFormat("EEEE").format(result.dateOfEvent);
                            //result.isParent = result.isParent;
                            //result.parentShiftID = result.parentShiftID;
                            //result.seriesStartDate = result.seriesStartDate;
                            //result.sereiesEndDate = result.seriesEndDate;
                            //result.eventRepeat = result.eventRepeat;
                            //result.repeatEnd = result.repeatEnd;
                            //result.repeatEndAfter = result.repeatEndAfter;
                            //result.repeatEndDate = result.repeatEndDate;

//                            try {
//                                result.save(failOnError: true);
//                            }
//                            catch (Exception e) {
//                                println e;
//                            }
                            result.save(flush: true);
                        }

                    }
                    else {
                        //HANDLES DRAG, RESIZE, MODAL, thisEvent Only EDITS
                        println "UPDATING SHIFT: " + v.eventID
                        def updateRecord = AvailabilityEvent.findAllByEventID(v.eventID)[0];
                        updateRecord.eventID = v.eventID;
                        updateRecord.dateOfEvent = eventDate;
                        updateRecord.notes = v.notesString;
                        updateRecord.formattedDate = v.formattedDate;
                        updateRecord.shiftType = v.shiftType;
                        updateRecord.numberOfShifts = v.numberOfShifts;
                        updateRecord.employeesScheduled = v.employeesScheduled;
                        updateRecord.weeklyOrOneTime = v.weeklyOrOneTime;
                        updateRecord.startTime = startTime;
                        updateRecord.endTime = endTime;
                        updateRecord.unformattedTime = v.unformattedTime;
                        updateRecord.dayOfWeek = new SimpleDateFormat("EEEE").format(eventDate);
                        updateRecord.isParent = v.isParent;
                        updateRecord.parentShiftID = v.parentShiftID;
                        //updateRecord.seriesStartDate = v.seriesStartDate;
                        //updateRecord.seriesEndDate = v.seriesEndDate;
                        updateRecord.eventRepeat = v.eventRepeat;
                        updateRecord.repeatEnd = v.repeatEnd;
                        updateRecord.repeatEndAfter = v.repeatEndAfter;
                        updateRecord.repeatEndDate = v.repeatEndDate;
                        try {
                            updateRecord.save(failOnError: true);
                        }
                        catch (Exception e) {
                            println e;
                        }
                        updateRecord.save(flush: true);
                    }
                }
            }
            if(v.eventRepeat.indexOf("Yes") > -1 && v.isParent == "Y" && saveShiftParameter=="oneTime"){//ONLY HANDLES EVENT REPEAT CHANGES FROM A SINGLE "ONETIME" SHIFT
                println "Creating Repeating Shifts Every Day for One Year"
                Date repeatingEventDate = eventDate
                Calendar c = Calendar.getInstance();
                //Max number of shifts to be created will be 1 year for all cases
                Date endRepeatDate = null;
                c.setTime(repeatingEventDate);
                c.add(Calendar.DATE, 365);
                endRepeatDate = c.getTime();
                def occurrancesEnd = 365;
                def f = 1;
                if(v.repeatEnd == "1 Year"){

                }

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
                lastIDQuery = AvailabilityEvent.executeQuery("from AvailabilityEvent where orgID = '${orgID}' order by id desc", [offset:0, max:1])
                nextID = lastIDQuery[0].id.toInteger()
                def count = 1;

                while(repeatingEventDate.before(endRepeatDate) && count < occurrancesEnd) {
                    println v.eventRepeat + ";" + daysOfWeekAbrev[repeatingEventDate.getDay()+1] + ";" + repeatingEventDate.getDay()
                    if(v.eventRepeat.indexOf(daysOfWeekAbrev[repeatingEventDate.getDay()+1]) > -1) {
                        nextID++;
                        def newFormattedDate = eventDateFormatted.format(repeatingEventDate);
                        startTime = new SimpleDateFormat("MM/dd/yyyy HHmm z").parse(newFormattedDate + " " + v.startTimeString + " " + timeZone);
                        endTime = new SimpleDateFormat("MM/dd/yyyy HHmm z").parse(newFormattedDate + " " + v.endTimeString + " " + timeZone);

                        def newRecord = new AvailabilityEvent(orgID: orgID,
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
                                seriesStartDate: eventDate,
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
                c.add(Calendar.DATE, -1);
                repeatingEventDate = c.getTime();
                AvailabilityEvent.executeUpdate("update AvailabilityEvent e set e.seriesEndDate = :seriesEndDateChange, e.repeatEndDate = :repeatEndDateChange where e.parentShiftID = :parentEventID" , [seriesEndDateChange: repeatingEventDate, repeatEndDateChange: eventDateFormatted.format(repeatingEventDate), parentEventID: v.eventID]);
                AvailabilityEvent.executeUpdate("update AvailabilityEvent e set e.seriesEndDate = :seriesEndDateChange, e.repeatEndDate = :repeatEndDateChange where e.eventID = :parentEventID" , [seriesEndDateChange: repeatingEventDate, repeatEndDateChange: eventDateFormatted.format(repeatingEventDate), parentEventID: v.eventID]);

            }
        }
        lastIDQuery = AvailabilityEvent.executeQuery("from AvailabilityEvent where orgID = '${orgID}' order by id desc", [offset:0, max:1])
        nextID = lastIDQuery[0].id.toInteger()
        nextID++;
        println "LAST ID ============" + renderString + "--" + nextID;
        aHelper
        render renderString + "++" + nextID;
    }
    def saveAvailabilitybackup() {
        println "Saving Availability"
        //render(text: "OK", contentType: "text/xml", encoding: "ISO-8859-1")
        def record = Organization.get(session.user.organizationID)

        //Calculate startTime and endTime
        def startTimeHour = aHelper.getStartHourOfOrganization(record)
        def startTimeMin = record.startTimeOfWorkDay.split("\\s+")[1]
        def endTimeHour = aHelper.getEndHourOfOrganization(record)
        def endTimeMin = record.endTimeOfWorkDay.split("\\s+")[1]


        def availabilityString = ""
        def minuteArray
        if (record.calendarTimeInterval == 30) {
            minuteArray = ["00", "30"]
        } else if (record.calendarTimeInterval == 60) {
            minuteArray = ["00"]
        } else if (record.calendarTimeInterval == 15) {
            minuteArray = ["00", "15", "30", "45"]
        }

        def unavailabilityArray = params.Unavailability.trim().split(";");
        println "Unavailability Array: " + unavailabilityArray.length
        if (unavailabilityArray.length < 1) {
            println "NO GOOD";
        }
        def dayArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        for (int d = 0; d < dayArray.size(); d++) {
            for (int i = startTimeHour; i <= endTimeHour; i++) {
                for (int m = 0; m < minuteArray.size(); m++) {
                    availabilityString = availabilityString + " " + dayArray[d] + ":" + (Integer.toString(i).length() < 2 ? "0" + i : i) + minuteArray[m]
                    for (String s : unavailabilityArray) {
                        if (params.Unavailability.length() > 1 && s.substring(0, 3) == dayArray[d].substring(0, 3)
                                && Integer.parseInt(Integer.toString(i) + minuteArray[m]) >= Integer.parseInt(s.substring(4, 8))
                                && Integer.parseInt(Integer.toString(i) + minuteArray[m]) < Integer.parseInt(s.substring(11, 15))) {
                            availabilityString = availabilityString + "U";
                        }
                        //println s.substring(11,15);
                    }
                }


            }


        }
        println availabilityString
        println session.user.id
        def userRecord = User.get(session.user.id)
        userRecord.availability = availabilityString
        userRecord.availabilityEvents = params.Unavailability
        userRecord.save(flush: true, failOnError: true)
        render 'GOOD'
    }
    def deleteShifts(){
        println "DELETING SHIFT"
        def deleteShiftArray = params.Shifts.split(";");
        if(params.thisOrAll == "this"){
            deleteShiftArray.each { deleteShift ->
                def deleteRecord = Event.findAllByOrgIDAndEventID(session.user.organizationID, deleteShift);
                //IF EVENT IS A PARENT MAKE THE NEXT REPEATING SHIFT THE PARENT.
                if(deleteRecord[0].isParent == "Y"){
                    println "GET CHILD SHIFTS"
                    def childShifts = Event.findAllByOrgIDAndParentShiftID(session.user.organizationID, deleteShift, [max: 1, offset: 0, sort: "dateOfEvent"]);
                    println "CHILD SHIFTS ===== " + childShifts.size
                    if(childShifts.size > 0){
                        childShifts[0].isParent = "Y"
                        childShifts[0].parentShiftID = "";
                        childShifts[0].save(flush: true, failOnError: true);

                        //childShifts = Event.findAllByOrgIDAndParentShiftID(session.user.organizationID, params.Shifts, [max: 1, offset: 0, sort: "dateOfEvent"]);
                        Event.executeUpdate("update Event e set e.parentShiftID = :temp where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo " , [parentEventID: deleteShift, yesOrNo: "N", temp: childShifts[0].eventID]);

                    }

                }
                deleteRecord[0].delete(flush: true)
                //Event.executeUpdate("delete Event e where e.eventID = :parentEventID AND e.isParent = :yesOrNo", [parentEventID: parentRecord.eventID, yesOrNo: "N"]);

            }
        }
        else if(params.thisOrAll == "all"){

            deleteShiftArray.each { deleteShift ->
                def deleteRecord = Event.findAllByOrgIDAndEventID(session.user.organizationID, deleteShift);
                println "DELETING SHIFT ${deleteRecord.parentShiftID}"
                Event.executeUpdate("delete from Event e where e.parentShiftID='${deleteRecord[0].parentShiftID}'");
                Event.executeUpdate("delete from Event e where e.eventID='${deleteRecord[0].parentShiftID}'");
            }

        }


        render "good"
    }

    def deleteAvailabilityShifts(){
        println "DELETING SHIFT"
        def deleteRecord = AvailabilityEvent.findAllByOrgIDAndEventID(session.user.organizationID, params.Shifts);
        //IF EVENT IS A PARENT MAKE THE NEXT REPEATING SHIFT THE PARENT.
        if(deleteRecord[0].isParent == "Y"){
            println "GET CHILD SHIFTS"
            def childShifts = AvailabilityEvent.findAllByOrgIDAndParentShiftID(session.user.organizationID, params.Shifts, [max: 1, offset: 0, sort: "dateOfEvent"]);
            println "CHILD SHIFTS ===== " + childShifts.size
            if(childShifts.size > 0){
                childShifts[0].isParent = "Y"
                childShifts[0].parentShiftID = "";
                childShifts[0].save(flush: true, failOnError: true);

                //childShifts = AvailabilityEvent.findAllByOrgIDAndParentShiftID(session.user.organizationID, params.Shifts, [max: 1, offset: 0, sort: "dateOfEvent"]);
                AvailabilityEvent.executeUpdate("update AvailabilityEvent e set e.parentShiftID = :temp where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo " , [parentEventID: params.Shifts, yesOrNo: "N", temp: childShifts[0].eventID]);

            }

        }
        deleteRecord[0].delete(flush: true)
        //AvailabilityEvent.executeUpdate("delete AvailabilityEvent e where e.eventID = :parentEventID AND e.isParent = :yesOrNo", [parentEventID: parentRecord.eventID, yesOrNo: "N"]);

        render "good"
    }

    def saveShifts(){

        println "Saving Shifts"
        println "Params: " + params
        def lastIDQuery
        def nextID
        def renderString = ""
        def savedShiftsRender =""
        def eventID
        def thisShift
        def thisShiftID
        def orgID
        if(params.mobile){
            orgID = params.orgID
        }
        else{
            orgID= session.user.organizationID;
        }

        def orgRecord = Organization.get(orgID);
        def timeZone = orgRecord.timezone.split(",")[0];
        def saveShiftParameter = params.parameter; //parameter = thisEvent, allEvents, oneTime

        def map = slurper.parseText(params.Shifts);
        map.each { k, v ->
            if(params.mobile){
                v = slurper.parseText(v); //android passes in from url, need to convrt to json
                v.formattedDate = v.formattedDate.replace("\\", "\\\\");
            }
            println "${k}:${v}"




            thisShiftID = v.eventID.split("-")[0].replaceAll("[^\\d.]", "");
            println "THIS SHIFT: " + thisShift

            Date eventDate = new SimpleDateFormat("MM/dd/yyyy").parse(v.formattedDate);
            Date startTime = new SimpleDateFormat("MM/dd/yyyy HHmm z").parse(v.formattedDate + " " + v.startTimeString + " " + timeZone);
            Date endTime = new SimpleDateFormat("MM/dd/yyyy HHmm z").parse(v.formattedDate + " " + v.endTimeString + " " + timeZone);
            println "TEST;;;;"+ v.shiftType

            ////////////////////
            //IF ONE TIME SHIFT
            ////////////////////
            if (true) {
                lastIDQuery = Event.executeQuery("from Event where orgID = '${orgID}' order by id desc", [offset:0, max:1]);
                if(lastIDQuery[0] != null){
                    nextID = lastIDQuery[0].id.toInteger()
                    nextID++;
                }
                else{
                    nextID = 1;
                }
                //IF EVENT DOES NOT EXIST, CREATE NEW DB ROW
                if (Event.findAllByEventID(v.eventID).size() == 0) {
                    println "CREATING NEW SHIFT"
                    def newRecord = new Event(orgID: orgID,
                            eventID: v.eventID.split("--")[0].replace("Temp", "") + "--" + orgID + "--" + nextID,
                            dateOfEvent: eventDate,
                            notes: v.notesString,
                            formattedDate: v.formattedDate,
                            shiftType: v.shiftType,
                            numberOfShifts: v.numberOfShifts,
                            employeesScheduled: v.employeesScheduled,
                            weeklyOrOneTime: v.weeklyOrOneTime,
                            startTime: startTime,
                            endTime: endTime,
                            unformattedTime: v.unformattedTime,
                            dayOfWeek: new SimpleDateFormat("EEEE").format(eventDate),
                            isParent: "Y",
                            parentShiftID: v.parentShiftID,
                            seriesStartDate: eventDate,
                            seriesEndDate: v.seriesEndDate,
                            eventRepeat: v.eventRepeat,
                            repeatEnd: v.repeatEnd,
                            repeatEndAfter: v.repeatEndAfter,
                            repeatEndDate: v.repeatEndDate
                    )
                    if(!newRecord.save()){
                        println newRecord.errors.allErrors
                    }
                    //send back the new event ID since it will be Temp ID will be replaced in the view
                    //savedShiftsRender = savedShiftsRender + newRecord.eventID;

                    //New Events from the View will have incorrect ID numbers.
                    // Get latest ID number from DB and replace the records eventID and add to render string to return to View
                    if (v.eventID.indexOf("Temp") > -1) {
                        println "Return " + eventID
                        renderString = renderString + v.eventID + "," + newRecord.eventID + ";"
                        //newRecord.eventID = v.eventID.substring(0, 8) + newRecord.id;
                        println newRecord.eventID
                        //newRecord.save(flush: true);
                    }
                }
                //IF EVENT ALREADY EXISTS, UPDATE
                else {
                    //IF EVENT REPEAT HAS CHANGED NEED TO DELETE SHIFTS AND CREATE NECESSARY NEW SHIFTS
                    def parentRecord
                    if(v.isParent == "N"){
                        parentRecord = Event.findAllByOrgIDAndEventID(orgID, v.parentShiftID)
                    }
                    else if (v.isParent == "Y"){
                        parentRecord = Event.findAllByOrgIDAndEventID(orgID, v.eventID)
                    }
                    println "parentRecord = " + parentRecord.repeatEndAfter[0];
                    println "V Record = " + v.repeatEndAfter;
                    println "condition = " + parentRecord.repeatEndAfter[0].equals(v.repeatEndAfter)
                    if(!parentRecord.eventRepeat[0].equals(v.eventRepeat) || !parentRecord.repeatEnd[0].equals(v.repeatEnd) ||
                            !parentRecord.repeatEndAfter[0].equals(v.repeatEndAfter) || !parentRecord.repeatEndDate[0].equals(v.repeatEndDate)){
                        println "A EVENT REPEAT SETTING HAS CHANGED............"
                        if(!parentRecord.eventRepeat[0].equals(v.eventRepeat)){
                            println "EVENT REPEAT CHANGED FROM " + parentRecord.eventRepeat[0] + " TO " + v.eventRepeat
                            if(parentRecord.eventRepeat[0].indexOf("Yes") > -1 && v.eventRepeat.indexOf("No") > -1){
                                println "REMOVING ALL REPEATING SHIFTS"
                                Event.executeUpdate("delete Event e where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo", [parentEventID: parentRecord.eventID, yesOrNo: "N"]);
                            }
                            else if(parentRecord.eventRepeat[0].indexOf("Yes") >-1 && v.eventRepeat.indexOf("Yes") > -1){
                                println "TEEEEEEEEEEEEEESSSSSSSTTTT"
                                def updateEventRepeatInDatabaseAllShifts = false;
                                if(parentRecord.eventRepeat[0].indexOf("Sun") >-1 && v.eventRepeat.indexOf("Sun") == -1){
                                    println "SHIFTS NO LONGER REPEAT ON SUNDAYS, REMOVING SUNDAY SHIFTS"
                                    Event.executeUpdate("delete Event e where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo AND e.dayOfWeek = :DOW", [parentEventID: parentRecord.eventID, yesOrNo: "N", DOW: "Sunday"]);
                                    updateEventRepeatInDatabaseAllShifts = true;
                                }
                                if(parentRecord.eventRepeat[0].indexOf("Sun") == -1 && v.eventRepeat.indexOf("Sun") > -1){
                                    println "SHIFTS NOW REPEAT ON SUNDAYS, REMOVING SUNDAY SHIFTS"
                                    Event.executeUpdate("delete Event e where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo AND e.dayOfWeek = :DOW", [parentEventID: parentRecord.eventID, yesOrNo: "N", DOW: "Sunday"]);
                                    updateEventRepeatInDatabaseAllShifts = true;

                                    //CREATE ADDITIONAL SHIFTS
                                    aHelper.createRepeatingShifts(eventDate, v, timeZone, orgID, "Sunday");
                                }

                                if(parentRecord.eventRepeat[0].indexOf("Mon") >-1 && v.eventRepeat.indexOf("Mon") == -1){
                                    println "SHIFTS NO LONGER REPEAT ON MONDAYS, REMOVING MONDAY SHIFTS"
                                    Event.executeUpdate("delete Event e where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo AND e.dayOfWeek = :DOW", [parentEventID: parentRecord.eventID, yesOrNo: "N", DOW: "Monday"]);
                                    updateEventRepeatInDatabaseAllShifts = true;
                                }
                                if(parentRecord.eventRepeat[0].indexOf("Mon") == -1 && v.eventRepeat.indexOf("Mon") > -1){
                                    println "SHIFTS NOW REPEAT ON MONDAYS, REMOVING MONDAY SHIFTS"
                                    Event.executeUpdate("delete Event e where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo AND e.dayOfWeek = :DOW", [parentEventID: parentRecord.eventID, yesOrNo: "N", DOW: "Monday"]);
                                    updateEventRepeatInDatabaseAllShifts = true;

                                    //CREATE ADDITIONAL SHIFTS
                                    aHelper.createRepeatingShifts(eventDate, v, timeZone, orgID, "Monday");
                                }

                                if(parentRecord.eventRepeat[0].indexOf("Tue") >-1 && v.eventRepeat.indexOf("Tue") == -1){
                                    println "SHIFTS NO LONGER REPEAT ON TUESDAY, REMOVING TUESDAY SHIFTS"
                                    Event.executeUpdate("delete Event e where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo AND e.dayOfWeek = :DOW", [parentEventID: parentRecord.eventID, yesOrNo: "N", DOW: "Tuesday"]);
                                    updateEventRepeatInDatabaseAllShifts = true;
                                }
                                if(parentRecord.eventRepeat[0].indexOf("Tue") == -1 && v.eventRepeat.indexOf("Tue") > -1){
                                    println "SHIFTS NOW REPEAT ON TUESDAY, REMOVING TUESDAY SHIFTS"
                                    Event.executeUpdate("delete Event e where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo AND e.dayOfWeek = :DOW", [parentEventID: parentRecord.eventID, yesOrNo: "N", DOW: "Tuesday"]);
                                    updateEventRepeatInDatabaseAllShifts = true;

                                    //CREATE ADDITIONAL SHIFTS
                                    aHelper.createRepeatingShifts(eventDate, v, timeZone, orgID, "Tuesday");
                                }

                                if(parentRecord.eventRepeat[0].indexOf("Wed") >-1 && v.eventRepeat.indexOf("Wed") == -1){
                                    println "SHIFTS NO LONGER REPEAT ON WEDNESDAY, REMOVING WEDNESDAY SHIFTS"
                                    Event.executeUpdate("delete Event e where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo AND e.dayOfWeek = :DOW", [parentEventID: parentRecord.eventID, yesOrNo: "N", DOW: "Wednesday"]);
                                    updateEventRepeatInDatabaseAllShifts = true;
                                }
                                if(parentRecord.eventRepeat[0].indexOf("Wed") == -1 && v.eventRepeat.indexOf("Wed") > -1){
                                    println "SHIFTS NOW REPEAT ON WEDNESDAY, REMOVING WEDNESDAY SHIFTS"
                                    Event.executeUpdate("delete Event e where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo AND e.dayOfWeek = :DOW", [parentEventID: parentRecord.eventID, yesOrNo: "N", DOW: "Wednesday"]);
                                    updateEventRepeatInDatabaseAllShifts = true;

                                    //CREATE ADDITIONAL SHIFTS
                                    aHelper.createRepeatingShifts(eventDate, v, timeZone, orgID, "Wednesday");
                                }

                                if(parentRecord.eventRepeat[0].indexOf("Thu") >-1 && v.eventRepeat.indexOf("Thu") == -1){
                                    println "SHIFTS NO LONGER REPEAT ON THURSDAY, REMOVING THURSDAY SHIFTS"
                                    Event.executeUpdate("delete Event e where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo AND e.dayOfWeek = :DOW", [parentEventID: parentRecord.eventID, yesOrNo: "N", DOW: "Thursday"]);
                                    updateEventRepeatInDatabaseAllShifts = true;
                                }
                                if(parentRecord.eventRepeat[0].indexOf("Thu") == -1 && v.eventRepeat.indexOf("Thu") > -1){
                                    println "SHIFTS NOW REPEAT ON THURSDAY, REMOVING THURSDAY SHIFTS"
                                    Event.executeUpdate("delete Event e where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo AND e.dayOfWeek = :DOW", [parentEventID: parentRecord.eventID, yesOrNo: "N", DOW: "Thursday"]);
                                    updateEventRepeatInDatabaseAllShifts = true;

                                    //CREATE ADDITIONAL SHIFTS
                                    aHelper.createRepeatingShifts(eventDate, v, timeZone, orgID, "Thursday");
                                }

                                if(parentRecord.eventRepeat[0].indexOf("Fri") >-1 && v.eventRepeat.indexOf("Fri") == -1){
                                    println "SHIFTS NO LONGER REPEAT ON FRIDAY, REMOVING FRIDAY SHIFTS"
                                    Event.executeUpdate("delete Event e where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo AND e.dayOfWeek = :DOW", [parentEventID: parentRecord.eventID, yesOrNo: "N", DOW: "Friday"]);
                                    updateEventRepeatInDatabaseAllShifts = true;
                                }
                                if(parentRecord.eventRepeat[0].indexOf("Fri") == -1 && v.eventRepeat.indexOf("Fri") > -1){
                                    println "SHIFTS NOW REPEAT ON FRIDAY, REMOVING FRIDAY SHIFTS"
                                    Event.executeUpdate("delete Event e where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo AND e.dayOfWeek = :DOW", [parentEventID: parentRecord.eventID, yesOrNo: "N", DOW: "Friday"]);
                                    updateEventRepeatInDatabaseAllShifts = true;

                                    //CREATE ADDITIONAL SHIFTS
                                    aHelper.createRepeatingShifts(eventDate, v, timeZone, orgID, "Friday");
                                }

                                if(parentRecord.eventRepeat[0].indexOf("Sat") >-1 && v.eventRepeat.indexOf("Sat") == -1){
                                    println "SHIFTS NO LONGER REPEAT ON SATURDAY, REMOVING SATURDAY SHIFTS"
                                    Event.executeUpdate("delete Event e where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo AND e.dayOfWeek = :DOW", [parentEventID: parentRecord.eventID, yesOrNo: "N", DOW: "Saturday"]);
                                    updateEventRepeatInDatabaseAllShifts = true;
                                }
                                if(parentRecord.eventRepeat[0].indexOf("Sat") == -1 && v.eventRepeat.indexOf("Sat") > -1){
                                    println "SHIFTS NOW REPEAT ON SATURDAY, REMOVING SATURDAY SHIFTS"
                                    Event.executeUpdate("delete Event e where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo AND e.dayOfWeek = :DOW", [parentEventID: parentRecord.eventID, yesOrNo: "N", DOW: "Saturday"]);
                                    updateEventRepeatInDatabaseAllShifts = true;

                                    //CREATE ADDITIONAL SHIFTS
                                    aHelper.createRepeatingShifts(eventDate, v, timeZone, orgID, "Saturday");
                                }

                                if(updateEventRepeatInDatabaseAllShifts == true){
                                    println "TESTTPHASDLFSKDFLASKDJF;LSDKJFSDJKFL;SDJKF;LJKASD;FLJS;DLFJSLD = " + parentRecord.eventID + " " + v.eventRepeat.getClass()
                                    Event.executeUpdate("update Event e set e.eventRepeat = :eventRepeatChange where e.parentShiftID = :parentEventID" , [eventRepeatChange: v.eventRepeat, parentEventID: parentRecord.eventID]);
                                    //Event.executeUpdate("update Event e set e.eventRepeat = :eventRepeatChange where e.eventID = :eventIDCon " , [eventRepeatChange: v.eventRepeat, eventIDCon: parentRecord.eventID[0]]);
                                    def eventU = Event.findAllByOrgIDAndEventID(session.user.organizationID, parentRecord.eventID);
                                    println eventU.eventRepeat.getClass()
                                    try {
                                        eventU[0].eventRepeat = v.eventRepeat;
                                        eventU[0].save(failOnError: true);
                                    }
                                    catch (Exception e) {
                                        println e;
                                    }

                                }

                            }
                            //Event.executeUpdate("delete Event e where e.parentShiftID = :parentEventID AND e.isParent = :yesOrNo", [parentEventID: parentRecord.eventID, yesOrNo: "N"]);
                        }
                        else if(!parentRecord.repeatEnd[0].equals(v.repeatEnd)){
                            println "EVENT REPEAT END CHANGED FROM " + parentRecord.repeatEnd[0] + " TO " + v.repeatEnd
                        }
                        else if(!parentRecord.repeatEndAfter[0].equals(v.repeatEndAfter)){
                            println "EVENT REPEAT AFTER CHANGED FROM " + parentRecord.repeatEndAfter[0] + " TO " + v.repeatEndAfter
                        }
                        else if(!parentRecord.repeatEndDate[0].equals(v.repeatEndDate)){
                            println "EVENT REPEAT END DATE CHANGED FROM " + parentRecord.repeatEndDate[0] + " TO " + v.repeatEndDate
                        }


                    }



                    if(saveShiftParameter == "allEvents"){
                        println "UPDATING PARENT SHIFT AND ALL CHILD SHIFTS"

                        def events
                        def results
                        if(v.isParent == "Y"){
                            if(params.mobile){
                                events = Event.where {
                                    (orgID == orgID && parentShiftID == v.eventID) || (orgID == orgID && eventID == v.eventID)
                                }
                            }
                            else{
                                events = Event.where {
                                    (orgID == session.user.organizationID && parentShiftID == v.eventID) || (orgID == session.user.organizationID && eventID == v.eventID)
                                }
                            }

                            results = events.list()
                            println results
                        }
                        else if(v.isParent == "N"){
                            if(params.mobile){
                                events = Event.where {
                                    (orgID == orgID && parentShiftID == v.parentShiftID) || (orgID == orgID && eventID == v.parentShiftID)
                                }
                            }
                            else{
                                events = Event.where {
                                    (orgID == session.user.organizationID && parentShiftID == v.parentShiftID) || (orgID == session.user.organizationID && eventID == v.parentShiftID)
                                }
                            }

                            results = events.list()
                            println results
                        }

                        //THIS UPDATE QUERY NEEDS OPTIMIZATION
                        results.each{ result ->
                            //result.eventID = result.eventID;
                            //result.dateOfEvent = result.dateOfEvent; //TODO:CONSTRAIN IN VIEW FROM BEING ABLE TO CHANGE DATES IF UPDATING ALL EVENTS
                            result.notes = result.notes + " " + v.notesString;
                            //result.formattedDate = result.formattedDate;
                            result.shiftType = v.shiftType;
                            result.numberOfShifts = v.numberOfShifts;
                            result.employeesScheduled = v.employeesScheduled;
                            //result.weeklyOrOneTime = result.weeklyOrOneTime;
                            //result.startTime = result.startTime;
                            //result.endTime = result.endTime;
                            //result.unformattedTime = result.unformattedTime;
                            //result.dayOfWeek = new SimpleDateFormat("EEEE").format(result.dateOfEvent);
                            //result.isParent = result.isParent;
                            //result.parentShiftID = result.parentShiftID;
                            //result.seriesStartDate = result.seriesStartDate;
                            //result.sereiesEndDate = result.seriesEndDate;
                            //result.eventRepeat = result.eventRepeat;
                            //result.repeatEnd = result.repeatEnd;
                            //result.repeatEndAfter = result.repeatEndAfter;
                            //result.repeatEndDate = result.repeatEndDate;

//                            try {
//                                result.save(failOnError: true);
//                            }
//                            catch (Exception e) {
//                                println e;
//                            }
                            result.save(flush: true);
                        }

                    }
                    else {
                        //HANDLES DRAG, RESIZE, MODAL, thisEvent Only EDITS
                        println "UPDATING SHIFT: " + v.eventID
                        def updateRecord = Event.findAllByEventID(v.eventID)[0];
                        updateRecord.eventID = v.eventID;
                        updateRecord.dateOfEvent = eventDate;
                        updateRecord.notes = v.notesString;
                        updateRecord.formattedDate = v.formattedDate;
                        updateRecord.shiftType = v.shiftType;
                        updateRecord.numberOfShifts = v.numberOfShifts;
                        updateRecord.employeesScheduled = v.employeesScheduled;
                        updateRecord.weeklyOrOneTime = v.weeklyOrOneTime;
                        updateRecord.startTime = startTime;
                        updateRecord.endTime = endTime;
                        updateRecord.unformattedTime = v.unformattedTime;
                        updateRecord.dayOfWeek = new SimpleDateFormat("EEEE").format(eventDate);
                        updateRecord.isParent = v.isParent;
                        updateRecord.parentShiftID = v.parentShiftID;
                        //updateRecord.seriesStartDate = v.seriesStartDate;
                        //updateRecord.seriesEndDate = v.seriesEndDate;
                        updateRecord.eventRepeat = v.eventRepeat;
                        updateRecord.repeatEnd = v.repeatEnd;
                        updateRecord.repeatEndAfter = v.repeatEndAfter;
                        updateRecord.repeatEndDate = v.repeatEndDate;
                        try {
                            updateRecord.save(failOnError: true);
                        }
                        catch (Exception e) {
                            println e;
                        }
                        updateRecord.save(flush: true);
                    }
                }
            }
            if(v.eventRepeat.indexOf("Yes") > -1 && v.isParent == "Y" && (saveShiftParameter=="oneTime" || params.mobile)){//ONLY HANDLES EVENT REPEAT CHANGES FROM A SINGLE "ONETIME" SHIFT
                println "Creating Repeating Shifts Every Day for One Year"
                Date repeatingEventDate = eventDate
                Calendar c = Calendar.getInstance();
                //Max number of shifts to be created will be 1 year for all cases
                Date endRepeatDate = null;
                c.setTime(repeatingEventDate);
                c.add(Calendar.DATE, 365);
                endRepeatDate = c.getTime();
                def occurrancesEnd = 365;
                def f = 1;
                if(v.repeatEnd == "1 Year"){

                }

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

                lastIDQuery = Event.executeQuery("from Event where orgID = '${orgID}' order by id desc", [offset:0, max:1])
                nextID = lastIDQuery[0].id.toInteger()

                def count = 1;

                while(repeatingEventDate.before(endRepeatDate) && count < occurrancesEnd) {
                    println v.eventRepeat + ";" + daysOfWeekAbrev[repeatingEventDate.getDay()+1] + ";" + repeatingEventDate.getDay()
                    if(v.eventRepeat.indexOf(daysOfWeekAbrev[repeatingEventDate.getDay()+1]) > -1) {
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
                                seriesStartDate: eventDate,
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
                c.add(Calendar.DATE, -1);
                repeatingEventDate = c.getTime();
                Event.executeUpdate("update Event e set e.seriesEndDate = :seriesEndDateChange, e.repeatEndDate = :repeatEndDateChange where e.parentShiftID = :parentEventID" , [seriesEndDateChange: repeatingEventDate, repeatEndDateChange: eventDateFormatted.format(repeatingEventDate), parentEventID: v.eventID]);
                Event.executeUpdate("update Event e set e.seriesEndDate = :seriesEndDateChange, e.repeatEndDate = :repeatEndDateChange where e.eventID = :parentEventID" , [seriesEndDateChange: repeatingEventDate, repeatEndDateChange: eventDateFormatted.format(repeatingEventDate), parentEventID: v.eventID]);

            }
        }
        lastIDQuery = Event.executeQuery("from Event where orgID = '${orgID}' order by id desc", [offset:0, max:1])
        nextID = lastIDQuery[0].id.toInteger()
        nextID++;
        println "LAST ID ============" + renderString + "--" + nextID;
        render renderString + "++" + nextID;
    }

    def saveShiftsbackup(){
        println "Saving Shifts"
        def renderString = ""
        def eventID
        def thisShift
        def thisShiftID
        def orgID = session.user.organizationID;
        def orgRecord = Organization.get(session.user.organizationID);
        def timeZone = orgRecord.timezone.split(",")[0];
        def saveShiftParameter = params.parameter; //parameter = thisEvent, allEvents, oneTime


        if (params.Shifts.length() > 0 && params.Shifts.split(";")[0]) {
            //EVENTID,DAY HHMM - HHMM,SERVER,1,NOTES,weekly/oneTime,01/01/2015,Employee1:Employee2;
            for (def i = 0; i < params.Shifts.split(";").length; i++) {
                thisShift = params.Shifts.split(";")[i].split(",");
                eventID = thisShift[0];
                thisShiftID = eventID.split("-")[0].replaceAll("[^\\d.]", "");
                println "THIS SHIFT: " + thisShift

                Date eventDate = new SimpleDateFormat("MM/dd/yyyy").parse(thisShift[6]);
                Date startTime = new SimpleDateFormat("MM/dd/yyyy HHmm z").parse(thisShift[6] + " " + thisShift[1].substring(4, 8) + " " + timeZone);
                Date endTime = new SimpleDateFormat("MM/dd/yyyy HHmm z").parse(thisShift[6] + " " + thisShift[1].substring(11) + " " + timeZone);

                ////////////////////
                //IF ONE TIME SHIFT
                ////////////////////
                if(thisShift[5] == "oneTime"){
                    //IF EVENT DOES NOT EXIST, CREATE NEW DB ROW
                    if (Event.get(thisShiftID) ==null) {

                        def newRecord = new Event(orgID: orgID,
                                eventID: params.Shifts.split(";")[i].split(",")[0],
                                dateOfEvent: eventDate,
                                notes: params.Shifts.split(";")[i].split(",")[4],
                                formattedDate: params.Shifts.split(";")[i].split(",")[6],
                                shiftType: params.Shifts.split(";")[i].split(",")[2],
                                numberOfShifts: params.Shifts.split(";")[i].split(",")[3],
                                employeesScheduled: params.Shifts.split(";")[i].split(",")[7],
                                weeklyOrOneTime: params.Shifts.split(";")[i].split(",")[5],
                                startTime: startTime,
                                endTime: endTime,
                                dayOfWeek: new SimpleDateFormat("EEEE").format(eventDate),
                                isParent: "N"
                        ).save();

                        //New Events from the View will have incorrect ID numbers.
                        // Get latest ID number from DB and replace the records eventID and add to render string to return to View
                        if (eventID.indexOf("Temp") > -1) {
                            println "Return " + eventID
                            renderString = renderString + eventID + "," + eventID.substring(0, 8) + newRecord.id + ";"
                            newRecord.eventID = eventID.substring(0, 8) + newRecord.id;
                            println newRecord.eventID
                            newRecord.save(flush: true);
                        }
                    }
                    //IF EVENT ALREADY EXISTS, UPDATE
                    else{
                        def updateRecord = Event.get(thisShiftID);
                        updateRecord.eventID = params.Shifts.split(";")[i].split(",")[0];
                        updateRecord.dateOfEvent = eventDate;
                        updateRecord.notes = params.Shifts.split(";")[i].split(",")[4];
                        updateRecord.formattedDate = params.Shifts.split(";")[i].split(",")[6];
                        updateRecord.shiftType = params.Shifts.split(";")[i].split(",")[2];
                        updateRecord.numberOfShifts = params.Shifts.split(";")[i].split(",")[3];
                        updateRecord.employeesScheduled = params.Shifts.split(";")[i].split(",")[7];
                        updateRecord.weeklyOrOneTime = params.Shifts.split(";")[i].split(",")[5];
                        updateRecord.startTime = startTime;
                        updateRecord.endTime = endTime;
                        updateRecord.dayOfWeek = new SimpleDateFormat("EEEE").format(eventDate);
                        updateRecord.isParent = (params.Shifts.split(";")[i].split(",")[5] == "weekly" && (updateRecord.parentShiftID == null || updateRecord.parentShiftID.trim().length() <1)? "Y" : "N" );
                        try {
                            updateRecord.save(failOnError: true);
                        }
                        catch (Exception e) {
                            println e;
                        }
                        updateRecord.save(flush: true);
                    }
                }
                //////////////////////
                //ELSE IF WEEKLY SHIFT
                //////////////////////
                else if(thisShift[5] == "weekly"){
                    println "WEEKLY SHIFT"
                    //IF NEWLY CREATED WEEKLY SHIFT
                    def dbRecordOfShift = Event.get(thisShiftID)
                    if (dbRecordOfShift ==null){
                        println "NEW WEEKLY SHIFT"
                        def newRecord = new Event(orgID: orgID,
                                eventID: params.Shifts.split(";")[i].split(",")[0],
                                dateOfEvent: eventDate,
                                notes: params.Shifts.split(";")[i].split(",")[4],
                                formattedDate: params.Shifts.split(";")[i].split(",")[6],
                                shiftType: params.Shifts.split(";")[i].split(",")[2],
                                numberOfShifts: params.Shifts.split(";")[i].split(",")[3],
                                employeesScheduled: params.Shifts.split(";")[i].split(",")[7],
                                weeklyOrOneTime: params.Shifts.split(";")[i].split(",")[5],
                                startTime: startTime,
                                endTime: endTime,
                                dayOfWeek: new SimpleDateFormat("EEEE").format(eventDate),
                                isParent: "Y"
                        ).save();

                        //New Events from the View will have incorrect ID numbers.
                        // Get latest ID number from DB and replace the records eventID and add to render string to return to View
                        if (eventID.indexOf("Temp") > -1) {
                            println "Return " + eventID
                            renderString = renderString + eventID + "," + eventID.substring(0, 8) + newRecord.id + ";"
                            newRecord.eventID = eventID.substring(0, 8) + newRecord.id;
                            println newRecord.eventID
                            newRecord.save(flush: true);
                        }
                    }

                    //ELSE IF A ONE TIME SHIFT CHANGED TO A WEEKLY SHIFT
                    else if(dbRecordOfShift.weeklyOrOneTime == "oneTime" ){
                        println "ONE TIME SHIFT IN DB"
                        def updateRecord = Event.get(thisShiftID);
                        updateRecord.eventID = params.Shifts.split(";")[i].split(",")[0];
                        updateRecord.dateOfEvent = eventDate;
                        updateRecord.notes = params.Shifts.split(";")[i].split(",")[4];
                        updateRecord.formattedDate = params.Shifts.split(";")[i].split(",")[6];
                        updateRecord.shiftType = params.Shifts.split(";")[i].split(",")[2];
                        updateRecord.numberOfShifts = params.Shifts.split(";")[i].split(",")[3];
                        updateRecord.employeesScheduled = params.Shifts.split(";")[i].split(",")[7];
                        updateRecord.weeklyOrOneTime = params.Shifts.split(";")[i].split(",")[5];
                        updateRecord.startTime = startTime;
                        updateRecord.endTime = endTime;
                        updateRecord.dayOfWeek = new SimpleDateFormat("EEEE").format(eventDate);
                        updateRecord.isParent = "Y";
                        try {
                            updateRecord.save(failOnError: true);
                        }
                        catch (Exception e) {
                            println e;
                        }
                        updateRecord.save(flush: true);
                    }

                    //ELSE IF ALREADY EXISTING WEEKLY SHIFT (PARENT SHIFT AND CHILD SHIFT)
                    else if(dbRecordOfShift.weeklyOrOneTime == "weekly"){


                    }

                }


            }

        }

        //IF ONE TIME SHIFT



        //ELSE IF WEEKLY SHIFT

        render renderString
    }


    def saveSchedule() {
        println "Saving Schedule"
        def intervalBeginDateString = params.beginEndDateString.split(":")[0];
        def intervalBeginMonth = intervalBeginDateString.split("/")[0];
        def intervalBeginDate = intervalBeginDateString.split("/")[1];
        def intervalBeginYear = intervalBeginDateString.split("/")[2];
        def intervalEndDateString = params.beginEndDateString.split(":")[1];
        def intervalEndMonth = intervalEndDateString.split("/")[0];
        def intervalEndDate = intervalEndDateString.split("/")[1];
        def intervalEndYear = intervalEndDateString.split("/")[2];

        def orgRecord = Organization.get(session.user.organizationID)
        orgRecord.schedule = orgRecord.schedule + params.Schedule
        println orgRecord.schedule
        orgRecord.save(flush: true, failOnError: true)
        render 'GOOD'
    }

    def createSchedule() {
        log.warn "In Create Schedules"
        def record = Organization.get(session.user.organizationID)

        def startTimeHour = aHelper.getStartHourOfOrganization(record)
        def startTimeMin = record.startTimeOfWorkDay.split("\\s+")[1]
        def endTimeHour = aHelper.getEndHourOfOrganization(record)
        def endTimeMin = record.endTimeOfWorkDay.split("\\s+")[1]



        def shiftTypeArray = record.shiftTypes.split(";");
        def query = User.where { organizationID == session.user.organizationID }

        def employeeList = query.list();

        def shiftEventArray = "";
        if (record.oneTimeShifts != null) {
            shiftEventArray = record.oneTimeShifts.split(";");
            println shiftEventArray;
        }
        def scheduleArray = "";
        if (record.schedule != null && record.schedule != "null") {
            scheduleArray = record.schedule.split(";");
            println scheduleArray;
        }

        def lastIDQuery;
        def nextID
        lastIDQuery = Event.executeQuery("from Event where orgID = '${session.user.organizationID}' order by id desc", [offset:0, max:1]);
        if(lastIDQuery[0] != null){
            nextID = lastIDQuery[0].id.toInteger()
            nextID++;
        }
        else{
            nextID = 1;
        }



        [pageName            : "Create Schedule", startTimeHour: startTimeHour, startTimeMin: startTimeMin, endTimeHour: endTimeHour, endTimeMin: endTimeMin,
         calendarTimeInterval: record.calendarTimeInterval, shiftTypes: shiftTypeArray, shiftEvents: shiftEventArray, scheduleEvents: scheduleArray, employeeList: employeeList,
        nextID: nextID, orgID:session.user.organizationID]
    }

    def getAvailabilityForDates() {
        println "getAvailabilityForDates"
        println "getShiftAndScheduleForDates"
        println params.beginEndDateString

        def intervalBeginDateString = params.beginEndDateString.split(":")[0];
        intervalBeginDateString = formatDateString(intervalBeginDateString)

        def intervalEndDateString = params.beginEndDateString.split(":")[1];
        intervalEndDateString = formatDateString(intervalEndDateString)

        Date intervalBeginDate1 = new SimpleDateFormat("MM/dd/yyyy").parse(intervalBeginDateString)
        Date intervalEndDate1 = new SimpleDateFormat("MM/dd/yyyy").parse(intervalEndDateString)
        def dateInterval = intervalBeginDate1..intervalEndDate1
        println "formatted " + intervalBeginDate1
        println "formatted " + intervalEndDate1

        Date currentDateString
        def orgRecord = Organization.get(session.user.organizationID);
        def timeZone = orgRecord.timezone.split(",")[0];
        eventTimeFormat.setTimeZone(TimeZone.getTimeZone(timeZone));

        def events = AvailabilityEvent.findAllByOrgIDAndEmployeesScheduledAndDateOfEventBetween(session.user.organizationID, session.user.id, intervalBeginDate1, intervalEndDate1)

        def viewOnlyShifts = ""
        if(params.activeView == "day"){
            events = events + AvailabilityEvent.findAllByOrgIDAndEmployeesScheduledAndWeeklyOrOneTimeAndDateOfEventLessThanAndDayOfWeek(session.user.organizationID, session.user.id, "weekly", intervalBeginDate1, new SimpleDateFormat("EEEE").format(intervalBeginDate1))
            events.removeAll { it.isParent == "N" && (it.dateOfEvent.before(intervalBeginDate1) || it.dateOfEvent.after(intervalEndDate1)) }
            events.each{ event -> events.removeAll{event.parentShiftID == it.eventID}}
        }
        else if(params.activeView == "month"){
            def weeklyEvents = AvailabilityEvent.findAllByOrgIDAndEmployeesScheduledAndWeeklyOrOneTimeAndDateOfEventLessThan(session.user.organizationID, session.user.id, "weekly", intervalBeginDate1)

            events = events +  weeklyEvents
            println "TEEESSSSssssttt" + events
            //generate view only dates for the month selected.

            events.each { event ->
                //will skip weekly child shifts (those that are part of a series but have someone scheduled)
                if(event.weeklyOrOneTime == "weekly" && (event.parentShiftID==null || event.parentShiftID.length() < 1)){
                    Date weeklyEventDate = event.dateOfEvent;
                    Calendar c = Calendar.getInstance();
                    c.setTime(weeklyEventDate);
                    c.add(Calendar.DATE, 7);
                    weeklyEventDate = c.getTime();
                    //increment one week before loop
                    def count = 0;
                    while(weeklyEventDate.before(intervalEndDate1)){
                        count++;
                        if(weeklyEventDate.before(intervalBeginDate1)){
                            //skip if date is before calendar month begin date. no need to generate a view only shift
                        }
                        else{
                            //if there are child shifts for this weekly series and need to check which ones not to generate view only
                            println AvailabilityEvent.findAllByParentShiftIDAndDateOfEvent(event.eventID,weeklyEventDate)
                            if(AvailabilityEvent.findAllByParentShiftIDAndEmployeesScheduledAndDateOfEvent(event.eventID, session.user.id, weeklyEventDate)){

                                println "CHILD SHIFT EXISTS, SKIP"

                            }
                            else{ //there are no child shifts and can generate all view only shifts
                                println "View Only: " + weeklyEventDate

                                viewOnlyShifts = (viewOnlyShifts + event.eventID + "-ViewOnly" + count + ","
                                        + eventDayAbbrev.format(weeklyEventDate) + " " + eventTimeFormat.format(event.startTime) + " - " + eventTimeFormat.format(event.endTime) + ","
                                        + event.shiftType + ","
                                        + event.numberOfShifts + ","
                                        + event.notes + ","
                                        + event.weeklyOrOneTime + ","
                                        + eventDateFormatted.format(weeklyEventDate) + ","
                                        + event.employeesScheduled + ";")
                            }

                        }

                        c.setTime(weeklyEventDate);
                        c.add(Calendar.DATE, 7);
                        weeklyEventDate = c.getTime();
                    }
                }
            }
        }
        else if(params.activeView == "employee"){
            println "Employee View"
        }
        else{
//            events = events +  AvailabilityEvent.findAllByOrgIDAndWeeklyOrOneTimeAndDateOfEventLessThan(session.user.organizationID, "weekly", intervalBeginDate1)
//
//            events.removeAll { it.isParent == "N" && (it.dateOfEvent.before(intervalBeginDate1) || it.dateOfEvent.after(intervalEndDate1)) }
//            println events
//            events.each{ event ->
//                events.removeAll{event.parentShiftID == it.eventID}
//            }
        }

        println "AvailabilityEvents: " +  events

        println "OBJECT TYPE: " + events.getClass()
//        def json = new groovy.json.JsonBuilder()
//        def result1 = json{
//            events{
//                eventID "sdkfls"
//            }
//        }
//        def shiftsString =""
//        events.each{ event ->
//            shiftsString = shiftsString + event.eventID + ":" + event.shiftType
//
//        }

        println "JSON: " + (events as JSON)
        response.setContentType("application/json")
        render events as JSON


    }

    def getShiftAndScheduleForDatesMobile() {
        println "getShiftAndScheduleForDates"
        println params.beginEndDateString

        def intervalBeginDateString = params.beginEndDateString.split(":")[0];
        intervalBeginDateString = formatDateString(intervalBeginDateString)

        def intervalEndDateString = params.beginEndDateString.split(":")[1];
        intervalEndDateString = formatDateString(intervalEndDateString)

        Date intervalBeginDate1 = new SimpleDateFormat("MM/dd/yyyy").parse(intervalBeginDateString)
        Date intervalEndDate1 = new SimpleDateFormat("MM/dd/yyyy").parse(intervalEndDateString)
        def dateInterval = intervalBeginDate1..intervalEndDate1
        println "formatted " + intervalBeginDate1
        println "formatted " + intervalEndDate1

        Date currentDateString
        def orgRecord = Organization.get(params.orgID);
        def timeZone = orgRecord.timezone.split(",")[0];
        eventTimeFormat.setTimeZone(TimeZone.getTimeZone(timeZone));

        def events = Event.findAllByOrgIDAndDateOfEventBetween(params.orgID, intervalBeginDate1, intervalEndDate1)

        def viewOnlyShifts = ""
        if(params.activeView == "day"){
            events = events + Event.findAllByOrgIDAndWeeklyOrOneTimeAndDateOfEventLessThanAndDayOfWeek(params.orgID, "weekly", intervalBeginDate1, new SimpleDateFormat("EEEE").format(intervalBeginDate1))
            events.removeAll { it.isParent == "N" && (it.dateOfEvent.before(intervalBeginDate1) || it.dateOfEvent.after(intervalEndDate1)) }
            events.each{ event -> events.removeAll{event.parentShiftID == it.eventID}}
        }
        else if(params.activeView == "month"){
            def weeklyEvents = Event.findAllByOrgIDAndWeeklyOrOneTimeAndDateOfEventLessThan(params.orgID, "weekly", intervalBeginDate1)

            events = events +  weeklyEvents
            println "TEEESSSSssssttt" + events
            //generate view only dates for the month selected.

            events.each { event ->
                //will skip weekly child shifts (those that are part of a series but have someone scheduled)
                if(event.weeklyOrOneTime == "weekly" && (event.parentShiftID==null || event.parentShiftID.length() < 1)){
                    Date weeklyEventDate = event.dateOfEvent;
                    Calendar c = Calendar.getInstance();
                    c.setTime(weeklyEventDate);
                    c.add(Calendar.DATE, 7);
                    weeklyEventDate = c.getTime();
                    //increment one week before loop
                    def count = 0;
                    while(weeklyEventDate.before(intervalEndDate1)){
                        count++;
                        if(weeklyEventDate.before(intervalBeginDate1)){
                            //skip if date is before calendar month begin date. no need to generate a view only shift
                        }
                        else{
                            //if there are child shifts for this weekly series and need to check which ones not to generate view only
                            println Event.findAllByParentShiftIDAndDateOfEvent(event.eventID,weeklyEventDate)
                            if(Event.findAllByParentShiftIDAndDateOfEvent(event.eventID,weeklyEventDate)){

                                println "CHILD SHIFT EXISTS, SKIP"

                            }
                            else{ //there are no child shifts and can generate all view only shifts
                                println "View Only: " + weeklyEventDate

                                viewOnlyShifts = (viewOnlyShifts + event.eventID + "-ViewOnly" + count + ","
                                        + eventDayAbbrev.format(weeklyEventDate) + " " + eventTimeFormat.format(event.startTime) + " - " + eventTimeFormat.format(event.endTime) + ","
                                        + event.shiftType + ","
                                        + event.numberOfShifts + ","
                                        + event.notes + ","
                                        + event.weeklyOrOneTime + ","
                                        + eventDateFormatted.format(weeklyEventDate) + ","
                                        + event.employeesScheduled + ";")
                            }

                        }

                        c.setTime(weeklyEventDate);
                        c.add(Calendar.DATE, 7);
                        weeklyEventDate = c.getTime();
                    }
                }
            }
        }
        else if(params.activeView == "employee"){
            println "Employee View"
        }
        else{
//            events = events +  Event.findAllByOrgIDAndWeeklyOrOneTimeAndDateOfEventLessThan(session.user.organizationID, "weekly", intervalBeginDate1)
//
//            events.removeAll { it.isParent == "N" && (it.dateOfEvent.before(intervalBeginDate1) || it.dateOfEvent.after(intervalEndDate1)) }
//            println events
//            events.each{ event ->
//                events.removeAll{event.parentShiftID == it.eventID}
//            }
        }

        println "Events: " +  events

        println "OBJECT TYPE: " + events.getClass()
//        def json = new groovy.json.JsonBuilder()
//        def result1 = json{
//            events{
//                eventID "sdkfls"
//            }
//        }
//        def shiftsString =""
//        events.each{ event ->
//            shiftsString = shiftsString + event.eventID + ":" + event.shiftType
//
//        }

        println "JSON: " + (events as JSON)
        def s = "JSON: " + (events as JSON)
//        render events as JSON
        withFormat {
            json { render events as JSON }
        }

    }


    def getShiftAndScheduleForDates() {
        println "getShiftAndScheduleForDates"
        println params.beginEndDateString

        def intervalBeginDateString = params.beginEndDateString.split(":")[0];
        intervalBeginDateString = formatDateString(intervalBeginDateString)

        def intervalEndDateString = params.beginEndDateString.split(":")[1];
        intervalEndDateString = formatDateString(intervalEndDateString)

        Date intervalBeginDate1 = new SimpleDateFormat("MM/dd/yyyy").parse(intervalBeginDateString)
        Date intervalEndDate1 = new SimpleDateFormat("MM/dd/yyyy").parse(intervalEndDateString)
        def dateInterval = intervalBeginDate1..intervalEndDate1
        println "formatted " + intervalBeginDate1
        println "formatted " + intervalEndDate1

        Date currentDateString
        def orgRecord = Organization.get(session.user.organizationID);
        def timeZone = orgRecord.timezone.split(",")[0];
        eventTimeFormat.setTimeZone(TimeZone.getTimeZone(timeZone));

        def events = Event.findAllByOrgIDAndDateOfEventBetween(session.user.organizationID, intervalBeginDate1, intervalEndDate1)

        def viewOnlyShifts = ""
        if(params.activeView == "day"){
            events = events + Event.findAllByOrgIDAndWeeklyOrOneTimeAndDateOfEventLessThanAndDayOfWeek(session.user.organizationID, "weekly", intervalBeginDate1, new SimpleDateFormat("EEEE").format(intervalBeginDate1))
            events.removeAll { it.isParent == "N" && (it.dateOfEvent.before(intervalBeginDate1) || it.dateOfEvent.after(intervalEndDate1)) }
            events.each{ event -> events.removeAll{event.parentShiftID == it.eventID}}
        }
        else if(params.activeView == "month"){
            def weeklyEvents = Event.findAllByOrgIDAndWeeklyOrOneTimeAndDateOfEventLessThan(session.user.organizationID, "weekly", intervalBeginDate1)

            events = events +  weeklyEvents
            println "TEEESSSSssssttt" + events
            //generate view only dates for the month selected.

            events.each { event ->
                //will skip weekly child shifts (those that are part of a series but have someone scheduled)
                if(event.weeklyOrOneTime == "weekly" && (event.parentShiftID==null || event.parentShiftID.length() < 1)){
                    Date weeklyEventDate = event.dateOfEvent;
                    Calendar c = Calendar.getInstance();
                    c.setTime(weeklyEventDate);
                    c.add(Calendar.DATE, 7);
                    weeklyEventDate = c.getTime();
                    //increment one week before loop
                    def count = 0;
                    while(weeklyEventDate.before(intervalEndDate1)){
                        count++;
                        if(weeklyEventDate.before(intervalBeginDate1)){
                            //skip if date is before calendar month begin date. no need to generate a view only shift
                        }
                        else{
                            //if there are child shifts for this weekly series and need to check which ones not to generate view only
                            println Event.findAllByParentShiftIDAndDateOfEvent(event.eventID,weeklyEventDate)
                            if(Event.findAllByParentShiftIDAndDateOfEvent(event.eventID,weeklyEventDate)){

                                println "CHILD SHIFT EXISTS, SKIP"

                            }
                            else{ //there are no child shifts and can generate all view only shifts
                                println "View Only: " + weeklyEventDate

                                viewOnlyShifts = (viewOnlyShifts + event.eventID + "-ViewOnly" + count + ","
                                        + eventDayAbbrev.format(weeklyEventDate) + " " + eventTimeFormat.format(event.startTime) + " - " + eventTimeFormat.format(event.endTime) + ","
                                        + event.shiftType + ","
                                        + event.numberOfShifts + ","
                                        + event.notes + ","
                                        + event.weeklyOrOneTime + ","
                                        + eventDateFormatted.format(weeklyEventDate) + ","
                                        + event.employeesScheduled + ";")
                            }

                        }

                        c.setTime(weeklyEventDate);
                        c.add(Calendar.DATE, 7);
                        weeklyEventDate = c.getTime();
                    }
                }
            }
        }
        else if(params.activeView == "employee"){
            println "Employee View"
        }
        else{
//            events = events +  Event.findAllByOrgIDAndWeeklyOrOneTimeAndDateOfEventLessThan(session.user.organizationID, "weekly", intervalBeginDate1)
//
//            events.removeAll { it.isParent == "N" && (it.dateOfEvent.before(intervalBeginDate1) || it.dateOfEvent.after(intervalEndDate1)) }
//            println events
//            events.each{ event ->
//                events.removeAll{event.parentShiftID == it.eventID}
//            }
        }

        println "Events: " +  events

        println "OBJECT TYPE: " + events.getClass()
//        def json = new groovy.json.JsonBuilder()
//        def result1 = json{
//            events{
//                eventID "sdkfls"
//            }
//        }
//        def shiftsString =""
//        events.each{ event ->
//            shiftsString = shiftsString + event.eventID + ":" + event.shiftType
//
//        }

        println "JSON: " + (events as JSON)
        render events as JSON
    }

    def getShiftAndScheduleForDatesbackup() {
        println "getShiftAndScheduleForDates"
        println params.beginEndDateString

        def intervalBeginDateString = params.beginEndDateString.split(":")[0];
        intervalBeginDateString = formatDateString(intervalBeginDateString)

        def intervalEndDateString = params.beginEndDateString.split(":")[1];
        intervalEndDateString = formatDateString(intervalEndDateString)

        Date intervalBeginDate1 = new SimpleDateFormat("MM/dd/yyyy").parse(intervalBeginDateString)
        Date intervalEndDate1 = new SimpleDateFormat("MM/dd/yyyy").parse(intervalEndDateString)
        def dateInterval = intervalBeginDate1..intervalEndDate1
        println "formatted " + intervalBeginDate1
        println "formatted " + intervalEndDate1

        Date currentDateString

        def record = Organization.get(session.user.organizationID)
        def shiftEventArray = null;
        def currentEventMonth = "";
        def currentEventDate = "";
        def currentEventYear = "";
        def updatedShiftEventArrayString = "";
        if (record.oneTimeShifts != null && record.oneTimeShifts.length() > 0) {
            shiftEventArray = record.oneTimeShifts;
        }
        if (record.weeklyShifts != null && record.weeklyShifts.length() > 0) {
            if (shiftEventArray == null) {
                shiftEventArray = "";
            }
            shiftEventArray = shiftEventArray + record.weeklyShifts;
        }

        if (shiftEventArray != null) {
            shiftEventArray = shiftEventArray.split(";")
            for (def i = 0; i < shiftEventArray.length; i++) {
                println "Shift Event " + (shiftEventArray[i].length() > 0);

                currentDateString = new SimpleDateFormat("MM/dd/yyyy").parse(shiftEventArray[i].split(",")[6]);


                if ((shiftEventArray[i].split(",")[5].equals("weekly")) && (currentDateString <= intervalEndDate1)) {
                    //println "Current Date String: " + currentDateString + "<=" + intervalEndDate1 + " "+ (currentDateString <= intervalEndDate1);
                    updatedShiftEventArrayString = updatedShiftEventArrayString + shiftEventArray[i] + ";";
                } else if (shiftEventArray[i].split(",")[5].equals("oneTime") && (currentDateString in dateInterval)) {
                    updatedShiftEventArrayString = updatedShiftEventArrayString + shiftEventArray[i] + ";";
                }
            }
            //println "Updated = " + updatedShiftEventArrayString;
        }




        def scheduleArray = "";
        def updatedScheduleArrayString = "";
        if (record.schedule != null && record.schedule != "null") {
            scheduleArray = record.schedule.split(";");
            //println scheduleArray;
            for (def i = 0; i < scheduleArray.length; i++) {
                println record.schedule != null
                currentDateString = new SimpleDateFormat("MM/dd/yyyy").parse(scheduleArray[i].split(",")[7])


                if ((currentDateString in dateInterval)) {
                    println currentDateString
                    println(currentDateString in dateInterval)

                    updatedScheduleArrayString = updatedScheduleArrayString + scheduleArray[i] + ";";
                }
            }
            //println "Updated = " + updatedScheduleArrayString;

        }
        println updatedShiftEventArrayString + ":spaceForGetShiftAndScheduleForDates:" + updatedScheduleArrayString
        //println updatedScheduleArrayString
        render updatedShiftEventArrayString + ":spaceForGetShiftAndScheduleForDates:" + updatedScheduleArrayString
    }


    def generateSchedule() {
        log.warn "In Generate Schedule "
        def record = Organization.get(session.user.organizationID)

        def startTimeHour = aHelper.getStartHourOfOrganization(record)
        def startTimeMin = record.startTimeOfWorkDay.split("\\s+")[1]
        def endTimeHour = aHelper.getEndHourOfOrganization(record)
        def endTimeMin = record.endTimeOfWorkDay.split("\\s+")[1]


        def shiftTypeArray = record.shiftTypes.split(",");

        def shiftEventArray = "";
        if (record.oneTimeShifts != null) {
            shiftEventArray = record.oneTimeShifts.split(";");
            println shiftEventArray;
        }

        [pageName            : "Generate Schedule", startTimeHour: startTimeHour, startTimeMin: startTimeMin, endTimeHour: endTimeHour, endTimeMin: endTimeMin,
         calendarTimeInterval: record.calendarTimeInterval, shiftTypes: shiftTypeArray, shiftEvents: shiftEventArray]
    }

    //Options
    //Default: gives priority to employees who have limited availability. So they will be scheduled first to ensure all employees have sufficient shifts
    //Best Employees, Best Shifts: Gives priority to the better employees for the more in demand shifts
    //Employees Not to work together: Set rules for certain employees who shouldn't work together.

    def getGenerateSchedule() {
        log.info "Generating a Schedule"
        println params.UserFilledShifts

        //Get Date interval for schedule generation
        def dateInterval = aHelper.getDateInterval(params.beginEndDateString.split(":")[0], params.beginEndDateString.split(":")[1])
        def intervalBeginDateString = params.beginEndDateString.split(":")[0];
        intervalBeginDateString = formatDateString(intervalBeginDateString)
        def intervalEndDateString = params.beginEndDateString.split(":")[1];
        intervalEndDateString = formatDateString(intervalEndDateString)
        Date intervalBeginDate1 = new SimpleDateFormat("MM/dd/yyyy").parse(intervalBeginDateString)
        Date intervalEndDate1 = new SimpleDateFormat("MM/dd/yyyy").parse(intervalEndDateString)

        //Get organizations record
        def record = Organization.get(session.user.organizationID)

        //get organizations shifts in Date Interval
        //def shiftEventArray = aHelper.getShiftsInDateInterval(record, dateInterval)
        def shiftEventArray = Event.findAllByOrgIDAndDateOfEventBetween(session.user.organizationID, intervalBeginDate1, intervalEndDate1)
        println "# of Shifts: " + shiftEventArray.size();
        println "Shifts: " + shiftEventArray

        //get shifts that have been filled already by the user in the web interface
        def userFilledShiftsArray = params.UserFilledShifts.split(";")

        //Get all employees availability
        def query = User.where { organizationID == session.user.organizationID }
        def employeeList = query.list();
        println "Employee List: " + employeeList

        //Analyze employees which employees are available for which shifts.
        //availableEmployeesForShifts = [:] //Shift Details : List of Employees available to work
        //employeeUsabilityMap = [:] //EmployeeID : Number of Shifts they are Available for
        def (availableEmployeesForShifts, employeeUsabilityMap) = aHelper.getMapOfEmployeesAvailableForAllShifts(shiftEventArray, employeeList,
                session.user.organizationID, intervalBeginDate1, intervalEndDate1)


        println "Shifts and Available Employees: "
        availableEmployeesForShifts.each { entry ->
            println "Shift: $entry.key Available Employees: $entry.value"
        }
        //Number of shifts each employee is available for.
        println "Number of Shifts Each Employee is Available For:"
        employeeUsabilityMap = employeeUsabilityMap.sort { it.value }
        employeeUsabilityMap.each { entry ->
            println "EmployeeID: $entry.key Num: $entry.value"
        }
        /*
        What goes into Creating a schedule?
        1. Know Which Shifts you're filling
        2. Iterate over shifts
             1. check if this shift has been filled by user
                 -if filled than add it to final schedule and move to next shift
             2. if scheduling priority it least available employees first start filling with first in employeeusabilitymap
             3.
        3. Iterate over employees to fill

        - how much randomness?
        - EAch shift has a list of employees eligible to work it, what determines order of priority?
             - overall availability, least available staffed first?
             -

         */


        def (finalSchedule, tempEmployeeUsabilityMap) = aHelper.createSchedule(availableEmployeesForShifts, employeeUsabilityMap, userFilledShiftsArray, employeeList, params.scheduleOptions)
        employeeUsabilityMap = tempEmployeeUsabilityMap
        employeeUsabilityMap.each { entry ->
            println "EmployeeID: $entry.key Num: $entry.value"
        }

        def returnString = ""
        finalSchedule.each { entry ->
            println "Shift: $entry.key Employee: $entry.value"
            returnString = returnString + entry.key + "=" + entry.value + ";"
        }
        returnString = returnString + "***"
        for (int i = 0; i < employeeList.size(); i++) {
            //println "Availability for " + employeeList[i] + ": " + employeeList[i].availability
            returnString = returnString + employeeList[i].id + "," + employeeList[i].firstName + "," + employeeList[i].lastName + ";"


        }

        render returnString

    }

    def formatDateString(def dateString) {

        def month = dateString.split("/")[0];
        def date = dateString.split("/")[1];
        def year = dateString.split("/")[2];

        if (month.length() == 1) {
            month = "0" + month;
        }
        if (date.length() == 1) {
            date = "0" + date;
        }
        return "" + month + "/" + date + "/" + year
    }

    def showPicture() {
        println "Retrieving PICTURE"
        def record = User.get(params.id)
        response.outputStream << record.imagePayload // write the image to the outputstream
        response.outputStream.flush()
    }

    def employeeSetupAndInvite() {
        println "Setting Up Employees and Invitations"

        println params

        def duplicateEmailString = "";

        def employeeArray = params.employeeList.split(":EOL:")
        def firstName
        def lastName
        def email
        def phone
        def role
        employeeArray.each{ employee ->
            def employeeDetails = employee.split(":SPACE:")
            firstName = employeeDetails[0];
            lastName = employeeDetails[1];
            email = employeeDetails[2];
            phone = employeeDetails[3];
            role = employeeDetails[4];

            def emailDuplicates = User.findAllByEmail(email)
            if(emailDuplicates.size() > 0){
                println emailDuplicates.size() + " already exist"
                duplicateEmailString = duplicateEmailString + email + ","

                //send emails to duplicate email members to join this org.
//                sendMail {
//                    to email
//                    subject "Hello Fred"
//                    body 'How are you?'
//                }
            }
            else{
                try{
                    User u = new pickupmyshift.User(employeeRole:role, email:email, contactEmail:email, phoneNumber: phone, password: "",
                            level:"User", organizationID:session.user.organizationID, firstName: firstName, lastName: lastName, tempUser:"Y",
                            availabilityEvents: "", imagePath: "", facebookUserID: "", birthday: "")
                    u.save(flush: true, failOnError: true)
                }
                catch(Exception e){
                    println e

                }

                def orgRecord = Organization.get(session.user.organizationID)
                sendMail {
                    to "paikchris@gmail.com"
                    subject "Register with PICKUPMYSHIFT"
                    html "${firstName}, ${session.user.firstName} ${session.user.lastName} has invited you to join " +
                            "${orgRecord.name} on PICKUPMYSHIFT.com." + "<br />" +
                            "<a href='" + "${g.createLink(absolute: true, uri:"/application/invitationAccept?email=" + email + "&fname=" + firstName +"&lname=" + lastName + "&phone=" + phone + "&role=" + role + "&id=" + session.user.organizationID + "&pin=" + orgRecord.orgPin)}" + "'>" +
                            "Click here to Register</a> <br />" +
                            "<br /> <br />" +
                            "REGISTRATION DETAILS<br />" +
                            "EMAIL: ${email} <br />" +
                            "ORGANIZATION ID: ${session.user.organizationID} <br />" +
                            "ORGANIZATION PIN: ${orgRecord.orgPin}"
                }

            }
        }


//        if(duplicateEmailString.length() > 0){
//            render duplicateEmailString;
//        }

        render "good"
    }

    def invitationAccept(){
        println "INVITATION ACCEPT"
        println params

        [phone: params.phone, email: params.email, firstName: params.fname, lastName: params.lname, role: params.role,
        orgID: params.id, orgPin:params.pin]


    }

}
