var BabitchStatsPage = function(browser) {
    browser.get(browser.baseUrl + '#/stats?nobackend');
    this.title = $('.navbar-brand');
    this.overallStats = $$('h4');
    this.navbar = $$('ul.nav li')
    this.navbarActive = $('ul.nav li.active');
};

module.exports = BabitchStatsPage;
