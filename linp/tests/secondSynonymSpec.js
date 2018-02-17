import {Selector} from 'testcafe';
import {waitForAngular} from 'testcafe-angular-selectors';
import {ClientFunction} from 'testcafe';
import {testHelper} from "./testHelper";

const typeSynonymOnly = async function (t) {
  return await t
    .expect(Selector('#playersTurnList').exists).ok()
    .expect(Selector('#yourTurn').exists).ok()
    .typeText('#synonymTxt', 'SecondSynonym')
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
  playerE
  playerA Host
  playerF
  playerC
 */

fixture `Second Synonym Spec`
  .page `http://localhost:4200`
  .beforeEach(async t => {
    await waitForAngular();
  })
  .afterEach(async t => {
    await t
      .click('#simulation')
      .typeText('#gameName', gameName, {replace: true})
      .click('#deleteBtn')
      .expect(Selector('#deletedGameFlag').exists).ok();
  });

test('Second synonym', async t => {
  await t
    .click('#simulation')
  await t
    .typeText('#gameName', gameName)
    .click('#createForSecondSynonym')
    .expect(Selector('#createForSecondSynonymResponseAllFlag').exists).ok()

  await perform(t);
});

async function perform(t) {
  const CURRENT_PAGE = 'secondtip';
  const NEXT_PAGE = 'secondguess';
  const getLocation = ClientFunction(() => document.location.href);

  await t
    .useRole(testHelper.playerA)
    .click('#welcome')
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(CURRENT_PAGE)
    .expect(Selector('#playersTurnList').exists).ok()
    .expect(Selector('#yourTurn').exists).notOk()

  await t
    .useRole(testHelper.playerB)
    .click('#welcome')
    .click('#gamename_' + gameName)
  await typeSynonymOnYourTurn(t);

  await t
    .useRole(testHelper.playerC)
    .click('#welcome').click('#gamename_' + gameName)
    .expect(Selector('#playersTurnList').exists).ok()
    .expect(Selector('#yourTurn').exists).notOk()
  await t
    .useRole(testHelper.playerD)
  await t
    .click('#welcome')
  await t
    .click('#gamename_' + gameName)
  await typeSynonymOnYourTurn(t);

  await t
    .useRole(testHelper.playerE)
    .click('#welcome')
  await t.click('#gamename_' + gameName)
  await typeSynonymOnYourTurn(t);

  // all did ready on preparegame to redirect to firsttip

  await t
    .useRole(testHelper.playerA)
    .click('#welcome')
  await t
    .click('#gamename_' + gameName)
  await typeSynonymOnYourTurn(t);

  await t
    .useRole(testHelper.playerF)
    .click('#welcome')
  await t
    .click('#gamename_' + gameName)
  await typeSynonymOnYourTurn(t);

  await t
    .useRole(testHelper.playerC)
    .click('#welcome')
  await t.click('#gamename_' + gameName)
  await typeSynonymOnly(t);

  await t
    .expect(getLocation()).contains(NEXT_PAGE);
}
