import 'mocha';
import {expect} from 'chai';

import {generateAllParensCombinations} from '../../weekly-problems/problem1/parens-combos';

describe("Problem 1: Print all valid combinations of n pairs of parens", function() {
    let twoPairs = generateAllParensCombinations(2);
    it("2 has 2 results", function() {
        expect(twoPairs.length).to.eql(2);
    });

    it("2 has ()()", function() {
        expect(twoPairs.indexOf('()()')).to.gte(0);
    });

    it("2 has (())", function() {
        expect(twoPairs.indexOf('(())')).to.gte(0);
    });

    let threePairs = generateAllParensCombinations(3);
    it("3 has 5 results", function() {
        expect(threePairs.length).to.eql(5);
    });

    it("3 has ((()))", function() {
        expect(threePairs.indexOf('((()))')).to.gte(0);
    });

    it("3 has (()())", function() {
        expect(threePairs.indexOf('(()())')).to.gte(0);
    });

    it("3 has (())()", function() {
        expect(threePairs.indexOf('(())()')).to.gte(0);
    });

    it("3 has ()(())", function() {
        expect(threePairs.indexOf('()(())')).to.gte(0);
    });

    it("3 has ()()()", function() {
        expect(threePairs.indexOf('()()()')).to.gte(0);
    });
})
