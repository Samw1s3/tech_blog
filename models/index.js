const User  = require('./user');
const Post = require('./Post');

Post.belongsTo(User, {
    foreignKey: 'user_id',
});

User.hasMany(Post, {
    foreignKey: 'user_id',
})

module.exports = {
    User,
    Post
};