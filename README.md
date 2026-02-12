# YOLOv8 Segmentation with onnxruntime-node (Electron Desktop App)

<p align="center">
  <img src="./sample.png" />
</p>

![love](https://img.shields.io/badge/Made%20with-🖤-white)
![react](https://img.shields.io/badge/React-blue?logo=react)
![onnxruntime-node](https://img.shields.io/badge/onnxruntime--node-white?logo=onnx&logoColor=black)
![electron](https://img.shields.io/badge/Electron-47848F?logo=electron&logoColor=white)
![opencv.js](https://img.shields.io/badge/opencv.js-green?logo=opencv)

---

Object Segmentation desktop application built with Electron.
Serving YOLOv8 segmentation using onnxruntime-node with `cpu` backend.

## Setup

```bash
git clone https://github.com/Hyuto/yolov8-seg-onnxruntime-web.git
cd yolov8-seg-onnxruntime-web
npm install # Install dependencies
```

## Scripts

```bash
npm run webpack # Build the React bundle (required before running)
npm start        # Start Electron app
npm run build    # Build for production (creates distributable)
npm run dev      # Development mode with auto-rebuild
```

## Running the Application

1. First, build the webpack bundle:
   ```bash
   npm run webpack
   ```

2. Then start the Electron app:
   ```bash
   npm start
   ```

The application will open in a desktop window where you can load images and perform object segmentation.

## Models

**Main Model**

YOLOv8n-seg model converted to onnx.

```
used model : yolov8n-seg.onnx
size       : 14 Mb
```

**NMS**

ONNX model to perform NMS operator [CUSTOM].

[![nms-yolov8.onnx](https://img.shields.io/badge/nms--yolov8.onnx-black?logo=onnx)](https://netron.app/?url=https://raw.githubusercontent.com/Hyuto/yolov8-seg-onnxruntime-web/master/public/model/nms-yolov8.onnx)

**Mask**

ONNX model to produce mask for every object detected [CUSTOM].

[![mask-yolov8-seg.onnx](https://img.shields.io/badge/mask--yolov8--seg.onnx-black?logo=onnx)](https://netron.app/?url=https://raw.githubusercontent.com/Hyuto/yolov8-seg-onnxruntime-web/master/public/model/mask-yolov8-seg.onnx)

## Use another model

> :warning: **Model Size** : The YOLOv8n-seg model used in this repo is 14 MB. Larger models will require more memory and may impact performance.

Use another YOLOv8 segmentation model:

1. Export YOLOv8 model to onnx format. Read more on the [official documentation](https://docs.ultralytics.com/tasks/segmentation/#export)

   ```python
   from ultralytics import YOLO

   # Load a model
   model = YOLO("yolov8*-seg.pt")  # load an official yolov8* model

   # Export the model
   model.export(format="onnx")
   ```

2. Copy `yolov8*.onnx` to `./public/model`
3. Update `modelName` in `src/App.js` to new model name
   ```javascript
   ...
   // configs
   const modelName = "yolov8*-seg.onnx";
   const modelInputShape = [1, 3, 640, 640];
   const topk = 100;
   const iouThreshold = 0.45;
   const scoreThreshold = 0.25;
   ...
   ```
4. Rebuild the webpack bundle: `npm run webpack`
5. Restart the app: `npm start`
6. Done! 😊

**Note: Custom Trained YOLOv8 Segmentation Models**

Please update `src/utils/labels.json` with your YOLOv8 Segmentation classes.

## Architecture

This application uses:
- **Electron** for desktop app framework
- **React** for UI components
- **onnxruntime-node** for model inference (CPU backend)
- **OpenCV.js** for image preprocessing
- **Webpack** for bundling the React application

The app runs model inference in the Electron renderer process with Node.js integration enabled.

## Reference

- https://github.com/ultralytics/ultralytics
- https://github.com/Hyuto/yolov8-onnxruntime-web
- https://github.com/Hyuto/yolov5-seg-onnxruntime-web
