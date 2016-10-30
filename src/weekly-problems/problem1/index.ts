import {Question, prompt, Answers} from 'inquirer';
import * as Promise from 'bluebird'

import {generateAllParensCombinations} from './parens-combos';

namespace problem1 {
    /**
     * Prompt the user for the input for the generate params problem
     */
    export function problemPrompt() : Promise<any> {
        let question : Question = {
            type: "input",
            name: "num_parens",
            message: "Enter the number of paren pairs: "
        };
        return (prompt(question) as any).then((answers : Answers) => {
            let num = parseInt(answers["num_parens"] as string);
            if (num === undefined || num === null || isNaN(num)) {
                return Promise.reject("Not a valid number"); 
            } else {
                console.log(generateAllParensCombinations(num).join(', '));
                return Promise.resolve();
            }
        });
    }

    /**
     * Value for this problem in the menu
     */
    export function menuValue() : string {
        return 'Valid Parens: (()) ()()';
    }
};

export = problem1;
