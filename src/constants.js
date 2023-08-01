export var SETTINGS_SECTION_NAME = "Quis/Ae_Smooth_Zoom";
export var BLUE_COLOR = [0.06, 0.52, 0.94, 1];
export var ZOOM_STEP_ON_BTN_CLICK = 1;
export var OS = { WIN: 0, MAC: 1 };
export var AE_OS = $.os.indexOf("Win") !== -1 ? OS.WIN : OS.MAC;
export var STICK_TO = { LEFT: 0, RIGHT: 1 };
export var ZOOM_LIST_VALUES = [
  "1.5%",
  "3.1%",
  "6.25%",
  "12.5%",
  "25%",
  "33.3%",
  "50%",
  "100%",
  "200%",
  "400%",
  "800%",
  "1600%",
  "3200%",
  "6400%",
];

export var DEFAULT_SETTINGS = {
  keyBindings:
    '[{"enabled":true,"keyCodes":{"type":11,"mask":2,"keycode":1},"action":0,"amount":1},{"enabled":true,"keyCodes":{"type":11,"mask":2,"keycode":2},"action":1,"amount":1},{"enabled":false,"keyCodes":{"type":4,"mask":2,"keycode":61},"action":0,"amount":1},{"enabled":false,"keyCodes":{"type":4,"mask":2,"keycode":45},"action":1,"amount":1}]',
  syncWithView: true,
  showSlider: true,
  sliderMin: 1,
  sliderMax: 400,
};

export var TABLE_SIZES = [20, 20, 250, 100, 50, 30];

/** Begin Mouse Buttons */
export var VC_LEFT_MOUSE_BUTTON = 1;
export var VC_RIGHT_MOUSE_BUTTON = 2;
export var VC_MIDDLE_MOUSE_BUTTON = 3;
/** End Mouse Buttons */

/** Begin Mouse Wheel */
export var VC_WHEEL_UP = 1;
export var VC_WHEEL_DOWN = 2;
/** End Mouse Wheel */

/** Begin uiohook types */
var MASK_SHIFT_L = 1 << 0;
var MASK_CTRL_L = 1 << 1;
var MASK_META_L = 1 << 2;
var MASK_ALT_L = 1 << 3;

var MASK_SHIFT_R = 1 << 4;
var MASK_CTRL_R = 1 << 5;
var MASK_META_R = 1 << 6;
var MASK_ALT_R = 1 << 7;

export var MASK_SHIFT = MASK_SHIFT_L | MASK_SHIFT_R;
export var MASK_CTRL = MASK_CTRL_L | MASK_CTRL_R;
export var MASK_META = MASK_META_L | MASK_META_R;
export var MASK_ALT = MASK_ALT_L | MASK_ALT_R;

export var EVENT_HOOK_ENABLED = 1;
export var EVENT_HOOK_DISABLED = 2;
export var EVENT_KEY_TYPED = 3;
export var EVENT_KEY_PRESSED = 4;
export var EVENT_KEY_RELEASED = 5;
export var EVENT_MOUSE_CLICKED = 6;
export var EVENT_MOUSE_PRESSED = 7;
export var EVENT_MOUSE_RELEASED = 8;
export var EVENT_MOUSE_MOVED = 9;
export var EVENT_MOUSE_DRAGGED = 10;
export var EVENT_MOUSE_WHEEL = 11;

/* Begin Virtual Key Codes */
export var VC_ESCAPE = 0x001b;

// Begin Function Keys
var VC_F1 = 0x0070;
var VC_F2 = 0x0071;
var VC_F3 = 0x0072;
var VC_F4 = 0x0073;
var VC_F5 = 0x0074;
var VC_F6 = 0x0075;
var VC_F7 = 0x0076;
var VC_F8 = 0x0077;
var VC_F9 = 0x0078;
var VC_F10 = 0x0079;
var VC_F11 = 0x007a;
var VC_F12 = 0x007b;

var VC_F13 = 0xf000;
var VC_F14 = 0xf001;
var VC_F15 = 0xf002;
var VC_F16 = 0xf003;
var VC_F17 = 0xf004;
var VC_F18 = 0xf005;
var VC_F19 = 0xf006;
var VC_F20 = 0xf007;
var VC_F21 = 0xf008;
var VC_F22 = 0xf009;
var VC_F23 = 0xf00a;
var VC_F24 = 0xf00b;
// End Function Keys

