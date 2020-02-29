var defArray = [
    [0, 4, 5, 5, 0, 0, 3, 0, 0],
    [0, 0, 0, 8, 0, 0, 9, 0, 0],
    [0, 7, 0, 0, 0, 0, 0, 0, 8],
    [0, 0, 3, 1, 0, 0, 0, 9, 0],
    [7, 0, 0, 0, 3, 2, 0, 0, 0],
    [0, 1, 0, 0, 0, 9, 5, 0, 4],
    [0, 9, 0, 0, 0, 0, 1, 5, 0],
    [0, 0, 0, 2, 0, 0, 0, 0, 0],
    [0, 0, 2, 0, 7, 0, 4, 0, 0],
]

var resArray = [];

var x = 9;
var y = 9;
var table = document.getElementById('table');

for (var i = 0; i < y; i++) {
    var nRow = document.createElement('tr');

    for (var j = 0; j < x; j++) {
        var nEl = document.createElement('th');
        var nInput = document.createElement('input');
        nInput.setAttribute('class', 'inputSudoku');
        nInput.setAttribute('id', i + ',' + j);
        nInput.setAttribute('min', '1');
        nInput.setAttribute('max', '9');
        nInput.setAttribute('type', 'number');
        nEl.appendChild(nInput);
        nRow.appendChild(nEl);
    }
    table.appendChild(nRow);
}

function getArray() {
    defArray = [];
    for (var i = 0; i < y; i++) {
        var temp = [];
        for (var j = 0; j < x; j++) {
            if (document.getElementById(i + ',' + j).value == "")
                temp.push(0);
            else
                temp.push(Number(document.getElementById(i + ',' + j).value))
        }
        defArray.push(temp);
    }
}

function darkenDefaults() {
    for (var i in resArray) {
        for (var j in resArray[i]) {
            if (resArray[i][j]['def'] === true) {
                document.getElementById(i + ',' + j).style.background = 'rgba(169, 169, 169, 0.486)';
            }
            else {
                document.getElementById(i + ',' + j).style.background = 'white';
            }
        }
    }
}

function updateSudoku() {
    for (var i in resArray) {
        for (var j in resArray[i]) {
            document.getElementById(i + ',' + j).value = resArray[i][j]['content'];
        }
    }
}

function doSudoku() {
    getArray();
    resArray = [];
    resetArray(defArray, resArray)
    darkenDefaults();

    //arrayPrinter(resArray);

    var filled = false;
    var toFill = [0, 0];
    var force = false;
    var backtracks = 0;
    var loops = 0;
    while (!filled) {
        loops++;
        if ((!isSudoku(convertToArray(resArray[toFill[0]])) || !isSudoku(convertToArray(getColumnArr(resArray, toFill[1]))) || !isSudoku(convertToArray(getCubeArr(resArray, toFill))) || resArray[toFill[0]][toFill[1]]['content'] === 0 || force == true) && resArray[toFill[0]][toFill[1]]['def'] === false) {
            if (Number(resArray[toFill[0]][toFill[1]]['content']) < 9) {
                console.log("Adding to Sudoku: " + toFill + " " + Number(resArray[toFill[0]][toFill[1]]['content'] + 1) + ":");
                resArray[toFill[0]][toFill[1]]['content'] = Number(resArray[toFill[0]][toFill[1]]['content']) + 1;
                //arrayPrinter(resArray);
                force = false;
            } else {
                console.log("Not Sudoku: " + toFill + ":");
                //arrayPrinter(resArray);
                resArray[toFill[0]][toFill[1]]['content'] = 0
                if (getLastNonDefIndex(resArray, toFill) != false) {
                    toFill = getLastNonDefIndex(resArray, toFill);
                    force = true;
                    backtracks++;
                }
                else {
                    filled = true;
                }
            }
        }
        else {
            //arrayPrinter(resArray);
            console.log(getNextNonDefIndex(resArray, toFill));
            if (getNextNonDefIndex(resArray, toFill) != false) {
                toFill = getNextNonDefIndex(resArray, toFill);
                force = false;
            }
            else {
                filled = true;
                console.log([loops, backtracks])
            }
        }
    }

    for (var i in resArray) {
        for (var j in resArray[i]) {
            if (Number(resArray[i][j]['content']) === 0)
                filled = false;
        }
    }
    updateSudoku();

    if (filled) {
        document.getElementById('alert').innerHTML = "Sudoku Completed!"
        console.log('Sudocute Succesfully Completed!')
    }

    else {
        document.getElementById('alert').innerHTML = "Sudoku is Impossible!"
        console.log('Sudocute legit aint cute!')
    }
    document.getElementById('comment').innerHTML = `Loops: ${loops}, Backtracks: ${backtracks}`;
    var resetButton = document.createElement('a');
    resetButton.setAttribute('href', '');
    resetButton.setAttribute('style', 'text-decoration: none; float: right;');
    resetButton.innerText = 'Reset';
    var resetA = document.getElementById('reset')
    resetA.appendChild(resetButton);
}


