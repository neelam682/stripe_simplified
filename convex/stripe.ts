import { api } from "./_generated/api";
import { action } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import stripe from "../src/lib/stripe";
import ratelimit from "@/lib/ratelimit";


export const createCheckoutSession = action({
    args: { courseId: v.id("courses") },
    handler: async (
        ctx,
        args
    ): Promise<{ checkoutUrl: string | null }> => {
        console.log("▶️ createCheckoutSession called with args:", args);

        // --- AUTH ---
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            console.error("❌ No identity found — user not authenticated");
            throw new ConvexError("unauthenticated");
        }
        console.log("✅ Authenticated user identity:", identity);

        // --- USER ---
        const user = await ctx.runQuery(api.users.getUserByClerkId, {
            clerkId: identity.subject,
        });
        if (!user) {
            console.error("❌ Clerk user not found in DB for:", identity.subject);
            throw new ConvexError("User not found");
        }
        console.log("✅ Found user:", user);

        // --- RATE LIMIT ---
        const rateLimitKey = 'checkout-rate-limit :${user._id}';
        const { success } = await ratelimit.limit(rateLimitKey);
        if (!success) {
            throw new Error(`Rate limit exceeded. Please try again later.`);
        }



        // --- COURSE ---
        const course = await ctx.runQuery(api.courses.getCourseById, {
            courseId: args.courseId,
        });
        if (!course) {
            console.error("❌ Course not found for ID:", args.courseId);
            throw new ConvexError("Course not found");
        }
        console.log("✅ Found course:", course);

        // --- STRIPE ---
        try {
            const session = await stripe.checkout.sessions.create({
                customer: user.stripeCustomerId || undefined, // fallback
                payment_method_types: ["card"],
                mode: "payment",
                line_items: [
                    {
                        price_data: {
                            currency: "usd",
                            product_data: {
                                name: course.title,
                                images: [course.imageUrl || "https://placehold.co/600x400/png"],
                            },
                            unit_amount: Math.round(course.price * 100),
                        },
                        quantity: 1,
                    },
                ],
                success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${args.courseId}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${args.courseId}`,
                metadata: {
                    courseId: args.courseId,
                    userId: user._id,
                },
            });

            console.log("✅ Stripe session created:", session.id, session.url);
            return { checkoutUrl: session.url ?? null };
        } catch (err: any) {
            console.error("❌ Stripe error:", err);
            throw new ConvexError("Failed to create checkout session: " + err.message);
        }
    },
});

export const createProPlanCheckoutSession = action({
    args: { planId: v.union(v.literal("month"), v.literal("year")) },
    handler: async (ctx, args): Promise<{ checkoutUrl: string | null }> => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) {
            throw new ConvexError("Not authenticated")
        }

        const user = await ctx.runQuery(api.users.getUserByClerkId, { clerkId: identity.subject })

        if (!user) {
            throw new ConvexError("User not found")
        }

        const rateLimitKey = `pro-plan-rate-limit:${user._id}`

        const { success } = await ratelimit.limit(rateLimitKey)

        if (!success) {
            throw new Error("Rate limit exceeded.")
        }
        // month or year

        let priceId

        if (args.planId === "month") {
            priceId = process.env.STRIPE_MONTHLY_PRICE_ID
        } else if (args.planId === "year") {
            priceId = process.env.STRIPE_YEARLY_PRICE_ID
        }

        if (!priceId) {
            throw new ConvexError("Priceid not provided")
        }

        const session = await stripe.checkout.sessions.create({
            customer: user.stripeCustomerId,
            line_items: [{ price: priceId, quantity: 1 }],
            mode: "subscription",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/pro/success?session_id={CHECKOUT_SESSION_ID}&year=${args.planId === "year"}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pro`,

            metadata: { userId: user._id, planId: args.planId },
        })

        return { checkoutUrl: session.url }



    }



})