// Begin Alphanumeric Zone
var VC_BACK_QUOTE = 0x00c0; // GRAVE
var VC_BACKQUOTE = VC_BACK_QUOTE; // Deprecated

var VC_0 = 0x0030;
var VC_1 = 0x0031;
var VC_2 = 0x0032;
var VC_3 = 0x0033;
var VC_4 = 0x0034;
var VC_5 = 0x0035;
var VC_6 = 0x0036;
var VC_7 = 0x0037;
var VC_8 = 0x0038;
var VC_9 = 0x0039;

var VC_PLUS = 0x0209;
var VC_MINUS = 0x002d;
var VC_EQUALS = 0x003d;
var VC_ASTERISK = 0x0097;

var VC_AT = 0x0200;
var VC_AMPERSAND = 0x0096;
var VC_DOLLAR = 0x0203;
var VC_EXCLAMATION_MARK = 0x0205;
var VC_EXCLAMATION_DOWN = 0x0206; // Colombia & Mexico replaces '+/='

var VC_BACKSPACE = 0x0008;

var VC_TAB = 0x0009;
var VC_CAPS_LOCK = 0x0014;

var VC_A = 0x0041;
var VC_B = 0x0042;
var VC_C = 0x0043;
var VC_D = 0x0044;
var VC_E = 0x0045;
var VC_F = 0x0046;
var VC_G = 0x0047;
var VC_H = 0x0048;
var VC_I = 0x0049;
var VC_J = 0x004a;
var VC_K = 0x004b;
var VC_L = 0x004c;
var VC_M = 0x004d;
var VC_N = 0x004e;
var VC_O = 0x004f;
var VC_P = 0x0050;
var VC_Q = 0x0051;
var VC_R = 0x0052;
var VC_S = 0x0053;
var VC_T = 0x0054;
var VC_U = 0x0055;
var VC_V = 0x0056;
var VC_W = 0x0057;
var VC_X = 0x0058;
var VC_Y = 0x0059;
var VC_Z = 0x005a;

var VC_OPEN_BRACKET = 0x005b;
var VC_CLOSE_BRACKET = 0x005c;
var VC_BACK_SLASH = 0x005d;

var VC_COLON = 0x0201;
var VC_SEMICOLON = 0x003b;
var VC_QUOTE = 0x00de;
var VC_QUOTEDBL = 0x0098;
export var VC_ENTER = 0x000a;

var VC_LESS = 0x0099;
var VC_GREATER = 0x00a0;
var VC_COMMA = 0x002c;
var VC_PERIOD = 0x002e;
var VC_SLASH = 0x002f;
var VC_NUMBER_SIGN = 0x0208; // Used by Germany where the '/" key would be

var VC_OPEN_BRACE = 0x00a1;
var VC_CLOSE_BRACE = 0x00a2;

var VC_OPEN_PARENTHESIS = 0x0207;
var VC_CLOSE_PARENTHESIS = 0x020a;

var VC_SPACE = 0x0020;
// End Alphanumeric Zone

// Begin Edit Key Zone
var VC_PRINT_SCREEN = 0x009a; // SYSRQ
var VC_SCROLL_LOCK = 0x0091;
var VC_PAUSE = 0x0013;
var VC_CANCEL = 0x00d3; // BREAK

var VC_INSERT = 0x009b;
var VC_DELETE = 0x007f;
var VC_HOME = 0x0024;
var VC_END = 0x0023;
var VC_PAGE_UP = 0x0021;
var VC_PAGE_DOWN = 0x0022;
// End Edit Key Zone

// Begin Cursor Key Zone
var VC_UP = 0x0026;
var VC_LEFT = 0x0025;
var VC_BEGIN = 0xff58;
var VC_RIGHT = 0x0027;
var VC_DOWN = 0x0028;
// End Cursor Key Zone

// Begin Numeric Zone
var VC_NUM_LOCK = 0x0090;
var VC_KP_CLEAR = 0x000c;

var VC_KP_DIVIDE = 0x006f;
var VC_KP_MULTIPLY = 0x006a;
var VC_KP_SUBTRACT = 0x006d;
var VC_KP_EQUALS = 0x007c;
var VC_KP_ADD = 0x006b;
var VC_KP_ENTER = 0x007d;
var VC_KP_DECIMAL = 0x006e;
var VC_KP_SEPARATOR = 0x006c;
var VC_KP_COMMA = 0x007e; // This may only be available on OS X?

