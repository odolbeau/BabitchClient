'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */
var BabitchGamePage = function(browser) {
	browser.get(browser.baseUrl + '/?nobackend');

	this.startButton = $('#actionStart button');
	this.playersLocation = $$('.seat-layer');
	this.score = $('.score');
	this.firstTeamScore = $$('.score strong').get(0);
	this.secondTeamScore = $$('.score strong').get(1);

	this.getPlayerLocation = function(locationIndex) {
		return new PlayerLocationElement(browser, $$('#match .seat').get(locationIndex));
	};

	this.getCancelLastGoalButton = function() {
		$('.action .btn-group button').click();

		return $('.cancel-last-goal');
	};
};

var PlayerLocationElement = function(browser, playerLocation) {
	this.playerLocation = playerLocation;

	this.click = function() {
		this.playerLocation.findElement(by.css('.seat-layer')).click();
	};

	this.selectPlayer = function(playerIndex) {
		this.click();
		$$('.player-list div a').get(playerIndex).click();
	};

	this.getPlayerName = function() {
		return this.playerLocation.findElement(by.css('.player-name big')).getText();
	};

	this.goal = function() {
		this.click();
		$('.button.goal:not(.ng-hide)').click();
	};

	this.autogoal = function() {
		this.click();
		$('.button.autogoal:not(.ng-hide)').click();
	};
};

var page = null;

describe('Babitch : Choose player', function() {

	beforeEach(function() {
		page = new BabitchGamePage(browser);
	});

	it('should not display startButton', function() {
		expect(page.startButton.isDisplayed()).toBe(false);
	});

	it('should have 4 selectable players', function() {
		expect(page.playersLocation.count()).toBe(4);
	});

	it('should not display startButton without less than 4 selected players', function() {
		var playerLocation = page.getPlayerLocation(0);
		playerLocation.selectPlayer(0);
		expect(playerLocation.getPlayerName()).toBe('Adrien');
  		expect(page.startButton.isDisplayed()).toBe(false);
	});

	it('should begin game with 4 different selected players', function() {
		var playerLocation1 = page.getPlayerLocation(0);
		playerLocation1.selectPlayer(0);
		expect(playerLocation1.getPlayerName()).toBe('Adrien');

		var playerLocation2 = page.getPlayerLocation(1);
		playerLocation2.selectPlayer(1);
		expect(playerLocation2.getPlayerName()).toBe('Antony');

		var playerLocation3 = page.getPlayerLocation(2);
		playerLocation3.selectPlayer(2);
		expect(playerLocation3.getPlayerName()).toBe('Aurelian');

		var playerLocation3 = page.getPlayerLocation(3);
		playerLocation3.selectPlayer(3);
		expect(playerLocation3.getPlayerName()).toBe('Benjamin');


  		expect(page.startButton.isDisplayed()).toBe(true);

		//Ugly $timeout e2e issue here :/
  		page.startButton.click();

  		expect(page.score.isDisplayed()).toBe(true);

  		// et de 0-0
  		expect(page.firstTeamScore.getText()).toBe('0');
  		expect(page.secondTeamScore.getText()).toBe('0');
	});
});

describe('Babitch : Game', function() {

	beforeEach(function() {
		page = new BabitchGamePage(browser);

		//Choose 4 players
		var playerLocation1 = page.getPlayerLocation(0);
		playerLocation1.selectPlayer(0);
		expect(playerLocation1.getPlayerName()).toBe('Adrien');

		var playerLocation2 = page.getPlayerLocation(1);
		playerLocation2.selectPlayer(1);
		expect(playerLocation2.getPlayerName()).toBe('Antony');

		var playerLocation3 = page.getPlayerLocation(2);
		playerLocation3.selectPlayer(2);
		expect(playerLocation3.getPlayerName()).toBe('Aurelian');

		var playerLocation3 = page.getPlayerLocation(3);
		playerLocation3.selectPlayer(3);
		expect(playerLocation3.getPlayerName()).toBe('Benjamin');

		//Begin a match
		page.startButton.click();
	});

	//Defense goal
	it('should add a goal for the blue team if the blue defender goal',function() {
		var playerLocation = page.getPlayerLocation(3);
		playerLocation.goal();
  		expect(page.firstTeamScore.getText()).toBe('0');
  		expect(page.secondTeamScore.getText()).toBe('1');
	});

	it('should add a goal for the red team if the red defender goal',function() {
		var playerLocation = page.getPlayerLocation(0);
		playerLocation.goal();
  		expect(page.firstTeamScore.getText()).toBe('1');
  		expect(page.secondTeamScore.getText()).toBe('0');
	});

	//Defense CSC
	it('should add a goal for red team if the blue defender goal csc',function() {
		var playerLocation = page.getPlayerLocation(3);
		playerLocation.autogoal();
  		expect(page.firstTeamScore.getText()).toBe('1');
  		expect(page.secondTeamScore.getText()).toBe('0');
	});

	it('should add a goal for blue team if the red defender goal csc',function() {
		var playerLocation = page.getPlayerLocation(1);
		playerLocation.autogoal();
  		expect(page.firstTeamScore.getText()).toBe('0');
  		expect(page.secondTeamScore.getText()).toBe('1');
	});

	//Attack Goal
	it('should add a goal for the blue team if the blue attacker goal',function() {
		var playerLocation = page.getPlayerLocation(2);
		playerLocation.goal();
  		expect(page.firstTeamScore.getText()).toBe('0');
  		expect(page.secondTeamScore.getText()).toBe('1');
	});


	it('should add a goal for the red team if the red attacker goal',function() {
		var playerLocation = page.getPlayerLocation(0);
		playerLocation.goal();
  		expect(page.firstTeamScore.getText()).toBe('1');
  		expect(page.secondTeamScore.getText()).toBe('0');
	});

	//Attack CSC
	it('should add a goal for red team if the blue attacker goal csc',function() {
		var playerLocation = page.getPlayerLocation(2);
		playerLocation.autogoal();
  		expect(page.firstTeamScore.getText()).toBe('1');
  		expect(page.secondTeamScore.getText()).toBe('0');
	});

	it('should add a goal for blue team if the red attacker goal csc',function() {
		var playerLocation = page.getPlayerLocation(1);
		playerLocation.autogoal();
  		expect(page.firstTeamScore.getText()).toBe('0');
  		expect(page.secondTeamScore.getText()).toBe('1');
	});

	//Cancel a Goal
	it('should cancel last goal',function() {
		var playerLocation = page.getPlayerLocation(3);
		playerLocation.goal();
  		expect(page.firstTeamScore.getText()).toBe('0');
  		expect(page.secondTeamScore.getText()).toBe('1');

		//Cancel the goal
		var cancelLastGoalButton = page.getCancelLastGoalButton();
		expect(cancelLastGoalButton.isDisplayed()).toBe(true);
		cancelLastGoalButton.click();

  		//The button must be hidden
  		expect(page.firstTeamScore.getText()).toBe('0');
  		expect(page.secondTeamScore.getText()).toBe('0');
  		expect(cancelLastGoalButton.isDisplayed()).toBe(false);
	});

});