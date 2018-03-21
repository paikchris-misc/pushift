package pickupmyshift

class SettingsController {
	AuthController ac = new AuthController()
	def beforeInterceptor = [action:this.&checkUser]
	
    def index() {
		println "In settings"
		println "OrganizationID = " + session.user.organizationID
		def record = Organization.get(session.user.organizationID)
		println record.startTimeOfWorkDay


		def timezoneList = [		"GMT,Greenwich Mean Time,GMT",
									"UTC,Universal Coordinated Time,GMT",
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
		[pageName:"Settings", orgRecord: record, timezoneList:timezoneList ]
		
		
		
		
	}
	
	def checkUser(){
		AuthController ac = new AuthController()
		ac.check()
	}
	
	def settings(){
		
	}

	def updateSettings(){
		println "UPDATING SETTINGS"

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
		}

		def updateRecord = User.get(session.user.id);

		if(params.contactEmail != updateRecord.contactEmail){
			updateRecord.contactEmail = params.contactEmail
		}
		if(params.firstName != updateRecord.firstName){
			updateRecord.firstName = params.firstName
		}
		if(params.lastName != updateRecord.lastName){
			updateRecord.lastName = params.lastName
		}
		if(params.password && (params.password != updateRecord.password)){
			updateRecord.password = params.password
		}
//		if(params.level != updateRecord.level){
//			updateRecord.level = params.level
//		}
		if(params.userRole != updateRecord.employeeRole){
			updateRecord.employeeRole = params.userRole
		}
		if(params.pictureURL != updateRecord.imagePath){
			updateRecord.imagePath = webPath
		}
		def tempBirthday = params.birthdayMonth + "/" + params.birthdayDay + "/" + params.birthdayYear
		if(tempBirthday != updateRecord.birthday){
			updateRecord.birthday = tempBirthday
		}
		if(params.phoneNumber != updateRecord.phoneNumber){
			updateRecord.phoneNumber = params.phoneNumber
		}
		try {
			updateRecord.save(failOnError: true);
		}
		catch (Exception e) {
			println e;
		}
		updateRecord.save(flush: true);



		updateRecord = Organization.get(session.user.organizationID);
		if(params.orgName  && params.orgName != updateRecord.name){
			updateRecord.name = params.orgName
		}
		if(params.address1  && params.address1 != updateRecord.streetAddress){
			updateRecord.streetAddress = params.address1
		}
		if(params.address2  && params.address2 != updateRecord.streetAddress2){
			updateRecord.streetAddress = params.address2
		}
		if(params.city  && params.city != updateRecord.city){
			updateRecord.city = params.city
		}
		if(params.state  && params.state != updateRecord.state){
			updateRecord.state = params.state
		}
		if(params.zipcode  && params.zipcode != updateRecord.zipcode){
			updateRecord.zipcode = params.zipcode
		}
		if(params.startTime  && params.startTime != updateRecord.startTimeOfWorkDay){
			updateRecord.startTimeOfWorkDay = params.startTime
		}
		if(params.endTime  && params.endTime != updateRecord.endTimeOfWorkDay){
			updateRecord.endTimeOfWorkDay = params.endTime
		}
		if(params.timezone  && params.timezone != updateRecord.timezone){
			updateRecord.timezone = params.timezone
		}
		if(params.timezone  && params.timezone != updateRecord.timezone){
			updateRecord.timezone = params.timezone
		}
		if(params.employeeRoles  && params.employeeRoles != updateRecord.employeeGroups){
			updateRecord.employeeGroups = params.employeeRoles
		}
//		ADD SHIFT TYPES AND COLORS
		//ADD PIN




		//relogin
		def tempUser = session.user
		session.user = null;
		def user
		if(tempUser.facebookUserID && tempUser.facebookUserID.length() > 0 ){
			user = User.findWhere(facebookUserID:tempUser.facebookUserID)
		}
		else if(tempUser.email){
			user = User.findWhere(email:tempUser.email, password:tempUser.password)
		}

		session.user = user
		print user
		if (user){
			render "good"

		}
		else{
			render "bad"
		}
		render "bad"
	}

}
