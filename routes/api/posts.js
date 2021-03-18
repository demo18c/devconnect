const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { route } = require('./profile');

//route POST api/posts
//desc  create a post
//access private
router.post('/', [auth, [check('text', 'Text is required').not().isEmpty()]], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const user = await User.findById(req.user.id).select('-password');

		const newPost = new Post({
			text: req.body.text,
			name: user.name,
			avatar: user.avatar,
			user: req.user.id
		});
		//add and receive post
		const post = await newPost.save();
		res.json(post);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('server error');
	}
});

//route get api/posts
//desc  get a post
//access private

router.get('/', auth, async (req, res) => {
	try {
		const posts = await Post.find().sort({ date: -1 });
		res.json(posts);
	} catch (error) {
		res.status(500).send('Server Error');
	}
});

//route get api/posts/:id
//desc  get a post by ID
//access private

router.get('/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ msg: 'Post Not Found' });
		}
		res.json(post);
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post Not Found' });
		}
		res.status(500).send('Server Error');
	}
});

//route delete api/posts
//desc  delete  a post
//access private

router.delete('/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ msg: 'Post not found' });
		}
		//check user
		if (post.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'User not authorized' });
		}
		await post.remove();
		res.json({ msg: 'Post removed' });
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post Not Found' });
		}
		res.status(500).send('Server Error');
	}
});

//route put api/posts/like/:id
//desc  like  a post
//access private

router.put('/like/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		//check if post already liked
		if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
			return res.json(400).json({ msg: 'Post already liked' });
		}
		post.likes.unshift({ user: req.user.id });
		await post.save();
		res.json(post.likes);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

//route POST api/posts/comment/:id
//desc  ccomment on post
//access private
router.post('/comment/:id', [auth, [check('text', 'Text is required').not().isEmpty()]], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const user = await User.findById(req.user.id).select('-password');
		const post = await Post.findById(req.params.id);

		const newComment = {
			text: req.body.text,
			name: user.name,
			avatar: user.avatar,
			user: req.user.id
		};
		//add and receive post
		post.comments.unshift(newComment);
		await post.save();
		res.json(post.comments);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('server error');
	}
});

//route POST api/posts/comment/:id/:comment_id
//desc  delete on comment
//access private

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		//pull out comment
		const comment = post.comments.find(comment => comment.id === req.params.comment_id);
		//make sure comment exist
		if (!comment) {
			return res.send(404).json({ msg: 'Comment does not exist' });
		}
		//check user
		if (comment.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'User not authorized' });
		}
		const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);

		post.comments.splice(removeIndex, 1);
		await post.save();

		res.json(post.comments);
	} catch (err) {
		console.error(err.message);
		res.send(500).send('Server Error');
	}
});

module.exports = router;
