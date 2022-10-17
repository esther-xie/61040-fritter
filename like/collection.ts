import type {HydratedDocument, Types} from 'mongoose';
import type {Freet} from '../freet/model';
import FreetModel from '../freet/model';
import UserCollection from '../user/collection';
import { Like } from './model'
import LikeModel from '../like/model';
import { likeRouter } from './router';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class LikeCollection {

  /**
   * Add a like to the freet
   *
   * @param {string} userId - The id of the freet to like
   * @param {string} freetId - The id of the freet to like
   * @return {Promise<Boolean>} - true if the freet has been liked, false otherwise
   */
  static async addLike(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<Boolean> {
    const freet = await FreetModel.findOne({_id: freetId});
    const like = new LikeModel({
        userId: userId,
        freetId: freetId
    });
    freet.likes.add(like);
    return true;
  }

  /**
   * Remove a like from the freet
   *
   * @param {string} userId
   * @param {string} freetId
   * @return {Promise<Boolean>} - true if the freet has been liked, false otherwise
   */
   static async deleteLike(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<Boolean> {
    const like = await FreetModel.deleteOne({userId: userId, freetId: freetId});
    return like !== null;
  }

   /**
   * Get all users who liked a Freet
   * 
   * @param {string} freetId
   * @return {Promise<HydratedDocument<Like>[]>}
   */
    static async findUsersWhoLiked(freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<Like>>> {
        return LikeModel.find({userId: freetId}).populate('userId');     
    }

  /**
   * Get all Freets that a user liked
   * 
   * @param {string} userId - The id of the freet to like
   * @return {Promise<HydratedDocument<Like>[]>} - An array of all of the freets
   */
  static async findLikedFreets(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Like>>> {
    return LikeModel.find({userId: userId}).populate('userId');  
  }

   /**
   * Check to see if a user liked a freet
   * 
   * @param {string} userId 
   * @param {string} freetId
   * @return {Promise<Boolean>} - true if the like has been removed, false otherwise
   */
     static async findLike(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<Boolean> {
        const freet = await FreetModel.findOne({_id: freetId});
        const like = LikeModel.findOne({userId: userId, freetId: freetId});
        return Boolean(like);
      }
    

}

export default LikeCollection;
