import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import Image from "next/image";
import { Prediction, sleep } from "./TextPrompt";

export default function ImagePrompt() {
    const [uploadedImageURI, setUploadedImageURI] = useState<string>("");
    const [error, setError] = useState<string | null>();
    const [prediction, setPrediction] = useState<Prediction | null>(null);

    const handleSubmit = async (e: any) => {
        console.log("handleSubmit()");
        e.preventDefault();

        /*
        if (uploadedImageURI === "") {
            console.log("Image has not yet been uploaded");
        }
        */

        const response = await fetch("/api/predictions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: e.target.prompt.value,
            image: uploadedImageURI,
          }),
        });
        let prediction = (await response.json()) as Prediction;
        if (response.status !== 201) {
          setError(prediction.detail);
          return;
        }
        setPrediction(prediction);
    
        while (
          prediction.status !== "succeeded" &&
          prediction.status !== "failed"
        ) {
          await sleep(1000);
          const response = await fetch("/api/predictions/" + prediction.id);
          prediction = await response.json();
          if (response.status !== 200) {
            setError(prediction.detail);
            return;
          }
          setPrediction(prediction);
          console.log("Setting prediction logs -> prediction = ");
          console.log(prediction);
            //setPredictionLogs(prediction.logs);
            // console.log(predictionLogs);
        }
    }

    const handleUploadImage = async (e: any) => {
      console.log("handleUploadImage()");
      const selectedFile = (document!.getElementById("input") as HTMLInputElement).files![0];

      const reader = new FileReader();
      reader.onload = async (evt) => {
        console.log(evt.target!.result);

        console.log("We are about to try and load the image...");

        try {
          const response = await fetch("api/predictions/uploadimage", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              imageBytes: evt.target!.result,
            })
          });
          console.log("Here is the response...");
          console.log(response);

          if (response.status === 200) {
            // This is hardcoded for now
            setUploadedImageURI("https://www.gstatic.com/webp/gallery3/1.sm.png");
          }
        } catch (e) {
          console.log("THERE WAS A PROBLEM");
          console.log(e);
        }
      };
      reader.readAsBinaryString(selectedFile);
    }

    return (
        <div>
          <Head>
            <title>Replicate + Next.js</title>
          </Head>
    
          <p>
            Dream something with{" "}
            <a href="https://replicate.com/stability-ai/stable-diffusion">SDXL</a>:
          </p>
    
          <form className={styles.form} onSubmit={handleSubmit}>
            <input type="text" name="prompt" placeholder="Enter a prompt to display an image" />
            <input type="file" id="input" placeholder="Enter an image file here" onChange={handleUploadImage}/>
            <button type="submit">Go!</button>
          </form>
    
          {error && <div>{error}</div>}
    
          {prediction && (
            <div>
                {prediction.output && (
                  <div className={styles.imageWrapper}>
                  <Image
                    fill
                    src={prediction.output[prediction.output.length - 1]}
                    alt="output"
                    sizes='100vw'
                  />
                  </div>
                )}
                <p>status: {prediction.status}</p>
            </div>
          )}
        </div>
      );
}