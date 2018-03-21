package pickupmyshift

class Event {
    Long id
    Long version
    Long orgID
    String eventID
    Date dateOfEvent
    String notes
    String formattedDate
    String shiftType
    String numberOfShifts
    String employeesScheduled
    String weeklyOrOneTime
    Date startTime
    Date endTime
    String dayOfWeek
    String unformattedTime
    String isParent
    Date seriesStartDate
    Date seriesEndDate
    String parentShiftID
    String childShiftOriginalDate //if the event is ever moved
    String eventRepeat
    String repeatEnd
    String repeatEndAfter
    String repeatEndDate


    static constraints = {
        notes nullable: true
        employeesScheduled nullable: true
        parentShiftID nullable: true
        startTime nullable: true
        endTime nullable: true
        seriesStartDate nullable:true
        seriesEndDate nullable:true
        childShiftOriginalDate nullable:true
        eventRepeat nullable:true
        repeatEnd nullable:true
        repeatEndAfter nullable:true
        repeatEndDate nullable:true
        String unformattedTime

        
    }
}