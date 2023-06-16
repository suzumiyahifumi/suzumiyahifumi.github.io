// ==UserScript==
// @name         clock-tampermonkey by suzumiyahifumi
// @namespace    https://suzumiyahifumi.com/tampermonkey/clock-tampermonkey.js
// @version      1.0
// @description  上班打卡
// @author       suzumiyahifumi
// @match        https://clock.scsiis-island.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scsiis-island.com
// @grant        none
// @homepage    https://suzumiyahifumi.com/tampermonkey/clock-tampermonkey.js
// @updateURL    https://suzumiyahifumi.com/tampermonkey/clock-tampermonkey.js
// @downloadURL    https://suzumiyahifumi.com/tampermonkey/clock-tampermonkey.js
// ==/UserScript==

(function () {
	'use strict';

	// center 24.966133203581, 121.18768050493
	var myCenter = [24.966133203581, 121.18768050493];
	navigator.geolocation._getCurrentPosition = navigator.geolocation.getCurrentPosition;
	navigator.geolocation.getCurrentPosition = function (success, error, options) {
		return navigator.geolocation._getCurrentPosition(function (_position) {
			let position = {
				coords: {
					latitude: myCenter[0],
					longitude: myCenter[1]
				}
			};
			success(position);
		}, error, options);
	};
})();