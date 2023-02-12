// Path: index.ts
import { UserTable } from "./Tables/UserTable";
console.log("APP: Application Started");

const executor = async () => {
	const UsersList = await (await UserTable.getAll()).users;
	if (UsersList && UsersList.length === 0)
		console.log(
			"APP: Creating a new user",
			// Creating a new user
			await UserTable.create({
				email: "test@Test.com",
				password: "password",
				phoneNumber: "+977-9000000012",
			})
		);
	const UpdatedList = await (await UserTable.getAll()).users;
	console.log("APP: Users List", UpdatedList);
	if (UpdatedList && UpdatedList.length !== 0) {
		console.log(
			"APP: Updating the user",
			// Updating the user
			await UserTable.update({
				...UpdatedList[0],
				password: "p@ssw0rd",
				isSuspended: true,
			})
		);
	}
	if (UpdatedList)
		console.log(
			"APP: Selecting First User From Db",
			// Selecting the user
			await UserTable.getById(UpdatedList[0].id)
		);
	if (UpdatedList)
		console.log(
			"APP: Deleting First User From Db",
			// Deleting the user
			await UserTable.delete(UpdatedList[0])
		);
	// Getting the final list
	const FinalList = await (await UserTable.getAll(true)).users;
	console.log("APP: Final Users List", FinalList);
};

executor()
	.then()
	.catch()
	.finally(() => {
		console.log("APP: Application Ended");
	});
