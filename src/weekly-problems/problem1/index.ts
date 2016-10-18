import {Question, prompt, Answers} from 'inquirer';
import * as Promise from 'bluebird'

import {generateAllParensCombinations} from './parens-combos';

/**
 * Prompt the user for the input for the generate params problem
 */
function generateParensPrompt() : Promise<any> {
    let question : Question = {
        type: "input",
        name: "num_parens",
        message: "Enter the number of paren pairs: "
    };
    return (prompt(question) as any).then((answers : Answers) => {
        let num = parseInt(answers["num_parens"] as string);
        if (num === undefined || num === null || isNaN(num)) {
            generateParensPrompt();
        } else {
            console.log(generateAllParensCombinations(num).join(', '));
            return Promise.resolve() as Promise<any>;
        }
    });
}

export = generateParensPrompt;
