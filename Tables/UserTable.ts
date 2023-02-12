// Path: Tables\UserTable.ts

import { PrismaClient, User, Profile } from "@prisma/client";
import { handelPrismaError } from "./PrismaError";
const prisma = new PrismaClient();

interface ICreateUser {
	email: string;
	password: string;
	phoneNumber: string;
}

export class UserTable {
	static create = async (newUser: ICreateUser) => {
		try {
			const user = await prisma.user.create({
				data: {
					...newUser,
				},
			});
			return { user };
		} catch (e: any) {
			return { error: handelPrismaError(e) };
		}
	};
	static update = async (updateUser: User) => {
		try {
			const user = await prisma.user.update({
				where: {
					id: updateUser.id,
				},
				data: {
					...updateUser,
				},
			});
			return { user };
		} catch (e: any) {
			return { error: handelPrismaError(e) };
		}
	};
	static delete = async (user: User) => {
		try {
			const deletedUser = await prisma.user.delete({
				where: {
					id: user.id,
				},
			});
			return { deletedUser };
		} catch (e: any) {
			return { error: handelPrismaError(e) };
		}
	};
	static getAll = async (includeProfile: boolean = false) => {
		try {
			const users = await prisma.user.findMany({
				include: {
					profile: includeProfile,
				},
			});
			return { users };
		} catch (e: any) {
			return { error: handelPrismaError(e) };
		}
	};
	static getById = async (id: string, includeProfile: boolean = false) => {
		try {
			const user = await prisma.user.findUnique({
				where: {
					id,
				},
				include: {
					profile: includeProfile,
				},
			});
			return { user };
		} catch (e: any) {
			return { error: handelPrismaError(e) };
		}
	};
}
