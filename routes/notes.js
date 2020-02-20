var express 	        = require("express"),
    router 		        = express.Router(),
    Note                = require("../models/note"),
    User                = require("../models/user"),
    middleware          = require("../middleware");

// INDEX ROUTE    
router.get("/", middleware.isLoggedIn, (req, res) => {
    Note.find({}, (err, allNote) => {
        if (err) {
          console.log(err);
        } else {
            res.render("notes/index", {notes: allNote});
        }
    });
});
// NEW NOTE ROUTE
router.get("/new", middleware.isLoggedIn, (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            res.render("notes/new", {user: user});
        }
    });
});

// CREATE A NEW NOTE ROUTE 
router.post("/", middleware.isLoggedIn, (req, res) => {
    req.body.title = req.sanitize(req.body.title);
    req.body.content = req.sanitize(req.body.content);
    var title = req.body.title;
    var content = req.body.content;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var created = req.body.created;
    var newNote = {title: title, content: content, author: author, created: created};
    Note.create(newNote, (err, newNote) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/" + req.user +"/notes");
        }
    });
});

// SHOW ROUTE
router.get("/:note_id", (req, res) => {
    if(req.isAuthenticated()){
        Note.findById(req.params.note_id, (err, foundNote) => {
            if (err || !foundNote) {
                req.flash("error", "Note not found");
                res.redirect("back");
            } else {
                if (foundNote.author.id.equals(req.user._id)) {
                    res.render("notes/show", {note: foundNote});
                } else {
                    req.flash("error", "You don't have permision to do that!");
                    res.redirect("/login");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/");
    }
});

// EDIT ROUTE
router.get("/:note_id/edit", middleware.isLoggedIn, (req, res) => {
    Note.findById(req.params.note_id, (err, foundNote) => {
        if (err || !foundNote) {
            req.flash("error", "Note not found");
            res.redirect("back");
        } else {
            if (foundNote.author.id.equals(req.user._id)) {
                res.render("notes/edit", {note: foundNote});
            } else {
                req.flash("error", "You don't have permision to do that!");
                res.redirect("/");
            }
        }
    });
});

// UPDATE ROUTE
router.put("/:note_id", (req, res) => {
    req.body.title = req.sanitize(req.body.title);
    req.body.content = req.sanitize(req.body.content);
    Note.findByIdAndUpdate(req.params.note_id, req.body.note, (err, updatedNote) => {
        if (err || !updatedNote) {
            req.flash("error", "Error: Note not found");
            res.redirect("back");
        } else {
            if (updatedNote.author.id.equals(req.user._id)) {
                req.flash("success", "Note successfully updated");
                res.redirect("/" + req.user + "/notes/" + req.params.note_id);
            } else {
                req.flash("error", "You don't have permision to do that!");
                res.redirect("/");
            }
        }
    });
});

// DELETE ROUTE
router.delete("/:note_id", (req, res) => {
    Note.findByIdAndRemove(req.params.note_id, (err, deletedNote) => {
        if (err || !deletedNote) {
            req.flash("error", "Error: Note not found");
            res.redirect("back");
        } else {
            if (deletedNote.author.id.equals(req.user._id)) {
                req.flash("success", "Note succesfully deleted");
                res.redirect("/" + req.user + "/notes");
            } else {
                req.flash("error", "You don't have permision to do that!");
                res.redirect("/");
            }
        }
    });
});

module.exports = router;