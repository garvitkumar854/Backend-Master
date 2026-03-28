/**
 * AUTHENTICATION MIDDLEWARE (auth.middleware.js)
 * 
 * Middleware functions to protect routes and enforce role-based access control
 * Middleware runs before the controller function
 * 
 * JWT TOKEN VERIFICATION:
 * - Extracts token from cookies
 * - Verifies token signature and expiration
 * - Attaches user data to req.user for controller access
 * - Prevents unauthorized access to protected routes
 * 
 * CONCEPTS:
 * - Authentication: Verify WHO you are (valid user)
 * - Authorization: Verify WHAT you can do (user permissions)
 * - Role-Based Access Control: Different permissions for different user roles
 */

const jwt = require("jsonwebtoken");

/**
 * MIDDLEWARE: authArtist
 * PURPOSE: Protect endpoints that only ARTISTS can access
 * 
 * PROTECTED ACTIONS:
 * - Create/upload music
 * - Create album
 * - Modify own content
 * 
 * ACCESS:
 * - ✅ Allowed: Users with role="artist"
 * - ❌ Denied: Users with role="user"
 * - ❌ Denied: Non-authenticated users (no token)
 * 
 * WORKFLOW:
 * 1. Get token from cookies
 * 2. Verify token is valid
 * 3. Check if user's role is "artist"
 * 4. If valid: Attach user to req.user and call next()
 * 5. If invalid: Return error and stop execution
 */
async function authArtist(req, res, next) {
    // STEP 1: Extract token from cookies
    const token = req.cookies.token;

    // Check if token exists
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        /**
         * STEP 2: Verify token
         * - jwt.verify(token, secret)
         * - Checks token signature (hasn't been tampered with)
         * - Checks if token is expired
         * - Returns decoded payload if valid
         */
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        /**
         * STEP 3: Check authorization - Artist role required
         * decoded.role contains the user's role from JWT
         */
        if (decoded.role !== "artist") {
            // User is authenticated but doesn't have artist permissions
            return res.status(403).json({ message: "You don't have Required Access" });
        }

        /**
         * STEP 4: Attach user to request object
         * Controller functions can access via req.user
         * Contains: id, role (from JWT payload)
         */
        req.user = decoded;

        /**
         * STEP 5: Call next middleware/controller
         * If next() is called, execution continues to next function
         * If next() is not called, execution stops
         */
        next();
    } catch (err) {
        // Token is invalid or expired
        console.log(err);
        res.status(401).json({ message: "Unauthorized" });
    }
}

/**
 * MIDDLEWARE: authUser
 * PURPOSE: Protect endpoints that authenticated USERS can access
 * 
 * PROTECTED ACTIONS:
 * - View/listen to music
 * - View albums
 * - Access personalized content
 * 
 * ACCESS:
 * - ✅ Allowed: Users with role="user" or role="artist"
 * - ❌ Denied: Non-authenticated users (no token)
 * 
 * DIFFERENCE FROM authArtist:
 * - authArtist: Only artists
 * - authUser: Any authenticated user (both user and artist roles)
 * 
 * WORKFLOW:
 * 1. Get token from cookies
 * 2. Verify token is valid
 * 3. Check if user role is either "user" or "artist"
 * 4. If valid: Attach user to req.user and call next()
 * 5. If invalid: Return error
 */
async function authUser(req, res, next) {
    // Extract token from cookies
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        // Verify and decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        /**
         * AUTHORIZATION CHECK
         * Allow both "user" and "artist" roles
         * This allows artists to also access user content
         * Example: Artist can listen to other artists' music
         */
        if (decoded.role !== "user" && decoded.role !== "artist") {
            return res.status(403).json({ message: "Login First !" });
        }

        // Attach decoded user data to request
        req.user = decoded;
        
        // Proceed to next middleware/controller
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ message: "Unauthorized" });
    }
}

// Export middleware functions for use in routes
module.exports = { authArtist, authUser };
