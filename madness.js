var util = require('util');
var startDate = new Date();
var startTime = startDate.getTime();
var fs = require('fs');
var combine = function(a) {
  var fn = function(n, src, got, all) {
    if (n == 0) {
      if (got.length > 0) {
        all[all.length] = got;
      }
      return;
    }
    for (var j = 0; j < src.length; j++) {
      fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
    }
    return;
  }
  var all = [];
  for (var i = 0; i < a.length; i++) {
    fn(i, a, [], all);
  }
  all.push(a);
  return all;
}

function dec2bin(dec) {
  return (dec >>> 0).toString(2);
}
var round0 = [1,16,8,9,5,12,4,13]
//round0 = [1,16,8,9,5,12,4,13,6,11,3,14,7,10,2,15]
var round0pairs = pairs(round0)
var round1 = [];

function pairs(arr) {
  var groups = [],
    i;
  for (i = 0; i < arr.length; i += 2) {
    groups.push(arr.slice(i, i + 2));
  }
  return groups;
}

function roundResults(startTeams) {
  var endTeams = [];
  for (i = 0; i < startTeams.length; i++) {
    var bitCombos = [];
    var comboNum = Math.pow(2, startTeams.length);
    for (j = 0; j < comboNum; j++) {
      var binRep = dec2bin(j);
      if (binRep.length < startTeams.length) {
        padZeroes = "0".repeat(startTeams.length - binRep.length);
        binRep = padZeroes + binRep;
      };
      bitCombos.push(binRep);
    }

  }

  for (k = 0; k < bitCombos.length; k++) {
    var possibleR1Result = [];
    for (l = 0; l < bitCombos[k].length; l++) {
      var matchResult = startTeams[l];
      possibleR1Result.push(matchResult[parseInt(bitCombos[k][l])]);
    }
    endTeams.push(possibleR1Result);
  }
  return endTeams;
}
round1 = roundResults(round0pairs);

var round1Pairs = round1.map(function(teamList) {
  return pairs(teamList)
});

var round2 = [];

for (m = 0; m < round1Pairs.length; m++) {
  //console.log(m);
  var round1Result = [];
  round1Result = roundResults(round1Pairs[m]);
  round2.push(round1Result);
}

var round2Pairs = round2.map(function(teamList) {
  var subPair = teamList.map(function(teams) {
    return pairs(teams);
  });
  return subPair;
});

console.log(util.inspect(round2Pairs, false, null));
console.log("");
console.log(util.inspect(round1, false, null));
console.log("");
console.log(util.inspect(round0, false, null));
var round3 = [];

for (o = 0; o<round2Pairs.length;o++){
  matchBatch = []
  for (p=0;p<round2Pairs[o].length;p++){
    matchBatch.push(roundResults(round2Pairs[o][p]))
  }
  round3.push(matchBatch)
}
console.log(util.inspect(round3, false, null));
//WRITE TO JSON FILE
require('fs').writeFile(

    'combinations.json',

    JSON.stringify(round3, null, 2),

    function (err) {
        if (err) {
            console.error('¯\_(ツ)_/¯ Stuff happens...');
        }
    }
);
//TIME ELAPSED
endDate = new Date();
var endTime = endDate.getTime();
console.log("\n  Total time elapsed:" + (endTime - startTime) / 1000 + "s\n");
