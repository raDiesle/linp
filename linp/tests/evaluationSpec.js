import {Selector} from 'testcafe';
import {waitForAngular} from 'testcafe-angular-selectors';
import {ClientFunction} from 'testcafe';
import {testHelper} from "./testHelper";

const gameName = 'test' + Math.floor(Math.random() * 1000000 + 1);
console.log(gameName);

fixture `EvaluationGameSpec`
  .page `http://localhost:4200`
  .beforeEach(async t => {
    await waitForAngular();
  })
  .afterEach(async t => {
    await t
    .debug()
      .click('#simulation')
      .typeText('#gameName', gameName)
      .click('#deleteBtn')
      .expect(Selector('#deletedGameFlag').exists).ok();
  });

test('EvaluationGame', async t => {

  const PREV_PAGE = 'secondguess';
  const NEXT_PAGE = 'finalizeround';
  const CURRENT_PAGE = 'evaluation';
  const FINAL_PAGE = 'preparegame';

  const getLocation = ClientFunction(() => document.location.href);

  await t
    .click('#simulation')
  await t
    .typeText('#gameName', gameName)
    .click('#createForEvaluation')
    .expect(Selector('#createForEvaluationResponseAllFlag').exists).ok();

  await t
    .useRole(testHelper.playerA)
    .click('#welcome')
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(PREV_PAGE)
    .click('#guess_playerB')
    .click('#guess_playerE')
    .click('#saveGuessBtn')
    .expect(Selector('#savedResponseFlag').exists).ok()

    .expect(getLocation()).contains(CURRENT_PAGE, { timeout: 15000})
    .click('#finalizeRoundButton')
    .expect(getLocation()).contains(NEXT_PAGE);

  // TODO check evaluation score

// Last player hack
  await t
    .useRole(testHelper.playerC)
    .click('#welcome')
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(CURRENT_PAGE)
    .click('#finalizeRoundButton')
    .expect(getLocation()).contains(NEXT_PAGE)
    .debug();

  await t
    .useRole(testHelper.playerB)
    .click('#welcome')
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(CURRENT_PAGE)
    .expect(Selector('#isRealCalculatedHack').exists).ok()
    .click('#finalizeRoundButton')
    .expect(getLocation()).contains(NEXT_PAGE);

  await t
    .useRole(testHelper.playerD)
    .click('#welcome')
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(CURRENT_PAGE)
    .expect(Selector('#isRealCalculatedHack').exists).ok()
    .click('#finalizeRoundButton')
    .expect(getLocation()).contains(NEXT_PAGE);

  await t
    .useRole(testHelper.playerE)
    .click('#welcome')
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(CURRENT_PAGE)
    .expect(Selector('#isRealCalculatedHack').exists).ok()
    .click('#finalizeRoundButton')
    .expect(getLocation()).contains(NEXT_PAGE);

  await t
    .useRole(testHelper.playerF)
    .click('#welcome')
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains('evaluation')
    .expect(Selector('#isRealCalculatedHack').exists).ok()
    .click('#finalizeRoundButton')
    .expect(getLocation()).contains(NEXT_PAGE);

  await t
    .useRole(testHelper.playerA)
    .click('#welcome')
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(NEXT_PAGE);

// DO finalizeround

await t
    .useRole(testHelper.playerA)
    .click('#welcome')
    .click('#gamename_' + gameName)
    .click('#startNextRound')
    .expect(Selector('#savedResponseFlag').exists).ok()

    await t
    .useRole(testHelper.playerB)
    .click('#welcome')
    .click('#gamename_' + gameName)
    .click('#startNextRound')
    .expect(Selector('#savedResponseFlag').exists).ok()

    await t
    .useRole(testHelper.playerC)
    .click('#welcome')
    .click('#gamename_' + gameName)
    .click('#startNextRound')
    .expect(Selector('#savedResponseFlag').exists).ok()

    await t
    .useRole(testHelper.playerD)
    .click('#welcome')
    .click('#gamename_' + gameName)
    .click('#startNextRound')
    .expect(Selector('#savedResponseFlag').exists).ok()

    await t
    .useRole(testHelper.playerE)
    .click('#welcome')
    .click('#gamename_' + gameName)
    .click('#startNextRound')
    .expect(Selector('#savedResponseFlag').exists).ok()

    await t
    .useRole(testHelper.playerF)
    .click('#welcome')
    .click('#gamename_' + gameName)
    .click('#startNextRound')
    .expect(Selector('#savedResponseFlag').exists).ok()

    await t
    .useRole(testHelper.playerA)
    .click('#welcome')
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(FINAL_PAGE);

})
