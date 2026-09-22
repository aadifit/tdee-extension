'use strict';

var $ = function (id) { return document.getElementById(id); };

function showError(msg) {
  var el = $('error');
  el.textContent = msg;
  el.hidden = false;
  $('result').hidden = true;
}

function clearError() {
  $('error').hidden = true;
}

$('form').addEventListener('submit', function (ev) {
  ev.preventDefault();
  clearError();

  try {
    var sex = $('sex').value;
    var age = Number($('age').value);
    var weightRaw = Number($('weight').value);
    var heightRaw = Number($('height').value);
    var bodyFatRaw = $('bodyFat').value.trim();
    var activity = $('activity').value;
    var goal = $('goal').value;

    if (!age || !weightRaw || !heightRaw) {
      showError('Fill in age, weight and height.');
      return;
    }

    var weightKg = $('weightUnit').value === 'lb' ? lbToKg(weightRaw) : weightRaw;
    var heightCm = $('heightUnit').value === 'in' ? inToCm(heightRaw) : heightRaw;

    var bmr;
    if (bodyFatRaw !== '') {
      bmr = katchMcArdle({ weightKg: weightKg, bodyFatPct: Number(bodyFatRaw) });
    } else {
      bmr = mifflinStJeor({ weightKg: weightKg, heightCm: heightCm, age: age, sex: sex });
    }

    var t = tdee(bmr, activity);
    var m = macroSplit(t, { weightKg: weightKg, goal: goal });

    $('rBmr').textContent = Math.round(bmr).toLocaleString();
    $('rTdee').textContent = Math.round(t).toLocaleString();
    $('rTarget').textContent = m.targetKcal.toLocaleString();
    $('rProtein').textContent = m.proteinG;
    $('rCarb').textContent = m.carbG;
    $('rFat').textContent = m.fatG;
    $('result').hidden = false;
  } catch (err) {
    showError(err.message || 'Check your inputs and try again.');
  }
});
