$(document).ready(function () {

    function fb_login(){
        console.log("working")
        FB.login(function(response) {

            if (response.status === 'connected') {
                console.log('Welcome!  Fetching your information.... ');
                console.log(response); // dump complete info
                access_token = response.authResponse.accessToken; //get access token
                user_id = response.authResponse.userID; //get FB UID

                var picture
                FB.api('/me/picture?width=200&height=200&redirect=0 ', function(response) {
                    picture = response.data.url;
                    picture = picture.replace(/&/g,"::AMP::")
                    console.log(response);
                });
                FB.api('/me?fields=name,first_name,last_name,email,birthday', function(response) {
                    user_email = response.email; //get user email
                    first_name = response.first_name;
                    last_name = response.last_name;
                    birthday = response.birthday;
                    // you can store this data into your database
                    console.log(response);
                    console.log("testing");
                    $.ajax({
                        method: "POST",
                        url: "/pickupmyshift/auth/isRegistered",
                        data: {facebookID: user_id, access_token: access_token, user_email: user_email, first_name: first_name, last_name:last_name, birthday:birthday }
                    })
                        .done(function (msg) {
                            //alert( "Data Saved: " + msg );
                            console.log(msg.split(";")[0]);
                            //alert(picture);
                            if(msg.split(";")[0] == 'false'){
                                window.location.href = "/pickupmyshift/auth/register?facebookID="+user_id+"&user_email="+user_email+
                                    "&first_name="+first_name+"&last_name="+last_name+"&birthday="+birthday+"&picture="+picture;
                            }
                            else if(msg.split(";")[0] == 'true'){
                                console.log("redirecting");
                                window.location.href = "/pickupmyshift/auth/login?facebookID="+user_id;
                            }
                        });
                });

                //
            } else if (response.status === 'not_authorized') {
                console.log(response); // dump complete info
                // The person is logged into Facebook, but not your app.
                document.getElementById('status').innerHTML = 'Please log ' +
                    'into this app.';
            } else {
                console.log(response); // dump complete info
                // The person is not logged into Facebook, so we're not sure if
                // they are logged into this app or not.
                document.getElementById('status').innerHTML = 'Please log ' +
                    'into Facebook.';
            }

        }, {
            scope: 'public_profile,email,user_friends,user_birthday'
        });
    }
    (function() {
        var e = document.createElement('script');
        e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
        e.async = true;
        //document.getElementById('fb-root').appendChild(e);
    }());

    function fb_pullInfo(){
        console.log("pulling facebook information")
        FB.login(function(response) {

            if (response.status === 'connected') {
                console.log('Welcome!  Fetching your information.... ');
                console.log(response); // dump complete info
                access_token = response.authResponse.accessToken; //get access token
                user_id = response.authResponse.userID; //get FB UID

                var picture
                var rawPictureURL
                FB.api('/me/picture?width=200&height=200&redirect=0 ', function(response) {
                    rawPictureURL = response.data.url;
                    picture = rawPictureURL.replace(/&/g,"::AMP::")
                    console.log(response);
                });
                FB.api('/me?fields=name,first_name,last_name,email,birthday', function(response) {
                    user_email = response.email; //get user email
                    first_name = response.first_name;
                    last_name = response.last_name;
                    birthday = response.birthday;
                    // you can store this data into your database
                    console.log(response);
                    console.log("testing");
                    $.ajax({
                        method: "POST",
                        url: "/pickupmyshift/auth/isRegistered",
                        data: {facebookID: user_id, access_token: access_token, user_email: user_email, first_name: first_name, last_name:last_name, birthday:birthday }
                    })
                        .done(function (msg) {
                            //alert( "Data Saved: " + msg );
                            console.log(msg.split(";")[0]);
                            //alert(picture);
                            if(msg.split(";")[0] == 'false'){
                                //fill out registration form with facebook info
                                $("#facebookIDHidden").html(user_id);
                                $("#firstNameInput").val(first_name);
                                $("#lastNameInput").val(last_name);
                                $("#phoneNumberInput").closest(".form-group").addClass("has-error");
                                $("#emailInput").val(user_email);
                                $("#firstNameInput").val(first_name);
                                $("#hiddenBirthday").html(birthday);
                                var birthdayString = $("#hiddenBirthday").html()
                                $("#birthdayMonthSelect option[value=" + birthdayString.split("/")[0] + "]").prop('selected','selected');
                                $("#birthdayDaySelect option[value=" + birthdayString.split("/")[1] +"]").prop('selected','selected');
                                $("#birthdayYearSelect option[value=" + birthdayString.split("/")[2] +"]").prop('selected','selected');
                                $("#profilePicturePreview").attr("src", rawPictureURL);
                                $("#passwordInputFormGroup").css({'display':'none'});
                                $("#verifyPasswordInputFormGroup").css({'display':'none'});
                                //$("#pulledProfilePic").attr("src", rawPictureURL);
                                var tempHTML = $("#pulledProfileName").html()
                               //alert(tempHTML);
                                $("#pulledProfileName").html(tempHTML + "Logged in as " + first_name +" "+ last_name);
                                $("#pulledProfilePreviewDiv").css({'display':''});
                                $("#registrationFacebookPullDiv").css({'display':'none'});



                            }
                            else if(msg.split(";")[0] == 'true'){
                                console.log("redirecting");
                                window.location.href = "/pickupmyshift/auth/login?facebookID="+user_id;
                            }
                        });
                });

                //
            } else if (response.status === 'not_authorized') {
                console.log(response); // dump complete info
                // The person is logged into Facebook, but not your app.
                document.getElementById('status').innerHTML = 'Please log ' +
                    'into this app.';
            } else {
                console.log(response); // dump complete info
                // The person is not logged into Facebook, so we're not sure if
                // they are logged into this app or not.
                document.getElementById('status').innerHTML = 'Please log ' +
                    'into Facebook.';
            }

        }, {
            scope: 'public_profile,email,user_friends,user_birthday'
        });
    }
    (function() {
        var e = document.createElement('script');
        e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
        e.async = true;
        //document.getElementById('fb-root').appendChild(e);
    }());


    $("body").on('click', '#loginFacebook', function (e) {
        //alert("clicked");
        fb_login();
    });

    $("body").on('click', '#pullFacebookInfo', function (e) {
       //alert("clicked");
        fb_pullInfo();
    });
});