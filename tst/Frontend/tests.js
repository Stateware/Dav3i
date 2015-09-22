QUnit.module("Group a");
QUnit.test( "loading-screen test", function( assert ) {
  assert.ok($('loading-screen').length, "idControl exists");
});