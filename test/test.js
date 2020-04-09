const tape = require('tape')
const { JSDOM } = require('jsdom')
const movigo = require('../dist/movigo')

;(async function IIFE () {
  global.window = (await JSDOM.fromFile('index.html')).window

  tape('Target function should throw an exception if the parameter is not a string', function (test) {
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

  tape('Target function should return an object of only action functions', function (test) {
    const target = movigo.target('div')

    test.equal(typeof target, 'object')
    test.equal(typeof target['translateX'], 'function')
    test.notEqual(typeof target['animate'], 'function')

    test.end()
  })

  tape('Action functions should throw an exception if the parameter is not a string', function (test) {
    const wrongTypes = [1, true, () => null, {}, []]

    for (const wrongType of wrongTypes) {
      test.throws(function () {
        movigo.target('div').translateX(wrongType)
      })
    }

    test.end()
  })

  tape('Action functions should return an object with action and animate functions', function (test) {
    const target = movigo.target('div').translateX('100px')

    test.equal(typeof target['translateX'], 'function')
    test.equal(typeof target['animate'], 'function')

    test.end()
  })

  tape('Animate function should return a promise', function (test) {
    const target = movigo.target('div').translateX('100px')

    test.equal(typeof target.animate().then, 'function')

    test.end()
  })
})()
