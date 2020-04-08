const tape = require('tape')
const { JSDOM } = require('jsdom')
const movigo = require('../dist/movigo')

;(async function IIFE () {
  global.window = (await JSDOM.fromFile('index.html')).window

  /** ... **/

  tape('Core functions', function (test) {
    const transform = movigo.animate('div')

    test.equal(typeof transform, 'function')

    test.doesNotThrow(transform.bind(this, 'rotateY(60deg)'))

    test.end()
  })
})()
