import { CartItem, UserProfile } from '@gen3/core';
import {  MMRFFile } from "@/core/features/files/filesSlice";
import { get, intersection } from "lodash";

export const isUserProject = ({
  file,
  user,
}: {
  file: MMRFFile | CartItem;
  user: Partial<UserProfile>;
}): boolean => {
  if (!user) {
    return false;
  }
  const projectIds = Array.from(
    new Set([
      file.project_id,
      ...((file as MMRFFile)?.cases || []).map((e: any) => e.project.project_id),
    ]),
  );

  const gdcIds = Object.keys(get(user, "projects.gdc_ids", {}));
  return intersection(projectIds, gdcIds).length !== 0;
};

export const intersectsWithFileAcl = ({
  file,
  user,
}: {
  file: MMRFFile | CartItem;
  user: Partial<UserProfile>;
}): boolean => {
  // if access is not controlled, return false
  if (user.project_access) {
    return (
      intersection(
        Object.keys(get(user, 'projects.project_access', {})).filter(
          (p) => user.project_access?.phs_ids[0].indexOf('_member_') !== -1, // TODO: need to fix this with Gen3 authz
        ) || [],
        file.acl,
      ).length !== 0
    );
  }
  return false;
}



export const userCanDownloadFiles = ({
  files,
  user,
}: {
  files: MMRFFile[] | CartItem[];
  user: Partial<UserProfile>;
}): boolean =>
  files.every((file) => {
    if (file.access === "open") {
      return true;
    }

    if (file.access === "controlled" && !user) {
      return false;
    }

    if (
      isUserProject({
        file,
        user,
      }) ||
      intersectsWithFileAcl({
        file,
        user,
      })
    ) {
      return true;
    }

    return false;
  });

export const userCanDownloadFile = ({
  file,
  user,
}: {
  user: Partial<UserProfile>;
  file: MMRFFile | CartItem;
}): boolean =>
  userCanDownloadFiles({
    files: [file] as MMRFFile[],
    user,
  });