function resetArray(arr, arrRes) {
    for (var i in arr) {
        var temp = [];
        for (var j in arr[i]) {
            var temp2 = {
                'content': arr[i][j]
            };
            if (temp2['content'] === 0) {
                temp2['def'] = false;
            }
            else
                temp2['def'] = true;
            temp.push(temp2);
        }
        arrRes.push(temp);
    }
}

function arrayPrinter(arrObj) {
    console.log('-------------------------');
    for (var i in arrObj) {
        var line = '| ';
        for (var j in arrObj[i]) {
            if (arrObj[i][j]['content'] != 0)
                line += arrObj[i][j]['content'];
            else
                line += ' ';
            if (j == 2 || j == 5 || j == 8) {
                line += ' | ';
            }
            else {
                line += ' '
            }
        }
        console.log(line);
        if (i == 2 || i == 5) {
            console.log('-------------------------');
        }
    }
    console.log('-------------------------');
}

function getNextNonDefIndex(arrObj, index) {
    var result = index;
    if (index[1] === 8) {
        if (index[0] === 8) return false;
        result = [index[0] + 1, 0];
    }
    else
        result = [index[0], index[1] + 1];

    if (arrObj[Number(result[0])][Number(result[1])]['def'] === false)
        return result;
    else
        return getNextNonDefIndex(arrObj, result);
}

function getLastNonDefIndex(arrObj, index) {
    var result = index;
    if (index[1] === 0) {
        if (index[0] === 0) return false;
        result = [index[0] - 1, 8];
    }
    else
        result = [index[0], index[1] - 1];


    if (arrObj[Number(result[0])][Number(result[1])]['def'] === false)
        return result;
    else
        return getLastNonDefIndex(arrObj, result);
}

function isSudoku(arr) {
    for (var i in arr) {
        for (var j in arr) {
            if (arr[i] === arr[j] && arr[i] !== 0 && i != j) {
                //console.log([arr[i], arr[j]])
                //console.log(arr)
                return false;
            }
        }
    }
    return true;
}

function convertToArray(arrObj) {
    var result = [];
    for (var i in arrObj) {
        result.push(arrObj[i]['content']);
    }
    return result;
}

function getColumnArr(arr, j) {
    var result = [];
    for (var i in arr) {
        result.push(arr[i][j]);
    }
    return result;
}

function getCubeArr(arr, index) {
    var result = []
    var iLeastMost = [0, 0];
    var jLeastMost = [0, 0];
    if (index[0] < 3)
        iLeastMost = [0, 3];
    else if (index[0] < 6)
        iLeastMost = [3, 6];
    else
        iLeastMost = [6, 9];
    if (index[1] < 3)
        jLeastMost = [0, 3];
    else if (index[1] < 6)
        jLeastMost = [3, 6];
    else
        jLeastMost = [6, 9];
    for (var i in arr) {
        for (var j in arr) {
            if (i >= iLeastMost[0] && i < iLeastMost[1] && j >= jLeastMost[0] && j < jLeastMost[1])
                result.push(arr[i][j]);
        }
    }
    return result;
}