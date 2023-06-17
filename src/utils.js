import { OS } from "./constants";

export function getPrimaryScreen() {
  for (var i = 0; i < $.screens.length; i++) {
    if ($.screens[i].primary) {
      return $.screens[i];
    }
  }

  return $.screens[0];
}

export function checkOs() {
  return $.os.indexOf("Win") !== -1 ? OS.WIN : OS.MAC;
}

export function makeDivisibleBy(val, divisor, goUp) {
  if (val % divisor) {
    return goUp
      ? Math.ceil(val / divisor) * divisor
      : Math.floor(val / divisor) * divisor;
  }

  return val;
}

export function isNaN(number) {
  return number != number;
}

export function getElementLocationInWindow(element) {
  var location = [element.bounds.left, element.bounds.top];
  var parent = element.parent;

  while (parent) {
    location[0] += parent.bounds.left;
    location[1] += parent.bounds.top;

    parent = parent.parent;
  }

  return location;
}

export function openURL(url) {
  try {
    if (checkOs() === OS.WIN) {
      system.callSystem("explorer " + url);
    } else {
      system.callSystem("open " + url);
    }
  } catch (error) {
    alert(error);
  }
}
