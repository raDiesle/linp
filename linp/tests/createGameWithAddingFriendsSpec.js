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

  await t
    .useRole(testHelper.playerA)
    .click('button[routerLink="/creategame"]')
    .expect(getLocation()).contains('/creategame')
    .expect(Selector('#gamename').value).notEql('')
    .typeText('#gamename', gameName, {replace: true})
    .click('#createGameButton')
    .expect(Selector("#gamePlayers_0").innerText).contains('PlayerA')
    .click("#addFriendList")
    .click('#friend_playerB')
    .click("#addFriendList")
    .click('#friend_playerC')
    .click("#addFriendList")
    .click('#friend_playerD')
    .click("#addFriendList")
    .click('#friend_playerE')
    .expect(Selector('#gamestatusButton').hasAttribute('disabled')).notOk('ready', {timeout: 5000 })
    .click('#gamestatusButton')
    
    .expect(getLocation()).contains('preparegame', {timeout: 25000})
    .expect(Selector('#isRoleAssigned').exists).ok('are roles assigned on serverside?', {timeout: 15000})
    .click('#welcome')
    .expect(Selector('#' + gameName + '_noActionRequired').exists).ok('wait', {timeout: 8000})

    // Is first Players roles turn ?
    await t
      .useRole(testHelper.playerB)
      .expect(Selector('#' + gameName + '_actionRequired').exists).ok()
    
});