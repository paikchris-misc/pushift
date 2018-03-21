package pickupmyshift

import javax.activation.MimetypesFileTypeMap;
import javax.imageio.ImageIO;
import java.awt.image.*;

class AuthController {
	def timezoneList = [		"GMT,Greenwich Mean Time,GMT+0:00",
								"UTC,Universal Coordinated Time,GMT+0:00",
								"ECT,European Central Time,GMT+1:00",
								"EET,Eastern European Time,GMT+2:00",
								"ART,(Arabic) Egypt Standard Time,GMT+2:00",
								"EAT,Eastern African Time,GMT+3:00",
								"MET,Middle East Time,GMT+3:30",
								"NET,Near East Time,GMT+4:00",
								"PLT,Pakistan Lahore Time,GMT+5:00",
								"IST,India Standard Time,GMT+5:30",
								"BST,Bangladesh Standard Time,GMT+6:00",
								"VST,Vietnam Standard Time,GMT+7:00",
								"CTT,China Taiwan Time,GMT+8:00",
								"JST,Japan Standard Time,GMT+9:00",
								"ACT,Australia Central Time,GMT+9:30",
								"AET,Australia Eastern Time,GMT+10:00",
								"SST,Solomon Standard Time,GMT+11:00",
								"NST,New Zealand Standard Time,GMT+12:00",
								"MIT,Midway Islands Time,GMT-11:00",
								"HST,Hawaii Standard Time,GMT-10:00",
								"AST,Alaska Standard Time,GMT-9:00",
								"PST,Pacific Standard Time,GMT-8:00",
								"PNT,Phoenix Standard Time,GMT-7:00",
								"MST,Mountain Standard Time,GMT-7:00",
								"CST,Central Standard Time,GMT-6:00",
								"EST,Eastern Standard Time,GMT-5:00",
								"IET,Indiana Eastern Standard Time,GMT-5:00",
								"PRT,Puerto Rico and US Virgin Islands Time,GMT-4:00",
								"CNT,Canada Newfoundland Time,GMT-3:30",
								"AGT,Argentina Standard Time,GMT-3:00",
								"BET,Brazil Eastern Time,GMT-3:00",
								"CAT,Central African Time,GMT-1:00" ]


    def check(){
		print params
		print "Checking Session"
		print "Session = " + session.user
		
		if(!session.user){
			//i.e. user not logged in
			if(params.mobile){
				return true //allows all requests from mobile. No session check.
			}
			else{
				redirect(controller:'auth', action:'login')
				return false
			}

		}
		else{
			return true;
		}
	}

	def mobileLogin(){
		print "LOGGING IN"
		print params
		def user
		if(params.facebookID){
			user = User.findWhere(facebookUserID:params.facebookID)
		}
		else if(params.email){
			user = User.findWhere(email:params.email, password:params.password)
		}

		//if new Registration redirect to new org setup page
		if(params.newOrgRegistration){
			log.warn "Logged In - New Org Setup"
			redirect(controller:'auth',action:'newOrgSetup')
		}
		else{
			if (user){
				log.warn "Logged In"

				def query = User.where { organizationID == user.organizationID }
				def employeeList = query.list();
				def employeeResponseString = "";
				employeeList.each {
					employeeResponseString = employeeResponseString + it.id + "#" + it.firstName + "#" + it.lastName + "#" + it.employeeRole + "#" + it.phoneNumber + "#" + it.imagePath + ",";
				}

				def orgRecord = Organization.get(user.organizationID )
				render ("TRUE:details:" + user.email + ":N:" + user.organizationID + ":N:" +
						orgRecord.shiftTypes + ":N:" + orgRecord.startTimeOfWorkDay + ":N:" +
						orgRecord.endTimeOfWorkDay + ":N:" + orgRecord.calendarTimeInterval + ":N:" + employeeResponseString);

			}
			else{
				log.warn "Log In Fail"
				log.warn "FALSE:details:"
				render "FALSE:details:"
			}
		}
	}
	