var VC_KP_0 = 0x0060;
var VC_KP_1 = 0x0061;
var VC_KP_2 = 0x0062;
var VC_KP_3 = 0x0063;
var VC_KP_4 = 0x0064;
var VC_KP_5 = 0x0065;
var VC_KP_6 = 0x0066;
var VC_KP_7 = 0x0067;
var VC_KP_8 = 0x0068;
var VC_KP_9 = 0x0069;

var VC_KP_END = 0xee00 | VC_KP_1;
var VC_KP_DOWN = 0xee00 | VC_KP_2;
var VC_KP_PAGE_DOWN = 0xee00 | VC_KP_3;
var VC_KP_LEFT = 0xee00 | VC_KP_4;
var VC_KP_BEGIN = 0xee00 | VC_KP_5;
var VC_KP_RIGHT = 0xee00 | VC_KP_6;
var VC_KP_HOME = 0xee00 | VC_KP_7;
var VC_KP_UP = 0xee00 | VC_KP_8;
var VC_KP_PAGE_UP = 0xee00 | VC_KP_9;
var VC_KP_INSERT = 0xee00 | VC_KP_0;
var VC_KP_DELETE = 0xee00 | VC_KP_SEPARATOR;
// End Numeric Zone

var VC_EX_PAGE_UP = 0xee00 | VC_PAGE_UP;
var VC_EX_PAGE_DOWN = 0xee00 | VC_PAGE_DOWN;
var VC_EX_END = 0xee00 | VC_END;
var VC_EX_HOME = 0xee00 | VC_HOME;
var VC_EX_LEFT = 0xee00 | VC_LEFT;
var VC_EX_UP = 0xee00 | VC_UP;
var VC_EX_RIGHT = 0xee00 | VC_RIGHT;
var VC_EX_DOWN = 0xee00 | VC_DOWN;
var VC_EX_INSERT = 0xee00 | VC_INSERT;
var VC_EX_DELETE = 0xee00 | VC_DELETE;
export var VC_EX_ENTER = 0x0e00 | VC_ENTER;

// Begin Modifier and Control Keys
export var VC_SHIFT_L = 0xa010;
export var VC_SHIFT_R = 0xb010;
export var VC_CONTROL_L = 0xa011;
export var VC_CONTROL_R = 0xb011;
export var VC_ALT_L = 0xa012; // Option or Alt Key
export var VC_ALT_R = 0xb012; // Option or Alt Key
export var VC_ALT_GRAPH = 0xff7e; // Replaces Right Alt Key
export var VC_META_L = 0xa09d; // Windows or Command Key
export var VC_META_R = 0xb09d; // Windows or Command Key
export var VC_CONTEXT_MENU = 0x020d;
// End Modifier and Control Keys

// Begin European Language Keys
var VC_CIRCUMFLEX = 0x0202;
var VC_DEAD_GRAVE = 0x0080;
var VC_DEAD_ACUTE = 0x0081;
var VC_DEAD_CIRCUMFLEX = 0x0082;
var VC_DEAD_TILDE = 0x0083;
var VC_DEAD_MACRON = 0x0084;
var VC_DEAD_BREVE = 0x0085;
var VC_DEAD_ABOVEDOT = 0x0086;
var VC_DEAD_DIAERESIS = 0x0087;
var VC_DEAD_ABOVERING = 0x0088;
var VC_DEAD_DOUBLEACUTE = 0x0089;
var VC_DEAD_CARON = 0x008a;
var VC_DEAD_CEDILLA = 0x008b;
var VC_DEAD_OGONEK = 0x008c;
var VC_DEAD_IOTA = 0x008d;
var VC_DEAD_VOICED_SOUND = 0x008e;
var VC_DEAD_SEMIVOICED_SOUND = 0x008f;
// End European Language Keys

// Begin Asian Language Keys
var VC_KATAKANA = 0x00f1;
var VC_KANA = 0x0015;
var VC_KANA_LOCK = 0x0106;

var VC_KANJI = 0x0019;
var VC_HIRAGANA = 0x00f2;

var VC_ACCEPT = 0x001e;
var VC_CONVERT = 0x001c;
var VC_COMPOSE = 0xff20;
var VC_INPUT_METHOD_ON_OFF = 0x0107;

var VC_ALL_CANDIDATES = 0x0100;
var VC_ALPHANUMERIC = 0x00f0;
var VC_CODE_INPUT = 0x0102;
var VC_FULL_WIDTH = 0x00f3;
var VC_HALF_WIDTH = 0x00f4;
var VC_NONCONVERT = 0x001d;
var VC_PREVIOUS_CANDIDATE = 0x0101;
var VC_ROMAN_CHARACTERS = 0x00f5;

