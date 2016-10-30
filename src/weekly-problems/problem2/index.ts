import {Question, prompt, Answers} from 'inquirer';
import * as Promise from 'bluebird'

import {Dependency} from './build-order';

namespace problem1 {
    /**
     * Prompt the user for the input for the generate params problem
     */
    export function problemPrompt() : Promise<any> {
        let resolve = () => Promise.resolve();
        let reject = (reason : string) => Promise.reject(reason);
        return this._projectsPrompt().then(
            () => this._dependenciesPrompt().then(resolve, reject),
            reject);
    }

    function _projectsPrompt() : Promise<any> {
        let question : Question = {
            type: "input",
            name: "projects",
            message: "Enter a comma delimited list of projects to build (a, b, c, d): "
        };
        return (prompt(question) as any).then((answers : Answers) => {
            try {
                let projects = this.processProjectsInput(answers["projects"] as string);
                return Promise.resolve();
            } catch (e) {
                return Promise.reject(e.message);
            }
        });
    }

    function _dependenciesPrompt() : Promise<any> {
        return null;
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
        let dependencyStrings = input.split(/(\([^)]+\))/);
        for (let i = 0; i < dependencyStrings.length; i++) {
            dependencyStrings[i] = dependencyStrings[i].trim();
            if (dependencyStrings[i] === "") {
                continue;
            }

            if (dependencyStrings[i] === "," && (_dependencyStringIsNotDependency(dependencyStrings, i-1)) || _dependencyStringIsNotDependency(dependencyStrings, i+1)) {
                throw new Error("Dependency cannot be blank");
            }
            if (!_dependencyFormatCorrectly(dependencyStrings[i], projects)) {
                throw new Error("Dependency not formatted correctly, it should be in the form (a, b) where project a depends on b");
            }
        }
        return null;
    }

    function _dependencyStringIsNotDependency(dependencyStrings : string[], index : number) : boolean {
        if (index < 0 || index >= dependencyStrings.length) {
            return true;
        }
        return dependencyStrings[index].trim() === ",";
    }

    function _dependencyFormatCorrectly(dependencyInput : string, projects : string[]) : boolean {
        if (dependencyInput.charAt(0) !== '(' || dependencyInput.charAt(dependencyInput.length - 1) !== ')') {
            return false;
        }
        dependencyInput = dependencyInput.substring(1, dependencyInput.length - 1);
        let dependencyPieces = dependencyInput.split(",");
        if (dependencyPieces.length !== 2) {
            return false;
        }
        let project = dependencyPieces[0].trim();
        let dependedOnProject = dependencyPieces[1].trim();
        if (project === "" || dependedOnProject === "") {
            return false;
        }

        if (projects.indexOf(project) === -1 || projects.indexOf(dependedOnProject) === -1) {
            return false;
        }

        return true;
    }

    /**
     * Value for this problem in the menu
     */
    export function menuValue() : string {
        return 'Build Dependencies';
    }
};

export = problem1;
