import {Selector} from 'testcafe';
import { waitForAngular} from 'testcafe-angular-selectors';
import { ClientFunction } from 'testcafe';
import {testHelper} from "./testHelper";

const typeSynonymOnly = async function (t) {
  return await t
    .expect(Selector('#playersTurnList').exists).ok()
    .expect(Selector('#yourTurn').exists).ok()
    .typeText('#synonymTxt', 'FirstSynonym')
    .click('#sendSynonym')
}
const typeSynonymOnYourTurn = async (t) => {
  await typeSynonymOnly(t);
  await t.expect(Selector('#savedResponseFlag').exists).ok()
    .expect(Selector('#yourTurn').exists).notOk()
}

const gameName = 'test' + Math.floor(Math.random() * 1000000 + 1);
console.log(gameName);

/*
  playerB
  playerD
  playerC
  playerE
  playerA Host
  playerF
 */

fixture `PrepareGameSpec`
  .page `http://localhost:4200`
  .beforeEach(async t => {
    await waitForAngular();
  })
  .afterEach(async t =>{
    await t    
    .click('#simulation')
      .typeText('#gameName', gameName, {replace: true})
      .click('#deleteBtn')
      .expect(Selector('#deletedGameFlag').exists).ok();
  });

test('PrepareGame', async t => {
  await t
    .click('#simulation')
  await t
    .typeText('#gameName', gameName)
    .click('#createForPrepareGame')
    .expect(Selector('#createForPrepareGameResponseAllFlag').exists).ok('be ready', {timeout: 8000});

  await perform(t);
});

export async function perform(t) {
  const CURRENT_PAGE = '/preparegame';
  const NEXT_PAGE = '/firstguess';
  const getLocation = ClientFunction(() => document.location.href);


  /*
  

    .expect(getLocation()).contains(CURRENT_PAGE, {timeout: 25000})
    .expect(Selector('#playersRoleOrWord').innerText).contains('?')
    
    .click('#startGameButton')
   
    .expect(getLocation()).contains('/firsttip')
    .expect(Selector('#playersTurnList').exists).ok()
    .expect(Selector('#yourTurn').exists).notOk()
*/

    /*
    await t
    .useRole(testHelper.playerA)
    .click('#welcome')
    .click('#gamename_' + gameName);
*/
/* ORDER MATTERS */
/*
  check if NOT players turn
  await t
    .useRole(testHelper.playerC)
    .click('#welcome')
    .click('#gamename_' + gameName)
    .expect(Selector('#playersRoleOrWord').innerText).eql('Word1')
    .click('#startGameButton')
    .expect(Selector('#playersTurnList').exists).ok()
    .expect(Selector('#yourTurn').exists).notOk()
*/

  await t
    .useRole(testHelper.playerB)
    .click('#welcome')
    .expect(Selector('#' + gameName + '_actionRequired').exists).ok()
    .click('#gamename_' + gameName)
    .expect(Selector('#playersRoleOrWord').innerText).eql('Word1')
    .click('#startGameButton')
  await typeSynonymOnYourTurn(t);
  await t
    .click('#welcome')
    .expect(Selector('#' + gameName + '_noActionRequired').exists).ok('be ready', {timeout: 8000})
    // check bug if state resettet
    .click('#gamename_' + gameName)
    .click('#startGameButton')
    .expect(Selector('#playerB_status').innerText).eql('FIRST_SYNONYM_GIVEN');

  await t
    .useRole(testHelper.playerD)
  await t
    .click('#welcome')
    .expect(Selector('#' + gameName + '_actionRequired').exists).ok()
  await t
    .click('#gamename_' + gameName)
    .expect(Selector('#playersRoleOrWord').innerText).eql('Word2')    
    .click('#startGameButton')
  await typeSynonymOnYourTurn(t)
  await t
    .click('#welcome')
    .expect(Selector('#' + gameName + '_noActionRequired').exists).ok();

  await t
    .useRole(testHelper.playerC)
    .click('#welcome')
    .expect(Selector('#' + gameName + '_actionRequired').exists).ok()
  await t.click('#gamename_' + gameName)
    .click('#startGameButton')
  await typeSynonymOnly(t)
  await t
    .click('#welcome')
    .expect(Selector('#' + gameName + '_noActionRequired').exists).ok();

  await t
    .useRole(testHelper.playerE)
    .click('#welcome')
    .expect(Selector('#' + gameName + '_actionRequired').exists).ok()
  await t.click('#gamename_' + gameName)
    .expect(Selector('#playersRoleOrWord').innerText).eql('Word2')
    .click('#startGameButton')
  await typeSynonymOnYourTurn(t);
  await t
  .click('#welcome')
  .expect(Selector('#' + gameName + '_noActionRequired').exists).ok();

// all did ready on preparegame to redirect to firsttip

  await t
    .useRole(testHelper.playerA)
    .click('#welcome')
    .expect(Selector('#' + gameName + '_actionRequired').exists).ok()
  await t
    .click('#gamename_' + gameName)
    .click('#startGameButton')
  await typeSynonymOnYourTurn(t);
  await t
    .click('#welcome')
    .expect(Selector('#' + gameName + '_noActionRequired').exists).ok();

  await t
    .useRole(testHelper.playerF)
    .click('#welcome')
    .expect(Selector('#' + gameName + '_actionRequired').exists).ok()
  await t
    .click('#gamename_' + gameName)
    .click('#startGameButton')
  await typeSynonymOnYourTurn(t);
  
  
  await t
    .expect(getLocation()).contains(NEXT_PAGE);
  await t
    .click('#welcome')
    .expect(Selector('#' + gameName + '_noActionRequired').exists).ok();

// First players turn
    await t
    .useRole(testHelper.playerB)
    .expect(Selector('#' + gameName + '_actionRequired').exists).ok();

}
