import {Selector} from 'testcafe';
import { waitForAngular} from 'testcafe-angular-selectors';
import { ClientFunction } from 'testcafe';
import {testHelper} from "./testHelper";

const typeSynonymOnYourTurn = async function(t) {
  await t
    .expect(Selector('#playersTurnList').exists).ok()
    .expect(Selector('#yourTurn').exists).ok()
    .typeText('#synonymTxt', 'FirstSynonym')
    .click('#sendSynonym')
    .expect(Selector('#savedResponseFlag').exists).ok()
    .expect(Selector('#yourTurn').exists).notOk()
}

const gameName = 'test' + Math.floor(Math.random() * 1000000 + 1);
console.log(gameName);

/*
  playerB
  playerD
  playerE
  playerA Host
  playerF
  playerC
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
  await perform(t);
});

export async function perform(t) {
  const getLocation = ClientFunction(() => document.location.href);

  await t
    .click('#simulation')
  await t
    .typeText('#gameName', gameName)
    .click('#createForPrepareGame')
    .expect(Selector('#createForPrepareGameResponseAllFlag').exists).ok()

  await t
    .useRole(testHelper.playerA)
    .click('#joingame')
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains('/preparegame')
    .expect(Selector('#playersRoleOrWord').innerText).contains('?')
    .click('#startGameButton')
    .expect(getLocation()).contains('/firsttip')
    .expect(Selector('#playersTurnList').exists).ok()
    .expect(Selector('#yourTurn').exists).notOk()

  await t
    .useRole(testHelper.playerB)
    .click('#joingame')
    .click('#gamename_' + gameName)
    .expect(Selector('#playersRoleOrWord').innerText).eql('Word1')
    .click('#startGameButton')
  await typeSynonymOnYourTurn(t);

  await t
    .useRole(testHelper.playerC)
    .click('#joingame').click('#gamename_' + gameName)
    .expect(Selector('#playersRoleOrWord').innerText).eql('Word1')
    .click('#startGameButton')
    .expect(Selector('#playersTurnList').exists).ok()
    .expect(Selector('#yourTurn').exists).notOk()
  await t
    .useRole(testHelper.playerD)
  await t
    .click('#joingame')
  await t
    .click('#gamename_' + gameName)
    .expect(Selector('#playersRoleOrWord').innerText).eql('Word2')
    .click('#startGameButton')
  await typeSynonymOnYourTurn(t);


  await t
    .useRole(testHelper.playerE)
    .click('#joingame')
  await t.click('#gamename_' + gameName)
    .expect(Selector('#playersRoleOrWord').innerText).eql('Word2')
    .click('#startGameButton')
  await typeSynonymOnYourTurn(t);

  // all did ready on preparegame to redirect to firsttip

  await t
    .useRole(testHelper.playerA)
    .click('#joingame')
  await t
    .click('#gamename_' + gameName)
    .click('#startGameButton')
  await typeSynonymOnYourTurn(t);

  await t
    .useRole(testHelper.playerF)
    .click('#joingame')
  await t
    .click('#gamename_' + gameName)
    .click('#startGameButton')
  await typeSynonymOnYourTurn(t);

  await t
    .useRole(testHelper.playerC)
    .click('#joingame')
  await t.click('#gamename_' + gameName)
    .click('#startGameButton')
  await typeSynonymOnYourTurn(t);
  await t
    .expect(getLocation()).contains('/firstguess');
}
