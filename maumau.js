/**
 * This is just for fun.
 *
 * Open up your browsers console and watch this schizophrenic piece of code playing Mau-Mau against itself.
 *
 * Licence: MIT
 *
 * Author: Tobias Kratz <kratz.tobias@gmail.com>
 */

var MauMau = (function ($) {

	/**
	 * Class MauMau
	 * @param {Number} gamblers
	 * @constructor
	 */
	return function MauMau(gamblers) {

		/**
		 * card colors
		 */
		var COLOR = {
			D: 0,  // Karo
			H: 010, // Herz
			S: 020, // Schibbe
			C: 030 // Kreuz
		};

		/**
		 * card values
		 */
		var VALUE = {
			S: 0, // 7
			E: 01, // 8
			N: 02, // 9
			T: 03, // 10
			J: 04, // Bube
			Q: 05, // Dame
			K: 06, // König
			A: 07  // Ass
		};

		/**
		 * Localisation
		 */
		var L10n = {};

		// color translation
		L10n.COLOR = {};
		L10n.COLOR[COLOR.D] = "Karo";
		L10n.COLOR[COLOR.H] = "Herz";
		L10n.COLOR[COLOR.S] = "Pik";
		L10n.COLOR[COLOR.C] = "Kreuz";

		// color symbol
		L10n.COLOR_SYMBOL = {};
		L10n.COLOR_SYMBOL[COLOR.D] = "\u2666";
		L10n.COLOR_SYMBOL[COLOR.H] = "\u2665";
		L10n.COLOR_SYMBOL[COLOR.S] = "\u2660";
		L10n.COLOR_SYMBOL[COLOR.C] = "\u2663";

		// value translation
		L10n.VALUE = {};
		L10n.VALUE[VALUE.S] = "Sieben";
		L10n.VALUE[VALUE.E] = "Acht";
		L10n.VALUE[VALUE.N] = "Neun";
		L10n.VALUE[VALUE.T] = "Zehn";
		L10n.VALUE[VALUE.J] = "Bube";
		L10n.VALUE[VALUE.Q] = "Dame";
		L10n.VALUE[VALUE.K] = "König";
		L10n.VALUE[VALUE.A] = "Ass";

		// value symbol
		L10n.VALUE_SYMBOL = {};
		L10n.VALUE_SYMBOL[VALUE.S] = "7";
		L10n.VALUE_SYMBOL[VALUE.E] = "8";
		L10n.VALUE_SYMBOL[VALUE.N] = "9";
		L10n.VALUE_SYMBOL[VALUE.T] = "10";
		L10n.VALUE_SYMBOL[VALUE.J] = "B";
		L10n.VALUE_SYMBOL[VALUE.Q] = "D";
		L10n.VALUE_SYMBOL[VALUE.K] = "K";
		L10n.VALUE_SYMBOL[VALUE.A] = "A";

		/**
		 * HTML body node
		 *
		 * @type {jQuery}
		 */
		var $body = $("body");

		/**
		 * UI container
		 * @type {*|HTMLElement}
		 */
		var $report = $("<pre></pre>");
		$body.append($report);

		/**
		 * trigger an event
		 *
		 * @param {String} event
		 * @param {*} data
		 */
		var trigger = function (event, data) {
			$body.trigger(event, data);
		};

		/**
		 * listen an event
		 * @param {String} event
		 * @param {Function} callback
		 */
		var listen = function (event, callback) {
			$body.on(event, callback);
		};

		/**
		 * log messages
		 */
		var report = function () {
			var args = [].slice.call(arguments);
			$report.append(args.join(" ") + "\n");
			console.log.apply(console, arguments);
		};

		/**
		 * Check if argument is an array
		 *
		 * @param {*} arg
		 * @returns {boolean}
		 */
		var isArray = function (arg) {
			return Object.prototype.toString.call(arg) === '[object Array]';
		};

		/**
		 * Make an array from arg
		 *
		 * @param {*} arg
		 * @returns {Array}
		 */
		var makeArray = function (arg) {
			return (isArray(arg) ? arg : [arg]);
		};

		/**
		 * Log an card collection instance
		 *
		 * @param {CardCollection} arg
		 * @returns {void}
		 */
		var logCardCollection = function (cardCollection) {
			cardCollection.collection().forEach(function (item) {
				report("\t", item.toString());
			});
		};

		/**
		 * Log a player instance
		 *
		 * @param {Player} player
		 * @returns {void}
		 */
		var logPlayer = function (player) {
			report("BEGIN", player.name);
			logCardCollection(player.hand);
		};


		/**
		 * Class Card
		 *
		 * @param {number} color
		 * @param {number} value
		 * @constructor
		 */
		function Card(color, value) {
			var that, idendity_, toStringMode_;
			that = this;

			toStringMode_ = "";

			/**
			 * color
			 *
			 * @type {number}
			 */
			that.color = color;

			/**
			 * value
			 *
			 * @type {number}
			 */
			that.value = value;

			/**
			 * card idendity
			 *
			 * @type {number}
			 * @private
			 */
			idendity_ = (that.color | that.value);

			/**
			 * cards idendity
			 *
			 * @returns {number|*}
			 */
			that.idendity = function () {
				return idendity_;
			};

			that.toString = (function(witch) {
				toStringSymbol_ = function() {
					return [L10n.COLOR_SYMBOL[witch.color], L10n.VALUE_SYMBOL[witch.value]].join("");
				};
				toStringText_ = function() {
					return [L10n.COLOR[witch.color], L10n.VALUE[witch.value]].join(" ");
				};
				toStringFull_ = function() {
					return [
						[L10n.COLOR[witch.color], L10n.VALUE[witch.value]].join(" "),
						" ", // ;o)
						"(",
						L10n.COLOR_SYMBOL[witch.color],
						L10n.VALUE_SYMBOL[witch.value],
						")"
					].join("");
				};

				/**
				 * translate value and color
				 *
				 * @returns {string}
				 */
				switch(toStringMode_) {
					case "symbol":
						return toStringSymbol_;
					case "text":
						return toStringText_;
					case "full":
					default:
						return toStringFull_;
				}
			}(that));

		}


		/**
		 * Class CardCollection
		 *
		 * @constructor
		 */
		function CardCollection() {
			var that, collection_, fundOneByIdendity_;
			that = this;

			/**
			 * the collection
			 *
			 * @type {Array}
			 * @private
			 */
			collection_ = [];

			/**
			 * add card to collection
			 *
			 * @param {Card, [Card]} cards
			 */
			that.add = function (cards) {
				// report("add", cards.toString());
				collection_ = collection_.concat(makeArray(cards));
			};

			/**
			 * get or set collection
			 *
			 * @returns {[CARD]}
			 */
			that.collection = function (collection) {
				if (collection !== undefined) {
					collection_ = makeArray(collection);
				}
				return collection_;
			};

			/**
			 * count collection
			 *
			 * @returns {Number}
			 */
			that.count = function () {
				return collection_.length;
			};

			/**
			 * fin one card by its idendity
			 *
			 * @param {Card} card
			 * @returns {Number}
			 * @private
			 */
			fundOneByIdendity_ = function (card) {
				var idendity = card.idendity();
				var result = collection_.findIndex(function (item) {
					return item.idendity() === idendity;
				});
				return result;
			};

			/**
			 * remove amount elements from beginning of collection and return then
			 *
			 * @param {Number} amount
			 * @returns {[Card]}
			 */
			that.get = function (amount) {
				amount = Math.min((amount || 1), collection_.length);
				return collection_.splice(0, amount);
			};

			/**
			 * remove cards from collection and return them
			 *
			 * @param {Card, [Card]} cards
			 * @returns {[Card]}
			 */
			that.remove = function (cards) {
				var removed = [];
				makeArray(cards).forEach(function (card) {
					var found = fundOneByIdendity_(card);
					if (found > -1) {
						removed = removed.concat(collection_.splice(found, 1));
					}
				}, this);
				return removed;
			};

		}


		/**
		 * Class Table
		 *
		 * @extend CardCollection
		 * @constructor
		 */
		function Table() {
			var that, add_, current_;
			that = this;

			/**
			 * extend CardCollection
			 */
			CardCollection.call(that);

			/**
			 * override method
			 */
			add_ = that.add;
			that.add = function (card) {
				var collection;
				add_.apply(that, arguments);
				collection = that.collection();
				current_ = collection[collection.length - 1];
			};

			/**
			 * get last card in collection
			 *
			 * @returns {CARD}
			 */
			that.current = function () {
				return current_;
			};

			/**
			 * initialize new game
			 */
			that.init = function () {
				that.collection([]);
			};

			// listen to card request by deck instance
			listen("deck.card-request", function (e, data) {
				var collection = that.collection();
				that.collection(collection.pop());
				data.receiver.add(collection);
				report(collection.length, "Karten ins Deck aufgenommen");
			});

			listen("player.card-store", function (e, card) {
				that.add(card);
				trigger("table.card-add");
			});

		}


		/**
		 * Class Deck
		 *
		 * @extend CardCollection
		 * @constructor
		 */
		function Deck() {
			var that, collection_, get_;
			that = this;

			/**
			 * extend CardCollection
			 */
			CardCollection.call(that);

			/**
			 * override method
			 */
			get_ = that.get;
			that.get = function (amount) {
				amount = amount || 1;
				if (amount > that.collection().length) {
					trigger("deck.card-request", {
						receiver: that
					});
					that.shuffle();
				}
				return get_.apply(that, arguments);
			};

			/**
			 * shuffle the collection
			 */
			that.shuffle = function () {
				this.collection().sort(function () {
					return .5 - Math.random();
				});
			};

			/**
			 * initialize new game
			 */
			that.init = function () {
				collection_ = [];
				for (var color in COLOR) {
					for (var value in VALUE) {
						collection_.push(new Card(COLOR[color], VALUE[value]));
					}
				}
				that.collection(collection_);
				that.shuffle();
			};

			// listen to card request by player instance
			listen("player.card-request", function (e, data) {
				data.receiver.add(that.get(data.amount || undefined));
				report("Im Deck sind noch", that.count(), "Karten verfügbar");
			});
		};


		/**
		 * Class Hand
		 *
		 * @extend CardCollection
		 * @constructor
		 */
		function Hand() {
			var that;
			that = this;

			/**
			 * extend CardCollection
			 */
			CardCollection.call(that);

			/**
			 * find card with same color
			 *
			 * @param {Number} color
			 * @returns {[Card]}
			 */
			that.findFamiliarByColor = function (color) {
				return this.collection().filter(function (item) {
					return item.color === color;
				});
			};

			/**
			 * find card with same value
			 *
			 * @param {Number} value
			 * @returns {[Card]}
			 */
			that.findFamiliarByValue = function (value) {
				return this.collection().filter(function (item) {
					return item.value === value;
				});
			};

			/**
			 * find card with same color or value
			 *
			 * @param {Card} card
			 * @returns {[Card]}
			 */
			that.findFamiliarByCard = function (card) {
				return this.collection().filter(function (item) {
					return (item.color === card.color || item.value === card.value);
				});
			};
		}


		/**
		 * Class Player
		 *
		 * @param {MauMau} game
		 * @param {String} name
		 * @constructor
		 */
		function Player(name) {
			var that, finished_;
			that = this;

			/**
			 * players name
			 *
			 * @type {String}
			 */
			that.name = name;

			/**
			 * players cards collection
			 *
			 * @type {Hand}
			 */
			that.hand = new Hand();

			/**
			 * players ability
			 *
			 * @type {Ki}
			 */
			that.ki = new Ki(this);

			/**
			 * if player is finished he has no more cards
			 *
			 * @returns {boolean}
			 */
			that.isFinished = function () {
				if(!finished_) {
					finished_ = that.hand.count() === 0;
				}
				return finished_;
			};

			/**
			 * initialize new game
			 */
			that.initGame = function() {
				finished_ = false;
			};

			/**
			 * initialize next turn
			 */
			that.initTurn = function () {
				that.ki.initTurn();
			}
		}


		/**
		 * Class Stateful
		 *
		 * @constructor
		 */
		function Stateful() {
			var that, states_;
			that = this;

			/**
			 * states
			 *
			 * @type {{}}
			 * @private
			 */
			states_ = {};

			/**
			 * get or set a state
			 *
			 * @param {String} key
			 * @param {*} value
			 * @returns {*}
			 */
			that.is = function (key, value) {
				if (value !== undefined) {
					states_[key] = value;
				}
				return states_[key];
			}
		}


		/**
		 * Class Ki
		 *
		 * Currently the most stupid player ever
		 *
		 * @extend Stateful
		 * @param {Player} player
		 * @constructor
		 */
		function Ki(player) {
			var that, next_, choseCard_;
			that = this;

			/**
			 * extend Stateful
			 */
			Stateful.call(that);

			/**
			 * cheose a card from possible options
			 *
			 * @param {[Card]} options
			 * @param {Card} card
			 * @returns {Card}
			 * @private
			 */
			choseCard_ = function (options, card) {
				return (Math.random() > .5 ? options.pop() : options.shift());
			};

			/**
			 * initialize next turn
			 */
			that.initTurn = function () {
				next_ = false;
				that.is("allowToTake", true);
			};

			/**
			 * insane the brain
			 *
			 * @param {String} event
			 * @param {Card} card
			 * @returns {Boolean, Card}
			 */
			that.on = function (event, card) {
				switch (event) {
					case "force":
						// muss legen
						var possibleCards_ = player.hand.findFamiliarByValue(card.value);
						if (possibleCards_.length > 0) {
							next_ = choseCard_(possibleCards_, card);
							return false;
						}
						break;
					case "chose":
						// farbwahl
						if (!player.isFinished()) {
							var idx = Math.floor((Math.random() * player.hand.count()));
							rules.override = player.hand.collection()[idx].color;
							report(player.name, "wählt die Farbe", L10n.COLOR[rules.override]);
						}
						break;
					case "play":
						if (!next_) {
							if (rules.override === undefined) {
								var method = "findFamiliarByCard";
								var arg = card;
							} else {
								var method = "findFamiliarByColor";
								var arg = rules.override
							}
							var possibleCards_ = player.hand[method](arg);
							if (possibleCards_.length === 0) {
								if (that.is("allowToTake") === false) {
									return false;
								}
								report(player.name, "nimmt 1 Karte");
								trigger("player.card-request", {
									receiver: player.hand
								});
								report(player.name, "hat jetzt", player.hand.count(), "Karten");
								possibleCards_ = player.hand[method](arg);
								if (possibleCards_.length === 0) {
									return false;
								}
							}
							next_ = choseCard_(possibleCards_, arg);
							rules.override = undefined;
						}

						return player.hand.remove(next_);
				}
			}
		}


		/**
		 * Class Rules
		 *
		 * @extend Stateful
		 * @constructor
		 */
		function Rules() {
			var that, direction_, ruleset_, findRule_;
			that = this;

			/**
			 * extend Stateful
			 */
			Stateful.call(that);

			/**
			 * ruleset
			 *
			 * @type {{}}
			 * @private
			 */
			ruleset_ = {};
			ruleset_[VALUE.S] = {
				before: function () {
					// 2 ziehen, wenn er keine 7 hat
					if (that.is(VALUE.S) === 0) {
						return true;
					}
					var result = player.ki.on("force", {value: VALUE.S});
					if (result !== false) {
						report(player.name, "nimmt", that.is(VALUE.S), "Karten");
						trigger("player.card-request", {
							receiver: player.hand,
							amount: that.is(VALUE.S)
						});
						report(player.name, "hat jetzt", player.hand.count(), "Karten");
						player.ki.is("allowToTake", false);
						that.is(VALUE.S, 0);
					}
				},
				after: function () {
					that.is(VALUE.S, that.is(VALUE.S) + 2);
				}
			};

			ruleset_[VALUE.E] = {
				before: function () {
					// Aussetzen, wenn keine 8
					if (that.is(VALUE.E)) {
						var result = player.ki.on("force", {value: VALUE.E});
						if (result !== false) {
							report(player.name, "setzt aus");
							that.is(VALUE.E, false);
							return false;
						}
					}
				},
				after: function () {
					that.is(VALUE.E, true);
				}
			};

			ruleset_[VALUE.N] = {
				after: function () {
					if (player !== undefined) {
						report(player.name, "ändert die richtung");
					}
					that.is(VALUE.N, that.is(VALUE.N) * -1);
				}
			};

			ruleset_[VALUE.J] = {
				before: function () {
					// Farbwahl
					if (that.is(VALUE.J)) {
						var result = player.ki.on("chose");
						that.is(VALUE.J, false);
					}
				},
				after: function () {
					// Farbwahl
					if (player === undefined) {
						that.is(VALUE.J, true);
					} else {
						var result = player.ki.on("chose");
					}
				}
			};

			/**
			 * find a rule
			 *
			 * @param {String} event
			 * @returns {Function, undefined}
			 * @private
			 */
			findRule_ = function (event) {
				var card = table.current();
				var rule = ruleset_[card.value];
				if (rule !== undefined && rule[event] !== undefined) {
					return rule[event];
				}
			};

			/**
			 * apply rule on player
			 *
			 * @param {String} event
			 * @param {Player} player
			 * @returns {boolean}
			 */
			that.apply = function (event) {
				var rule = findRule_(event);
				if (rule === undefined) {
					return true;
				}
				return rule.call(that, player);
			};

			/**
			 * initialize new game
			 */
			that.init = function () {
				that.is(VALUE.S, 0);
				that.is(VALUE.E, false);
				that.is(VALUE.N, 1);
				that.is(VALUE.J, false);
				that.apply("after");
			};

			/**
			 * return current direction state
			 *
			 * @returns {Number}
			 */
			that.direction = function () {
				return that.is(VALUE.N);
			};

			listen("table.card-add", function() {
				that.apply("after");
			});
		}

		// The Game
		var deck, player, rules, table, actor_, need2pee_, players_, safety_, turns_, NEW_GAME_DELAY, TURN_DELAY, PEE_DELAY;

		// constants
		NEW_GAME_DELAY = 1000;
		PEE_DELAY = 1000;
		TURN_DELAY = 100;

		// initialize parameters
		gamblers = Math.max(2, Math.min(5, (gamblers || 3)));
		safety_ = gamblers * 10000;
		need2pee_ = false;

		// initialize components
		rules = new Rules();
		players_ = [];
		for (var i = 0; i < gamblers; i++) {
			players_.push(new Player("Spieler " + (i + 1)));
		}
		deck = new Deck();
		table = new Table();

		/**
		 * initialize game
		 *
		 * @private
		 */
		init_ = function () {
			report("Neues Spiel");
			report("=== === ===");
			player = undefined;
			actor_ = 0;
			// clean the deck
			deck.init();
			// give cards to players
			players_.forEach(function (player) {
				player.initGame();
				player.hand.collection(deck.get(5));
				report(player.name);
				logCardCollection(player.hand)
			});
			// clean the table
			table.init();
			table.add(deck.get());
			// init rules states
			rules.init();
			report("=== === ===");
		};

		/**
		 * start game
		 *
		 * @private
		 */
		play_ = function () {
			turns_ = 0;
			report("Auf dem Tisch liegt", table.current().toString());
			report("--- --- ---");
			window.setTimeout(turn_, TURN_DELAY);
		};

		/**
		 * make a turn
		 *
		 * @private
		 */
		turn_ = function () {
			var current, card;
			// player no turn
			player = players_[(safety_ + actor_) % gamblers];

			if (need2pee_) {
				report(player.name, "muss pinkeln");
				window.setTimeout(turn_, PEE_DELAY);
				return;
			}

			current = table.current();

			player.initTurn();
			report("Turn", ++turns_);
			report(player.name, "hat", player.hand.count(), (player.hand.count() > 1 ? "Karten" : "Karte"));
			if (rules.apply("before") !== false) {
				card = player.ki.on("play", current);
				if (card === false) {
					report(player.name, "kann nicht");
					//logPlayer(player)
				} else {
					report(player.name, "legt", card.toString());
					trigger("player.card-store", card);
				}
			}
			if (player.isFinished()) {
				report(player.name, "hat gewonnen");
				report("--- --- ---");
				report("Ein neues Spiel beginnt in einer Sekunde");
				report("=== === ===");
				window.setTimeout(startNewGame_, NEW_GAME_DELAY);
				return;
			}

			report(player.name, "hat noch", player.hand.count(), (player.hand.count() > 1 ? "Karten" : "Karte"));
			// logCardCollection(player.hand);
			report("--- --- ---");
			actor_ += rules.direction();

			if (turns_ % gamblers === 0) {
				var sum_ = 0;
				report("Karten zählen");
				sum_ += deck.count();
				report("Im Deck", deck.count());
				sum_ += table.count();
				report("Auf dem Tisch", table.count());
				players_.forEach(function (p) {
					sum_ += p.hand.count();
					report(p.name, p.hand.count());
				});
				report("Summe", sum_);
				report("=== === ===");
				if (sum_ != 32) {
					alert("Die Summer ist falsch. Es sind zu", (sum_ > 32 ? "viele" : "wenig"), "Karten im Spiel.");
					return;
				}
			}
			window.setTimeout(turn_, TURN_DELAY);
		};

		/**
		 * start new game
		 *
		 * @private
		 */
		startNewGame_ = function () {
			$report.empty();
			init_();
			play_();
		};

		/**
		 * pause game when click on body
		 */
		$body.on("click", function () {
			need2pee_ = !need2pee_;
		});

		// one, two, three, four
		window.setTimeout(startNewGame_, 1);

	};

}(jQuery));

var maumau = new MauMau(5);
