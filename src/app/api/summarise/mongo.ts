import mongoose from 'mongoose'

mongoose.connect(process.env.MONGODB_URI!)

const BlogSchema = new mongoose.Schema({
  text: String,
})

const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema)

export async function saveToMongo(text: string) {
  await Blog.create({ text })
}
