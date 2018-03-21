<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Register with PICKUPMYSHIFT</title>

    <!-- Bootstrap Core CSS -->
    <link href="${request.contextPath}/Application/css/bootstrap.min.css" rel="stylesheet" type="text/css">

    <!-- JASNY CSS -->
    <link href="${request.contextPath}/Application/css/jasny-bootstrap.min.css"
          rel="stylesheet">

    <!-- Fonts -->
    <link href="${request.contextPath}/Application/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="${request.contextPath}/Application/css/nivo-lightbox.css" rel="stylesheet" />
    <link href="${request.contextPath}/Application/css/nivo-lightbox-theme/default/default.css" rel="stylesheet" type="text/css" />
    <link href="${request.contextPath}/Application/css/animate.css" rel="stylesheet" />
    <!-- Squad theme CSS -->
    <link href="${request.contextPath}/Application/css/style.css" rel="stylesheet">
    <link href="${request.contextPath}/Application/color/default.css" rel="stylesheet">

</head>

<body data-spy="scroll" style="background-image: url(${request.contextPath}/img/img-bg.jpg); background-attachment:fixed; background-size: cover;">
<script>
    // This is called with the results from from FB.getLoginStatus().
    function statusChangeCallback(response) {
        console.log('statusChangeCallback');
        console.log(response);
        // The response object is returned with a status field that lets the
        // app know the current login status of the person.
        // Full docs on the response object can be found in the documentation
        // for FB.getLoginStatus().
        if (response.status === 'connected') {
            // Logged into your app and Facebook.
            testAPI();
        } else if (response.status === 'not_authorized') {
            // The person is logged into Facebook, but not your app.
            document.getElementById('status').innerHTML = 'Please log ' +
                    'into this app.';
        } else {
            // The person is not logged into Facebook, so we're not sure if
            // they are logged into this app or not.
            document.getElementById('status').innerHTML = 'Please log ' +
                    'into Facebook.';
        }
    }

    // This function is called when someone finishes with the Login
    // Button.  See the onlogin handler attached to it in the sample
    // code below.
    function checkLoginState() {
        FB.getLoginStatus(function(response) {
            statusChangeCallback(response);
        });
    }

    window.fbAsyncInit = function() {

        FB.init({
            appId      : '518000101712140',
            cookie     : true,  // enable cookies to allow the server to access
                                // the session
            //channelUrl : '//http://104.131.41.129:8080/channel.html',
            xfbml      : true,  // parse social plugins on this page
            version    : 'v2.5' // use version 2.2
        });

        // Now that we've initialized the JavaScript SDK, we call
        // FB.getLoginStatus().  This function gets the state of the
        // person visiting this page and can return one of three states to
        // the callback you provide.  They can be:
        //
        // 1. Logged into your app ('connected')
        // 2. Logged into Facebook, but not your app ('not_authorized')
        // 3. Not logged into Facebook and can't tell if they are logged into
        //    your app or not.
        //
        // These three cases are handled in the callback function.

        FB.getLoginStatus(function(response) {
            statusChangeCallback(response);
        });

    };

    // Load the SDK asynchronously

    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    // Here we run a very simple test of the Graph API after login is
    // successful.  See statusChangeCallback() for when this call is made.
    function testAPI() {
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/me?fields=name,email', function(response) {
            console.log('Successful login for: ' + response.name);
            console.log(response);
            document.getElementById('status').innerHTML =
                    'Thanks for logging in, ' + response.name + '!';
        });
    }
</script>

