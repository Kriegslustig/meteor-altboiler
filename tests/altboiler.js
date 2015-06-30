Tinytest.add('altboiler', function (test) {
  var testInst = Object.create(altboiler)
  test.equal(typeof testInst.__proto__, 'function', 'altboiler should be a function')
  testInst.__proto__({test:1})
  test.equal(testInst.config.test, 1, 'altboiler should add the properties from the passed object to altboiler.config ')
  testInst.__proto__({test2:1})
  testInst.__proto__({test2:2})
  test.equal(testInst.config.test, 1, 'altboiler shouldn\'t remove existing properties')
  test.equal(testInst.config.test2, 2, 'altboiler should override the overlap with the passed properties')
})

Tinytest.add('altboiler.config', function (test) {
  var testInst = Object.create(altboiler)
  test.equal(typeof testInst.config, 'object', 'altboiler.config should be an object')
  test.equal(testInst.config.action, 'assets/default.html', 'altboiler.config should have "default.html" as its default action')
})

Tinytest.add('altboiler.onLoad', function (test) {
  var testInst = Object.create(altboiler)
  test.equal(typeof testInst.onLoad, 'function', 'altboiler should have a property onLoad, which should be a function')
  test.equal(typeof testInst.onLoad(function () {}), 'number', 'altboiler.onLoad should return a number')
  test.equal(testInst.onLoadHooks.length, 2, 'altboiler.onLoad should push the passed function to altboiler.onLoadHooks')
  ; (function () {
    function addedHook () {
      return 42
    }
    test.equal(testInst.onLoadHooks[testInst.onLoad(addedHook)](), addedHook(),'altboiler.onLoad should return the index of the newly added hook')
  })()
})

Tinytest.add('altboiler.getTemplate', function (test) {
  var testInst = Object.create(altboiler)
  var testTemplate = 'tests/assets/testTemplate.html'
  test.throws(testInst.getTemplate.bind(null, 'test.html', Assets)) // It should fail when the passed Asset doesn\'t exsist
  test.isTrue(!!testInst.getTemplate.call({}, testTemplate, Assets), 'It should render registered assets')
  test.equal(
    testInst.getTemplate.call(
      {test: [1, 2]},
      testTemplate,
      Assets
    ),
    '<div>12</div>',
    'It should render assets as spacebars templates'
  )
  test.equal(
    testInst.getTemplate.call(
      {test: [1, 2]},
      '<div>{{ #each test }}{{ this }}{{ /each }}</div>',
      Assets
    ),
    '<div>12</div>',
    'It should treat the first arg as the template if it\'s not a filename'
  )
})

Tinytest.add('altboiler.css', function (test) {
  var testInst = Object.create(altboiler)
  test.equal(typeof testInst.css, 'function', 'altboiler should have a property `css` which is a function')
  test.equal(typeof testInst.css('div {display: block;}'), 'number', 'It should return the index of the newly inserted css')
  test.equal(testInst.hookedCss[testInst.css('div {display: block;}')], 'div {display: block;}', 'It should push the css to hookedCss')
})

Tinytest.add('altboiler.js', function (test) {
  var testInst = Object.create(altboiler)
  test.equal(typeof testInst.js, 'function', 'altboiler should have a property `js` which is a function')
  test.equal(typeof testInst.js('console.log("moaarr drama!")'), 'number', 'It should return the index of the newly inserted js')
  test.equal(testInst.hookedJs[testInst.js('console.log("moaarr drama!")')], 'console.log("moaarr drama!")', 'It should push the js to hookedJs')
})

Tinytest.add('altboiler.Boilerplate', function (test) {
  var testInst = Object.create(altboiler)
  function cleanLB (str) {
    while(str.indexOf('\n') > -1) str = str.replace('\n', '')
    return str
  }
  test.isTrue(testInst.Boilerplate().indexOf('<body>') > -1, 'Its return value should contain a body element')
  test.isFalse(testInst.Boilerplate().indexOf('<DOCTYPE') > -1, 'Its return value should\'nt contain a doctype')
  test.isTrue(testInst.Boilerplate().indexOf('<head>') > -1, 'Its return value should contain a head element')
  testInst.config.action = '<script>console.log("damn trolls")</script>'
  test.matches(cleanLB(testInst.Boilerplate()), /<body>.*"damn\strolls"/gm, 'The action should be rendered inside the body')
  test.isTrue(testInst.Boilerplate().indexOf('src="/altboiler/main.js"') > -1, 'It should render a script tag that gets the /altboiler/main.js')
  testInst.css('div {display: block;}')
  test.matches(cleanLB(testInst.Boilerplate()), /<style\stype="text\/css">.*div\s{display:\sblock;}/gm, 'The hookedCss should be rendered')
  test.matches(cleanLB(testInst.Boilerplate()), /<script.*console\.log\("moaarr\sdrama!"\)/gm, 'The hookedJs should be rendered')
})
