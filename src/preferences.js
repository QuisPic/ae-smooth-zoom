import { SETTINGS_SECTION_NAME, DEFAULT_SETTINGS } from "./constants";

function Preferences() {
  if (app.preferences.havePref(SETTINGS_SECTION_NAME, "keyBindings")) {
    this.keyBindings = app.preferences.getPrefAsString(
      SETTINGS_SECTION_NAME,
      "keyBindings",
    );
  } else {
    this.keyBindings = DEFAULT_SETTINGS.keyBindings;
  }

  if (app.preferences.havePref(SETTINGS_SECTION_NAME, "syncWithView")) {
    this.syncWithView = app.preferences.getPrefAsBool(
      SETTINGS_SECTION_NAME,
      "syncWithView",
    );
  } else {
    this.syncWithView = DEFAULT_SETTINGS.syncWithView;
  }

  if (app.preferences.havePref(SETTINGS_SECTION_NAME, "showSlider")) {
    this.showSlider = app.preferences.getPrefAsBool(
      SETTINGS_SECTION_NAME,
      "showSlider",
    );
  } else {
    this.showSlider = DEFAULT_SETTINGS.showSlider;
  }

  if (app.preferences.havePref(SETTINGS_SECTION_NAME, "sliderMin")) {
    this.sliderMin = app.preferences.getPrefAsFloat(
      SETTINGS_SECTION_NAME,
      "sliderMin",
    );
  } else {
    this.sliderMin = DEFAULT_SETTINGS.sliderMin;
  }

  if (app.preferences.havePref(SETTINGS_SECTION_NAME, "sliderMax")) {
    this.sliderMax = app.preferences.getPrefAsFloat(
      SETTINGS_SECTION_NAME,
      "sliderMax",
    );
  } else {
    this.sliderMax = DEFAULT_SETTINGS.sliderMax;
  }
}

Preferences.prototype.save = function (key, value) {
  if (typeof value === "boolean") {
    app.preferences.savePrefAsBool(SETTINGS_SECTION_NAME, key, value);
  } else if (typeof value === "number") {
    app.preferences.savePrefAsFloat(SETTINGS_SECTION_NAME, key, value);
  } else if (typeof value === "string") {
    app.preferences.savePrefAsString(SETTINGS_SECTION_NAME, key, value);
  }

  this[key] = value;
};

var preferences = new Preferences();

export default preferences;