	def login(){
		print "LOGGING IN"
		print params
		def user
		if(params.facebookID){
			user = User.findWhere(facebookUserID:params.facebookID)
		}
		else if(params.email){
			user = User.findWhere(email:params.email, password:params.password)
		}

		session.user = user
		print user

		//if new Registration redirect to new org setup page
		if(params.newOrgRegistration){
			log.warn "Logged In - New Org Setup"
			redirect(controller:'auth',action:'newOrgSetup')
		}
		else{
			if (user){
				log.warn "Logged In"
				redirect(controller:'application',action:'index')

			}
			else{
				log.warn "Log In Fail"
			}
		}

	}
	def logout(){
		println "LOGOUT"
		session.user = null;
		redirect(url: "/")
	}
	def register(){
		println "AUTH REGISTER"
		println params
//		def timezoneList = [		"GMT,Greenwich Mean Time,GMT",
//									"UTC,Universal Coordinated Time,GMT",
//									"ECT,European Central Time,GMT+1:00",
//									"EET,Eastern European Time,GMT+2:00",
//									"ART,(Arabic) Egypt Standard Time,GMT+2:00",
//									"EAT,Eastern African Time,GMT+3:00",
//									"MET,Middle East Time,GMT+3:30",
//									"NET,Near East Time,GMT+4:00",
//									"PLT,Pakistan Lahore Time,GMT+5:00",
//									"IST,India Standard Time,GMT+5:30",
//									"BST,Bangladesh Standard Time,GMT+6:00",
//									"VST,Vietnam Standard Time,GMT+7:00",
//									"CTT,China Taiwan Time,GMT+8:00",
//									"JST,Japan Standard Time,GMT+9:00",
//									"ACT,Australia Central Time,GMT+9:30",
//									"AET,Australia Eastern Time,GMT+10:00",
//									"SST,Solomon Standard Time,GMT+11:00",
//									"NST,New Zealand Standard Time,GMT+12:00",
//									"MIT,Midway Islands Time,GMT-11:00",
//									"HST,Hawaii Standard Time,GMT-10:00",
//									"AST,Alaska Standard Time,GMT-9:00",
//									"PST,Pacific Standard Time,GMT-8:00",
//									"PNT,Phoenix Standard Time,GMT-7:00",
//									"MST,Mountain Standard Time,GMT-7:00",
//									"CST,Central Standard Time,GMT-6:00",
//									"EST,Eastern Standard Time,GMT-5:00",
//									"IET,Indiana Eastern Standard Time,GMT-5:00",
//									"PRT,Puerto Rico and US Virgin Islands Time,GMT-4:00",
//									"CNT,Canada Newfoundland Time,GMT-3:30",
//									"AGT,Argentina Standard Time,GMT-3:00",
//									"BET,Brazil Eastern Time,GMT-3:00",
//									"CAT,Central African Time,GMT-1:00" ]
		println timezoneList
		if(params.facebookID){
			render(view: 'register', model: [firstName: params.first_name, lastName: params.last_name, email:params.user_email,
												   pictureURL: params.picture.replace("::AMP::", "&"), userBirthday: params.birthday,
											 facebookID: params.facebookID, timezoneList:timezoneList])
		}
		else{
			render(view: 'register', model: [timezoneList:timezoneList])
		}

	}

