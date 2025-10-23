import User from '../models/User.js';
import asyncHandler from 'express-async-handler'; 

export const getMyProfile = asyncHandler(async (req, res) => {
    const profile = await User.findById(req.user._id).select('-password');
    
    if (profile) {
        res.json(profile);
    } else {
        res.status(404);
        throw new Error('Profilo utente non trovato.');
    }
});

export const updateMyProfile = asyncHandler(async (req, res) => {
    
    const profile = await User.findById(req.user._id);

    if (profile) {
        
        if (req.body.email && req.body.email !== profile.email) {
             const userExists = await User.findOne({ email: req.body.email });
             
             if (userExists) {
                res.status(400); 
                throw new Error('Un altro utente con questa email è già registrato.');
             }
             profile.email = req.body.email;
        }
        
        profile.firstName = req.body.firstName || profile.firstName;
        profile.lastName = req.body.lastName || profile.lastName;

        if (req.body.password) {
            profile.password = req.body.password;
        }

        const updatedProfile = await profile.save();
        
        res.json({
            _id: updatedProfile._id,
            firstName: updatedProfile.firstName,
            lastName: updatedProfile.lastName,
            email: updatedProfile.email,
            isAdmin: updatedProfile.isAdmin,
            hasPurchased: updatedProfile.hasPurchased,
        });

    } else {
        res.status(404);
        throw new Error('Profilo utente non trovato.');
    }
});
