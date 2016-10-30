import 'mocha';
import {expect} from 'chai';

import {processProjectsInput, processDependenciesInput} from '../../weekly-problems/problem2';

describe("Problem 2: process projects input", () => {
    it("Throws an error on an empty list", () => {
        expect(() => processProjectsInput("")).to.throw(Error);
    });

    it("Throws an error on a project with a blank name", () => {
        expect(() => processProjectsInput(", b,")).to.throw(Error);
        expect(() => processProjectsInput(" , b,")).to.throw(Error);
        expect(() => processProjectsInput(" , b")).to.throw(Error);
        expect(() => processProjectsInput("b, ")).to.throw(Error);
    });

    it("Project's with whitespace on the front/back are trimmed", () => {
        let projects = processProjectsInput("  a  ,b  ,  c");
        expect(projects).to.eql(["a", "b", "c"]);
    });
});

describe("Problem 2: process dependencies input", () => {
    let projects = ["a", "b", "projectC"];
    it("Returns empty list for no input", () => {
        let dependencies = processDependenciesInput("", projects);
        expect(dependencies).to.eql([]);
    });

    it("Throws an error on a blank dependency", () => {
        expect(() => processDependenciesInput(",,,,,", projects)).to.throw(Error);
        expect(() => processDependenciesInput(", (a, b),", projects)).to.throw(Error);
        expect(() => processDependenciesInput(" , (a, b),", projects)).to.throw(Error);
        expect(() => processDependenciesInput(" , (a, b)", projects)).to.throw(Error);
        expect(() => processDependenciesInput("(a, b),", projects)).to.throw(Error);
    });

    it("Throws an error if a dependency is not properly formatted: (a, b)", () => {
        expect(() => processDependenciesInput("hello, (a, b)", projects)).to.throw(Error);
        expect(() => processDependenciesInput("1234 what are you doing", projects)).to.throw(Error);
        expect(() => processDependenciesInput("(a)", projects)).to.throw(Error);
        expect(() => processDependenciesInput("(ab)", projects)).to.throw(Error);
        expect(() => processDependenciesInput("(,b)", projects)).to.throw(Error);
        expect(() => processDependenciesInput("(a,)", projects)).to.throw(Error);
        expect(() => processDependenciesInput("(a,   )", projects)).to.throw(Error);
        expect(() => processDependenciesInput("(a, c)", projects)).to.throw(Error);
        expect(() => processDependenciesInput("(a, b)", projects)).to.not.throw(Error);
        expect(() => processDependenciesInput("(a, b), (projectC, a), (a, a)", projects)).to.not.throw(Error);
    });
});