	def registerNewUserMobile(){
		println "REGISTER NEW USER MOBILE"
		println params

		def userLevel = "User"
		if(params.registrationType == "createOrg"){
			userLevel = "Admin"
		}

		def webRootPath =  servletContext.getRealPath("/")

		def fileName = java.util.UUID.randomUUID()
		def webPath = "images/profile_pictures/" + fileName + ".jpg";
		def filePath = webRootPath + "images/profile_pictures/" + fileName + ".jpg";

		if(params.pictureData){
			def f = params.pictureData.getInputStream()

			new FileOutputStream(filePath).leftShift( params.pictureData.getInputStream() );
		}
		else if(params.pictureURL){
			String imageUrl = "http://www.avajava.com/images/avajavalogo.jpg";
			String destinationFile = "image.jpg";

			println params.pictureURL + params.oe
			String finalURL = "" + params.pictureURL + "&oe=" + params.oe
			URL url = new URL(finalURL);
			InputStream is = url.openStream();
			OutputStream os = new FileOutputStream(filePath);

			byte[] b = new byte[2048];
			int length;

			while ((length = is.read(b)) != -1) {
				os.write(b, 0, length);
			}

			is.close();
			os.close();

			println "DONE WITH PICTURE"
		}
		else{
			filePath = "error"
			webPath = "error";
		}



		try{
			User u = new pickupmyshift.User(employeeRole:params.userRole, email:params.email, contactEmail:params.email, phoneNumber: params.phoneNumber, password:params.password, level:userLevel, organizationID:params.orgID, firstName: params.firstName, lastName: params.lastName,
					availabilityEvents: "", imagePath: webPath, facebookUserID: params.facebookID, birthday: params.birthdayMonth + "/" + params.birthdayDay + "/" + params.birthdayYear)
			u.save(flush: true, failOnError: true)
//		u.imagePayload = params.pictureURL;
//		u.save();
//		picture = new java.io.File("/universe/pickupmyshift/web-app/images/profile_pictures/2.jpg");
//		tempuser.imagePayload = picture.getBytes()
//		tempuser.save()
			println "good"
			render "good"
		}
		catch(Exception e){
			if(User.findWhere(email:params.email) ){
				render "User with that email already exists."
				println e
			}
			else{
				render "Error Could Not Register"
				println e
			}

		}


	}
	def registerNewUser(){
		println "REGISTER NEW USER"
		println params

		def userLevel = "User"
		if(params.registrationType == "createOrg"){
			params.orgID = registerNewOrg(params);
			userLevel = "Admin"
		}

		def webRootPath =  servletContext.getRealPath("/")

		def fileName = java.util.UUID.randomUUID()
		def webPath = "images/profile_pictures/" + fileName + ".jpg";
		def filePath = webRootPath + "images/profile_pictures/" + fileName + ".jpg";

		if(params.pictureData){
			def f = params.pictureData.getInputStream()

			new FileOutputStream(filePath).leftShift( params.pictureData.getInputStream() );
		}
		else if(params.pictureURL){
			String imageUrl = "http://www.avajava.com/images/avajavalogo.jpg";
			String destinationFile = "image.jpg";

			URL url = new URL(params.pictureURL);
			InputStream is = url.openStream();
			OutputStream os = new FileOutputStream(filePath);

			byte[] b = new byte[2048];
			int length;

			while ((length = is.read(b)) != -1) {
				os.write(b, 0, length);
			}

			is.close();
			os.close();
		}
		else{
			filePath = "error"
			webPath = "error";
		}


		try{
			User u = new pickupmyshift.User(employeeRole:params.userRole, email:params.email, contactEmail:params.email, phoneNumber: params.phoneNumber, password:params.password, level:userLevel, organizationID:params.orgID, firstName: params.firstName, lastName: params.lastName,
					availabilityEvents: "", imagePath: webPath, facebookUserID: params.facebookID, birthday: params.birthdayMonth + "/" + params.birthdayDay + "/" + params.birthdayYear)
			u.save(flush: true, failOnError: true)
//		u.imagePayload = params.pictureURL;
//		u.save();
//		picture = new java.io.File("/universe/pickupmyshift/web-app/images/profile_pictures/2.jpg");
//		tempuser.imagePayload = picture.getBytes()
//		tempuser.save()

			render "good"
		}
		catch(Exception e){
			if(User.findWhere(email:params.email) ){
				render "User with that email already exists."
			}
		}


	}

	def newOrgSetup(){
		println "NEW ORG SETUP"
		def record = Organization.get(session.user.organizationID)

		def shiftTypeArray = record.shiftTypes.split(";");

		[shiftTypes: shiftTypeArray]
	}

	def verifyOrg() {
		println "VERIFYING ORG"
		println params
		if(params.orgID == null){
			render "false:/:"
			return;
		}
		def record = Organization.get(params.orgID)
		if(params.orgPin == null || record == null){
			render "false:/:"
			return;
		}
		if(record.orgPin == params.orgPin){
			render "true:/:" + record.name +  ":/:" + record.shiftTypes;
		}
		else{
			render "false:/:"
		}


	}

