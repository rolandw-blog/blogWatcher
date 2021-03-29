const updatePage = require("./common/updatePage.js");
const mongoose = require('mongoose');
require("dotenv").config();

const pageRouter = async (req, res) => {
    const fieldName = req.params.field;

    // check that an _id was included in req.body.filter._id
    const err = "_id field must be included in update request. Place string _id in body.filter._id"
    if (!req.body.filter._id) return res.status(400).json({ message: err });

    // cast the _id
    req.body.filter._id = mongoose.Types.ObjectId(req.body.filter._id);

    switch (fieldName) {
        case "websitePath": {
            let err = ""

            if (!Array.isArray(req.body.update.websitePath)) {
                err = "update.websitePath not provided correctly. { update.websitePath } must exist, and it must be an array";
            }

            if (err !== "") {
                return res.status(400).json({message: err})
            }

            updatePage(req, res);
            break;
        }
        
        case "source": {
            let err = ""

            if (!Array.isArray(req.body.update.source)) {
                err = "update.source not provided correctly. { update.source } must exist, and it must be an array";
            }

            if (err !== "") {
                return res.status(400).json({message: err})
            }

            updatePage(req, res);
            break;
        }

        case "pageName": {
            let err = ""

            if (!req.body.update.pageName) {
                err = "update.pageName not provided correctly. { update.source } must exist in update";
            }

            if (err !== "") {
                return res.status(400).json({message: err})
            }

            updatePage(req, res);
            break;
        }
            
        case "hidden": {
            let err = ""

            if (!req.body.update.hidden) {
                err = "update.hidden not provided correctly. { update.hidden } must exist in update";
            }

            if (err !== "") {
                return res.status(400).json({message: err})
            }

            updatePage(req, res);
            break;
        }
            
        case "template": {
            let err = ""

            if (!req.body.update.meta.template) {
                err = "update.meta.template not provided correctly. { update.meta.template } must exist in update";
            }

            if (err !== "") {
                return res.status(400).json({message: err})
            }

            updatePage(req, res);
            break;
        }
    
        default:
            return res.status(400).json({message: "Failed to update because the field isnt in the page model."})
            break;
    }
};

module.exports = pageRouter;

//    "update": {"websitePath": ["a", "b"]}