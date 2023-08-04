import zoomPlugin from "./zoomPlugin";
import { SETTINGS_SECTION_NAME, DEFAULT_SETTINGS } from "./constants";

function Preferences() {
  if (!app.preferences.havePref(SETTINGS_SECTION_NAME, "keyBindings")) {
    this.save("keyBindings", DEFAULT_SETTINGS.keyBindings);
  }
  if (!app.preferences.havePref(SETTINGS_SECTION_NAME, "syncWithView")) {
    this.save("syncWithView", DEFAULT_SETTINGS.syncWithView);
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

  this.keyBindings = app.preferences.getPrefAsString(
    SETTINGS_SECTION_NAME,
    "keyBindings",
  );

  this.syncWithView = app.preferences.getPrefAsBool(
    SETTINGS_SECTION_NAME,
    "syncWithView",
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
}

Preferences.prototype.save = function (key, value) {
  if (typeof value === "boolean") {
    app.preferences.savePrefAsBool(SETTINGS_SECTION_NAME, key, value);
  } else if (typeof value === "number") {
    app.preferences.savePrefAsFloat(SETTINGS_SECTION_NAME, key, value);
  } else if (typeof value === "string") {
    app.preferences.savePrefAsString(SETTINGS_SECTION_NAME, key, value);
  }

  /** If the key is "keyBindings", tell the plugin to update key bindings info */
  if (zoomPlugin.isAvailable && key === "keyBindings") {
    zoomPlugin.updateKeyBindings();
  }

  this[key] = value;
};

var preferences = new Preferences();

export default preferences;
