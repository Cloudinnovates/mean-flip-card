var chai = require('chai');
var expect = chai.expect;
var utils = require('../utils');

var values = {
    'A': 'Abraham', 
    'B': 'Billy', 
    'C': 'Cartman'
}

describe('Utils', function() {
    it('findValue() should retreive the proper key for the value', function() {
        expect(utils.findValue(values, 'Billy')).to.equal('B');
    });

    it('findValue() should retreive null if value does not exist', function() {
        expect(utils.findValue(values, 'Denny')).to.equal(null);
    })
});