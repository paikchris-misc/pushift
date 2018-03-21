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
    <link href="${request.contextPath}/Application/css/driverRegister.css"
          rel="stylesheet">

    <!-- JASNY CSS -->
    <link href="${request.contextPath}/Application/css/jasny-bootstrap.min.css"
          rel="stylesheet">
    <!-- JqueryUI CSS -->
    <link href="${request.contextPath}/Application/css/jquery-ui.min.css"
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

</head>

<body>

    <div class="container">
    <div class="stepwizard">
        <div class="stepwizard-row setup-panel">
            <div class="stepwizard-step">
                <a href="#step-1" type="button" class="btn btn-primary btn-circle">1</a>
                <p>Organization</p>
            </div>
            <div class="stepwizard-step">
                <a href="#step-2" type="button" class="btn btn-default btn-circle" disabled="disabled">2</a>
                <p>Create User Account</p>
            </div>

            <div class="stepwizard-step">
                <a href="#step-3" type="button" class="btn btn-default btn-circle" disabled="disabled">3</a>
                <p>Preview & Submit</p>
            </div>
        </div>
    </div>
    <form role="form"action="registerNewUser">
        <div class="row setup-content" id="step-1">
            <div class="col-xs-12">
                <div class="col-md-2"></div>
                <div class="col-md-6">
                    <h3>Organization</h3>
                    <br>
                    <div class="form-group" id="createOrJoinOrgGroup" >
                        <label class="col-md-4 control-label" for="createOrJoinOrg">Registration Type</label>
                        <div class="col-md-8">
                            <select id="createOrJoinOrgSelect" name="" class="form-control">
                                <option value="invalid">-</option>
                                <option value="joinOrg">Join A Existing Pickupmyshift Organization</option>
                                <option value="createOrg">Create A New Pickupmyshift Organization</option>
                            </select>
                        </div>

                    </div>
                    <br><br>
                    <div id="joinOrgContainer" style = "display:none">
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
                                <div id="organizationName" > </div>

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
                    <div id="orgInfoContainer" style = "display:none">
                        <div class="form-group" id="" style="">
                            <label class="col-md-4 control-label" for="">Organization Name</label>
                            <div class="col-md-8">
                                <input id="organizationNameInput" name="OrgID" type="text" placeholder="" class="form-control input-md">

                            </div>
                        </div>
                        <br><br>
                        <br>
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
                                    <option value="VA">Virginia</option>
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
                            <label class="col-md-4 control-label" for="">Start of Work Day</label>
                            <div class="col-md-4">
                                <select id="startTimeSelect" name="" class="form-control">
                                    <option value="0800">8AM</option>
                                </select>
                            </div>
                            <div class="col-md-4"></div>
                        </div>
                        <br><br>
                        <div class="form-group" style="">
                            <label class="col-md-4 control-label" for="">End of Work Day</label>
                            <div class="col-md-4">
                                <select id="endTimeSelect" name="" class="form-control">
                                    <option value="2100">9PM</option>
                                </select>
                            </div>
                            <div class="col-md-4"></div>
                        </div>
                        <br><br>
                        <div class="form-group" style="">
                            <label class="col-md-4 control-label" for="">Employee Roles</label>
                            <div class="col-md-8">
                                <input id="employeeRolesInput" name="employeeRoles" type="text" placeholder="Server, Host, Bartender" class="form-control input-md">
                            </div>
                        </div>
                    </div>

                    <br><br>

                    <button class="btn btn-primary nextBtn btn-lg pull-right" type="button" id="step1NextButton" >Next</button>
                </div>
                <div class="col-md-2"></div>
            </div>

        </div>
        <div class="row setup-content" id="step-2">
            <div class="col-xs-12">
                <div class="col-md-12">
                    <h3>Create User Account</h3>
                    <div id="facebookIDHidden" style="display:none">${facebookID}</div>
                    <!-- Text input-->
                    <div class="form-group">
                        <label class="col-md-4 control-label" for="service_name">First Name</label>
                        <div class="col-md-5">
                            <input id="firstNameInput"  name="service_name" type="text" value="${firstName}" class="form-control input-md">

                        </div>
                    </div>
                    <br>
                    <br>
                    <!-- Text input-->
                    <div class="form-group">
                        <label class="col-md-4 control-label" for="service_architecture">Last Name</label>
                        <div class="col-md-5">
                            <input id="lastNameInput" name="service_architecture" type="text" value="${lastName}" class="form-control input-md">

                        </div>
                    </div>
                    <br>
                    <br>
                    <!-- Text input-->
                    <div class="form-group">
                        <label class="col-md-4 control-label" for="service_version">Email</label>
                        <div class="col-md-5">
                            <input id="emailInput" name="service_version" type="email" value="${email}" class="form-control input-md">

                        </div>
                    </div>
                    <br>
                    <br>
                    <g:if test="${facebookID == null}">
                        <!-- Text input-->
                        <div class="form-group">
                            <label class="col-md-4 control-label" for="service_version">Password</label>
                            <div class="col-md-5">
                                <input id="passwordInput" name="service_version" type="password" value="" class="form-control input-md">

                            </div>
                        </div>
                        <br>
                        <br>
                    </g:if>
                    <g:else>
                        <!-- Text input-->
                        <div class="form-group" style="display:none">
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
                        <div class="col-md-1">
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
                        <div class="col-md-1">
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
                        <div class="col-md-5" id="profilePicturePreviewDiv">
                            <div class="fileinput fileinput-new" data-provides="fileinput">
                                <div class="fileinput-preview thumbnail"  data-trigger="fileinput" style="width: 200px; height: 150px;">
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

                    <button class="btn btn-primary nextBtn btn-lg pull-right" type="button" id="nextButton">Next</button>
                </div>
            </div>
        </div>

        <div class="row setup-content" id="step-3">
            <div class="col-xs-12">
                <div class="col-md-12">
                    <h3> Preview & Submit</h3>

                    <label class="col-md-4 control-label " for="service_name">Organization Name</label>
                    <div class="col-md-5">
                        <div id="organizationPreview"> </div>
                    </div>
                    <br>
                    <br>

                    <div class="joinOrgPreview">
                        <label class="col-md-4 control-label " for="service_name">User Role</label>
                        <div class="col-md-5">
                            <div id="userRolePreview"> </div>
                        </div>
                        <br>
                        <br>
                    </div>

                    <div class="createOrgPreview">
                        <label class="col-md-4 control-label" for="service_name">Address 1</label>
                        <div class="col-md-5">
                            <div id="address1Preview"> </div>
                        </div>
                        <br>
                        <br>
                    </div>

                    <div class="createOrgPreview">
                        <label class="col-md-4 control-label " for="service_name">Address 2</label>
                        <div class="col-md-5">
                            <div id="address2Preview"> </div>
                        </div>
                        <br>
                        <br>
                    </div>

                    <div class="createOrgPreview">
                        <label class="col-md-4 control-label " for="service_name">City</label>
                        <div class="col-md-5">
                            <div id="cityPreview"> </div>
                        </div>
                        <br>
                        <br>
                    </div>

                    <div class="createOrgPreview">
                        <label class="col-md-4 control-label " for="service_name">State</label>
                        <div class="col-md-5">
                            <div id="statePreview"> </div>
                        </div>
                        <br>
                        <br>
                    </div>

                    <div class="createOrgPreview">
                        <label class="col-md-4 control-label " for="service_name">Zipcode</label>
                        <div class="col-md-5">
                            <div id="zipcodePreview"> </div>
                        </div>
                        <br>
                        <br>
                    </div>

                    <div class="createOrgPreview">
                        <label class="col-md-4 control-label " for="service_name">Start of Work Day</label>
                        <div class="col-md-5">
                            <div id="startTimePreview"> </div>
                        </div>
                        <br>
                        <br>
                    </div>

                    <div class="createOrgPreview">
                        <label class="col-md-4 control-label " for="service_name">End of Work Day</label>
                        <div class="col-md-5">
                            <div id="endTimePreview"> </div>
                        </div>
                        <br>
                        <br>
                    </div>

                    <div class="createOrgPreview">
                        <label class="col-md-4 control-label " for="service_name">Employee Roles</label>
                        <div class="col-md-5">
                            <div id="employeeRolesPreview"> </div>
                        </div>
                        <br>
                        <br>
                    </div>


                    <!-- Text input-->
                    <label class="col-md-4 control-label" for="service_name">First Name</label>
                    <div class="col-md-5">
                        <div id="firstNamePreview"> </div>
                    </div>
                    <br>
                    <br>

                    <label class="col-md-4 control-label" for="service_name">Last Name</label>
                    <div class="col-md-5">
                        <div id="lastNamePreview"> </div>
                    </div>
                    <br>
                    <br>

                    <label class="col-md-4 control-label" for="service_name">Email</label>
                    <div class="col-md-5">
                        <div id="emailPreview"> </div>
                    </div>
                    <br>
                    <br>

                    <label class="col-md-4 control-label" for="service_name">Birthday</label>
                    <div class="col-md-5">
                        <div id="birthdayPreview"> </div>
                    </div>
                    <br>
                    <br>



                    <button class="btn btn-success btn-lg pull-right" type="button" id="submitButton">Submit</button>
                </div>
            </div>
        </div>
    </form>
</div>

<!-- jQuery -->
<script src="${request.contextPath}/Application/js/jquery.js"></script>
<script src="${request.contextPath}/Application/js/customCalendar.js"></script>
<script src="${request.contextPath}/Application/js/jqueryUI.js"></script>
<script src="${request.contextPath}/Application/js/jquery-ui.min.js"></script>
<script src="${request.contextPath}/Application/js/jquery-ui.min.js"></script>
<script src="${request.contextPath}/Application/js/jasny-bootstrap.js"></script>
<!-- Bootstrap Core JavaScript -->
<script src="${request.contextPath}/Application/js/bootstrap.min.js"></script>

<!-- Bootstrap Core JavaScript -->
<script src="${request.contextPath}/Application/js/driverRegister.js"></script>

</body>
</html>
