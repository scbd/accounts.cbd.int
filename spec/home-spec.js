
var EC = protractor.ExpectedConditions;

describe('Sign-In Page', function() {

    //============================================================
    //
    //
    //============================================================
    beforeEach(function() {
        browser.get('/signin');
        browser.waitForAngular();
    });

    //============================================================
    //
    //
    //============================================================
    it('should have a title', function() {
        expect(browser.getTitle()).toEqual('Accounts: Convention on Biological Diversity');
    });

    //============================================================
    //
    //
    //============================================================
    it('should show alert message when invalid email/password is submitted', function() {

        element(by.model('email')).sendKeys('invalid_email');
        element(by.model('password')).sendKeys('invalid_password');

        $('.btn-primary').click().then(function() {
            EC.visibilityOf($('#failedLoginAlert'));
        });
    });
});
