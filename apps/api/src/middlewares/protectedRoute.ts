import passport from "passport";

export const protectedRoute = passport.authenticate("jwt", { session: false });