<div class="container">
    <ul id="gn-menu" class="gn-menu-main">
        <li class="gn-trigger">
            <a class="gn-icon gn-icon-menu"><span>Menu</span></a>
            <nav class="gn-menu-wrapper">
                <div class="gn-scroller">
                    <ul class="gn-menu">
                        %{--<li class="gn-search-item">--}%
                        %{--<input placeholder="Search" type="search" class="gn-search">--}%
                        %{--<a class="gn-icon gn-icon-search"><span>Search</span></a>--}%
                        %{--</li>--}%
                        <li><a href="#service" class="gn-icon gn-icon-cog">Services</a></li>
                        <li><a href="#about" class="gn-icon gn-icon-download">About</a></li>
                        <li><a href="#works" class="gn-icon gn-icon-help">Works</a></li>
                        <li>
                            <a href="#contact" class="gn-icon gn-icon-archive">Contact</a>
                        </li>
                    </ul>
                </div><!-- /gn-scroller -->
            </nav>
        </li>
        <li><a href="/pickupmyshift">PICKUPMYSHIFT</a></li>
        <li class="pull-right"><a href="/pickupmyshift/auth/login">LOGIN</a></li>
        <li class="pull-right"><a href="/pickupmyshift/auth/register">REGISTER</a></li>

    </ul>
</div>

