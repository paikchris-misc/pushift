
<!DOCTYPE html>
<html lang="en">

<head>
    <meta name="layout" content="applicationMain"/>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <link href="${request.contextPath}/Application/css/employee.css" rel="stylesheet">
    <script src="${request.contextPath}/Application/js/jquery.js"></script>
    <script src="${request.contextPath}/Application/js/employee.js"></script>
    <title>Simple Sidebar - Start Bootstrap Template</title>
</head>

<body>
<div id="page-content-wrapper">
    <div class='col-xs-12 page-header'>
        <h2>My Profile</h2>
    </div>
    <div class='row' style="margin-top:6px">
        <div class='col-xs-8'>
            <div class='panel'>
                <div class='panel-heading'>
                    Basic Information
                </div>
                <div class='panel-body'>
                    <div class="row">
                        <div class="col-xs-3">
                            <div><strong></strong></div>
                        </div>
                        <div class="col-xs-4">
                            <div id="pictureDiv"><img src="${imagePath}"></div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-3">
                            <div><strong>Name</strong></div>
                        </div>
                        <div class="col-xs-4">
                            <div id="nameDiv">${userRecord.firstName} ${userRecord.lastName}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-3">
                            <div><strong>Email</strong></div>
                        </div>
                        <div class="col-xs-4">
                            <div id="emailDiv">${userRecord.email}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-3">
                            <div><strong>Birthday</strong></div>
                        </div>
                        <div class="col-xs-4">
                            <div id="birthdayDiv">${userRecord.birthday}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-3">
                            <div><strong>Organization Name</strong></div>
                        </div>
                        <div class="col-xs-4">
                            <div id="orgNameDiv">${orgRecord.name}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-3">
                            <div><strong>Employee Role</strong></div>
                        </div>
                        <div class="col-xs-4">
                            <div id="employeeroleDiv">${userRecord.employeeRole}</div>
                        </div>
                    </div>



                </div>
            </div>
        </div>
    </div>


</div>
<!-- /#wrapper -->
</body>

</html>
