package pickupmyshift

class User {
	
	Long id
	Long version
	
	String email
	String contactEmail
	String firstName
	String lastName
	String password
	String level
	String employeeRole
	Long organizationID
	String tempUser
	String availabilityEvents
	String imagePath
	String facebookUserID
	String birthday
	String phoneNumber

	String toString(){
		"$email"
	}
	
    static constraints ={
		email(email:true, unique:true)
		password(blank:true, password:true)
		employeeRole(role:true)
		tempUser nullable: true
		availabilityEvents nullable: true
		imagePath(nullable:true, maxSize:1073741824) // max of 4GB file for example

		contactEmail nullable:true
		password nullable:true
		facebookUserID nullable: true
		birthday nullable: true
	}
}
