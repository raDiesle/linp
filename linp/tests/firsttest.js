import {Selector} from 'testcafe';
import {AngularSelector, waitForAngular} from 'testcafe-angular-selectors';
import {Role} from 'testcafe';

let loginByPlayer = async function (t, userEmail) {
  await t
    .navigateTo('/welcome')
    .click('#loginByEmail')
    .typeText('#userProfileEmail', userEmail)
    .typeText('#userProfilePassword', 'pass123')
    .click('#loginButtonByEmail');
};

const gameName = 'test' + Math.floor(Math.random() * 1000000 + 1);

fixture `Full testsuite`
  .page `http://localhost:4200`
  .beforeEach(async t => {
    await waitForAngular();
  })
  .afterEach(async t => {
    // t.getBrowserConsoleMessages();
    // await t.navigateTo('/deletegame/'+gameName)
  });

test('Create Game and join players in gamelobby', async t => {
  await loginByPlayer(t, 'playera@test.de');
  await t
    .click('button[routerLink="/creategame"]')
    .expect(Selector('#gamename').value).notEql('')
    .typeText('#gamename', gameName, {replace: true})
    .click('#createGameButton')
    .expect(Selector("#gamePlayers_0").innerText).contains('PlayerA')
  await t
    .navigateTo('/welcome')
    .click('#logout')
  await loginByPlayer(t, 'playerb@test.de');
  await t.expect(Selector('#loggedInPlayerName').innerText).contains('playerB')
  await t
    .click('button[routerLink="/joingame"]')
    .click('#gamename_' + gameName)
    .expect(Selector('#gamePlayers_0').innerText).contains('playerB')

  await t
    .navigateTo('/welcome')
    .click('#logout')
  await loginByPlayer(t, 'playerc@test.de');
  await t
    .click('button[routerLink="/joingame"]')
    .click('#gamename_' + gameName)
    .expect(Selector('#gamePlayers_1').innerText).contains('playerC')
  await t
    .navigateTo('/welcome')
    .click('#logout')
  await loginByPlayer(t, 'playerd@test.de');
  await t
    .click('button[routerLink="/joingame"]')
    .click('#gamename_' + gameName)
    .expect(Selector('#gamePlayers_2').innerText).contains('playerD')
  await t
    .navigateTo('/welcome')
    .click('#logout')
  await loginByPlayer(t, 'playere@test.de');
  await t
    .click('button[routerLink="/joingame"]')
    .click('#gamename_' + gameName)
    .expect(Selector('#gamePlayers_0').innerText).contains('playerE')

  ok($('#gamestatusButton').is(':disabled'));

  // .debug()
});
