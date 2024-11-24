import { Router } from 'express';
import { 
  getPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  addComment,
  deleteComment,
  getPostComments
} from '../controllers/community';
import { authenticateToken } from '../middleware/auth';
import { validatePost, validateComment } from '../middleware/validation';

const router = Router();

// Apply authentication to all community routes
router.use(authenticateToken);

// Posts routes
router.get('/', searchRateLimit, getPosts);
router.post('/', validatePost, createPost);
router.get('/:id', getPostById);
router.patch('/:id', validatePost, updatePost);
router.delete('/:id', deletePost);

// Likes
router.post('/:id/likes', likePost);

// Comments
router.get('/:id/comments', getPostComments);
router.post('/:id/comments', validateComment, addComment);
router.delete('/:id/comments/:commentId', deleteComment);

export default router;