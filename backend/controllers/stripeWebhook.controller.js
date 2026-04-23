import stripe from "../config/stripe.js";
import User from "../models/user.model.js";


export const stripeWebhook=async (req,res) => {
    console.log("WEBHOOK HIT");
    const sig=req.headers["stripe-signature"]
    let event;
    try {
        event=stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
        )
    } catch (error) {
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    if(event.type=="checkout.session.completed"){
const session=event.data.object
const userId=session.metadata.userId
const credits=Number(session.metadata.credits)
const plan=session.metadata.plan

        console.log(`Attempting to update user: ${userId} with credits: ${credits}`);
        const updatedUser = await User.findByIdAndUpdate(userId, {
            $inc: { credits },
            plan
        }, { new: true })
        
        if (updatedUser) {
            console.log(`✅ Success! User ${updatedUser.email} now has ${updatedUser.credits} credits.`);
        } else {
            console.log(`❌ Failed: User with ID ${userId} not found in database.`);
        }
    }

    return res.json({received:true})


}