import { IDocument, IPartialDocument } from "../../hooks/defs";
import { IGroup } from "../../services/useGroup";
import { IHierarchy } from "../../services/useHierarchy";
import { useSelf } from "../../services/useUser";
import { IUserRole, useUserRoles } from "../../services/useUserRole";

export const getHierarchyUserRoleUsers = (
  hierarchy: IHierarchy | undefined,
  ur: Partial<IUserRole>,
): any[] => {
  if (hierarchy?.userRoleGroups?.find((urg) => urg.userRole?.id === ur.id)) {
    return (
      hierarchy?.userRoleGroups
        ?.filter((urg) => urg.userRole?.id === ur.id)
        .flatMap((urg) => (urg?.group?.members as any[]) ?? []) ?? []
    );
  } else if (hierarchy?.parent) {
    return getHierarchyUserRoleUsers(hierarchy?.parent, ur);
  } else {
    return [];
  }
};

export function useACL() {
  const { data: me } = useSelf<any>();
  const { entities: userRoles } = useUserRoles();

  const isPermitted = (
    acl: string[],
    document: IDocument | IDocument[] | undefined,
    hierarchy:
      | IHierarchy
      | { [key: string]: IHierarchy | undefined }
      | undefined,
    data?: { [key: string]: IPartialDocument | undefined },
  ) => {
    let result = false;
    acl.forEach((permission) => {
      if (permission.indexOf("group:") === 0) {
        const group = permission.split(":")[1];
        if (me?.groups?.map((g: any) => g.name).includes(group)) {
          result = true;
        }
      } else if (permission.indexOf("role:") === 0) {
        const [, role, source] = permission.split(":");
        const userRole: any =
          userRoles.data?.find(
            (ur: any) => ur?.name?.toLowerCase().includes(role.toLowerCase()),
          ) || {};

        if (
          userRole &&
          getHierarchyUserRoleUsers(
            getHierarchy(hierarchy, source),
            userRole,
          )?.some((ur) => ur.id === me?.id)
        ) {
          result = true;
        }
      } else if (permission.indexOf("doc:") === 0) {
        const name = permission.split(":")[1];
        const [section, field] = name.split(".");

        const assignee = field
          ? (data as any)?.[section]?.[field] ??
            (document as any)?.[section]?.[field] ??
            data?.[section]?.assignees?.find((a) => a.name === field)?.assignee
          : (document as any)?.assignees?.find((a: any) => a.name === section)
              ?.assignee ??
            data?.[section] ??
            (document as any)?.[name];

        if (assignee && "users" in assignee) {
          const userRoles: IUserRole[] = assignee.userRole ?? [];
          const groups: IGroup[] = assignee.groups ?? [];
          const users: any[] = assignee.users ?? [];

          if (!!users.find((u) => me?.id === u.id)) {
            result = true;
          }

          groups.forEach((group) => {
            if (!!me?.groups.map((g: any) => g.name).includes(group.id)) {
              result = true;
            }
          });

          userRoles.forEach((ur) => {
            if (
              !!getHierarchyUserRoleUsers(
                getHierarchy(hierarchy, undefined),
                ur,
              ).find((u) => me?.id === u.id)
            ) {
              result = true;
            }
          });
        } else if (assignee) {
          if (me?.id === assignee.id) {
            result = true;
          }
        }
      }
    });

    return result;
  };

  return {
    isPermitted,
  };
}

function isHierarchy(obj: any): obj is IHierarchy {
  return obj && typeof obj === "object" && "id" in obj && "scheme" in obj;
}

function isHierarchyDictionary(
  obj: any,
): obj is { [key: string]: IHierarchy | undefined } {
  return obj && typeof obj === "object" && !isHierarchy(obj);
}

function getHierarchy(
  hierarchy: IHierarchy | { [key: string]: IHierarchy | undefined } | undefined,
  source: string | undefined,
): IHierarchy | undefined {
  if (source) {
    if (isHierarchy(hierarchy)) {
      return hierarchy;
    } else if (isHierarchyDictionary(hierarchy)) {
      return hierarchy[source];
    } else {
      return undefined;
    }
  } else {
    if (isHierarchy(hierarchy)) {
      return hierarchy;
    } else if (isHierarchyDictionary(hierarchy)) {
      const keys = Object.keys(hierarchy);
      return keys.length > 0 ? hierarchy[keys[0]] : undefined;
    } else {
      return undefined;
    }
  }
}
