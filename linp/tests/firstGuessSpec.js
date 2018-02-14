import {Selector} from 'testcafe';
import { waitForAngular} from 'testcafe-angular-selectors';
import { ClientFunction } from 'testcafe';
import {testHelper} from "./testHelper";

const gameName = 'test' + Math.floor(Math.random() * 1000000 + 1);
console.log(gameName);

fixture `FirstGuessGameSpec`
  .page `http://localhost:4200`
  .beforeEach(async t => {
    await waitForAngular();
  })
  .afterEach(async t =>{
    await t
      .click('#simulation')
      .typeText('#gameName', gameName)
      .click('#deleteBtn')
      .expect(Selector('#deletedGameFlag').exists).ok();
  });

test('FirstguessGame', async t => {

  const NEXT_PAGE = '/secondtip';
  const CURRENT_PAGE = '/firstguess';

  const getLocation = ClientFunction(() => document.location.href);

  await t
    .click('#simulation')
  await t
    .typeText('#gameName', gameName)
    .click('#createForFirstGuessGame')
    .expect(Selector('#createForFirstGuessGameResponseAllFlag').exists).ok();

  await t
    .useRole(testHelper.playerA)
    .click('#joingame')
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(CURRENT_PAGE)
    .click('#guess_playerC')
    .click('#guess_playerB')
    .click('#saveGuessBtn')
    .expect(Selector('#savedResponseFlag').exists).ok()

  await t
    .useRole(testHelper.playerB)
    .click('#joingame')
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(CURRENT_PAGE)
    .click('#guess_playerA')
    .click('#guess_playerF')
    .click('#saveGuessBtn')
    .expect(Selector('#savedResponseFlag').exists).ok()

  await t
    .useRole(testHelper.playerC)
    .click('#joingame')
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(CURRENT_PAGE)
    .click('#guess_playerC')
    .click('#guess_playerB')
    .click('#saveGuessBtn')
    .expect(Selector('#savedResponseFlag').exists).ok()

  await t
    .useRole(testHelper.playerD)
    .click('#joingame')
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(CURRENT_PAGE)
    .click('#guess_playerD')
    .click('#guess_playerE')
    .click('#saveGuessBtn')
    .expect(Selector('#savedResponseFlag').exists).ok()

  await t
    .useRole(testHelper.playerE)
    .click('#joingame')
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(CURRENT_PAGE)
    .click('#guess_playerC')
    .click('#guess_playerB')
    .click('#saveGuessBtn')
    .expect(Selector('#savedResponseFlag').exists).ok()

  await t
    .useRole(testHelper.playerF)
    .click('#joingame')
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains(CURRENT_PAGE)
    .click('#guess_playerC')
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
