const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");

const data = [
  {
    name: "First Camp",
    image:
      "https://images.unsplash.com/photo-1573577933177-8f184b962bf5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iure, vitae? Sint nostrum perspiciatis atque ea minus eaque rem sapiente fugit repellendus corrupti commodi consequuntur iusto in quaerat, voluptate at debitis mollitia aut. Blanditiis ut id quia dolores vitae obcaecati minima corrupti nesciunt. Similique odit eos atque facilis sint ducimus placeat."
  },
  {
    name: "Second Camp",
    image:
      "https://images.unsplash.com/photo-1573592234012-94a10ef47c6e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iure, vitae? Sint nostrum perspiciatis atque ea minus eaque rem sapiente fugit repellendus corrupti commodi consequuntur iusto in quaerat, voluptate at debitis mollitia aut. Blanditiis ut id quia dolores vitae obcaecati minima corrupti nesciunt. Similique odit eos atque facilis sint ducimus placeat."
  },
  {
    name: "Third Camp",
    image:
      "https://images.unsplash.com/photo-1573582094771-b34525b737d9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iure, vitae? Sint nostrum perspiciatis atque ea minus eaque rem sapiente fugit repellendus corrupti commodi consequuntur iusto in quaerat, voluptate at debitis mollitia aut. Blanditiis ut id quia dolores vitae obcaecati minima corrupti nesciunt. Similique odit eos atque facilis sint ducimus placeat."
  }
];

const seedDB = () => {
  // Remove all campgrounds.
  Campground.deleteMany({})
    .then(() => {
      console.log("Campgrounds are deleted");

      // Remove all comments.
      Comment.deleteMany({})
        .then(() => console.log("All comments are deleted"))
        .catch(err => console.log(err));

      // Add a few campgrounds.
      data.forEach(camp => {
        Campground.create(camp)
          .then(newCamp => {
            console.log("Campground created");
            // Create a comment.
            Comment.create({
              text: "This place is great, but I wish there was internet",
              author: "Homer"
            })
              .then(comment => {
                console.log("Comment added successfully");
                newCamp.comments.push(comment);
                newCamp
                  .save()
                  .then(() => {
                    console.log("Comment associated successfully");
                  })
                  .catch(err => console.log(err));
              })
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      });
    })
    .catch(err => console.log(err));
};

module.exports = seedDB;
