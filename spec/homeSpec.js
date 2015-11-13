describe('Sign-In Page', function() {

    var EC = protractor.ExpectedConditions;

    it('should have a title', function () {

        browser.get('/signin/');

        expect(browser.getTitle()).toEqual('Accounts: Convention on Biological Diversity');
    });

    it('should show alert message when invalid email/password is submitted', function () {

        browser.get('/signin/');
        browser.waitForAngular();

        element(by.model('email')).sendKeys(1);
        element(by.model('password')).sendKeys(2);
        $('.btn-primary').click();

        browser.wait(EC.visibilityOf($('#failedLoginAlert')), 5000);
    });

});
