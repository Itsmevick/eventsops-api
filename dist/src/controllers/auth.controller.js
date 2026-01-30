import { z } from "zod";
import { registerUser, loginUser, getMe } from "../services/auth.service";
import { signAccessToken } from "../utils/jwt";
const registerSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
});
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});
export async function register(req, res) {
    try {
        const body = registerSchema.parse(req.body);
        const user = await registerUser(body);
        return res.status(201).json(user);
    }
    catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ error: "Validation failed", issues: err.issues });
        }
        if (err?.statusCode === 409) {
            return res.status(409).json({ error: "Email already exists" });
        }
        console.error("[AUTH] register error", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
export async function login(req, res) {
    try {
        const body = loginSchema.parse(req.body);
        const { user } = await loginUser(body);
        const accessToken = signAccessToken({ sub: user.id, role: user.role });
        console.info("[AUTH] Access token created", { userId: user.id, tokenPreview: accessToken.substring(0, 20) + "..." });
        const cookieName = process.env.COOKIE_NAME || "eventops_rt";
        const isProduction = process.env.NODE_ENV === "production";
        // Placeholder refresh token (can be a signed JWT later)
        const refreshToken = "placeholder_refresh_token";
        res.cookie(cookieName, refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        return res.json({
            accessToken,
            user,
        });
    }
    catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ error: "Validation failed", issues: err.issues });
        }
        if (err?.statusCode === 401) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        console.error("[AUTH] login error", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
export async function me(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user = await getMe(req.user.id);
        return res.json(user);
    }
    catch (err) {
        if (err?.statusCode === 404) {
            return res.status(404).json({ error: "User not found" });
        }
        console.error("[AUTH] me error", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
export async function logout(req, res) {
    const cookieName = process.env.COOKIE_NAME || "eventops_rt";
    res.clearCookie(cookieName);
    return res.json({ ok: true });
}
//# sourceMappingURL=auth.controller.js.map