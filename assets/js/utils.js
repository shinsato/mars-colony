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



    	var _test = function(p, a) {
    		return (
    			(p.y === a.y - 1 && p.x === a.x) ||
    			(p.y === a.y + 1 && p.x === a.x) ||
    			(p.y === a.y && p.x === a.x + 1) ||
    			(p.y === a.y && p.x === a.x - 1)
    		);
    	};

    	var _possibles = function(p, a) {
    		if (!!(a.y % 2)) {
    			if (_test(p, a) || (p.y === a.y - 1 && p.x === a.x - 1) || (p.y === a.y + 1 && p.x === a.x - 1)) {
    				return a;
    			}
    		} else {
    			if (_test(p, a) || (p.y === a.y - 1 && p.x === a.x + 1) || (p.y === a.y + 1 && p.x === a.x + 1)) {
    				return a;
    			}
    		}
    	};

    	var _index = function(list, item){
    		return _.findIndex(list, function(lot) {
    			return item.x === lot.x && item.y === lot.y;
    		});
    	};

    	var _hit = function(list, item) {
    		var index = _index(list, item);
    		return (index > -1);
    	};

    	var _setClass = function(plot, active, selected) {
    		var cls = [];
    		if (plot.y === active.y && plot.x === active.x) {
    			cls.push('active');
    		}

    		if (_hit(selected, plot)) {
    			cls.push('occupied');
    		} else {
    			_.each(selected, function(lot) {
    				if (_possibles(plot, lot)) {
    					cls.push('near');
    				}
    			});
    		}

    		return cls.join(' ');
    	};

    	var _buildMap = function(rows) {
    		return _.flatten(_.times(rows, function(y) {
    			return _.times(10, function(x) {
    				return {
    					x: x,
    					y: y
    				};
    			});
    		}));
    	};
