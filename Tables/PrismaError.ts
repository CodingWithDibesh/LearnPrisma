// Path: Tables\PrismaError.ts

import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

export const handelPrismaError = (
	error: PrismaClientKnownRequestError
): string => {
	switch (error.code) {
		case "P2000":
			return `The ${error.meta?.column_name} is too long. `;
		case "P2001":
			return `No records found for the ${error.meta?.target}`;
		case "P2002":
			return `Unique constraint failed on the ${error.meta?.target}`;
		case "P2003":
			return `Foreign key constraint failed on the ${error.meta?.target}`;
		case "P2004":
			return `The ${error.meta?.target} already exists`;
		default:
			return "Something went wrong";
	}
};
