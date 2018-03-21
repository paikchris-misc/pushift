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

$(document).ready(function () {
    initializeViewButtons();
    $(window).on('resize', function (e) {
        tdHeight = $(window).height()/monthRows;
        $('.calendarCell').height(tdHeight);

        dayRows = $(".dayViewTimeColumn").length;
        tdHeight = $(window).height()/dayRows;
        console.log(tdHeight);
        $('.dayViewTR').height(tdHeight);
    });

});

function initializeViewButtons() {
    $(".viewType").css({'display': 'none'});
    $("#weekView").css({'display': ''});
    $("#wrapper").on('click', '#dayViewButton', function (e) {
        $(".viewType").css({'display': 'none'});
        $("#dayView").css({'display': ''});
        $("#monthViewButton").removeClass("active");
        $("#weekViewButton").removeClass("active");
        $("#employeeViewButton").removeClass("active");
        $("#dayViewButton").toggleClass("active");
        initializeDayCalendar();
    });
    $("#wrapper").on('click', '#weekViewButton', function (e) {
        $(".viewType").css({'display': 'none'});
        $("#weekView").css({'display': ''});
        $("#monthViewButton").removeClass("active");
        $("#dayViewButton").removeClass("active");
        $("#employeeViewButton").removeClass("active");
        $("#weekViewButton").toggleClass("active");
    });
    $("#wrapper").on('click', '#monthViewButton', function (e) {
        $(".viewType").css({'display': 'none'});
        $("#monthView").css({'display': ''});
        $("#dayViewButton").removeClass("active");
        $("#weekViewButton").removeClass("active");
        $("#employeeViewButton").removeClass("active");
        $("#monthViewButton").toggleClass("active");
        initializeMonthCalendar();
    });
    $("#wrapper").on('click', '#employeeViewButton', function (e) {
        $(".viewType").css({'display': 'none'});
        $("#employeeView").css({'display': ''});
        $("#monthViewButton").removeClass("active");
        $("#weekViewButton").removeClass("active");
        $("#dayViewButton").removeClass("active");
        $("#employeeViewButton").toggleClass("active");
    });
}

function initializeMonthCalendar(){
    fillMonthlyCalendar();

}
function initializeDayCalendar(){
    month = chosenDate.getMonth() + 1;
    date = chosenDate.getDate();
    year = chosenDate.getYear() + 1900;

    //Set Correct Day and Date
    $("#dateLabelDayView").html(daysOfWeek[chosenDate.getDay()+1]);
    $("#hiddenDateDayView").html(chosenDate.getDate());
    $("#hiddenDateDayView").show();

    //Fill Shift and Schedule info


    //adjust height of rows
    dayRows = $(".dayViewTimeColumn").length;
    tdHeight = $(window).height()/dayRows;
    $('.dayViewTR').height(tdHeight);
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
            if(tempDate.getDay()+1 == d){
                if(tempDate.getMonth() == chosenDate.getMonth()){
                    if(chosenDate.getDate() == tempDate.getDate()){//if today
                        htmlString = htmlString + "<td class='calendarCell today'>" + "<div class='calendarTDDate'>" + tempDate.getDate() + "</div>" + "</td>";

                    }
                    else {
                        htmlString = htmlString + "<td class='calendarCell'>" + "<div class='calendarTDDate'>" + tempDate.getDate() + "</div>" + "</td>";
                    }
                }
                else{
                    htmlString = htmlString + "<td class='calendarCell diffMonth'>" + "<div class='calendarTDDate'>" + tempDate.getDate() + "</div>" + "</td>";
                }
                if(d!=7){
                    i++;
                }
            }

            else{
                if(tempDate.getMonth() == new Date(new Date().setDate(tempDate.getDate()-(firstDayOfMonth.getDay()+1-d))).getMonth()){
                    htmlString = htmlString + "<td class='calendarCell'>" + "<div class='calendarTDDate'>" + new Date(new Date().setDate(tempDate.getDate()-(firstDayOfMonth.getDay()+1-d))).getDate() + "</div>" + "</td>";
                }
                else{
                    htmlString = htmlString + "<td class='calendarCell diffMonth'>" + "<div class='calendarTDDate'>" + new Date(new Date().setDate(tempDate.getDate()-(firstDayOfMonth.getDay()+1-d))).getDate() + "</div>" + "</td>";
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
