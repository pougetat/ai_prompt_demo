import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb'
        }
    }
}

const firebaseConfig = {
    apiKey: process.env.FIRE_BASE_API_TOKEN,
    authDomain: "ai-prompt-demo.firebaseapp.com",
    projectId: "ai-prompt-demo",
    storageBucket: "ai-prompt-demo.appspot.com",
    messagingSenderId: "930408994269",
    appId: "1:930408994269:web:1465a281669a4af0285234",
    measurementId: "G-ZC94FV189N"
};
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

export default async function handler(req, res) {
    console.log("handler()");

    const storageRef = ref(storage, 'some-image');

    const result = await uploadBytes(storageRef, req.body.imageBytes);
    console.log("Uploaded image to firebase storage...");
    console.log(result);
    console.log(result.metadata.size);

    if (result.metadata.size === 0) {
        let error = await response.json();
        res.statusCode = 500;
        res.end(JSON.stringify({ detail: error.detail }));
        return;
    }
    res.statusCode = 200;
    res.end(JSON.stringify({}));
}