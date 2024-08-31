"use server";
import db from "./db";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { profileSchema, validateWithZodSchema } from "./schemas";

// Function to check if there is a user logged in and returns the user information
const getAuthUser = async () => {
  // Checks if the user is logged in with clerkClient
  const user = await currentUser();
  // If there is no user logged in, return an error message
  if (!user) {
    throw new Error("You must be logged in to access this route");
  }
  // If there is a user logged in but there is not private metadata and does not have a profile, redirect to create a new profile and return user information object
  if (!user.privateMetadata.hasProfile) redirect("/profile/create");
  return user;
};

const renderError = (error: unknown): { message: string } => {
  console.log(error);

  return {
    message: error instanceof Error ? error.message : "An error occurred",
  };
};

export const createProfileAction = async (
  prevState: any,
  formData: FormData
) => {
  const rawData = Object.fromEntries(formData);
  const validatedFields = validateWithZodSchema(profileSchema, rawData);
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("Please login to create a profile");
    }
    await db.profile.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        profileImage: user.imageUrl ?? "",
        ...validatedFields,
      },
    });
    await clerkClient.users.updateUserMetadata(user.id, {
      privateMetadata: {
        hasProfile: true,
      },
    });
  } catch (error) {
    return;
    renderError(error);
  }
  redirect("/");
};

export const fetchProfileImage = async () => {
  const user = await currentUser();
  // check for user first, or else it will throw an error when trying to access user.id
  if (!user) return null;
  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id,
    },
    select: {
      profileImage: true,
    },
  });
  return profile?.profileImage;
};

// Function to fetch the profile of the user from the database
export const fetchProfile = async () => {
  // Function to fetch the profile of the user from the clerk
  const user = await getAuthUser();
  // Fetch the profile of the user from the database where the user id from clerk is the same as the user id from the database
  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id,
    },
  });
  if (!profile) redirect("/profile/create");
  return profile;
};

export const updateProfileAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  // Check if the user is logged in in clerk, returns user information
  const user = await getAuthUser();

  try {
    // Grab data from form
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(profileSchema, rawData);

    await db.profile.update({
      where: {
        clerkId: user.id,
      },
      // Update the profile with the validatedFields
      data: validatedFields,
    });
    // Revalidate the profile path and refresh page
    revalidatePath("/profile");
    return { message: "Profile update successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export const updateProfileImageAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  return { message: "Profile image update successfully" };
};
