@isTest
private class CalendarControllerTest {

	@isTest static void getEventRecordTypeInfos_returns_metadata() {
		CalendarController calendarController = new CalendarController(null);
		String rts = calendarController.getEventRecordTypeInfos();
		System.assert(Pattern.matches('.*"defaultRecordTypeMapping":\\s*true.*', rts),
				'serialized values include a default record type');
	}

	@isTest static void getLabelsAsJson_returns_serialized_map() {
		CalendarController calendarController = new CalendarController(null);
		String labels = calendarController.getLabelsAsJson();
		System.assert(Pattern.matches('.*"Edit_Event"\\s*:".*', labels),
				'serialized map includes the key "Edit_Event"');
	}

	@isTest static void getLocale_returns_a_locale() {
		CalendarController calendarController = new CalendarController(null);
		String locale = calendarController.getLocale();
		System.assert(Pattern.matches('[a-z][a-z](_[A-Z][A-Z])?', locale),
				'locale string matches the pattern xx_XX');
	}

	@isTest static void getTimezone_returns_a_timezone() {
		CalendarController calendarController = new CalendarController(null);
		String timezone = calendarController.getTimezone();
		System.assert(Pattern.matches('[a-zA-Z_\\-]+/[a-zA-Z_\\-/]+', timezone),
				timezone + ' is a time zone');
	}

	@isTest static void getSortFieldsAsJson_returns_serialized_data() {
		CalendarController calendarController = new CalendarController(null);
		String data = calendarController.getSortFieldsAsJson();
		JSONParser parser = JSON.createParser(data);
		List<Account_Scheduler_Sort_Field__mdt> sortFields =
			new List<Account_Scheduler_Sort_Field__mdt>();
		while (parser.nextToken() != null) {
			if (parser.getCurrentToken() == JSONToken.START_OBJECT) {
				Account_Scheduler_Sort_Field__mdt sortField =
					(Account_Scheduler_Sort_Field__mdt) parser.readValueAsStrict(
							Account_Scheduler_Sort_Field__mdt.class);
				sortFields.add(sortField);
			}
		}
		System.assert(sortFields.size() > 0, 'there is at least one sort field');
		Account_Scheduler_Sort_Field__mdt sortField;
		for (Account_Scheduler_Sort_Field__mdt s : sortFields) {
			if (s.Field__c == 'Account.Name') {
				sortField = s;
			}
		}
		System.assertEquals('Account', sortField.Object__c,
				'object type of sort field');
		System.assertEquals('Account.Name', sortField.Field__c,
				'field referenced by sort field');
		System.assertEquals('Ascending', sortField.Default_Sort_Order__c,
				'default sort order of sort field');
		System.assertEquals('Account Name', sortField.Label,
				'label of sort field');
		System.assertEquals(1.0, sortField.Precedence__c,
				'precedence of sort field');
	}

	@isTest static void getSortFieldDefinitionsAsJson_returns_serialized_data() {
		CalendarController calendarController = new CalendarController(null);
		String data = calendarController.getSortFieldDefinitionsAsJson();
		JSONParser parser = JSON.createParser(data);
		List<FieldDefinition> fieldDefinitions = new List<FieldDefinition>();
		while (parser.nextToken() != null) {
			if (parser.getCurrentToken() == JSONToken.START_OBJECT) {
				FieldDefinition fieldDefinition =
					(FieldDefinition) parser.readValueAsStrict(
							FieldDefinition.class);
				fieldDefinitions.add(fieldDefinition);
			}
		}
		System.assert(fieldDefinitions.size() > 0, 'there is at least one field definition');
		FieldDefinition fieldDefinition;
		for (FieldDefinition fd : fieldDefinitions) {
			if (fd.DurableId == 'Account.Name') {
				fieldDefinition = fd;
			}
		}
		System.assertEquals('Account', fieldDefinition.EntityDefinitionId,
			'EntityDefinitionId');
		System.assertEquals('Account.Name', fieldDefinition.DurableId,
			'DurableId');
		System.assertEquals('Name', fieldDefinition.QualifiedApiName,
			'QualifiedApiName');
	}

}
