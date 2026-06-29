import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "PrepAI Backend Running 🚀"
    });
});

app.get("/profile", (req, res) => {
    res.json({
        "name": "Yashasvi",
        "email": "yashu@gmail.com"
    });
});

app.get("/api/test", (req, res) => {

    res.json({

        project: "PrepAI",

        developer: "Yashasvi Gupta",

        status: "Building Day 1"

    });

});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});