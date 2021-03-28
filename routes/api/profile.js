const express = require('express');
const axios = require('axios');
const router = express.Router();
const auth = require('../../middleware/auth');
const checkObjectId = require('../../middleware/checkObjectId');

const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');

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
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

//route POST api/profile
//create or update profile
// private

// router.post(
// 	'/',
// 	auth,
// 	check('status', 'Status is required').notEmpty(),
// 	check('skills', 'Skills is required').notEmpty(),

// 	async (req, res) => {
// 		const errors = validationResult(req);
// 		if (!errors.isEmpty()) {
// 			return res.status(400).json({ errors: errors.array() });
// 		}
// destructure the request

// const {
// 	company,
// 	website,
// 	location,

// 	status,
// 	skills,
// 	bio,
// 	...rest
// } = req.body;

//build profile object
// const profileFields = {
// 	user: req.user.id,
// 	website: website && website !== '' ? normalize(website, { forceHttps: true }) : '',
// 	skills: Array.isArray(skills) ? skills : skills.split(',').map(skill => ' ' + skill.trim()),
// 	...rest
// };
// profileFields.user = req.user.id;
// if (company) profileFields.company = company;
// if (website) profileFields.website = website;
// if (location) profileFields.location = location;
// if (status) profileFields.status = status;
// if (bio) profileFields.bio = bio;
// if (skills) {
// 	profileFields.skills = skills.split(',').map(skill => skill.trim());
//}

//build social object
//
// try {
// 	let profile = await Profile.findOne({ user: req.user.id });
// 	if (profile) {
// 		profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });
// 		return res.json(profile);
// 	}
//create
// 			profile = new Profile(profileFields);
// 			await profile.save();
// 			res.json(profile);
// 		} catch (error) {
// 			console.log(skills);
// 			res.status(500).send('Server Error');
// 		}
// 	}
// );

router.post(
	'/',
	auth,
	check('status', 'Status is required').notEmpty(),
	check('skills', 'Skills is required').notEmpty(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		// destructure the request
		const {
			website,
			skills,
			// youtube,
			// twitter,
			// instagram,
			// linkedin,
			// facebook,
			// spread the rest of the fields we don't need to check
			...rest
		} = req.body;

		// build a profile
		const profileFields = {
			user: req.user.id,
			website: website && website !== '' ? normalize(website, { forceHttps: true }) : '',
			skills: Array.isArray(skills) ? skills : skills.split(',').map(skill => ' ' + skill.trim()),
			...rest
		};

		// Build socialFields object
		// const socialFields = { youtube, twitter, instagram, linkedin, facebook };

		// normalize social fields to ensure valid url
		// for (const [key, value] of Object.entries(socialFields)) {
		// 	if (value && value.length > 0) socialFields[key] = normalize(value, { forceHttps: true });
		// }
		// add to profileFields
		// profileFields.social = socialFields;

		try {
			// Using upsert option (creates new doc if no match is found):
			let profile = await Profile.findOneAndUpdate(
				{ user: req.user.id },
				{ $set: profileFields },
				{ new: true, upsert: true, setDefaultsOnInsert: true }
			);
			return res.json(profile);
		} catch (err) {
			console.error(err.message);
			return res.status(500).send('Server Error');
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

// router.get('/user/:user_id', async (req, res) => {
// 	try {
// 		const profiles = await Profile.findOne({ user: req.params.user._id }).populate('user', ['name', 'avatar']);
// 		if (!profile) return res.status(400).json({ msg: 'Profile not found' });
// 		res.json(profiles);
// 	} catch (error) {
// 		console.log(err.message);
// 		if (err.kind == 'ObjectId') {
// 			return res.status(400).json({ msg: 'Profile not found' });
// 		}
// 		res.status(500).send('Server Error');
// 	}
// });

router.get('/user/:user_id', checkObjectId('user_id'), async ({ params: { user_id } }, res) => {
	try {
		const profile = await Profile.findOne({
			user: user_id
		}).populate('user', ['name', 'avatar']);

		if (!profile) return res.status(400).json({ msg: 'Profile not found' });

		return res.json(profile);
	} catch (err) {
		console.error(err.message);
		return res.status(500).json({ msg: 'Server error' });
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
