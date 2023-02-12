// Path: Tables\TweetTable.ts

import { PrismaClient, Tweet, AccessModifier } from "@prisma/client";
import { handelPrismaError } from "./PrismaError";
const prisma = new PrismaClient();

interface ICreateTweet {
	description: string;
	profileId: string;
	access: AccessModifier;
}

export class TweetTable {
	static create = async (newTweet: ICreateTweet) => {
		try {
			const tweet = await prisma.tweet.create({
				data: {
					...newTweet,
				},
			});
			return { tweet };
		} catch (e: any) {
			return { error: handelPrismaError(e) };
		}
	};
	static update = async (updateTweet: Tweet) => {
		try {
			const tweet = await prisma.tweet.update({
				where: {
					id: updateTweet.id,
				},
				data: {
					...updateTweet,
				},
			});
			return { tweet };
		} catch (e: any) {
			return { error: handelPrismaError(e) };
		}
	};
	static delete = async (tweet: Tweet) => {
		try {
			const deletedProfile = await prisma.tweet.delete({
				where: {
					id: tweet.id,
				},
			});
			return { deletedProfile };
		} catch (e: any) {
			return { error: handelPrismaError(e) };
		}
	};
	static getAll = async (includeProfile: boolean = false) => {
		try {
			const tweet = await prisma.tweet.findMany({
				include: {
					Profile: includeProfile,
				},
			});
			return { tweet };
		} catch (e: any) {
			return { error: handelPrismaError(e) };
		}
	};
	static getById = async (id: string, includeProfile: boolean = false) => {
		try {
			const tweet = await prisma.tweet.findUnique({
				where: {
					id,
				},
				include: {
					Profile: includeProfile,
				},
			});
			return { tweet };
		} catch (e: any) {
			return { error: handelPrismaError(e) };
		}
	};
}
