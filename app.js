//SET-UP METHODS
const express        = require("express"),
    bodyParser       = require("body-parser"),
    ejs              = require("ejs"),
    expressSanitizer = require("express-sanitizer"),
    mongoose         = require("mongoose"),
    methodOverride   = require("method-override");

//APP CONFIGURATION
const app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

//MONGOOSE/MODEL CONFIGURATION
mongoose.connect('mongodb://localhost:27017/restful_blog_DB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    authorBy: String,
    created: {
        type: Date,
        default: Date.now
    }

});

//Blog is a mongoose model.
var Blog = mongoose.model("Blog", blogSchema);
// Blog.create({
//     title:"The World Is Changing",
//     image: "https://images.unsplash.com/photo-1482164565953-04b62dcac1cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80",
//     body:"This is my first blog post."
// });

//All ROUTES

app.get("/", function (req, res) {
    res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", function (req, res) {
    Blog.find({}, function (err, foundAllBlogs) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {
                blogs: foundAllBlogs
            });
        }
    });
});

//NEW ROUTE
app.get("/blogs/new", function (req, res) {
    res.render("new");
});



//CREATE ROUTE
app.post("/blogs", function (req, res) {
    var image = req.body.image;
    var title = req.body.title;
    var body = req.body.body;
    var author = req.body.author;
    var newBlog = {
        title: title,
        image: image,
        body: body,
        authorBy: author
    }
    req.body.body = req.sanitize(req.body.body)
    Blog.create(newBlog, function (err, newlyCreated) {
        if (err) {
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });

});


//SHOW ROUTE
app.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id, function (err, foundSpecificBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show", {
                blog: foundSpecificBlog
            });
        }

    });
    //To See how params work
    console.log(req.params);
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function (req, res) {
    Blog.findById(req.params.id, function (err, foundSpecificBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render('edit', {
                blog: foundSpecificBlog

            });
        }

    });
});

//UPDATE ROUTE
app.put("/blogs/:id", function (req, res) {
    var image = req.body.image;
    var title = req.body.title;
    var body = req.body.body;
    var author = req.body.author;
    var newBlog = {
        title: title,
        image: image,
        body: body,
        authorBy: author
    }
    req.body.body = req.sanitize(req.body.body)
    Blog.findByIdAndUpdate(req.params.id, newBlog, function (err, updatedSpecificBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});


//DESTROY ROUTE
app.delete("/blogs/:id", function (req, res) {
    //Destroy Blog
    Blog.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs")
        }
    });
});


//LISTEN TO SERVER 
app.listen(5000, function () {
    console.log("Server is running properly !");
});