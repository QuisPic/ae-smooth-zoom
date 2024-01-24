# Zoom script for Ae
A script for Adobe After Effects that can smoothly change zoom in your Composition View.

[diamond.webm](https://github.com/QuisPic/ae-zoom/assets/56075863/83c9bc7e-286c-4915-91b2-dc7d1ca1f4b7)

[map.webm](https://github.com/QuisPic/ae-zoom/assets/56075863/811d3433-8170-491e-a2c7-bca56bbf998d)

## Reason
After Effects Composition View has only fixed zoom levels: `25%, 33.3%, 50%, 100%, etc.`, and there is no buttons or shortcuts to change zoom to any other values. This script creates a simple interface that can change zoom level to any value through Extendscript.

### The Extendscript command
If you just want to know how to set custom zoom level through Extendscript then here it is.
Run this command in Ae to set the zoom level of the active viewer. The value of 1 equals to 100% zoom.
```
app.activeViewer.views[0].options.zoom = someValue;
```
Save this command in a text file and replace `someValue` with any number. In Ae go to "File -> Scripts -> Run Script File..." and select the text file you just saved. This will run the script.

## Build
You'll need Node.js installed on your computer. After Node.js is installed, open the repo folder in the Terminal and run:

```
npm install
npm run build
```
Or, if you have Yarn installed:
```
yarn install
yarn run build
```
The script should be in the `./dist` folder.

## Run the script
Open After Effects, go to "File -> Scripts -> Run Script File..." and open the script file. A new Script UI window should pop up.

## Install as a dockable panel
### Install via After Effects
Open After Effects, go to "File -> Scripts -> Install Script UI Panel..." and open the script file.

### Install Manually
Copy the script file to:

Windows: `C:\Program Files\Adobe\Adobe After Effects [version]\Support Files\Scripts\ScriptUI Panels`

macOS: `/Applications/Adobe After Effects [version]/Scripts/ScriptUI Panels`

Restart After Effects and you should be able to find the script under the Window menu.

## Usage
The script UI has many similarities with the After Effects UI.
#### Number
- Click once on the blue number to enter the value manually.
- Click and drag the blue number to chage the zoom level.
- Hold `shift` while dragging to change the value faster.
- Hold `ctrl / cmd` while dragging to change the value slower.

#### Slider
- Drag the slider to change zoom.
- Click on the buttons on the sides of the slider to increment or decrement zoom by 1.
- Hold `shift` and click the buttons to change the zoom by 10.
- Hold `ctrl / cmd` and click the buttons to change the zoom by 0.1.

#### Settings
Click on the small 3-dots button on the right side of the script window to display the settings menu. Here you can hide/show the slider and change its min and max values.

#### Key Bindings
Add any number of custom key bindings that can change zoom value. This feature allows to use all features of Zoom without any user interface. The default key bindings are: **(Ctrl + Scroll Up)** to increase zoom and **(Ctrl + Scroll Down)** to decrease zoom.

Key bindings are only available after installing the [Zoom plug-in](https://github.com/QuisPic/ae-zoom-plugin) in After Effects.
