import {Question, Answers, ChoiceType, objects, prompt} from 'inquirer';
import * as Promise from 'bluebird'
import * as glob from 'glob';
import * as npath from 'path';

/**
 * Prompt the user to select which problem to run
 * @param  choices Optional array of choices to ask, if not given it will be built using _buildChoices
 */
export function whichProblemPrompt(choices? : ChoiceType[]) {
    _getChoicesPromise(choices).then((choices : ChoiceType[]) => {
        let question : Question = {
            type: 'rawlist',
            name: 'problem',
            message: 'Which problem do you want to run?',
            choices: choices
        };

        (prompt(question) as any).then((answers : Answers) => _processChoice(answers['problem'] as string, choices));
    });
}

/**
 * Returns a promise when the choices array has been determined
 * @param  choices Optional array of choices to ask, if not given it will be built using _buildChoices
 * @return Promise that will be resolved when the choices array is ready
 */
function _getChoicesPromise(choices? : ChoiceType[]) : Promise<ChoiceType[]> {
    if (choices) {
        return Promise.resolve(choices);
    } else {
        return _buildChoices();
    }
}

/**
 * Build the choices for the problem selection menu
 * @return Array of ChoiceType objects
 */
function _buildChoices() : Promise<ChoiceType[]> {
    let choices : ChoiceType[] = [{
        key: '0',
        value: 'Exit'
    }];

    return new Promise<ChoiceType[]>(resolve => {
        glob('./src/weekly-problems/*/', null, (error, files) => {
            if (error) {
                throw error;
            }
            resolve(choices.concat(_buildChoicesFromFolders(files)));
        });
    });
}

/**
 * Build the choices from the given problem folders. The folders must be in the format of
 * 'problem#/'
 * @param  folders Array of strings with the folders
 * @return Array of ChoiceType objects
 */
function _buildChoicesFromFolders(folders : string[]) : ChoiceType[] {
    let choices : ChoiceType[] = [];
    for (let folder of folders) {
        let problemModule = require('./' + npath.basename(npath.resolve(folder)) + '/');
        let problemKey = npath.basename(folder).split('problem')[1];
        choices.push({
            key: problemKey,
            value: problemModule.menuValue()
        });
    }
    return choices;
}

/**
 * Process the problem choice the user selects
 * @param  choice  Value of the selected choice
 * @param  choices The possible choices
 */
function _processChoice(choice : string, choices : ChoiceType[]) {
    let problemKey = _keyFromProblemSelection(choice, choices);
    if (problemKey === "0") {
        return;
    }

    _runProblem(problemKey).then(() => whichProblemPrompt(choices));
}

/**
 * Gets the key of a choice from the given choice value
 * @param  selection Value of the choice to get the key of
 * @param  choices   Array of possible ChoiceTypes
 * @return key of the selected choice
 */
function _keyFromProblemSelection(selection : string, choices : ChoiceType[]) : string {
    let key = "";
    for (let choice of choices) {
        choice = choice as objects.ChoiceOption;
        if (choice.value === selection) {
            key = choice.key;
        }
    }
    return key;
}

/**
 * Runs the problem based on the given number key. This will load in the index.js
 * file located at ./problem<key>/index.js. The exported member must be a function
 * that takes no parameters and returns a Promise that resolves when the execution
 * of the problem is complete.
 * @param  key Problem number to run
 */
function _runProblem(key : string) : Promise<any> {
    let problemModule = require('./problem' + key + '/');
    let resolve = () => Promise.resolve();
    let reject = (reason : string) => {
        console.log(reason);
        return _runProblem(key);
    };
    return problemModule.problemPrompt().then(resolve, reject);
}
