import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';
import LikeCollection from './collection';

/**
* Checks if a freet with freetId is req.params exists
*/
const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
const validFormat = Types.ObjectId.isValid(req.params.freetId);
const freet = validFormat ? await FreetCollection.findOne(req.params.freetId) : '';

    if (!freet) {
        res.status(404).json({
            error: {
            freetNotFound: `Freet with freet ID ${req.params.freetId} does not exist.`
            }
    });
    return;
    }
    next();
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
const isUserLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
    res.status(403).json({
        error: {
          auth: 'You must be logged in to complete this action.'
        }
    });
    return;
    } 
    next();
};

/**
 * Checks if the current user has already liked the Freet
 */
 const canLike = async (req: Request, res: Response, next: NextFunction) => {
    const userLiked = LikeCollection.findLike(req.session.userId, req.session.freetId)
    if (userLiked) {
        res.status(403).json({
            error: "User has already liked this freet."
        });
        return;
    } 
    next();
};


/**
 * Checks if the current user has already liked the Freet
 */
 const canUnlike = async (req: Request, res: Response, next: NextFunction) => {
    const userLiked = LikeCollection.findLike(req.session.userId, req.session.freetId)
    if (!userLiked) {
        res.status(403).json({
            error: "User hasn't liked this freet yet."
        });
        return;
    } 
    next();
};

export {
  isFreetExists,
  isUserLoggedIn,
  canLike,
  canUnlike
};
