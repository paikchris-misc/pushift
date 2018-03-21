$(document).ready(function () {
    var employeeArray = [];
    var newRow = $("#employeeList").html();

    $(".phoneInput").mask("(999) 999-9999");

    $("body").on('focusout', '.firstNameInput, .lastNameInput, .emailInput, .phoneInput', function (e) {
        if ($(this).val().length < 1) {
            $(this).closest(".form-group").addClass("has-error");
        }
        else {
            $(this).closest(".form-group").removeClass("has-error");
        }
    });

    $("body").on('change', '.emailInput', function (e) {
        //console.log (this.value);
        var re = /\S+@\S+\.\S+/;
        //console.log( re.test(this.value) );
        if (re.test(this.value)) {
            $(this).closest(".form-group").removeClass("has-error");
        }
        else {
            //console.log( $(this).closest(".form-group").addClass("has-error"));
            $(this).closest(".form-group").addClass("has-error");
        }


        //CHECK FOR DUPLICATE EMAILS
        var compareEmail = $(this).val();
        var count = 0;

        $('.emailInput').each(function (index) {
            //console.log($(this).val());
            //console.log(this);

            if ($(this).val() == compareEmail) {
                count++;
                console.log(count);
            }
            else {

            }
        });
        if (count > 1 || !re.test(this.value)) {
            $(this).closest(".form-group").addClass("has-error");
        }
        else {
            $(this).closest(".form-group").removeClass("has-error");
        }


    });

    $("body").on('click', '.addEmployeeButton', function (e) {
        //alert();
        employeeArray = [];
        $("#employeeList").append(newRow);
        for (var i = 0; i < $(".employeeRow").length; i++) {
            //console.log($(".employeeRoleInput").eq(i).val());
            //console.log($(".employeeRoleInput").eq(i).css('background-color'));
        }


        //for(var i=0; i<$(".employeeRoleInput").length; i++ ){
        //    console.log(roleArray[i]);
        //    $(".employeeRoleInput").eq(i).val(roleArray[i]);
        //    $(".employeeRoleInput").eq(i).siblings(".colorBox").find(".selectedShiftColor").css('background-color', shiftColorArray[i]);
        //}
    });

    $("body").on('click', '.removeEmployeeButton', function (e) {
        if ($(".removeEmployeeButton").length > 1) {

            //for(var i=0; i<$(".employeeRoleInput").length; i++ ){
            //    console.log(roleArray[i]);
            //    $(".employeeRoleInput").eq(i).val(roleArray[i]);
            //    $(".employeeRoleInput").eq(i).siblings(".colorBox").find(".selectedShiftColor").css('background-color', shiftColorArray[i]);
            //}
            $(this).closest(".employeeRow").remove();


        }

    });

    $("body").on('click', '#submitButton', function (e) {
        if (validate()) {
            buildEmployeeList();
        }
        else {
            alert("errors in form");
        }

    });
});

function validate() {
    var returnString = true;
    $('.employeeList').each(function (index) {
        if ($(this).val().length < 1) {
            $(this).closest(".form-group").addClass("has-error");
            returnString = false;
        }
        else {
            $(this).closest(".form-group").removeClass("has-error");
        }
    });


    $('.emailInput').each(function(index) {
        var compareEmail = $(this).val();
        var count = 0;

        $('.emailInput').each(function (index) {
            //console.log($(this).val());
            //console.log(this);

            if ($(this).val() == compareEmail) {
                count++;
                console.log(count);
            }
            else {

            }
        });
        if (count > 1) {
            $(this).closest(".form-group").addClass("has-error");
            returnString = false;
        }
        else {
            $(this).closest(".form-group").removeClass("has-error");
        }
    });

    return returnString;


}

function buildEmployeeList() {
    //console.log($(":input").serializeArray());
    var employeeListString = "";
    $('.employeeList').each(function (index) {
        //console.log($(this).val());
        //console.log(this);
        if ($(this).hasClass("employeeRoleSelect")) {
            //console.log("this is phone");
            //console.log($(this).parent().next().children(".employeeRoleSelect").val());
            //employeeListString = employeeListString + $(this).parent().next().children(".employeeRoleSelect").val() ;
            employeeListString = employeeListString + $(this).val() + ":EOL:"
        }
        else {
            employeeListString = employeeListString + $(this).val() + ":SPACE:"
        }
    });

    console.log(employeeListString);
    var formData = new FormData();
    formData.append('employeeList', employeeListString);
    // now post a new XHR request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/pickupmyshift/application/employeeSetupAndInvite');
    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log('all done: ' + xhr.status);
            if ($("#facebookIDHidden").html().length > 0) {
                alert(registrationType)
                if (registrationType == "createOrg") {
                    window.location.href = "/pickupmyshift/auth/login?facebookID=" + $("#facebookIDHidden").html() + "&newOrgRegistration=true";
                }
                else if (registrationType == "joinOrg") {
                    window.location.href = "/pickupmyshift/auth/login?facebookID=" + $("#facebookIDHidden").html();

                }
            }
            else if ($("#passwordInput").val() != null) {
                if (registrationType == "createOrg") {
                    window.location.href = "/pickupmyshift/auth/login?email=" + $("#emailInput").val() + "&password=" + $("#passwordInput").val() + "&newOrgRegistration=true";
                }
                else if (registrationType == "joinOrg") {
                    window.location.href = "/pickupmyshift/auth/login?email=" + $("#emailInput").val() + "&password=" + $("#passwordInput").val();

                }
            }

        } else {
            console.log('Something went terribly wrong...');
        }
    };

    xhr.send(formData);

}