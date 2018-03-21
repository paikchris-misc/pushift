<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>PICKUPMYSHIFT</title>

    <!-- Bootstrap Core CSS -->
    <link href="${request.contextPath}/Application/css/bootstrap.min.css" rel="stylesheet" type="text/css">

    <!-- Fonts -->
    <link href="${request.contextPath}/Application/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="${request.contextPath}/Application/css/nivo-lightbox.css" rel="stylesheet" />
    <link href="${request.contextPath}/Application/css/nivo-lightbox-theme/default/default.css" rel="stylesheet" type="text/css" />
    <link href="${request.contextPath}/Application/css/animate.css" rel="stylesheet" />
    <!-- Squad theme CSS -->
    <link href="${request.contextPath}/Application/css/style.css" rel="stylesheet">
    <link href="${request.contextPath}/Application/color/default.css" rel="stylesheet">
    <!-- JqueryUI CSS -->
    <link href="${request.contextPath}/Application/css/jquery-ui.min.css"
          rel="stylesheet">
    <!-- Custom CSS -->
    <link href="${request.contextPath}/Application/css/calendar.css"
          rel="stylesheet">

    <!-- Custom CSS -->
    <link href="${request.contextPath}/Application/css/custom.css"
          rel="stylesheet">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
    <g:layoutHead />
</head>

