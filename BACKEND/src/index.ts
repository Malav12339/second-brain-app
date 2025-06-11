import express, { Request, Response } from "express"
import jwt from "jsonwebtoken"
import z from "zod"
import { ContentModel, LinkModel, UserModel } from "./db"
import bcrypt from "bcrypt"
import { JWT_PASSWORD } from "./config"
import { userMiddleware } from "./middleware"
import { random } from "./utils"
import mongoose from "mongoose"
import cors from "cors"

const app = express()
app.use(express.json())
app.use(cors())

const userSchema = z.object({
    username: z.string().min(3, "should be min 3 letters").max(10),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,20}$/, "Must contain atleast 1 lowercase, 1 UPPERCASE, 1 digit & 1 special character")
})
type userInput = z.infer<typeof userSchema>
type signinInput = z.infer<typeof userSchema>

app.post("/api/v1/signup", async (req: Request<{}, {}, userInput>, res: Response): Promise<void> => {
    const username = req.body.username 
    const password = req.body.password

    if(!username || !password) {
        res.status(411).json({
            msg: "username & password are required"
        })
        return;
    }

    const userValidation = userSchema.safeParse({username, password})

    if(!userValidation.success) {
        const errorMsg = userValidation.error?.errors[0].message
        res.status(411).json({
            msg: errorMsg
        })
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const userData = userValidation.data
    userData.password = hashedPassword

    try {
        await UserModel.create(userData)
        res.status(200).json({
            msg: "user created"
        })
    } catch(e: any) {
        if(e.code === 11000) {
            res.status(403).json({
                msg: "User already exists"
            })
            return;
        }
        res.status(500).json({
            msg: "Internal Server Error"
        })
        return;
    }
})

app.post("/api/v1/signin", async (req: Request<{}, {}, signinInput>, res: Response): Promise<void> => {
    const { username, password } = req.body
    if (!username || !password) {
        res.status(411).json({
            msg: "Username and password are required"
        });
        return;
    }

    try {
        const existingUser = await UserModel.findOne({ username })
        if (!existingUser || typeof existingUser.password !== "string") {
            res.status(403).json({ msg: "User does not exist" });
            return;
        }
        
        if(!existingUser) {
            res.status(403).json({msg: "user does not exist"})
            return;
        }        
        
        const isMatch = await bcrypt.compare(password, existingUser.password)
       
        if(isMatch) {
            const token = jwt.sign({id: existingUser._id}, JWT_PASSWORD)
            res.status(200).json({
                token
            })
            return;
        }
        
        res.status(403).json({
            msg: "Wrong password"
        })
    } catch(e) {
        console.error(e)
        res.status(500).send({
            msg: "Internal Server Error"
        })
    }
})

app.post("/api/v1/content", userMiddleware, async (req, res) => {
    const link = req.body.link 
    const type = req.body.type 
    const title = req.body.title
    
    try {
        await ContentModel.create({
            link,
            type, 
            title,
            userId: req.userId,
            tags: []

        })
        res.status(200).json({
            msg: "Content added"
        })
    } catch(e) {
        res.status(400).json({
            msg: "Problem adding content. Plz provide valid information"
        })
    }
})

app.get("/api/v1/content", userMiddleware, async (req, res) => {
    const userId = req.userId
    try {
        const content = await ContentModel.find({userId: userId}).populate("userId", "username")
        res.json({content})
    } catch(e) {
        res.status(500).json({
            msg: "Problem fetching content. try again later"
        })
    }
})

app.delete("/api/v1/content/:id", userMiddleware, async (req, res) => {
    const contentId = req.params.id 

    try {
        const deleted = await ContentModel.deleteOne({
            _id: contentId,
            userId: req.userId
        })
        if(deleted.deletedCount === 0) {
            res.status(404).json({
                msg: "Content not found or not authorized"
            })
        }
        res.json({
            msg: "deleted"
        })
    } catch(e) {
        res.status(500).json({
            msg: "Internal server Error"
        })
    }
})

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
    const share = req.body.share
    const randomHash = random(10)
    if(share) {
        const link = await LinkModel.findOne({userId: req.userId})
        if(link) {
            res.json({link: link.hash})
            return;
        } 
        await LinkModel.create({
            userId: req.userId,
            hash: randomHash
        })
        res.json({
            "link": randomHash
        })
        return;
    } else {
        await LinkModel.deleteOne({userId: req.userId})
        res.json({
            msg: "sharable link removed"
        })
    }

    
})

interface IUser extends Document {
    _id: mongoose.Types.ObjectId
    username: string,
    password: string
}

app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink
    
    const link = await LinkModel.findOne({hash: hash})
    
    if(!link) {
        res.status(411).json({
            msg: "Sorry Incorrect INput"
        })
        return;
    }

    const content = await ContentModel.find({
        userId: link.userId
    })

    const user = await UserModel.findOne({
        _id: link.userId
    })

    if(!user) {
        res.status(411).json({
            msg: "user not found, error should ideally not happen"
        })
        return;
    }
    res.json({
        username: user.username,
        content
    })
})

app.listen(5000, () => {
    console.log("RUNNING ON PORT 5000")
})