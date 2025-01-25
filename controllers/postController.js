import prisma from "../prisma/prismaClient.js";

export async function getPosts(req, res) {
    try {
        const posts = await prisma.post.findMany({
            where: { published: true },
            include: { author: { select: { username: true } } }
        });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch posts" });
    }
}

export async function getPostById(req, res) {
    try {
        const post = await prisma.post.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                author: { select: { username: true } },
                comments: true
            }
        });

        if (!post || (!post.published && req.user?.role !== 'ADMIN')) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch post' });
    }
}

export async function createPost(req, res) {
    try {
        const post = await prisma.post.create({
            data: {
                title: req.body.title,
                content: req.body.content,
                published: req.body.published,
                authorId: req.user.id
            }
        });
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create post' });
    }
}

export async function updatePost(req, res) {
    try {
        const post = await prisma.post.findUnique({
            where: { id: parseInt(req.params.id) }
        });

        if (!post) return res.status(404).json({ error: 'Post not found' });

        if (post.authorId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const updatedPost = await prisma.post.update({
            where: { id: parseInt(req.params.id) },
            data: req.body
        });
        
        res.json(updatedPost);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update post' });
    }
};

export async function deletePost(req, res) {
    try {
        const post = await prisma.post.findUnique({
            where: { id: parseInt(req.params.id) }
        });

        if (!post) return res.status(404).json({ error: 'Post not found' });

        if (post.authorId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await prisma.post.delete({ where: { id: parseInt(req.params.id) } });

        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete post' });
    }
};
