import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/Users';
import bcrypt from 'bcrypt';
import { setTokenCookie } from '../../../utils/auth';


export default async function handler(req: any, res: any) {
    await dbConnect();
    
    if (req.method === 'POST') {
        const { email, password, name } = req.body;

        try {
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({ message: 'Username already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ email, password: hashedPassword, name });
            await user.save();

            // TODO Generate a session token and set it as a cookie
            const token = 'your_generated_token'; // Replace with your actual token
            setTokenCookie(res, token);

            return res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}
