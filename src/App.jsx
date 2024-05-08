import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl
import Loader from "./components/loader";
import ButtonHandler from "./components/btn-handler";
import { detect, detectVideo } from "./utils/detect";
import "./style/App.css";
import objects from "./utils/labels.json";

const App = () => {
  const [loading, setLoading] = useState({ loading: true, progress: 0 }); // loading state
  const [model, setModel] = useState({
    net: null,
    inputShape: [1, 0, 0, 3],
  }); // init model & input shape

  // references
  const imageRef = useRef(null);
  const cameraRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // model configs
  const modelName = "yolov8n";

  useEffect(() => {
    tf.ready().then(async () => {
      const yolov8 = await tf.loadGraphModel(
        `${window.location.href}/${modelName}_web_model/model.json`,
        {
          onProgress: (fractions) => {
            setLoading({ loading: true, progress: fractions }); // set loading fractions
          },
        }
      ); // load model

      // warming up model
      const dummyInput = tf.ones(yolov8.inputs[0].shape);
      const warmupResults = yolov8.execute(dummyInput);

      setLoading({ loading: false, progress: 1 });
      setModel({
        net: yolov8,
        inputShape: yolov8.inputs[0].shape,
      }); // set model & input shape

      tf.dispose([warmupResults, dummyInput]); // cleanup memory
    });
  }, []);

  return (
    // <div className="container">
    <>
      {loading.loading && (
        <Loader>
          Cargando Modelo... {(loading.progress * 100).toFixed(2)}%
        </Loader>
      )}
      <div className="App">
        <section className="grapper-logo">
          <img className="logo" src="/umg.webp" alt="logo umg" />
          <h2 className="text">Universidad Mariano Gálvez de Guatemala</h2>
        </section>
        <section className="content">
          <div className="header">
            <h1 className="title">Visión por IA</h1>
            <p className="subtitle">Ingenieria en Sistemas</p>
            <p className="subtitle">Noveno Semestre</p>
          </div>
          <div className="grapper-camera">
            <video
              autoPlay
              muted
              ref={cameraRef}
              onPlay={() =>
                detectVideo(cameraRef.current, model, canvasRef.current)
              }
            />

            <canvas
              width={model.inputShape[1]}
              height={model.inputShape[2]}
              ref={canvasRef}
            />
          </div>
          <ButtonHandler cameraRef={cameraRef} />
        </section>
        <section className="grapper-list_objects">
          <h2 className="subtitle">Lista de Objetos a Detectar</h2>
          <ul>
            {objects.map((object, i) => (
              <li key={i}>{object}</li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
};

export default App;
