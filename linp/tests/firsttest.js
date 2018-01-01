import {Selector} from 'testcafe';
import {AngularSelector, waitForAngular} from 'testcafe-angular-selectors';

fixture `Full testsuite`
  .page `http://localhost:4200`
  .beforeEach(async () => {
    await waitForAngular();
  });

test('Create Game', async t => {
  await t
    .click('#loginByEmail')
    .typeText('#userProfileEmail', 'playera@test.de')
    .typeText('#userProfilePassword', 'pass123')
    .click('#loginButtonByEmail')
    .click('button[routerLink="/creategame"]');
  const articleHeader = await Selector('.result-content').find('h1');

  // Obtain the text of the article header
  let headerText = await articleHeader.innerText;
});
