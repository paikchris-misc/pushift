$(document).ready(function () {
    var curStepNum;
    var registrationType;




    var rightNow = new Date();
    var offset = String(String(rightNow).split("(")[1]).split(")")[0];
    $("#timezoneSelect").val(offset);
   //alert( $("#timezoneSelect option[value='" + offset + "']").text() );
    ///////////////////////////////////////////////////

    //Setup Birthday Information from Facebook
    var birthdayString = $("#hiddenBirthday").html()
    $("#birthdayMonthSelect option[value=" + birthdayString.split("/")[0] + "]").prop('selected', 'selected');
    $("#birthdayDaySelect option[value=" + birthdayString.split("/")[1] + "]").prop('selected', 'selected');
    $("#birthdayYearSelect option[value=" + birthdayString.split("/")[2] + "]").prop('selected', 'selected');

    $("#phoneNumberInput").mask("(999) 999-9999");

    //$(".intro").on('keyup', '#phoneNumberInput', function (e) {
    //    formatPhone(e,this);
    //});
    //document.getElementById('pictureInput').onchange = function (event) {
    //    // `this` refers to the element the event fired upon
    //    var files = this.files;
    //};
    $(".intro").on('click', '#joinOrgButton', function (e) {
        $("#registrationContainer").css({'display': ''});

        $("#joinOrgContainer").css({'display': ''});
        $("#createOrgContainer").css({'display': 'none'});


        $("#userInfoContainer").css({'display': ''});

        $("#buttonRow").css({'display': 'none'});
        $("#bottomButtonRow").css({'display': ''});


    });
    $(".intro").on('click', '#createOrgButton', function (e) {
        $("#registrationContainer").css({'display': ''});
        $("#joinOrgContainer").css({'display': 'none'});
        $("#createOrgContainer").css({'display': ''});

        $("#userInfoContainer").css({'display': ''});

        $("#buttonRow").css({'display': 'none'});
        $("#bottomButtonRow").css({'display': ''});
    });

    //VALIDATE NAME INPUTS
    $(".intro").on('focusout', '#firstNameInput, #lastNameInput, #phoneNumberInput, #passwordInput, #verifyPasswordInput, ' +
        ' #orgIDInput, #orgPinInput, #organizationNameInput,' +
        '#address1Input, #cityInput, #zipcodeInput', function (e) {
        if (this.value.length < 1) {
            $(this).closest(".form-group").addClass("has-error");
        }
        else {
            $(this).closest(".form-group").removeClass("has-error");
        }
    });
    $(".intro").on('change', '.employeeRoleInput', function (e) {
        roleArray = [];
        for(var i=0; i<$(".employeeRoleInput").length; i++ ){
            //console.log($(".employeeRoleInput").eq(i).val());
            //console.log($(".employeeRoleInput").eq(i).css('background-color'));
            if($(".employeeRoleInput").eq(i).val().trim().length > 0){
                roleArray.push($(".employeeRoleInput").eq(i).val());
                shiftColorArray.push($(".employeeRoleInput").eq(i).css('background-color'));
            }

        }

        if(roleArray.length <1){
            //alert("Please provide at least one Employee Role");
            $("#employeeRoleFormGroup").addClass("has-error");

        }
        else{
            $("#employeeRoleFormGroup").removeClass("has-error");
        }
    });

    $(".intro").on('change', '#firstNameInput, #lastNameInput, #passwordInput', function (e) {
        if (this.value.length < 1) {
            $(this).closest(".form-group").addClass("has-error");
        }
        else {
            $(this).closest(".form-group").removeClass("has-error");
        }
    });

    $(".intro").on('focusout', '#jobRoleSelect', function (e) {
        if ($(this).val() == "invalid") {
            $(this).closest(".form-group").addClass("has-error");
        }
        else {
            $(this).closest(".form-group").removeClass("has-error");
        }
    });
    $(".intro").on('focusout', '#jobRoleSelect, #stateSelect, #startTimeSelect, #startTimeSelectMin, #startTimeSelectAMPM, ' +
        '#endTimeSelect, #endTimeSelectMin, #endTimeSelectAMPM', function (e) {
        if ($(this).val() == "invalid") {
            $(this).closest(".form-group").addClass("has-error");
        }
        else {
            $(this).closest(".form-group").removeClass("has-error");
        }
    });


    $(".intro").on('change', '#passwordInput, #verifyPasswordInput', function (e) {
        if ($("#passwordInput").val() != $("#verifyPasswordInput").val() ) {
            $("#passwordInputFormGroup").addClass("has-error");
            $("#verifyPasswordInputFormGroup").addClass("has-error");
        }
        else {
            $("#passwordInputFormGroup").removeClass("has-error");
            $("#verifyPasswordInputFormGroup").removeClass("has-error");
        }
    });
    //VALIDATE BIRTHDAY
    var bmonthChanged=false;
    var bdayChanged=false;
    var byearChanged=false;
    $(".intro").on('focusout', '#birthdayMonthSelect, #birthdayDaySelect', function (e) {
        if(this.id == "birthdayMonthSelect"){
            bmonthChanged = true;
        }
        else if(this.id =="birthdayDaySelect"){
            bdayChanged=true;
        }

        if(bmonthChanged && bdayChanged){
            if ($("#birthdayMonthSelect").val() == "0" || $("#birthdayDaySelect").val() == "00") {
                $(this).closest(".form-group").addClass("has-error");
            }
            else {
                $(this).closest(".form-group").removeClass("has-error");
            }
        }
    });
    $(".intro").on('change', '#birthdayMonthSelect, #birthdayDaySelect', function (e) {
        //alert(this.value);
        if(bmonthChanged && bdayChanged){
            if ($("#birthdayMonthSelect").val() == "0" || $("#birthdayDaySelect").val() == "00") {
                $(this).closest(".form-group").addClass("has-error");
            }
            else {
                $(this).closest(".form-group").removeClass("has-error");
            }
        }
        else{
            if(this.id == "birthdayMonthSelect"){
                bmonthChanged = true;
            }
            else if(this.id =="birthdayDaySelect"){
                bdayChanged=true;
            }
        }


    });

    $(".intro").on('change, focusout', '#orgPinSetInput,  #zipcodeInput, #phoneNumberInput', function (e) {

        if(this.id == "orgPinSetInput"){
            if (this.value.length < 4) {
                $(this).closest(".form-group").addClass("has-error");
            }
            else {
                if((/^\d+$/.test($("#"+this.id).val()))){
                    $(this).closest(".form-group").removeClass("has-error");
                }
                else{
                    $(this).closest(".form-group").addClass("has-error");
                }
            }
        }
        else if(this.id == "zipcodeInput"){
            if (this.value.length < 5) {
                $(this).closest(".form-group").addClass("has-error");
            }
            else {
                if((/^\d+$/.test($("#"+this.id).val()))){
                    $(this).closest(".form-group").removeClass("has-error");
                }
                else{
                    $(this).closest(".form-group").addClass("has-error");
                }
            }
        }
        else if(this.id == "phoneNumberInput"){
            //alert(this.value);
            if (validatePhone(this.value.toString())) {
                $(this).closest(".form-group").removeClass("has-error");
            }
            else {
                $(this).closest(".form-group").addClass("has-error");

            }
            //alert(validatePhone(this.value));
        }




    });


    $(".intro").on('change, focusout', '#emailInput', function (e) {
        console.log (this.value);
        var re = /\S+@\S+\.\S+/;
        //console.log( re.test(this.value) );
        if (re.test(this.value)) {
            $(this).closest(".form-group").removeClass("has-error");
        }
        else {
            //console.log( $(this).closest(".form-group").addClass("has-error"));
            $(this).closest(".form-group").addClass("has-error");
        }
    });
    $(".intro").on('change', '#orgIDInput, #orgPinInput', function (e) {
        $("#orgIDInput").closest(".form-group").removeClass("has-success");
        $("#orgPinInput").closest(".form-group").removeClass("has-success");
    });

    //VERIFY ORGANIZATION NUMBER AND PIN
    $(".intro").on('click', '#verifyOrgPin', function (e) {
        validatePin();
    });
    //function to detect change to Picture
    $(".fileinput").on("change.bs.fileinput", function (e) {
        var files = document.getElementById('pictureInput').files;
        if (!files[0].name.match(/\.(jpg|jpeg|png|gif)$/)) {
            //alert('not an image');
            $(".fileinput-preview").html(".jpg, .jpeg, .png, .gif");
            files = null;
            $(this).closest(".form-group").addClass("has-error");
        }
        else {
        }
    });

    $(".intro").on('click', '#createOrgButton, #joinOrgButton', function (e) {
        //alert(this.id);
        if (this.id == "createOrgButton") {
            registrationType = "createOrg";
        }
        else if (this.id == "joinOrgButton") {
            registrationType = "joinOrg";
        }
    });


    $(".intro").on('click', '.shiftColor', function (e) {
        console.log($(this).closest(".selectedShiftColor"));
        $(this).closest(".btn-group").find(".selectedShiftColor").css('background-color', $(this).css('background-color'));

    });

    var newRow = $("#employeeRoleFormGroup").html();
    newRow = newRow.replace("Employee Roles", "");
    newRow = newRow.replace("(check the box for your role)", "");

    var roleArray = [];
    var shiftColorArray =[];
    $(".intro").on('click', '.addEmployeeRole', function (e) {
        roleArray=[];
        shiftColorArray =[];
        var htmlString= $("#employeeRoleFormGroup").html() + newRow
        for(var i=0; i<$(".employeeRoleInput").length; i++ ){
            //console.log($(".employeeRoleInput").eq(i).val());
            //console.log($(".employeeRoleInput").eq(i).css('background-color'));
            roleArray.push($(".employeeRoleInput").eq(i).val());
            shiftColorArray.push($(".employeeRoleInput").eq(i).css('background-color'));
        }
        $("#employeeRoleFormGroup").html(htmlString);

        for(var i=0; i<$(".employeeRoleInput").length; i++ ){
            console.log(roleArray[i]);
            $(".employeeRoleInput").eq(i).val(roleArray[i]);
            $(".employeeRoleInput").eq(i).siblings(".colorBox").find(".selectedShiftColor").css('background-color', shiftColorArray[i]);
        }



    });


    $(".intro").on('click', '.removeEmployeeRole', function (e) {
        if($(".removeEmployeeRole").length >1){

            $(this).parent().parent().prev().remove();
            $(this).parent().parent().remove();

            var labelString = $("#employeeRoleFormGroup").children(".control-label").eq(0).html();
            console.log(labelString);
            if(labelString.length < 10){
                $("#employeeRoleFormGroup").children(".control-label").eq(0).html("Employee Roles <br/> (check the box for your role)")
            }

        }

    });

    $(".intro").on('click', '#backButton', function (e) {

        $("#buttonRow").css({'display': ''});
        $("#registrationContainer").css({'display': 'none'});

    });



    $(".intro").on('click', '#submitButton', function (e) {

        if(validate()){
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
                formData.append('pictureURL', $("#profilePicturePreview").prop('src'));
            }

            //alert($("#firstNameInput").prop("value"));
            formData.append('firstName', $("#firstNameInput").val());
            formData.append('lastName', $("#lastNameInput").val());
            formData.append('phoneNumber', $("#phoneNumberInput").val());
            formData.append('email', $("#emailInput").val());
            formData.append('birthdayMonth', $("#birthdayMonthSelect").val());
            formData.append('birthdayDay', $("#birthdayDaySelect").val());
            formData.append('birthdayYear', $("#birthdayYearSelect").val());
            formData.append('facebookID', $("#facebookIDHidden").html());
            if ($("#facebookIDHidden").html().length > 0) {
            }
            else {
                //verify passwords match
                if($("#passwordInput").val() == $("#verifyPasswordInput").val()){
                    formData.append('password', $("#passwordInput").val());
                }

            }

            formData.append('userRole', $("#jobRoleSelect").val());
            formData.append('registrationType', registrationType);
            if (registrationType == "createOrg") {
                formData.append('orgName', $("#organizationNameInput").val());
                formData.append('orgPinSet', $("#orgPinSetInput").val());
                formData.append('address1', $("#address1Input").val());
                formData.append('address2', $("#address2Input").val());
                formData.append('city', $("#cityInput").val());
                formData.append('state', $("#stateSelect").val());
                formData.append('zipcode', $("#zipcodeInput").val());
                formData.append('timezone', $("#timezoneSelect option[value='" + offset + "']").text());

                //ADD TIMEZONE TO REGISTRATION PAGE
                //ADD SHIFT TYPES AND COLORS
                var startTimeFormatted = $("#startTimeSelect").val() + " " + $("#startTimeSelectMin").val() + " " + $("#startTimeSelectAMPM").val()
                formData.append('startTime', startTimeFormatted);
                var endTimeFormatted = $("#endTimeSelect").val() + " " + $("#endTimeSelectMin").val() + " " + $("#endTimeSelectAMPM").val()
                formData.append('endTime', endTimeFormatted);


                //EMPLOYEE ROLE FORMATTING
                roleArray=[];
                shiftColorArray =[];
                var employeeRolesFormatted ="";
                for(var i=0; i<$(".employeeRoleInput").length; i++ ){

                    console.log($(".employeeRoleInput").eq(i).val());
                    console.log($(".selectedShiftColor").eq(i).css('background-color'));
                    roleArray.push($(".employeeRoleInput").eq(i).val());
                    shiftColorArray.push($(".selectedShiftColor").eq(i).css('background-color'));
                    employeeRolesFormatted = employeeRolesFormatted + $(".employeeRoleInput").eq(i).val().replace(/;/g , "") + ":color:" + $(".selectedShiftColor").eq(i).css('background-color') + ";";
                }
                //////////////////////////
                //alert(employeeRolesFormatted);
                formData.append('employeeRoles', employeeRolesFormatted);
            }
            else if (registrationType == "joinOrg") {
                formData.append('orgID', $("#orgIDInput").val());
            }

            // now post a new XHR request
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/pickupmyshift/auth/registerNewUser');
            xhr.onload = function () {
                if (xhr.status === 200) {
                    console.log('all done: ' + xhr.status);
                    if ($("#facebookIDHidden").html().length > 0) {
                        alert(registrationType)
                        if(registrationType == "createOrg"){
                            window.location.href = "/pickupmyshift/auth/login?facebookID=" + $("#facebookIDHidden").html() + "&newOrgRegistration=true";
                        }
                        else if(registrationType == "joinOrg"){
                            window.location.href = "/pickupmyshift/auth/login?facebookID=" + $("#facebookIDHidden").html();

                        }
                    }
                    else if ($("#passwordInput").val() != null) {
                        if(registrationType == "createOrg"){
                            window.location.href = "/pickupmyshift/auth/login?email=" + $("#emailInput").val() + "&password=" + $("#passwordInput").val() + "&newOrgRegistration=true";
                        }
                        else if(registrationType == "joinOrg"){
                            window.location.href = "/pickupmyshift/auth/login?email=" + $("#emailInput").val() + "&password=" + $("#passwordInput").val();

                        }
                    }

                } else {
                    console.log('Something went terribly wrong...');
                }
            };

            xhr.send(formData);
        }

    });


    function validate() {
        //validate Basic Info Inputs
        var returnString = true;

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
        if (!re.test($("#emailInput").val())) {
            $("#emailInput").closest(".form-group").addClass("has-error");
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



        if (registrationType == "createOrg") {
            //alert("createORGGG");
           //alert(returnString);
            if ($("#organizationNameInput").val().length < 1) {
                $("#organizationNameInput").closest(".form-group").addClass("has-error");
                returnString = false;
            }
            if ($("#orgPinSetInput").val() < 4 || !(/^\d+$/.test($("#orgPinSetInput").val())) ) {
                $("#orgPinSetInput").closest(".form-group").addClass("has-error");
                returnString = false;
            }
            if ($("#address1Input").val().length < 1) {
                $("#address1Input").closest(".form-group").addClass("has-error");
                returnString = false;
            }
            if ($("#cityInput").val().length < 1) {
                $("#cityInput").closest(".form-group").addClass("has-error");
                returnString = false;
            }
            if ($("#stateSelect").val() == "invalid") {
                $("#stateSelect").closest(".form-group").addClass("has-error");
                returnString = false;
            }
            if ($("#zipcodeInput").val().length < 5) {
                $("#zipcodeInput").closest(".form-group").addClass("has-error");
                returnString = false;
            }
            if ($("#startTimeSelect").val() == "invalid") {
                $("#startTimeSelect").closest(".form-group").addClass("has-error");
                returnString = false;
            }
            if ($("#endTimeSelect").val() == "invalid") {
                $("#endTimeSelect").closest(".form-group").addClass("has-error");
                returnString = false;
            }
            //if ($(".employeeRolesInput").val().length < 1) {
            //    $("#employeeRolesInput").closest(".form-group").addClass("has-error");
            //    returnString = false;
            //}
            if($("input:checkbox:checked.myRoleCheckbox").length <1){
                //alert("Please select one role for yourself");
                //alert($('input:checkbox:checked.myRoleCheckbox').length);
                $("div.checkbox").css('background-color', "#a94442");
                returnstring = false;
            }
            else{
                $("div.checkbox").css('background-color', "");
            }

            roleArray = [];
            for(var i=0; i<$(".employeeRoleInput").length; i++ ){
                //console.log($(".employeeRoleInput").eq(i).val());
                //console.log($(".employeeRoleInput").eq(i).css('background-color'));
                if($(".employeeRoleInput").eq(i).val().trim().length > 0){
                    roleArray.push($(".employeeRoleInput").eq(i).val());
                    shiftColorArray.push($(".employeeRoleInput").eq(i).css('background-color'));
                }

            }

            if(roleArray.length <1){
                //alert("Please provide at least one Employee Role");
                $("#employeeRoleFormGroup").addClass("has-error");
                returnstring = false;

            }

        }
        else if (registrationType == "joinOrg") {
           //alert(returnString);
            if ($("#jobRoleSelect").val() == "invalid") {
                $("#jobRoleSelect").closest(".form-group").addClass("has-error");
                returnString = false;
            }
        }


       //alert(returnString);
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



    function validatePin() {
        var orgIDString = $("#orgIDInput").val();
        var orgPinString = $("#orgPinInput").val();
        $.ajax({
            method: "POST",
            url: "/pickupmyshift/auth/verifyOrg",
            data: {orgID: orgIDString, orgPin: orgPinString}
        })
            .done(function (msg) {
               //alert(msg);
                if (msg.split(":/:")[0] == "true") {

                    $("#orgIDInput").closest(".form-group").addClass("has-success");
                    $("#orgPinInput").closest(".form-group").addClass("has-success");
                    $("#orgIDInput").closest(".form-group").removeClass("has-error");
                    $("#orgPinInput").closest(".form-group").removeClass("has-error");
                    $("#organizationName").html(msg.split(":/:")[1]);
                    $("#organizationNameFormGroup").css({'display': ''});

                        var jobRoleString = "<option value='invalid'>" + "-" + "</option>";
                        for (var i = 0; i < msg.split(":/:")[2].split(";").length; i++) {
                            var role = msg.split(":/:")[2].split(";")[i].split(":color:")[0];
                            if(role.trim().length > 0){
                                jobRoleString = jobRoleString + "<option value=" + role + ">" + role + "</option>";
                            }
                        }
                        $("#jobRoleSelect").html(jobRoleString);
                        $("#jobRoleFormGroup").css({'display': ''});


                    var passedValidation = false;
                    if ($("#step1NextButton").html() == "Verify") {
                        $("#step1NextButton").html("Next");
                    }
                    else if ($("#step1NextButton").html() == "Next") {
                        //validate();

                        passedValidation = validate();
                        //alert(passedValidation);
                    }
                    if (passedValidation) {

                        $(".form-group").removeClass("has-error");
                        for (var i = 0; i < curInputs.length; i++) {
                            if (!curInputs[i].validity.valid) {
                                isValid = false;
                                $(curInputs[i]).closest(".form-group").addClass("has-error");
                            }
                        }

                        if (isValid)
                            nextStepWizard.removeAttr('disabled').trigger('click');

                    }


                }
                else if (msg.split(":/:")[0] == "false") {
                    $("#orgIDInput").closest(".form-group").addClass("has-error");
                    $("#orgPinInput").closest(".form-group").addClass("has-error");
                    $("#orgIDInput").closest(".form-group").removeClass("has-success");
                    $("#orgPinInput").closest(".form-group").removeClass("has-success");
                    return false;
                }
            });

    }
});