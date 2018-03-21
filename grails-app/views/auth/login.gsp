<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Login</title>

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

</head>

<body data-spy="scroll">
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

    function fb_login(){
        console.log("working")
        FB.login(function(response) {
            console.log("working")
            if (response.status === 'connected') {
                console.log('Welcome!  Fetching your information.... ');
                console.log(response); // dump complete info
                access_token = response.authResponse.accessToken; //get access token
                user_id = response.authResponse.userID; //get FB UID

                var picture
                FB.api('/me/picture?width=180&height=180&redirect=0 ', function(response) {
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
<section id="intro" class="intro" style=" height:1000px;">
    <div class="slogan" style="padding:200px 0 60px;">
        <h1 class="form-signin-heading">Please sign in</h1>
        <br>

        %{--<button id="loginFacebook">--}%
            %{--<div id="facebookLoginImg-wrap">--}%
                %{--<img src="${request.contextPath}/img/login-with-facebook.png" alt="facebook" style=""/>--}%
            %{--</div>--}%
        %{--</button>--}%
        <div class="col-xs-5"></div>
        <div class="col-xs-2 login-container">
            <div class="row mainContentContainer" >
                <div class="col-xs-12">
                    <button class="btn btn-lg btn-primary facebookButton" id="loginFacebook"><img src="${request.contextPath}/img/fbicon.png"
                                                                                   style="width:20px; height:20px;position: relative; top: -3px" />
                        Log in with Facebook
                    </button>
                    <p style="margin:20px; color:inherit; text-shadow:none">OR</p>
                    <form class="form-signin">

                        <label for="inputEmail" class="sr-only">Email address</label>
                        <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus>
                        <label for="inputPassword" class="sr-only">Password</label>
                        <input type="password" id="inputPassword" class="form-control" placeholder="Password" required>
                        <div class="checkbox" style="text-align: left ">
                            <label>
                                <input type="checkbox" value="remember-me" > Remember me
                            </label>
                        </div>
                        %{--<fb:login-button size="large" scope="public_profile,email" onlogin="fb_login();">Continue With Facebook--}%
                        %{--</fb:login-button>--}%

                        %{--<input name="loginFacebook" value="Continue With Facebook" onclick="" class="btn btn-lg btn-primary btn-block" id="loginFacebook">--}%
                        <div class="col-xs-6" style="padding:4px">
                            <button class="btn btn-lg btn-primary btn-block" type="button" onclick="location.href='/pickupmyshift/auth/register';" >Register</button>
                        </div>
                        <div class="col-xs-6" style="padding:4px">
                            <g:actionSubmit value="Login" action="login" controller="application" class="btn btn-lg btn-primary btn-block"  />
                        </div>

                    </form>

                </div>


            </div>

        </div>
        <div class="col-xs-5"></div>

    </div>
</section>
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

<!-- Core JavaScript Files -->
<script src="${request.contextPath}/Application/js/jquery.min.js"></script>
<script src="${request.contextPath}/Application/js/bootstrap.min.js"></script>
<script src="${request.contextPath}/Application/js/jquery.easing.min.js"></script>
<script src="${request.contextPath}/Application/js/classie.js"></script>
<script src="${request.contextPath}/Application/js/gnmenu.js"></script>
<script src="${request.contextPath}/Application/js/jquery.scrollTo.js"></script>
<script src="${request.contextPath}/Application/js/nivo-lightbox.min.js"></script>
<script src="${request.contextPath}/Application/js/stellar.js"></script>
<script src="${request.contextPath}/Application/js/login.js"></script>
<!-- Custom Theme JavaScript -->
<script src="${request.contextPath}/Application/js/custom.js"></script>

</body>

</html>
