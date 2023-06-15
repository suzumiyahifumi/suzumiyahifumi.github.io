/* jshint esversion: 9 */
const pageEnd = 16;
const pageStart = 1;

function getBookLink(page) {
	return bookLink = `/appdist/img/俠客吟系列《羅刹品》-${page}.png`;
}

function nextPage() {
	let page1 = Number($('#page1').attr('page'));
	let page2 = Number($('#page2').attr('page'));
	if (page2 >= pageEnd || page1 >= pageEnd) return;
	page1 = page1+2;
	page2 = page2+2;
	$('#page1').attr('page', page1);
	$('#page2').attr('page', page2);
	$('#page1').find('img').attr('src', getBookLink(page1));
	$('#page2').find('img').attr('src', getBookLink(page2));
	return;
}

function previousPage() {
	let page1 = Number($('#page1').attr('page'));
	let page2 = Number($('#page2').attr('page'));
	if (page1 <= pageStart) return;
	page1 = page1-2;
	page2 = page2-2;
	$('#page1').attr('page', page1);
	$('#page2').attr('page', page2);
	$('#page1').find('img').attr('src', getBookLink(page1));
	$('#page2').find('img').attr('src', getBookLink(page2));
	return;
}

function preload() {
	for (let i = pageStart; i <= pageEnd; i++) {
		images = new Image();
		images.src = getBookLink(i);
	}
}