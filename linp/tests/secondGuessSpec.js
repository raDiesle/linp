import {Selector} from 'testcafe';
import {waitForAngular} from 'testcafe-angular-selectors';
import {ClientFunction} from 'testcafe';
import {testHelper} from "./testHelper";

const gameName = 'test' + Math.floor(Math.random() * 1000000 + 1);
console.log(gameName);

const handleErrors = ClientFunction(() => {
  console.error = msg => {
    throw new Error(msg)
  };
});

fixture `SecondGuessGameSpec`
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

test('SecondguessGame', async t => {

  const NEXT_PAGE = '/evaluation';
  const CURRENT_PAGE = '/secondguess';

  const getLocation = ClientFunction(() => document.location.href);

  await handleErrors();

  await t
    .click('#simulation')
  await t
    .typeText('#gameName', gameName)
    .click('#createForSecondGuessGame')
    .expect(Selector('#createForSecondGuessGameResponseAllFlag').exists).ok();

  await t
    .useRole(testHelper.playerA)
    .click('#joingame')
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(CURRENT_PAGE)
    .click('#guess_playerA')
    .click('#guess_playerE')
    .click('#saveGuessBtn')
    .expect(Selector('#savedResponseFlag').exists).ok()

  await t
    .useRole(testHelper.playerB)
    .click('#joingame')
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(CURRENT_PAGE)
    .click('#guess_playerD')
    .click('#guess_playerE')
    .click('#saveGuessBtn')
    .expect(Selector('#savedResponseFlag').exists).ok()

  await t
    .useRole(testHelper.playerC)
    .click('#joingame')
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(CURRENT_PAGE)
    .click('#guess_playerA')
    .click('#guess_playerE')
    .click('#saveGuessBtn')
    .expect(Selector('#savedResponseFlag').exists).ok()

  await t
    .useRole(testHelper.playerD)
    .click('#joingame')
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(CURRENT_PAGE)
    .click('#guess_playerA')
    .click('#guess_playerB')
    .click('#saveGuessBtn')
    .expect(Selector('#savedResponseFlag').exists).ok()

  await t
    .useRole(testHelper.playerE)
    .click('#joingame')
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(CURRENT_PAGE)
    .click('#guess_playerD')
    .click('#guess_playerE')
    .click('#saveGuessBtn')
    .expect(Selector('#savedResponseFlag').exists).ok()

  await t
    .useRole(testHelper.playerF)
    .click('#joingame')
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(CURRENT_PAGE)
    .click('#guess_playerA')
    .click('#guess_playerB')
    .click('#saveGuessBtn')
 
  // .expect(Selector('#savedResponseFlag').exists).ok()
  await t
    .expect(getLocation()).contains(NEXT_PAGE)

  await t
    .useRole(testHelper.playerF)
    .click('#joingame')
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(NEXT_PAGE)
})
