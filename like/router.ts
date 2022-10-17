import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import LikeCollection from './collection'
import * as util from '../like/util'
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as likeValidator from '../like/middleware';

const router = express.Router();

/**
 * Get all the users who liked a freet with id
 *
 * @name GET /api/likes/:id
 *
 * @return {LikeResponse[]}
 * @throws {404} - If freet does not exist
 */
router.get(
  '/:freetId?',
  [
    likeValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const likes = await LikeCollection.findUsersWhoLiked(req.params.freetId);
    const response = likes.map(util.constructLikeResponse);
    res.status(200).json(response);
  }
);

/**
 * Add a like from {user} to {freet} 
 *
 * @name POST /api/likes/:id/:user
 *
 * @return {LikeResponse} 
 * @throws {403} - If user is not logged in
 * @throws {404} - If freet does not exist
 */
 router.post(
    '/:freetId?/:userId?',
    [
      likeValidator.isFreetExists,
      likeValidator.isUserLoggedIn,
      likeValidator.canLike
    ],
    async (req: Request, res: Response) => {
        const freetId = (req.session.freetId as string) ?? '';
        const userId = (req.session.userId as string) ?? '';
        const like = await LikeCollection.addLike(userId, freetId);
        if (like) {
            res.status(201).json({
                message: 'User successfully liked this freet.'
            });
        } 
    }
);

/**
 * Remove a like from {user} from {freet} 
 *
 * @name DELETE /api/likes/:id/:user
 *
 * @return {LikeResponse} 
 * @throws {403} - If user is not logged in
 * @throws {404} - If freet does not exist
 */
 router.delete(
    '/:freetId?/:userId?',
    [
      likeValidator.isFreetExists,
      likeValidator.isUserLoggedIn,
      likeValidator.canUnlike
    ],
    async (req: Request, res: Response) => {
        const freetId = (req.session.freetId as string) ?? '';
        const userId = (req.session.userId as string) ?? '';
        const like = await LikeCollection.deleteLike(userId, freetId);
        if (like) {
            res.status(201).json({
                message: 'User successfully unliked this freet.'
            });
        }
    }
);



export {router as likeRouter};
