require('dotenv').config();
const {faker} = require('@faker-js/faker');
const sequelize = require('../config/connection');
const Post = require('../models/Post');
const User = require('../models/user');
const Comment = require('../models/Comment');



async function seedUsers(num = 10) {

    for (let index = 0; index < num; index++) {
        const user_name = faker.internet.user_name();
        const email = faker.internet.email();
        const password = "password";

        await User.create({
            user_name,
            email,
            password,
        })
        
    }
}

async function seedPost(num = 10){

    for (let index = 0; index < num; index++) {
        const title = faker.lorem.words(3);
        const content = faker.lorem.paragraph(2);

        const randomUser = await User.findAll({ order: sequelize.literal("rand()"), limit: 1});
        
        const user_id = randomUser[0].id;
        console.log({user_id});
        await Post.create({
            title,
            content,
            user_id,
        });
    }
}

async function seedComment(num = 10){

    for (let index = 0; index < num; index++) {
        const body = faker.lorem.paragraph(2);

        const randomUser = await User.findAll({ order: sequelize.literal("rand()"), limit: 1});

        const randomPost = await Post.findAll({ order: sequelize.literal("rand()"), limit: 1});
        
        const user_id = randomUser[0].id;
        const post_id = randomPost[0].id;
        console.log({user_id});
        await Comment.create({
            body,
            user_id,
            post_id,
        });
    }
}
async function seed() {
    // seed user
    sequelize.sync({force:true}).then(async () => {
        
        await seedUsers(10);
        //seed post
        await seedPost(10);
        //seed comments

        await seedComment(5);
    })
}

seed();