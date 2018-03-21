
$( document ).ready(function() {
    $("#phoneNumberInput").mask("(999) 999-9999");


    //fill Birthday Info
    var birthdayString = $("#hiddenBirthday").html();

    $("#birthdayMonthSelect").val(birthdayString.split("/")[0]);
    $("#birthdayDaySelect").val(birthdayString.split("/")[1]);
    $("#birthdayYearSelect").val(birthdayString.split("/")[2]);

    //fill Employee Role
    $("#jobRoleSelect").val($("#hiddenJobRole").html());

    //fill Company State
    $("#stateSelect").val($("#hiddenState").html());

    //fill company start time
    var startTimeString = $("#hiddenStartTime").html();
    $("#startTimeSelect").val(startTimeString.split(" ")[0]);
    $("#startTimeSelectMin").val(startTimeString.split(" ")[1]);
    $("#startTimeSelectAMPM").val(startTimeString.split(" ")[2]);

    //fill company end time
    var endTimeString = $("#hiddenEndTime").html();
    $("#endTimeSelect").val(endTimeString.split(" ")[0]);
    $("#endTimeSelectMin").val(endTimeString.split(" ")[1]);
    $("#endTimeSelectAMPM").val(endTimeString.split(" ")[2]);


    $(".mainContentContainerAPP" ).on('change', 'input, select', function(e) {
        //alert();
        validate();
    });

    $(".mainContentContainerAPP" ).on('click', '.saveSettingsButton', function(e) {
        // now post a new XHR request

        if(validate()){
            //alert();
            //var picsrc = $("#profilePicturePreview").prop('src');
            //var picData = JSON.stringify(picsrc);
            //console.log($("#pictureInput").value);
            //
            //alert();
            var files = document.getElementById('pictureInput').files;
            console.log(files);
            var formData = new FormData();

            if (files.length > 0) {
                if (!files[0].name.match(/\.(jpg|jpeg|png|gif)$/)) {
                    //alert('not an image');
                    return;
                }
                else {
                    for (var i = 0; i < files.length; i++) {
                        console.log(files[i]);
                        formData.append('pictureData', files[i]);
                    }
                }
            }
            else {
                if($("#originalProfilePicURL").html() != $("#profilePicturePreview").prop('src'))
                    formData.append('pictureURL', $("#profilePicturePreview").prop('src'));
            }



            //alert($("#firstNameInput").prop("value"));
            formData.append('firstName', $("#firstNameInput").val());
            formData.append('lastName', $("#lastNameInput").val());
            formData.append('phoneNumber', $("#phoneNumberInput").val());
            formData.append('contactEmail', $("#contactEmailInput").val());
            formData.append('birthdayMonth', $("#birthdayMonthSelect").val());
            formData.append('birthdayDay', $("#birthdayDaySelect").val());
            formData.append('birthdayYear', $("#birthdayYearSelect").val());
            formData.append('facebookID', $("#facebookIDHidden").html());

            //ADD TIMEZONE SETTINGS
            //ADD SHIFT TYPES AND COLORS
            //ADD ORG PIN
            if ($("#facebookIDHidden").html().length > 0) {
            }
            else {
                //verify passwords match
                if($("#passwordInput").val() == $("#verifyPasswordInput").val()){
                    formData.append('password', $("#passwordInput").val());
                }

            }

            formData.append('userRole', $("#jobRoleSelect").val());
            if ($("#organizationNameInput").length) {
                formData.append('orgName', $("#organizationNameInput").val());
                formData.append('orgPinSet', $("#orgPinSetInput").val());
                formData.append('address1', $("#address1Input").val());
                formData.append('address2', $("#address2Input").val());
                formData.append('city', $("#cityInput").val());
                formData.append('state', $("#stateSelect").val());
                formData.append('zipcode', $("#zipcodeInput").val());
                var startTimeFormatted = $("#startTimeSelect").val() + " " + $("#startTimeSelectMin").val() + " " + $("#startTimeSelectAMPM").val()
                formData.append('startTime', startTimeFormatted);
                var endTimeFormatted = $("#endTimeSelect").val() + " " + $("#endTimeSelectMin").val() + " " + $("#endTimeSelectAMPM").val()
                formData.append('endTime', endTimeFormatted);
                var employeeRolesFormatted = $("#employeeRolesInput").val().replace(/ /g,'')
                formData.append('employeeRoles', employeeRolesFormatted);
            }

            // now post a new XHR request
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/pickupmyshift/settings/updateSettings');
            xhr.onload = function () {
                if (xhr.status === 200) {
                    console.log('all done: ' + xhr.status);
                    window.location.href = "/pickupmyshift/settings/";


                } else {
                    console.log('Something went terribly wrong...');
                }
            };

            xhr.send(formData);
        }

    });
});

