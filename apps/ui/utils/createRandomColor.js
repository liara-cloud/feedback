function createRandomHexColor() {
  var hexDigits = "0123456789ABCDEF";
  var colorCode = "#";

  for (var i = 0; i < 6; i++) {
    colorCode += hexDigits[Math.floor(Math.random() * 16)];
  }

  return colorCode;
}

export default createRandomHexColor;
