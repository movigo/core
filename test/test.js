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

  tape('Library should return a list of available option functions', function (test) {
    const options = movigo.options()

    test.equal(Array.isArray(options), true)
    test.equal(typeof options[0], 'string')

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
    test.doesNotThrow(function () {
      movigo.target(window.document.querySelector('div'))
    })

    test.doesNotThrow(function () {
      movigo.target(window.document.querySelector('header'))
    })

    test.end()
  })

  tape('Target function should return an object with action, option and animate functions', function (test) {
    const target = movigo.target('div')
    const actions = movigo.actions()
    const options = movigo.options()

    test.equal(typeof target, 'object')

    for (const fun of [...actions, ...options]) {
      test.equal(typeof target[fun], 'function')
    }

    test.equal(typeof target.animate, 'function')

    test.end()
  })

  tape('Action functions should return an object with action, option and animate functions', function (test) {
    const target = movigo.target('div').to({ translate: '100px 100px' })
    const actions = movigo.actions()
    const options = movigo.options()

    for (const fun of [...actions, ...options]) {
      test.equal(typeof target[fun], 'function')
    }

    test.equal(typeof target.animate, 'function')

    test.end()
  })

  tape('Duration function should throw an exception if the parameter is not a number', function (test) {
    const wrongTypes = ['string', true, () => null, {}, []]

    for (const wrongType of wrongTypes) {
      test.throws(function () {
        movigo.target('div').duration(wrongType)
      })
    }

    test.end()
  })

  tape('Delay function should throw an exception if the parameter is not a number', function (test) {
    const wrongTypes = ['string', true, () => null, {}, []]

    for (const wrongType of wrongTypes) {
      test.throws(function () {
        movigo.target('div').delay(wrongType)
      })
    }

    test.end()
  })

  tape('Easing function should throw an exception if the parameter is not a string', function (test) {
    const wrongTypes = [1, true, () => null, {}, []]

    for (const wrongType of wrongTypes) {
      test.throws(function () {
        movigo.target('div').easing(wrongType)
      })
    }

    test.end()
  })

  tape('Loop function should not get parameters or should get number parameter', function (test) {
    const wrongTypes = ['string', true, () => null, {}, []]

    for (const wrongType of wrongTypes) {
      test.throws(function () {
        movigo.target('div').loop(wrongType)
      })
    }

    test.doesNotThrow(function () {
      movigo.target('div').loop()
    })

    test.end()
  })

  tape('Option functions should return an object with action, option and animate functions', function (test) {
    const target = movigo.target('div').duration(100)
    const actions = movigo.actions()
    const options = movigo.options()

    for (const fun of [...actions, ...options]) {
      test.equal(typeof target[fun], 'function')
    }

    test.end()
  })

  tape('Animate function should throw a promise exception for no animation changes', async function (test) {
    const target = movigo.target('div')

    test.equal(typeof target.to({ translate: '100px 100px' }).animate().then, 'function')

    test.end()
  })
})()
