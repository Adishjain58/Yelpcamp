const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
	res.send("<h1>Welcome to Homepage</h1>");
});

app.get("*", (req, res) => {
	res.send("<h1>This route does not exist</h1>");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`App started at port: ${port}`);
});
