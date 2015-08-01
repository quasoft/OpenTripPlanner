/* German initialisation for the jQuery UI date picker plugin. */
/* Written by Milian Wolff (mail@milianw.de). */
jQuery(function($){
	$.datepicker.regional['bg'] = {
		closeText: 'Затвори',
		prevText: '&#x3C;назад',
		nextText: 'напред&#x3E;',
		currentText: 'днес',
		monthNames: ['Януари','Февруари','Март','Април','Май','Юни',
		'Юли','Август','Септември','Октомври','Ноември','Декември'],
		monthNamesShort: ['Яну','Фев','Мар','Апр','Май','Юни',
		'Юли','Авг','Сеп','Окт','Ное','Дек'],
		dayNames: ['Неделя','Понеделник','Вторник','Сряда','Четвъртък','Петък','Събота'],
		dayNamesShort: ['Нд','Пн','Вт','Ср','Чт','Пт','Сб'],
		dayNamesMin: ['Н','П','В','С','Ч','П','С'],
		weekHeader: 'KW',
		dateFormat: 'dd.mm.yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: 'г.'};
	$.datepicker.setDefaults($.datepicker.regional['bg']);
});
