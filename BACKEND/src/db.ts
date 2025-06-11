import mongoose, { model, Schema } from "mongoose"
const mongoURL = "mongodb://localhost:27017/BRAINLY"

mongoose.connect(mongoURL)

const UserSchema = new Schema({
    username: {type: String, unique: true},
    password: String
})

const ContentSchema = new Schema({
    type: {type: String, enum: ["document", "tweet", "youtube", "link"]},
    link: String,
    title: String,
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    userId: {type: mongoose.Types.ObjectId, ref: "User", required: true}
})

const LinkSchema = new Schema({
    hash: String,
    userId: {type: mongoose.Types.ObjectId, ref: "User", required: true, unique: true}
})

export const UserModel = model('User', UserSchema)
export const ContentModel = model("Content", ContentSchema)
export const LinkModel = model("Link", LinkSchema)