<body>
%{--<script>--}%
    %{--// This is called with the results from from FB.getLoginStatus().--}%
    %{--function statusChangeCallback(response) {--}%
        %{--console.log('statusChangeCallback');--}%
        %{--console.log(response);--}%
        %{--// The response object is returned with a status field that lets the--}%
        %{--// app know the current login status of the person.--}%
        %{--// Full docs on the response object can be found in the documentation--}%
        %{--// for FB.getLoginStatus().--}%
        %{--if (response.status === 'connected') {--}%
            %{--// Logged into your app and Facebook.--}%
            %{--testAPI();--}%
        %{--} else if (response.status === 'not_authorized') {--}%
            %{--// The person is logged into Facebook, but not your app.--}%
            %{--document.getElementById('status').innerHTML = 'Please log ' +--}%
                    %{--'into this app.';--}%
        %{--} else {--}%
            %{--// The person is not logged into Facebook, so we're not sure if--}%
            %{--// they are logged into this app or not.--}%
            %{--document.getElementById('status').innerHTML = 'Please log ' +--}%
                    %{--'into Facebook.';--}%
        %{--}--}%
    %{--}--}%

    %{--// This function is called when someone finishes with the Login--}%
    %{--// Button.  See the onlogin handler attached to it in the sample--}%
    %{--// code below.--}%
    %{--function checkLoginState() {--}%
        %{--FB.getLoginStatus(function(response) {--}%
            %{--statusChangeCallback(response);--}%
        %{--});--}%
    %{--}--}%

    %{--window.fbAsyncInit = function() {--}%
        %{--FB.init({--}%
            %{--appId      : '{your-app-id}',--}%
            %{--cookie     : true,  // enable cookies to allow the server to access--}%
                                %{--// the session--}%
            %{--xfbml      : true,  // parse social plugins on this page--}%
            %{--version    : 'v2.2' // use version 2.2--}%
        %{--});--}%

        %{--// Now that we've initialized the JavaScript SDK, we call--}%
        %{--// FB.getLoginStatus().  This function gets the state of the--}%
        %{--// person visiting this page and can return one of three states to--}%
        %{--// the callback you provide.  They can be:--}%
        %{--//--}%
        %{--// 1. Logged into your app ('connected')--}%
        %{--// 2. Logged into Facebook, but not your app ('not_authorized')--}%
        %{--// 3. Not logged into Facebook and can't tell if they are logged into--}%
        %{--//    your app or not.--}%
        %{--//--}%
        %{--// These three cases are handled in the callback function.--}%

        %{--FB.getLoginStatus(function(response) {--}%
            %{--statusChangeCallback(response);--}%
        %{--});--}%

    %{--};--}%

    %{--// Load the SDK asynchronously--}%
    %{--(function(d, s, id) {--}%
        %{--var js, fjs = d.getElementsByTagName(s)[0];--}%
        %{--if (d.getElementById(id)) return;--}%
        %{--js = d.createElement(s); js.id = id;--}%
        %{--js.src = "//connect.facebook.net/en_US/sdk.js";--}%
        %{--fjs.parentNode.insertBefore(js, fjs);--}%
    %{--}(document, 'script', 'facebook-jssdk'));--}%

    %{--// Here we run a very simple test of the Graph API after login is--}%
    %{--// successful.  See statusChangeCallback() for when this call is made.--}%
    %{--function testAPI() {--}%
        %{--console.log('Welcome!  Fetching your information.... ');--}%
        %{--FB.api('/me', function(response) {--}%
            %{--console.log('Successful login for: ' + response.name);--}%
            %{--document.getElementById('status').innerHTML =--}%
                    %{--'Thanks for logging in, ' + response.name + '!';--}%
        %{--});--}%
    %{--}--}%
%{--</script>--}%
<script>

</script>
<div id="wrapper">
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
                            <li><a href="/pickupmyshift/application/employees" class="gn-icon glyphicon-user">Employees</a></li>
                            <li><a href="/pickupmyshift/application/createSchedule" class="gn-icon  glyphicon-th">Scheduling</a></li>
                            <li><a href="/pickupmyshift/application/reports" class="gn-icon  glyphicon-stats">Reports</a></li>
                            <li>
                                <a href="/pickupmyshift/settings/" class="gn-icon glyphicon-cog">Settings</a>
                            </li>
                        </ul>
                    </div><!-- /gn-scroller -->
                </nav>
            </li>
            <li><a href="/pickupmyshift">PICKUPMYSHIFT</a></li>
            %{--<li class="pull-right"><a href="/pickupmyshift/auth/login">${session.user.email}</a></li>--}%
            <li class="pull-right menu-right">
            <div class="dropdown" style="margin-right:10px;">
                %{--<a href="/pickupmyshift/settings/">--}%
                    <span class="userEmailMenu" style="padding-right:10px;text-transform: uppercase;
                                                        letter-spacing: 1px;font-weight: bold;"
                          id="dropdownMenu1" data-toggle="dropdown">${session.user.email}</span>
                    <img class="avatarCircle" src = "${request.contextPath}/${session.user.imagePath}"/>
                %{--</a>--}%
                <ul class="dropdown-menu pull-right" aria-labelledby="dropdownMenu1" style="margin-right: 20px;min-width:10px;width:160px;border:0;">
                    <li><a href="/pickupmyshift/settings/" style="color: #eb5d1e;">Settings</a></li>
                    <li role="separator" class="divider"></li>
                    <li><a href="/pickupmyshift/auth/logout" style="color: #eb5d1e;">Logout</a></li>
                </ul>
            </div>

            %{--</li>--}%
        %{--<li class="pull-right"><a href="/pickupmyshift/auth/register">REGISTER</a></li>--}%

        </ul>
        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Action <span class="caret"></span>
        </button>

    </div>
    <div class="mainContentWrapper" id="intro">
        <g:layoutBody />
    </div>

    <!-- Section: intro -->
    %{--<section id="intro" class="intro" style="">--}%

        %{--<div class="slogan">--}%
        %{--<h1>PICKUPMYSHIFT</h1>--}%
        %{--<p>Stress free staff management</p>--}%
        %{--<a href="#about" class="btn btn-skin scroll">Learn more</a>--}%
        %{--<ul class="company-social" style ="text-align: center;">--}%

        %{--<li class="social-facebook"><a href="#" target="_blank"><i class="fa fa-facebook"></i></a></li>--}%
        %{--<li class="social-twitter"><a href="#" target="_blank"><i class="fa fa-twitter"></i></a></li>--}%
        %{--<li class="social-dribble"><a href="#" target="_blank"><i class="fa fa-dribbble"></i></a></li>--}%
        %{--<li class="social-google"><a href="#" target="_blank"><i class="fa fa-google-plus"></i></a></li>--}%
        %{--</ul>--}%
        %{--</div>--}%
    %{--</section>--}%
    <!-- /Section: intro -->

    <footer>
        <div class="container">
            <div class="row">
                <div class="col-md-12 col-lg-12">
                    <p>Copyright &copy; 2014 Ninestars - by <a href="http://bootstraptaste.com">Bootstrap Themes</a></p>
                </div>
                <!--
                    All links in the footer should remain intact.
                    Licenseing information is available at: http://bootstraptaste.com/license/
                    You can buy this theme without footer links online at: http://bootstraptaste.com/buy/?theme=Ninestars
                -->
            </div>
        </div>
    </footer>
</div>


<!-- Core JavaScript Files -->

<script src="${request.contextPath}/Application/js/jquery.js"></script>
<script src="${request.contextPath}/Application/js/jquery.easing.min.js"></script>
<script src="${request.contextPath}/Application/js/jqueryUI.js"></script>
<script src="${request.contextPath}/Application/js/jquery-ui.min.js"></script>



%{--<script src="${request.contextPath}/Application/js/jquery.min.js"></script>--}%
<script src="${request.contextPath}/Application/js/bootstrap.min.js"></script>
<script src="${request.contextPath}/Application/js/jquery.mask.min.js"></script>

%{--<script src="${request.contextPath}/Application/js/jquery.easing.min.js"></script>--}%
<script src="${request.contextPath}/Application/js/classie.js"></script>
<script src="${request.contextPath}/Application/js/gnmenu.js"></script>
%{--<script src="${request.contextPath}/Application/js/jquery.scrollTo.js"></script>--}%
<script src="${request.contextPath}/Application/js/nivo-lightbox.min.js"></script>
<script src="${request.contextPath}/Application/js/stellar.js"></script>
%{--<!-- Custom Theme JavaScript -->--}%
%{--<script src="${request.contextPath}/Application/js/custom.js"></script>--}%
<script src="${request.contextPath}/Application/js/custom.js"></script>
<script src="${request.contextPath}/Application/js/jasny-bootstrap.js"></script>
<script src="${request.contextPath}/Application/js/customCalendar.js"></script>


</body>

</html>