<!-- Section: intro -->
<section id="introRegister" class="intro" style="height:1000px; background-image: ">
    <div class="slogan" style="padding:200px 0 60px; ">

        <div class="row">
            <div class="col-xs-3"></div>
            <div class="col-xs-6">
                <div id="buttonRow" class="row mainContentContainer">
                    <div class="col-xs-12">
                        <h2>Registration</h2>
                        <g:if test="${facebookID == null}">
                            <br>
                        </g:if>
                        <g:else>

                            <h5 style="color:rgba(2, 100, 16, 0.84)">Looks like you don't belong to a Organization yet. Please select below:</h5>
                        </g:else>
                        <br>
                        <div class="col-xs-6">
                            <button class="registrationButton" id="joinOrgButton" style="background-image: url(../img/door.jpg);">
                                <span class="registrationButtonText">Join Organization</span>
                            </button>
                        </div>
                        <div class="col-xs-6">
                            <button class="registrationButton" id="createOrgButton" style="background-image: url(../img/create.jpg);">
                                <span class="registrationButtonText">Create Organization</span>
                            </button>
                        </div>
                    </div>
                </div>


                <div class="row mainContentContainer"  id="registrationContainer" style="display:none">
                    <div class="col-xs-12">
                        <div id="userInfoContainer" style="display:none">
                            <h3>Create User Account</h3>
                            <div id="facebookIDHidden" style="display:none">${facebookID}</div>
                            <br>
                            <g:if test="${facebookID == null}">
                                <div id="registrationFacebookPullDiv">
                                    <h5 style="margin-bottom:10px">Use Facebook to connect with PICKUPMYSHIFT</h5>
                                    <div class="col-xs-4"> </div>
                                    <div class="col-xs-4">
                                        <button class="btn btn-lg btn-primary facebookButton"  id="pullFacebookInfo"><img src="${request.contextPath}/img/fbicon.png"
                                                                                                                                             style="width:20px; height:20px;position: relative; top: -3px" />
                                        Log in with Facebook
                                    </button>
                                    </div>

                                    <div class="col-xs-4"> </div>
                                    <br><br><br><br>
                                </div>
                                <div id="pulledProfilePreviewDiv" style="display:none">
                                    <h5 id="pulledProfileName" style="color: #3b5998;
                                    font-family: 'lucida grande', tahoma, verdana, arial, sans-serif; text-transform: none;
                                    font-weight:normal; margin:0px;"><img src="${request.contextPath}/img/fbicon.png"
                                                                          style="width:20px; height:20px;position: relative; top: -3px" />
                                    </h5>
                                    %{--<img id="pulledProfilePic" src="none"  style="width:64px; height:64px"/>--}%
                                    <br>
                                </div>

                            </g:if>
                            <g:else>
                                <h5 id="pulledProfileName" style="color: #3b5998;
                                font-family: 'lucida grande', tahoma, verdana, arial, sans-serif; text-transform: none;
                                font-weight:normal; margin:0px;"> <img src="${request.contextPath}/img/fbicon.png"
                                                                       style="width:20px; height:20px;position: relative; top: -3px" />
                                    Logged in as ${firstName} ${lastName}</h5>
                                <br>
                            </g:else>


                            <!-- Text input-->
                            <div class="form-group">
                                <label class="col-md-4 control-label" for="service_name">First Name</label>
                                <div class="col-md-6">
                                    <input id="firstNameInput"  name="service_name" type="text" value="${firstName}" class="form-control input-md">
                                </div>
                            </div>
                            <br>
                            <br>
                            <!-- Text input-->
                            <div class="form-group">
                                <label class="col-md-4 control-label" for="service_architecture">Last Name</label>
                                <div class="col-md-6">
                                    <input id="lastNameInput" name="service_architecture" type="text" value="${lastName}" class="form-control input-md">

                                </div>
                            </div>
                            <br>
                            <br>
                            <!-- Text input-->
                            <g:if test="${facebookID == null}">
                            <div class="form-group ">
                                <label class="col-md-4 control-label" for="service_architecture">Phone</label>
                                <div class="col-md-6">
                                    <input id="phoneNumberInput" name="service_architecture" type="text"  value="${phoneNumber}"  class="form-control input-md">
                                </div>
                            </div>
                            <br>
                            <br>
                            </g:if>
                            <g:else>
                                <div class="form-group has-error">
                                    <label class="col-md-4 control-label" for="service_architecture">Phone</label>
                                    <div class="col-md-6">
                                        <input id="phoneNumberInput" name="service_architecture" type="text"  value="${phoneNumber}"  class="form-control input-md">
                                    </div>
                                </div>
                                <br>
                                <br>
                            </g:else>
                            <!-- Text input-->
                            <div class="form-group">
                                <label class="col-md-4 control-label" for="service_version">Email</label>
                                <div class="col-md-6">
                                    <input id="emailInput" name="service_version" type="email" value="${email}" class="form-control input-md">

                                </div>
                            </div>
                            <br>
                            <br>
                            <g:if test="${facebookID == null}">
                                <!-- Text input-->
                                <div class="form-group" id="passwordInputFormGroup">
                                    <label class="col-md-4 control-label" for="service_version">Password</label>
                                    <div class="col-md-6">
                                        <input id="passwordInput" name="service_version" type="password" value="" class="form-control input-md">

                                    </div>
                                    <br>
                                    <br>
                                </div>

                                <!-- Text input-->
                                <div class="form-group" id="verifyPasswordInputFormGroup">
                                    <label class="col-md-4 control-label" for="service_version">Verify Password</label>
                                    <div class="col-md-6">
                                        <input id="verifyPasswordInput" name="service_version" type="password" value="" class="form-control input-md">
                                    </div>
                                    <br>
                                    <br>
                                </div>

                            </g:if>
                            <g:else>
                                <!-- Text input-->
                                <div class="form-group" id="passwordInputFormGroup" style="display:none">
                                    <label class="col-md-4 control-label" for="service_version">Password</label>
                                    <div class="col-md-5">
                                        <input id="passwordInput" name="service_version" type="password" value="" class="form-control input-md">

                                    </div>
                                </div>
                            </g:else>

                        <!-- Select Basic -->
                            <div class="form-group">
                                <div id="hiddenBirthday" style="display:none">${userBirthday}</div>
                                <label class="col-md-4 control-label" for="os_id">Birthdate</label>
                                <div class="col-md-2">
                                    <select id="birthdayMonthSelect" name="" class="form-control">
                                        <option value="0">-</option>
                                        <option value="1">Jan</option>
                                        <option value="2">Feb</option>
                                        <option value="3">Mar</option>
                                        <option value="4">Apr</option>
                                        <option value="5">May</option>
                                        <option value="6">Jun</option>
                                        <option value="7">Jul</option>
                                        <option value="8">Aug</option>
                                        <option value="9">Sep</option>
                                        <option value="10">Oct</option>
                                        <option value="11">Nov</option>
                                        <option value="12">Dec</option>
                                    </select>
                                </div>
                                <div class="col-md-2">
                                    <select id="birthdayDaySelect" name="" class="form-control">
                                        <option value="00">-</option>
                                        <option value="01">01</option>
                                        <option value="02">02</option>
                                        <option value="03">03</option>
                                        <option value="04">04</option>
                                        <option value="05">05</option>
                                        <option value="06">06</option>
                                        <option value="07">07</option>
                                        <option value="08">08</option>
                                        <option value="09">09</option>
                                        <option value="10">10</option>
                                        <option value="11">11</option>
                                        <option value="12">12</option>
                                        <option value="13">13</option>
                                        <option value="14">14</option>
                                        <option value="15">15</option>
                                        <option value="16">16</option>
                                        <option value="17">17</option>
                                        <option value="18">18</option>
                                        <option value="19">19</option>
                                        <option value="20">20</option>
                                        <option value="21">21</option>
                                        <option value="22">22</option>
                                        <option value="23">23</option>
                                        <option value="24">24</option>
                                        <option value="25">25</option>
                                        <option value="26">26</option>
                                        <option value="27">27</option>
                                        <option value="28">28</option>
                                        <option value="29">29</option>
                                        <option value="30">30</option>
                                        <option value="31">31</option>


                                    </select>
                                </div>
                                <div class="col-md-2">
                                    <select id="birthdayYearSelect" name="" class="form-control">
                                        <g:each var="i" in="${ (2015..1900) }">
                                            <option value="${i}">${i}</option>

                                        </g:each>
                                    </select>
                                </div>
                            </div>
                            <br><br>

                            <!-- Select Basic -->

                            <!-- Text input-->
                            <div class="form-group">
                                <label class="col-md-4 control-label" for="pictureInput">Picture</label>
                                <div class="col-md-6" id="profilePicturePreviewDiv">
                                    <div class="fileinput fileinput-new pull-left" data-provides="fileinput">
                                        <div class="fileinput-preview thumbnail"  data-trigger="fileinput" style="width:200px; height:200px;">
                                            <img src="${pictureURL}" alt="" id="profilePicturePreview">
                                        </div>
                                        <div>
                                            <span class="btn btn-default btn-file"><span class="fileinput-new">Select image</span><span class="fileinput-exists">Change</span><input type="file" name="picture" id="pictureInput"></span>
                                            <a href="#" class="btn btn-default fileinput-exists" data-dismiss="fileinput">Remove</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br><br><br><br><br><br><br>
                            <br>

                        </div>
                        <br><br><br><br>
                        <div id="joinOrgContainer" style = "display:none">
                            <br><br>
                            <h3>Organization Information</h3>
                            <br><br>
                            <!-- Text Input -->
                            <div class="form-group">
                                <label class="col-md-4 control-label" for="OrgID">Organization ID</label>
                                <div class="col-md-4">
                                    <input id="orgIDInput" name="OrgID" type="text" placeholder="" class="form-control input-md">

                                </div>
                            </div>
                            <br><br>
                            <!-- Text Input -->
                            <div class="form-group">
                                <label class="col-md-4 control-label" for="OrgPin">Organization Pin #</label>
                                <div class="col-md-4">
                                    <input id="orgPinInput" name="OrgID" type="password" placeholder="" class="form-control input-md">

                                </div>
                                <div class="col-md-2">
                                    <button class="btn btn-primary btn-sm" type="button" id="verifyOrgPin">Verify</button>
                                </div>
                            </div>
                            <br><br><br>
                            <div class="form-group" id="organizationNameFormGroup" style="display:none">
                                <label class="col-md-4 control-label" for="">Organization Name</label>
                                <div class="col-md-8">
                                    <div id="organizationName" style="text-align:left"> </div>

                                </div>
                            </div>
                            <br>
                            <div class="form-group" id="jobRoleFormGroup" style="display:none">
                                <label class="col-md-4 control-label" for="jobRole">Your Job/Role</label>
                                <div class="col-md-8">
                                    <select id="jobRoleSelect" name="" class="form-control">

                                    </select>
                                </div>

                            </div>
                            <br>
                        </div>
                        <div id="createOrgContainer" style = "display:none">
                            <br><br>
                            <h3>Organization Information</h3>
                            <br><br>
                            <div class="form-group" id="" style="">
                                <label class="col-md-4 control-label" for="">Organization Name</label>
                                <div class="col-md-8">
                                    <input id="organizationNameInput" name="OrgID" type="text" placeholder="" class="form-control input-md">

                                </div>
                            </div>
                            <br><br>
                            <div class="form-group" style="">
                                <label class="col-md-4 control-label" for="">Organization Pin</label>
                                <div class="col-md-8">
                                    <input id="orgPinSetInput" name="orgPinSet" type="text" placeholder="" class="form-control input-md">
                                </div>
                            </div>
                            <br><br>
                            <div class="form-group"  style="">
                                <label class="col-md-4 control-label" for="">Address 1</label>
                                <div class="col-md-8">
                                    <input id="address1Input" name="address1" type="text" placeholder="" class="form-control input-md">
                                </div>
                            </div>
                            <br><br>
                            <div class="form-group" style="">
                                <label class="col-md-4 control-label" for="">Address 2</label>
                                <div class="col-md-8">
                                    <input id="address2Input" name="address1" type="text" placeholder="" class="form-control input-md">
                                </div>
                            </div>
                            <br><br>
                            <div class="form-group" style="">
                                <label class="col-md-4 control-label" for="">City</label>
                                <div class="col-md-8">
                                    <input id="cityInput" name="city" type="text" placeholder="" class="form-control input-md">
                                </div>
                            </div>
                            <br><br>
                            <div class="form-group" style="">
                                <label class="col-md-4 control-label" for="">State</label>
                                <div class="col-md-8">
                                    <select id="stateSelect" name="" class="form-control">
                                        <option value="invalid">-</option>
                                        <option value="AL">Alabama</option>
                                       <option value="AK">Alaska</option>
                                       <option value="AZ">Arizona</option>
                                       <option value="AR">Arkansas</option>
                                       <option value="CA">California</option>
                                       <option value="CO">Colorado</option>
                                       <option value="CT">Connecticut</option>
                                       <option value="DE">Delaware</option>
                                        <option value="DC">District Of Columbia</option>
                                       <option value="FL">Florida</option>
                                       <option value="GA">Georgia</option>
                                       <option value="HI">Hawaii</option>
                                       <option value="ID">Idaho</option>
                                       <option value="IL">Illinois</option>
                                       <option value="IN">Indiana</option>
                                       <option value="IA">Iowa</option>
                                       <option value="KS">Kansas</option>
                                       <option value="KY">Kentucky</option>
                                       <option value="LA">Louisiana</option>
                                       <option value="ME">Maine</option>
                                       <option value="MD">Maryland</option>
                                       <option value="MA">Massachusetts</option>
                                       <option value="MI">Michigan</option>
                                       <option value="MN">Minnesota</option>
                                       <option value="MS">Mississippi</option>
                                       <option value="MO">Missouri</option>
                                       <option value="MT">Montana</option>
                                       <option value="NE">Nebraska</option>
                                       <option value="NV">Nevada</option>
                                       <option value="NH">New Hampshire</option>
                                       <option value="NJ">New Jersey</option>
                                       <option value="NM">New Mexico</option>
                                       <option value="NY">New York</option>
                                       <option value="NC">North Carolina</option>
                                       <option value="ND">North Dakota</option>
                                       <option value="OH">Ohio</option>
                                       <option value="OK">Oklahoma</option>
                                       <option value="OR">Oregon</option>
                                       <option value="PA">Pennsylvania</option>
                                       <option value="RI">Rhode Island</option>
                                       <option value="SC">South Carolina</option>
                                       <option value="SD">South Dakota</option>
                                       <option value="TN">Tennessee</option>
                                       <option value="TX">Texas</option>
                                       <option value="UT">Utah</option>
                                       <option value="VT">Vermont</option>
                                       <option value="VA">Virginia</option>
                                       <option value="WA">Washington</option>
                                       <option value="WV">West Virginia</option>
                                       <option value="WI">Wisconsin</option>
                                       <option value="WY">Wyoming</option>
                                    </select>
                                </div>
                            </div>
                            <br><br>
                            <div class="form-group" style="">
                                <label class="col-md-4 control-label" for="">Zipcode</label>
                                <div class="col-md-4">
                                    <input id="zipcodeInput" name="city" type="text" placeholder="" class="form-control input-md">
                                </div>
                                <div class="col-md-4"></div>
                            </div>
                            <br><br>
                            <div class="form-group" style="">
                                <label class="col-md-4 control-label" for="">Time Zone</label>
                                <div class="col-md-8">
                                    <select id="timezoneSelect" name="" class="form-control">
                                        ${timezoneList}
                                        <g:each var="i" in="${ timezoneList }">
                                            <option value="${i.split(",")[0]}">${i}</option>
                                        </g:each>
                                    </select>
                                </div>
                            </div>
                            <br><br>
                            <div class="form-group" style="">
                                <label class="col-md-4 control-label" for="">Start of Work Day</label>
                                <div class="col-md-2">
                                    <select id="startTimeSelect" name="" class="form-control">
                                        <option value="invalid">-</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                        <option value="9">9</option>
                                        <option value="10">10</option>
                                        <option value="11">11</option>
                                        <option value="12">12</option>
                                    </select>
                                </div>

                                <div class="col-md-2">
                                    <select id="startTimeSelectMin" name="" class="form-control">
                                        <option value="invalid">-</option>
                                        <option value="00">00</option>
                                        <option value="30">30</option>
                                    </select>
                                </div>
                                <div class="col-md-2">
                                    <select id="startTimeSelectAMPM" name="" class="form-control">
                                        <option value="invalid">-</option>
                                        <option value="AM">AM</option>
                                        <option value="PM">PM</option>
                                    </select>
                                </div>
                                <div class="col-md-2"></div>
                            </div>
                            <br><br>
                            <div class="form-group" style="">
                                <label class="col-md-4 control-label" for="">End of Work Day</label>
                                <div class="col-md-2">
                                    <select id="endTimeSelect" name="" class="form-control">
                                        <option value="invalid">-</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                        <option value="9">9</option>
                                        <option value="10">10</option>
                                        <option value="11">11</option>
                                        <option value="12">12</option>
                                    </select>
                                </div>

                                <div class="col-md-2">
                                    <select id="endTimeSelectMin" name="" class="form-control">
                                        <option value="invalid">-</option>
                                        <option value="00">00</option>
                                        <option value="30">30</option>
                                    </select>
                                </div>
                                <div class="col-md-2">
                                    <select id="endTimeSelectAMPM" name="" class="form-control">
                                        <option value="invalid">-</option>
                                        <option value="AM">AM</option>
                                        <option value="PM">PM</option>
                                    </select>
                                </div>
                                <div class="col-md-2"></div>
                            </div>
                            <br><br>
                            <div class="form-group" id="employeeRoleFormGroup" style="">
                                <label class="col-md-4 control-label" for="">Employee Roles <br/> (check the box for your role) </label>
                                <div class="col-md-8" style="padding:3px">
                                    <div class="col-md-2" style="padding-left:10px; maring-right:0px;">
                                        <button class="btn btn-xs btn-danger pull-left removeEmployeeRole" style="margin-top:5px;margin-right:5px;"><span class="glyphicon glyphicon-minus" style=""></span> </button>

                                        <button class="btn btn-xs btn-success pull-left addEmployeeRole" style="margin-top:5px;"><span class="glyphicon glyphicon-plus" style=""></span> </button>

                                    </div>
                                    <div class="col-md-5" style="padding-left:0px;">
                                        <input class="form-control input-md employeeRoleInput" name="city" type="text" placeholder="eg. Server" >
                                    </div>
                                    <div class="col-md-1" style="padding-left:0px;">
                                        <!-- Single button -->
                                        <div class="btn-group colorBox">
                                            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <div class="selectedShiftColor" style="background-color: #0B2B4D; height:15px; width:15px; float:left; margin-top:3px; margin-right: 6px;">
                                                </div>
                                                <span class="caret"></span>
                                            </button>
                                            <ul class="dropdown-menu" style="min-width:50px;">
                                                <li>
                                                    <div class="shiftColor color1" style="background-color: #0B2B4D; height:15px; width:15px; margin:20px; margin-top:6px; margin-bottom:6px; cursor: pointer;"></div>
                                                </li>
                                                <li>
                                                    <div class="shiftColor color2" style="background-color: #51AE42; height:15px; width:15px; margin:20px; margin-top:6px; margin-bottom:6px; cursor: pointer"></div>

                                                </li>
                                                <li>
                                                    <div class="shiftColor color3"  style="background-color: #42919E; height:15px; width:15px; margin:20px; margin-top:6px; margin-bottom:6px; cursor: pointer"></div>

                                                </li>
                                            </ul>
                                        </div>


                                    </div>

                                    <div class="col-md-3">
                                        <div class="checkbox" style="width:2px;">

                                            <input class="myRoleCheckbox" type="checkbox">

                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>

                        <div class="col-xs-12" style="">
                            <br><br>
                            <button class="btn btn-primary pull-left" type="button" id="backButton">Back</button>
                            <button class="btn btn-primary pull-right" type="button" id="submitButton">Submit</button>
                        </div>

                    </div>

                </div>


                </div>

            </div>
        </div>




    </div>
