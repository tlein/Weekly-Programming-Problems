import 'mocha';
import {expect} from 'chai';

import {processProjectsInput, processDependenciesInput} from '../../weekly-problems/problem2';
import {determineBuildOrder} from '../../weekly-problems/problem2/build-order';

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
        expect(() => processDependenciesInput("(a, c, b)", projects)).to.throw(Error);
        expect(() => processDependenciesInput("(a, b)", projects)).to.not.throw(Error);
        expect(() => processDependenciesInput("(a, b), (projectC, a), (a, a)", projects)).to.not.throw(Error);
        expect(() => processDependenciesInput("(a, b), (projectD, a), (a, a)", projects)).to.throw(Error);
    });

    it("Returns correct dependency objects", () => {
        let dependencies = processDependenciesInput("", ["a", "b"]);
        expect(dependencies).to.eql([]);
        dependencies = processDependenciesInput("(a, b)", ["a", "b"]);
        expect(dependencies).to.eql([{project: "a", dependedOnProject: "b"}]);
        dependencies = processDependenciesInput("(a, b), (b, d)", ["a", "b", "d"]);;
        expect(dependencies).to.eql([
            {project: "a", dependedOnProject: "b"},
            {project: "b", dependedOnProject: "d"}
        ]);
    });
});

describe("Problem 2: build order", () => {
    it("Gives the right build order", () => {
        let buildOrder = determineBuildOrder(["a", "b"], [{project: "a", dependedOnProject: "b"}]);
        expect(buildOrder).to.eql(["b", "a"]);
        buildOrder = determineBuildOrder(["a", "b", "c"], [
            {project: "a", dependedOnProject: "b"},
            {project: "a", dependedOnProject: "c"},
            {project: "b", dependedOnProject: "c"}
        ]);
        expect(buildOrder).to.eql(["c", "b", "a"]);
        debugger;
        buildOrder = determineBuildOrder(["a", "b", "c", "d"], [
            {project: "a", dependedOnProject: "b"},
            {project: "c", dependedOnProject: "b"},
            {project: "c", dependedOnProject: "d"}
        ]);
        expect(buildOrder).to.eql(["b", "a", "d", "c"]);
    });

    it("Gives an impossible build order", () => {
        expect(() => determineBuildOrder(["a", "b"], [
            {project: "a", dependedOnProject: "b"},
            {project: "b", dependedOnProject: "a"}
        ])).to.throw(Error);
    });
});
