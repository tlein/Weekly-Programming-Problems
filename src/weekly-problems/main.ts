import {Question, Answers, ChoiceType, objects, prompt} from 'inquirer';
import * as Promise from 'bluebird'

let question : Question = {
    type: 'rawlist',
    name: 'problem',
    message: 'Which problem do you want to run?',
    choices: [
        {
            key: '1',
            value: 'Valid Parens: (()) ()()',
        },
        {
            key: '0',
            value: 'Exit'
        }
    ]
};


function _whichProblemPrompt() {
    (prompt(question) as any).then((answers : Answers) => {
        let problemKey = _keyFromProblemSelection(answers['problem'] as string);
        if (problemKey === "0") {
            return;
        }

        _runProblem(problemKey).then(() => _whichProblemPrompt());
    });
}

function _keyFromProblemSelection(selection : string) : string {
    let choices = question.choices;
    let key = "";
    for (let choice of question.choices as ChoiceType[]) {
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
    let problemPrompt = require('./problem' + key + '/');
    return problemPrompt().then(() => Promise.resolve());
}

_whichProblemPrompt();
