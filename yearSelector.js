var years = [1991, 1995, 2000, 2005, 2010, 2015, 2020, 2024];
var yearSelector = document.getElementById('year-selector-list');

// Append selectors
years.map(function(year, i) {
  var li = document.createElement('li');
  var button = document.createElement('button');
  button.classList.add('btn-year-selector');
  button.classList.add('btn-year-selector-' + i);
  button.textContent = year;
  li.innerHTML += button.outerHTML;

  yearSelector.appendChild(li);
});
