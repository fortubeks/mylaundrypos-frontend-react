import { PasswordInput } from "../../../onboarding/join";
import { Button } from "../../../utils/Button";

export default function ChangePassword({
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  rePassword,
  setRePassword,
  errors,
  updatePassword,
  loading,
}) {
  return (
    <div className="w-full p-4 md:p-8 flex flex-col gap-4 border rounded-[20px]">
      <div className="flex flex-col gap-2">
        <b className="text-lg font-semibold">Change Password</b>
        <p className="text-xs pr-14">
          Change your account password by entering your current password, then
          confirming your new password
        </p>
        {errors.length > 0 && (
          <ul className="text-red-500 -mt-2 mr-auto list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index}>Password must contain {error}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <PasswordInput
          name="Current Password"
          placeholder="Enter your password"
          value={oldPassword}
          setValue={setOldPassword}
        />
        <PasswordInput
          name="New Password"
          placeholder="Enter new password"
          value={newPassword}
          setValue={setNewPassword}
        />
        <PasswordInput
          name="Re-enter password"
          placeholder="Re-enter new password"
          value={rePassword}
          setValue={setRePassword}
        />
      </div>
      <Button
        name="Update Password"
        onClick={updatePassword}
        disabled={
          oldPassword || newPassword || rePassword || errors.length > 0
        }
        loading={loading}
      />
    </div>
  );
}
