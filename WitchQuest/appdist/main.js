/* jshint esversion: 9 */
$(function () {

	var cardsArray = ["騙子", "星辰", "公主", "杖", "國王", "愛人", "血", "太陽", "貓", "仙女", "風", "毒藥", "夢", "惡夢", "平衡", "月", "寶石", "劍", "風暴", "龍", "深空", "大海", "魔女", "銀", "河川", "黃金", "天空", "戰士", "旅人"];

	var cards = [{
		id:0,
		name: "騙子"
	},
	{
		id: 1,
		name: "星辰"
	}, {
		id: 2,
		name: "公主"
	}, {
		id: 3,
		name: "杖"
	}, {
		id: 4,
		name: "國王"
	}, {
		id: 5,
		name: "愛人"
	}, {
		id: 6,
		name: "血"
	}, {
		id: 7,
		name: "太陽"
	}, {
		id: 8,
		name: "貓"
	}, {
		id: 9,
		name: "仙女"
	}, {
		id: 10,
		name: "風"
	}, {
		id: 11,
		name: "毒藥"
	}, {
		id: 12,
		name: "夢"
	}, {
		id: 13,
		name: "惡夢"
	}, {
		id: 14,
		name: "平衡"
	}, {
		id: 15,
		name: "月"
	}, {
		id: 16,
		name: "寶石"
	}, {
		id: 17,
		name: "劍"
	}, {
		id: 18,
		name: "風暴"
	}, {
		id: 19,
		name: "龍"
	}, {
		id: 20,
		name: "深空"
	}, {
		id: 21,
		name: "大海"
	}, {
		id: 22,
		name: "魔女"
	}, {
		id: 23,
		name: "銀"
	}, {
		id: 24,
		name: "河川"
	}, {
		id: 25,
		name: "黃金"
	}, {
		id: 26,
		name: "天空"
	}, {
		id: 27,
		name: "戰士"
	}, {
		id: 28,
		name: "旅人"
	}
];

	for(let card of cards){
		$("#deck").append(`
			<div id="${card.id}_${card.name}" class="card" name="${card.name}">
				<div class="paper paperFront">
					<div class="page front">
						<label></label>
					</div>
					<div class="page back" style="background-image: url('./appdist/cards/塔羅牌_正面_卡牌輸出_${card.id}_${card.name}.png');background-size: cover;">
						<label></label>
					</div>
				</div>
			</div>`);
	//	dragElement(document.getElementById(`${card.id}_${card.name}`));
	}


	$(".card").each(function(){
		$(this).draggable({
			containment: "#containter",
			scroll: false,
			revert: "invalid"
		});
		
		$(this).mousedown(function () {
			if(!$(this).hasClass("card_p")) {
				$(this).insertAfter($(".card").get(-1));
			}
		});

		$(this).mouseup(function () {
			if ($(".card_p").length>0 && !$(this).hasClass("card_p")) {
				$(this).insertBefore($(".card_p").get(0));
			}
		});
		
		$(this).contextmenu(function () {
			overturn($(this));
		});
	});

	$(".deck").droppable({
		accept: ".card",
		over: function (event, ui) {
			let droppable = $(this);
			if (!droppable.hasClass("deck-onDrop")) droppable.addClass("deck-onDrop");
		},
		out: function (event, ui) {
			let droppable = $(this);
			let draggable = ui.draggable;
			if (droppable.hasClass("deck-onDrop")) droppable.removeClass("deck-onDrop");
		},
		drop: function (event, ui) {
			let droppable = $(this);
			let draggable = ui.draggable;
			let p = draggable.hasClass("card_p");
			if (droppable.hasClass("deck-onDrop")) droppable.removeClass("deck-onDrop");
			draggable.removeClass(["card_0", "card_1", "card_2", "card_3", "card_4", "card_p"]);
			let card_ID = {
				"deck_0": "card_0",
				"deck_1": "card_1",
				"deck_2": "card_2",
				"deck_3": "card_3",
				"deck_4": "card_4",
				"player": "card_p"
			};
			let cardClass = card_ID[droppable.attr("id")];
			let k = $(`.${cardClass}`).length;
			draggable.addClass(cardClass);
			if (cardClass == "card_0") {
				draggable.animate({
					top: droppable.offset().top + 4 - 0.2 * k,
					left: droppable.offset().left + 4 - 0.1 * k
				});
			} else if (cardClass == "card_p") {
				if (!p) draggable.insertAfter($(".card_p").get(-1));
				refreshPlayer();
			} else {
				draggable.animate({
					top: droppable.offset().top + 4 - 0.8 * k,
					left: droppable.offset().left + 4 - 0.8 * k
				});
			}
			refreshPlayer();
		}
	});

	$(window).resize(function () {
		return2Deck();
	});

	shuffle();

	function overturn(ele){
		$(ele).find(".paperFront").css({
			"transform": "rotateY(-180deg)"
		});
		$(ele).find(".paperBack").css({
			"transform": "rotateY(0deg)"
		});
		$(ele).find(".paper").toggleClass("paperFront").toggleClass("paperBack");
	}

	function all2Deck_0 () {
		let deck_0 = $("#deck_0").offset();
		let j = 0;
		$(".card").each(function () {
			$(this).removeClass(["card_0", "card_1", "card_2", "card_3", "card_4", "card_p"]).addClass("card_0");
			$(this).animate({
				top: deck_0.top + 4 - 0.2 * j,
				left: deck_0.left + 4 - 0.1 * j
			});
			j++;
		});
		return;
	}

	function go2Deck_0 (ele, k){
		$(ele).removeClass(["card_0", "card_1", "card_2", "card_3", "card_4", "card_p"]).addClass("card_0");
		let deck_0 = $("#deck_0").offset();
		$(ele).animate({top: deck_0.top+4-0.2*k, left: deck_0.left+4-0.1*k}, 1500);
		return;
	}
	function go2Deck_1(ele, k) {
		$(ele).removeClass(["card_0", "card_1", "card_2", "card_3", "card_4", "card_p"]).addClass("card_1");
		let deck_1 = $("#deck_1").offset();
		$(ele).animate({top: deck_1.top+4-0.8*k, left: deck_1.left+4-0.8*k}, 1500);
		return;
	}
	function go2Deck_2(ele, k) {
		$(ele).removeClass(["card_0", "card_1", "card_2", "card_3", "card_4", "card_p"]).addClass("card_2");
		let deck_2 = $("#deck_2").offset();
		$(ele).animate({top: deck_2.top+4-0.8*k, left: deck_2.left+4-0.8*k}, 1500);
		return;
	}
	function go2Deck_3(ele, k) {
		$(ele).removeClass(["card_0", "card_1", "card_2", "card_3", "card_4", "card_p"]).addClass("card_3");
		let deck_3 = $("#deck_3").offset();
		$(ele).animate({top: deck_3.top+4-0.8*k, left: deck_3.left+4-0.8*k}, 1500);
		return;
	}
	function go2Deck_4(ele, k) {
		$(ele).removeClass(["card_0", "card_1", "card_2", "card_3", "card_4", "card_p"]).addClass("card_4");
		let deck_4 = $("#deck_4").offset();
		$(ele).animate({top: deck_4.top+4-0.8*k, left: deck_4.left+4-0.8*k}, 1500);
		return;
	}
	function go2Deck_p(ele, k) {
		$(ele).removeClass(["card_0", "card_1", "card_2", "card_3", "card_4", "card_p"]).addClass("card_p");
		refreshPlayer();
		return;
	}

	function refreshPlayer(type){
		let w = $("#player").width();
		let k = $(".card_p").length;
		let cw = $(".card").width();
		let R = 20; // 間距
		let L = (k * cw) + ((k - 1) * R);
		let s = (w / 2) - (L / 2);
		$(".card_p").each(function (index) {
			if(type == "css"){
				$(this).css({
					top: $("#player").offset().top,
					left: $("#player").offset().left + s + ((R + cw) * index)
				});
			} else {
				$(this).animate({
					top: $("#player").offset().top,
					left: $("#player").offset().left + s + ((R + cw) * index)
				});
			}
			$(this).insertAfter($(".card").get(-1));
		});
	}

	function return2Deck () {
		$(".card").each(function () {
			let c = ["card_0", "card_1", "card_2", "card_3", "card_4", "card_p"].filter(c => $(this).hasClass(c))[0];
			$(this).removeClass(["card_0", "card_1", "card_2", "card_3", "card_4"]);
			$(this).addClass(`${c}_`);
		});
		$(".card").each(function () {
			let c = ["card_0_", "card_1_", "card_2_", "card_3_", "card_4_", "card_p_"].filter(c => $(this).hasClass(c))[0];
			$(this).removeClass(["card_0_", "card_1_", "card_2_", "card_3_", "card_4_", "card_p_"]);
			let card_ID = {
				"card_0_": "deck_0",
				"card_1_": "deck_1",
				"card_2_": "deck_2",
				"card_3_": "deck_3",
				"card_4_": "deck_4",
				"card_p_": "player"
			};
			let card_ID2 = {
				"card_0_": "card_0",
				"card_1_": "card_1",
				"card_2_": "card_2",
				"card_3_": "card_3",
				"card_4_": "card_4",
				"card_p_": "card_p"
			};
			let deckClass = card_ID[c];
			let k = $(`.${card_ID2[c]}`).length;
			let droppable = $(`#${deckClass}`);
			$(this).addClass(card_ID2[c]);
			if (deckClass == "deck_0"){
				$(this).css({
					top: droppable.offset().top + 4 - 0.2 * k,
					left: droppable.offset().left + 4 - 0.1 * k
				});
			} else if (deckClass == "player") {
				refreshPlayer("css");
			} else {
				$(this).css({
					top: droppable.offset().top + 4 - 0.8 * k,
					left: droppable.offset().left + 4 - 0.8 * k
				});
			}
		});
	}

	window.shuffle = shuffle;

	function shuffle() {
		$(".card").each(function (){
			let a = $(this).find(".paperBack").length;
			if(a!=0) overturn($(this));
			let reversed = Math.floor(Math.random() * 2);
			if(reversed == 0) $(this).toggleClass("reversed");
		});
		let array = cards;
		for (let i = array.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		for (let card of cards){
			$(`#${card.id}_${card.name}`).insertAfter($(".card").get(-1));
		}
		all2Deck_0();
		return cards;
	}

	window.divine = divine;

	function divine(){
		shuffle();
		let i =0;
		let k = 6;
		let j = 1;
		$($(".card").get().reverse()).each(function () {
			if(i < 28){ 
				i++;
				switch (j) {
					case 1:
						go2Deck_1($(this), k);
						j++;
						break;
					case 2:
						go2Deck_2($(this), k);
						j++;
						break;
					case 3:
						go2Deck_3($(this), k);
						j++;
						break;
					case 4:
						go2Deck_4($(this), k);
						j = 1;
						k--;
						break;
				}
			}
		});
	}

	window.addEventListener('contextmenu', function (e) {
		e.preventDefault();
	}, false);

	particlesJS("particles-js", {
		"particles": {
			"number": {
				"value": 58,
				"density": {
					"enable": true,
					"value_area": 800
				}
			},
			"color": {
				"value": "#ffd047"
			},
			"shape": {
				"type": "circle",
				"stroke": {
					"width": 0,
					"color": "#000000"
				},
				"polygon": {
					"nb_sides": 5
				},
				"image": {
					"src": "img/github.svg",
					"width": 100,
					"height": 100
				}
			},
			"opacity": {
				"value": 0.5,
				"random": false,
				"anim": {
					"enable": false,
					"speed": 1,
					"opacity_min": 0.1,
					"sync": false
				}
			},
			"size": {
				"value": 12,
				"random": true,
				"anim": {
					"enable": false,
					"speed": 40,
					"size_min": 0.1,
					"sync": false
				}
			},
			"line_linked": {
				"enable": true,
				"distance": 150,
				"color": "#ffb109",
				"opacity": 0.3,
				"width": 2
			},
			"move": {
				"enable": true,
				"speed": 1,
				"direction": "none",
				"random": false,
				"straight": false,
				"out_mode": "out",
				"bounce": false,
				"attract": {
					"enable": false,
					"rotateX": 600,
					"rotateY": 1200
				}
			}
		},
		"interactivity": {
			"detect_on": "window",
			"events": {
				"onhover": {
					"enable": false,
					"mode": "grab"
				},
				"onclick": {
					"enable": false,
					"mode": "repulse"
				},
				"resize": true
			},
			"modes": {
				"grab": {
					"distance": 135.0433366343927,
					"line_linked": {
						"opacity": 1
					}
				},
				"bubble": {
					"distance": 400,
					"size": 40,
					"duration": 2,
					"opacity": 8,
					"speed": 3
				},
				"repulse": {
					"distance": 57.29111251156053,
					"duration": 0.4
				},
				"push": {
					"particles_nb": 4
				},
				"remove": {
					"particles_nb": 2
				}
			}
		},
		"retina_detect": true
	});
});


