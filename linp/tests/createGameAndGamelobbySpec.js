import {Selector} from 'testcafe';
import {AngularSelector, waitForAngular} from 'testcafe-angular-selectors';
import {Role} from 'testcafe';
import {ClientFunction} from 'testcafe';

let loginByPlayer = async function (t, userEmail) {
  await t
    .navigateTo('/welcome')
    //.click('#loginByEmail')
    .typeText('#userProfileEmail', userEmail, {replace: true})
    .typeText('#userProfilePassword', 'pass123')
    .click('#loginButtonByEmail');
};
const getLocation = ClientFunction(() => window.location);

const gameName = 'test' + Math.floor(Math.random() * 1000000 + 1);
console.log(gameName);

fixture `Full testsuite`
  .page `http://localhost:4200`
  .beforeEach(async t => {
    await waitForAngular();
  })
  .afterEach(async t => {
    await t.navigateTo('/deletegame/' + gameName)
      .expect(Selector('#deletedGameFlag').exists).ok();
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
    // need to wait for successhandler of addplayer response to persist to db
    .expect(Selector('#loggedInPlayerSuccessfulAddedStatusFlag').exists).ok()

  await t
    .navigateTo('/welcome')
    .click('#logout')
  await loginByPlayer(t, 'playerc@test.de');
  await t
    .click('button[routerLink="/joingame"]')
    .click('#gamename_' + gameName)
    .expect(Selector('#gamePlayers_2').innerText).contains('playerC')
    .expect(Selector('#loggedInPlayerSuccessfulAddedStatusFlag').exists).ok()
  await t
    .navigateTo('/welcome')
    .click('#logout')
  await loginByPlayer(t, 'playerd@test.de');
  await t
    .click('button[routerLink="/joingame"]')
    .click('#gamename_' + gameName)
    .expect(Selector('#gamePlayers_1').innerText).contains('playerD')
    .expect(Selector('#loggedInPlayerSuccessfulAddedStatusFlag').exists).ok()
  await t
    .navigateTo('/welcome')
    .click('#logout')
  await loginByPlayer(t, 'playere@test.de');
  await t
    .click('button[routerLink="/joingame"]')
    .click('#gamename_' + gameName)
    .expect(Selector('#gamePlayers_2').innerText).contains('playerE')
    .expect(Selector('#loggedInPlayerSuccessfulAddedStatusFlag').exists).ok()

  // .ok(Selector('#gamestatusButton').is(':disabled'));


  await loginByPlayer(t, 'playera@test.de');
  await t
    .navigateTo('/gamelobby/' + gameName)
    .ok(Selector('#gamestatusButton')).isNot(':disabled')
    .click('#gamestatusButton')
    .expect(getLocation()).contains('/preparegame');

});