</section>
<!-- /Section: intro -->


%{--<footer>--}%
    %{--<div class="container">--}%
        %{--<div class="row">--}%
            %{--<div class="col-md-12 col-lg-12">--}%
                %{--<p>Copyright &copy; 2014 Ninestars - by <a href="http://bootstraptaste.com">Bootstrap Themes</a></p>--}%
            %{--</div>--}%
            %{--<!----}%
                    %{--All links in the footer should remain intact.--}%
                    %{--Licenseing information is available at: http://bootstraptaste.com/license/--}%
                    %{--You can buy this theme without footer links online at: http://bootstraptaste.com/buy/?theme=Ninestars--}%
                %{---->--}%
        %{--</div>--}%
    %{--</div>--}%
%{--</footer>--}%

<!-- Core JavaScript Files -->
<script src="${request.contextPath}/Application/js/jquery.min.js"></script>
<script src="${request.contextPath}/Application/js/bootstrap.min.js"></script>
<script src="${request.contextPath}/Application/js/jquery.easing.min.js"></script>
<script src="${request.contextPath}/Application/js/jquery.mask.min.js"></script>
<script src="${request.contextPath}/Application/js/classie.js"></script>
<script src="${request.contextPath}/Application/js/gnmenu.js"></script>
<script src="${request.contextPath}/Application/js/jquery.scrollTo.js"></script>
<script src="${request.contextPath}/Application/js/nivo-lightbox.min.js"></script>
<script src="${request.contextPath}/Application/js/stellar.js"></script>
<script src="${request.contextPath}/Application/js/register.js"></script>
<script src="${request.contextPath}/Application/js/jasny-bootstrap.js"></script>
<script src="${request.contextPath}/Application/js/login.js"></script>
<!-- Custom Theme JavaScript -->
<script src="${request.contextPath}/Application/js/custom.js"></script>



</body>

</html>
