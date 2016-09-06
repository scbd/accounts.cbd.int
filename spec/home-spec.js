
var EC = protractor.ExpectedConditions;

describe('Sign-In Page', function() {

    // //============================================================
    // //
    // //
    // //============================================================
    // beforeEach(function() {
    //
    //     browser.waitForAngular();
    // });

    //============================================================
    //
    //
    //============================================================
    it('should have a title', function() {
        browser.get('/signin?123');
        expect(browser.getTitle()).toEqual('Accounts: Convention on Biological Diversity');
    });

    //============================================================
    //
    //
    //============================================================
    it('should show alert message when invalid email/password is submitted', function() {

        browser.get('/signin?123');

        element(by.model('email')).sendKeys('invalid_email');
        element(by.model('password')).sendKeys('invalid_password');

        $('.btn-primary').click().then(function() {
            EC.visibilityOf($('#failedLoginAlert'));
        });
    });
});
