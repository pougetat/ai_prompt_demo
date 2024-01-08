import { useState } from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import ScrollToBottom from "react-scroll-to-bottom";
import { css } from "@emotion/css";

const SCROLL_CSS = css({
    height: 600,
    width: 400,
    overflowY: "auto",
  })

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type Prediction = {
    completed_at?: string,
    created_at: string,
    error: string | null,
    id: string,
    input: {
      prompt: string
    },
    logs: string,
    model: string,
    output?: string[],
    started_at: string,
    status: string,
    urls: {
      cancel: string,
      get: string,
    }
    version: string,
    detail: string | null,
}

export default function TextPrompt() {
    const [prediction, setPrediction] = useState<Prediction | null>(null);
    const [predictionLogs, setPredictionLogs] = useState<string>();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const response = await fetch("/api/predictions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: e.target.prompt.value,
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
          setPredictionLogs(prediction.logs);
        }
      };
    

    return (
        <>
        <form className={styles.form} onSubmit={handleSubmit}>
            <input type="text" name="prompt" placeholder="Enter a prompt to display an image" />
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

        <ScrollToBottom className={SCROLL_CSS}>
            <p>
            {predictionLogs}
            </p>
        </ScrollToBottom>
        
        
        
        </>
    )
}