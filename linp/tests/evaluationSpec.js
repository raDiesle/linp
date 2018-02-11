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
    /*
    await t
      .click('#simulation')
      .typeText('#gameName', gameName)
      .click('#deleteBtn')
      .expect(Selector('#deletedGameFlag').exists).ok();
  */
  });

test('EvaluationGame', async t => {

  const PREV_PAGE = 'secondguess';
  const NEXT_PAGE = 'finalizeround';
  const CURRENT_PAGE = 'evaluation';

  const getLocation = ClientFunction(() => document.location.href);

  await t
    .click('#simulation')
  await t
    .typeText('#gameName', gameName)
    .click('#createForEvaluation')
    .expect(Selector('#createForEvaluationResponseAllFlag').exists).ok();



  await t
    .useRole(testHelper.playerA)
    .click('#joingame')
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(PREV_PAGE)
    .click('#guess_playerA')
    .click('#guess_playerE')
    .click('#saveGuessBtn')
    .expect(Selector('#savedResponseFlag').exists).ok()


    .expect(getLocation()).contains(CURRENT_PAGE, { timeout: 10000})
    .click('#finalizeRoundButton')
    .expect(getLocation()).contains(NEXT_PAGE);

  // TODO check evaluation score

// Last player hack
  await t
    .useRole(testHelper.playerC)
    .click('#joingame')
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(CURRENT_PAGE)
    .click('#finalizeRoundButton')
    .expect(getLocation()).contains(NEXT_PAGE);

  await t
    .useRole(testHelper.playerB)
    .click('#joingame')
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(CURRENT_PAGE)
    .expect(Selector('#isRealCalculatedHack').exists).ok()
    .click('#finalizeRoundButton')
    .expect(getLocation()).contains(NEXT_PAGE);

  await t
    .useRole(testHelper.playerD)
    .click('#joingame')
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(CURRENT_PAGE)
    .expect(Selector('#isRealCalculatedHack').exists).ok()
    .click('#finalizeRoundButton')
    .expect(getLocation()).contains(NEXT_PAGE);

  await t
    .useRole(testHelper.playerE)
    .click('#joingame')
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(CURRENT_PAGE)
    .expect(Selector('#isRealCalculatedHack').exists).ok()
    .click('#finalizeRoundButton')
    .expect(getLocation()).contains(NEXT_PAGE);

  await t
    .useRole(testHelper.playerF)
    .click('#joingame')
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(CURRENT_PAGE)
    .expect(Selector('#isRealCalculatedHack').exists).ok()
    .click('#finalizeRoundButton')
    .expect(getLocation()).contains(NEXT_PAGE);

  await t
    .useRole(testHelper.playerF)
    .click('#joingame')
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(CURRENT_PAGE)
    .expect(Selector('#isRealCalculatedHack').exists).ok()
    .click('#finalizeRoundButton')
    .expect(getLocation()).contains(NEXT_PAGE);
})