var VC_UNDERSCORE = 0x020b;
// End Asian Language Keys

// Begin Sun Keys
var VC_SUN_HELP = 0xff75;

var VC_SUN_STOP = 0xff78;
var VC_SUN_PROPS = 0xff76;
var VC_SUN_FRONT = 0xff77;
var VC_SUN_OPEN = 0xff74;
var VC_SUN_FIND = 0xff7e;
var VC_SUN_AGAIN = 0xff79;
var VC_SUN_UNDO = 0xff7a;
var VC_SUN_COPY = 0xff7c;
var VC_SUN_PASTE = 0xff7d;
var VC_SUN_INSERT = VC_SUN_PASTE; // Deprecated
var VC_SUN_CUT = 0xff7b;
// End Sun Keys

var VC_UNDEFINED = 0x0000; // KeyCode Unknown
/* End Virtual Key Codes */

/** Begin VC Map */
export var VC_MAP = {};
VC_MAP[VC_ESCAPE] = "Escape";

VC_MAP[VC_F1] = "F1";
VC_MAP[VC_F2] = "F2";
VC_MAP[VC_F3] = "F3";
VC_MAP[VC_F4] = "F4";
VC_MAP[VC_F5] = "F5";
VC_MAP[VC_F6] = "F6";
VC_MAP[VC_F7] = "F7";
VC_MAP[VC_F8] = "F8";
VC_MAP[VC_F9] = "F9";
VC_MAP[VC_F10] = "F10";
VC_MAP[VC_F11] = "F11";
VC_MAP[VC_F12] = "F12";

VC_MAP[VC_F13] = "F13";
VC_MAP[VC_F14] = "F14";
VC_MAP[VC_F15] = "F15";
VC_MAP[VC_F16] = "F16";
VC_MAP[VC_F17] = "F17";
VC_MAP[VC_F18] = "F18";
VC_MAP[VC_F19] = "F19";
VC_MAP[VC_F20] = "F20";
VC_MAP[VC_F21] = "F21";
VC_MAP[VC_F22] = "F22";
VC_MAP[VC_F23] = "F23";
VC_MAP[VC_F24] = "F24";

VC_MAP[VC_BACKQUOTE] = "`";

VC_MAP[VC_0] = "0";
VC_MAP[VC_1] = "1";
VC_MAP[VC_2] = "2";
VC_MAP[VC_3] = "3";
VC_MAP[VC_4] = "4";
VC_MAP[VC_5] = "5";
VC_MAP[VC_6] = "6";
VC_MAP[VC_7] = "7";
VC_MAP[VC_8] = "8";
VC_MAP[VC_9] = "9";

VC_MAP[VC_PLUS] = "+";
VC_MAP[VC_MINUS] = "-";
VC_MAP[VC_EQUALS] = "=";
VC_MAP[VC_ASTERISK] = "*";

VC_MAP[VC_AT] = "@";
VC_MAP[VC_AMPERSAND] = "&";
VC_MAP[VC_DOLLAR] = "$";
VC_MAP[VC_EXCLAMATION_MARK] = "!";
VC_MAP[VC_EXCLAMATION_DOWN] = "¡";

VC_MAP[VC_BACKSPACE] = "Backspace";

VC_MAP[VC_TAB] = "Tab";
VC_MAP[VC_CAPS_LOCK] = "Caps Lock";

VC_MAP[VC_A] = "A";
VC_MAP[VC_B] = "B";
VC_MAP[VC_C] = "C";
VC_MAP[VC_D] = "D";
VC_MAP[VC_E] = "E";
VC_MAP[VC_F] = "F";
VC_MAP[VC_G] = "G";
VC_MAP[VC_H] = "H";
VC_MAP[VC_I] = "I";
VC_MAP[VC_J] = "J";
VC_MAP[VC_K] = "K";
VC_MAP[VC_L] = "L";
VC_MAP[VC_M] = "M";
VC_MAP[VC_N] = "N";
VC_MAP[VC_O] = "O";
VC_MAP[VC_P] = "P";
VC_MAP[VC_Q] = "Q";
VC_MAP[VC_R] = "R";
VC_MAP[VC_S] = "S";
VC_MAP[VC_T] = "T";
VC_MAP[VC_U] = "U";
VC_MAP[VC_V] = "V";
VC_MAP[VC_W] = "W";
VC_MAP[VC_X] = "X";
VC_MAP[VC_Y] = "Y";
VC_MAP[VC_Z] = "Z";