function validate() {
        //validate Basic Info Inputs
        var returnString = true;
        $(".has-error").removeClass("has-error");
        if ($("#firstNameInput").val() < 1) {
            $("#firstNameInput").closest(".form-group").addClass("has-error");
            returnString = false;
        }
        if ($("#lastNameInput").val() < 1) {
            $("#lastNameInput").closest(".form-group").addClass("has-error");
            returnString = false;
        }
        if (!validatePhone($("#phoneNumberInput").val().toString())) {
            $("#phoneNumberInput").closest(".form-group").addClass("has-error");
            returnString = false;
        }
        if ($("#birthdayMonthSelect").val() == "0" || $("#birthdayDaySelect").val() == "00") {
            $("#birthdayMonthSelect").closest(".form-group").addClass("has-error");
            returnString = false;
        }
        var re = /\S+@\S+\.\S+/;
        if (!re.test($("#contactEmailInput").val())) {
            $("#contactEmailInput").closest(".form-group").addClass("has-error");
            returnString = false;
        }
        if ($("#facebookIDHidden").html().length > 0) {

        }
        else{
            if ($("#passwordInput").val() < 1) {
                $("#passwordInput").closest(".form-group").addClass("has-error");
                returnString = false;
            }
            if ($("#verifyPasswordInput").val() < 1) {
                $("#verifyPasswordInput").closest(".form-group").addClass("has-error");
                returnString = false;
            }
        }



            //alert("createORGGG");
            //alert(returnString);
            if ($("#organizationNameInput").length && $("#organizationNameInput").val().length < 1) {
                $("#organizationNameInput").closest(".form-group").addClass("has-error");
                returnString = false;
            }

            if ($("#orgPinSetInput").length && ($("#orgPinSetInput").val() < 4 || !(/^\d+$/.test($("#orgPinSetInput").val()))) ) {
                $("#orgPinSetInput").closest(".form-group").addClass("has-error");
                returnString = false;
            }
    //alert(returnString);
            if ($("#address1Input").length && $("#address1Input").val().length < 1) {
                $("#address1Input").closest(".form-group").addClass("has-error");
                returnString = false;
            }
            if ($("#cityInput").length && $("#cityInput").val().length < 1) {
                $("#cityInput").closest(".form-group").addClass("has-error");
                returnString = false;
            }
            if ($("#stateSelect").length && $("#stateSelect").val() == "invalid") {
                $("#stateSelect").closest(".form-group").addClass("has-error");
                returnString = false;
            }
            if ($("#zipcodeInput").length && $("#zipcodeInput").val().length < 5) {
                $("#zipcodeInput").closest(".form-group").addClass("has-error");
                returnString = false;
            }
            if ($("#startTimeSelect").length && $("#startTimeSelect").val() == "invalid") {
                $("#startTimeSelect").closest(".form-group").addClass("has-error");
                returnString = false;
            }
            if ($("#endTimeSelect").length && $("#endTimeSelect").val() == "invalid") {
                $("#endTimeSelect").closest(".form-group").addClass("has-error");
                returnString = false;
            }
            if ($("#employeeRolesInput").length && $("#employeeRolesInput").val().length < 1) {
                $("#employeeRolesInput").closest(".form-group").addClass("has-error");
                returnString = false;
            }





        return returnString;
    };

function validatePhone(inputtxt)
{
    //alert(inputtxt);
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if((inputtxt.match(phoneno)))
    {
        return true;
    }
    else
    {
        //alert("message");
        return false;
    }
}


//function formats phone numbers like 111-111-1111 during input:
function formatPhone(e, f) {
    var len = f.value.length;
    var key = getKey(e);
    if (key > 47 && key < 58 && len < 13) {
        if (len == 3)f.value = f.value + '-'
        else if (len == 7)f.value = f.value + '-'
        else f.value = f.value;
        //see if final number is correct:
        var rex = /^[d -]+$/
        if (f.value.search(rex) == -1) {
            //alert("Error! Please enter your 10 digit phone number. Dashes will be inserted for you automatically. Only numbers are allowed.");
            f.value = f.value.substring(0, len - 1);
        }

    }
    else {
        f.value = f.value.substring(0, len - 1);
    }
}

//getKey function used in above phoneNo function
function getKey(e) {
    var code;
    if (!e) var e = window.event;
    if (e.keyCode) code = e.keyCode;
    else if (e.which) code = e.which;
    return code
    //    return String.fromCharCode(code);
}



