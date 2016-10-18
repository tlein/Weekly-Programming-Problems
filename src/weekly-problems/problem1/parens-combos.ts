/**
 * Generate all the possible balanced parens combinations from the number of paren pairs given.
 * @param  numberOfBalancedParens number of paren pairs each combination of balanced parens must have
 * @return array of all the possible paren combinations
 */
export function generateAllParensCombinations(numberOfBalancedParens : number) : string[] {
    let parenCombos : string[] = [];
    _placeNextParen(numberOfBalancedParens, numberOfBalancedParens, "");

    function _placeNextParen(numLeftRemaining : number, numRightRemaining : number, currentCombo : string) {
        if (numLeftRemaining < 0 || numRightRemaining < numLeftRemaining) {
            return;
        }
        if (numLeftRemaining === 0 && numRightRemaining === 0) {
            parenCombos.push(currentCombo);
            return;
        }

        if (numLeftRemaining > 0) {
            _placeNextParen(numLeftRemaining - 1, numRightRemaining, currentCombo + "(");
        }
        if (numRightRemaining > 0) {
            _placeNextParen(numLeftRemaining, numRightRemaining - 1, currentCombo + ")");
        }
    }

    return parenCombos;
}
