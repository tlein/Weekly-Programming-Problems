import {Question, prompt, Answers} from 'inquirer';
import * as Promise from 'bluebird'

import {Dependency, determineBuildOrder} from './build-order';

namespace problem1 {
    /**
     * Prompt the user for the input for the generate params problem
     */
    export function problemPrompt() : Promise<any> {
        let resolve = () => Promise.resolve();
        let reject = (reason : string) => Promise.reject(reason);
        return _projectsPrompt().then(
            (projects : string[]) => _dependenciesPrompt(projects).then(resolve, reject),
            reject);
    }

    function _projectsPrompt() : Promise<any> {
        let question : Question = {
            type: "input",
            name: "projects",
            message: "Enter a comma delimited list of projects to build (ex: a, b, c, d): "
        };
        return (prompt(question) as any).then((answers : Answers) => {
            try {
                let projects = processProjectsInput(answers["projects"] as string);
                return Promise.resolve(projects);
            } catch (e) {
                return Promise.reject(e.message);
            }
        });
    }

    function _dependenciesPrompt(projects : string[]) : Promise<any> {
        let question : Question = {
            type: "input",
            name: "dependencies",
            message: "Enter a comma delimited list of dependecies to build where the first project depends on the second (ex: (a, b), (c, d)): "
        };
        return (prompt(question) as any).then((answers : Answers) => {
            try {
                let dependencies = processDependenciesInput(answers['dependencies'] as string, projects);
                console.log(determineBuildOrder(projects, dependencies).join(', '));
                return Promise.resolve();
            } catch (e) {
                console.log(e.message);
                return _dependenciesPrompt(projects);
            }
        });
    }

    /**
     * Collect the projects from the project input
     * @param  input User input, should be in the form of: a, b, c, d
     * @return array of projects
     */
    export function processProjectsInput(input : string) : string[] {
        if (input === "") {
            throw new Error("No project's specified");
        }

        let projects = input.split(",");
        for (let i = 0; i < projects.length; i++) {
            projects[i] = projects[i].trim();
            if (projects[i] === "") {
                throw new Error("Project cannot be blank");
            }
        }
        return projects;
    }

    /**
     * Collect the dependencies from the user input
     * @param  input User input, should be in the form of: (a, b), (b, c)
     *               where project 'a' is dependent on 'b' and 'b' is dependent on 'c'
     * @param  projects Array of project names
     * @return array of Dependency objects for each dependency relationship
     */
    export function processDependenciesInput(input : string, projects : string[]) : Dependency[] {
        if (input === "") {
            return [];
        }
        let dependencies : Dependency[] = [];
        let dependencyStrings = input.split(/(\([^)]+\))/);
        for (let i = 0; i < dependencyStrings.length; i++) {
            dependencyStrings[i] = dependencyStrings[i].trim();
            if (_dependencyStringShouldBeSkipped(dependencyStrings, i)) {
                continue;
            }
            if (_dependencyFormatCorrectly(dependencyStrings[i], projects)) {
                dependencies.push(_dependencyFromDependencyInput(dependencyStrings[i]));
            }
        }
        return dependencies;
    }

    function _dependencyStringShouldBeSkipped(dependencyStrings : string[], i : number) : boolean {
        if (dependencyStrings[i] === "," && (_dependencyStringIsNotDependency(dependencyStrings, i-1) || _dependencyStringIsNotDependency(dependencyStrings, i+1))) {
            throw new Error("Dependency cannot be blank");
        }
        if (dependencyStrings[i] === "" || dependencyStrings[i] === ",") {
            return true;
        }
        return false;
    }

    function _dependencyStringIsNotDependency(dependencyStrings : string[], index : number) : boolean {
        if (index < 0 || index >= dependencyStrings.length) {
            return true;
        }
        return dependencyStrings[index].trim() === ",";
    }

    function _dependencyFormatCorrectly(dependencyInput : string, projects : string[]) : boolean {
        let dependency = _dependencyFromDependencyInput(dependencyInput);
        if (projects.indexOf(dependency.project) === -1 || projects.indexOf(dependency.dependedOnProject) === -1) {
            throw new Error("Dependency pieces aren't projects provided by user")
        }
        return true;
    }

    function _dependencyFromDependencyInput(dependencyInput : string) : Dependency {
        if (!_dependencyWrappedInParens(dependencyInput)) {
            throw new Error("Dependency not wrapped in parens");
        }
        let dependencyPieces = _removeParensFromDependencyInput(dependencyInput).split(",");
        if (dependencyPieces.length !== 2) {
            throw new Error("Too many elements in dependency");
        }
        let dependency = {
            project: dependencyPieces[0].trim(),
            dependedOnProject: dependencyPieces[1].trim()
        };
        if (dependency.project === "" || dependency.dependedOnProject === "") {
            throw new Error("Portion of dependency is blank");
        }
        return dependency;
    }

    function _dependencyWrappedInParens(dependencyInput : string) : boolean {
        return (
            dependencyInput.charAt(0) === '(' &&
            dependencyInput.charAt(dependencyInput.length - 1) === ')'
        );
    }

    function _removeParensFromDependencyInput(dependencyInput : string) : string {
        return dependencyInput.substring(1, dependencyInput.length - 1);
    }

    /**
     * Value for this problem in the menu
     */
    export function menuValue() : string {
        return 'Build Dependencies';
    }
};

export = problem1;
