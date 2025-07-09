import User from "../models/user.model.js";
import { hash, compare } from "../utils/hash.js";
import { sign, verify } from "../utils/jwt.js";

// Registering a new user
export async function createUser(req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await User.create({
            email,
            password: await hash(password),
        });
        res.status(201).json({ token: sign({ id: user._id }, "7d") });
    } catch (e) { next(e); }
}

// Login existing user
export async function connectUser(req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");
        if (!user || !(await compare(password, user.password)))
            return res.status(400).json({ msg: "Invalid credentials" });
        res.json({ token: sign({ id: user._id }, "7d") });
    } catch (e) { next(e); }
}

// Forgot password
export async function requestReset(req, res, next) {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ msg: 'No User found' });

        const token = sign({ id: user._id }, "15m");
        const resetUser = `${process.env.CLIENT_URL}/reset-password/${token}`;

        // Placeholder for email
        console.log('Reset user:', resetUser);
        res.json({ msg: 'Reset link sent to your email' });
    } catch (e) { next(e); }
}

// Reset password
export async function confirmReset(req, res, next) {
    try {
        const { password } = req.body;
        const decoded = verify(req.params.token);
        const user = await User.findById(decoded.id).select('+password');
        if (!user)
            return res.status(400).json({ msg: 'Invalid reset token' });

        const isSame = await compare(password, user.password);
        if (isSame)
            return res.status(400).json({ msg: 'Password must be different' });

        user.password = await hash(password);
        await user.save();

        res.json({ msg: 'Password successfully updated' });
    } catch (err) {
        if (err.name === 'JsonWebTokenError')
            return res.status(400).json({ msg: 'Reset link expired' });
        next(err);
    }
}