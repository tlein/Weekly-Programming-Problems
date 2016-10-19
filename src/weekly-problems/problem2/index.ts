import {Question, prompt, Answers} from 'inquirer';
import * as Promise from 'bluebird'

namespace problem1 {
    /**
     * Prompt the user for the input for the generate params problem
     */
    export function problemPrompt() : Promise<any> {
        console.log("Lets solve Build Dependencies!");
        return Promise.resolve();
    }

    /**
     * Value for this problem in the menu
     */
    export function menuValue() : string {
        return 'Build Dependencies';
    }
};

export = problem1;
