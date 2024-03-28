// JavaScript code goes here

let selectedRow = null; // To keep track of the selected row

// Sample subtitle data
const subtitles = [
	{ line: 1, start: '00:00:10.000', end: '00:00:15.000', style: 'Default', text: 'This is subtitle line 1' },
	{ line: 2, start: '00:00:20.000', end: '00:00:25.000', style: 'Default', text: 'This is subtitle line 2' },
	{ line: 4, start: '00:00:30.000', end: '00:00:35.000', style: 'Default', text: 'This is subtitle line 4' },
	{ line: 5, start: '00:00:30.000', end: '00:00:35.000', style: 'Default', text: 'This is subtitle line 5' },
	{ line: 6, start: '00:00:30.000', end: '00:00:35.000', style: 'Default', text: 'This is subtitle line 6' },
	// Add more subtitle data as needed
];

// Function to generate subtitle table
function generateSubtitleTable() {
	const table = document.createElement('table');
	const headerRow = table.insertRow();
	headerRow.innerHTML = "<th>Line</th><th>Start Time</th><th>End Time</th><th>Style</th><th>Content</th>";

	subtitles.forEach(subtitle => {
		const row = table.insertRow();
		row.innerHTML = `<td>${subtitle.line}</td><td>${subtitle.start}</td><td>${subtitle.end}</td><td>${subtitle.style}</td><td>${subtitle.text}</td>`;
		row.addEventListener('click', () => {
			selectRow(row);
		});
	});

	document.getElementById('subtitleTable').appendChild(table);
}

// Function to select a row
function selectRow(row) {
	if (selectedRow) {
		selectedRow.classList.remove('selected');
	}
	selectedRow = row;
	selectedRow.classList.add('selected');
}

// Function to handle key press events
document.addEventListener('keydown', (event) => {
	if (selectedRow) {
		const videoPlayer = document.getElementById('videoPlayer');
		const currentTime = videoPlayer.currentTime * 1000;

		switch (event.key) {
			case 'i':
				selectedRow.cells[1].textContent = formatTime(currentTime);
				break;
			case 'o':
				selectedRow.cells[2].textContent = formatTime(currentTime);
				break;
			case 'p':
				selectedRow.cells[2].textContent = formatTime(currentTime);
				if (subtitles[selectedRow.rowIndex]) {
					selectRow(selectedRow.nextElementSibling); // Select the next row
					selectedRow.cells[1].textContent = formatTime(currentTime);
					selectRow(selectedRow); // If no next row, stay on the current row
					selectedRow.cells[1].textContent = formatTime(currentTime);
				}
				break;
			case 'ArrowUp':
				if (selectedRow.previousElementSibling) {
					selectRow(selectedRow.previousElementSibling);
				}
				break;
			case 'ArrowDown':
				if (selectedRow.nextElementSibling) {
					selectRow(selectedRow.nextElementSibling);
				}
				break;
		}
	}
});

// Function to format time from milliseconds to HH:MM:SS.mmm
function formatTime(milliseconds) {
	const date = new Date(null);
	date.setMilliseconds(milliseconds);
	const formattedMilliseconds = ('00' + date.getMilliseconds()).slice(-3); // Ensure milliseconds are always three digits
	return date.toISOString().substr(11, 8) + '.' + formattedMilliseconds.slice(0, 2); // Format milliseconds with two decimal places
}

// Generate subtitle table when the page loads
window.onload = generateSubtitleTable;
