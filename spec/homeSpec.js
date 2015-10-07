describe('Sign-In Page', function() {

    it('should have a title', function () {

        browser.get('/signin/');

        expect(browser.getTitle()).toEqual('Accounts: Convention on Biological Diversity');
    });

    it('should not write to console', function () {

        browser.get('/signin/');

        browser.manage().logs().get('browser').then(function(browserLog) {
            expect(browserLog.length).toEqual(0);
        });
    });

});
