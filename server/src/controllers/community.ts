import { Request, Response } from 'express';
import Post from '../models/Post';
import { APIError } from '../middleware/error';

// Get all posts with pagination and filters
export const getPosts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, tag, sortBy = 'createdAt' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query: any = {};
    if (tag) {
      query.tags = tag;
    }

    const [posts, total] = await Promise.all([
      Post.find(query)
        .sort({ [sortBy as string]: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('userId', 'name')
        .lean(),
      Post.countDocuments(query)
    ]);

    res.json({
      data: posts,
      metadata: {
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
        totalItems: total
      }
    });
  } catch (error) {
    throw new APIError('Error fetching posts', 500);
  }
};

// Create new post
export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, tags } = req.body;
    const userId = req.user?.userId;

    const post = await Post.create({
      userId,
      title,
      content,
      tags,
      likes: [],
      comments: []
    });

    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    throw new APIError('Error creating post', 500);
  }
};

// Get single post by ID
export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id)
      .populate('userId', 'name')
      .populate('comments.userId', 'name')
      .lean();

    if (!post) {
      throw new APIError('Post not found', 404, 'POST_NOT_FOUND');
    }

    res.json(post);
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError('Error fetching post', 500);
  }
};

// Update post
export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;
    const userId = req.user?.userId;

    const post = await Post.findById(id);

    if (!post) {
      throw new APIError('Post not found', 404, 'POST_NOT_FOUND');
    }

    if (post.userId.toString() !== userId) {
      throw new APIError('Not authorized to update this post', 403, 'FORBIDDEN');
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        title,
        content,
        tags,
        updatedAt: new Date()
      },
      { new: true }
    );

    res.json({
      message: 'Post updated successfully',
      post: updatedPost
    });
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError('Error updating post', 500);
  }
};

// Delete post
export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const post = await Post.findById(id);

    if (!post) {
      throw new APIError('Post not found', 404, 'POST_NOT_FOUND');
    }

    if (post.userId.toString() !== userId) {
      throw new APIError('Not authorized to delete this post', 403, 'FORBIDDEN');
    }

    await Post.findByIdAndDelete(id);

    res.json({
      message: 'Post deleted successfully'
    });
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError('Error deleting post', 500);
  }
};

// Like/unlike post
export const likePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const post = await Post.findById(id);

    if (!post) {
      throw new APIError('Post not found', 404, 'POST_NOT_FOUND');
    }

    const userLikedIndex = post.likes.indexOf(userId);

    if (userLikedIndex > -1) {
      // Unlike post
      post.likes.splice(userLikedIndex, 1);
    } else {
      // Like post
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      message: userLikedIndex > -1 ? 'Post unliked' : 'Post liked',
      likes: post.likes.length
    });
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError('Error updating post likes', 500);
  }
};

// Get post comments
export const getPostComments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id)
      .select('comments')
      .populate('comments.userId', 'name')
      .lean();

    if (!post) {
      throw new APIError('Post not found', 404, 'POST_NOT_FOUND');
    }

    res.json(post.comments);
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError('Error fetching comments', 500);
  }
};

// Add comment to post
export const addComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user?.userId;

    const post = await Post.findById(id);

    if (!post) {
      throw new APIError('Post not found', 404, 'POST_NOT_FOUND');
    }

    const comment = {
      userId,
      content,
      createdAt: new Date()
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json({
      message: 'Comment added successfully',
      comment
    });
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError('Error adding comment', 500);
  }
};

// Delete comment
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id, commentId } = req.params;
    const userId = req.user?.userId;

    const post = await Post.findById(id);

    if (!post) {
      throw new APIError('Post not found', 404, 'POST_NOT_FOUND');
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      throw new APIError('Comment not found', 404, 'COMMENT_NOT_FOUND');
    }

    if (comment.userId.toString() !== userId) {
      throw new APIError('Not authorized to delete this comment', 403, 'FORBIDDEN');
    }

    comment.remove();
    await post.save();

    res.json({
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError('Error deleting comment', 500);
  }
};