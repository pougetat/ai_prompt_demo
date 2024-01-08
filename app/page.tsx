"use client"

import Head from "next/head";
import styles from "../styles/Home.module.css";
import TextPrompt from "@/components/TextPrompt";
import ImagePrompt from "@/components/ImagePrompt";

export default function Home() {

  return (
    <div className={styles.container}>
      <Head>
        <title>Replicate + Next.js</title>
      </Head>

      <p>
        Dream something with{" "}
        <a href="https://replicate.com/stability-ai/stable-diffusion">SDXL</a>:
      </p>

      <TextPrompt/>

      <ImagePrompt/>
    </div>
  );
}