const tape = require('tape')
const { JSDOM } = require('jsdom')
const movigo = require('../dist/movigo')

;(async function IIFE () {
  global.window = (await JSDOM.fromFile('index.html')).window

  tape('Library should return a list of available action functions', function (test) {
    const actions = movigo.actions()

    test.equal(Array.isArray(actions), true)
    test.equal(typeof actions[0], 'string')

    test.end()
  })

  tape('Target function should throw an exception if the parameter is not a string or a DOM element', function (test) {
    const wrongTypes = [1, true, () => null, {}, []]

    for (const wrongType of wrongTypes) {
      test.throws(function () {
        movigo.target(wrongType)
      })
    }

    test.end()
  })

  tape('Target function should throw an exception if the parameter is not a valid DOM selector', function (test) {
    test.throws(function () {
      movigo.target('#wrong')
    })

    test.end()
  })

  tape('Target function should work if the parameter is a valid DOM element', function (test) {
    const element = window.document.querySelector('div')

    test.doesNotThrow(function () {
      movigo.target(element)
    })

    test.end()
  })

  tape('Target function should return an object of only action functions', function (test) {
    const target = movigo.target('div')
    const actions = movigo.actions()

    test.equal(typeof target, 'object')

    for (const action of actions) {
      test.equal(typeof target[action], 'function')
    }

    test.notEqual(typeof target['animate'], 'function')

    test.end()
  })

  tape('Action functions should throw an exception if the parameter is not a string', function (test) {
    const wrongTypes = [1, true, () => null, {}, []]
    const actions = movigo.actions()

    for (const wrongType of wrongTypes) {
      for (const action of actions) {
        test.throws(function () {
          movigo.target('div')[action](wrongType)
        })
      }
    }

    test.end()
  })

  tape('Action functions should return an object with action and animate functions', function (test) {
    const target = movigo.target('div').translate('100px', '100px')

    test.equal(typeof target['translateX'], 'function')
    test.equal(typeof target['animate'], 'function')

    test.end()
  })

  tape('Animate function should return a promise', function (test) {
    const target = movigo.target('div').translate('100px', '100px')

    test.equal(typeof target.animate().then, 'function')

    test.end()
  })
})()
