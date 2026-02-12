import React, { useState, useRef } from "react";
import cv from "@techstark/opencv-js";
import Loader from "./components/loader";
import { detectImage } from "./utils/detect";
import "./style/App.css";

const path = window.require ? window.require('path') : null;
const ort = window.require ? window.require('onnxruntime-node') : null;

const App = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState({ text: "Loading OpenCV.js", progress: null });
  const [image, setImage] = useState(null);
  const inputImage = useRef(null);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  // configs
  const modelName = "yolov8n-seg.onnx";
  const modelInputShape = [1, 3, 640, 640];
  const topk = 100;
  const iouThreshold = 0.45;
  const scoreThreshold = 0.25;

  // wait until opencv.js initialized
  cv["onRuntimeInitialized"] = async () => {
    try {
      // Get model paths for Electron
      const getModelPath = (name) => {
        if (path) {
          return path.join(window.__dirname || __dirname, 'public', 'model', name);
        }
        return `./model/${name}`;
      };

      const yolov8Path = getModelPath(modelName);
      const nmsPath = getModelPath("nms-yolov8.onnx");
      const maskPath = getModelPath("mask-yolov8-seg.onnx");

      // Create sessions using onnxruntime-node
      setLoading({ text: "Loading YOLOv8 Segmentation model...", progress: null });
      const yolov8 = await ort.InferenceSession.create(yolov8Path, {
        executionProviders: ['cpu']
      });
      
      setLoading({ text: "Loading NMS model...", progress: null });
      const nms = await ort.InferenceSession.create(nmsPath, {
        executionProviders: ['cpu']
      });
      
      setLoading({ text: "Loading Mask model...", progress: null });
      const mask = await ort.InferenceSession.create(maskPath, {
        executionProviders: ['cpu']
      });

      // warmup main model
      setLoading({ text: "Warming up model...", progress: null });
      const tensor = new ort.Tensor(
        "float32",
        new Float32Array(modelInputShape.reduce((a, b) => a * b)),
        modelInputShape
      );
      await yolov8.run({ images: tensor });

      setSession({ net: yolov8, nms: nms, mask: mask });
      setLoading(null);
    } catch (error) {
      console.error("Error initializing models:", error);
      setLoading({ text: `Error: ${error.message}`, progress: null });
    }
  };

  return (
    <div className="App">
      {loading && (
        <Loader>
          {loading.progress ? `${loading.text} - ${loading.progress}%` : loading.text}
        </Loader>
      )}
      <div className="header">
        <h1>YOLOv8 Object Segmentation App</h1>
        <p>
          YOLOv8 object detection application running on Electron powered by{" "}
          <code>onnxruntime-node</code>
        </p>
        <p>
          Serving : <code className="code">{modelName}</code>
        </p>
      </div>

      <div className="content">
        <img
          ref={imageRef}
          src="#"
          alt=""
          style={{ display: image ? "block" : "none" }}
          onLoad={() => {
            detectImage(
              imageRef.current,
              canvasRef.current,
              session,
              topk,
              iouThreshold,
              scoreThreshold,
              modelInputShape
            );
          }}
        />
        <canvas
          id="canvas"
          width={modelInputShape[2]}
          height={modelInputShape[3]}
          ref={canvasRef}
        />
      </div>

      <input
        type="file"
        ref={inputImage}
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          // handle next image to detect
          if (image) {
            URL.revokeObjectURL(image);
            setImage(null);
          }

          const url = URL.createObjectURL(e.target.files[0]); // create image url
          imageRef.current.src = url; // set image source
          setImage(url);
        }}
      />
      <div className="btn-container">
        <button
          onClick={() => {
            inputImage.current.click();
          }}
        >
          Open local image
        </button>
        {image && (
          /* show close btn when there is image */
          <button
            onClick={() => {
              inputImage.current.value = "";
              imageRef.current.src = "#";
              URL.revokeObjectURL(image);
              setImage(null);
            }}
          >
            Close image
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
