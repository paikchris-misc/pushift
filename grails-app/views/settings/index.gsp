<!DOCTYPE html>
<html lang="en">

<head>
    <meta name="layout" content="applicationMain"/>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Profile Settings</title>
    <!-- JASNY CSS -->
    <link href="${request.contextPath}/Application/css/jasny-bootstrap.min.css"
          rel="stylesheet">

    <!-- JASNY CSS -->
    <link href="${request.contextPath}/Application/css/jasny-bootstrap.min.css"
          rel="stylesheet">
    <script src="${request.contextPath}/Application/js/jquery.js"></script>


    <script src="${request.contextPath}/Application/js/settings.js"></script>
</head>

<body>
<div class="mainContentContainerAPP" style="padding:30px;">
    <div class='col-xs-12 customPage-header'>
        <h2 style="">Settings</h2>
    </div>

    <div class='row'>
        <div class="col-xs-12">
            <button class="btn btn-primary pull-right saveSettingsButton" style="margin-bottom:10px; margin-top:10px">Save Changes</button>
        </div>
        <div class='col-xs-6'>

            <div class='panel'>
                <div class='panel-heading'>
                    Personal Info
                </div>

                <div class='panel-body'>


                    <div class="form-group">
                        <label class="col-md-3 control-label" for="service_name">First Name</label>

                        <div class="col-md-6">
                            <input id="firstNameInput" name="service_name" type="text" value="${session.user.firstName}" class="form-control input-md">
                        </div>
                    </div>
                    <br>
                    <br>

                    <div class="form-group">
                        <label class="col-md-3 control-label" for="service_name">Last Name</label>

                        <div class="col-md-6">
                            <input id="lastNameInput" name="service_name" type="text" value="${session.user.lastName}" class="form-control input-md">
                        </div>
                    </div>
                    <br>
                    <br>

                    <div class="form-group">
                        <label class="col-md-3 control-label" for="service_name">Phone Number</label>

                        <div class="col-md-6">
                            <input id="phoneNumberInput" name="service_name" type="text" value="${session.user.phoneNumber}" class="form-control input-md">
                        </div>
                    </div>
                    <br>
                    <br>



                    <div class="form-group">
                        <label class="col-md-3 control-label" for="service_name">Contact Email</label>

                        <div class="col-md-6">
                            <input id="contactEmailInput" name="service_name" type="text" value="${session.user.contactEmail}" class="form-control input-md">
                        </div>
                    </div>
                    <br>
                    <br>

                    <div id="facebookIDHidden" style="display:none"> ${session.user.facebookUserID} </div>
                    <g:if test="${session.user.facebookUserID == null}">
                        <div class="form-group">
                            <label class="col-md-3 control-label" for="service_name">Password</label>

                            <div class="col-md-6">
                                <input id="passwordInput" name="service_name" type="password" value="${session.user.password}" class="form-control input-md">
                            </div>
                        </div>
                        <br>
                        <br>
                    </g:if>
                    <g:else>

                    </g:else>


                    <div class="form-group">
                        <label class="col-md-3 control-label" for="os_id">Birthdate</label>
                        <div id="hiddenBirthday" style="display:none">${session.user.birthday}</div>
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

                    <div class="form-group" id="jobRoleFormGroup" style="">
                        <label class="col-md-3 control-label" for="jobRole">Your Job/Role</label>
                        <div id="hiddenJobRole" style="display:none">${session.user.employeeRole}</div>
                        <div class="col-md-6">
                            <select id="jobRoleSelect" name="" class="form-control">
                                <g:each var="i" in="${ orgRecord.employeeGroups.split(',') }">
                                    <option value="${i}">${i}</option>

                                </g:each>
                            </select>
                        </div>

                    </div>
                    <br><br>

                    <div class="form-group">
                        <label class="col-md-3 control-label" for="pictureInput">Picture</label>
                        <div id="originalProfilePicURL" style="display:none">${request.contextPath}/${session.user.imagePath}</div>
                        <div class="col-md-6" id="profilePicturePreviewDiv">
                            <div class="fileinput fileinput-new pull-left" data-provides="fileinput">
                                <div class="fileinput-preview thumbnail"  data-trigger="fileinput" style="">
                                    <img src="${request.contextPath}/${session.user.imagePath}" alt="" id="profilePicturePreview">
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
            </div>
        </div>

        <div class='col-xs-6'>
            <div class='panel'>
                <div class='panel-heading'>Organization Settings</div>

                <div class='panel-body'>
                    <div class="form-group">
                        <label class="col-md-3 control-label" for="service_name">Organization Name</label>


                        <div class="col-md-6">
                            <g:if test="${session.user.level == "Admin"}">
                                    <input id="organizationNameInput" name="service_name" type="text" value="${orgRecord.name}"
                                       class="form-control input-md">

                            </g:if>
                            <g:else>
                                    ${orgRecord.name}
                            </g:else>
                        </div>
                        <g:if test="${session.user.level == "Admin"}">
                            <br>
                            <br>
                        </g:if>
                        <g:else>
                            <br>
                        </g:else>

                    </div>
                    <div class="form-group"  style="">
                        <label class="col-md-3 control-label" for="">Address 1</label>
                        <div class="col-md-6">

                            <g:if test="${session.user.level == "Admin"}">
                                    <input id="address1Input" name="address1" type="text" value="${orgRecord.streetAddress}" class="form-control input-md">

                            </g:if>
                            <g:else>
                                    ${orgRecord.streetAddress}
                            </g:else>
                        </div>
                        <g:if test="${session.user.level == "Admin"}">
                            <br>
                            <br>
                        </g:if>
                        <g:else>
                            <br>
                        </g:else>

                    </div>
                    <div class="form-group" style="">
                        <label class="col-md-3 control-label" for="">Address 2</label>
                        <div class="col-md-8">

                            <g:if test="${session.user.level == "Admin"}">
                                    <input id="address2Input" name="address2" type="text" value="${orgRecord.streetAddress2}" class="form-control input-md">

                            </g:if>
                            <g:else>
                                    ${orgRecord.streetAddress2}
                            </g:else>
                        </div>
                        <g:if test="${session.user.level == "Admin"}">
                            <br>
                            <br>
                        </g:if>
                        <g:else>
                            <br>
                        </g:else>

                    </div>
                    <div class="form-group" style="">
                        <label class="col-md-3 control-label" for="">City</label>
                        <div class="col-md-8">

                            <g:if test="${session.user.level == "Admin"}">
                                    <input id="cityInput" name="city" type="text" value="${orgRecord.city}"class="form-control input-md">

                            </g:if>
                            <g:else>
                                ${orgRecord.city}
                            </g:else>
                        </div>
                        <g:if test="${session.user.level == "Admin"}">
                            <br>
                            <br>
                        </g:if>
                        <g:else>
                            <br>
                        </g:else>

                    </div>
                    <div class="form-group" style="">
                        <label class="col-md-3 control-label" for="">State</label>
                        <div id="hiddenState" style="display:none">${orgRecord.state}</div>
                        <div class="col-md-8">
                            <g:if test="${session.user.level == "Admin"}">

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

                            </g:if>
                            <g:else>
                                ${orgRecord.state}
                            </g:else>
                        </div>
                        <g:if test="${session.user.level == "Admin"}">
                            <br>
                            <br>
                        </g:if>
                        <g:else>
                            <br>
                        </g:else>

                    </div>
                    <div class="form-group" style="">
                        <label class="col-md-3 control-label" for="">Zipcode</label>
                        <div class="col-md-3">
                            <g:if test="${session.user.level == "Admin"}">

                                    <input id="zipcodeInput" name="city" type="text" value="${orgRecord.zipcode}" class="form-control input-md">

                            </g:if>
                            <g:else>
                                ${orgRecord.zipcode}
                            </g:else>
                        </div>
                        <div class="col-md-3"></div>
                    </div>
                    <g:if test="${session.user.level == "Admin"}">
                        <br>
                        <br>
                        <br>
                    </g:if>
                    <g:else>
                        <br>
                        <br>
                    </g:else>


                    <div class="form-group" style="">
                        <label class="col-md-3 control-label" for="">Employee Roles</label>
                        <div class="col-md-8">
                            <g:if test="${session.user.level == "Admin"}">

                                    <input id="employeeRolesInput" name="employeeRoles" type="text" value="${orgRecord.employeeGroups}" class="form-control input-md">

                            </g:if>
                            <g:else>
                                ${orgRecord.employeeGroups}
                            </g:else>
                        </div>
                        <g:if test="${session.user.level == "Admin"}">
                            <br>
                            <br>
                        </g:if>
                        <g:else>
                            <br>
                        </g:else>
                    </div>

                    <div class="form-group form-inline" style="">
                        <label class="col-md-3 control-label" for="">Start of Work Day</label>
                        <div id="hiddenStartTime" style="display:none">${orgRecord.startTimeOfWorkDay}</div>
                        <div class="col-md-5">
                            <g:if test="${session.user.level == "Admin"}">
                                <select id="startTimeSelect" name="" class="form-control" style='width: 70px'>
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

                                <select id="startTimeSelectMin" name="" class="form-control" style='width: 70px'>
                                    <option value="invalid">-</option>
                                    <option value="00">00</option>
                                    <option value="30">30</option>
                                </select>
                                <select id="startTimeSelectAMPM" name="" class="form-control" style='width: 70px'>
                                    <option value="invalid">-</option>
                                    <option value="AM">AM</option>
                                    <option value="PM">PM</option>
                                </select>
                            </g:if>
                            <g:else>
                                ${orgRecord.startTimeOfWorkDay}
                            </g:else>

                        </div>
                    </div>
                    <g:if test="${session.user.level == "Admin"}">
                        <br>
                        <br>
                        <br>
                    </g:if>
                    <g:else>
                        <br>
                        <br>
                    </g:else>

                    <div class="form-group form-inline" style="">
                        <label class="col-md-3 control-label" for="">End of Work Day</label>
                        <div id="hiddenEndTime" style="display:none">${orgRecord.endTimeOfWorkDay}</div>
                        <div class="col-md-5">
                            <g:if test="${session.user.level == "Admin"}">
                                <select id="endTimeSelect" name="" class="form-control" style='width: 70px'>
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

                                <select id="endTimeSelectMin" name="" class="form-control" style='width: 70px'>
                                    <option value="invalid">-</option>
                                    <option value="00">00</option>
                                    <option value="30">30</option>
                                </select>
                                <select id="endTimeSelectAMPM" name="" class="form-control" style='width: 70px'>
                                    <option value="invalid">-</option>
                                    <option value="AM">AM</option>
                                    <option value="PM">PM</option>
                                </select>
                            </g:if>
                            <g:else>
                                ${orgRecord.endTimeOfWorkDay}
                            </g:else>

                        </div>
                    </div>
                    <g:if test="${session.user.level == "Admin"}">
                        <br>
                        <br>
                    </g:if>
                    <g:else>
                        <br>
                    </g:else>

                    <div class="form-group col-xs-12" style='padding-left:0px'>
                        <label class="col-xs-3" for="test1">Timezone</label>
                        <div class="col-xs-6">
                        <g:if test="${session.user.level == "Admin"}">

                                <select class="form-control" id='test1' style='width: 370px'>
                                    <g:each var="zone" in="${timezoneList}">
                                        <g:if test="${orgRecord.timezone == zone}">
                                            <option selected='selected'>${zone}</option>
                                        </g:if>
                                        <g:else>
                                            <option>${zone}</option>
                                        </g:else>
                                    </g:each>
                                </select>


                        </g:if>
                        <g:else>
                            ${orgRecord.timezone}
                        </g:else>

                        </div>
                    </div>
                    <g:if test="${session.user.level == "Admin"}">
                        <br>
                        <br>
                        <br>
                    </g:if>
                    <g:else>
                        <br>
                    </g:else>

                    <div class="form-group">
                        <label class="col-md-3 control-label" for="OrgID">Organization ID</label>
                        <div class="col-md-4">
                            ${orgRecord.id}
                        </div>
                    </div>
                    <g:if test="${session.user.level == "Admin"}">
                        <br>
                        <br>
                    </g:if>
                    <g:else>
                        <br>
                        <br>
                    </g:else>
                    <!-- Text Input -->
                    <div class="form-group">
                        <label class="col-md-3 control-label" for="OrgPin">Organization Pin #</label>
                        <div class="col-md-4">
                            <g:if test="${session.user.level == "Admin"}">
                                <input id="orgPinInput" name="OrgID" type="text" value="${orgRecord.orgPin}" class="form-control input-md">

                            </g:if>
                            <g:else>
                                ${orgRecord.orgPin}
                            </g:else>

                        </div>
                    </div>
                    <g:if test="${session.user.level == "Admin"}">
                        <br>
                        <br>
                        <br>
                    </g:if>
                    <g:else>
                        <br>
                    </g:else>
                </div>
            </div>
        </div>
        %{--<div class='col-xs-6'>--}%
            %{--<div class='panel'>--}%
                %{--<div class='panel-heading'>--}%
                    %{--Employee Info--}%
                %{--</div>--}%

                %{--<div class='panel-body'>--}%

                %{--</div>--}%
            %{--</div>--}%
        %{--</div>--}%
        <div class="col-xs-12">
            <button class="btn btn-primary pull-right saveSettingsButton" style="margin-bottom:10px; margin-top:10px">Save Changes</button>
        </div>
    </div>

    <div class='row'>

    </div>
</div>
<!-- /#wrapper -->
</body>

</html>
