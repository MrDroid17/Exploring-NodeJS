const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');

const Blog = mongoose.model('Blog');

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {

    const redis = require('redis');
    const util = require('util');
    const redisUrl = "redis://127.0.0.1:6379";
    const client = redis.createClient(redisUrl);
    client.get = util.promisify(client.get)
    
    // do we have any data related to this query
    const cacheBlogs = await client.get(req.user.id);

    // if yes then repond to the query and get the data from cache and return
    if(cacheBlogs){
      console.log("SERVING FROM CACHE...")
      return res.send(JSON.parse(cacheBlogs));
    }

    // else query from mongoDB

    console.log("SERVING FROM MONGODB...")
    const blogs = await Blog.find({ _user: req.user.id });
    res.send(blogs);
    // save the data from mongoDB in cache
    client.set(req.user.id, JSON.stringify(blogs));
  });

  app.post('/api/blogs', requireLogin, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};
