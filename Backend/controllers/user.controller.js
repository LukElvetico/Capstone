import User from '../models/User.js';

/**
 * @desc Ottiene i dettagli del profilo dell'utente loggato
 * @route GET /api/users/me
 * @access Privata (richiede 'protect')
 */
export const getMyProfile = async (req, res) => {
    const user = req.user; 
    
    try {
        const profile = await User.findById(user._id).select('-password');
        
        if (!profile) {
            return res.status(404).json({ message: 'Profilo utente non trovato.' });
        }

        res.status(200).json(profile);

    } catch (error) {
        res.status(500).json({ message: 'Errore nel recupero del profilo.', error: error.message });
    }
};

/**
 * @desc Aggiorna i dettagli del profilo dell'utente loggato (nome, email, password)
 * @route PUT /api/users/me
 * @access Privata (richiede 'protect')
 */
export const updateMyProfile = async (req, res) => {
    const user = req.user; 
    
    try {
        const profile = await User.findById(user._id);

        if (!profile) {
            return res.status(404).json({ message: 'Profilo utente non trovato.' });
        }

        profile.firstName = req.body.firstName || profile.firstName;
        profile.lastName = req.body.lastName || profile.lastName;
        profile.email = req.body.email || profile.email;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10); 
            profile.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedProfile = await profile.save();

        res.status(200).json({
            _id: updatedProfile._id,
            firstName: updatedProfile.firstName,
            lastName: updatedProfile.lastName,
            email: updatedProfile.email,
            isAdmin: updatedProfile.isAdmin,
            hasPurchased: updatedProfile.hasPurchased,
        });

    } catch (error) {
        res.status(400).json({ message: 'Errore nell\'aggiornamento del profilo.', error: error.message });
    }
};