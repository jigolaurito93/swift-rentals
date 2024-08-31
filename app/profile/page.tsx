import SubmitButton from "@/components/form/Buttons";
import FormContainer from "@/components/form/FormContainer";
import FormInput from "@/components/form/FormInput";
import ImageInputContainer from "@/components/form/ImageInputContainer";
import {
  fetchProfile,
  updateProfileAction,
  updateProfileImageAction,
} from "@/utils/actions";
import React from "react";

const ProfilePage = async () => {
  // Returns the profile of the user if the user is logged in in clerk and if the clerk user id is the same as the db user id
  const profile = await fetchProfile();
  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">
        Welcome {profile.firstName}!
      </h1>
      <div className="border p-8 rounded-md max-w-lg">
        <ImageInputContainer
          image={profile.profileImage}
          action={updateProfileImageAction}
          name={profile.username}
          text="Update Profile Image"
        />
        <FormContainer action={updateProfileAction}>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <FormInput
              name="firstName"
              label="First Name"
              type="text"
              defaultValue={profile.firstName}
            />
            <FormInput
              name="lastName"
              label="Last Name"
              type="text"
              defaultValue={profile.lastName}
            />
            <FormInput
              name="username"
              label="Username"
              type="text"
              defaultValue={profile.username}
            />
          </div>
          <SubmitButton text="Update Profile" className="mt-8" />
        </FormContainer>
      </div>
    </section>
  );
};

export default ProfilePage;
