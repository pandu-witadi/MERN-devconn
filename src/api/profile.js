//
//
const { check, validationResult } = require('express-validator')
const Profile = require('../models/Profile')


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


module.exports = {
    currentProfile,
    createOrUpdate
}
