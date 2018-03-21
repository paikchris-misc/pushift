package pickupmyshift

class Organization {
	Long id
	Long version
	String name
	String streetAddress
	String streetAddress2
	String city
	String state
	String zipcode
	String startTimeOfWorkDay
	String endTimeOfWorkDay
	String timezone
	int calendarTimeInterval = 30
	String employeeGroups
	String shiftTypes
	String oneTimeShifts
	String weeklyShifts
	String schedule
	String defaultSchedule
	String orgPin
	String dataSource
	String googleFormattedAddress
	
    static constraints = {
		employeeGroups nullable: true
		employeeGroups(maxSize:50000000)
		shiftTypes nullable: true
		shiftTypes(maxSize:50000000)
		oneTimeShifts nullable: true
		oneTimeShifts(maxSize:50000000)
		schedule nullable: true
		schedule(maxSize:50000000)
		weeklyShifts nullable: true
		weeklyShifts(maxSize:50000000)
		defaultSchedule nullable: true
		defaultSchedule(maxSize:50000000)

		streetAddress2 nullable: true
		city nullable:true
		state nullable:true
		zipcode nullable:true
		orgPin nullable:true
		googleFormattedAddress nullable:true
    }
}