VC_MAP[VC_OPEN_BRACKET] = "[";
VC_MAP[VC_CLOSE_BRACKET] = "]";
VC_MAP[VC_BACK_SLASH] = "\\";

VC_MAP[VC_COLON] = ":";
VC_MAP[VC_SEMICOLON] = ";";
VC_MAP[VC_QUOTE] = "'";
VC_MAP[VC_QUOTEDBL] = '"';
VC_MAP[VC_ENTER] = "Enter";

VC_MAP[VC_LESS] = "<";
VC_MAP[VC_GREATER] = ">";
VC_MAP[VC_COMMA] = ",";
VC_MAP[VC_PERIOD] = ".";
VC_MAP[VC_SLASH] = "/";
VC_MAP[VC_NUMBER_SIGN] = "#";

VC_MAP[VC_OPEN_BRACE] = "{";
VC_MAP[VC_CLOSE_BRACE] = "}";

VC_MAP[VC_OPEN_PARENTHESIS] = "(";
VC_MAP[VC_CLOSE_PARENTHESIS] = ")";

VC_MAP[VC_SPACE] = "Space";

VC_MAP[VC_PRINT_SCREEN] = "Print Screen";
VC_MAP[VC_SCROLL_LOCK] = "Scroll Lock";
VC_MAP[VC_PAUSE] = "Pause";
VC_MAP[VC_CANCEL] = "Cancel";

VC_MAP[VC_INSERT] = "Insert";
VC_MAP[VC_DELETE] = "Delete";
VC_MAP[VC_HOME] = "Home";
VC_MAP[VC_END] = "End";
VC_MAP[VC_PAGE_UP] = "Page Up";
VC_MAP[VC_PAGE_DOWN] = "Page Down";

VC_MAP[VC_UP] = "Up";
VC_MAP[VC_LEFT] = "Left";
VC_MAP[VC_BEGIN] = "Begin";
VC_MAP[VC_RIGHT] = "Right";
VC_MAP[VC_DOWN] = "Down";

VC_MAP[VC_NUM_LOCK] = "Num Lock";
VC_MAP[VC_KP_CLEAR] = "KP Clear";
VC_MAP[VC_KP_DIVIDE] = "KP /";
VC_MAP[VC_KP_MULTIPLY] = "KP *";
VC_MAP[VC_KP_SUBTRACT] = "KP -";
VC_MAP[VC_KP_EQUALS] = "KP =";
VC_MAP[VC_KP_ADD] = "KP +";
VC_MAP[VC_KP_ENTER] = "KP Enter";
VC_MAP[VC_KP_DECIMAL] = "KP .";
VC_MAP[VC_KP_SEPARATOR] = "KP Separator";
VC_MAP[VC_KP_COMMA] = "KP ,";

VC_MAP[VC_KP_0] = "0";
VC_MAP[VC_KP_1] = "1";
VC_MAP[VC_KP_2] = "2";
VC_MAP[VC_KP_3] = "3";
VC_MAP[VC_KP_4] = "4";
VC_MAP[VC_KP_5] = "5";
VC_MAP[VC_KP_6] = "6";
VC_MAP[VC_KP_7] = "7";
VC_MAP[VC_KP_8] = "8";
VC_MAP[VC_KP_9] = "9";

VC_MAP[VC_KP_END] = "KP End";
VC_MAP[VC_KP_DOWN] = "KP Down";
VC_MAP[VC_KP_PAGE_DOWN] = "KP Page Down";
VC_MAP[VC_KP_LEFT] = "KP Left";
VC_MAP[VC_KP_BEGIN] = "KP Begin";
VC_MAP[VC_KP_RIGHT] = "KP Right";
VC_MAP[VC_KP_HOME] = "KP Home";
VC_MAP[VC_KP_UP] = "KP Up";
VC_MAP[VC_KP_PAGE_UP] = "KP Page Up";
VC_MAP[VC_KP_INSERT] = "KP Insert";
VC_MAP[VC_KP_DELETE] = "KP Delete";

