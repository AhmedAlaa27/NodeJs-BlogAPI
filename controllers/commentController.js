import prisma from "../prisma/prismaClient.js";

export async function getComments(req, res) {
    try {
        const comments = await prisma.comment.findMany({
            where: { postId: parseInt(req.params.postId) },
            include: { author: { select: { username: true } } }
        });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
};

export async function createComment(req, res) {
    try {
        const comment = await prisma.comment.create({
            data: {
                content: req.body.content,
                postId: parseInt(req.params.postId),
                authorId: req.user?.id
            }
        });
        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create comment' });
    }
};

export async function deleteComment(req, res) {
    try {
        const comment = await prisma.comment.findUnique({
            where: { id: parseInt(req.params.id) }
        });

        if (!comment) return res.status(404).json({ error: 'Comment not found' });

        if (comment.authorId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await prisma.comment.delete({ where: { id: parseInt(req.params.id) } });

        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete comment' });
    }
};
