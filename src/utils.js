import {
  MASK_ALT,
  MASK_CTRL,
  MASK_META,
  MASK_SHIFT,
  OS,
  VC_SHIFT_L,
  VC_SHIFT_R,
  VC_CONTROL_L,
  VC_CONTROL_R,
  VC_ALT_L,
  VC_ALT_R,
  VC_ALT_GRAPH,
  VC_META_L,
  VC_META_R,
  VC_MAP,
  EVENT_MOUSE_PRESSED,
  EVENT_MOUSE_WHEEL,
  EVENT_KEY_PRESSED,
  VC_WHEEL_UP,
  VC_WHEEL_DOWN,
  AE_OS,
  VC_LEFT_MOUSE_BUTTON,
  VC_RIGHT_MOUSE_BUTTON,
  VC_MIDDLE_MOUSE_BUTTON,
} from "./constants";

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
    var result;
    divisor = divisor < 0 ? Math.abs(divisor) : divisor;

    if (divisor < 1) {
      var epsilon = 0.00000000000001; // float-point math...

      divisor = 1 / divisor;

      result = goUp
        ? Math.ceil((val - epsilon) * divisor) / divisor
        : Math.floor((val + epsilon) * divisor) / divisor;
    } else {
      result = goUp
        ? Math.ceil(val / divisor) * divisor
        : Math.floor(val / divisor) * divisor;
    }

    return result;
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

export function getPluginsFolder() {
  var result;
  var packageFolder = Folder.appPackage;

  if (AE_OS === OS.MAC) {
    packageFolder.changePath("..");
  }

  if (packageFolder.exists) {
    var pluginsFolderArr = packageFolder.getFiles("Plug-ins");

    if (pluginsFolderArr && pluginsFolderArr.length) {
      result = pluginsFolderArr[0];
    }
  }

  return result;
}

export function openURL(url) {
  try {
    if (checkOs() === OS.WIN) {
      system.callSystem("explorer " + url);
    } else {
      system.callSystem("open " + url);
    }
  } catch (error) {
    if (
      error.message ===
      "Permission denied (is Preferences > Scripting & Expressions > Allow Scripts to Write Files and Access Network enabled?)"
    ) {
      alert(
        "Cannot open URL. Permission denied.\n" +
          'Enable "Preferences > Scripting & Expressions > Allow Scripts to Write Files and Access Network."',
      );
    } else {
      alert("Error at line " + error.line + ":\n" + error.message);
    }
  }
}

export function saveFileFromBinaryString(binaryString, fileName) {
  function checkFileError(fo) {
    if (fo.error) {
      alert("Error saving file: " + fo.error, "Error", true);
      return fo.error;
    }

    return false;
  }

  var err = false;
  var fileObj = new File(Folder.current.absoluteURI + "/" + fileName);
  fileObj = fileObj.saveDlg();

  if (fileObj) {
    fileObj.encoding = "BINARY";

    if (fileObj.open("w")) {
      fileObj.write(binaryString);

      err = checkFileError(fileObj);

      fileObj.close();
    }

    err = checkFileError(fileObj);

    return err;
  }
}

export function indexOf(arr, el) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === el) {
      return i;
    }
  }

  return -1;
}

export function findIndex(arr, testFn) {
  for (var i = 0; i < arr.length; i++) {
    if (testFn(arr[i])) {
      return i;
    }
  }

  return -1;
}

export function isModifierKey(keycode) {
  return (
    keycode === VC_SHIFT_L ||
    keycode === VC_SHIFT_R ||
    keycode === VC_CONTROL_L ||
    keycode === VC_CONTROL_R ||
    keycode === VC_ALT_L ||
    keycode === VC_ALT_R ||
    keycode === VC_ALT_GRAPH ||
    keycode === VC_META_L ||
    keycode === VC_META_R
  );
}

// get array of key names in readable format
// from the info received from zoom plugin
export function keysFromKeyCodes(keyCodes) {
  var keys = [];
  var type = keyCodes.type;
  var mask = keyCodes.mask;
  var keycode = keyCodes.keycode;

  if (mask & MASK_CTRL) {
    keys.push("Control");
  }

  if (mask & MASK_META) {
    keys.push(AE_OS === OS.WIN ? "Win" : "Command");
  }

  if (mask & MASK_SHIFT) {
    keys.push("Shift");
  }

  if (mask & MASK_ALT) {
    keys.push(AE_OS === OS.WIN ? "Alt" : "Option");
  }

  if (type === EVENT_KEY_PRESSED) {
    if (!isModifierKey(keycode)) {
      var keyName = VC_MAP[keycode];

      if (keyName) {
        keys.push(keyName);
      } else {
        keys.push("[" + keycode + "]");
      }
    }
  } else if (type === EVENT_MOUSE_PRESSED) {
    switch (keycode) {
      case VC_LEFT_MOUSE_BUTTON:
        keys.push("Left Click");
        break;
      case VC_RIGHT_MOUSE_BUTTON:
        keys.push("Right Click");
        break;
      case VC_MIDDLE_MOUSE_BUTTON:
        keys.push("Middle Click");
        break;
      default:
        keys.push("Mouse Button " + keycode);
        break;
    }
  } else if (type === EVENT_MOUSE_WHEEL) {
    switch (keycode) {
      case VC_WHEEL_UP:
        keys.push("Scroll Up");
        break;
      case VC_WHEEL_DOWN:
        keys.push("Scroll Down");
        break;
      default:
        keys.push("Scroll [" + keycode + "]");
        break;
    }
  }

  return keys;
}

export function updateScrollBar(el, parentEl) {
  // var grBindings = this.element.pnlKeyBindings.grBindings;
  // var listGr = grBindings.grList;
  var scrollBar = parentEl.scrollBar;
  var sizeDiff = el.size.height - parentEl.size.height;

  if (sizeDiff > 0) {
    if (!scrollBar) {
      parentEl.scrollBar = parentEl.add(
        "Scrollbar { \
          alignment: ['right', 'fill'], \
        }",
      );
      parentEl.scrollBar.maximumSize.width = 10;

      parentEl.scrollBar.onChanging = function () {
        el.location.y = -this.value;
      };

      scrollBar = parentEl.scrollBar;
    }

    scrollBar.maxvalue = sizeDiff;
    // this.element.layout.layout(true);
  } else if (scrollBar) {
    parentEl.remove(scrollBar);
    parentEl.scrollBar = undefined;
    // this.element.layout.layout(true);
  }
}
