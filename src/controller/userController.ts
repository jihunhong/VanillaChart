import bcrypt from 'bcrypt';
import { IMGIX_URL } from '../config/variables';
import { joinArrange } from '../lib/arrange';
import { Music, Playlist, User } from "../models";

export async function signUpUser({ email, nickname, password } : { email: string, nickname: string, password: string }) {
    try{
        const hashPassword = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nickname,
            password : hashPassword,
            picture: `${IMGIX_URL}/static/example-user-avatar.png?w=256&ar=1:1&auto=format`
        })
        const user = await User.findOne({ 
            where : {
                email
            },
            attributes: {
                exclude: ['password']
            },
            include: [
                {
                    model: Playlist,
                    attributes: ['pId'],
                    as: 'playlists'
                },
                {
                    model: Music,
                    attributes: ['id'],
                    as: 'liked',
                },
                {
                    model: User,
                    attrbiutes: ['id'],
                    as: 'followings'
                },
                {
                    model: User,
                    attrbiutes: ['id'],
                    as: 'followers'
                },
            ],
        });
        return joinArrange(user);
    }catch(err){
        throw err;
    }
}