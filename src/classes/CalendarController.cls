public class CalendarController {

	public CalendarController(ApexPages.StandardSetController stdController) {
	}

	public String getSortFieldsAsJson() {
		List<Account_Scheduler_Sort_Field__mdt> sortFields = [
			SELECT
				Default_Sort_Order__c,
				Field__c,
				Id,
				Label,
				Object__c,
				Precedence__c
			FROM Account_Scheduler_Sort_Field__mdt
		];
		return JSON.serialize(sortFields);
	}

	public String getLocale() {
		return userInfo.getLocale();
	}

}