VC_MAP[VC_EX_END] = "End";
VC_MAP[VC_EX_DOWN] = "Down";
VC_MAP[VC_EX_PAGE_DOWN] = "Page Down";
VC_MAP[VC_EX_LEFT] = "Left";
VC_MAP[VC_EX_RIGHT] = "Right";
VC_MAP[VC_EX_HOME] = "Home";
VC_MAP[VC_EX_UP] = "Up";
VC_MAP[VC_EX_PAGE_UP] = "Page Up";
VC_MAP[VC_EX_INSERT] = "Insert";
VC_MAP[VC_EX_DELETE] = "Delete";
VC_MAP[VC_EX_ENTER] = "Begin";

VC_MAP[VC_SHIFT_L] = "Shift";
VC_MAP[VC_SHIFT_R] = "Shift";
VC_MAP[VC_CONTROL_L] = "Control";
VC_MAP[VC_CONTROL_R] = "Control";
VC_MAP[VC_ALT_L] = "Alt";
VC_MAP[VC_ALT_R] = "Alt";
VC_MAP[VC_ALT_GRAPH] = "Alt";
VC_MAP[VC_META_L] = "Command";
VC_MAP[VC_META_R] = "Command";
VC_MAP[VC_CONTEXT_MENU] = "Menu";

VC_MAP[VC_CIRCUMFLEX] = "^";
VC_MAP[VC_DEAD_GRAVE] = "Grave";
VC_MAP[VC_DEAD_ACUTE] = "Acute";
VC_MAP[VC_DEAD_CIRCUMFLEX] = "Circumflex";
VC_MAP[VC_DEAD_TILDE] = "Tilde";
VC_MAP[VC_DEAD_MACRON] = "Macron";
VC_MAP[VC_DEAD_BREVE] = "Breve";
VC_MAP[VC_DEAD_ABOVEDOT] = "Above Dot";
VC_MAP[VC_DEAD_DIAERESIS] = "Diaeresis";
VC_MAP[VC_DEAD_ABOVERING] = "Above Ring";
VC_MAP[VC_DEAD_DOUBLEACUTE] = "Double Acute";
VC_MAP[VC_DEAD_CARON] = "Caron";
VC_MAP[VC_DEAD_CEDILLA] = "Cedilla";
VC_MAP[VC_DEAD_OGONEK] = "Ogonek";
VC_MAP[VC_DEAD_IOTA] = "Iota";
VC_MAP[VC_DEAD_VOICED_SOUND] = "Voiced Sound";
VC_MAP[VC_DEAD_SEMIVOICED_SOUND] = "Semivoiced Sound";

VC_MAP[VC_KATAKANA] = "Katakana";
VC_MAP[VC_KANA] = "Kana";
VC_MAP[VC_KANA_LOCK] = "Kana Lock";

VC_MAP[VC_KANJI] = "Kanji";
VC_MAP[VC_HIRAGANA] = "Hiragana";

VC_MAP[VC_ACCEPT] = "Accept";
VC_MAP[VC_CONVERT] = "Convert";
VC_MAP[VC_COMPOSE] = "Compose";
VC_MAP[VC_INPUT_METHOD_ON_OFF] = "Input Method ON/OFF";

VC_MAP[VC_ALL_CANDIDATES] = "All Candidates";
VC_MAP[VC_ALPHANUMERIC] = "Alphanumeric";
VC_MAP[VC_CODE_INPUT] = "Code Input";
VC_MAP[VC_FULL_WIDTH] = "Full Width";
VC_MAP[VC_HALF_WIDTH] = "Half Width";
VC_MAP[VC_NONCONVERT] = "Nonconvert";
VC_MAP[VC_PREVIOUS_CANDIDATE] = "Previous Candidate";
VC_MAP[VC_ROMAN_CHARACTERS] = "Roman Characters";
VC_MAP[VC_UNDERSCORE] = "Underscore";

VC_MAP[VC_SUN_HELP] = "Help";
VC_MAP[VC_SUN_STOP] = "Stop";
VC_MAP[VC_SUN_PROPS] = "Props";
VC_MAP[VC_SUN_FRONT] = "Front";
VC_MAP[VC_SUN_OPEN] = "Open";
VC_MAP[VC_SUN_FIND] = "Find";
VC_MAP[VC_SUN_AGAIN] = "Again";
VC_MAP[VC_SUN_UNDO] = "Undo";
VC_MAP[VC_SUN_COPY] = "Copy";
VC_MAP[VC_SUN_PASTE] = "Paste";
VC_MAP[VC_SUN_INSERT] = "Insert";
VC_MAP[VC_SUN_CUT] = "Cut";

VC_MAP[VC_UNDEFINED] = "Undefined";
/** End VC Map */
