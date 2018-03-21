<!DOCTYPE html>
<html>
<head>

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="">
<meta name="author" content="">

<title>Simple Sidebar - Start Bootstrap Template</title>



<!-- Bootstrap Core CSS -->
<!-- Bootstrap Core CSS -->
<link href="${request.contextPath}/Application/css/bootstrap.min.css"
	rel="stylesheet">

<!-- Theme CSS -->
<link href="${request.contextPath}/Application/css/simple-sidebar.css"
	rel="stylesheet">

<!-- JqueryUI CSS -->
<link href="${request.contextPath}/Application/css/jquery-ui.min.css"
	rel="stylesheet">



<!-- Morris Charts CSS -->
<link href="${request.contextPath}/Application/css/plugins/morris.css"
	rel="stylesheet">

<!-- Custom Fonts -->
<link
	href="${request.contextPath}/Application/font-awesome/css/font-awesome.min.css"
	rel="stylesheet" type="text/css">
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
			appId      : '{your-app-id}',
			cookie     : true,  // enable cookies to allow the server to access
								// the session
			xfbml      : true,  // parse social plugins on this page
			version    : 'v2.2' // use version 2.2
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
		FB.api('/me', function(response) {
			console.log('Successful login for: ' + response.name);
			document.getElementById('status').innerHTML =
					'Thanks for logging in, ' + response.name + '!';
		});
	}
</script>
	<div id="wrapper">
	
		<!-- Sidebar Menu Items - These collapse to the responsive navigation menu on small screens -->
		<div class="sidebarWrapper " >
		<div class="text-center" id="brand" ><bold>Pickupmyshift</bold></div>
		<nav role="navigation">
			
			<ul class="nav nav-pills nav-stacked">
				
				<li class="active"><a href="/pickupmyshift/application/dashboard"><i
						class="fa fa-fw fa-dashboard"></i> Dashboard</a></li>
						<li><a href="/pickupmyshift/application/employees"><i class="fa fa-fw fa-edit"></i>
						Employees</a></li>
				%{--<li><a href="/pickupmyshift/application/calendar"><i--}%
						%{--class="fa fa-fw fa-table"></i> Calendar</a></li>--}%
				<li><a href="javascript:;" data-toggle="collapse"
					data-target="#schedulingDropDown"><i class="fa fa-fw fa-table"></i>
					Scheduling<i class="fa fa-fw fa-caret-down"></i></a>
					<ul id="schedulingDropDown" class="collapse">
						%{--<a href="/pickupmyshift/application/scheduleView"><li><i--}%
								%{--class="fa fa-fw fa-table"></i> View Schedule</li></a>--}%
						<a href="/pickupmyshift/application/createSchedule"><li><i
								class="fa fa-fw fa-table"></i> Create/Edit Schedule</li></a>
						%{--<a href="/pickupmyshift/application/generateSchedule"><li><i--}%
								%{--class="fa fa-fw fa-table"></i> Generate Schedule</li></a>--}%
					</ul>
				</li>
				<li><a href="/pickupmyshift/application/availability"><i class="fa fa-fw fa-table"></i>
						My Availability</a></li>
				 
				%{--<li><a href="/pickupmyshift/application/organization"><i--}%
						%{--class="fa fa-fw fa-desktop"></i> Business Info</a></li>--}%
				%{--<li><a href="bootstrap-grid.html"><i--}%
						%{--class="fa fa-fw fa-wrench"></i> Bootstrap Grid</a></li>--}%
				%{--<li><a href="javascript:;" data-toggle="collapse"--}%
					%{--data-target="#demo"><i class="fa fa-fw fa-arrows-v"></i>--}%
						%{--Dropdown <i class="fa fa-fw fa-caret-down"></i></a>--}%
					%{--<ul id="demo" class="collapse">--}%
						%{--<li><a href="#">Dropdown Item</a></li>--}%
						%{--<li><a href="#">Dropdown Item</a></li>--}%
					%{--</ul>--}%
				%{--</li>--}%
				%{--<li><a href="blank-page.html"><i class="fa fa-fw fa-file"></i>--}%
						%{--Blank Page</a></li>--}%
				%{--<li><a href="index-rtl.html"><i--}%
						%{--class="fa fa-fw fa-dashboard"></i> RTL Dashboard</a></li>--}%
			</ul>
			</nav>
		</div>
		<div class="topMenu" style='margin-left:150px; padding:0px'>
			<div class='row' style="padding:15px; margin-left:0px; margin-right:0px">
				<div class='col-xs-10'>
					
				</div>
				<div class='col-xs-2' style=''>
					<div style="float:right">
						<li class="dropdown" style='list-style-type: none;'>
							<a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-user"></i> John Smith <b class="caret"></b></a>
							<ul class="dropdown-menu">
								<li>
									<a href="/pickupmyshift/application/profile"><i class="fa fa-fw fa-user"></i> Profile</a>
								</li>
								%{--<li>--}%
									%{--<a href="#"><i class="fa fa-fw fa-envelope"></i> Inbox</a>--}%
								%{--</li>--}%
								<li>
									<a href="/pickupmyshift/settings/"><i class="fa fa-fw fa-gear"></i> Settings</a>
								</li>
								<li class="divider"></li>
								<li>
									<a href="/pickupmyshift/auth/logout/"><i class="fa fa-fw fa-power-off"></i> Log Out</a>
								</li>
							</ul>
						</li>
					</div>

				</div>
			</div>
		</div>
		
		<g:layoutBody />
	</div>


	<!-- jQuery -->
	<script src="${request.contextPath}/Application/js/jquery.js"></script>
	<script src="${request.contextPath}/Application/js/customCalendar.js"></script>
	<script src="${request.contextPath}/Application/js/jqueryUI.js"></script>
	<script src="${request.contextPath}/Application/js/jquery-ui.min.js"></script>
	<script src="${request.contextPath}/Application/js/jquery-ui.min.js"></script>

	<!-- Bootstrap Core JavaScript -->
	<script src="${request.contextPath}/Application/js/bootstrap.min.js"></script>

	<!-- Morris Charts JavaScript -->
	<script
		src="${request.contextPath}/Application/js/plugins/morris/raphael.min.js"></script>
	<script
		src="${request.contextPath}/Application/js/plugins/morris/morris.min.js"></script>
	<script
		src="${request.contextPath}/Application/js/plugins/morris/morris-data.js"></script>

	<g:facebookConnectJavascript  />
</body>

</html>
