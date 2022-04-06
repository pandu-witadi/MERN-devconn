//
//
const request = require('request')
const { check, validationResult } = require('express-validator')
const Profile = require('../models/Profile')
const User = require('../models/User')


const currentProfile = async (req, res) => {
    try {
        let profile = await Profile.findOne({ user: req.userId })
            .populate( 'user', ['name', 'avatar'] )

        if (!profile)
            return res.status(400).json({ msg: 'There is no profile for this user' })

        return res.json(profile)
    } catch(err) {
        return res.status(500).json({ errors: err })
    }
}


const allProfiles = async (req, res) => {
    try {
        let profiles = await Profile.find()
            .populate( 'user', ['name', 'avatar'] )

        return res.json(profiles)
    } catch(err) {
        return res.status(500).json({ errors: err })
    }
}


const profileById = async (req, res) => {
    try {
        let profile = await Profile.findOne({ user: req.params.user_id })
            .populate( 'user', ['name', 'avatar'] )

        return res.json(profile)
    } catch(err) {
        return res.status(500).json({ msg: 'Profile not found' })
    }
}


const createOrUpdate = async (req, res) => {
    await check('status', 'Status is required').notEmpty().run(req)
    await check('skills', 'Skills is required').notEmpty().run(req)
    const errors = validationResult(req)
    if ( !errors.isEmpty() )
        return res.status(400).json({ errors: errors.array() })

    let {
          company,
          website,
          location,
          bio,
          status,
          githubusername,
          skills,
          youtube,
          facebook,
          twitter,
          instagram,
          linkedin
        } = req.body
    if (!(status && skills))
            return res.json({ errors: 'incomplete parameters'})

    if ((status === '' || skills === ''))
            return res.json({ errors: 'incomplete parameters'})

    // Build profile object
    const profileFields = {}
    profileFields.user = req.userId
    if (company) profileFields.company = company
    if (website) profileFields.website = website
    if (location) profileFields.location = location
    if (bio) profileFields.bio = bio
    if (status) profileFields.status = status
    if (githubusername) profileFields.githubusername = githubusername
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim())
    }

    // Build social object
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube
    if (twitter) profileFields.social.twitter = twitter
    if (facebook) profileFields.social.facebook = facebook
    if (linkedin) profileFields.social.linkedin = linkedin
    if (instagram) profileFields.social.instagram = instagram


    try {
        // Using upsert option (creates new doc if no match is found):
        let profile = await Profile.findOneAndUpdate(
            { user: req.userId },
            { $set: profileFields },
            { new: true, upsert: true }
        )
        return res.json(profile)
    } catch(err) {
        return res.status(400).json({ errors: [{ msg: 'server error' }] })
    }
}

const addExperience = async (req, res) => {
    await check('title', 'title is required').notEmpty().run(req)
    await check('company', 'company is required').notEmpty().run(req)
    await check('from', 'From date is required').notEmpty().run(req)

    const errors = validationResult(req)
    if ( !errors.isEmpty() )
        return res.status(400).json({ errors: errors.array() })

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({ user: req.userId })
        profile.experience.unshift(newExp)

        await profile.save()
        return res.json(profile)
    } catch (err) {
        return res.status(400).json({ errors: [{ msg: 'server error' }] })
    }
}

const addEducation = async (req, res) => {
    await check('school', 'school ititles required').notEmpty().run(req)
    await check('fieldofstudy', 'Field of study is required').notEmpty().run(req)
    await check('from', 'From date is required').notEmpty().run(req)

    const errors = validationResult(req)
    if ( !errors.isEmpty() )
        return res.status(400).json({ errors: errors.array() })

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({ user: req.userId })
        profile.education.unshift(newEdu)

        await profile.save()
        return res.json(profile)
    } catch (err) {
        return res.status(400).json({ errors: [{ msg: 'server error' }] })
    }
}

const deleteExperience = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.userId })

        // Filter exprience array using _id (NOTE: _id is a BSON type needs to be converted to string)
        // This can also be omitted and the next line and findOneAndUpdate to be used instead (above implementation)
        profile.experience = profile.experience.filter(exp => exp._id.toString() !== req.params.exp_id)

        await profile.save()
        return res.status(200).json(profile)
    } catch (err) {
        return res.status(400).json({ errors: [{ msg: 'server error' }] })
    }
}

const deleteEducation = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.userId })

        const eduIds = profile.education.map(edu => edu._id.toString());
        // if i dont add .toString() it returns this weird mongoose coreArray and the ids are somehow objects and it still deletes anyway even if you put /education/5
        const removeIndex = eduIds.indexOf(req.params.edu_id);
        if (removeIndex === -1) {
            return res.status(500).json({ errors: [{ msg: 'server error' }] })
        } else {
            // theses console logs helped me figure it out
            // console.log("eduIds", eduIds);
            // console.log("typeof eduIds", typeof eduIds);
            // console.log("req.params", req.params);
            // console.log("removed", eduIds.indexOf(req.params.edu_id));

            profile.education.splice( removeIndex, 1)
            await profile.save()
            return res.status(200).json(profile)
        }
    } catch (err) {
        return res.status(400).json({ errors: [{ msg: 'server error' }] })
    }
}

const deleteAccount = async (req, res) => {
    try {
        // 1 - Remove posts

        // 2 - Remove profile
        await Profile.findOneAndRemove({ user: req.userId });

        // 3- Remove user
        await User.findOneAndRemove({ _id: req.userId });

        return res.json({ msg: 'User deleted' })
    } catch (err) {
        return res.status(400).json({ errors: [{ msg: 'server error' }] })
    }
}

const getGithubRepos = async (req, res) => {
    try {
        const options = {
            uri: encodeURI(`https://api.github.com/users/${
                req.params.username
            }/repos?per_page=5&sort=created:asc&client_id=${config.get(
                'githubClientId'
            )}&client_secret=${config.get('githubSecret')}`),
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        }

        request(options, (error, response, body) => {
            if (error) console.error(error);

            if (response.statusCode !== 200)
                return res.status(404).json({ msg: 'No Github profile found' });


            return res.json(JSON.parse(body));
        })
    } catch (err) {
        return res.status(400).json({ errors: [{ msg: 'server error' }] })
    }
}


module.exports = {
    currentProfile,
    createOrUpdate,
    addExperience,
    addEducation,
    deleteExperience,
    deleteEducation,
    deleteAccount,
    allProfiles,
    profileById,
    getGithubRepos
}
