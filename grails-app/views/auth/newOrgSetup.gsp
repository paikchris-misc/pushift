
<!DOCTYPE html>
<html lang="en">

<head>
    <meta name="layout" content="applicationMain"/>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    %{--<link href="${request.contextPath}/Application/css/employee.css" rel="stylesheet">--}%
    <script src="${request.contextPath}/Application/js/jquery.js"></script>
    <script src="${request.contextPath}/Application/js/newOrgSetup.js"></script>
    <script src="${request.contextPath}/Application/js/employees.js"></script>
    <title>Simple Sidebar - Start Bootstrap Template</title>
</head>

%{--need a easy employee input system--}%
%{--employee file import system--}%
%{--shift color selection--}%
%{--verify org start end times--}%
%{--verify geolocation?--}%

%{----}%

<body>
<div class="mainContentContainerAPP" style="padding:30px;">
    <div class='col-xs-12 customPage-header'>
        <h2 style="">Organization Setup</h2>
    </div>
    <div class='row'>
        <div class='col-xs-12' style="margin-left:10px">
            <div class="col-xs-1">

            </div>
            <h5 class="col-xs-2">
                First Name
            </h5>
            <h5 class="col-xs-2">
                Last Name
            </h5>
            <h5 class="col-xs-2">
                Email
            </h5>
            <h5 class="col-xs-2">
                Phone
            </h5>
            <h5 class="col-xs-2">
                Role
            </h5>
        </div>
    </div>
    <div class='row' id="employeeList">
        <div class='col-xs-12 employeeRow' style="">
            <div class="col-xs-1 form-group" style="padding-right:0px;">
                <button class="btn btn-xs btn-success pull-right addEmployeeButton" style="margin-top:5px;"><span class="glyphicon glyphicon-plus" style=""></span> </button>
                <button class="btn btn-xs btn-danger pull-right removeEmployeeButton" style="margin-top:5px; margin-right:5px;"><span class="glyphicon glyphicon-minus" style=""></span> </button>

            </div>
            <div class="col-xs-2 form-group" style="margin-left:5px;">
                <input class="firstNameInput form-control employeeList"  name="service_name" type="text" value="" class="form-control input-md">
            </div>
            <div class="col-xs-2 form-group">
                <input class="lastNameInput form-control employeeList"  name="service_name" type="text" value="" class="form-control input-md">
            </div>
            <div class="col-xs-2 form-group">
                <input class="emailInput form-control employeeList"  name="service_name" type="text" value="" class="form-control input-md">
            </div>
            <div class="col-xs-2 form-group">
                <input class="phoneInput form-control employeeList"  name="service_name" type="text" value="" class="form-control input-md">
            </div>
            <div class="col-xs-2 form-group">
                <select class="form-control employeeRoleSelect  employeeList">
                    <g:each var="shiftType" in="${shiftTypes}">
                        <option value="${shiftType.split(":color:")[0] }">${shiftType.split(":color:")[0]}</option>
                    </g:each>
                </select>
            </div>


        </div>



    </div>
    <div class='row'>
        <div class='col-xs-12'>


            <button type="button" class="btn btn-default pull-right" id="submitButton">Submit</button>
        </div>
    </div>
    <div class='row collapse' id="addCustomerCollapse" >
        <div class='col-xs-12'>
            <div class='customPanel well' style=''>
                <div class='panel-body'>
                    <form class="form-inline">
                        <div class="form-group">
                            <label for="addEmployeeFirstName">First Name</label> <input type="text"
                                                                                        class="form-control" id="addEmployeeFirstName"
                                                                                        placeholder="John">
                        </div>
                        <div class="form-group">
                            <label for="addEmployeeLastName">Last Name</label> <input type="text"
                                                                                      class="form-control" id="addEmployeeLastName"
                                                                                      placeholder="John">
                        </div>
                        <div class="form-group">
                            <label for="exampleInputEmail2">Email</label> <input type="email"
                                                                                 class="form-control" id="exampleInputEmail2"
                                                                                 placeholder="jane.doe@example.com">
                        </div>
                        <button type="submit" class="btn btn-default" style="margin-top:25px">Send
                        invitation</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div class='row' style="margin-top:6px">
        

    </div>




</div>
<!-- /#wrapper -->
</body>

</html>
