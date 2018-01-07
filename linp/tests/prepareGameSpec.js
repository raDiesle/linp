import {Selector} from 'testcafe';
import {AngularSelector, waitForAngular} from 'testcafe-angular-selectors';
import {Role} from 'testcafe';
import { ClientFunction } from 'testcafe';

let loginByPlayer = async function (t, userEmail) {
  await t
    .click('#welcome')
    //.click('#loginByEmail')
    .typeText('#userProfileEmail', userEmail, {replace: true})
    .typeText('#userProfilePassword', 'pass123')
    .click('#loginButtonByEmail')
    .expect(Selector('#logout').exists).ok()
  ;
};

const typeSynonymOnYourTurn = async function(t) {
  await t
    .expect(Selector('#playersTurnList').exists).ok()
    .expect(Selector('#yourTurn').exists).ok()
    .typeText('#synonymTxt', 'FirstSynonym')
    .click('#sendSynonym')
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
      .typeText('#gameName', gameName)
      .click('#deleteBtn')
      .expect(Selector('#deletedGameFlag').exists).ok();
  });

test('PrepareGame', async t => {
  const getLocation = ClientFunction(() => document.location.href);

  await t
    .click('#simulation')
    .typeText('#gameName', gameName)
    .click('#createForPrepareGame')
    .expect(Selector('#createForPrepareGameResponseAllFlag').exists).ok()

  await loginByPlayer(t, 'playera@test.de');
  await t
    .click('#joingame')
    .click('#gamename_' + gameName)
    .expect(getLocation()).contains('/preparegame')
    .expect(Selector('#playersRoleOrWord').innerText).contains('?')
    .click('#startGameButton')
    .expect(getLocation()).contains('/firsttip')
    .expect(Selector('#playersTurnList').exists).ok()
    .expect(Selector('#yourTurn').exists).notOk()
  await t
    .click('#welcome').click('#logout')
  await loginByPlayer(t, 'playerb@test.de');
  await t
    .click('#joingame')
    .click('#gamename_' + gameName)
    .expect(Selector('#playersRoleOrWord').innerText).eql('Word1')
    .click('#startGameButton')
  await typeSynonymOnYourTurn(t);
  await t
    .click('#welcome').click('#logout')
  await loginByPlayer(t, 'playerc@test.de');
  await t
    .click('#joingame').click('#gamename_' + gameName)
    .expect(Selector('#playersRoleOrWord').innerText).eql('Word1')
    .click('#startGameButton')
    .expect(Selector('#playersTurnList').exists).ok()
    .expect(Selector('#yourTurn').exists).notOk()
  await t
    .click('#welcome').click('#logout')
  await loginByPlayer(t, 'playerd@test.de');
  await t
    .click('#joingame').click('#gamename_' + gameName)
    .expect(Selector('#playersRoleOrWord').innerText).eql('Word2')
    .click('#startGameButton')
  await typeSynonymOnYourTurn(t);
  await t
    .click('#welcome').click('#logout')
  await loginByPlayer(t, 'playere@test.de');
  await t
    .click('#joingame').click('#gamename_' + gameName)
    .expect(Selector('#playersRoleOrWord').innerText).eql('Word2')
    .click('#startGameButton')
  await typeSynonymOnYourTurn(t);
  await t
  .click('#welcome').click('#logout')

  // all did ready on preparegame to redirect to firsttip
  await loginByPlayer(t, 'playera@test.de');
  await t
    .click('#joingame').click('#gamename_' + gameName)
    .click('#startGameButton')
  await typeSynonymOnYourTurn(t);
  await t
  .click('#welcome').click('#logout')

  await loginByPlayer(t, 'playerf@test.de');
  await t
    .click('#joingame').click('#gamename_' + gameName)
    .click('#startGameButton')
  await typeSynonymOnYourTurn(t);
  await t
  .click('#welcome').click('#logout')

  await loginByPlayer(t, 'playerc@test.de');
  await t
    .click('#joingame').click('#gamename_' + gameName)
    .click('#startGameButton')
  await typeSynonymOnYourTurn(t);
  await t
    .expect(getLocation()).contains('/firstguess')
  await t
  .click('#welcome').click('#logout')

});
