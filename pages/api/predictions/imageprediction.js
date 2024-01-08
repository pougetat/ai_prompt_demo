export default async function handler(req, res) {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            // Pinned to a specific version of Stable Diffusion
            // See https://replicate.com/stability-ai/sdxl
            version: "8a89b0ab59a050244a751b6475d91041a8582ba33692ae6fab65e0c51b700328",

            // This is the text prompt that will be submitted by a form on the frontend
            input: {
                "image": "https://replicate.delivery/pbxt/JbnAzlvH84NR20HgqUdfnLlMMwwiU8Fv5N3FSjcRXPH6kmmu/org_mid.jpg",
                "prompt": "A photo of a room, 4k photo, highly detailed",
                "scheduler": "K_EULER_ANCESTRAL",
                "num_samples": 1,
                "guidance_scale": 7.5,
                "negative_prompt": "anime, cartoon, graphic, text, painting, crayon, graphite, abstract, glitch, deformed, mutated, ugly, disfigured",
                "num_inference_steps": 30,
                "adapter_conditioning_scale": 1,
                "adapter_conditioning_factor": 1
                /*
                prompt: req.body.prompt,
                image: req.body.image,
                */
            },
        }),
    });

    if (response.status !== 201) {
        let error = await response.json();
        res.statusCode = 500;
        res.end(JSON.stringify({ detail: error.detail }));
        return;
    }

    const prediction = await response.json();
    res.statusCode = 201;
    res.end(JSON.stringify(prediction));
}