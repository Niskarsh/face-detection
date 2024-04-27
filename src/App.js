import React, { Component } from 'react';
import { FaceDetection } from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';
// import { drawRectangle, drawLandmarks } from '@mediapipe/drawing_utils';
import axios from 'axios';
import './App.css';

class App extends Component {
  state = {
    subject_in_frame: true,
  };

  onResults(canvasCtx, canvasElement, drawingUtils, results) {
    let { subject_in_frame } = this.state;
    if (results.detections.length === 0) {
      if (subject_in_frame) {
        this.setState({ subject_in_frame: false });
      }
    } else {
      if (!subject_in_frame) {
        this.setState({ subject_in_frame: true });
      }
    }
    // Draws landmarks on Vid - Not need for this demo
    // // Draw the overlays.
    // canvasCtx.save();
    // canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    // canvasCtx.drawImage(
    //   results.image, 0, 0, canvasElement.width, canvasElement.height);
    // if (results.detections.length > 0) {
    //   drawRectangle(
    //     canvasCtx, results.detections[0].boundingBox,
    //     { color: 'blue', lineWidth: 4, fillColor: '#00000000' });
    //   drawLandmarks(canvasCtx, results.detections[0].landmarks, {
    //     color: 'red',
    //     radius: 5,
    //   });
    // }
    // canvasCtx.restore();
  }

  componentDidMount() {
    const videoElement = document.getElementsByClassName('input_video')[0];
    const canvasElement = document.getElementsByClassName('output_canvas')[0];
    const canvasCtx = canvasElement.getContext('2d');
    const drawingUtils = window;
// drawingUtils.dr
    const faceDetection = new FaceDetection({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@0.4/${file}`;
    }});
    faceDetection.setOptions({
      model: 'short',
      minDetectionConfidence: 0.5
    });
    faceDetection.onResults(this.onResults.bind(this, canvasCtx, canvasElement, drawingUtils));

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await faceDetection.send({ image: videoElement });
      },
      width: 1280,
      height: 720
    });
    camera.start();
  }

  render() {
    const { subject_in_frame } = this.state;
    return (
      <div className="App">
        <h1>Subject in Frame: {subject_in_frame.toString()}</h1>

        <video className="input_video" hidden="true"></video>
        <canvas className="output_canvas" width="1280px" height="720px"></canvas>
      </div >
    );
  }
}

export default App;
