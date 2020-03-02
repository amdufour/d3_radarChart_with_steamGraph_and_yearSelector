/*! Evolution of work Occupation by sex v0.0.1 | (c) 2020 Anne-Marie Dufour | MIT License | https://github.com/amdufour/d3_radarChart_with_steamGraph_and_yearSelector */
/**
 * Element.matches() polyfill (simple version)
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
 */
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}