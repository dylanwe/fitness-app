/**
 * All code to handle the actual signup / login authentication.
 */

import express, { Express, Request, Response } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { getUserByEmail, getUserById, createUser } from '../models/user';

/**
 * Verify the user login
 *
 * @param email the email of the user
 * @param password the password of the user
 * @param done what to call when it's complete
 */
const verify = async (email: string, password: string, done: any) => {
	try {
		const user: User = await getUserByEmail(email);

		if (!user) return done(null, false, { message: 'Incorrect email.' });

		if (!(await bcrypt.compare(password, user.password!))) {
			return done(null, false, { message: 'password incorrect' });
		}

		return done(null, user);
	} catch (error) {
		return done(error);
	}
};

/**
 * Configure passport to use local strategy
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, verify));

/**
 * Determine what data of the user should be stored in the session
 */
passport.serializeUser((user: any, callback: any) => {
	process.nextTick(() => {
		callback(null, user.id);
	});
});

/**
 * Get the user information from the database by the id stored in the session
 */
passport.deserializeUser((id: number, callback: any) => {
	process.nextTick(async () => {
		try {
			const user: User = await getUserById(id);

			return callback(null, user);
		} catch (error) {
			return callback(error);
		}
	});
});

/**
 * Middleware to protect pages so that only authenticated users can acces them
 */
const checkAuthenticated = (req: any, res: any, next: any) => {
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/login');
};

/**
 * Middleware to protect pages so that only non authenticated users can acces them
 */
const checkNotAuthenticated = (req: any, res: any, next: any) => {
	if (req.isAuthenticated()) {
		return res.redirect('/');
	}

	next();
};

const router = express.Router();

/**
 * Render the signup page
 */
router.get('/signup', checkNotAuthenticated, (req: Request, res: Response) => {
	res.render('signup');
});

/**
 * Create an account
 */
router.post('/signup', async (req: Request, res: Response) => {
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 10);

		await createUser(req.body.email, hashedPassword, req.body.username);

		res.redirect('/login');
	} catch (err) {
		console.log(err);
		res.redirect('/signup');
	}
});

/**
 * Render the login page
 */
router.get(
	'/login',
	checkNotAuthenticated,
	async (req: Request, res: Response) => {
		res.render('login');
	}
);

/**
 * log the user in via the passport configuration
 */
router.post(
	'/login',
	passport.authenticate('local', { failureRedirect: '/login' }),
	(req: Request, res: Response) => {
		res.redirect('/dashboard');
	}
);

/**
 * Logout the user in via the passport configuration
 */
router.delete('/logout', function (req: any, res: Response, next: any) {
	req.logout(function (err: Error) {
		if (err) {
			return next(err);
		}
		res.redirect('/');
	});
});

export { checkAuthenticated, checkNotAuthenticated };
export default router;
