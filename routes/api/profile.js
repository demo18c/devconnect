const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResults } = require('express-validator/check');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

//route GET api/profile/me
//desc test route
//access public
router.get('/me', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

		if (!profile) {
			return res.status(400).json({ msg: 'There is nor profile for this user' });
		}
		res.json(profile);
	} catch (err) {
		res.status(500).send('Server Error');
	}
});

//route POST api/profile
//create or update profile
// private

router.post(
	'/',
	[
		auth,
		[check('status', 'Status is required').not().isEmpty(), check('skills', 'Skills is required').not().isEmpty()]
	],
	async (req, res) => {
		const errors = validationResults(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const {
			company,
			website,
			location,

			status,
			skills,
			bio
		} = req.body;

		//build profile object
		const profileFields = {};
		profileFields.user = req.user.id;
		if (company) profileFields.company = company;
		if (website) profileFields.website = website;
		if (location) profileFields.location = location;
		if (status) profileFields.status = status;
		if (bio) profileFields.bio = bio;
		if (skills) {
			profileFields.skills = skills.split(',').map(skill => skill.trim());
		}

		//build social object
		//
		try {
			let profile = await Profile.findOne({ user: req.user.id });
			if (profile) {
				profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });
				return res.json(profile);
			}
			//create
			profile = new Profile(profileFields);
			await profile.save();
			res.json(profile);
		} catch (error) {
			console.log(skills);
			res.status(500).send('Server Error');
		}
	}
);

//a get api/profile
//get all profile
//public

router.get('/', async (req, res) => {
	try {
		const profiles = await Profile.find().populate('user', ['name', 'avatar']);
		res.json(profiles);
	} catch (error) {
		console.log(err.message);
	}
	res.status(500).send('Server Error');
});

//a get api/profile/user/:user_id
//get profile by id
//public

router.get('/user/:user_id', async (req, res) => {
	try {
		const profiles = await Profile.findOne({ user: re.params.user._id }).populate('user', ['name', 'avatar']);
		if (!profile) return res.status(400).json({ msg: 'Profile not found' });
		res.json(profiles);
	} catch (error) {
		console.log(err.message);
		if (err.kind == 'ObjectId') {
			return res.status(400).json({ msg: 'Profile not found' });
		}
		res.status(500).send('Server Error');
	}
});

//@route delete api/profile
//@desciption       delete profile, user ,post
//@access           private

router.delete('/', auth, async (req, res) => {
	try {
		//remove post

		//remove profile
		await Profile.findOneAndRemove({ user: req.user.id });
		//remove user
		await User.findOneAndRemove({ _id: req.user.id });

		res.json('User dealt with!!1');
	} catch (error) {
		console.log(err.message);
	}
	res.status(500).send('Server Error');
});

module.exports = router;
