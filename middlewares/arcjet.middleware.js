import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
    try {
        // Add timeout configuration
        const timeoutMs = 5000; // 5 seconds timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const decision = await aj.protect(req, {
            requested: 2, // Consume 2 tokens per request
            signal: controller.signal,
            timeout: timeoutMs
        });

        clearTimeout(timeoutId);

        if (decision.isDenied()) {
            if(decision.reason.isRateLimit()) {
                console.log('Rate limit exceeded:', req.path);
                return res.status(429).json({
                    error: "Rate limit exceeded",
                    message: "Too many requests, please try again later"
                });
            }
            if(decision.reason.isBot()) {
                console.log('Bot detected:', req.ip);
                return res.status(403).json({
                    error: "Bot detected",
                    message: "Bot traffic is not allowed"
                });
            }
            
            console.log('Request denied:', decision.reason);
            return res.status(403).json({error: "Denied"});
        }
        next();
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error(`Arcjet timeout after ${timeoutMs}ms`);
            // Allow the request to proceed if Arcjet times out
            return next();
        }
        console.error(`Arcjet error: ${error}`);
        // In case of other errors, still allow the request but log the error
        next();
    }
};

export default arcjetMiddleware;
