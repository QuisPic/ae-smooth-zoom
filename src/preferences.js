import zoomPlugin from "./zoomPlugin";
import { SETTINGS_SECTION_NAME, DEFAULT_SETTINGS } from "./constants";
import JSON from "../extern/json2";

function Preferences() {
  if (!app.preferences.havePref(SETTINGS_SECTION_NAME, "keyBindings")) {
    this.save("keyBindings", DEFAULT_SETTINGS.keyBindings);
  }
  if (!app.preferences.havePref(SETTINGS_SECTION_NAME, "syncWithView")) {
    this.save("syncWithView", DEFAULT_SETTINGS.syncWithView);
  }
  if (!app.preferences.havePref(SETTINGS_SECTION_NAME, "highDPI")) {
    this.save("highDPI", DEFAULT_SETTINGS.highDPI);
  }
  if (!app.preferences.havePref(SETTINGS_SECTION_NAME, "showSlider")) {
    this.save("showSlider", DEFAULT_SETTINGS.showSlider);
  }
  if (!app.preferences.havePref(SETTINGS_SECTION_NAME, "sliderMin")) {
    this.save("sliderMin", DEFAULT_SETTINGS.sliderMin);
  }
  if (!app.preferences.havePref(SETTINGS_SECTION_NAME, "sliderMax")) {
    this.save("sliderMax", DEFAULT_SETTINGS.sliderMax);
  }
  if (!app.preferences.havePref(SETTINGS_SECTION_NAME, "presetValues")) {
    this.save("presetValues", DEFAULT_SETTINGS.presetValues);
  }
  if (!app.preferences.havePref(SETTINGS_SECTION_NAME, "experimental")) {
    this.save("experimental", DEFAULT_SETTINGS.experimental);
  }

  this.keyBindings = app.preferences.getPrefAsString(
    SETTINGS_SECTION_NAME,
    "keyBindings",
  );

  this.syncWithView = app.preferences.getPrefAsBool(
    SETTINGS_SECTION_NAME,
    "syncWithView",
  );

  this.highDPI = JSON.parse(
    app.preferences.getPrefAsString(SETTINGS_SECTION_NAME, "highDPI"),
  );

  this.showSlider = app.preferences.getPrefAsBool(
    SETTINGS_SECTION_NAME,
    "showSlider",
  );

  this.sliderMin = app.preferences.getPrefAsFloat(
    SETTINGS_SECTION_NAME,
    "sliderMin",
  );

  this.sliderMax = app.preferences.getPrefAsFloat(
    SETTINGS_SECTION_NAME,
    "sliderMax",
  );

  this.presetValues = app.preferences.getPrefAsString(
    SETTINGS_SECTION_NAME,
    "presetValues",
  );

  this.experimental = JSON.parse(
    app.preferences.getPrefAsString(SETTINGS_SECTION_NAME, "experimental"),
  );
}

Preferences.prototype.save = function (key, value) {
  if (typeof value === "boolean") {
    app.preferences.savePrefAsBool(SETTINGS_SECTION_NAME, key, value);
  } else if (typeof value === "number") {
    app.preferences.savePrefAsFloat(SETTINGS_SECTION_NAME, key, value);
  } else if (typeof value === "string") {
    app.preferences.savePrefAsString(SETTINGS_SECTION_NAME, key, value);
  } else if (typeof value === "object") {
    app.preferences.savePrefAsString(
      SETTINGS_SECTION_NAME,
      key,
      JSON.stringify(value),
    );
  }

  /** If the plugin is available and the preference that was saved is related to the plugin
   * then tell the plugin to read the updated option.
   */
  if (zoomPlugin.isAvailable()) {
    switch (key) {
      case "keyBindings":
        zoomPlugin.updateKeyBindings();
        break;
      case "experimental":
        zoomPlugin.updateExperimentalOptions();
        break;
      case "highDPI":
        zoomPlugin.updateHighDpiOptions();
        break;
      default:
        break;
    }
  }

  this[key] = value;
};

var preferences = new Preferences();

export default preferences;
