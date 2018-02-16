import {Selector} from 'testcafe';
import {AngularSelector, waitForAngular} from 'testcafe-angular-selectors';
import {Role} from 'testcafe';
import {ClientFunction} from 'testcafe';
import {testHelper} from "./testHelper";

const gameName = 'test' + Math.floor(Math.random() * 1000000 + 1);
console.log(gameName);


fixture `Create Game and join players in gamelobby`
  .page `http://localhost:4200`
  .beforeEach(async t => {
    await waitForAngular();
  })
  .afterEach(async t => {
    
    await t
    .click('#simulation')
    .typeText('#gameName', gameName)
    .click('#deleteBtn')
    .expect(Selector('#deletedGameFlag').exists).ok();
    
  });

test('Create Game and join players in gamelobby', async t => {
  const getLocation = ClientFunction(() => document.location.href);

  //await loginByPlayer(t, 'playera@test.de');
  await t
    .useRole(testHelper.playerA)
    .click('button[routerLink="/creategame"]')
    .expect(getLocation()).contains('/creategame')
    .expect(Selector('#gamename').value).notEql('')
    .typeText('#gamename', gameName, {replace: true})
    .click('#createGameButton')
    .expect(Selector("#gamePlayers_0").innerText).contains('PlayerA')
  await t
    .useRole(testHelper.playerB)
    .click('button[routerLink="/joingame"]')
    .click('#gamename_' + gameName)
    .expect(Selector('#gamePlayers_0').innerText).contains('playerB')
    // need to wait for successhandler of addplayer response to persist to db
    .expect(Selector('#loggedInPlayerSuccessfulAddedStatusFlag').exists).ok()
  await t
    .useRole(testHelper.playerC)
    .click('button[routerLink="/joingame"]')
    .click('#gamename_' + gameName)
    .expect(Selector('#gamePlayers_2').innerText).contains('playerC')
    .expect(Selector('#loggedInPlayerSuccessfulAddedStatusFlag').exists).ok()
  await t
    .useRole(testHelper.playerD)
    .click('button[routerLink="/joingame"]')
    .click('#gamename_' + gameName)
    .expect(Selector('#gamePlayers_1').innerText).contains('playerD')
    .expect(Selector('#loggedInPlayerSuccessfulAddedStatusFlag').exists).ok()
  await t
    .useRole(testHelper.playerE)
    .click('button[routerLink="/joingame"]')
    .click('#gamename_' + gameName)
    .expect(Selector('#gamePlayers_2').innerText).contains('playerE')
    .expect(Selector('#loggedInPlayerSuccessfulAddedStatusFlag').exists).ok()
  await t
    .useRole(testHelper.playerA)
    .click('#joingame')
    .click('#gamename_' + gameName)
    // .expect(Selector('#gamestatusButton').hasAttribute('disabled')).notOk()
    
    .click('#gamestatusButton')
    .expect(getLocation()).contains('preparegame', {timeout: 20000})
    .expect(Selector('#isRoleAssigned').exists).ok('are roles assigned on serverside?', {timeout: 10000})
});
