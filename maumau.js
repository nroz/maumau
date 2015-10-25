/**
 * This is just for fun.
 *
 * Open up your browsers console and watch this schizophrenic piece of code playing Mau-Mau against itself.
 *
 * Licence: MIT
 *
 * Author: Tobias Kratz <kratz.tobias@gmail.com>
 */

(function () {

	/**
	 * Cards
	 */
	var COLOR = {
		D: 00,  // Karo
		H: 010, // Herz
		S: 020, // Schibbe
		C: 030 // Kreuz
	};

	var VALUE = {
		S: 00, // 7
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

	L10n.COLOR = {};
	L10n.COLOR[COLOR.D] = "Karo";
	L10n.COLOR[COLOR.H] = "Herz";
	L10n.COLOR[COLOR.S] = "Pik";
	L10n.COLOR[COLOR.C] = "Kreuz";

	L10n.VALUE = {};
	L10n.VALUE[VALUE.S] = "Sieben";
	L10n.VALUE[VALUE.E] = "Acht";
	L10n.VALUE[VALUE.N] = "Neun";
	L10n.VALUE[VALUE.T] = "Zehn";
	L10n.VALUE[VALUE.J] = "Bube";
	L10n.VALUE[VALUE.Q] = "Dame";
	L10n.VALUE[VALUE.K] = "König";
	L10n.VALUE[VALUE.A] = "Ass";


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
		console.debug("Collection");
		cardCollection.collection().forEach(function (item) {
			console.debug("\t", item.toString());
		});
	};

	/**
	 * Log a player instance
	 *
	 * @param {Player} player
	 * @returns {void}
	 */
	var logPlayer = function (player) {
		console.debug("BEGIN", player.name);
		logCardCollection(player.hand);
	};


// --------------------------------------------------
// CARD
// --------------------------------------------------

	/**
	 * Class Card
	 *
	 * @param color
	 * @param value
	 * @constructor
	 */
	function Card(color, value) {
		var that, idendity_;

		that = this;

		that.color = color;
		that.value = value;

		idendity_ = (that.color | that.value);
		that.idendity = function () {
			return idendity_;
		}
		that.toString = function () {
			return [L10n.COLOR[that.color], L10n.VALUE[that.value]].join(" ");
		}
	}


// --------------------------------------------------
// CARD COLLECTION
// --------------------------------------------------

	/**
	 * Class CardCollection
	 * @constructor
	 */
	function CardCollection() {
		var that, collection_, fundOneByIdendity_;
		that = this;
		collection_ = [];

		/**
		 * add card to collection
		 *
		 * @param {Card, [Card]} cards
		 */
		that.add = function (cards) {
			collection_ = collection_.concat(makeArray(cards));
		};

		/**
		 * get or set collection
		 *
		 * @returns {[CARD]}
		 */
		that.collection = function (collection) {
			if (isArray(collection)) {
				collection_ = collection;
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


// --------------------------------------------------
// TABLE
// --------------------------------------------------

	/**
	 * Class Table
	 * @constructor
	 */
	function Table() {
		var that;
		that = this;
		CardCollection.call(that);

		/**
		 * get last card in collection
		 *
		 * @returns {CARD}
		 */
		that.current = function () {
			var collection_ = that.collection();
			return collection_[collection_.length - 1];
		}
	}


// --------------------------------------------------
// DECK
// --------------------------------------------------

	/**
	 * Class Deck
	 *
	 * @constructor
	 */
	function Deck() {
		var that, collection_;
		that = this;
		CardCollection.call(that);

		/**
		 * shuffle the collection
		 */
		that.shuffle = function () {
			this.collection().sort(function () {
				return .5 - Math.random();
			});
		};

		// build the deck;
		collection_ = [];
		for (var color in COLOR) {
			for (var value in VALUE) {
				collection_.push(new Card(COLOR[color], VALUE[value]));
			}
		}
		that.add(collection_);
	};


// --------------------------------------------------
// HAND
// --------------------------------------------------

	/**
	 * Class Hand
	 *
	 * @constructor
	 */
	function Hand() {
		var that;
		that = this;
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


// --------------------------------------------------
// PLAYER
// --------------------------------------------------

	/**
	 * Class Player
	 *
	 * @param {MauMau} game
	 * @param {String} name
	 * @constructor
	 */
	function Player(game, name) {
		var that;
		that = this;
		finished_ = false;

		that.game = game;
		that.name = name;
		that.hand = new Hand();
		that.ki = new Ki(this);

		/**
		 * player has at least one card
		 *
		 * @returns {boolean}
		 */
		that.hasCards = function () {
			return that.hand.count() > 0;
		};

		/**
		 * if player is finished he has no more cards
		 *
		 * @returns {boolean}
		 */
		that.isFinished = function () {
			return !that.hasCards();
		};
	}


// --------------------------------------------------
// KI
// --------------------------------------------------

	/**
	 * Class Ki
	 *
	 * Currently the most stupid player ever
	 *
	 * @param {Player} player
	 * @constructor
	 */
	function Ki(player) {
		var that, next_;
		that = this;

		/**
		 * initialize the next move
		 */
		that.init = function () {
			next_ = false;
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
						next_ = possibleCards_.pop();
						return false;
					}
					break;
				case "chose":
					// farbwahl
					if (!player.isFinished()) {
						var idx = Math.floor((Math.random() * player.hand.count()));
						player.game.rules.override = player.hand.collection()[idx].color;
						console.debug(player.name, "chose color", L10n.COLOR[player.game.rules.override]);
					}
					break;
				case "play":
				{
					if (!next_) {
						if (player.game.rules.override === undefined) {
							var method = "findFamiliarByCard";
							var arg = card;
						} else {
							var method = "findFamiliarByColor";
							var arg = player.game.rules.override
						}
						var possibleCards_ = player.hand[method](arg);
						if (possibleCards_.length === 0) {
							player.hand.add(player.game.deck.get());
							possibleCards_ = player.hand[method](arg);
							if (possibleCards_.length === 0) {
								return false;
							}
						}
						next_ = possibleCards_.pop();
						player.game.rules.override = undefined;
					}
					return player.hand.remove(next_);
				}
			}
		}
	}


// --------------------------------------------------
// PLAYER
// --------------------------------------------------

	/**
	 * Class Rules
	 * @param game
	 * @constructor
	 */
	function Rules(game) {
		var that, direction_, states_, rules_, findRule_;
		that = this;

		direction_ = 1;

		states_ = {};
		states_[VALUE.S] = 0;
		states_[VALUE.E] = false;

		rules_ = {};
		rules_[VALUE.S] = {
			before: function (player) {
				// 2 ziehen, wenn er keine 7 hat
				var result = player.ki.on("force", {value: VALUE.S});
				if (result !== false) {
					console.debug(player.name, "nimmt", states_[VALUE.S]);
					player.hand.add(game.deck.get(states_[VALUE.S]));
					states_[VALUE.S] = 0;
				}
			},
			after: function (player) {
				states_[VALUE.S] += 2;
			}
		};

		rules_[VALUE.E] = {
			before: function (player) {
				// Aussetzen, wenn keine 8
				if (states_[VALUE.E]) {
					var result = player.ki.on("force", {value: VALUE.E});
					if (result !== false) {
						console.debug(player.name, "setzt aus");
						states_[VALUE.E] = false;
						return false;
					}
				}
			},
			after: function (player) {
				states_[VALUE.E] = true;
			}
		};

		rules_[VALUE.N] = {
			after: function (player) {
				if (player !== undefined) {
					console.debug(player.name, "ändert die richtung");
				}
				direction_ *= -1;
			}
		};

		rules_[VALUE.J] = {
			before: function (player) {
				// Farbwahl
				if (states_[VALUE.J]) {
					var result = player.ki.on("chose");
					states_[VALUE.E] = false;
				}
			},
			after: function (player) {
				// Farbwahl
				if (player === undefined) {
					states_[VALUE.J] = true;
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
			var card = game.table.current();
			var rule = rules_[card.value];
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
		that.apply = function (event, player) {
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
			that.apply("after");
		};

		that.direction = function () {
			return direction_;
		};

	}


// --------------------------------------------------
// Mau Mau
// --------------------------------------------------


	/**
	 * Class MauMau
	 * @param {Number} gamblers
	 * @constructor
	 */

	function MauMau(gamblers) {
		var that, rules_, players_;
		that = this;
		gamblers = Math.max(2, Math.min(5, (gamblers || 3)));
		that.rules = rules_ = new Rules(that);
		players_ = [];
		for (var i = 0; i < gamblers; i++) {
			players_.push(new Player(this, "Spieler " + (i + 1)));
		}

		init_ = function () {
			console.debug("init new game");
			// new deck
			that.deck = new Deck();
			that.deck.shuffle();
			// give cards to players
			players_.forEach(function (player) {
				player.hand.collection(that.deck.get(5));
			});
			// new table
			that.table = new Table();
			that.table.add(that.deck.get());
			// init rules states
			rules_.init();
		};

		play_ = function () {
			i = 0;
			console.debug("Auf dem Tisch liegt", that.table.current().toString());
			while (true) {
				// player no turn
				var current = that.table.current();
				var player = players_[(5000 + i) % gamblers];
				player.ki.init();
				if (rules_.apply("before", player) !== false) {
					var card = player.ki.on("play", current);
					if (card === false) {
						console.debug(player.name, "kann nicht", player.hand.count());
						//logPlayer(player)
					} else {
						console.debug(player.name, "legt", card.toString(), player.hand.count());
						that.table.add(card);
						rules_.apply("after", player)
					}
				}
				//console.debug (player.name, "hat", player.hand.count(), "Karten");
				if (player.isFinished()) {
					console.debug(player.name, "hat gewonnen");
					console.debug("neues spiel beginnt in einer sekunde");
					window.setTimeout(startNewGame_, 1000);
					return;
				}
				if (Math.abs(i) > 100) {
					console.debug("neues spiel beginnt in einer sekunde");
					window.setTimeout(startNewGame_, 1000);
					return;
				}
				i += rules_.direction();
			}
		};


		startNewGame_ = function () {
			init_();
			play_();
		};

		window.setTimeout(startNewGame_, 1000);
	}

	var maumau = new MauMau();
}());
