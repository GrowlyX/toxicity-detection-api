import {startToxicityServer} from "./server";

startToxicityServer().then(r => {
    console.log("Toxicity server started correctly")
})
