const debug = require("debug")("blogWatcher:ghWebHook");
const postHistory = require("../queries/postHistory");
const findPage = require("../queries/findPage");
const pushPageHistory = require("../queries/pushPageHistory");
const yup = require("yup");
const path = require("path");

const buildPages = async (req, res) => {
	// stop if theres no head_commit
	// sometimes hooks dont come with head_commits and thats just life 🤷
	if (req.body.head_commit) res.status(200).json({ success: true });
	else return res.status(400).json({ success: false });

	// stringify the commit for posting to history
	const commit = JSON.stringify(req.body.head_commit);

	// print some helpful information
	if (req.body.head_commit.modified) {
		debug(`received ${req.body.head_commit.modified.length} new changes`);
	}

	// start saving the head_commit to the database
	// debug("Posting new commit to history database");
	await postHistory(commit);

	// ! now lets search for existing pages with this name to see if it exists
	// first check the files that were modified using the head_commit modified [] array
	if (req.body.head_commit.modified) {
		debug("found some modified changes in commit hook");
		for (document of req.body.head_commit.modified) {
			const documentName = path.parse(document).name;
			debug(`the document name is ${documentName}`);
			debug(`updating ${documentName}`);

			// see if this pages exists in our existing "pages" db
			const page = await findPage("pageName", documentName);

			// if it exists then push this commit to its history
			if (page) {
				await pushPageHistory(page.pageName, commit);
			}
		}
	} else {
		debug("nothing more to do");
	}
};

module.exports = buildPages;

// ! an example of req.body.head_commit
// {
//   id: '1a47dc506b94bd9becd56cd35d4ce0a0e9f6acc7',
//   tree_id: '52940a7496d6f74b78310b73b9fe9975ec5b5325',
//   distinct: true,
//   message: ':pencil: ADD Content',
//   timestamp: '2020-08-05T22:01:40+10:00',
//   url: 'https://github.com/RolandWarburton/staticFolio/commit/1a47dc506b94bd9becd56cd35d4ce0a0e9f6acc7',
//   author: {
//     name: 'RolandWarburton',
//     email: 'warburtonroland@gmail.com',
//     username: 'RolandWarburton'
//   },
//   committer: {
//     name: 'RolandWarburton',
//     email: 'warburtonroland@gmail.com',
//     username: 'RolandWarburton'
//   },
//   added: [ 'src/views/Notes/University/TNE30023 Advanced Switching.js' ],
//   removed: [],
//   modified: []
// }
