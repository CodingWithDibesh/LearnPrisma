// Path: index.ts
import { AccessModifier } from "@prisma/client";
import { UserTable, ProfileTable, TweetTable } from "./Tables";
console.log("APP: Application Started");

const executor = async () => {
	//  Fetching all the users
	const UsersList = await (await UserTable.getAll()).users;
	if (UsersList && UsersList.length === 0)
		console.log(
			"APP: Creating a new user",
			// Creating a new user if nothing exists
			await UserTable.create({
				email: "test@Test.com",
				password: "password",
				phoneNumber: "+977-9000000012",
			})
		);
	//  Fetching all the users
	const UpdatedUserList = await (await UserTable.getAll()).users;
	console.log("APP: Users List", UpdatedUserList);
	if (UpdatedUserList && UpdatedUserList.length !== 0) {
		console.log(
			"APP: Updating the user",
			// Updating the user if only one exists
			await UserTable.update({
				...UpdatedUserList[0],
				password: "p@ssw0rd",
				isSuspended: true,
			})
		);
	}
	if (UpdatedUserList)
		console.log(
			"APP: Selecting First User From Db",
			// Selecting the user if the only one exists
			await UserTable.getById(UpdatedUserList[0].id)
		);

	// Fetching all the profiles
	const ProfilesList = await (await ProfileTable.getAll()).profile;
	if (ProfilesList && UpdatedUserList && ProfilesList.length === 0)
		console.log(
			"APP: Creating a new profile",
			// Creating a new profile if nothing exists
			await ProfileTable.create({
				userName: "test23",
				userId: UpdatedUserList[0].id,
			})
		);
	// Fetching all the profiles
	const UpdatedProfilesList = await (await ProfileTable.getAll()).profile;
	console.log("APP: Profiles List", UpdatedProfilesList);
	if (UpdatedProfilesList && UpdatedProfilesList.length !== 0) {
		console.log(
			"APP: Updating the profile",
			// Updating the profile if only one exists
			await ProfileTable.update({
				...UpdatedProfilesList[0],
				userName: "test24",
				isOnline: true,
				followers: BigInt(100),
			})
		);
	}
	if (UpdatedProfilesList)
		console.log(
			"APP: Selecting First Profile From Db",
			// Selecting the profile if the only one exists
			await ProfileTable.getById(UpdatedProfilesList[0].id)
		);

	// Fetching all the tweets
	const TweetsList = await (await TweetTable.getAll()).tweet;
	if (TweetsList && UpdatedProfilesList && TweetsList.length === 0)
		console.log(
			"APP: Creating a new tweet",
			// Creating a new tweet if nothing exists
			await TweetTable.create({
				description: "This is a test tweet",
				access: AccessModifier.PUBLIC,
				profileId: UpdatedProfilesList[0].id,
			})
		);
	// Fetching all the tweets
	const UpdatedTweetsList = await (await TweetTable.getAll()).tweet;
	console.log("APP: Tweets List", UpdatedTweetsList);
	if (UpdatedTweetsList && UpdatedTweetsList.length !== 0) {
		console.log(
			"APP: Updating the tweet",
			// Updating the tweet if only one exists
			await TweetTable.update({
				...UpdatedTweetsList[0],
				description: "This is a test tweet 2",
				access: AccessModifier.PRIVATE,
			})
		);
	}
	if (UpdatedTweetsList)
		console.log(
			"APP: Selecting First Tweet From Db",
			// Selecting the tweet if the only one exists
			await TweetTable.getById(UpdatedTweetsList[0].id)
		);

	// Listing Details With Linkage
	console.dirxml(
		"APP: Listing Details With Linkage",
		"Tweets:",
		await TweetTable.getAll(true),
		"Profile:",
		await ProfileTable.getAll(true),
		"User:",
		await UserTable.getAll(true)
	);

	// Deleting the data
	if (UpdatedTweetsList)
		console.log(
			"APP: Deleting First Tweet From Db",
			// Deleting the tweet if the only one exists
			await TweetTable.delete(UpdatedTweetsList[0])
		);
	if (UpdatedProfilesList)
		console.log(
			"APP: Deleting First Profile From Db",
			// Deleting the profile if the only one exists
			await ProfileTable.delete(UpdatedProfilesList[0])
		);
	if (UpdatedUserList)
		console.log(
			"APP: Deleting First User From Db",
			// Deleting the user if the only one exists
			await UserTable.delete(UpdatedUserList[0])
		);

	// Getting the final list
	const FinalTweetsList = await (await TweetTable.getAll()).tweet;
	console.log("APP: Final Tweets List", FinalTweetsList);
	// Getting the final list
	const FinalProfilesList = await (await ProfileTable.getAll()).profile;
	console.log("APP: Final Profiles List", FinalProfilesList);
	const FinalUserList = await (await UserTable.getAll(true)).users;
	console.log("APP: Final Users List", FinalUserList);
};

executor()
	.then()
	.catch()
	.finally(() => {
		console.log("APP: Application Ended");
	});
