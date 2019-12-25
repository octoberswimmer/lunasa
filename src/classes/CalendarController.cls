public with sharing class CalendarController {
	public Boolean weekends {get; set;}
	public String earliestTime {get; set;}
	public String latestTime {get; set;}

	public CalendarController(ApexPages.StandardSetController stdController) {
		Lunasa_Settings__c lunasaSettings = Lunasa_Settings__c.getInstance();

		this.weekends = !lunasaSettings.Hide_Weekends__c;
		this.earliestTime = lunasaSettings.Earliest_Time__c;
		this.latestTime = lunasaSettings.Latest_Time__c;
	}

	public String getEventRecordTypeInfos() {
		List<RecordTypeInfo> infos = Event.SObjectType.getDescribe().getRecordTypeInfos();
		return JSON.serialize(infos);
	}

	public String getLabelsAsJson() {
		Map<String, String> labels = new Map<String, String>();
		labels.put('All', System.Label.All);
		labels.put('Are_You_Sure', System.Label.Are_You_Sure);
		labels.put('Cancel_Delete', System.Label.Cancel_Delete);
		labels.put('Cancel_Editing', System.Label.Cancel_Editing);
		labels.put('Confirm_Delete', System.Label.Confirm_Delete);
		labels.put('Date', System.Label.Date);
		labels.put('Delete_Event', System.Label.Delete_Event);
		labels.put('Edit_Event', System.Label.Edit_Event);
		labels.put('Event', System.Label.Event);
		labels.put('Event_Will_Be_Deleted', System.Label.Event_Will_Be_Deleted);
		labels.put('Field_Required', System.Label.Field_Required);
		labels.put('Invalid_Date', System.Label.Invalid_Date);
		labels.put('Invalid_Time', System.Label.Invalid_Time);
		labels.put('Loading', System.Label.Loading);
		labels.put('Next_Page', System.Label.Next_Page);
		labels.put('Other', System.Label.Other);
		labels.put('Page_Number_With_Page_Count', System.Label.Page_Number_With_Page_Count);
		labels.put('Previous_Page', System.Label.Previous_Page);
		labels.put('Save_Event', System.Label.Save_Event);
		labels.put('Search', System.Label.Search);
		labels.put('Selected_Accounts', System.Label.Selected_Accounts);
		labels.put('Sort_by', System.Label.Sort_by);
		labels.put('Layout_by', System.Label.Layout_by);
		labels.put('Time', System.Label.Time);
		labels.put('Toggle_Sort_Direction', System.Label.Toggle_Sort_Direction);
		return JSON.serialize(labels);
	}

	public String getLocale() {
		return UserInfo.getLocale();
	}

	public String getTimezone() {
		return UserInfo.getTimezone().toString();
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
			ORDER BY Precedence__c
		];
		return JSON.serialize(sortFields);
	}

	public String getSortFieldDefinitionsAsJson() {
		List<FieldDefinition> fieldDefinitions = [
			SELECT ValueTypeId, DurableId, QualifiedApiName
			FROM FieldDefinition
			WHERE
				EntityDefinition.QualifiedApiName = 'Account' AND
				DurableId IN (
					SELECT Field__c FROM Account_Scheduler_Sort_Field__mdt
				)
		];
		return JSON.serialize(fieldDefinitions);
	}
}
