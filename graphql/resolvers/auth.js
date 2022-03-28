const bcrypt = require('bcryptjs');
const User = require('../../database/models/user');
const jwt = require('jsonwebtoken');

module.exports = {

    //CREATE USER
    createUser: async args => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email })

            //Checks if email is already in use
            if (existingUser) {
                throw new Error('Email is already in use.')
            }

            const hashedPassword = await bcrypt.hash(args.userInput.password, 12) //Hash password with 12 salt rounds is considered safe
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            const result = await user.save();
            return {
                ...result._doc,
                password: null,
                _id: result.id
            }; //password set to null, to not return it to developer. Even though it's hashed
        } catch (err) {
            console.log(err);
            throw err;
        };
    },
    login: async ({ email, password }) => {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error('User does not exist!');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Password or email is not correct!')
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            'supersecrethashkey',
            { expiresIn: '1h' }
        );
        return { userId: user.id, token: token, tokenExpiration: 1 }
    }
};