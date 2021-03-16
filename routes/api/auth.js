const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const brcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

//route GET api/auth
//desc test route
//access public
//adding auth from middlware makes protected
//return user data
// router.get('/', auth, async (req, res) => {
// 	try {
// 		const user = await User.findById(req.user.id).select('-password');
// 		res.json(user);
// 	} catch (err) {
// 		res.status(500).send('Server Error');
// 	}
// });

//route POST api/auth
//desc authenticate user
//access public
router.post(
	'/',
	[
		// check('name', 'Name is required').not().isEmpty(),
		check('email', 'Please include email').isEmail(),
		check('password', 'Password is required').exists()
	],

	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { email, password } = req.body;

		try {
			//see if user exists
			//request database for email

			let user = await User.findOne({ email: email });
			if (!user) {
				res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
			}

			const isMatch = await brcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
			}

			//return jwtoken
			const payload = {
				user: {
					id: user.id
				}
			};

			jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
				if (err) throw err;
				res.json({ token });
			});
		} catch (err) {
			res.status(500).send('Server Error');
		}
	}
);

module.exports = router;
