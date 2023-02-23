// Path: Tables\ProfileTable.ts

import { PrismaClient, Profile } from "@prisma/client";
import { handlePrismaError } from "./PrismaError";
const prisma = new PrismaClient();

interface ICreateProfile {
	userName: string;
	userId: string;
}

export class ProfileTable {
	static create = async (newProfile: ICreateProfile) => {
		try {
			const profile = await prisma.profile.create({
				data: {
					...newProfile,
				},
			});
			return { profile };
		} catch (e: any) {
			return { error: handlePrismaError(e) };
		}
	};
	static update = async (updateProfile: Profile) => {
		try {
			const profile = await prisma.profile.update({
				where: {
					id: updateProfile.id,
				},
				data: {
					...updateProfile,
				},
			});
			return { profile };
		} catch (e: any) {
			return { error: handlePrismaError(e) };
		}
	};
	static delete = async (profile: Profile) => {
		try {
			const deletedProfile = await prisma.profile.delete({
				where: {
					id: profile.id,
				},
			});
			return { deletedProfile };
		} catch (e: any) {
			return { error: handlePrismaError(e) };
		}
	};
	static getAll = async (includeTweets: boolean = false) => {
		try {
			const profile = await prisma.profile.findMany({
				include: {
					tweets: includeTweets,
				},
			});
			return { profile };
		} catch (e: any) {
			return { error: handlePrismaError(e) };
		}
	};
	static getById = async (id: string, includeTweets: boolean = false) => {
		try {
			const profile = await prisma.profile.findUnique({
				where: {
					id,
				},
				include: {
					tweets: includeTweets,
				},
			});
			return { profile };
		} catch (e: any) {
			return { error: handlePrismaError(e) };
		}
	};
}
