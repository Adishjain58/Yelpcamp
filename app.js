const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

// Body parser middleware.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

// To retrieve the databse url.
const db = require("./config/keys").mongoURI;

// To setup a connection with the db.
mongoose
	.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("MongoDb Connected"))
	.catch(err => console.log(err));

app.get("/", (req, res) => {
	res.render("landing");
});

// Schema Setup
const campgroundSchema = mongoose.Schema({
	name: String,
	image: String,
	description: String,
});

const Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
// 	name: "Second Camp",
// 	image:
// 		"https://pixabay.com/get/57e8d3444855a914f6da8c7dda793f7f1636dfe2564c704c722c7ad29544c350_340.jpg",
// 	description:
// 		"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Unde saepe, magni sapiente, ipsum expedita harum illo eos commodi doloribus accusantium suscipit perspiciatis voluptates, deleniti iusto minus tenetur rerum sequi dicta officia veniam? Reprehenderit tempora dolorem quam, officia placeat magnam! Aspernatur autem quo necessitatibus quidem sed nostrum neque quisquam vitae. Voluptatibus molestiae quae consequatur eos et placeat eveniet, distinctio accusamus fugiat.",
// })
// 	.then(camp => console.log(camp))
// 	.catch(err => console.log(err));

// Index- show all campgrounds
app.get("/campgrounds", (req, res) => {
	// Get all campgrounds and render.
	Campground.find({})
		.then(campgrounds => res.render("index", { campgrounds }))
		.catch(err => console.log(err));
	// res.render("campgrounds", { campgrounds });
});

// Create- add new campground to databse
app.post("/campgrounds", (req, res) => {
	// Retrieving new camp data from form.
	let campName = req.body.name;
	let imageUrl = req.body.image;
	let newCamp = { name: campName, image: imageUrl };
	// Create a new campground and save in db.
	Campground.create(newCamp)
		.then(camp => {
			console.log(camp);
			res.redirect("/campgrounds");
		})
		.catch(err => console.log(err));
	// Redirecting to campgrounds page
});

// NEW - show form to create a campground.
app.get("/campgrounds/new", (req, res) => {
	res.render("new");
});

// SHOW -  To show details of a single campground.
app.get("/campgrounds/:id", (req, res) => {
	let campId = req.params.id;
	// Find the campground to show it's details.
	Campground.findById(campId)
		.then(camp => res.render("show"), { camp })
		.catch(err => console.log(err));
	// render the show template.
});

app.get("*", (req, res) => {
	res.send("<h1>This route does not exist</h1>");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`App started at port: ${port}`);
});
