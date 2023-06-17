# Ae Smooth Zoom
A script for Adobe After Effects that can smoothly change zoom in your Composition View.

## Reason
After Effects Composition View has only fixed zoom levels: `25%, 33.3%, 50%, 100%, etc.`, and there is no buttons or shortcuts to change zoom to any other values. This script creates a simple interface that can change zoom level to any value through Extendscript.

### The Extendscript command
If you just want to know how to set custom zoom level through Extendscript then here it is.
Run this command in Ae to set the zoom level of the active viewer. The value of 1 equals to 100% zoom.
```
app.activeViewer.views[0].options.zoom = someValue;
```
Save this command in a text file and replace `someValue` with any number. In Ae go to "File -> Scripts -> Run Script File..." and select the text file you just saved. This should run the script.

## Build
With npm:
```
npm install
```
With yarn:
```
yarn install
```
