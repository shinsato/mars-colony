var isArray = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }, getNumWithSetDec = function (num, numOfDec) {
        var pow10s = Math.pow(10, numOfDec || 0);
        return numOfDec ? Math.round(pow10s * num) / pow10s : num;
    }, getAverageFromNumArr = function (numArr, numOfDec) {
        if (!isArray(numArr)) {
            return false;
        }
        var i = numArr.length, sum = 0;
        while (i--) {
            // if (window.CP.shouldStopExecution(1)) {
            //     break;
            // }
            sum += numArr[i];
        }
        // window.CP.exitedLoop(1);
        return getNumWithSetDec(sum / numArr.length, numOfDec);
    }, getVariance = function (numArr, numOfDec) {
        if (!isArray(numArr)) {
            return false;
        }
        var avg = getAverageFromNumArr(numArr, numOfDec), i = numArr.length, v = 0;
        while (i--) {
            // if (window.CP.shouldStopExecution(2)) {
            //     break;
            // }
            v += Math.pow(numArr[i] - avg, 2);
        }
        // window.CP.exitedLoop(2);
        v /= numArr.length;
        return getNumWithSetDec(v, numOfDec);
    };

buildOut = function (that) {
    console.log(that);
    that.gene = [];
    for (i = 0; i < 4; i++) {
        // if (window.CP.shouldStopExecution(3)) {
        //     break;
        // }
        var curr = _.random(4, 9);
        that.gene.push(curr);
    }
    // window.CP.exitedLoop(3);
    that.attr = getAverageFromNumArr(that.gene, 1);
    that.vari = getVariance(that.gene, 1);
    };
