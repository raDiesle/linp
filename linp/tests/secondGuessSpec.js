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
    
        await t
          .click('#simulation')
          .typeText('#gameName', gameName)
          .click('#deleteBtn')
          .expect(Selector('#deletedGameFlag').exists).ok();
      
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
    .click('#welcome')
    .expect(Selector('#' + gameName + '_actionRequired').exists).ok()
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(CURRENT_PAGE)
    .click('#guess_playerA')
    .click('#guess_playerE')
    .click('#saveGuessBtn')
    .expect(Selector('#savedResponseFlag').exists).ok()
    .click('#welcome')
    .expect(Selector('#' + gameName + '_noActionRequired').exists).ok()

  await t
    .useRole(testHelper.playerB)
    .click('#welcome')
    .expect(Selector('#' + gameName + '_actionRequired').exists).ok()
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(CURRENT_PAGE)
    .click('#guess_playerD')
    .click('#guess_playerE')
    .click('#saveGuessBtn')
    .expect(Selector('#savedResponseFlag').exists).ok()
    .click('#welcome')
    .expect(Selector('#' + gameName + '_noActionRequired').exists).ok()

  await t
    .useRole(testHelper.playerC)
    .click('#welcome')
    .expect(Selector('#' + gameName + '_actionRequired').exists).ok()
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(CURRENT_PAGE)
    .click('#guess_playerA')
    .click('#guess_playerE')
    .click('#saveGuessBtn')
    .expect(Selector('#savedResponseFlag').exists).ok()
    .click('#welcome')
    .expect(Selector('#' + gameName + '_noActionRequired').exists).ok()

  await t
    .useRole(testHelper.playerD)
    .click('#welcome')
    .expect(Selector('#' + gameName + '_actionRequired').exists).ok()
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(CURRENT_PAGE)
    .click('#guess_playerA')
    .click('#guess_playerB')
    .click('#saveGuessBtn')
    .expect(Selector('#savedResponseFlag').exists).ok()
    .click('#welcome')
    .expect(Selector('#' + gameName + '_noActionRequired').exists).ok()

  await t
    .useRole(testHelper.playerE)
    .click('#welcome')
    .expect(Selector('#' + gameName + '_actionRequired').exists).ok()
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(CURRENT_PAGE)
    .click('#guess_playerD')
    .click('#guess_playerE')
    .click('#saveGuessBtn')
    .expect(Selector('#savedResponseFlag').exists).ok()
    .click('#welcome')
    .expect(Selector('#' + gameName + '_noActionRequired').exists).ok()

  await t
    .useRole(testHelper.playerF)
    .click('#welcome')
    .expect(Selector('#' + gameName + '_actionRequired').exists).ok()
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(CURRENT_PAGE)
    .click('#guess_playerA')
    .click('#guess_playerB')
    .click('#saveGuessBtn')
  await t
    .expect(getLocation()).contains(NEXT_PAGE)
    .click('#welcome')
    // .expect(Selector('#savedResponseFlag').exists).ok()
    .expect(Selector('#' + gameName + '_noActionRequired').exists).ok()

// TODO dunno    
  await t
    .useRole(testHelper.playerF)
    .click('#welcome')
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(NEXT_PAGE)
})
