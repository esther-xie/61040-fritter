import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Like, PopulatedLike} from './model';
import { userRouter } from 'user/router';

// Update this if you add a property to the Freet type!
type LikeResponse = {
  _id: string;
  userId: string, 
  freetId: string
};

/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Like>} like - A like
 * @returns {LikeResponse} - The like object formatted for the frontend
 */
const constructLikeResponse = (like: HydratedDocument<Like>): LikeResponse => {
  const likeCopy: PopulatedLike = {
    ...like.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  return {
    ...likeCopy,
    _id: likeCopy._id.toString(),
    freetId: likeCopy.freetId.toString(),
    userId: likeCopy.userId.toString()
  };
};

export {
  constructLikeResponse
};