	def registerNewOrgMobile(){
		println 'NEW ORG REGISTRATION!'
		println params

		String timezone = params.timezone;
		println "TIMEZONE =====" + timezone
		if(params.latlng && (params.timezone.length() <1)){ //request was sent with lat and lng. Need to figure out timezone

			String tzName  = PickupUtilities.getUTCoffset(params.latlng);
			System.out.println(tzName);
//			for(int i=0; i<timezoneList.size();i++){
////				if(UTCresultString.split("\\.")[0].equals(timezoneList[i].split(",")[2].split(":")[0].substring(4))  ){
////					timezone = timezoneList[i]
////				}
//				if(timezoneList[i].split(",")[1].indexOf(tzName) > -1){
//					timezone = timezoneList[i].split(",")[1];
//				}
//			}

			//if not matched and still no timezone, set it to Error UTC
//			if(timezone.length()< -1){
//				timezone = timezoneList[0];
//			}
			timezone = tzName.split(",")[0] + "," + tzName;

		}
		println "TIMEZONE =====" + timezone
		
//		String startTime = params.startTime;
//		println params.startTime.split(" ")[1]
//		if(!params.startTime.split(" ")[1].equals("00") || !params.startTime.split(" ")[1].equals("30")){
//			System.out.println ("Adjusting TIME minute to nearest half hour     SLDKFSLKF")
//			int sm = Integer.parseInt(params.startTime.split(" ")[0].split(":")[1]);
//			if (sm > 30 ){
//				sm = 30
//				startTime = startTime.split(":")[0] + " " + Integer.toString(sm) + " " + startTime.split(" ")[1]
//			}
//			else {
//				sm =0;
//				startTime = (Integer.parseInt(startTime.split(":")[0]) -1) + " " + "00" + " " + startTime.split(" ")[1]
//			}
//		}

//		String endTime = params.endTime;
//		if(!params.endTime.split(" ")[1].equals("00") || !params.endTime.split(" ")[1].equals("30")){
//			int sm = Integer.parseInt(params.endTime.split(" ")[0].split(":")[1]);
//			if (sm > 30 ){
//				sm = 30
//				endTime = endTime.split(":")[0] + " " + "30" + " " + endTime.split(" ")[1]
//			}
//			else {
//				sm =0;
//				endTime = (Integer.parseInt(endTime.split(":")[0]) +1) + " " + "00" + " " + endTime.split(" ")[1]
//			}
//		}

		String startTime = params.startTime;
		String endTime = params.endTime;


//		5652 Pickwick Road, Centerville, VA 20120, United States
		// formatting address
		if(params.address1.length() < 1){
			params.address1 = params.googleFormattedAddress.split(",")[0].trim();
		}

		if(params.city.length() < 1){
			params.city = params.googleFormattedAddress.split(",")[1].trim();
		}
		if(params.state.length() <1){
			System.out.println( "ADJUSTING STATE");
			params.state = params.googleFormattedAddress.split(",")[2].trim().split(" ")[0];
		}
		if(params.zipcode.length() <1){
			params.zipcode = params.googleFormattedAddress.split(",")[2].trim().split(" ")[1];
		}

		System.out.println("State is ========= " + params.state);
		Organization org = new pickupmyshift.Organization(name:params.orgName,
				streetAddress:params.address1,
				streetAddress2:params.address2,
				city:params.city,
				state:params.state,
				zipcode:params.zipcode,
				startTimeOfWorkDay: startTime,
				endTimeOfWorkDay: endTime,
				timezone: timezone, //NEED TO UPDATE
				employeeGroups: params.employeeRoles,
				shiftTypes: params.employeeRoles,
				facebookUserID: params.facebookID,
				orgPin: params.orgPinSet);
		org.save(flush: true, failOnError: true)

		//println "NEW ORGANIZATION ID = " + org.id;

		render "good;" + org.id

	}

	def registerNewOrg(params){
		println 'NEW ORG REGISTRATION!'
		println params

		Organization org = new pickupmyshift.Organization(name:params.orgName,
				streetAddress:params.address1,
				streetAddress2:params.address2,
				city:params.city,
				state:params.state,
				zipcode:params.zipcode,
				startTimeOfWorkDay: params.startTime,
				endTimeOfWorkDay: params.endTime,
				timezone: params.timezone, //NEED TO UPDATE
				employeeGroups: params.employeeRoles,
				shiftTypes: params.employeeRoles,
				facebookUserID: params.facebookID,
				orgPin: params.orgPinSet);
		org.save(flush: true, failOnError: true)

		//println "NEW ORGANIZATION ID = " + org.id;

		return org.id

	}
	def isRegistered(){
		println "CHECKING REGISTRATION STATUS"
		println params

		//println User.findAllByFacebookUserID(params.facebookID).size();
		if(params.facebookID){
			if(User.findAllByFacebookUserID(params.facebookID).size() == 0){
				println "NOT REGISTERED"
				render "false;"
			}
			else{
				println "Registered"
				render "true;" + params.facebookID;
				//redirect  (controller: "auth" , action:"login")
			}
		}
		else if(params.email){
			if(User.findAllByEmail(params.email).size() == 0){
				println "NOT REGISTERED"
				render "false;"
			}
			else{
				println "Registered"
				render "true;"
				//redirect  (controller: "auth" , action:"login")
			}

		}

	}
}
