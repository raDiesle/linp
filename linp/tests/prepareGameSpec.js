import {Selector} from 'testcafe';
import {AngularSelector, waitForAngular} from 'testcafe-angular-selectors';
import {Role} from 'testcafe';
import {ClientFunction} from 'testcafe';

let loginByPlayer = async function (t, userEmail) {
  await t
    .navigateTo('/welcome')
    //.click('#loginByEmail')
    .typeText('#userProfileEmail', userEmail, {replace: true})
    .typeText('#userProfilePassword', 'pass123')
    .click('#loginButtonByEmail')
    .expect(Selector('#logout').exists).ok()
  ;
};

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
  .afterEach(async t => {
    await t.navigateTo('/deletegame/' + gameName)
      .expect(Selector('#deletedGameFlag').exists).ok();
  });

test('PrepareGame', async t => {
  const getLocation = ClientFunction(() => document.location.href);

  await t
    .navigateTo('/simulation/' + gameName)
    .click('#createForPrepareGame')
    .expect(Selector('#createForPrepareGameResponseAllFlag').exists).ok()

  await loginByPlayer(t, 'playera@test.de');
  await t
    .navigateTo('/gamelobby/' + gameName)
    .expect(getLocation()).contains('/preparegame')

    .expect(Selector('#playersRoleOrWord').innerText).contains('?')
    .click('#startGameButton')
    .debug()
  await t
    .navigateTo('/welcome')
    .click('#logout')
  await loginByPlayer(t, 'playerb@test.de');
  await t
    .navigateTo('/preparegame/' + gamename)
    .expect(Selector('#playersRoleOrWord').value).eql('word1')
    .click('#startGameButton')
  await t
    .navigateTo('/welcome')
    .click('#logout')
  await loginByPlayer(t, 'playerc@test.de');
  await t
    .navigateTo('/preparegame/' + gamename)
    .expect(Selector('#playersRoleOrWord').value).eql('word1')
    .click('#startGameButton')
  await t
    .navigateTo('/welcome')
    .click('#logout')
  await loginByPlayer(t, 'playerd@test.de');
  await t
    .navigateTo('/preparegame/' + gamename)
    .expect(Selector('#playersRoleOrWord').value).eql('word2')
    .click('#startGameButton')
  await t
    .navigateTo('/welcome')
    .click('#logout')
  await loginByPlayer(t, 'playere@test.de');
  await t
    .navigateTo('/preparegame/' + gamename)
    .expect(Selector('#playersRoleOrWord').value).eql('word1')
    .click('#startGameButton')

  await t
    .expect(getLocation()).contains('/firsttip');

});
