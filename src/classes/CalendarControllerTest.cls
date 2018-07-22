@isTest
private class CalendarControllerTest {

	@isTest static void getLocale_returns_a_locale() {
		CalendarController calendarController = new CalendarController(null);
		String locale = calendarController.getLocale();
		System.assert(Pattern.matches('[a-z][a-z](_[A-Z][A-Z])?', locale),
				'locale string matches the pattern xx_XX');
	}

}
